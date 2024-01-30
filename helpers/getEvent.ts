import axios from "axios";
import type { TbaEvent } from "@/helpers/tbaTypes";
import type { Event } from "@/helpers/types";

export default async (eventKey: string) => {
  // Initialize the list of Match.
  let event: Event = {
    key: "",
    name: "",
    shortName: "",
    startDate: new Date(0),
    endDate: new Date(0),
    city: "",
    stateProv: "",
  };

  // Define the API endpoint.
  let url = `https://www.thebluealliance.com/api/v3/event/${eventKey}`;
  let tbaKey =
    "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

  // Make a GET request with custom headers
  await axios
    .get(url, {
      headers: { "X-TBA-Auth-Key": tbaKey },
      responseType: "text",
    })
    .then((response) => {
      let tbaEvent: TbaEvent = JSON.parse(response.data);

      event = {
        key: tbaEvent.key,
        name: tbaEvent.name,
        shortName: tbaEvent.short_name,
        startDate: new Date(tbaEvent.start_date),
        endDate: new Date(tbaEvent.end_date),
        city: tbaEvent.city,
        stateProv: tbaEvent.state_prov,
      } as Event;
    })
    .catch((error) => {
      console.error("There was a problem with your Axios request:", error);
    });

  return event as Event;
};
