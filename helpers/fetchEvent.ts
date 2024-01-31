import axios from "axios";
import type { TbaEvent } from "@/helpers/tbaTypes";

export default async (eventKey: string) => {
  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  const response = await axios(url, {
    headers: { "X-TBA-Auth-Key": tbaKey },
    responseType: "text",
  });

  return JSON.parse(await response.data) as TbaEvent;
};
