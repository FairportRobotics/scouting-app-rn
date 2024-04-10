import { MatchScoutingSession } from "@/constants/Types";
import {
  MatchScoutingState,
  useMatchScoutingStore,
} from "./matchScoutingStore";

describe("Cache Store", () => {
  // Clear the store before each test.
  beforeEach(() => {
    useMatchScoutingStore.setState({
      currentKey: undefined,
      sessions: {},
      uploadedKeys: [],
    });
  });

  it("When no sessions exist, sessionKeys() returns empty array", () => {
    const storeState: MatchScoutingState = useMatchScoutingStore.getState();
    expect(storeState.sessionKeys()).toEqual([]);
  });

  it("When sessions exist, sessionKeys() returns array of the keys", () => {
    const newSessions: Record<string, MatchScoutingSession> = {
      "SESSION-1": {
        key: "SESSION-1",
        eventKey: "",
        matchKey: "",
        matchNumber: 0,
        alliance: "",
        allianceTeam: 0,
        scheduledTeamKey: "",
        scouterName: "",
        scoutedTeamKey: "",
        autoStartedWithNote: false,
        autoLeftStartArea: false,
        autoSpeakerScore: 0,
        autoSpeakerMiss: 0,
        autoAmpScore: 0,
        autoAmpMiss: 0,
        autoNotes: "",
        teleopSpeakerScore: 0,
        teleopSpeakerScoreAmplified: 0,
        teleopSpeakerMiss: 0,
        teleopAmpScore: 0,
        teleopAmpMiss: 0,
        teleopRelayPass: 0,
        teleopNotes: "",
        endgameTrapScore: "",
        endgameMicrophoneScore: "",
        endgameDidRobotPark: false,
        endgameDidRobotHang: false,
        endgameHarmony: "",
        endgameNotes: "",
        finalAllianceScore: 0,
        finalRankingPoints: 0,
        finalAllianceResult: "",
        finalViolations: "",
        finalPenalties: 0,
        finalNotes: "",
        teamNumber: 0,
        teamNickname: "",
      },
      "SESSION-2": {
        key: "SESSION-2",
        eventKey: "",
        matchKey: "",
        matchNumber: 0,
        alliance: "",
        allianceTeam: 0,
        scheduledTeamKey: "",
        scouterName: "",
        scoutedTeamKey: "",
        autoStartedWithNote: false,
        autoLeftStartArea: false,
        autoSpeakerScore: 0,
        autoSpeakerMiss: 0,
        autoAmpScore: 0,
        autoAmpMiss: 0,
        autoNotes: "",
        teleopSpeakerScore: 0,
        teleopSpeakerScoreAmplified: 0,
        teleopSpeakerMiss: 0,
        teleopAmpScore: 0,
        teleopAmpMiss: 0,
        teleopRelayPass: 0,
        teleopNotes: "",
        endgameTrapScore: "",
        endgameMicrophoneScore: "",
        endgameDidRobotPark: false,
        endgameDidRobotHang: false,
        endgameHarmony: "",
        endgameNotes: "",
        finalAllianceScore: 0,
        finalRankingPoints: 0,
        finalAllianceResult: "",
        finalViolations: "",
        finalPenalties: 0,
        finalNotes: "",
        teamNumber: 0,
        teamNickname: "",
      },
    };

    // Call the set method directly to update teams
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();
    expect(storeState.sessionKeys()).toEqual([
      { key: "SESSION-1" },
      { key: "SESSION-2" },
    ]);
  });

  it("Can edit a session by its key", () => {
    const newSessions: Record<string, MatchScoutingSession> = {
      "SESSION-1": {
        key: "SESSION-1",
        eventKey: "",
        matchKey: "",
        matchNumber: 0,
        alliance: "",
        allianceTeam: 0,
        scheduledTeamKey: "",
        scouterName: "",
        scoutedTeamKey: "",
        autoStartedWithNote: false,
        autoLeftStartArea: false,
        autoSpeakerScore: 0,
        autoSpeakerMiss: 0,
        autoAmpScore: 0,
        autoAmpMiss: 0,
        autoNotes: "",
        teleopSpeakerScore: 0,
        teleopSpeakerScoreAmplified: 0,
        teleopSpeakerMiss: 0,
        teleopAmpScore: 0,
        teleopAmpMiss: 0,
        teleopRelayPass: 0,
        teleopNotes: "",
        endgameTrapScore: "",
        endgameMicrophoneScore: "",
        endgameDidRobotPark: false,
        endgameDidRobotHang: false,
        endgameHarmony: "",
        endgameNotes: "",
        finalAllianceScore: 0,
        finalRankingPoints: 0,
        finalAllianceResult: "",
        finalViolations: "",
        finalPenalties: 0,
        finalNotes: "",
        teamNumber: 0,
        teamNickname: "",
      },
      "SESSION-2": {
        key: "SESSION-2",
        eventKey: "",
        matchKey: "",
        matchNumber: 0,
        alliance: "",
        allianceTeam: 0,
        scheduledTeamKey: "",
        scouterName: "",
        scoutedTeamKey: "",
        autoStartedWithNote: false,
        autoLeftStartArea: false,
        autoSpeakerScore: 0,
        autoSpeakerMiss: 0,
        autoAmpScore: 0,
        autoAmpMiss: 0,
        autoNotes: "",
        teleopSpeakerScore: 0,
        teleopSpeakerScoreAmplified: 0,
        teleopSpeakerMiss: 0,
        teleopAmpScore: 0,
        teleopAmpMiss: 0,
        teleopRelayPass: 0,
        teleopNotes: "",
        endgameTrapScore: "",
        endgameMicrophoneScore: "",
        endgameDidRobotPark: false,
        endgameDidRobotHang: false,
        endgameHarmony: "",
        endgameNotes: "",
        finalAllianceScore: 0,
        finalRankingPoints: 0,
        finalAllianceResult: "",
        finalViolations: "",
        finalPenalties: 0,
        finalNotes: "",
        teamNumber: 0,
        teamNickname: "",
      },
    };

    // Call the set method directly to update teams
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Edit the session.
    storeState.sessions["SESSION-1"].matchKey = "MATCH-1";

    // Validate only that session was updated.
    expect(storeState.sessions["SESSION-1"].matchKey).toEqual("MATCH-1");
    expect(storeState.sessions["SESSION-2"].matchKey).toEqual("");
  });
});
