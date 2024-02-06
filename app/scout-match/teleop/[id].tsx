import React, { useEffect, useState } from "react";
import { View, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ContainerGroup, MinusPlusPair } from "@/app/components";
import { RootStackParamList } from "@/constants/Types";
import * as Database from "@/app/helpers/database";

function TeleopScreen() {
  const router = useRouter();

  const route =
    useRoute<RouteProp<RootStackParamList, "ScoutMatchEditScreen">>();
  const { id } = route.params;

  const [sessionKey, setSessionKey] = useState<string>(id);

  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);
  const [pass, setPass] = useState<number>(0);

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
      setSpeakerScore(dtoSession.teleopSpeakerScore ?? 0);
      setSpeakerScoreAmplified(dtoSession.teleopSpeakerScoreAmplified ?? 0);
      setSpeakerMiss(dtoSession.teleopSpeakerMiss ?? 0);
      setAmpScore(dtoSession.teleopAmpScore ?? 0);
      setAmpMiss(dtoSession.teleopAmpMiss ?? 0);
      setPass(dtoSession.teleopRelayPass ?? 0);
    } catch (error) {
      console.log(error);
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
        pass
      );
    } catch (error) {
      console.error(error);
    }
  };

  const navigatePrevious = () => {
    saveData();
    router.replace(`/scout-match/auto/${sessionKey}`);
  };

  const navigateNext = () => {
    saveData();
    router.replace(`/scout-match/endgame/${sessionKey}`);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
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

      <ContainerGroup title="">
        <View style={{ flexDirection: "row" }}>
          <Button title="Previous" onPress={navigatePrevious} />
          <Button title="Next" onPress={navigateNext} />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}

export default TeleopScreen;
