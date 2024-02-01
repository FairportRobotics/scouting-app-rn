import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import ContainerGroup from "@/components/ContainerGroup";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ScoutingMatchSelect from "@/components/ScoutingMatchSelect";
import type { Match, Team } from "@/helpers/types";
import * as Database from "@/helpers/database";

const eventKey = "2023nyrr";

export default function SelectMatchScreen() {
  // Support for retrieving Event Matches and Teams.
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  useEffect(() => {
    const fetchData = async () => {
      setEventMatches(await Database.getMatchesForEvent(eventKey));

      const teams = await Database.getTeamsForEvent(eventKey);

      let teamsDictionary: Record<string, Team> = {};
      teams.forEach((team) => {
        teamsDictionary[team.key] = team;
      });

      setEventTeams(teamsDictionary);
    };

    fetchData();

    // Cleanup function.
    return () => {};
  }, []);

  const handleMatchSelect = async (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => {
    await Database.initializeMatchScoutingSession(
      eventKey,
      matchKey,
      alliance,
      allianceTeam,
      teamKey
    );
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Select Match and Team">
        {Object.values(eventMatches).map((match) => (
          <ScoutingMatchSelect
            key={match.key}
            match={match}
            teamsLookup={eventTeams}
            onSelect={(matchKey, alliance, allianceNumber, teamKey) =>
              handleMatchSelect(matchKey, alliance, allianceNumber, teamKey)
            }
          />
        ))}
      </ContainerGroup>
    </ScrollView>
  );
}
