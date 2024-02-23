import axios from "axios";
import type { PitScoutingSession } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

function expandQuestions(session: PitScoutingSession): Record<string, string> {
  const expandedSession: Record<string, string> = {
    key: session.key,
    eventKey: session.eventKey,
  };

  for (const key in session.questions) {
    if (session.questions.hasOwnProperty(key)) {
      const questionKey = session.questions[key].key;
      expandedSession[questionKey] = session.questions[key].value;
    }
  }

  return expandedSession;
}

export default async (session: PitScoutingSession) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "pit",
      data: expandQuestions(session),
    };

    const response = await axios.post(saveUri, postData);
    const uploadedKeys = (response.data.data_for as Array<string>) || [];
    await Database.savePitScoutingSessionKeys(uploadedKeys);
  } catch (error) {
    console.error(error);
  }
};
