import axios from "axios";
import * as Database from "@/app/helpers/database";

export default async () => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      refresh: "1",
    };

    const response = await axios.post(saveUri, postData);
    const keys = (response.data.data_for as Array<string>) || [];
    await Database.savePitScoutingSessionKeys(keys);
  } catch (error) {
    console.error(error);
  }
};
