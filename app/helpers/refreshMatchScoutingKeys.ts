import { ItemKey } from "@/constants/Types";
import {
  MatchScoutingState,
  useMatchScoutingStore,
} from "@/store/matchScoutingStore";
import axios from "axios";

export default async () => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "match",
      refresh: "1",
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
