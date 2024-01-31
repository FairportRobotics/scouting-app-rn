import { TextInput, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";

export default function Setup() {
  // [ ] Scouter Name (text)
  // [ ] Team being scouted if it is not the Team scheduled (select)
  // Support for retrieving Event Matches and Teams.
  const [scouterName, setScouterName] = useState("");
  const [scoutedTeam, setScoutedTeam] = useState("");

  useEffect(() => {
    let sessionKey = "2023nyrr__2023nyrr_qm3__Blue__1";
    Database.saveScoutingMatchSessionSetup(
      sessionKey,
      scouterName,
      scoutedTeam
    );
  }, [scouterName, scoutedTeam]);

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
        <TextInput
          value={scoutedTeam}
          onChangeText={(text) => setScoutedTeam(text)}
          placeholder="Scouted Team key"
        />
      </ContainerGroup>
    </ScrollView>
  );
}
