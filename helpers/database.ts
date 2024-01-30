import type { Event, Match, Team } from "@/helpers/types";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("scouting-app.db");

export function initializeDatabase() {
  db.transaction((tx) => {
    // Drop existing tables.
    // tx.executeSql("DROP TABLE IF EXISTS event");
    // tx.executeSql("DROP TABLE IF EXISTS event_matches");
    // tx.executeSql("DROP TABLE IF EXISTS event_teams");

    // Create new tables.
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_matches (key TEXT PRIMARY KEY, eventKey TEXT, matchNumber INTEGER, predictedTime TEXT, blueTeams TEXT, redTeams TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_teams (key TEXT PRIMARY KEY, eventKey TEXT, teamNumber INTEGER, nickname TEXT)"
    );
  });
}

export function saveEvent(event: Event) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event(key, name, shortName, startDate, endDate) VALUES(?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      [
        event.key,
        event.name,
        event.shortName,
        event.startDate.toISOString(),
        event.endDate.toISOString(),
      ],
      (txObj, resultSet) => {
        // Do nothing.
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}

export function saveEventMatches(eventKey: string, matches: Array<Match>) {
  db.transaction((tx) => {
    matches.forEach((match) => {
      tx.executeSql(
        "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, blueTeams, redTeams) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
        [
          match.key,
          eventKey,
          match.matchNumber,
          match.predictedTime.toISOString(),
          JSON.stringify(match.blueTeams),
          JSON.stringify(match.redTeams),
        ],
        (txObj, resultSet) => {
          // Do nothing.
        },
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  });
}

export function saveEventTeams(eventKey: string, teams: Array<Team>) {
  db.transaction((tx) => {
    teams.forEach((team) => {
      tx.executeSql(
        "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) VALUES(?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
        [team.key, eventKey, team.teamNumber, team.nickname],
        (txObj, resultSet) => {
          // Do nothing.
        },
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  });
}

export function getEvent(eventKey: string) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM event WHERE key = ?",
      [eventKey],
      (txObj, resultSet) => {
        return resultSet.rows._array[0] as Event | undefined;
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}

export function getMatchesForEvent(eventKey: string) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM event_matches WHERE eventKey = ?",
      [eventKey],
      (txObj, resultSet) => {
        return resultSet.rows._array as Array<Match> | undefined;
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}

export function getTeamsForEvent(eventKey: string) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM event_teams WHERE eventKey = ?",
      [eventKey],
      (txObj, resultSet) => {
        return resultSet.rows._array as Array<Team> | undefined;
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}
