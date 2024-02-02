import { Text, ScrollView, View, Button } from "react-native";
import { useEffect, useState } from "react";
import type { Event, Match, Team } from "@/helpers/types";
import * as Database from "@/helpers/database";

import ContainerGroup from "@/components/ContainerGroup";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";

import SelectMatchScreen from "@/screens/match/scouting/SelectMatchScreen";
import ConfirmScreen from "@/screens/match/scouting/ConfirmScreen";
import AutoScreen from "@/screens/match/scouting/AutoScreen";
import TeleopScreen from "@/screens/match/scouting/TeleopScreen";
import EndgameScreen from "@/screens/match/scouting/EndgameScreen";
import FinalScreen from "@/screens/match/scouting/FinalScreen";

const Mode = {
  Select: { previousMode: "Select", nextMode: "Confirm" },
  Confirm: { previousMode: "Select", nextMode: "Auto" },
  Auto: { previousMode: "Confirm", nextMode: "Teleop" },
  Teleop: { previousMode: "Auto", nextMode: "Endgame" },
  Endgame: { previousMode: "Teleop", nextMode: "Final" },
  Final: { previousMode: "Endgame", nextMode: "Select" },
};

export default function IndexScreen() {
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);
  const [mode, setMode] = useState(Mode.Select);

  useEffect(() => {
    console.log("useEffect start...");
    const loadData = async () => {
      // Load data from the DB. Hard-code for ease of development experience.
      let eventKey: string = "2023nyrr";
      const dtoEvent = await Database.getEvent(eventKey);
      const dtoMatches = await Database.getMatchesForEvent(eventKey);
      const dtoTeams = await Database.getTeamsForEvent(eventKey);

      // Assign to state.
      setCurrentEvent(dtoEvent);
      setEventMatches(dtoMatches);
      setEventTeams(dtoTeams);

      // Sanity check.
      console.log("Loaded Event:", currentEvent);
      console.log("Loaded Matches:", eventMatches.length);
      console.log("Loaded Teams:", eventTeams.length);

      console.log("useEffect loadData end.");
    };
    loadData();
    console.log("useEffect end.");
  }, []);

  const handleChangeMode = (newMode: string) => {
    switch (newMode) {
      case "Select":
        setMode(Mode.Select);
        break;
      case "Confirm":
        setMode(Mode.Confirm);
        break;
      case "Auto":
        setMode(Mode.Auto);
        break;
      case "Teleop":
        setMode(Mode.Teleop);
        break;
      case "Endgame":
        setMode(Mode.Endgame);
        break;
      case "Final":
        setMode(Mode.Final);
        break;
      default:
        setMode(Mode.Select);
        break;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader />
      <ScrollView>
        <View style={{ flex: 1 }}>
          {mode === Mode.Select && <SelectMatchScreen />}
          {mode === Mode.Confirm && <ConfirmScreen />}
          {mode === Mode.Auto && <AutoScreen />}
          {mode === Mode.Teleop && <TeleopScreen />}
          {mode === Mode.Endgame && <EndgameScreen />}
          {mode === Mode.Final && <FinalScreen />}
        </View>
        {mode !== Mode.Select && (
          <ContainerGroup title="">
            <View
              style={{
                flexDirection: "row",
                gap: 100,
                alignSelf: "center",
              }}
            >
              <Button
                title={mode.previousMode}
                onPress={() => handleChangeMode(mode.previousMode)}
              />
              <Button
                title={mode.nextMode}
                onPress={() => handleChangeMode(mode.nextMode)}
              />
            </View>
          </ContainerGroup>
        )}
      </ScrollView>
    </View>
  );
}
