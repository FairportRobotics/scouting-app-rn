import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ContainerGroup,
  MinusPlusPair,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import {
  getMatchScoutingSessionForEdit,
  MatchScoutingSessionModel,
  saveMatchSessionTeleop,
} from "@/data/db";
import Loading from "@/components/Loading";
import postMatchSession from "@/helpers/postMatchSession";

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;

    // Set State.
    setSession(dbSession);
    setSpeakerScore(dbSession.teleopSpeakerScore ?? 0);
    setSpeakerScoreAmplified(dbSession.teleopSpeakerScoreAmplified ?? 0);
    setSpeakerMiss(dbSession.teleopSpeakerMiss ?? 0);
    setAmpScore(dbSession.teleopAmpScore ?? 0);
    setAmpMiss(dbSession.teleopAmpMiss ?? 0);
    setPass(dbSession.teleopRelayPass ?? 0);
  };

  const saveData = async () => {
    if (!session) return;

    session.teleopSpeakerScore = speakerScore;
    session.teleopSpeakerScoreAmplified = speakerScoreAmplified;
    session.teleopSpeakerMiss = speakerMiss;
    session.teleopAmpScore = ampScore;
    session.teleopAmpMiss = ampMiss;
    session.teleopRelayPass = pass;

    await saveMatchSessionTeleop(session);
    await postMatchSession(session);
  };

  const handleNavigatePrevious = async () => {
    await saveData();
    router.replace(`/(scout-match)/auto/${id}`);
  };

  const handleNavigateNext = async () => {
    await saveData();
    router.replace(`/(scout-match)/endgame/${id}`);
  };

  if (!session) {
    return <Loading />;
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
