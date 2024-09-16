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
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;

  // const levity = await fetchFromCosmos<Levity>(
  //   masterKey,
  //   account,
  //   "crescendo",
  //   "event_levity"
  // );

  // Clear all existing data.
  await db.delete(eventMatchTeams);
  await db.delete(eventTeams);
  await db.delete(eventMatches);
  await db.delete(events);

  //
  await refreshEvents(masterKey, account);
  await refreshMatches(masterKey, account);
  await refreshTeams(masterKey, account);
  await refreshMatchTeams(masterKey, account);
};

async function refreshEvents(masterKey: string, account: string) {
  // Cache Event(s) from Cosmos.
  try {
    console.log("Events: Retrieve from Cosmos and cache...");
    const results = await fetchFromCosmos<Event>(
      masterKey,
      account,
      "crescendo",
      "event"
    );

    if (results === undefined) return;

    results.forEach(async (event) => {
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
      } catch (error) {
        console.error("Error saving Event:", event);
        console.error(error);
      }
    });
  } catch (error) {
    console.warn("Error saving Event:"), error;
  }
}

async function refreshMatches(masterKey: string, account: string) {
  // Cache Matches from Cosmos.
  try {
    console.log("Matches: Retrieve from Cosmos and cache...");
    const results = await fetchFromCosmos<Match>(
      masterKey,
      account,
      "crescendo",
      "event_match"
    );

    if (results === undefined) return;

    results.forEach(async (match) => {
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
      } catch (error) {
        console.error("Error saving Match:", match);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Matches:", error);
  }
}

async function refreshTeams(masterKey: string, account: string) {
  // Cache Teams from Cosmos.
  try {
    console.log("Teams: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<Team>(
      masterKey,
      account,
      "crescendo",
      "event_team"
    );

    if (results === undefined) return;

    results.forEach(async (team) => {
      try {
        await db
          .insert(eventTeams)
          .values({
            key: team.key,
            number: team.number,
            nickname: team.nickname ?? "(Team nickname not known)",
            schoolName: team.schoolName ?? "(Team school not known)",
          })
          .onConflictDoUpdate({
            target: eventTeams.key,
            set: {
              number: team.number,
              nickname: team.nickname ?? "(Team nickname not known)",
              schoolName: team.schoolName ?? "(Team school not known)",
            },
          });
      } catch (error) {
        console.error("Error saving Team:", team);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Teams:", error);
  }
}

async function refreshMatchTeams(masterKey: string, account: string) {
  // Cache MatchTeams from Cosmos.
  try {
    console.log("Match Teams: Retrieve from Cosmos and cache...");

    const results = await fetchFromCosmos<MatchTeam>(
      masterKey,
      account,
      "crescendo",
      "event_match_team"
    );

    if (results === undefined) return;

    results.forEach(async (matchTeam) => {
      try {
        await db
          .insert(eventMatchTeams)
          .values({
            key: matchTeam.key,
            eventKey: matchTeam.eventKey,
            matchKey: matchTeam.matchKey,
            alliance: matchTeam.alliance,
            allianceTeam: matchTeam.allianceTeam,
            teamKey: matchTeam.teamKey,
          })
          .onConflictDoUpdate({
            target: eventMatchTeams.key,
            set: {
              eventKey: matchTeam.eventKey,
              matchKey: matchTeam.matchKey,
              alliance: matchTeam.alliance,
              allianceTeam: matchTeam.allianceTeam,
              teamKey: matchTeam.teamKey,
            },
          });
      } catch (error) {
        console.error("Error saving MatchTeam:", eventMatchTeams);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving MatchTeams:", error);
  }
}
