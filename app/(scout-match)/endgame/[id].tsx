import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ContainerGroup,
  SelectGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import postMatchSession from "@/app/helpers/postMatchSession";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

function EndgameScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const matchStore = useMatchScoutingStore();

  // States.
  const [trapScore, setTrapScore] = useState<string>("0");
  const [microphoneScore, setMicrophoneScore] = useState<string>("0");
  const [didRobotPark, setDidRobotPark] = useState<boolean>(false);
  const [didRobotHang, setDidRobotHang] = useState<boolean>(false);
  const [harmonyScore, setHarmonyScore] = useState<string>("NONE_SELECTED");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [trapScore, microphoneScore, didRobotPark, didRobotHang, harmonyScore]);

  const loadData = async () => {
    // Retrieve from stores.
    if (!(id in matchStore.sessions)) return;
    const cacheSession = matchStore.sessions[id];

    // Validate.
    if (cacheSession === undefined) return;

    setTrapScore(cacheSession.endgameTrapScore ?? "0");
    setMicrophoneScore(cacheSession.endgameMicrophoneScore ?? "0");
    setDidRobotPark(cacheSession.endgameDidRobotPark ?? false);
    setDidRobotHang(cacheSession.endgameDidRobotHang ?? false);
    setHarmonyScore(cacheSession.endgameHarmony ?? "0");
    setNotes(cacheSession.endgameNotes ?? "");
  };

  const saveData = async () => {
    if (!(id in matchStore.sessions)) return;

    matchStore.sessions[id].endgameTrapScore = trapScore;
    matchStore.sessions[id].endgameMicrophoneScore = microphoneScore;
    matchStore.sessions[id].endgameDidRobotPark = didRobotPark;
    matchStore.sessions[id].endgameDidRobotHang = didRobotHang;
    matchStore.sessions[id].endgameHarmony = harmonyScore;
    matchStore.sessions[id].endgameNotes = notes;

    postMatchSession(matchStore.sessions[id]);
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

  if (!(id in matchStore.sessions)) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={matchStore.sessions[id]} />
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
            style={[Styles.textInput, { height: 100 }]}
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
