import { create } from "zustand";
import { Event, Match, Team, Levity } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";

export interface CacheState {
  event: Event;
  matches: Array<Match> | [];
  teams: Array<Team> | [];
  levity: Array<Levity> | [];
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      event: {} as Event,
      matches: [],
      teams: [],
      levity: [],
    }),
    {
      name: "cache-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
