import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import type { Team } from "@/helpers/types";
import * as Database from "@/helpers/database";
import SelectTeamRow from "./SelectTeamRow";

interface SelectTeamScreenProps {
  onSelect: (teamKey: string) => void;
}

const SelectTeamScreen: React.FC<SelectTeamScreenProps> = ({ onSelect }) => {
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await Database.getTeams();
      setEventTeams(teams);
    };

    fetchData();
  }, []);

  const handleOnSelect = (teamKey: string) => {
    onSelect(teamKey);
  };

  return (
    <ScrollView>
      {eventTeams.map((team: Team) => (
        <SelectTeamRow
          key={team.key}
          team={team}
          onSelect={() => handleOnSelect(team.key)}
        />
      ))}
    </ScrollView>
  );
};

export default SelectTeamScreen;
