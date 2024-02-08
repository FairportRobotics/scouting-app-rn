import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import {
  Check,
  MinusPlusPair,
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import * as Database from "@/app/helpers/database";

function AutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sessionKey, setSessionKey] = useState<string>(id);
  const [startedWithNote, setStartedWithNote] = useState<boolean>(false);
  const [leftStartArea, setLeftStartArea] = useState<boolean>(false);
  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setStartedWithNote(dtoSession.autoStartedWithNote ?? false);
      setLeftStartArea(dtoSession.autoLeftStartArea ?? false);
      setSpeakerScore(dtoSession.autoSpeakerScore ?? 0);
      setSpeakerScoreAmplified(dtoSession.autoSpeakerScoreAmplified ?? 0);
      setSpeakerMiss(dtoSession.autoSpeakerMiss ?? 0);
      setAmpScore(dtoSession.autoAmpScore ?? 0);
      setAmpMiss(dtoSession.autoAmpMiss ?? 0);
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
        ampMiss
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
  ]);

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/confirm/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/teleop/${sessionKey}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader sessionKey={sessionKey} />
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
      <MatchScoutingNavigation
        previousLabel="Confirm"
        nextLabel="Teleop"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </View>
  );
}

export default AutoScreen;
