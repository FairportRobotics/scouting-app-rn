import axios from "axios";
import type { MatchAssignment } from "@/constants/Types";

export default async (assignment: MatchAssignment) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "assignment",
      data: assignment,
    };

    const response = await axios.post(saveUri, postData);
    return response;
  } catch (error) {
    console.error(error);
  }
};
