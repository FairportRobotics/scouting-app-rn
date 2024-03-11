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
import * as Database from "@/app/helpers/database";
import { MatchScoutingSession } from "@/constants/Types";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

function TeleopScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<MatchScoutingSession>();
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
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setSession(dtoSession);
      setSpeakerScore(dtoSession.teleopSpeakerScore ?? 0);
      setSpeakerScoreAmplified(dtoSession.teleopSpeakerScoreAmplified ?? 0);
      setSpeakerMiss(dtoSession.teleopSpeakerMiss ?? 0);
      setAmpScore(dtoSession.teleopAmpScore ?? 0);
      setAmpMiss(dtoSession.teleopAmpMiss ?? 0);
      setPass(dtoSession.teleopRelayPass ?? 0);
      setNotes(dtoSession?.teleopNotes ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.saveMatchScoutingSessionTeleop(
        sessionKey,
        speakerScore,
        speakerScoreAmplified,
        speakerMiss,
        ampScore,
        ampMiss,
        pass,
        notes
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/auto/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/endgame/${sessionKey}`);
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
