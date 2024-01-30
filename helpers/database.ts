import type { Event, Match, Team } from "@/helpers/types";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("scouting-app.db");

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
