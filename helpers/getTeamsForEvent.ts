import axios from "axios";
import type { TbaTeam } from "@/helpers/tbaTypes";
import type { Team } from "@/helpers/types";

export default async (eventKey: string) => {
  // Initialize the list of Match.
  let teams: Record<string, Team> = {};

  // Add the Practice Team.
  teams["practice"] = {
    key: "practice",
    teamNumber: "00000",
    name: "Practice Team",
    nickname: "Practice Team",
    schoolName: "Practice Team School",
    city: "Practice Team City",
    stateProv: "Practice Team State",
  } as Team;

  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  await axios
    .get(url, {
      headers: { "X-TBA-Auth-Key": tbaKey },
      responseType: "text",
    })
    .then((response) => {
      // Capture the Teams from the response.
      let tbaTeams: Array<TbaTeam> = JSON.parse(response.data);

      // Convert the array to a dictionary for faster and easier lookups.
      tbaTeams.forEach(
        (element: TbaTeam) =>
          (teams[element.key] = {
            key: element.key,
            teamNumber: element.team_number,
            name: element.name,
            nickname: element.nickname,
            schoolName: element.school_name,
            city: element.city,
            stateProv: element.state_prov,
          } as Team)
      );
    })
    .catch((error) => {
      console.error("There was a problem with your Axios request:", error);
    });

  return teams as Record<string, Team>;
};
