import { TextInput, Text, ScrollView } from "react-native";
import { useState } from "react";
import type { Team } from "@/helpers/types";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";

export default function Setup() {
  // [ ] Scouter Name (text)
  // [ ] Team being scouted if it is not the Team scheduled (select)
  // Support for retrieving Event Matches and Teams.
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  // Support for Scouter Name
  const [scouterName, setScouterName] = useState("");

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Scouter Name">
        <TextInput
          value={scouterName}
          onChangeText={(text) => setScouterName(text)}
          placeholder="My name is..."
        />
      </ContainerGroup>
      <ContainerGroup title="Team Confirmation">
        <Text>
          Placeholder for showing the scheduled team and a mechanism to allow
          the user to override the scheduled team.
        </Text>
      </ContainerGroup>
    </ScrollView>
  );
}
