import { create } from "zustand";
import { Event, Match, Team } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";

export interface CacheState {
  event: Event;
  matches: Array<Match> | [];
  teams: Array<Team> | [];
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      event: {} as Event,
      matches: [],
      teams: [],
    }),
    {
      name: "cache-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
