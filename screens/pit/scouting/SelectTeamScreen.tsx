import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import PitTeamSelect from "@/components/PitTeamSelect";
import type { Team } from "@/helpers/types";
import * as Database from "@/helpers/database";

export default function SelectTeamScreen() {
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  useEffect(() => {
    const fetchData = async () => {
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

  const handleTeamSelect = (teamKey: string) => {
    console.log("handleTeamSelect teamKey:", teamKey);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      {Object.values(eventTeams)
        .sort(
          (a: Team, b: Team) => parseInt(a.teamNumber) - parseInt(b.teamNumber)
        )
        .map((team) => (
          <PitTeamSelect
            key={team.key}
            team={team}
            onPress={() => handleTeamSelect(team.key)}
          />
        ))}
    </ScrollView>
  );
}
