import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import PitTeamSelect from "@/components/PitTeamSelect";
import type { Team } from "@/helpers/types";
import * as Database from "@/helpers/database";

export default function SelectTeamScreen() {
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await Database.getTeamsForEvent(eventKey);
      setEventTeams(teams);
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
      {eventTeams.map((team) => (
        <PitTeamSelect
          key={team.key}
          team={team}
          onPress={() => handleTeamSelect(team.key)}
        />
      ))}
    </ScrollView>
  );
}
