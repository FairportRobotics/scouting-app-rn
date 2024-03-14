import axios from "axios";
import type { PitScoutingSession } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

export default async (session: PitScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      data: session,
    };

    const response = await axios.post(saveUri, postData);
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    await Database.savePitScoutingSessionKeys(uploadedKeys);
  } catch (error) {
    console.error(error);
  }
};
