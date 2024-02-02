import axios from "axios";
import type { Event, Match, Team, MatchScoutingSession } from "@/helpers/types";
import * as Database from "@/helpers/database";
import { TbaTeam } from "./tbaTypes";

let tbaKey = "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs";

export default async (eventKey: string) => {
  const fetchTeamFromTba = async (teamKey: string) => {
    try {
      let apiUrl = `https://www.thebluealliance.com/api/v3/team/${teamKey}`;
      const response = await axios(apiUrl, {
        headers: { "X-TBA-Auth-Key": tbaKey },
        responseType: "text",
      });
      tbaTeams[teamKey] = JSON.parse(await response.data) as TbaTeam;
    } catch (error) {
      tbaTeams[teamKey] = {
        key: teamKey,
        team_number: "00000",
        name: "Practice",
        nickname: "Practice",
      } as TbaTeam;
    }
  };

  // Load all Matches and Teams.
  const matches = await Database.getMatchesForEvent(eventKey);
  const teams = await Database.getTeamsForEvent(eventKey);

  // Create a Dictionary so we can easily lookup Teams.
  const teamsLookup: Record<string, Team> = {};
  teams.forEach((team) => {
    teamsLookup[team.key] = team;
  });

  // Populate the Dictionary with Team Keys from Matches that do not
  // exist in the list of Teams TBA returned for the Event Key.
  let missingTeams: Record<string, string> = {};
  const testTeamKey = (teamKey: string) => {
    let team = teamsLookup[teamKey];
    if (team === undefined) missingTeams[teamKey] = teamKey;
  };

  matches.forEach((match) => {
    testTeamKey(match.blue1TeamKey);
    testTeamKey(match.blue2TeamKey);
    testTeamKey(match.blue3TeamKey);
    testTeamKey(match.red1TeamKey);
    testTeamKey(match.red2TeamKey);
    testTeamKey(match.red3TeamKey);
  });

  // Enumerate over the Team keys and attempt to fetch the Team information
  // from TBA.
  let tbaTeams: Record<string, TbaTeam | undefined> = {};
  let teamKeys = Object.keys(missingTeams);
  await Promise.all(teamKeys.map((teamKey) => fetchTeamFromTba(teamKey)));

  // Let's look at the teams we're going to insert.
  const teamsToPersist = Object.values(tbaTeams) as Array<TbaTeam>;
  Database.saveEventTeams(eventKey, teamsToPersist);
};