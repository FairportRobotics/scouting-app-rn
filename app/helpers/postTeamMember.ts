import axios from "axios";
import type { TeamMember } from "@/constants/Types";

export default async (teamMember: TeamMember) => {
  try {
    const saveUri = process.env.EXPO_PUBLIC_SAVE_URI as string;

    const postData = {
      type: "team",
      data: teamMember,
    };

    const response = await axios.post(saveUri, postData);
    return response;
  } catch (error) {
    console.error(error);
  }
};
