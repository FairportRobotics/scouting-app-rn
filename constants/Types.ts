//=================================================================================================
// The Blue Alliance types
//=================================================================================================
export interface TbaEvent {
  key: string;
  name: string;
  short_name: string;
  start_date: string;
  end_date: string;
}

export interface TbaMatch {
  key: string;
  comp_level: string;
  match_number: number;
  predicted_time: number;
  alliances: {
    blue: {
      team_keys: Array<string>;
    };
    red: {
      team_keys: Array<string>;
    };
  };
}

export interface TbaTeam {
  key: string;
  team_number: string;
  name: string;
  nickname: string;
}

//=================================================================================================
// Our DTOs and Types
//=================================================================================================
export type Event = {
  key: string;
  name: string;
  shortName: string;
  startDate: Date;
  endDate: Date;
};

export type Match = {
  key: string;
  matchNumber: number;
  predictedTime: string;
  blue1TeamKey: string;
  blue2TeamKey: string;
  blue3TeamKey: string;
  red1TeamKey: string;
  red2TeamKey: string;
  red3TeamKey: string;
};

export type Team = {
  key: string;
  teamNumber: string;
  name: string;
  nickname: string;
};

export type MatchScoutingSession = {
  // Root properties.
  key: string;
  eventKey: string;
  matchKey: string;
  matchNumber: number;
  alliance: string;
  allianceTeam: number;
  scheduledTeamKey: string;

  // Confirm
  scouterName: string;
  scoutedTeamKey: string;

  // Auto
  autoStartedWithNote: boolean;
  autoLeftStartArea: boolean;
  autoSpeakerScore: number;
  autoSpeakerScoreAmplified: number;
  autoSpeakerMiss: number;
  autoAmpScore: number;
  autoAmpMiss: number;

  // Teleop
  teleopSpeakerScore: number;
  teleopSpeakerScoreAmplified: number;
  teleopSpeakerMiss: number;
  teleopAmpScore: number;
  teleopAmpMiss: number;
  teleopRelayPass: number;

  // Endgame
  endgameTrapScore: number;
  endgameMicrophoneScore: number;
  endgameDidRobotPark: boolean;
  endgameDidRobotHang: boolean;
  endgameHarmony: string;

  // Final
  finalAllianceScore: number;
  finalRankingPoints: number;
  finalAllianceResult: string;
  finalViolations: string;
  finalPenalties: number;
  finalNotes: string;

  // For Display
  teamNumber: number;
  teamNickname: string;
};

export default function getDefaultMatchScoutingSession() {
  let session: MatchScoutingSession = {
    // Root properties.
    key: "",
    matchKey: "",
    matchNumber: "",
    alliance: "",
    allianceTeam: "",
    scheduledTeamKey: "",

    // Confirm
    scouterName: "",
    scoutedTeamKey: "",

    // Auto
    autoStartedWithNote: 0,
    autoLeftStartArea: 0,
    autoSpeakerScore: 0,
    autoSpeakerScoreAmplified: 0,
    autoSpeakerMiss: 0,
    autoAmpScore: 0,
    autoAmpMiss: 0,

    // Teleop
    teleopSpeakerScore: 0,
    teleopSpeakerScoreAmplified: 0,
    teleopSpeakerMiss: 0,
    teleopAmpScore: 0,
    teleopAmpMiss: 0,
    teleopRelayPass: 0,

    // Endgame
    endgameTrapScore: 0,
    endgameMicrophoneScore: 0,
    endgameDidRobotPark: 0,
    endgameDidRobotHang: 0,
    endgameHarmony: "",

    // Final
    finalAllianceScore: 0,
    finalRankingPoints: 0,
    finalAllianceResult: 0,
    finalViolations: "",
    finalPenalties: 0,
    finalNotes: "",
  } as unknown as MatchScoutingSession;

  return session;
}

export type PitScoutingSession = {
  // Root properties.
  key: string;
  eventKey: string;
  canAchieveHarmony: string;
  canFitOnStage: string;
  canFitUnderStage: string;
  canGetFromSource: string;
  canGetOnStage: string;
  canPark: string;
  canPickUpNoteFromGround: string;
  canRobotRecover: string;
  canScoreAmp: string;
  canScoreSpeaker: string;
  canScoreTrap: string;
  isRobotReady: string;
  numberOfAutoMethods: string;
  planOnClimbing: string;
  planOnScoringTrap: string;
  robotDimensions: string;
  teamExperience: string;
};

export type PitScoutingSessionAction = {
  key: string;
  teamNumber: string;
  nickname: string;
  wasScouted: boolean;
  uploadedDate: Date | null;
  qrJsonDate: Date | null;
  qrCsvDate: Date | null;
  shareJsonDate: Date | null;
  shareCsvDate: Date | null;
};

export type AppSettings = {
  key: string;
  tbaKey: string;
  saveUri: string;
};

export type MatchModel = {
  key: string;
  eventKey: string;
  matchKey: string;
  matchNumber: number;
  predictedTime: string;
  alliances: Record<string, Record<number, TeamModel | undefined>>;
};

export type TeamModel = {
  sessionKey: string;
  alliance: string;
  allianceTeam: number;
  teamKey: string;
  teamNumber: string;
  sessionExists: boolean;
  uploadExists: boolean;
};

//=================================================================================================
// The Blue Alliance types
//=================================================================================================
export type RootStackParamList = {
  ScoutMatchScreen: undefined;
  ScoutMatchEditScreen: { id: string; returnTo: string };
};

export type ItemKey = {
  key: string;
};
