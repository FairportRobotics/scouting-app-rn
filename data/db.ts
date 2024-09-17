import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as FileSystem from "expo-file-system";
import {
  eventMatches,
  eventMatchTeams,
  eventTeams,
  matchScoutingSessions,
  matchScoutingUploads,
  teamMembers,
  Team,
  TeamMember,
  MatchTeam,
  MatchScoutingSession,
  Match,
} from "./schema";
import { eq } from "drizzle-orm/expressions";

export const connection = openDatabaseSync("scouting-app.db");
export const db = drizzle(connection);

export function initializeDb() {
  try {
    console.log(
      `${FileSystem.documentDirectory}/SQLite/${connection.databaseName}`
    );

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

export interface MatchModel {
  eventKey: string;
  matchKey: string;
  matchType: string;
  setNumber: number;
  matchNumber: number;
  predictedTime: Date;
  blueTeams: Record<number, MatchTeamModel>;
  redTeams: Record<number, MatchTeamModel>;
}

export interface MatchTeamModel {
  sessionKey: string;
  teamKey: string;
  teamNumber: string;
  scouted: boolean;
  uploaded: boolean;
}

export type MatchScoutingSessionModel = Match &
  MatchTeam &
  MatchScoutingSession;

export async function getMatchesForSelection(): Promise<MatchModel[]> {
  // Get the denormalized data.
  const results = await db
    .select({
      eventKey: eventMatches.eventKey,
      matchKey: eventMatches.id,
      matchType: eventMatches.matchType,
      setNumber: eventMatches.setNumber,
      matchNumber: eventMatches.matchNumber,
      predictedTime: eventMatches.predictedTime,
      sessionKey: eventMatchTeams.id,
      alliance: eventMatchTeams.alliance,
      allianceTeam: eventMatchTeams.allianceTeam,
      teamKey: eventMatchTeams.teamKey,
      scouted: matchScoutingSessions.id,
      uploaded: matchScoutingUploads.id,
    })
    .from(eventMatches)
    .leftJoin(eventMatchTeams, eq(eventMatches.id, eventMatchTeams.matchKey))
    .leftJoin(
      matchScoutingSessions,
      eq(eventMatchTeams.id, matchScoutingSessions.id)
    )
    .leftJoin(
      matchScoutingUploads,
      eq(eventMatchTeams.id, matchScoutingUploads.id)
    );

  // Group MatchModel and add MatchTeamModels as children.
  const groupedResult = results.reduce<Record<string, MatchModel>>(
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
    return await db.select().from(eventTeams);
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
    .from(eventMatchTeams)
    .where(eq(eventMatchTeams.id, sessionKey));

  if (matchTeam.length !== 1) return null;

  return matchTeam[0];
}

export async function getMatchScoutingSessionForEdit(
  sessionKey: string
): Promise<MatchScoutingSessionModel | null> {
  const matchTeams = await db
    .select()
    .from(eventMatchTeams)
    .where(eq(eventMatchTeams.id, sessionKey));

  const matchSessions = await db
    .select()
    .from(matchScoutingSessions)
    .where(eq(matchScoutingSessions.id, sessionKey));

  if (matchTeams.length !== 1) return null;
  if (matchSessions.length !== 1) return null;

  const session = matchSessions[0];
  const matchTeam = matchTeams[0];

  const matches = await db
    .select()
    .from(eventMatches)
    .where(eq(eventMatches.id, matchTeam.matchKey));

  if (matches.length !== 1) return null;

  const match = matches[0];

  return {
    ...session,
    ...matchTeam,
    ...match,
  } as MatchScoutingSessionModel;
}

export async function initMatchScoutingSession(sessionKey: string) {
  try {
    // Determine if there is already an existing Match Scouting Session.
    const existingSession = await getMatchScoutingSessionForEdit(sessionKey);
    if (existingSession) return;

    // Exract the match and initialize the match scouting session.
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
