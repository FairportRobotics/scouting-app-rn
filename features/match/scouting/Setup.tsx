import { TextInput, Text, View, ScrollView } from "react-native";
import type { Match, Team } from "@/helpers/types";
import storage from "@/helpers/storage";
import themes from "../../../themes/themes";
import { useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";

export default function Setup() {
  // [ ] Scouter Name (text)
  // [ ] Team being scouted if it is not the Team scheduled (select)
  // Support for retrieving Event Matches and Teams.
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  // Retrieve Teams from the cache.
  const retrieveEventData = async () => {
    await storage.load({ key: "event-teams" }).then((ret) => {
      setEventTeams(ret);
    });
  };
  retrieveEventData();

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
