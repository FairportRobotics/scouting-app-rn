import axios from "axios";
import { PitScoutingSession } from "@/data/schema";
import { saveUploadedPitSessionKey } from "@/data/db";

export default async (session: PitScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      data: session,
    };

    const response = await axios.post(saveUri, postData);

    // Persist the uploaded keys.
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    uploadedKeys.forEach(async (key) => {
      await saveUploadedPitSessionKey(key);
    });
  } catch (error) {
    console.error(error);
  }
};
