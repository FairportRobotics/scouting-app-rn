import axios from "axios";
import { PitScoutingSession } from "@/data/schema";
import { saveUploadedPitSessionKey } from "@/data/db";

export default async (session: PitScoutingSession) => {
  console.log("postPitScoutingSession", session);
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    // TODO: Add eventKey to this BS.
    const postData = {
      type: "pit",
      data: { ...session, key: session.id },
    };

    const response = await axios.post(saveUri, postData);

    // Persist the uploaded keys.
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    uploadedKeys.forEach(async (key) => {
      await saveUploadedPitSessionKey(key);
    });
  } catch (error) {
    console.error({ error });
  }
};
