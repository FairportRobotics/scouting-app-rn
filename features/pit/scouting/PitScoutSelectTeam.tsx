import { Text, View, ScrollView } from "react-native";
import { useState } from "react";
import type { Team } from "@/helpers/types";
import storage from "@/helpers/storage";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import PitTeamSelect from "@/components/PitTeamSelect";

export default function PitScoutSelectTeam() {
  // [ ] Retrieve Teams from cache
  // [ ] Enumerate over Teams and emit a row that provides the following:
  //     [ ] Team Number
  //     [ ] Team Nickname
  //     [ ] Action to Edit (lighter color if already scouted)

  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  // Retrieve Teams from the cache.
  const retrieveEventData = async () => {
    await storage.load({ key: "event-teams" }).then((ret) => {
      setEventTeams(ret);
    });
  };
  retrieveEventData();

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
