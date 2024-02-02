import type { TbaEvent, TbaMatch, TbaTeam } from "@/helpers/tbaTypes";
import type { Event, Match, Team, MatchScoutingSession } from "@/helpers/types";
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
We will keep track of all the scouting sessions here.

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
      "CREATE TABLE IF NOT EXISTS events \
      (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_matches \
      (key TEXT PRIMARY KEY, eventKey TEXT, matchNumber INTEGER, predictedTime TEXT, \
        blue1TeamKey TEXT, blue2TeamKey TEXT, blue3TeamKey TEXT, \
        red1TeamKey TEXT, red2TeamKey TEXT, red3TeamKey TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_teams \
      (key TEXT PRIMARY KEY, eventKey TEXT, teamNumber INTEGER, nickname TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS match_scouting_sessions \
      (key TEXT PRIMARY KEY, eventKey TEXT, matchKey TEXT, alliance TEXT, allianceTeam INTEGER, scheduledTeamKey TEXT, scoutedTeamKey TEXT, scouterName TEXT, \
        autoStartedWithNote INTEGER, autoLeftStartArea INTEGER, autoSpeakerScore INTEGER, autoSpeakerScoreAmplified INTEGER, autoSpeakerMiss INTEGER, autoAmpScore INTEGER, autoAmpMiss INTEGER, \
        teleopSpeakerScore INTEGER, teleopSpeakerScoreAmplified INTEGER, teleopSpeakerMiss INTEGER, teleopAmpScore INTEGER, teleopAmpMiss INTEGER, teleopRelayPass INTEGER, \
        endgameTrapScore INTEGER, endgameMicrophoneScore INTEGER, endgameDidRobotPark INTEGER, endgameDidRobotHang INTEGER, endgameHarmony TEXT, \
        finalAllianceScore INTEGER, finalRankingPoints INTEGER, finalAllianceResult TEXT, finalPenalties INTEGER, finalNotes TEXT)"
    );
  });
}

export function saveEvent(event: TbaEvent) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO events(key, name, shortName, startDate, endDate) \
      VALUES(?, ?, ?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
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
      "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, \
        blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON \
      CONFLICT (key) DO NOTHING",
      [
        "practice",
        eventKey,
        0,
        new Date(0).toISOString(),
        "frc00000",
        "frc00000",
        "frc00000",
        "frc00000",
        "frc00000",
        "frc00000",
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
        "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, \
          blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON \
        CONFLICT (key) DO NOTHING",
        [
          match.key,
          eventKey,
          match.match_number,
          new Date(1000 * match.predicted_time).toISOString(),
          match.alliances.blue.team_keys[0],
          match.alliances.blue.team_keys[1],
          match.alliances.blue.team_keys[2],
          match.alliances.red.team_keys[0],
          match.alliances.red.team_keys[1],
          match.alliances.red.team_keys[2],
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
    // Insert a Practice Match placeholder.
    tx.executeSql(
      "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) \
      VALUES(?, ?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      ["practice", eventKey, 0, "Practice Team"],
      (txObj, resultSet) => {
        // Do nothing.
      },
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    // Insert a Practice Match placeholder.
    // TBD: UPSERT this so if match schedules change, we can update the application.
    teams.forEach((team) => {
      tx.executeSql(
        "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) \
        VALUES(?, ?, ?, ?) \
        ON CONFLICT (key) DO NOTHING",
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

export const getEvent = async (
  eventKey: string
): Promise<Event | undefined> => {
  try {
    const query = "SELECT * FROM events WHERE key = ?";
    const params = [eventKey];
    const results = (await executeSql(query, params)) as Event[];

    if (results.length > 0) {
      return results[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching match scouting session:", error);
    return undefined;
  }
};

export const getEvents = async (): Promise<Array<Event>> => {
  try {
    const query = "SELECT * FROM events ORDER BY key";
    return (await executeSql(query, [])) as Array<Event>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getMatches = async () => {
  try {
    const query = "SELECT * FROM event_matches";
    return (await executeSql(query, [])) as Array<Match>;
  } catch (error) {
    return [];
  }
};

export const getMatchesForEvent = async (eventKey: string) => {
  try {
    const query =
      "SELECT * FROM event_matches WHERE eventKey = ? ORDER BY matchNumber";
    const params = [eventKey];
    return (await executeSql(query, params)) as Array<Match>;
  } catch (error) {
    return [];
  }
};

export const getTeams = async (): Promise<Array<Team>> => {
  try {
    const query = "SELECT * FROM event_teams";
    return (await executeSql(query, [])) as Array<Team>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getTeamsForEvent = async (
  eventKey: string
): Promise<Array<Team>> => {
  try {
    const query =
      "SELECT * FROM event_teams WHERE eventKey = ? ORDER BY teamNumber";
    const params = [eventKey];
    return (await executeSql(query, params)) as Array<Team>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const initializeMatchScoutingSession = async (
  session: MatchScoutingSession
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions(key, eventKey, matchKey, alliance, allianceTeam, scheduledTeamKey, scoutedTeamKey) \
      VALUES(?, ?, ?, ?, ?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      [
        session.key,
        session.eventKey,
        session.matchKey,
        session.alliance,
        session.allianceTeam,
        session.scheduledTeamKey,
        session.scoutedTeamKey,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const getMatchScoutingSessions = async (): Promise<
  Array<MatchScoutingSession>
> => {
  try {
    const query = "SELECT * FROM match_scouting_sessions";
    return (await executeSql(query, [])) as Array<MatchScoutingSession>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getMatchScoutingSession = async (
  sessionKey: string
): Promise<MatchScoutingSession | undefined> => {
  try {
    const query = "SELECT * FROM match_scouting_sessions WHERE key = ? LIMIT 1";
    const params = [sessionKey];
    const results = (await executeSql(query, params)) as MatchScoutingSession[];

    if (results.length > 0) {
      return results[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching match scouting session:", error);
    return undefined;
  }
};

export const updateScoutingMatchSessionSetup = async (
  sessionKey: string,
  scouterName: string,
  scoutedTeamKey: string
) => {
  db.transaction((tx) => {
    console.log("updateScoutingMatchSessionSetup...");
    tx.executeSql(
      "UPDATE match_scouting_sessions \
      SET scouterName = ?, scoutedTeamKey = ? \
      WHERE key = ?",
      [scouterName, scoutedTeamKey, sessionKey],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};
