import { TextInput, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";

export default function Setup() {
  // These will ultimately be initialized with values, if any, from the database.
  // That is not wired up yet as I'm still learing about navigation/routing.
  const [scouterName, setScouterName] = useState("");
  const [scoutedTeam, setScoutedTeam] = useState("");

  // Option A: Respond to each changed value and persist immediately. This will
  // result in a call to the DB on each keystroke for TextInput and once for each
  // -/+ for counters and check/uncheck for checkboxes. This seems excessive but
  // we're also dealing with a single-user DB so it might not be a big deal.
  useEffect(() => {
    // Hard-code the session key for now.
    let sessionKey = "2023nyrr__2023nyrr_qm3__Blue__1";
    Database.saveScoutingMatchSessionSetup(
      sessionKey,
      scouterName,
      scoutedTeam
    );
  }, [scouterName, scoutedTeam]);

  // Option B: Respond only when component comes into scope or goes out of scope.
  // For example, when navigation is implemented, this would be called once
  // as we navigate away from this screen and so we will make a single call to
  // update the database.
  // useEffect(() => {
  //   let sessionKey = "2023nyrr__2023nyrr_qm3__Blue__1";
  //   Database.saveScoutingMatchSessionSetup(
  //     sessionKey,
  //     scouterName,
  //     scoutedTeam
  //   );
  // }, []);

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
