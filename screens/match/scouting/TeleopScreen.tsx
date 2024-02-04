import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Button, ScrollView } from "react-native";
import { ContainerGroup, MinusPlusPair } from "@/components";
import ROUTES from "@/constants/routes";
import * as Database from "@/helpers/database";

function TeleopScreen({ navigation }) {
  const { params } = useRoute();
  const sessionKey = params["sessionKey"];

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
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);

    setSpeakerScore(dtoSession?.teleopSpeakerScore ?? 0);
    setSpeakerScoreAmplified(dtoSession?.teleopSpeakerScoreAmplified ?? 0);
    setSpeakerMiss(dtoSession?.teleopSpeakerMiss ?? 0);

    setAmpScore(dtoSession?.teleopAmpScore ?? 0);
    setAmpMiss(dtoSession?.teleopAmpMiss ?? 0);

    setPass(dtoSession?.teleopRelayPass ?? 0);
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionTeleop(
      sessionKey,
      speakerScore,
      speakerScoreAmplified,
      speakerMiss,
      ampScore,
      ampMiss,
      pass
    );
  };

  const navigatePrevious = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_AUTO, {
      sessionKey: sessionKey,
    });
  };

  const navigateNext = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_ENDGAME, {
      sessionKey: sessionKey,
    });
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
