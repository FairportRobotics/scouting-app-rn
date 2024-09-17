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
} from "@/components";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import {
  getMatchScoutingSessionForEdit,
  MatchScoutingSessionModel,
  saveMatchSessionTeleop,
} from "@/data/db";

function TeleopScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
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

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;
    console.log("Teleop Before:n", JSON.stringify(dbSession, null, 2));

    // Set State.
    setSession(dbSession);
    setSpeakerScore(dbSession.teleopSpeakerScore ?? 0);
    setSpeakerScoreAmplified(dbSession.teleopSpeakerScoreAmplified ?? 0);
    setSpeakerMiss(dbSession.teleopSpeakerMiss ?? 0);
    setAmpScore(dbSession.teleopAmpScore ?? 0);
    setAmpMiss(dbSession.teleopAmpMiss ?? 0);
    setPass(dbSession.teleopRelayPass ?? 0);
    setNotes(dbSession?.teleopNotes ?? "");
  };

  const saveData = async () => {
    if (!session) return;

    session.teleopSpeakerScore = speakerScore;
    session.teleopSpeakerScoreAmplified = speakerScoreAmplified;
    session.teleopSpeakerMiss = speakerMiss;
    session.teleopAmpScore = ampScore;
    session.teleopAmpMiss = ampMiss;
    session.teleopRelayPass = pass;
    session.teleopNotes = notes;
    console.log("Teleop Before:n", JSON.stringify(session, null, 2));

    saveMatchSessionTeleop(session);
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/auto/${id}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/endgame/${id}`);
  };

  if (!session) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />
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
            style={[Styles.textInput, { height: 80 }]}
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
