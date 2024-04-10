import { create } from "zustand";
import { PitScoutingSession, ItemKey } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./mmkv-storage";

export interface PitScoutingState {
  currentKey: string | undefined;
  sessions: Array<PitScoutingSession> | [];
  uploadedKeys: Array<ItemKey> | [];
  sessionKeys: () => Array<ItemKey> | [];
}

export const usePitScoutingStore = create<PitScoutingState>()(
  persist(
    (set, get) => ({
      currentKey: undefined,
      sessions: [],
      uploadedKeys: [],
      sessionKeys: () => {
        return get().sessions.map(
          (session) => ({ key: session.key } as ItemKey)
        );
      },
    }),
    {
      name: "cache-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
