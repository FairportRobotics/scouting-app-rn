import { useEffect, useState } from "react";
import { ScrollView, KeyboardAvoidingView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ContainerGroup,
  SelectGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import {
  getMatchScoutingSessionForEdit,
  MatchScoutingSessionModel,
  saveMatchSessionEndgame,
} from "@/data/db";
import Loading from "@/components/Loading";

function EndgameScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
  const [trapScore, setTrapScore] = useState<string>("0");
  const [microphoneScore, setMicrophoneScore] = useState<string>("0");
  const [didRobotPark, setDidRobotPark] = useState<boolean>(false);
  const [didRobotHang, setDidRobotHang] = useState<boolean>(false);
  const [harmonyScore, setHarmonyScore] = useState<string>("NONE_SELECTED");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;
    console.log("Endgame Before:\n", JSON.stringify(dbSession, null, 2));

    setSession(dbSession);
    setTrapScore(dbSession.endgameTrapScore ?? "0");
    setMicrophoneScore(dbSession.endgameMicrophoneScore ?? "0");
    setDidRobotPark(dbSession.endgameDidRobotPark ?? false);
    setDidRobotHang(dbSession.endgameDidRobotHang ?? false);
    setHarmonyScore(dbSession.endgameHarmony ?? "0");
    setNotes(dbSession.endgameNotes ?? "");
  };

  const saveData = async () => {
    if (!session) return;

    // Set properties and save.
    session.endgameTrapScore = trapScore;
    session.endgameMicrophoneScore = microphoneScore;
    session.endgameDidRobotPark = didRobotPark;
    session.endgameDidRobotHang = didRobotHang;
    session.endgameHarmony = harmonyScore;
    session.endgameNotes = notes;
    console.log("Endgame After:\n", JSON.stringify(session, null, 2));

    await saveMatchSessionEndgame(session);
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
    router.replace(`/(scout-match)/teleop/${id}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/final/${id}`);
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
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
          title="Harmony (Number of other robots on the same chain)"
          options={["0", "1", "2"]}
          required={true}
          disabled={!didRobotHang}
          value={harmonyScore}
          onChange={(value) => setHarmonyScore(value ?? "NONE_SELECTED")}
        />
      </ContainerGroup>

      <KeyboardAvoidingView behavior="position">
        <ContainerGroup title="Notes">
          <TextInput
            multiline
            maxLength={1024}
            style={[Styles.textInput, { height: 80 }]}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Endgame notes..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

      <MatchScoutingNavigation
        previousLabel="Teleop"
        nextLabel="Final"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default EndgameScreen;
