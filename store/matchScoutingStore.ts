import { create } from "zustand";
import { MatchScoutingSession, ItemKey } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MatchScoutingState {
  currentKey: string | undefined;
  currentScouter: string;
  sessions: Record<string, MatchScoutingSession>;
  uploadedKeys: Array<ItemKey>;
  sessionKeys: () => Array<ItemKey>;

  setCurrentKey: (key: string) => void;
  setCurrentScouter: (name: string) => void;

  saveUploadedKeys: (keys: Array<ItemKey>) => void;
  saveUploadedKey: (key: ItemKey) => void;

  saveSessions: (sessions: Record<string, MatchScoutingSession>) => void;
  saveSession: (session: MatchScoutingSession) => void;
}

export const useMatchScoutingStore = create<MatchScoutingState>()(
  persist(
    (set, get) => ({
      currentKey: undefined,
      currentScouter: "",
      sessions: {},
      uploadedKeys: [],

      setCurrentKey: (key: string) => set({ currentKey: key }),

      setCurrentScouter: (name: string) => set({ currentScouter: name }),

      saveUploadedKeys: (uploadedKeys: Array<ItemKey>) =>
        set({ uploadedKeys: uploadedKeys }),

      saveUploadedKey: (key: ItemKey) => {
        let current = get().uploadedKeys;
        if (!current.some((currentKey) => currentKey.key == key.key)) {
          current.push(key);
          set({ uploadedKeys: current });
        }
      },

      saveSessions: (sessions: Record<string, MatchScoutingSession>) =>
        set({ sessions: sessions }),

      saveSession: async (session: MatchScoutingSession) => {
        let current = get().sessions;
        if (!(session.key in current)) {
          current[session.key] = session;
          set({ sessions: current });
        }
      },

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
