import React, { useEffect, useState } from "react";
import { View, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Check,
  ContainerGroup,
  MinusPlusPair,
  OptionSelect,
} from "@/app/components";
import { RootStackParamList } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

function EndgameScreen() {
  const router = useRouter();

  const route =
    useRoute<RouteProp<RootStackParamList, "ScoutMatchEditScreen">>();
  const { id } = route.params;

  const [sessionKey, setSessionKey] = useState<string>(id);

  const [trapScore, setTrapScore] = useState<number>(0);
  const [microphoneScore, setMicrophoneScore] = useState<number>(0);
  const [didRobotPark, setDidRobotPark] = useState<boolean>(false);
  const [didRobotHang, setDidRobotHang] = useState<boolean>(false);
  const [harmonyScore, setHarmonyScore] = useState<string>("NOT_SET");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [trapScore, microphoneScore, didRobotPark, didRobotHang, harmonyScore]);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setTrapScore(dtoSession?.endgameTrapScore ?? 0);
      setMicrophoneScore(dtoSession?.endgameMicrophoneScore ?? 0);
      setDidRobotPark(dtoSession?.endgameDidRobotPark ?? false);
      setDidRobotHang(dtoSession?.endgameDidRobotHang ?? false);
      setHarmonyScore(dtoSession?.endgameHarmony ?? null);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.saveMatchScoutingSessionEndgame(
        sessionKey,
        trapScore,
        microphoneScore,
        didRobotPark,
        didRobotHang,
        harmonyScore ?? ""
      );
    } catch (error) {}
  };

  const handleDidRobotHang = (value: boolean) => {
    setDidRobotHang(value);
    if (!value) setHarmonyScore("");
  };

  const navigatePrevious = () => {
    saveData();
    router.push(`/scout-match/teleop/${sessionKey}`);
  };

  const navigateNext = () => {
    saveData();
    router.push(`/scout-match/final/${sessionKey}`);
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
