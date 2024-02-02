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
  alliance: string;
  allianceTeam: number;
  scheduledTeamKey: string;

  // Setup Properties
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
  finalPenalties: number;
  finalNotes: string;
};
