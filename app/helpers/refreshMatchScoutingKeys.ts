import { ItemKey } from "@/constants/Types";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import { useCacheStore } from "@/store/cachesStore";
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

    // Filter the keys to only those for the event.
    const eventKey = useCacheStore.getState().event.key;
    const eventKeys = uploadedKeys
      .filter((key) => key.startsWith(eventKey))
      .map((item) => ({ key: item } as ItemKey));

    // Set the store with the new lookups.
    useMatchScoutingStore.setState((state) => ({
      ...state,
      uploadedKeys: eventKeys,
    }));
  } catch (error) {
    console.error(error);
  }
};
