import axios from "axios";
import {
  PitScoutingState,
  usePitScoutingStore,
} from "@/store/pitScoutingStore";
import { ItemKey } from "@/constants/Types";

export default async () => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      refresh: "1",
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
