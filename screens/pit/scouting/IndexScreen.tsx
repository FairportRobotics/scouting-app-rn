import { ScrollView, View, Text } from "react-native";
import { useEffect, useState } from "react";
import type { Team } from "@/helpers/types";
import * as Database from "@/helpers/database";
import SelectTeamScreen from "./SelectTeamScreen";

const Mode = {
  Select: { previousMode: "Select", nextMode: "Scout" },
  Scout: { previousMode: "Select", nextMode: "Select" },
};

export default function IndexScreen() {
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  // Current mode.
  const [mode, setMode] = useState(Mode.Select);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await Database.getTeamsForEvent(eventKey);
      setEventTeams(teams);
    };

    fetchData();

    // Cleanup function.
    return () => {};
  }, []);

  const handleOnSelect = (teamKey: string) => {
    console.log("IndexScreen handleTeamSelect teamKey:", teamKey);
  };

  return (
    <ScrollView>
      <View>
        {mode === Mode.Select && (
          <SelectTeamScreen onSelect={(teamKey) => handleOnSelect(teamKey)} />
        )}
      </View>
    </ScrollView>
  );
}
