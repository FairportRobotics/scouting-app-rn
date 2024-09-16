import { db } from "@/data/db";
import {
  events,
  eventMatches,
  eventTeams,
  Event,
  Match,
  Team,
  levity,
  Levity,
  eventMatchTeams,
  MatchTeam,
} from "@/data/schema";
import fetchFromCosmos from "@/helpers/fetchFromCosmos";

export default async () => {
  // Retrieve the URL and key from env.
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;

  const teams = await fetchFromCosmos<Team>(
    masterKey,
    account,
    "crescendo",
    "event_teams"
  );

  const levity = await fetchFromCosmos<Levity>(
    masterKey,
    account,
    "crescendo",
    "event_levity"
  );

  // Validate we returned data. If not, short-circuit and bail. We probably
  // have not loaded the lookup data into Cosmos so there is no reason to continue.
  if (teams === undefined) return;
  if (levity === undefined) return;

  // Clear all existing data.
  await db.delete(eventMatches);
  await db.delete(events);

  // Cache Event(s) from Cosmos.
  try {
    console.log("Events: Retrieve from Cosmos...");
    const results = await fetchFromCosmos<Event>(
      masterKey,
      account,
      "crescendo",
      "event"
    );

    if (results === undefined) return;

    results.forEach(async (event) => {
      console.log("Events: Cache", event.key);

      try {
        await db
          .insert(events)
          .values({
            key: event.key,
            name: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
          })
          .onConflictDoUpdate({
            target: events.key,
            set: {
              name: event.name,
              startDate: event.startDate,
              endDate: event.endDate,
            },
          });
        console.log("Events: Cached", event.key);
      } catch (error) {
        console.error("Error saving Event:", event);
        console.error(error);
      }
    });
  } catch (error) {
    console.warn("Error saving Event:"), error;
  }

  // Cache Matches from Cosmos.
  try {
    console.log("Matches: Retrieve from Cosmos...");
    const results = await fetchFromCosmos<Match>(
      masterKey,
      account,
      "crescendo",
      "event_matches"
    );

    if (results === undefined) return;

    results.forEach(async (match) => {
      console.log("Matches: Cache", match.key);

      try {
        await db
          .insert(eventMatches)
          .values({
            key: match.key,
            eventKey: match.eventKey,
            matchType: match.matchType,
            matchNumber: match.matchNumber,
            setNumber: match.setNumber,
            predictedTime: match.predictedTime,
          })
          .onConflictDoUpdate({
            target: eventMatches.key,
            set: {
              eventKey: match.eventKey,
              matchType: match.matchType,
              matchNumber: match.matchNumber,
              setNumber: match.setNumber,
              predictedTime: match.predictedTime,
            },
          });
        console.log("Matches: Cached", match.key);
      } catch (error) {
        console.error("Error saving Match:", match);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Matches:", error);
  }

  // // Clear the store.
  // useCacheStore.setState({
  //   event: {
  //     key: "",
  //     name: "",
  //     shortName: "",
  //     startDate: new Date(),
  //     endDate: new Date(),
  //   },
  //   matches: [],
  //   teams: [],
  //   levity: [],
  // });

  // // Set the store with the new lookups.
  // useCacheStore.setState((state) => ({
  //   ...state,
  //   event: events[0],
  //   matches: matches,
  //   teams: teams,
  //   levity: levity,
  // }));
};
