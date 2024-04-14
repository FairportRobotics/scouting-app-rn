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
      "MATCH-SESSION-1": {} as MatchScoutingSession,
      "MATCH-SESSION-2": {} as MatchScoutingSession,
    };

    // Call the set method directly to update teams
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();
    expect(storeState.sessionKeys()).toEqual([
      { key: "MATCH-SESSION-1" },
      { key: "MATCH-SESSION-2" },
    ]);
  });

  it("Can edit a session by its key", () => {
    const newSessions: Record<string, MatchScoutingSession> = {
      "MATCH-SESSION-1": {} as MatchScoutingSession,
      "MATCH-SESSION-2": {} as MatchScoutingSession,
    };

    // Call the set method directly to update teams
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Edit the session.
    storeState.sessions["MATCH-SESSION-1"].matchKey = "MATCH-1";

    // Validate only that session was updated.
    expect(storeState.sessions["MATCH-SESSION-1"].matchKey).toEqual("MATCH-1");
    expect(storeState.sessions["MATCH-SESSION-2"].matchKey).toEqual(undefined);
  });

  it("isScouterSet returns false when undefined", () => {
    useMatchScoutingStore.setState((state) => ({
      ...state,
      currentScouter: undefined,
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Validate only that session was updated.
    expect(storeState.isScouterSet()).toEqual(false);
  });

  it("isScouterSet returns false when no sessions", () => {
    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Validate only that session was updated.
    expect(storeState.isScouterSet()).toEqual(false);
  });

  it("isScouterSet returns false when current session scouter name is not set", () => {
    const newSessions: Record<string, MatchScoutingSession> = {
      "MATCH-SESSION-1": { scouterName: "John Doe" } as MatchScoutingSession,
      "MATCH-SESSION-2": { scouterName: "Jane Smith" } as MatchScoutingSession,
    };

    // Call the set method directly to update sessions.
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
      currentKey: "MATCH-SESSION-3",
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Validate only that session was updated.
    expect(storeState.isScouterSet()).toEqual(false);
  });

  it("isScouterSet returns true when current session scouter name is set", () => {
    const newSessions: Record<string, MatchScoutingSession> = {
      "MATCH-SESSION-1": { scouterName: "John Doe" } as MatchScoutingSession,
      "MATCH-SESSION-2": { scouterName: "Jane Smith" } as MatchScoutingSession,
    };

    // Call the set method directly to update sessions.
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: newSessions,
      currentKey: "MATCH-SESSION-1",
    }));

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();

    // Validate only that session was updated.
    expect(storeState.isScouterSet()).toEqual(true);
  });
});
