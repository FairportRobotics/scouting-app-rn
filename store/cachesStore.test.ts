import { Event, Match, Team } from "@/constants/Types";
import { CacheState, useCacheStore } from "./cachesStore";

describe("Cache Store", () => {
  beforeEach(() => {
    useCacheStore.setState({
      event: {
        key: "",
        name: "",
        shortName: "",
        startDate: new Date(),
        endDate: new Date(),
      },
      matches: [],
      teams: [],
    });
  });

  it("Sets event correctly", () => {
    const newEvent: Event = {
      key: "some-key",
      name: "Event Name",
      shortName: "Event Short Name",
      startDate: new Date(),
      endDate: new Date(),
    };

    // Call the set method directly to set the event
    useCacheStore.setState((state) => ({ ...state, event: newEvent }));

    // Get the current state of the store
    const storeState: CacheState = useCacheStore.getState();

    expect(storeState.event).toEqual(newEvent);
  });

  it("Updates matches correctly", () => {
    const newMatches: Match[] = [
      {
        key: "M-1",
        matchType: "qm",
        setNumber: 1,
        matchNumber: 1,
        predictedTime: "2024-01-02",
        blue1TeamKey: "B1",
        blue2TeamKey: "B2",
        blue3TeamKey: "B3",
        red1TeamKey: "R1",
        red2TeamKey: "R2",
        red3TeamKey: "R3",
      },
      {
        key: "M-2",
        matchType: "qm",
        setNumber: 1,
        matchNumber: 2,
        predictedTime: "2024-01-03",
        blue1TeamKey: "B11",
        blue2TeamKey: "B12",
        blue3TeamKey: "B13",
        red1TeamKey: "R11",
        red2TeamKey: "R12",
        red3TeamKey: "R13",
      },
    ];

    // Call the set method directly to update matches
    useCacheStore.setState((state) => ({ ...state, matches: newMatches }));

    // Get the current state of the store
    const storeState: CacheState = useCacheStore.getState();

    expect(storeState.matches).toEqual(newMatches);
  });

  it("Updates teams correctly", () => {
    const newTeams: Team[] = [
      {
        key: "T1",
        teamNumber: "1",
        name: "Team 1",
        nickname: "One",
        schoolName: "School 1",
      },
      {
        key: "T2",
        teamNumber: "2",
        name: "Team 2",
        nickname: "Two",
        schoolName: "School 2",
      },
    ];

    // Call the set method directly to update teams
    useCacheStore.setState((state) => ({ ...state, teams: newTeams }));

    // Get the current state of the store
    const storeState: CacheState = useCacheStore.getState();

    expect(storeState.teams).toEqual(newTeams);
  });
});
