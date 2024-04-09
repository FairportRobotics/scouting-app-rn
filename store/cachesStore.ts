// https://kurthutten.com/blog/react-hook-lazy-loading-pattern/
// https://tkdodo.eu/blog/why-you-want-react-query
import { create } from "zustand";
import { Event, Match, Team } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

export interface CacheState {
  event: Event;
  matches: Array<Match> | [];
  teams: Array<Team> | [];
  refresh: () => void;
  getEvent: () => Promise<Event>;
  getMatches: () => Promise<Array<Match>>;
  getTeams: () => Promise<Array<Team>>;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  event: {} as Event,
  matches: [],
  teams: [],

  refresh: async () =>
    set({
      event: await Database.getEvent(),
      matches: await Database.getMatches(),
      teams: await Database.getTeams(),
    }),

  getEvent: async () => {
    if (get().event.key === undefined) {
      console.log("Loading Event from DB...");
      set({ event: await Database.getEvent() });
    }
    return get().event as Event;
  },

  getMatches: async () => {
    if (get().matches.length === 0) {
      console.log("Loading Matches from DB...");
      set({ matches: await Database.getMatches() });
      return get().matches as Array<Match>;
    }
    return get().matches as Array<Match>;
  },

  getTeams: async () => {
    if (get().teams.length === 0) {
      console.log("Loading Teams from DB...");
      set({ teams: await Database.getTeams() });
      return get().teams as Array<Team>;
    }
    return get().teams as Array<Team>;
  },
}));
