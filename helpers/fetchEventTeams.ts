import axios from "axios";
import type { TbaTeam } from "@/helpers/tbaTypes";
import type { Team } from "@/helpers/types";

export default async (eventKey: string) => {
  // Initialize the list of Match.
  let teams: Array<TbaTeam> = [];

  // Add the Practice Team.
  teams.push({
    key: "practice",
    team_number: "00000",
    name: "Practice Team",
    nickname: "Practice Team",
  } as TbaTeam);

  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  const response = await axios(url, {
    headers: { "X-TBA-Auth-Key": tbaKey },
    responseType: "text",
  });

  teams = [...JSON.parse(await response.data)];

  return teams as Array<TbaTeam>;
};
