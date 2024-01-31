import type { TbaEvent, TbaMatch, TbaTeam } from "@/helpers/tbaTypes";
import type { EventDto, MatchDto, TeamDto } from "@/helpers/types";
import { Event, Match, Team } from "@/helpers/types";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("scouting-app.db");

/*

events:
Stores the Events which have been cached. During actual competitons, there will be only 1. We will
likely have more than one during development.

event_matches:
Stores all the Matches associated with all the Events. This table should only include Qualifying
matches. All other Match types will be filted out when fetching from TBA.

event_teams:
Stores all the Teams associated with all the Events.

match_scouting_sessions:


current_event
current_match_scouting_session
pit_scouting_sessions
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
      tx.executeSql("DROP TABLE IF EXISTS match_scouting_sessions");
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

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS match_scouting_sessions (key TEXT PRIMARY KEY, eventKey TEXT, matchKey TEXT, alliance TEXT, allianceTeam INTEGER)"
    );
  });
}

export function saveEvent(event: TbaEvent) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO events(key, name, shortName, startDate, endDate) VALUES(?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      [
        event.key,
        event.name,
        event.short_name,
        event.start_date,
        event.end_date,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}

export function saveEventMatches(eventKey: string, matches: Array<TbaMatch>) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, blueTeams, redTeams) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      [
        "practice",
        eventKey,
        0,
        new Date(0).toISOString(),
        "[0,0,0]",
        "[0,0,0]",
      ],
      (txObj, resultSet) => {
        // Do nothing.
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    matches.forEach((match) => {
      tx.executeSql(
        "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, blueTeams, redTeams) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
        [
          match.key,
          eventKey,
          match.match_number,
          new Date(match.predicted_time).toISOString(),
          JSON.stringify(match.alliances.blue.team_keys),
          JSON.stringify(match.alliances.red.team_keys),
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

export function saveEventTeams(eventKey: string, teams: Array<TbaTeam>) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) VALUES(?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      ["practice", eventKey, 0, "Practice Team"],
      (txObj, resultSet) => {
        // Do nothing.
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    teams.forEach((team) => {
      tx.executeSql(
        "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) VALUES(?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
        [team.key, eventKey, team.team_number, team.nickname],
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
    const dtos = (await executeSql(query, params)) as Array<EventDto>;
    if (dtos.length > 0) return Event.fromDto(dtos[0]) as Event;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getEvents = async () => {
  try {
    const query = "SELECT * FROM events ORDER BY key";
    const dtos = (await executeSql(query, [])) as Array<EventDto>;
    return Event.fromDtos(dtos) as Array<Event>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getMatchesForEvent = async (eventKey: string) => {
  try {
    const query =
      "SELECT * FROM event_matches WHERE eventKey = ? ORDER BY matchNumber";
    const params = [eventKey];
    const dtos = (await executeSql(query, params)) as Array<MatchDto>;
    return Match.fromDtos(dtos) as Array<Match>;
  } catch (error) {
    return [];
  }
};

export const getTeamsForEvent = async (eventKey: string) => {
  try {
    const query =
      "SELECT * FROM event_teams WHERE eventKey = ? ORDER BY teamNumber";
    const params = [eventKey];
    const dtos = (await executeSql(query, params)) as Array<TeamDto>;
    return Team.fromDtos(dtos) as Array<Team>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const initializeMatchScoutingSession = async (
  eventKey: string,
  matchKey: string,
  alliance: string,
  allianceTeam: number
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions(key, eventKey, matchKey, alliance, allianceTeam) VALUES(?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
      [
        `${eventKey}__${matchKey}__${alliance}__${allianceTeam}`,
        eventKey,
        matchKey,
        alliance,
        allianceTeam,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const getMatchScoutingSessions = async () => {
  try {
    const query = "SELECT * FROM match_scouting_sessions";
    const dtos = await executeSql(query, []);
    return dtos;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};