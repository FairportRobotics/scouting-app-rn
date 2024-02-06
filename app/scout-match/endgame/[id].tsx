import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ContainerGroup,
  MinusPlusPair,
  OptionSelect,
} from "@/app/components";
import * as Database from "@/app/helpers/database";
import Navigation from "../Navigation";

function EndgameScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sessionKey, setSessionKey] = useState<string>(id);
  const [trapScore, setTrapScore] = useState<number>(0);
  const [microphoneScore, setMicrophoneScore] = useState<number>(0);
  const [didRobotPark, setDidRobotPark] = useState<boolean>(false);
  const [didRobotHang, setDidRobotHang] = useState<boolean>(false);
  const [harmonyScore, setHarmonyScore] = useState<string>("NONE_SELECTED");

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
      console.log(
        "EndgameScreen dtoSession:",
        JSON.stringify(dtoSession, null, 2)
      );
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

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/scout-match/teleop/${sessionKey}`);
  };

  const handleNavigateDone = () => {
    saveData();
    router.replace(`/`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/scout-match/final/${sessionKey}`);
  };

  return (
    <View style={{ flex: 1 }}>
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
            onChange={(value) => setHarmonyScore(value ?? "NONE_SELECTED")}
          />
        )}
      </ContainerGroup>

      <Navigation
        previousLabel="Teleop"
        doneLabel="Done"
        nextLabel="Final"
        onPrevious={() => handleNavigatePrevious()}
        onDone={() => handleNavigateDone()}
        onNext={() => handleNavigateNext()}
      />
    </View>
  );
}

export default EndgameScreen;
