import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as FileSystem from "expo-file-system";
import { eventMatches, eventMatchTeams, matchScouting } from "./schema";
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

export async function getMatches() {
  interface Match {
    matchKey: string;
    matchType: string;
    setNumber: number;
    matchNumber: number;
    predictedTime: string | null;
    blueTeams: Record<number, MatchTeam>;
    redTeams: Record<number, MatchTeam>;
  }

  interface MatchTeam {
    sessionKey: string;
    teamKey: string;
    teamNumber: string;
    matchScouted: boolean;
  }

  // Get the denormalized data.
  const results = await db
    .select({
      matchKey: eventMatches.id,
      matchType: eventMatches.matchType,
      setNumber: eventMatches.setNumber,
      matchNumber: eventMatches.matchNumber,
      predictedTime: eventMatches.predictedTime,
      sessionKey: eventMatchTeams.id,
      alliance: eventMatchTeams.alliance,
      allianceTeam: eventMatchTeams.allianceTeam,
      teamKey: eventMatchTeams.teamKey,
      matchScouted: matchScouting.id,
    })
    .from(eventMatches)
    .leftJoin(eventMatchTeams, eq(eventMatches.id, eventMatchTeams.matchKey))
    .leftJoin(matchScouting, eq(eventMatchTeams.id, matchScouting.id));

  // Group TableB records under each TableA record
  const groupedResult = results.reduce<Record<string, Match>>((acc, row) => {
    const { matchKey, matchType, setNumber, matchNumber, predictedTime } = row;
    const { sessionKey, alliance, allianceTeam, teamKey, matchScouted } = row;

    // Create the parent Match if it does not exist.
    if (!acc[matchKey]) {
      acc[matchKey] = {
        matchKey,
        matchType,
        setNumber,
        matchNumber,
        predictedTime,
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
        matchScouted: !!matchScouted,
      };
    }

    if (sessionKey && alliance === "Red" && allianceTeam && teamKey) {
      acc[matchKey].redTeams[allianceTeam] = {
        sessionKey: sessionKey,
        teamKey: teamKey,
        teamNumber: teamKey.replace("frc", ""),
        matchScouted: !!matchScouted,
      };
    }

    return acc;
  }, {});

  console.log(JSON.stringify(groupedResult, null, 2));
}
