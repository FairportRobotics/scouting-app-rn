import { useEffect, useState } from "react";
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
import { MatchScoutingSession } from "@/constants/Types";
import postMatchSession from "@/app/helpers/postMatchSession";
import * as Database from "@/app/helpers/database";

function EndgameScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<MatchScoutingSession>();
  const [sessionKey, setSessionKey] = useState<string>(id);
  const [trapScore, setTrapScore] = useState<string>("0");
  const [microphoneScore, setMicrophoneScore] = useState<string>("0");
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
      setTrapScore(dtoSession?.endgameTrapScore ?? "0");
      setMicrophoneScore(dtoSession?.endgameMicrophoneScore ?? "0");
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
        trapScore ?? "0",
        microphoneScore ?? "0",
        didRobotPark,
        didRobotHang,
        harmonyScore ?? ""
      );
    } catch (error) {}
  };

  const uplodaData = async () => {
    try {
      const session = await Database.getMatchScoutingSession(sessionKey);
      if (session !== undefined) await postMatchSession(session);
    } catch (error) {}
  };

  const handleDidRobotPark = (value: boolean) => {
    setDidRobotPark(value);
    setDidRobotHang(false);
    setHarmonyScore("0");
  };

  const handleDidRobotHang = (value: boolean) => {
    setDidRobotHang(value);
    setDidRobotPark(false);
    setHarmonyScore("0");
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/teleop/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    uplodaData();
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
        <SelectGroup
          title="Trap"
          options={["0", "1", "2", "3"]}
          value={trapScore}
          required={true}
          onChange={(value) => setTrapScore(value ?? "0")}
        />
        <SelectGroup
          title="Microphone"
          options={["0", "1", "2", "3"]}
          value={microphoneScore}
          required={true}
          onChange={(value) => setMicrophoneScore(value ?? "0")}
        />
        <Check
          style={{ marginTop: 18 }}
          label="Did robot Park?"
          checked={didRobotPark}
          onToggle={() => handleDidRobotPark(!didRobotPark)}
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
