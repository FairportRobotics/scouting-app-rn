import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import type { Match, Team } from "@/helpers/types";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import ScoutingMatchSelect from "@/components/ScoutingMatchSelect";
import * as Database from "@/helpers/database";
import { useNavigation } from "@react-navigation/native";
import MatchSetup from "@/features/match/scouting/Setup";

export default function SelectMatch() {
  const navigation = useNavigation();

  // Support for retrieving Event Matches and Teams.
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
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
