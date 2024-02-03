import type { TbaEvent, TbaMatch, TbaTeam } from "@/helpers/tbaTypes";
import type {
  Event,
  Match,
  Team,
  MatchScoutingSession,
  PitScoutingSession,
  AppSettings,
} from "@/helpers/types";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("scouting-app.db");

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

export function initializeDatabase(
  dropAndRecreate: boolean = false,
  deleteExistingData: boolean = false
) {
  console.log("initializeDatabase...");
  if (dropAndRecreate) {
    db.transaction((tx) => {
      console.log("initializeDatabase dropAndRecreate...");
      tx.executeSql("DROP TABLE IF EXISTS settings");
      tx.executeSql("DROP TABLE IF EXISTS events");
      tx.executeSql("DROP TABLE IF EXISTS event_matches");
      tx.executeSql("DROP TABLE IF EXISTS event_teams");
      tx.executeSql("DROP TABLE IF EXISTS match_scouting_sessions");
      tx.executeSql("DROP TABLE IF EXISTS pit_scouting_sessions");
      console.log("initializeDatabase dropAndRecreate complete.");
    });
  }

  if (deleteExistingData) {
    db.transaction((tx) => {
      console.log("initializeDatabase deleteExistingData...");
      tx.executeSql("DELETE FROM settings");
      tx.executeSql("DELETE FROM events");
      tx.executeSql("DELETE FROM event_matches");
      tx.executeSql("DELETE FROM event_teams");
      tx.executeSql("DELETE FROM match_scouting_sessions");
      tx.executeSql("DELETE FROM pit_scouting_sessions");
      console.log("initializeDatabase deleteExistingData complete.");
    });
  }

  db.transaction((tx) => {
    // Create new tables.
    console.log("initializeDatabase create settings");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS settings \
      (key TEXT PRIMARY KEY, tbaKey TEXT, saveUri)"
    );

    console.log("initializeDatabase create events");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS events \
      (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
    );

    console.log("initializeDatabase create event_matches");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_matches \
      (key TEXT PRIMARY KEY, matchNumber INTEGER, predictedTime TEXT, \
        blue1TeamKey TEXT, blue2TeamKey TEXT, blue3TeamKey TEXT, \
        red1TeamKey TEXT, red2TeamKey TEXT, red3TeamKey TEXT)"
    );

    console.log("initializeDatabase create event_teams");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_teams \
      (key TEXT PRIMARY KEY, teamNumber INTEGER, nickname TEXT)"
    );

    console.log("initializeDatabase create match_scouting_sessions");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS match_scouting_sessions \
      (key TEXT PRIMARY KEY, matchKey TEXT, matchNumber INTEGER, alliance TEXT, allianceTeam INTEGER, scheduledTeamKey TEXT, scoutedTeamKey TEXT, scouterName TEXT, \
        autoStartedWithNote INTEGER, autoLeftStartArea INTEGER, autoSpeakerScore INTEGER, autoSpeakerScoreAmplified INTEGER, autoSpeakerMiss INTEGER, autoAmpScore INTEGER, autoAmpMiss INTEGER, \
        teleopSpeakerScore INTEGER, teleopSpeakerScoreAmplified INTEGER, teleopSpeakerMiss INTEGER, teleopAmpScore INTEGER, teleopAmpMiss INTEGER, teleopRelayPass INTEGER, \
        endgameTrapScore INTEGER, endgameMicrophoneScore INTEGER, endgameDidRobotPark INTEGER, endgameDidRobotHang INTEGER, endgameHarmony TEXT, \
        finalAllianceScore INTEGER, finalRankingPoints INTEGER, finalAllianceResult TEXT, finalPenalties INTEGER, finalNotes TEXT)"
    );

    console.log("initializeDatabase create pit_scouting_sessions");
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS pit_scouting_sessions \
      (key TEXT PRIMARY KEY, teamKey TEXT, canAchieveHarmony TEXT, \
        canFitOnStage TEXT, canFitUnderStage TEXT, canGetFromSource TEXT, canGetOnStage TEXT, canPark TEXT, canPickUpNoteFromGround TEXT, \
        canRobotRecover TEXT, canScoreAmp TEXT, canScoreSpeaker TEXT, canScoreTrap TEXT, isRobotReady TEXT, numberOfAutoMethods TEXT, planOnClimbing TEXT, \
        planOnScoringTrap TEXT, robotDimenions TEXT, teamExperiance TEXT)"
    );
  });
  console.log("initializeDatabase complete.");
}

export function saveSettings(settings: AppSettings) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO settings(key, tbaKey, saveUri) \
      VALUES(?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      [settings.key, settings.tbaKey, settings.saveUri],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
}

export const getSettings = async (
  key: string
): Promise<AppSettings | undefined> => {
  try {
    const query = "SELECT * FROM settings WHERE key = ?";
    const params = [key];
    const results = (await executeSql(query, params)) as AppSettings[];

    if (results.length > 0) {
      return results[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching AppSettings:", error);
    return undefined;
  }
};

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

export function saveMatches(matches: Array<TbaMatch>) {
  console.log("saveMatches...");
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event_matches(key, matchNumber, predictedTime, \
        blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ON \
      CONFLICT (key) DO NOTHING",
      [
        "practice",
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
        "INSERT INTO event_matches(key, matchNumber, predictedTime, \
          blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ON \
        CONFLICT (key) DO NOTHING",
        [
          match.key,
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

export function saveTeams(teams: Array<TbaTeam>) {
  console.log("saveTeams...");
  db.transaction((tx) => {
    // Insert a Practice Match placeholder.
    tx.executeSql(
      "INSERT INTO event_teams(key, teamNumber, nickname) \
      VALUES(?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      ["frc00000", 0, "Practice Team"],
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
        "INSERT INTO event_teams(key, teamNumber, nickname) \
        VALUES(?, ?, ?) \
        ON CONFLICT (key) DO NOTHING",
        [team.key, team.team_number, team.nickname],
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

export const getEvent = async (): Promise<Event | undefined> => {
  try {
    const query = "SELECT * FROM events LIMIT 1";
    const results = (await executeSql(query, [])) as Event[];

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

export const getMatches = async () => {
  try {
    const query = "SELECT * FROM event_matches ORDER BY matchNumber";
    return (await executeSql(query, [])) as Array<Match>;
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

export const initializeMatchScoutingSession = async (
  session: MatchScoutingSession
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions(key, matchKey, matchNumber, alliance, allianceTeam, scheduledTeamKey, scoutedTeamKey) \
      VALUES(?, ?, ?, ?, ?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      [
        session.key,
        session.matchKey,
        session.matchNumber,
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
    const query = "SELECT * FROM match_scouting_sessions ORDER BY ";
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

export const initializePitScoutingSession = async (
  session: PitScoutingSession
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO pit_scouting_sessions(key) \
      VALUES(?, ?, ?) \
      ON CONFLICT (key) DO NOTHING",
      [session.key],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const getPitScoutingSessions = async (): Promise<
  Array<PitScoutingSession>
> => {
  try {
    const query = "SELECT * FROM pit_scouting_sessions";
    return (await executeSql(query, [])) as Array<PitScoutingSession>;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const getPitScoutingSession = async (
  sessionKey: string
): Promise<PitScoutingSession | undefined> => {
  try {
    const query = "SELECT * FROM pit_scouting_sessions WHERE key = ? LIMIT 1";
    const params = [sessionKey];
    const results = (await executeSql(query, params)) as PitScoutingSession[];

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

export const updatePitScoutingSession = async (session: PitScoutingSession) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE pit_scouting_sessions \
      SET \
        canAchieveHarmony = ?, \
        canFitOnStage = ?, \
        canFitUnderStage = ?, \
        canGetFromSource = ?, \
        canGetOnStage = ?, \
        canPark = ?, \
        canPickUpNoteFromGround = ?, \
        canRobotRecover = ?, \
        canScoreAmp = ?, \
        canScoreSpeaker = ?, \
        canScoreTrap = ?, \
        isRobotReady = ?, \
        numberOfAutoMethods = ?, \
        planOnClimbing = ?, \
        planOnScoringTrap = ?, \
        robotDimenions = ?, \
        teamExperiance = ? \
      WHERE key = ?",
      [
        session.canAchieveHarmony,
        session.canFitOnStage,
        session.canFitUnderStage,
        session.canGetFromSource,
        session.canGetOnStage,
        session.canPark,
        session.canPickUpNoteFromGround,
        session.canRobotRecover,
        session.canScoreAmp,
        session.canScoreSpeaker,
        session.canScoreTrap,
        session.isRobotReady,
        session.numberOfAutoMethods,
        session.planOnClimbing,
        session.planOnScoringTrap,
        session.robotDimenions,
        session.teamExperiance,
        session.key,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};
