import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, ScrollView, View } from "react-native";
import {
  Check,
  ContainerGroup,
  MinusPlusPair,
  OptionSelect,
} from "@/components";
import ROUTES from "@/constants/routes";
import * as Database from "@/helpers/database";

function EndgameScreen({ navigation }) {
  const { params } = useRoute();
  const sessionKey = params["sessionKey"];

  const [trapScore, setTrapScore] = useState<number>(0);
  const [microphoneScore, setMicrophoneScore] = useState<number>(0);
  const [didRobotPark, setDidRobotPark] = useState<boolean>(false);
  const [didRobotHang, setDidRobotHang] = useState<boolean>(false);
  const [harmonyScore, setHarmonyScore] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [trapScore, microphoneScore, didRobotPark, didRobotHang, harmonyScore]);

  const loadData = async () => {
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);

    setTrapScore(dtoSession?.endgameTrapScore ?? 0);
    setMicrophoneScore(dtoSession?.endgameMicrophoneScore ?? 0);
    setDidRobotPark(dtoSession?.endgameDidRobotPark ?? false);
    setDidRobotHang(dtoSession?.endgameDidRobotHang ?? false);
    setHarmonyScore(dtoSession?.endgameHarmony ?? "");
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionEndgame(
      sessionKey,
      trapScore,
      microphoneScore,
      didRobotPark,
      didRobotHang,
      harmonyScore
    );
  };

  const handleDidRobotHang = (value: boolean) => {
    setDidRobotHang(value);
    if (!value) setHarmonyScore("");
  };

  const navigatePrevious = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_TELEOP, {
      sessionKey: sessionKey,
    });
  };

  const navigateNext = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_FINAL, {
      sessionKey: sessionKey,
    });
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <ContainerGroup title="Stage">
        <MinusPlusPair
          label="Trap"
          count={trapScore}
          onChange={(delta) => setTrapScore(trapScore + delta)}
        />
        <MinusPlusPair
          label="Microphone"
          count={microphoneScore}
          onChange={(delta) => setMicrophoneScore(microphoneScore + delta)}
        />
        <Check
          style={{ marginTop: 18 }}
          label="Did robot Park?"
          checked={didRobotPark}
          onToggle={() => setDidRobotPark(!didRobotPark)}
        />
        <Check
          style={{ marginTop: 18 }}
          label="Did robot Hang?"
          checked={didRobotHang}
          onToggle={() => handleDidRobotHang(!didRobotHang)}
        />
        {didRobotHang && (
          <OptionSelect
            label="Harmony"
            options={["0", "1", "2"]}
            value={harmonyScore}
            onChange={(value) => setHarmonyScore(value)}
          />
        )}
      </ContainerGroup>

      <ContainerGroup title="">
        <View style={{ flexDirection: "row" }}>
          <Button title="Previous" onPress={navigatePrevious} />
          <Button title="Next" onPress={navigateNext} />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}

export default EndgameScreen;
