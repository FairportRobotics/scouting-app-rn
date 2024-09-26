import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import {
  Check,
  MinusPlusPair,
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import {
  getMatchScoutingSessionForEdit,
  MatchScoutingSessionModel,
  saveMatchSessionAuto,
} from "@/data/db";
import postMatchSession from "@/helpers/postMatchSession";

function AutoScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
  const [startedWithNote, setStartedWithNote] = useState<boolean>(true);
  const [leftStartArea, setLeftStartArea] = useState<boolean>(false);
  const [speakerScore, setSpeakerScore] = useState<number>(0);
  const [speakerMiss, setSpeakerMiss] = useState<number>(0);
  const [ampScore, setAmpScore] = useState<number>(0);
  const [ampMiss, setAmpMiss] = useState<number>(0);

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;

    // Set State.
    setSession(dbSession);
    setStartedWithNote(dbSession.autoStartedWithNote ?? true);
    setLeftStartArea(dbSession.autoLeftStartArea ?? false);
    setSpeakerScore(dbSession.autoSpeakerScore ?? 0);
    setSpeakerMiss(dbSession.autoSpeakerMiss ?? 0);
    setAmpScore(dbSession.autoAmpScore ?? 0);
    setAmpMiss(dbSession.autoAmpMiss ?? 0);
  };

  const saveData = async () => {
    if (!session) return;

    session.autoStartedWithNote = startedWithNote;
    session.autoLeftStartArea = leftStartArea;
    session.autoSpeakerScore = speakerScore;
    session.autoSpeakerMiss = speakerMiss;
    session.autoAmpScore = ampScore;
    session.autoAmpMiss = ampMiss;

    await saveMatchSessionAuto(session);
    await postMatchSession(session);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigatePrevious = async () => {
    await saveData();
    router.replace(`/(scout-match)/confirm/${id}`);
  };

  const handleNavigateNext = async () => {
    await saveData();
    router.replace(`/(scout-match)/teleop/${id}`);
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
