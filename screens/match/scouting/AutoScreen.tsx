import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, ScrollView, Button } from "react-native";
import { Check, MinusPlusPair, ContainerGroup } from "@/components";
import * as Database from "@/helpers/database";
import ROUTES from "@/constants/routes";

function AutoScreen({ navigation }) {
  const { params } = useRoute();
  let sessionKey = params["sessionKey"];

  const [startedWithNote, setStartedWithNote] = useState<boolean>(false);
  const [leftStartArea, setLeftStartArea] = useState<boolean>(false);

  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);

  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);

  const loadData = async () => {
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);

    setStartedWithNote(dtoSession?.autoStartedWithNote ?? false);
    setLeftStartArea(dtoSession?.autoLeftStartArea ?? false);

    setSpeakerScore(dtoSession?.autoSpeakerScore ?? 0);
    setSpeakerScoreAmplified(dtoSession?.autoSpeakerScoreAmplified ?? 0);
    setSpeakerMiss(dtoSession?.autoSpeakerMiss ?? 0);

    setAmpScore(dtoSession?.autoAmpScore ?? 0);
    setAmpMiss(dtoSession?.autoAmpMiss ?? 0);
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionAuto(
      sessionKey,
      startedWithNote,
      leftStartArea,
      speakerScore,
      speakerScoreAmplified,
      speakerMiss,
      ampScore,
      ampMiss
    );
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
            checked={startedWithNote}
            onToggle={() => setStartedWithNote(!startedWithNote)}
          />
          <Check
            label="Left Start Area"
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
