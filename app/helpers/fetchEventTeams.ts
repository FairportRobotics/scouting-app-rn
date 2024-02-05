import axios from "axios";
import type { TbaTeam } from "@/app/helpers/tbaTypes";

export default async (eventKey: string) => {
  // Define the API endpoint.
  let apiUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  const response = await axios(apiUrl, {
    headers: { "X-TBA-Auth-Key": tbaKey },
    responseType: "text",
  });

  return JSON.parse(await response.data) as Array<TbaTeam>;
};
