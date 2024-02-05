import axios from "axios";
import type { TbaMatch } from "@/constants/Types";

export default async (eventKey: string) => {
  // Define the API endpoint.
  let apiUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  const response = await axios(apiUrl, {
    headers: { "X-TBA-Auth-Key": tbaKey },
    responseType: "text",
  });

  let matches = JSON.parse(await response.data) as Array<TbaMatch>;
  let filteredMatches = matches.filter((match) => match.comp_level === "qm");
  return filteredMatches;
};
