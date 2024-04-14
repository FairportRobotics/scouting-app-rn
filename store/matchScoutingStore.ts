import { create } from "zustand";
import { MatchScoutingSession, ItemKey } from "@/constants/Types";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MatchScoutingState {
  currentKey: string | undefined;
  sessions: Record<string, MatchScoutingSession>;
  uploadedKeys: Array<ItemKey>;

  isScouterSet: () => boolean;
  sessionKeys: () => Array<ItemKey>;
  setCurrentKey: (key: string) => void;
  saveUploadedKeys: (keys: Array<ItemKey>) => void;
  saveUploadedKey: (key: ItemKey) => void;
  saveSessions: (sessions: Record<string, MatchScoutingSession>) => void;
  saveSession: (session: MatchScoutingSession) => void;
}

export const useMatchScoutingStore = create<MatchScoutingState>()(
  persist(
    (set, get) => ({
      currentKey: undefined,
      sessions: {},
      uploadedKeys: [],

      isScouterSet: () => {
        // Get the current session key if one exists.
        let cc = get().currentKey;
        if (cc === undefined) return false;

        // Get the current session.
        let cs = get().sessions[cc];
        if (cs === undefined) return false;

        // Return the truthiness of the scouter name.
        let s = cs.scouterName;
        if (s) return true;
        else return false;
      },

      setCurrentKey: (key: string) => set({ currentKey: key }),

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
