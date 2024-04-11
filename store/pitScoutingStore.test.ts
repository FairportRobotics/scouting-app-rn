import { Event, Match, PitScoutingSession, Team } from "@/constants/Types";
import { PitScoutingState, usePitScoutingStore } from "./pitScoutingStore";

describe("Pit Scouting Store", () => {
  beforeEach(() => {
    usePitScoutingStore.setState({
      currentKey: undefined,
      sessions: {},
      uploadedKeys: [],
    });
  });

  it("When no sessions exist, sessionKeys() returns empty array", () => {
    const storeState: PitScoutingState = usePitScoutingStore.getState();
    expect(storeState.sessionKeys()).toEqual([]);
  });

  it("When sessions exist, sessionKeys() returns array of the keys", () => {
    const newSessions: Record<string, PitScoutingSession> = {
      "TEAM-1": {} as PitScoutingSession,
      "TEAM-2": {} as PitScoutingSession,
    };

    // Call the set method directly to update teams
    usePitScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: PitScoutingState = usePitScoutingStore.getState();
    expect(storeState.sessionKeys()).toEqual([
      { key: "TEAM-1" },
      { key: "TEAM-2" },
    ]);
  });

  it("Can edit a session by its key", () => {
    const newSessions: Record<string, PitScoutingSession> = {
      "TEAM-1": {} as PitScoutingSession,
      "TEAM-2": {} as PitScoutingSession,
    };

    // Call the set method directly to update teams
    usePitScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: PitScoutingState = usePitScoutingStore.getState();

    // Edit the session.
    storeState.sessions["TEAM-1"].key = "TEAM-1";

    // Validate only that session was updated.
    expect(storeState.sessions["TEAM-1"].key).toEqual("TEAM-1");
    expect(storeState.sessions["TEAM-2"].key).toEqual(undefined);
  });
});
