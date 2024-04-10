import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import {
  Check,
  MinusPlusPair,
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import * as Database from "@/app/helpers/database";
import { MatchScoutingSession } from "@/constants/Types";
import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";

function AutoScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const matchStore = useMatchScoutingStore();

  // States.
  const [sessionKey, setSessionKey] = useState<string>(id);
  const [startedWithNote, setStartedWithNote] = useState<boolean>(true);
  const [leftStartArea, setLeftStartArea] = useState<boolean>(false);
  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const loadData = async () => {
    // Retrieve from stores.
    if (!(id in matchStore.sessions)) return;
    const cacheSession = matchStore.sessions[id];

    // Validate.
    if (cacheSession === undefined) return;

    // Set State.
    setStartedWithNote(cacheSession.autoStartedWithNote ?? true);
    setLeftStartArea(cacheSession.autoLeftStartArea ?? false);
    setSpeakerScore(cacheSession.autoSpeakerScore ?? 0);
    setSpeakerMiss(cacheSession.autoSpeakerMiss ?? 0);
    setAmpScore(cacheSession.autoAmpScore ?? 0);
    setAmpMiss(cacheSession.autoAmpMiss ?? 0);
    setNotes(cacheSession?.autoNotes ?? "");
  };

  const saveData = async () => {
    if (!(id in matchStore.sessions)) return;
    matchStore.sessions[id].key = sessionKey;
    matchStore.sessions[id].autoStartedWithNote = startedWithNote;
    matchStore.sessions[id].autoLeftStartArea = leftStartArea;
    matchStore.sessions[id].autoSpeakerScore = speakerScore;
    matchStore.sessions[id].autoSpeakerMiss = speakerMiss;
    matchStore.sessions[id].autoAmpScore = ampScore;
    matchStore.sessions[id].autoAmpMiss = ampMiss;
    matchStore.sessions[id].autoNotes = notes;
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [
    startedWithNote,
    leftStartArea,
    speakerScore,
    speakerMiss,
    ampScore,
    ampMiss,
    notes,
  ]);

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/confirm/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/teleop/${sessionKey}`);
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
      <ContainerGroup title="Start">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 8,
            width: "100%",
          }}
        >
          <Check
            label="Started with Note"
            checked={startedWithNote}
            onToggle={() => setStartedWithNote(!startedWithNote)}
          />
          <Check
            label="Robot exited the Robot Starting Zone (crossed the line between Speaker & Stage)"
            checked={leftStartArea}
            onToggle={() => setLeftStartArea(!leftStartArea)}
          />
        </View>
      </ContainerGroup>

      <ContainerGroup title="Speaker:">
        <MinusPlusPair
          label="Score"
          count={speakerScore}
          onChange={(delta) => setSpeakerScore(speakerScore + delta)}
        />
        <MinusPlusPair
          label="Miss"
          count={speakerMiss}
          onChange={(delta) => setSpeakerMiss(speakerMiss + delta)}
        />
      </ContainerGroup>

      <ContainerGroup title="Amp">
        <MinusPlusPair
          label="Score"
          count={ampScore}
          onChange={(delta) => setAmpScore(ampScore + delta)}
        />
        <MinusPlusPair
          label="Miss"
          count={ampMiss}
          onChange={(delta) => setAmpMiss(ampMiss + delta)}
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
            placeholder="Auto notes..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

      <MatchScoutingNavigation
        previousLabel="Confirm"
        nextLabel="Teleop"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default AutoScreen;
