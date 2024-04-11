import { Event, Match, Team } from "@/constants/Types";
import fetchFromCosmos from "@/app/helpers/fetchFromCosmos";
import { useCacheStore } from "@/store/cachesStore";

export default async () => {
  // Retrieve the URL and key from env.
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;

  // Retrieve the Event, Matches and Teams from Cosmos.
  const events = await fetchFromCosmos<Event>(
    masterKey,
    account,
    "crescendo",
    "event"
  );

  const matches = await fetchFromCosmos<Match>(
    masterKey,
    account,
    "crescendo",
    "event_matches"
  );

  const teams = await fetchFromCosmos<Team>(
    masterKey,
    account,
    "crescendo",
    "event_teams"
  );

  // Validate we returned data. If not, short-circuit and bail. We probably
  // have not loaded the lookup data into Cosmos so there is no reason to continue.
  if (events === undefined || events.length != 1) return;
  if (matches === undefined) return;
  if (teams === undefined) return;

  // Clear the store.
  useCacheStore.setState({
    event: {
      key: "",
      name: "",
      shortName: "",
      startDate: new Date(),
      endDate: new Date(),
    },
    matches: [],
    teams: [],
  });

  // Set the store with the new lookups.
  useCacheStore.setState((state) => ({
    ...state,
    event: events[0],
    matches: matches,
    teams: teams,
  }));
};
