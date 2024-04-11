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
  matchType: string;
  setNumber: number;
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
  schoolName: string;
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
  autoSpeakerMiss: number;
  autoAmpScore: number;
  autoAmpMiss: number;
  autoNotes: string;

  // Teleop
  teleopSpeakerScore: number;
  teleopSpeakerScoreAmplified: number;
  teleopSpeakerMiss: number;
  teleopAmpScore: number;
  teleopAmpMiss: number;
  teleopRelayPass: number;
  teleopNotes: string;

  // Endgame
  endgameTrapScore: string;
  endgameMicrophoneScore: string;
  endgameDidRobotPark: boolean;
  endgameDidRobotHang: boolean;
  endgameHarmony: string;
  endgameNotes: string;

  // Final
  finalAllianceScore: number;
  finalRankingPoints: number;
  finalAllianceResult: string;
  finalViolations: string;
  finalPenalties: number;
  finalNotes: string;
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
  key: string;
  eventKey: string;
  driveTeamExperience: string;
  numberOfAutoMethods: string;
  canPickUpFromGround: string;
  canReceiveFromSourceChute: string;
  canScoreInAmp: string;
  canScoreInSpeaker: string;
  canScoreInTrap: string;
  whereCanYouScoreInSpeaker: string;
  canFitUnderStage: string;
  canGetOnstage: string;
  robotWidth: string;
  onstagePosition: string;
  notes: string;
};

export type MatchModel = {
  key: string;
  eventKey: string;
  matchKey: string;
  matchType: string;
  setNumber: number;
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

export type ItemKey = {
  key: string;
};

export type Student = {
  email: string;
  name: string;
};
