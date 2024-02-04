import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, ScrollView, Button } from "react-native";
import getDefaultMatchScoutingSession, {
  MatchScoutingSession,
} from "@/helpers/types";
import Check from "@/components/Check";
import MinusPlusPair from "@/components/MinusPlusPair";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";
import ROUTES from "@/constants/routes";

function AutoScreen({ navigation }) {
  const { params } = useRoute();
  let sessionKey = params["sessionKey"];

  const [autoStartedWithNote, setAutoStartedWithNote] =
    useState<boolean>(false);
  const [autoLeftStartArea, setAutoLeftStartArea] = useState<boolean>(false);

  const [autoSpeakerScore, setAutoSpeakerScore] = useState<number>(0);
  const [autoSpeakerScoreAmplified, setAutoSpeakerScoreAmplified] =
    useState<number>(0);
  const [autoSpeakerMiss, setAutoSpeakerMiss] = useState<number>(0);

  const [autoAmpScore, setAutoAmpScore] = useState<number>(0);
  const [autoAmpMiss, setAutoAmpMiss] = useState<number>(0);

  const loadData = async () => {
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);

    setAutoStartedWithNote(dtoSession?.autoStartedWithNote ?? false);
    setAutoLeftStartArea(dtoSession?.autoLeftStartArea ?? false);

    setAutoSpeakerScore(dtoSession?.autoSpeakerScore ?? 0);
    setAutoSpeakerScoreAmplified(dtoSession?.autoSpeakerScoreAmplified ?? 0);
    setAutoSpeakerMiss(dtoSession?.autoSpeakerMiss ?? 0);

    setAutoAmpScore(dtoSession?.autoAmpScore ?? 0);
    setAutoAmpMiss(dtoSession?.autoAmpMiss ?? 0);
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionAuto(
      sessionKey,
      autoStartedWithNote,
      autoLeftStartArea,
      autoSpeakerScore,
      autoSpeakerScoreAmplified,
      autoSpeakerMiss,
      autoAmpScore,
      autoAmpMiss
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [
    autoStartedWithNote,
    autoLeftStartArea,
    autoSpeakerScore,
    autoSpeakerScoreAmplified,
    autoSpeakerMiss,
    autoAmpScore,
    autoAmpMiss,
  ]);

  const navigatePrevious = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_CONFIRM, {
      sessionKey: sessionKey,
    });
  };

  const navigateNext = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_TELEOP, {
      sessionKey: sessionKey,
    });
  };

  return (
    <ScrollView style={{ margin: 10 }}>
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
            checked={autoStartedWithNote}
            onToggle={() => setAutoStartedWithNote(!autoStartedWithNote)}
          />
          <Check
            label="Left Start Area"
            checked={autoLeftStartArea}
            onToggle={() => setAutoLeftStartArea(!autoLeftStartArea)}
          />
        </View>
      </ContainerGroup>

      <ContainerGroup title="Speaker:">
        <MinusPlusPair
          label="Score: Unamplified"
          count={autoSpeakerScore}
          onChange={(delta) => setAutoSpeakerScore(autoSpeakerScore + delta)}
        />
        <MinusPlusPair
          label="Speaker: Amplified"
          count={autoSpeakerScoreAmplified}
          onChange={(delta) =>
            setAutoSpeakerScoreAmplified(autoSpeakerScoreAmplified + delta)
          }
        />
        <MinusPlusPair
          label="Miss"
          count={autoSpeakerMiss}
          onChange={(delta) => setAutoSpeakerMiss(autoSpeakerMiss + delta)}
        />
      </ContainerGroup>

      <ContainerGroup title="Amp">
        <MinusPlusPair
          label="Score"
          count={autoAmpScore}
          onChange={(delta) => setAutoAmpScore(autoAmpScore + delta)}
        />
        <MinusPlusPair
          label="Miss"
          count={autoAmpMiss}
          onChange={(delta) => setAutoAmpMiss(autoAmpMiss + delta)}
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

export default AutoScreen;
