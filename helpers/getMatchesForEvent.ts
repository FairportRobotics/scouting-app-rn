import axios from "axios";
import type { TbaMatch } from "@/helpers/tbaTypes";
import type { Match } from "@/helpers/types";

export default async (eventKey: string) => {
  // Initialize the list of Match.
  let matches: Record<string, Match> = {};

  // Seed with a Practice Match.
  matches["practice"] = {
    key: "practice",
    matchNumber: 0,
    predictedTime: new Date(0),
    blueTeams: ["00000", "00000", "00000"],
    redTeams: ["00000", "00000", "00000"],
  } as Match;

  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  await axios
    .get(url, {
      headers: { "X-TBA-Auth-Key": tbaKey },
      responseType: "text",
    })
    .then((response) => {
      let tbaMatches: Array<TbaMatch> = JSON.parse(response.data);

      tbaMatches = tbaMatches.filter(
        (match: TbaMatch) => match.comp_level == "qm"
      );
      tbaMatches.sort((a: TbaMatch, b: TbaMatch) => {
        return a.match_number - b.match_number;
      });

      // Convert the array to a dictionary for faster and easier lookups.
      tbaMatches.forEach(
        (element: TbaMatch) =>
          (matches[element.key] = {
            key: element.key,
            matchNumber: element.match_number,
            predictedTime: new Date(1000 * element.predicted_time),
            blueTeams: [
              ...element.alliances.blue.team_keys,
              ...element.alliances.blue.surrogate_team_keys,
            ],
            redTeams: [
              ...element.alliances.red.team_keys,
              ...element.alliances.red.surrogate_team_keys,
            ],
          } as Match)
      );
    })
    .catch((error) => {
      console.error("There was a problem with your Axios request:", error);
    });

  return matches as Record<string, Match>;
};
