import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ContainerGroup,
  MinusPlusPair,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

function TeleopScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const matchStore = useMatchScoutingStore();

  // States.
  const [sessionKey, setSessionKey] = useState<string>(id);
  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);
  const [pass, setPass] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [
    speakerScore,
    speakerScoreAmplified,
    speakerMiss,
    ampScore,
    ampMiss,
    pass,
  ]);

  const loadData = async () => {
    // Retrieve from stores.
    if (!(id in matchStore.sessions)) return;
    const cacheSession = matchStore.sessions[id];

    // Validate.
    if (cacheSession === undefined) return;

    setSpeakerScore(cacheSession.teleopSpeakerScore ?? 0);
    setSpeakerScoreAmplified(cacheSession.teleopSpeakerScoreAmplified ?? 0);
    setSpeakerMiss(cacheSession.teleopSpeakerMiss ?? 0);
    setAmpScore(cacheSession.teleopAmpScore ?? 0);
    setAmpMiss(cacheSession.teleopAmpMiss ?? 0);
    setPass(cacheSession.teleopRelayPass ?? 0);
    setNotes(cacheSession?.teleopNotes ?? "");
  };

  const saveData = async () => {
    if (!(id in matchStore.sessions)) return;

    // Set properties and save.
    let current = matchStore.sessions[id];
    current.teleopSpeakerScore = speakerScore;
    current.teleopSpeakerScoreAmplified = speakerScoreAmplified;
    current.teleopSpeakerMiss = speakerMiss;
    current.teleopAmpScore = ampScore;
    current.teleopAmpMiss = ampMiss;
    current.teleopRelayPass = pass;
    current.teleopNotes = notes;
    matchStore.saveSession(current);
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/auto/${id}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/endgame/${id}`);
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
      <ContainerGroup title="Speaker">
        <MinusPlusPair
          label="Score: Non-Amplified"
          count={speakerScore}
          onChange={(delta) => setSpeakerScore(speakerScore + delta)}
        />
        <MinusPlusPair
          label="Score: Amplified"
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
      <ContainerGroup title="Relay">
        <MinusPlusPair
          label="Passes"
          count={pass}
          onChange={(delta) => setPass(pass + delta)}
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
            placeholder="Teleop notes..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

      <MatchScoutingNavigation
        previousLabel="Auto"
        nextLabel="Endgame"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default TeleopScreen;
