import type {
  ItemKey,
  PitScoutingQuestion,
  TbaEvent,
  TbaMatch,
  TbaTeam,
} from "@/constants/Types";
import type {
  Event,
  Match,
  Team,
  MatchScoutingSession,
  PitScoutingSession,
} from "@/constants/Types";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("scouting-app.db");

//=================================================================================================
// Common.
//=================================================================================================
const executeSql = (query: string, params: Array<any> = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          params,
          (_, { rows }) => resolve(rows._array),
          (_, error) => {
            console.error(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

//=================================================================================================
// Admin.
//=================================================================================================
export function initializeDatabase(
  dropAndRecreate: boolean = false,
  deleteExistingData: boolean = false
) {
  if (dropAndRecreate) {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS events");
      tx.executeSql("DROP TABLE IF EXISTS event_matches");
      tx.executeSql("DROP TABLE IF EXISTS event_teams");
      tx.executeSql("DROP TABLE IF EXISTS match_scouting_sessions");
      tx.executeSql("DROP TABLE IF EXISTS pit_scouting_sessions");
      tx.executeSql(
        "DROP TABLE IF EXISTS uploaded_match_scouting_session_keys"
      );
      tx.executeSql("DROP TABLE IF EXISTS uploaded_pit_scouting_session_keys");
    });
  }

  if (deleteExistingData) {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM events");
      tx.executeSql("DELETE FROM event_matches");
      tx.executeSql("DELETE FROM event_teams");
      tx.executeSql("DELETE FROM match_scouting_sessions");
      tx.executeSql("DELETE FROM uploaded_match_scouting_session_keys");
      tx.executeSql("DELETE FROM pit_scouting_sessions");
      tx.executeSql("DELETE FROM uploaded_pit_scouting_session_keys");
    });
  }

  db.transaction((tx) => {
    // Create new tables.
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS events \
      (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_matches \
      (key TEXT PRIMARY KEY, matchNumber INTEGER, predictedTime TEXT, \
        blue1TeamKey TEXT, blue2TeamKey TEXT, blue3TeamKey TEXT, \
        red1TeamKey TEXT, red2TeamKey TEXT, red3TeamKey TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_teams \
      (key TEXT PRIMARY KEY, teamNumber INTEGER, nickname TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS match_scouting_sessions \
      (key TEXT PRIMARY KEY, eventKey TEXT, matchKey TEXT, matchNumber INTEGER, alliance TEXT, allianceTeam INTEGER, scheduledTeamKey TEXT, scoutedTeamKey TEXT, scouterName TEXT, \
        autoStartedWithNote INTEGER, autoLeftStartArea INTEGER, autoSpeakerScore INTEGER, autoSpeakerScoreAmplified INTEGER, autoSpeakerMiss INTEGER, autoAmpScore INTEGER, autoAmpMiss INTEGER, \
        teleopSpeakerScore INTEGER, teleopSpeakerScoreAmplified INTEGER, teleopSpeakerMiss INTEGER, teleopAmpScore INTEGER, teleopAmpMiss INTEGER, teleopRelayPass INTEGER, \
        endgameTrapScore TEXT, endgameMicrophoneScore TEXT, endgameDidRobotPark INTEGER, endgameDidRobotHang INTEGER, endgameHarmony TEXT, \
        finalAllianceScore INTEGER, finalRankingPoints INTEGER, finalAllianceResult TEXT, finalViolations TEXT, finalPenalties INTEGER, finalNotes TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS pit_scouting_sessions \
      (key TEXT PRIMARY KEY, eventKey TEXT, questions TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS uploaded_match_scouting_session_keys \
      (key TEXT PRIMARY KEY)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS uploaded_pit_scouting_session_keys \
      (key TEXT PRIMARY KEY)"
    );
  });
}

//=================================================================================================
// Event data access.
//=================================================================================================

export function saveEvent(event: TbaEvent) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO events(key, name, shortName, startDate, endDate) \
      VALUES(:key, :name, :shortName, :startDate, :endDate) \
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
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event_matches(key, matchNumber, predictedTime, \
        blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
      VALUES(:key, :matchNumber, :predictedTime, :blue1TeamKey, :blue2TeamKey, :blue3TeamKey, :red1TeamKey, :red2TeamKey, :red3TeamKey) \
      ON CONFLICT (key) DO NOTHING",
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
        "INSERT INTO event_matches(key, matchNumber, predictedTime, blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
        VALUES(:key, :matchNumber, :predictedTime, :blue1TeamKey, :blue2TeamKey, :blue3TeamKey, :red1TeamKey, :red2TeamKey, :red3TeamKey) \
        ON CONFLICT (key) DO NOTHING",
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
  db.transaction((tx) => {
    // Insert a Practice Match placeholder.
    tx.executeSql(
      "INSERT INTO event_teams(key, teamNumber, nickname) \
      VALUES(:key, :teamNumber, :nickname) \
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
    teams.forEach((team) => {
      tx.executeSql(
        "INSERT INTO event_teams(key, teamNumber, nickname) \
        VALUES(:key, :teamNumber, :nickname) \
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

export const getEvent = async (): Promise<Event> => {
  try {
    const query = "SELECT * FROM events LIMIT 1";
    const results = (await executeSql(query, [])) as Event[];

    if (results.length > 0) {
      return results[0] as Event;
    } else {
      return {} as Event;
    }
  } catch (error) {
    console.error(error);
    return {} as Event;
  }
};

export const getMatches = async (): Promise<Array<Match>> => {
  try {
    const query = "SELECT * FROM event_matches ORDER BY matchNumber";
    return (await executeSql(query, [])) as Array<Match>;
  } catch (error) {
    return [];
  }
};

export const getTeams = async (): Promise<Array<Team>> => {
  try {
    const query = "SELECT * FROM event_teams ORDER BY teamNumber";
    return (await executeSql(query, [])) as Array<Team>;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTeam = async (teamKey: string): Promise<Team | undefined> => {
  try {
    const query = "SELECT * FROM event_teams WHERE key = ? LIMIT 1";
    const params = [teamKey];
    const results = (await executeSql(query, params)) as Team[];

    if (results.length > 0) {
      return results[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

//=================================================================================================
// Match Scouting data access.
//=================================================================================================

export const saveMatchScoutingSession = async (
  session: MatchScoutingSession
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      (key, eventKey, matchKey, matchNumber, alliance, allianceTeam, scheduledTeamKey, scoutedTeamKey) \
      VALUES (:key, :eventKey, :matchKey, :matchNumber, :alliance, :allianceTeam, :scheduledTeamKey, :scoutedTeamKey) \
      ON CONFLICT (key) DO NOTHING",
      [
        session.key,
        session.eventKey,
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

export const saveMatchScoutingSessionConfirm = async (
  sessionKey: string,
  scoutedTeamKey: string,
  scouterName: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      (key, scoutedTeamKey, scouterName) \
      VALUES \
      (:key, :scoutedTeamKey, :scouterName) \
      ON CONFLICT (key) DO UPDATE SET \
        scoutedTeamKey = excluded.scoutedTeamKey, \
        scouterName = excluded.scouterName \
      ",
      [sessionKey, scoutedTeamKey, scouterName],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const saveMatchScoutingSessionAuto = async (
  sessionKey: string,
  autoStartedWithNote: boolean,
  autoLeftStartArea: boolean,
  autoSpeakerScore: number,
  autoSpeakerScoreAmplified: number,
  autoSpeakerMiss: number,
  autoAmpScore: number,
  autoAmpMiss: number
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        autoStartedWithNote, autoLeftStartArea, autoSpeakerScore, autoSpeakerScoreAmplified, autoSpeakerMiss, autoAmpScore, autoAmpMiss \
      ) \
      VALUES \
      ( \
        :key,\
        :autoStartedWithNote, :autoLeftStartArea, :autoSpeakerScore, :autoSpeakerScoreAmplified, :autoSpeakerMiss, :autoAmpScore, :autoAmpMiss \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        autoStartedWithNote = excluded.autoStartedWithNote, \
        autoLeftStartArea = excluded.autoLeftStartArea, \
        autoSpeakerScore = excluded.autoSpeakerScore, \
        autoSpeakerScoreAmplified = excluded.autoSpeakerScoreAmplified, \
        autoSpeakerMiss = excluded.autoSpeakerMiss, \
        autoAmpScore = excluded.autoAmpScore, \
        autoAmpMiss = excluded.autoAmpMiss \
      ",
      [
        sessionKey,
        autoStartedWithNote ? 1 : 0,
        autoLeftStartArea ? 1 : 0,
        autoSpeakerScore,
        autoSpeakerScoreAmplified,
        autoSpeakerMiss,
        autoAmpScore,
        autoAmpMiss,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const saveMatchScoutingSessionTeleop = async (
  sessionKey: string,
  teleopSpeakerScore: number,
  teleopSpeakerScoreAmplified: number,
  teleopSpeakerMiss: number,
  teleopAmpScore: number,
  teleopAmpMiss: number,
  teleopRelayPass: number
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        teleopSpeakerScore, teleopSpeakerScoreAmplified, teleopSpeakerMiss, teleopAmpScore, teleopAmpMiss, teleopRelayPass \
      ) \
      VALUES \
      ( \
        :key,\
        :teleopSpeakerScore, :teleopSpeakerScoreAmplified, :teleopSpeakerMiss, :teleopAmpScore, :teleopAmpMiss, :teleopRelayPass \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
      teleopSpeakerScore = excluded.teleopSpeakerScore, \
      teleopSpeakerScoreAmplified = excluded.teleopSpeakerScoreAmplified, \
      teleopSpeakerMiss = excluded.teleopSpeakerMiss, \
      teleopAmpScore = excluded.teleopAmpScore, \
      teleopAmpMiss = excluded.teleopAmpMiss, \
      teleopRelayPass = excluded.teleopRelayPass \
      ",
      [
        sessionKey,
        teleopSpeakerScore,
        teleopSpeakerScoreAmplified,
        teleopSpeakerMiss,
        teleopAmpScore,
        teleopAmpMiss,
        teleopRelayPass,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const saveMatchScoutingSessionEndgame = async (
  sessionKey: string,
  trapScore: string,
  microphoneScore: string,
  didRobotPark: boolean,
  didRobotHang: boolean,
  harmonyScore: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        endgameTrapScore, endgameMicrophoneScore, endgameDidRobotPark, endgameDidRobotHang, endgameHarmony \
      ) \
      VALUES \
      ( \
        :key,\
        :endgameTrapScore, :endgameMicrophoneScore, :endgameDidRobotPark, :endgameDidRobotHang, :endgameHarmony \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        endgameTrapScore = excluded.endgameTrapScore, \
        endgameMicrophoneScore = excluded.endgameMicrophoneScore, \
        endgameDidRobotPark = excluded.endgameDidRobotPark, \
        endgameDidRobotHang = excluded.endgameDidRobotHang, \
        endgameHarmony = excluded.endgameHarmony \
      ",
      [
        sessionKey,
        trapScore,
        microphoneScore,
        didRobotPark ? 1 : 0,
        didRobotHang ? 1 : 0,
        harmonyScore,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

export const saveMatchScoutingSessionFinal = async (
  sessionKey: string,
  finalAllianceScore: number,
  finalRankingPoints: number,
  finalAllianceResult: string,
  finalViolations: string,
  finalPenalties: number,
  finalNotes: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        finalAllianceScore, finalRankingPoints, finalAllianceResult, finalViolations, finalPenalties, finalNotes \
      ) \
      VALUES \
      ( \
        :key,\
        :finalAllianceScore, :finalRankingPoints, :finalAllianceResult, :finalViolations, :finalPenalties, :finalNotes \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        finalAllianceScore = excluded.finalAllianceScore, \
        finalRankingPoints = excluded.finalRankingPoints, \
        finalAllianceResult = excluded.finalAllianceResult, \
        finalViolations = excluded.finalViolations, \
        finalPenalties = excluded.finalPenalties, \
        finalNotes = excluded.finalNotes \
      ",
      [
        sessionKey,
        finalAllianceScore,
        finalRankingPoints,
        finalAllianceResult,
        finalViolations,
        finalPenalties,
        finalNotes,
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
    const query =
      "SELECT s.*, t.teamNumber, t.nickname teamNickname \
      FROM match_scouting_sessions s \
      INNER JOIN event_teams t on s.scoutedTeamKey = t.key \
      ORDER BY matchNumber";
    return (await executeSql(query, [])) as Array<MatchScoutingSession>;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMatchScoutingSession = async (
  sessionKey: string
): Promise<MatchScoutingSession | undefined> => {
  try {
    const query =
      "SELECT s.*, t.teamNumber, t.nickname as teamNickname \
      FROM match_scouting_sessions s \
      INNER JOIN event_teams t on s.scoutedTeamKey = t.key \
      WHERE s.key = ? LIMIT 1";
    const params = [sessionKey];
    const results = (await executeSql(query, params)) as MatchScoutingSession[];

    if (results.length > 0) {
      return results[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getMatchScoutingKeys = async (): Promise<Array<ItemKey>> => {
  try {
    const query = "SELECT key FROM match_scouting_sessions";
    return ((await executeSql(query, [])) as Array<ItemKey>) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

//=================================================================================================
// Team Match Scouting Keys data access.
//=================================================================================================
export const saveMatchScoutingSessionKeys = async (
  sessionKeys: Array<string>
) => {
  db.transaction((tx) => {
    sessionKeys.forEach((sessionKey) => {
      tx.executeSql(
        "INSERT INTO uploaded_match_scouting_session_keys \
        (key) \
        VALUES (:key) \
        ON CONFLICT (key) DO NOTHING",
        [sessionKey],
        (txObj, resultSet) => {},
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  });
};

export const getUploadedMatchScoutingKeys = async (): Promise<
  Array<ItemKey>
> => {
  try {
    const query = "SELECT key FROM uploaded_match_scouting_session_keys";
    return ((await executeSql(query, [])) as Array<ItemKey>) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

//=================================================================================================
// Pit Scouting data access.
//=================================================================================================

export const getPitScoutingSessions = async (): Promise<
  Array<PitScoutingSession>
> => {
  try {
    const query = "SELECT * FROM pit_scouting_sessions";
    return ((await executeSql(query, [])) as Array<PitScoutingSession>) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPitScoutingSession = async (
  sessionKey: string
): Promise<PitScoutingSession | undefined> => {
  try {
    const query = "SELECT * FROM pit_scouting_sessions WHERE key = ? LIMIT 1";
    const params = [sessionKey];

    return new Promise<PitScoutingSession | undefined>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            query,
            params,
            (_, { rows }) => {
              // Stuff here.
              const result: Array<PitScoutingSession> = [];

              for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);

                // Convert the column to JSON.
                const parsedArray: Array<PitScoutingQuestion> = JSON.parse(
                  item.questions
                );

                // Build the object.
                const data = {
                  key: item.key,
                  eventKey: item.eventKey,
                  questions: parsedArray,
                } as PitScoutingSession;

                result.push(data);
              }

              resolve(result[0]);
            },
            (_, error) => {
              console.error(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const updatePitScoutingSession = async (session: PitScoutingSession) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO pit_scouting_sessions \
      (key, eventKey, questions) \
      VALUES \
      (:key, :eventKey, :questions) \
      ON CONFLICT (key) DO UPDATE SET \
        eventKey = excluded.eventKey, \
        questions = excluded.questions \
      ",
      [session.key, session.eventKey, JSON.stringify(session.questions)],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );
  });
};

//=================================================================================================
// Team Pit Scouting Keys data access.
//=================================================================================================
export const savePitScoutingSessionKeys = async (teamKeys: Array<string>) => {
  db.transaction((tx) => {
    teamKeys.forEach((teamKey) => {
      tx.executeSql(
        "INSERT INTO uploaded_pit_scouting_session_keys \
        (key) \
        VALUES (:key) \
        ON CONFLICT (key) DO NOTHING",
        [teamKey],
        (txObj, resultSet) => {},
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  });
};

export const getUploadedPitScoutingKeys = async (): Promise<Array<ItemKey>> => {
  try {
    const query =
      "\
      SELECT key FROM uploaded_pit_scouting_session_keys \
      ";
    return (await executeSql(query, [])) as Array<ItemKey> | [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
