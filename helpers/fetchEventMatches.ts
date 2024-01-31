import axios from "axios";
import type { TbaMatch } from "@/helpers/tbaTypes";

export default async (eventKey: string) => {
  // Initialize the list of Match.
  let matches: Array<TbaMatch> = [];

  // Seed with a Practice Match.
  matches.push({
    key: "practice",
    match_number: 0,
    comp_level: "qm",
    predicted_time: 0,
  } as TbaMatch);

  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  const response = await axios(url, {
    headers: { "X-TBA-Auth-Key": tbaKey },
    responseType: "text",
  });

  const rawResponse = await response.data;
  console.log("fetchEventMatches rawResponse:", rawResponse);
  const jsonResponse = JSON.parse(rawResponse) as Array<TbaMatch>;
  console.log("fetchEventMatches jsonResponse:", jsonResponse);

  matches = [...jsonResponse];

  return matches as Array<TbaMatch>;
};
