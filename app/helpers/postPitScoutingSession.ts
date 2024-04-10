import axios from "axios";
import type { ItemKey, PitScoutingSession } from "@/constants/Types";
import {
  PitScoutingState,
  usePitScoutingStore,
} from "@/store/pitScoutingStore";

export default async (session: PitScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      data: session,
    };

    const response = await axios.post(saveUri, postData);
    const uploadedKeys = (response.data.data_for as Array<string>) || [];

    const storeState: PitScoutingState = usePitScoutingStore.getState();
    storeState.uploadedKeys = uploadedKeys.map(
      (item) => ({ key: item } as ItemKey)
    );
  } catch (error) {
    console.error(error);
  }
};
