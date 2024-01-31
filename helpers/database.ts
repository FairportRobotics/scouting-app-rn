import type { Event, Match, Team } from "@/helpers/types";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("scouting-app.db");

/*
events
event_tatches
event_teams

event_current
match_scouting_results
match_scouting_current

pit_scouting_results
pit_scouting_current
*/

const executeSql = (query: string, params: Array<any> = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          params,
          (_, { rows }) => resolve(rows._array),
          (_, error) => false
        );
      },
      (error) => reject(error)
    );
  });
};

export function initializeDatabase(dropAndRecreate: boolean = false) {
  db.transaction((tx) => {
    // Provide a means of dropping and recreating all the tables.
    if (dropAndRecreate) {
      tx.executeSql("DROP TABLE IF EXISTS events");
      tx.executeSql("DROP TABLE IF EXISTS event_matches");
      tx.executeSql("DROP TABLE IF EXISTS event_teams");
    }

    // Create new tables.
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS events (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
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
      "INSERT INTO events(key, name, shortName, startDate, endDate) VALUES(?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      [
        event.key,
        event.name,
        event.shortName,
        event.startDate.toISOString(),
        event.endDate.toISOString(),
      ],
      (txObj, resultSet) => {},
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

export const getEvent = async (eventKey: string) => {
  try {
    const query = "SELECT * FROM events WHERE key = ?";
    const params = [eventKey];
    const results = await executeSql(query, params);
    return results as Event;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getEvents = async () => {
  try {
    const query = "SELECT * FROM events";
    const results = await executeSql(query, []);
    return results as Array<Event> | [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getMatchesForEvent = async (eventKey: string) => {
  try {
    const query = "SELECT * FROM event_matches WHERE eventKey = ?";
    const params = [eventKey];
    const results = await executeSql(query, params);

    console.log("getMatchesForEvent results:", results);

    return results as Array<Match> | [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getTeamsForEvent = async (eventKey: string) => {
  try {
    const query = "SELECT * FROM event_teams WHERE eventKey = ?";
    const params = [eventKey];
    const results = await executeSql(query, params);
    return results as Array<Team> | [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};
