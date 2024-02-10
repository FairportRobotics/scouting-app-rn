import axios from "axios";
import type { MatchScoutingSession } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

export default async (session: MatchScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "match",
      data: session,
    };

    const response = await axios.post(saveUri, postData);
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    await Database.saveMatchScoutingSessionKeys(uploadedKeys);
  } catch (error) {
    console.error(error);
  }
};
