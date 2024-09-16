import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as FileSystem from "expo-file-system";
import {
  eventMatches,
  eventMatchTeams,
  matchScouting,
  matchScoutingUploads,
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

export async function getMatchScouting() {
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
      scouted: matchScouting.id,
      uploaded: matchScoutingUploads.id,
    })
    .from(eventMatches)
    .leftJoin(eventMatchTeams, eq(eventMatches.id, eventMatchTeams.matchKey))
    .leftJoin(matchScouting, eq(eventMatchTeams.id, matchScouting.id))
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
