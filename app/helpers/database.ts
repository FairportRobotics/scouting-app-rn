import type { ItemKey } from "@/constants/Types";
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
      tx.executeSql("DROP TABLE IF EXISTS event");
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
      tx.executeSql("DELETE FROM event");
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
      "CREATE TABLE IF NOT EXISTS event \
            (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS event_matches \
            (key TEXT PRIMARY KEY, matchType TEXT, setNumber INTEGER, matchNumber INTEGER, predictedTime TEXT, \
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
      autoStartedWithNote INTEGER, autoLeftStartArea INTEGER, autoSpeakerScore INTEGER, autoSpeakerMiss INTEGER, autoAmpScore INTEGER, autoAmpMiss INTEGER, autoNotes TEXT, \
      teleopSpeakerScore INTEGER, teleopSpeakerScoreAmplified INTEGER, teleopSpeakerMiss INTEGER, teleopAmpScore INTEGER, teleopAmpMiss INTEGER, teleopRelayPass INTEGER, teleopNotes TEXT, \
      endgameTrapScore TEXT, endgameMicrophoneScore TEXT, endgameDidRobotPark INTEGER, endgameDidRobotHang INTEGER, endgameHarmony TEXT, endgameNotes TEXT,\
      finalAllianceScore INTEGER, finalRankingPoints INTEGER, finalAllianceResult TEXT, finalViolations TEXT, finalPenalties INTEGER, finalNotes TEXT, \
      notes TEXT)"
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS pit_scouting_sessions \
      (key TEXT PRIMARY KEY, eventKey TEXT, driveTeamExperience TEXT, numberOfAutoMethods TEXT, canPickUpFromGround TEXT, canReceiveFromSourceChute TEXT, canScoreInAmp TEXT, canScoreInSpeaker TEXT, canScoreInTrap TEXT, whereCanYouScoreInSpeaker TEXT, canFitUnderStage TEXT, canGetOnstage TEXT, robotWidth TEXT, onstagePosition TEXT, notes TEXT)"
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
// Lookup Data.
//=================================================================================================
export const deleteLookupData = async () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM event");
    tx.executeSql("DELETE FROM event_matches");
    tx.executeSql("DELETE FROM event_teams");
  });
};

export const saveLookupData = async (
  event: Event,
  matches: Array<Match>,
  teams: Array<Team>
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO event(key, name, shortName, startDate, endDate) \
      VALUES(:key, :name, :shortName, :startDate, :endDate) \
      ON CONFLICT (key) DO NOTHING",
      [
        event.key,
        event.name,
        event.shortName,
        new Date(event.startDate).toISOString(),
        new Date(event.endDate).toISOString(),
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    matches.forEach((match) => {
      tx.executeSql(
        "INSERT INTO event_matches(key, matchType, setNumber, matchNumber, predictedTime, blue1TeamKey, blue2TeamKey, blue3TeamKey, red1TeamKey, red2TeamKey, red3TeamKey) \
        VALUES(:key, :matchType, :setNumber, :matchNumber, :predictedTime, :blue1TeamKey, :blue2TeamKey, :blue3TeamKey, :red1TeamKey, :red2TeamKey, :red3TeamKey) \
        ON CONFLICT (key) DO NOTHING",
        [
          match.key,
          match.matchType,
          match.setNumber,
          match.matchNumber,
          match.predictedTime,
          match.blue1TeamKey,
          match.blue2TeamKey,
          match.blue3TeamKey,
          match.red1TeamKey,
          match.red2TeamKey,
          match.red3TeamKey,
        ],
        (txObj, resultSet) => {},
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });

    // Insert a Practice Match placeholder.
    teams.forEach((team) => {
      tx.executeSql(
        "INSERT INTO event_teams(key, teamNumber, nickname) \
        VALUES(:key, :teamNumber, :nickname) \
        ON CONFLICT (key) DO NOTHING",
        [team.key, team.teamNumber, team.nickname],
        (txObj, resultSet) => {},
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  });
};

//=================================================================================================
// Event data access.
//=================================================================================================
export const getEvent = async (): Promise<Event> => {
  try {
    const query = "SELECT * FROM event LIMIT 1";
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
  autoSpeakerMiss: number,
  autoAmpScore: number,
  autoAmpMiss: number,
  autoNotes: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        autoStartedWithNote, autoLeftStartArea, autoSpeakerScore, autoSpeakerMiss, autoAmpScore, autoAmpMiss, autoNotes \
      ) \
      VALUES \
      ( \
        :key,\
        :autoStartedWithNote, :autoLeftStartArea, :autoSpeakerScore, :autoSpeakerMiss, :autoAmpScore, :autoAmpMiss, :autoNotes \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        autoStartedWithNote = excluded.autoStartedWithNote, \
        autoLeftStartArea = excluded.autoLeftStartArea, \
        autoSpeakerScore = excluded.autoSpeakerScore, \
        autoSpeakerMiss = excluded.autoSpeakerMiss, \
        autoAmpScore = excluded.autoAmpScore, \
        autoAmpMiss = excluded.autoAmpMiss, \
        autoNotes = excluded.autoNotes \
      ",
      [
        sessionKey,
        autoStartedWithNote ? 1 : 0,
        autoLeftStartArea ? 1 : 0,
        autoSpeakerScore,
        autoSpeakerMiss,
        autoAmpScore,
        autoAmpMiss,
        autoNotes,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    concatenateNotes(sessionKey);
  });
};

export const saveMatchScoutingSessionTeleop = async (
  sessionKey: string,
  teleopSpeakerScore: number,
  teleopSpeakerScoreAmplified: number,
  teleopSpeakerMiss: number,
  teleopAmpScore: number,
  teleopAmpMiss: number,
  teleopRelayPass: number,
  teleopNotes: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        teleopSpeakerScore, teleopSpeakerScoreAmplified, teleopSpeakerMiss, teleopAmpScore, teleopAmpMiss, teleopRelayPass, teleopNotes \
      ) \
      VALUES \
      ( \
        :key,\
        :teleopSpeakerScore, :teleopSpeakerScoreAmplified, :teleopSpeakerMiss, :teleopAmpScore, :teleopAmpMiss, :teleopRelayPass, :teleopNotes \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
      teleopSpeakerScore = excluded.teleopSpeakerScore, \
      teleopSpeakerScoreAmplified = excluded.teleopSpeakerScoreAmplified, \
      teleopSpeakerMiss = excluded.teleopSpeakerMiss, \
      teleopAmpScore = excluded.teleopAmpScore, \
      teleopAmpMiss = excluded.teleopAmpMiss, \
      teleopRelayPass = excluded.teleopRelayPass, \
      teleopNotes = excluded.teleopNotes \
      ",
      [
        sessionKey,
        teleopSpeakerScore,
        teleopSpeakerScoreAmplified,
        teleopSpeakerMiss,
        teleopAmpScore,
        teleopAmpMiss,
        teleopRelayPass,
        teleopNotes,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    concatenateNotes(sessionKey);
  });
};

export const saveMatchScoutingSessionEndgame = async (
  sessionKey: string,
  trapScore: string,
  microphoneScore: string,
  didRobotPark: boolean,
  didRobotHang: boolean,
  harmonyScore: string,
  endgameNotes: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO match_scouting_sessions \
      ( \
        key, \
        endgameTrapScore, endgameMicrophoneScore, endgameDidRobotPark, endgameDidRobotHang, endgameHarmony, endgameNotes \
      ) \
      VALUES \
      ( \
        :key,\
        :endgameTrapScore, :endgameMicrophoneScore, :endgameDidRobotPark, :endgameDidRobotHang, :endgameHarmony, :endgameNotes \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        endgameTrapScore = excluded.endgameTrapScore, \
        endgameMicrophoneScore = excluded.endgameMicrophoneScore, \
        endgameDidRobotPark = excluded.endgameDidRobotPark, \
        endgameDidRobotHang = excluded.endgameDidRobotHang, \
        endgameHarmony = excluded.endgameHarmony, \
        endgameNotes = excluded.endgameNotes \
      ",
      [
        sessionKey,
        trapScore,
        microphoneScore,
        didRobotPark ? 1 : 0,
        didRobotHang ? 1 : 0,
        harmonyScore,
        endgameNotes,
      ],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.error(error);
        return false;
      }
    );

    concatenateNotes(sessionKey);
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

    concatenateNotes(sessionKey);
  });
};

export const concatenateNotes = async (sessionKey: string) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE match_scouting_sessions \
      SET \
        notes = 'Auto Notes: ' || autoNotes || char(10) || char(10) ||  \
        'Teleop Notes: ' || teleopNotes || char(10) || char(10) ||  \
        'Endgame Notes: ' || endgameNotes || char(10) || char(10) ||  \
        'Final Notes: ' || finalNotes \
      WHERE \
        key = :sessionKey \
      ",
      [sessionKey],
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
    const query =
      "SELECT * \
      FROM pit_scouting_sessions \
      WHERE key = ? LIMIT 1";
    const params = [sessionKey];
    const results = (await executeSql(query, params)) as PitScoutingSession[];

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

export const updatePitScoutingSession = async (session: PitScoutingSession) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO pit_scouting_sessions \
      ( \
        key, eventKey, \
        driveTeamExperience, numberOfAutoMethods, canPickUpFromGround, canReceiveFromSourceChute, canScoreInAmp, canScoreInSpeaker, canScoreInTrap, whereCanYouScoreInSpeaker, canFitUnderStage, canGetOnstage, robotWidth, onstagePosition, notes \
      ) \
      VALUES \
      ( \
        :key, :eventKey, \
        :driveTeamExperience, :numberOfAutoMethods, :canPickUpFromGround, :canReceiveFromSourceChute, :canScoreInAmp, :canScoreInSpeaker, :canScoreInTrap, :whereCanYouScoreInSpeaker, :canFitUnderStage, :canGetOnstage, :robotWidth, :onstagePosition, :notes \
      ) \
      ON CONFLICT (key) DO UPDATE SET \
        eventKey = excluded.eventKey, \
        driveTeamExperience = excluded.driveTeamExperience, \
        numberOfAutoMethods = excluded.numberOfAutoMethods, \
        canPickUpFromGround = excluded.canPickUpFromGround, \
        canReceiveFromSourceChute = excluded.canReceiveFromSourceChute, \
        canScoreInAmp = excluded.canScoreInAmp, \
        canScoreInSpeaker = excluded.canScoreInSpeaker, \
        canScoreInTrap = excluded.canScoreInTrap, \
        whereCanYouScoreInSpeaker = excluded.whereCanYouScoreInSpeaker, \
        canFitUnderStage = excluded.canFitUnderStage, \
        canGetOnstage = excluded.canGetOnstage, \
        robotWidth = excluded.robotWidth, \
        onstagePosition = excluded.onstagePosition, \
        notes = excluded.notes \
      ",
      [
        session.key,
        session.eventKey,
        session.driveTeamExperience,
        session.numberOfAutoMethods,
        session.canPickUpFromGround,
        session.canReceiveFromSourceChute,
        session.canScoreInAmp,
        session.canScoreInSpeaker,
        session.canScoreInTrap,
        session.whereCanYouScoreInSpeaker,
        session.canFitUnderStage,
        session.canGetOnstage,
        session.robotWidth,
        session.onstagePosition,
        session.notes,
      ],
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
