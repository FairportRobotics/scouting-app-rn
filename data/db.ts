import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as FileSystem from "expo-file-system";
import {
  events,
  matches,
  matchTeams,
  teams,
  matchScoutingSessions,
  matchScoutingUploads,
  teamMembers,
  Team,
  TeamMember,
  MatchTeam,
  MatchScoutingSession,
  Match,
  levity,
  pitScoutingSessions,
  pitScoutingUploads,
  PitScoutingSession,
} from "./schema";
import { eq } from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";

export const connection = openDatabaseSync("scouting-app.db");
export const db = drizzle(connection);

export interface MatchSelectModel {
  eventKey: string;
  matchKey: string;
  matchType: string;
  setNumber: number;
  matchNumber: number;
  predictedTime: Date;
  blueTeams: Record<number, MatchSelectTeamModel>;
  redTeams: Record<number, MatchSelectTeamModel>;
}

export interface MatchSelectTeamModel {
  sessionKey: string;
  teamKey: string;
  teamNumber: string;
  scouted: boolean;
  uploaded: boolean;
}

export type MatchScoutingSessionModel = Match &
  MatchTeam &
  MatchScoutingSession;

export type MatchResultModel = {
  sessionKey: string;
  matchNumber: number;
  alliance: string;
  allianceTeam: number;
  scoutedTeamNumber: string;
  scoutedTeamNickname: string;
  uploadExists: boolean;
};

export interface TeamPitSelectModel {
  teamKey: string;
  teamNumber: string;
  nickname: string;
  schoolName: string;
  scouted: boolean;
  uploaded: boolean;
}

export type PitScoutingSessionModel = Match & Team & PitScoutingSession;

export function initializeDb() {
  try {
    // console.log(
    //   `${FileSystem.documentDirectory}/SQLite/${connection.databaseName}`
    // );

    const { success, error } = useMigrations(db, migrations);

    if (success) {
      return;
    }

    if (error) {
      console.error("Migrations were not successful", error);
      return;
    }
  } catch (error) {
    console.error("Migrations exception", error);
  }
}

export async function getMatchesForSelection(): Promise<MatchSelectModel[]> {
  // Get the denormalized data.
  const results = await db
    .select({
      eventKey: matches.eventKey,
      matchKey: matches.id,
      matchType: matches.matchType,
      setNumber: matches.setNumber,
      matchNumber: matches.matchNumber,
      predictedTime: matches.predictedTime,
      sessionKey: matchTeams.id,
      alliance: matchTeams.alliance,
      allianceTeam: matchTeams.allianceTeam,
      teamKey: matchTeams.teamKey,
      scouted:
        sql`CASE WHEN ${matchScoutingSessions.id} IS NULL THEN false ELSE true END`.as(
          "scouted"
        ),
      uploaded:
        sql`CASE WHEN ${matchScoutingUploads.id} IS NULL THEN false ELSE true END`.as(
          "uploaded"
        ),
    })
    .from(matches)
    .leftJoin(matchTeams, eq(matches.id, matchTeams.matchKey))
    .leftJoin(
      matchScoutingSessions,
      eq(matchTeams.id, matchScoutingSessions.id)
    )
    .leftJoin(matchScoutingUploads, eq(matchTeams.id, matchScoutingUploads.id));

  // Group MatchModel and add MatchTeamModels as children.
  const groupedResult = results.reduce<Record<string, MatchSelectModel>>(
    (acc, row) => {
      const {
        eventKey,
        matchKey,
        matchType,
        setNumber,
        matchNumber,
        predictedTime,
      } = row;
      const { sessionKey, alliance, allianceTeam, teamKey, scouted, uploaded } =
        row;

      // Create the parent Match if it does not exist.
      if (!acc[matchKey]) {
        acc[matchKey] = {
          eventKey,
          matchKey,
          matchType,
          setNumber,
          matchNumber,
          predictedTime: predictedTime ? new Date(predictedTime) : new Date(),
          blueTeams: {},
          redTeams: {},
        };
      }

      // Session key exists and we don't have bad data.
      if (sessionKey && alliance === "Blue" && allianceTeam && teamKey) {
        acc[matchKey].blueTeams[allianceTeam] = {
          sessionKey: sessionKey,
          teamKey: teamKey,
          teamNumber: teamKey.replace("frc", ""),
          scouted: !!scouted,
          uploaded: !!uploaded,
        };
      }

      if (sessionKey && alliance === "Red" && allianceTeam && teamKey) {
        acc[matchKey].redTeams[allianceTeam] = {
          sessionKey: sessionKey,
          teamKey: teamKey,
          teamNumber: teamKey.replace("frc", ""),
          scouted: !!scouted,
          uploaded: !!uploaded,
        };
      }

      return acc;
    },
    {}
  );

  // Convert the Records to an array and sort.
  const arrayResult = Object.values(groupedResult);
  arrayResult.sort((a, b) => {
    return a.predictedTime.getTime() - b.predictedTime.getTime();
  });

  return arrayResult;
}

export async function getTeams(): Promise<Team[]> {
  try {
    return await db.select().from(teams);
  } catch (error) {
    return [];
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await db.select().from(teamMembers);
  } catch (error) {
    return [];
  }
}

export async function getMatchTeam(
  sessionKey: string
): Promise<MatchTeam | null> {
  const matchTeam = await db
    .select()
    .from(matchTeams)
    .where(eq(matchTeams.id, sessionKey));

  if (matchTeam.length !== 1) return null;

  return matchTeam[0];
}

export async function getMatchScoutingSessionForEdit(
  sessionKey: string
): Promise<MatchScoutingSessionModel | null> {
  // Load all the different tables in a single query
  const results = await db
    .select()
    .from(matchScoutingSessions)
    .where(eq(matchScoutingSessions.id, sessionKey))
    .innerJoin(matchTeams, eq(matchScoutingSessions.id, matchTeams.id))
    .innerJoin(matches, eq(matches.id, matchTeams.matchKey))
    .limit(1);

  // Validate the results.
  if (results.length !== 1) return null;

  // Combine them with the spread operator.
  return {
    ...results[0].event_match,
    ...results[0].event_match_team,
    ...results[0].match_scouting_session,
  } as MatchScoutingSessionModel;
}

export async function initMatchScoutingSession(sessionKey: string) {
  try {
    // Determine if there is already an existing Match Scouting Session.
    const existingSession = await getMatchScoutingSessionForEdit(sessionKey);
    if (existingSession) return;

    // Extract the match and initialize the match scouting session.
    const matchTeam = await getMatchTeam(sessionKey);
    if (!matchTeam) return null;

    await db.insert(matchScoutingSessions).values({
      id: sessionKey,

      scheduledTeamKey: matchTeam.teamKey,
      scoutedTeamKey: matchTeam.teamKey,
      scouterName: "",

      autoStartedWithNote: false,
      autoLeftStartArea: false,
      autoSpeakerScore: 0,
      autoSpeakerMiss: 0,
      autoAmpScore: 0,
      autoAmpMiss: 0,
      autoNotes: "",

      teleopSpeakerScore: 0,
      teleopSpeakerScoreAmplified: 0,
      teleopSpeakerMiss: 0,
      teleopAmpScore: 0,
      teleopAmpMiss: 0,
      teleopRelayPass: 0,
      teleopNotes: "",

      endgameTrapScore: "",
      endgameMicrophoneScore: "",
      endgameDidRobotPark: false,
      endgameDidRobotHang: false,
      endgameHarmony: "",
      endgameNotes: "",

      finalAllianceScore: 0,
      finalRankingPoints: 0,
      finalAllianceResult: "",
      finalViolations: "",
      finalPenalties: 0,
      finalNotes: "",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function saveMatchSessionConfirm(session: MatchScoutingSession) {
  try {
    await db
      .update(matchScoutingSessions)
      .set({
        scouterName: session.scouterName,
        scoutedTeamKey: session.scoutedTeamKey,
      })
      .where(eq(matchScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}

export async function saveMatchSessionAuto(session: MatchScoutingSession) {
  try {
    await db
      .update(matchScoutingSessions)
      .set({
        autoStartedWithNote: session.autoStartedWithNote,
        autoLeftStartArea: session.autoLeftStartArea,
        autoSpeakerScore: session.autoSpeakerScore,
        autoSpeakerMiss: session.autoSpeakerMiss,
        autoAmpScore: session.autoAmpScore,
        autoAmpMiss: session.autoAmpMiss,
        autoNotes: session.autoNotes,
      })
      .where(eq(matchScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}

export async function saveMatchSessionTeleop(session: MatchScoutingSession) {
  try {
    await db
      .update(matchScoutingSessions)
      .set({
        teleopSpeakerScore: session.teleopSpeakerScore,
        teleopSpeakerScoreAmplified: session.teleopSpeakerScoreAmplified,
        teleopSpeakerMiss: session.teleopSpeakerMiss,
        teleopAmpScore: session.teleopAmpScore,
        teleopAmpMiss: session.teleopAmpMiss,
        teleopRelayPass: session.teleopRelayPass,
        teleopNotes: session.teleopNotes,
      })
      .where(eq(matchScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}

export async function saveMatchSessionEndgame(session: MatchScoutingSession) {
  try {
    await db
      .update(matchScoutingSessions)
      .set({
        endgameTrapScore: session.endgameTrapScore,
        endgameMicrophoneScore: session.endgameMicrophoneScore,
        endgameDidRobotPark: session.endgameDidRobotPark,
        endgameDidRobotHang: session.endgameDidRobotHang,
        endgameHarmony: session.endgameHarmony,
        endgameNotes: session.endgameNotes,
      })
      .where(eq(matchScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}

export async function saveMatchSessionFinal(session: MatchScoutingSession) {
  try {
    await db
      .update(matchScoutingSessions)
      .set({
        finalAllianceScore: session.finalAllianceScore,
        finalRankingPoints: session.finalRankingPoints,
        finalAllianceResult: session.finalAllianceResult,
        finalViolations: session.finalViolations,
        finalPenalties: session.finalPenalties,
        finalNotes: session.finalNotes,
      })
      .where(eq(matchScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}

export async function getRandomJoke(): Promise<string> {
  try {
    const jokes = await db.select().from(levity);
    return jokes[Math.floor(Math.random() * jokes.length)].item;
  } catch (error) {
    return "Sorry. No joke for you.";
  }
}

export async function getMatchScoutingResults(): Promise<MatchResultModel[]> {
  try {
    // Load all the different tables in a single query
    const results = await db
      .select({
        sessionKey: matchScoutingSessions.id,
        matchNumber: matches.matchNumber,
        alliance: matchTeams.alliance,
        allianceTeam: matchTeams.allianceTeam,
        scoutedTeamNumber: teams.number,
        scoutedTeamNickname: teams.nickname,
        uploadExists:
          sql`CASE WHEN ${matchScoutingUploads.id} IS NULL THEN false ELSE true END`.as(
            "uploadExists"
          ),
      })
      .from(matchScoutingSessions)
      .innerJoin(matchTeams, eq(matchScoutingSessions.id, matchTeams.id))
      .innerJoin(matches, eq(matchTeams.matchKey, matches.id))
      .innerJoin(events, eq(matches.eventKey, events.id))
      .innerJoin(teams, eq(matchScoutingSessions.scoutedTeamKey, teams.id))
      .leftJoin(
        matchScoutingUploads,
        eq(matchScoutingSessions.id, matchScoutingUploads.id)
      );

    return results as MatchResultModel[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPitScoutingResults(): Promise<TeamPitSelectModel[]> {
  try {
    const results = await db
      .select({
        teamKey: teams.id,
        teamNumber: teams.number,
        nickname: teams.nickname,
        schoolName: teams.schoolName,
        scouted:
          sql`CASE WHEN ${pitScoutingSessions.id} IS NULL THEN false ELSE true END`.as(
            "scouted"
          ),
        uploaded:
          sql`CASE WHEN ${pitScoutingUploads.id} IS NULL THEN false ELSE true END`.as(
            "uploaded"
          ),
      })
      .from(teams)
      .leftJoin(pitScoutingSessions, eq(teams.id, pitScoutingSessions.id))
      .leftJoin(pitScoutingUploads, eq(teams.id, pitScoutingUploads.id));

    return results as TeamPitSelectModel[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function initPitScoutingSession(teamKey: string) {
  try {
    // Determine if there is already an existing Match Scouting Session.
    const existingSession = await getPitScoutingSessionForEdit(teamKey);
    if (existingSession) return;

    // Extract the match and initialize the match scouting session.
    await db.insert(pitScoutingSessions).values({
      id: teamKey,
      driveTeamExperience: "",
      numberOfAutoMethods: "",
      canPickUpFromGround: "",
      canReceiveFromSourceChute: "",
      canScoreInAmp: "",
      canScoreInSpeaker: "",
      canScoreInTrap: "",
      whereCanYouScoreInSpeaker: "",
      canFitUnderStage: "",
      canGetOnstage: "",
      robotWidth: "",
      onstagePosition: "",
      notes: "",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getPitScoutingSessionForEdit(
  sessionKey: string
): Promise<PitScoutingSessionModel | null> {
  try {
    // Load all the different tables in a single query
    const results = await db
      .select()
      .from(pitScoutingSessions)
      .where(eq(pitScoutingSessions.id, sessionKey))
      .innerJoin(teams, eq(pitScoutingSessions.id, teams.id))
      .limit(1);

    // Validate the results.
    if (results.length !== 1) return null;

    // Combine them with the spread operator.
    return {
      ...results[0].event_team,
      ...results[0].pit_scouting_session,
    } as PitScoutingSessionModel;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function savePitSession(session: PitScoutingSession) {
  try {
    await db
      .update(pitScoutingSessions)
      .set({
        ...session,
      })
      .where(eq(pitScoutingSessions.id, session.id));
  } catch (error) {
    console.error(error);
  }
}
