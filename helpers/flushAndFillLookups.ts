import { db } from "@/data/db";
import {
  events,
  eventMatches,
  eventTeams,
  Event,
  Match,
  Team,
  levity,
  Levity,
  eventMatchTeams,
  MatchTeam,
  MatchScout,
  matchScouting,
} from "@/data/schema";
import fetchFromCosmos from "@/helpers/fetchFromCosmos";

export default async () => {
  // Retrieve the URL and key from env.
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;

  // Clear all existing data.
  await db.delete(eventMatchTeams);
  await db.delete(eventTeams);
  await db.delete(eventMatches);
  await db.delete(events);
  await db.delete(levity);

  // Fill caches.
  await refreshEvents(masterKey, account);
  await refreshMatches(masterKey, account);
  await refreshTeams(masterKey, account);
  await refreshMatchTeams(masterKey, account);
  await refreshLevity(masterKey, account);

  await refreshMatchScouting(masterKey, account);
};

async function refreshEvents(masterKey: string, account: string) {
  // Cache Event(s) from Cosmos.
  try {
    console.log("Events: Retrieve from Cosmos and cache...");
    const results = await fetchFromCosmos<Event>(
      masterKey,
      account,
      "crescendo",
      "event"
    );

    if (results === undefined) return;

    results.forEach(async (event) => {
      try {
        await db
          .insert(events)
          .values({
            id: event.id,
            name: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
          })
          .onConflictDoUpdate({
            target: events.id,
            set: {
              name: event.name,
              startDate: event.startDate,
              endDate: event.endDate,
            },
          });
      } catch (error) {
        console.error("Error saving Event:", event);
        console.error(error);
      }
    });
  } catch (error) {
    console.warn("Error saving Event:"), error;
  }
}

async function refreshMatches(masterKey: string, account: string) {
  // Cache Matches from Cosmos.
  try {
    console.log("Matches: Retrieve from Cosmos and cache...");
    const results = await fetchFromCosmos<Match>(
      masterKey,
      account,
      "crescendo",
      "event_match"
    );

    if (results === undefined) return;

    results.forEach(async (match) => {
      try {
        await db
          .insert(eventMatches)
          .values({
            id: match.id,
            eventKey: match.eventKey,
            matchType: match.matchType,
            matchNumber: match.matchNumber,
            setNumber: match.setNumber,
            predictedTime: match.predictedTime,
          })
          .onConflictDoUpdate({
            target: eventMatches.id,
            set: {
              eventKey: match.eventKey,
              matchType: match.matchType,
              matchNumber: match.matchNumber,
              setNumber: match.setNumber,
              predictedTime: match.predictedTime,
            },
          });
      } catch (error) {
        console.error("Error saving Match:", match);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Matches:", error);
  }
}

async function refreshTeams(masterKey: string, account: string) {
  // Cache Teams from Cosmos.
  try {
    console.log("Teams: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<Team>(
      masterKey,
      account,
      "crescendo",
      "event_team"
    );

    if (results === undefined) return;

    results.forEach(async (team) => {
      try {
        await db
          .insert(eventTeams)
          .values({
            id: team.id,
            number: team.number,
            nickname: team.nickname ?? "(Team nickname not known)",
            schoolName: team.schoolName ?? "(Team school not known)",
          })
          .onConflictDoUpdate({
            target: eventTeams.id,
            set: {
              number: team.number,
              nickname: team.nickname ?? "(Team nickname not known)",
              schoolName: team.schoolName ?? "(Team school not known)",
            },
          });
      } catch (error) {
        console.error("Error saving Team:", team);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Teams:", error);
  }
}

async function refreshMatchTeams(masterKey: string, account: string) {
  // Cache MatchTeams from Cosmos.
  try {
    console.log("Match Teams: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<MatchTeam>(
      masterKey,
      account,
      "crescendo",
      "event_match_team"
    );

    if (results === undefined) return;

    results.forEach(async (matchTeam) => {
      try {
        await db
          .insert(eventMatchTeams)
          .values({
            id: matchTeam.id,
            eventKey: matchTeam.eventKey,
            matchKey: matchTeam.matchKey,
            alliance: matchTeam.alliance,
            allianceTeam: matchTeam.allianceTeam,
            teamKey: matchTeam.teamKey,
          })
          .onConflictDoUpdate({
            target: eventMatchTeams.id,
            set: {
              eventKey: matchTeam.eventKey,
              matchKey: matchTeam.matchKey,
              alliance: matchTeam.alliance,
              allianceTeam: matchTeam.allianceTeam,
              teamKey: matchTeam.teamKey,
            },
          });
      } catch (error) {
        console.error("Error saving MatchTeam:", eventMatchTeams);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving MatchTeams:", error);
  }
}

async function refreshLevity(masterKey: string, account: string) {
  // Cache MatchTeams from Cosmos.
  try {
    console.log("Levity: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<Levity>(
      masterKey,
      account,
      "crescendo",
      "event_levity"
    );

    if (results === undefined) return;

    results.forEach(async (l) => {
      try {
        await db.insert(levity).values({
          item: l.item,
        });
      } catch (error) {
        console.error("Error saving Levity:", eventMatchTeams);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Levity:", error);
  }
}

async function refreshMatchScouting(masterKey: string, account: string) {
  // Cache Scouted Matches from Cosmos.
  try {
    console.log("Scouted Matches: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<MatchScout>(
      masterKey,
      account,
      "crescendo",
      "match"
    );

    if (results === undefined) return;

    results.forEach(async (session) => {
      if (!session.id) return;

      try {
        await db
          .insert(matchScouting)
          .values({
            id: session.id,
            eventKey: session.eventKey,
            matchKey: session.matchKey,
            scheduledTeamKey: session.scheduledTeamKey,
            scoutedTeamKey: session.scheduledTeamKey,
            scouterName: session.scouterName,

            autoStartedWithNote: session.autoStartedWithNote ?? false,
            autoLeftStartArea: session.autoLeftStartArea ?? false,
            autoSpeakerScore: session.autoSpeakerScore ?? 0,
            autoSpeakerMiss: session.autoSpeakerMiss ?? 0,
            autoAmpScore: session.autoAmpScore ?? 0,
            autoAmpMiss: session.autoAmpMiss ?? 0,
            autoNotes: session.autoNotes ?? "",

            teleopSpeakerScore: session.teleopSpeakerScore ?? 0,
            teleopSpeakerScoreAmplified:
              session.teleopSpeakerScoreAmplified ?? 0,
            teleopSpeakerMiss: session.teleopSpeakerMiss ?? 0,
            teleopAmpScore: session.teleopAmpScore ?? 0,
            teleopAmpMiss: session.teleopAmpMiss ?? 0,
            teleopRelayPass: session.teleopRelayPass ?? 0,
            teleopNotes: session.teleopNotes ?? "",

            endgameTrapScore: session.endgameTrapScore ?? 0,
            endgameMicrophoneScore: session.endgameMicrophoneScore ?? 0,
            endgameDidRobotPark: session.endgameDidRobotPark ?? false,
            endgameDidRobotHang: session.endgameDidRobotHang ?? false,
            endgameHarmony: session.endgameHarmony ?? "",
            endgameNotes: session.endgameNotes ?? "",

            finalAllianceScore: session.finalAllianceScore ?? 0,
            finalRankingPoints: session.finalRankingPoints ?? 0,
            finalAllianceResult: session.finalAllianceResult ?? "",
            finalViolations: session.finalViolations ?? "",
            finalPenalties: session.finalPenalties ?? 0,
            finalNotes: session.finalNotes ?? "",
          })
          .onConflictDoUpdate({
            target: matchScouting.id,
            set: {
              eventKey: session.eventKey,
              matchKey: session.matchKey,
              scheduledTeamKey: session.scheduledTeamKey,
              scoutedTeamKey: session.scheduledTeamKey,
              scouterName: session.scouterName,

              autoStartedWithNote: session.autoStartedWithNote ?? false,
              autoLeftStartArea: session.autoLeftStartArea ?? false,
              autoSpeakerScore: session.autoSpeakerScore ?? 0,
              autoSpeakerMiss: session.autoSpeakerMiss ?? 0,
              autoAmpScore: session.autoAmpScore ?? 0,
              autoAmpMiss: session.autoAmpMiss ?? 0,
              autoNotes: session.autoNotes ?? "",

              teleopSpeakerScore: session.teleopSpeakerScore ?? 0,
              teleopSpeakerScoreAmplified:
                session.teleopSpeakerScoreAmplified ?? 0,
              teleopSpeakerMiss: session.teleopSpeakerMiss ?? 0,
              teleopAmpScore: session.teleopAmpScore ?? 0,
              teleopAmpMiss: session.teleopAmpMiss ?? 0,
              teleopRelayPass: session.teleopRelayPass ?? 0,
              teleopNotes: session.teleopNotes ?? "",

              endgameTrapScore: session.endgameTrapScore ?? 0,
              endgameMicrophoneScore: session.endgameMicrophoneScore ?? 0,
              endgameDidRobotPark: session.endgameDidRobotPark ?? false,
              endgameDidRobotHang: session.endgameDidRobotHang ?? false,
              endgameHarmony: session.endgameHarmony ?? "",
              endgameNotes: session.endgameNotes ?? "",

              finalAllianceScore: session.finalAllianceScore ?? 0,
              finalRankingPoints: session.finalRankingPoints ?? 0,
              finalAllianceResult: session.finalAllianceResult ?? "",
              finalViolations: session.finalViolations ?? "",
              finalPenalties: session.finalPenalties ?? 0,
              finalNotes: session.finalNotes ?? "",
            },
          });
      } catch (error) {
        console.error("Error saving Match Scouting Session:", session);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Match Scouting Sessions:", error);
  }
}
