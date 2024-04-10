import { create } from "zustand";
import { MatchScoutingSession, ItemKey } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./mmkv-storage";

export interface MatchScoutingState {
  currentKey: string | undefined;
  currentScouter: string;
  sessions: Record<string, MatchScoutingSession>;
  uploadedKeys: Array<ItemKey> | [];
  sessionKeys: () => Array<ItemKey> | [];
}

export const useMatchScoutingStore = create<MatchScoutingState>()(
  persist(
    (set, get) => ({
      currentKey: undefined,
      currentScouter: "",
      sessions: {},
      uploadedKeys: [],
      sessionKeys: () => {
        return Object.keys(get().sessions).map(
          (item) => ({ key: item } as ItemKey)
        );
      },
    }),
    {
      name: "match-scouting-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
