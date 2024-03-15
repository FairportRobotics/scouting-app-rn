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

function AutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<MatchScoutingSession>();
  const [sessionKey, setSessionKey] = useState<string>(id);
  const [startedWithNote, setStartedWithNote] = useState<boolean>(true);
  const [leftStartArea, setLeftStartArea] = useState<boolean>(false);
  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setSession(dtoSession);
      setStartedWithNote(dtoSession.autoStartedWithNote ?? true);
      setLeftStartArea(dtoSession.autoLeftStartArea ?? false);
      setSpeakerScore(dtoSession.autoSpeakerScore ?? 0);
      setSpeakerScoreAmplified(dtoSession.autoSpeakerScoreAmplified ?? 0);
      setSpeakerMiss(dtoSession.autoSpeakerMiss ?? 0);
      setAmpScore(dtoSession.autoAmpScore ?? 0);
      setAmpMiss(dtoSession.autoAmpMiss ?? 0);
      setNotes(dtoSession?.autoNotes ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.saveMatchScoutingSessionAuto(
        sessionKey,
        startedWithNote,
        leftStartArea,
        speakerScore,
        speakerScoreAmplified,
        speakerMiss,
        ampScore,
        ampMiss,
        notes
      );
    } catch (error) {
      console.error(error);
    }
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
    speakerScoreAmplified,
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

  if (session === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />
      <ContainerGroup title="Start">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 3,
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
          label="Score: Unamplified"
          count={speakerScore}
          onChange={(delta) => setSpeakerScore(speakerScore + delta)}
        />
        <MinusPlusPair
          label="Speaker: Amplified"
          count={speakerScoreAmplified}
          onChange={(delta) =>
            setSpeakerScoreAmplified(speakerScoreAmplified + delta)
          }
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
