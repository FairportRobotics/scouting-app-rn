import axios from "axios";
import { MatchScoutingSession } from "@/data/schema";
import { saveUploadedMatchSessionKey } from "@/data/db";

export default async (session: MatchScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "match",
      data: { ...session, key: session.id },
    };

    const response = await axios.post(saveUri, postData);

    // Persist the uploaded keys.
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    uploadedKeys.forEach(async (key) => {
      await saveUploadedMatchSessionKey(key);
    });
  } catch (error) {
    console.error(error);
  }
};
