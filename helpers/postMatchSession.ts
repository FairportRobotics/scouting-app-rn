import axios from "axios";
import type { ItemKey, MatchScoutingSession } from "@/constants/Types";
import {
  MatchScoutingState,
  useMatchScoutingStore,
} from "@/store/matchScoutingStore";

export default async (session: MatchScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "match",
      data: session,
    };

    const response = await axios.post(saveUri, postData);
    const uploadedKeys = (response.data.data_for as Array<string>) || [];

    const storeState: MatchScoutingState = useMatchScoutingStore.getState();
    storeState.uploadedKeys = uploadedKeys.map(
      (item) => ({ key: item } as ItemKey)
    );
  } catch (error) {
    console.error(error);
  }
};
