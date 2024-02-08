import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ContainerGroup,
  MinusPlusPair,
  SelectGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import * as Database from "@/app/helpers/database";
import { MatchScoutingSession } from "@/constants/Types";

function EndgameScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<MatchScoutingSession>();
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
      setSession(dtoSession);
      setTrapScore(dtoSession?.endgameTrapScore ?? 0);
      setMicrophoneScore(dtoSession?.endgameMicrophoneScore ?? 0);
      setDidRobotPark(dtoSession?.endgameDidRobotPark ?? false);
      setDidRobotHang(dtoSession?.endgameDidRobotHang ?? false);
      setHarmonyScore(dtoSession?.endgameHarmony ?? "NONE_SELECTED");
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
    setHarmonyScore("0");
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/teleop/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/final/${sessionKey}`);
  };

  if (session === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />
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
        <SelectGroup
          title="Harmony"
          options={["0", "1", "2"]}
          required={true}
          disabled={!didRobotHang}
          value={harmonyScore}
          onChange={(value) => setHarmonyScore(value ?? "NONE_SELECTED")}
        />
      </ContainerGroup>

      <MatchScoutingNavigation
        previousLabel="Teleop"
        nextLabel="Final"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </View>
  );
}

export default EndgameScreen;
