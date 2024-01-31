import axios from "axios";
import type { TbaMatch } from "@/helpers/tbaTypes";

export default (eventKey: string) => {
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
  axios
    .get(url, {
      headers: { "X-TBA-Auth-Key": tbaKey, accept: "application/json" },
    })
    .then(async (response) => {
      let tbaMatches = await response.data;
      console.log("fetchEventMatches axios tbaMatches:", tbaMatches);
    })
    .catch((error) => {
      console.error("There was a problem with your Axios request:", error);
    });

  return matches as Array<TbaMatch>;
};
