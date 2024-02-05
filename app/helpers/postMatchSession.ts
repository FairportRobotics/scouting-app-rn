import axios from "axios";
import type { MatchScoutingSession } from "@/app/helpers/types";
import * as Database from "@/app/helpers/database";

export default async (session: MatchScoutingSession) => {
  // Load App Settings.
  const appSettings = await Database.getSettings("dev");
  if (appSettings === undefined) return;

  // Create the payload.
  const payload = {
    type: "match",
    data: JSON.stringify(session),
  };

  // Post.
  const response = await axios.post(appSettings.saveUri, payload);
  console.log(response);

  return response;
};
