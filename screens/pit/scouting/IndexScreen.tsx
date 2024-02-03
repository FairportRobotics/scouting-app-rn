import { ScrollView, View, Button } from "react-native";
import { useEffect, useRef, useState } from "react";
import type { PitScoutingSession } from "@/helpers/types";
import SelectTeamScreen from "./SelectTeamScreen";
import ScoutTeamScreen from "./ScoutTeamScreen";
import * as Database from "@/helpers/database";

const Mode = {
  Select: { previousMode: "Select", nextMode: "Scout" },
  Scout: { previousMode: "Select", nextMode: "Select" },
};

export default function IndexScreen() {
  // Current mode.
  const [mode, setMode] = useState(Mode.Select);
  const [teamKey, setTeamKey] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    return () => {};
  }, [mode]);

  const handleSelectTeam = async (teamKey: string) => {
    // Initialize Session in DB.
    let session = {
      key: teamKey,
    } as PitScoutingSession;

    // Initialize and retrieve the Session.
    await Database.initializePitScoutingSession(session);

    setMode(Mode.Scout);
    setTeamKey(teamKey);
  };

  const handleOnComplete = () => {
    setMode(Mode.Select);
  };

  return (
    <ScrollView ref={scrollViewRef}>
      <View>
        {mode === Mode.Select && (
          <SelectTeamScreen onSelect={(teamKey) => handleSelectTeam(teamKey)} />
        )}
        {mode === Mode.Scout && (
          <ScoutTeamScreen
            sessionKey={teamKey}
            onComplete={() => handleOnComplete()}
          />
        )}
        <Button title="Return to Select" onPress={() => setMode(Mode.Select)} />
      </View>
    </ScrollView>
  );
}
