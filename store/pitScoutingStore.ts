import { create } from "zustand";
import { PitScoutingSession, ItemKey } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";

export interface PitScoutingState {
  currentKey: string | undefined;
  sessions: Record<string, PitScoutingSession>;
  uploadedKeys: Array<ItemKey> | [];
  sessionKeys: () => Array<ItemKey> | [];
}

export const usePitScoutingStore = create<PitScoutingState>()(
  persist(
    (set, get) => ({
      currentKey: undefined,
      sessions: {},
      uploadedKeys: [],
      sessionKeys: () => {
        return Object.keys(get().sessions).map(
          (item) => ({ key: item } as ItemKey)
        );
      },
    }),
    {
      name: "pit-scouting-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
