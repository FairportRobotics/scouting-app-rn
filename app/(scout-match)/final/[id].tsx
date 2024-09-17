import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ContainerGroup,
  MinusPlusPair,
  SelectGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import { useCacheStore } from "@/store/cachesStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import { Alliance } from "@/constants/Enums";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import postMatchSession from "@/helpers/postMatchSession";
import {
  getMatchScoutingSessionForEdit,
  MatchScoutingSessionModel,
  saveMatchSessionFinal,
} from "@/data/db";
import Loading from "@/components/Loading";

function FinalScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
  const [totalScore, setTotalScore] = useState<number>(0);
  const [rankingPoints, setRankingPoints] = useState<number>(0);
  const [allianceResult, setAllianceResult] = useState<string>("NONE_SELECTED");
  const [violations, setViolations] = useState<string>("NONE_SELECTED");
  const [penalties, setPenalties] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;
    console.log("Final Before:\n", JSON.stringify(dbSession, null, 2));

    // Set State.
    setSession(dbSession);
    setTotalScore(dbSession.finalAllianceScore ?? 0);
    setRankingPoints(dbSession.finalRankingPoints ?? 0);
    setAllianceResult(dbSession.finalAllianceResult ?? "");
    setViolations(dbSession.finalViolations ?? "");
    setPenalties(dbSession.finalPenalties ?? 0);
    setNotes(dbSession.finalNotes ?? "");
  };

  const saveData = async () => {
    if (!session) return;

    // Set properties and save.
    session.finalAllianceScore = totalScore;
    session.finalRankingPoints = rankingPoints;
    session.finalAllianceResult = allianceResult;
    session.finalViolations = violations;
    session.finalPenalties = penalties;
    session.finalNotes = notes;
    console.log("Final After:\n", JSON.stringify(session, null, 2));

    saveMatchSessionFinal(session);
  };

  const handleChangeTotalScore = (value: string) => {
    value = value.replace(/[^0-9]/g, "") || "0";
    setTotalScore(parseInt(value));
  };

  const handleChangeRankingPoints = (value: string) => {
    value = value.replace(/[^0-9]/g, "") || "0";
    setRankingPoints(parseInt(value));
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/(scout-match)/endgame/${id}`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/`);
  };

  const penaltiesLabel = () => {
    switch (session?.alliance) {
      case Alliance.Blue:
        return "Penalties: (Read the value for Penalties from the Red Alliance column)";
      case Alliance.Red:
        return "Penalties: (Read the value for Penalties from the Blue Alliance column)";
      default:
        return "Penalties: (Error. Ignore Penalties.)";
    }
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />
      <ContainerGroup title="Alliance">
        <View style={{ width: "100%", flexDirection: "row", gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20 }}>Total Score</Text>
            <TextInput
              style={[Styles.textInput, { width: "100%" }]}
              inputMode="numeric"
              value={totalScore.toString()}
              onChangeText={(value) => handleChangeTotalScore(value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20 }}>Ranking Points</Text>
            <TextInput
              style={[Styles.textInput, { width: "100%" }]}
              inputMode="numeric"
              value={rankingPoints.toString()}
              onChangeText={(value) => handleChangeRankingPoints(value)}
            />
          </View>
        </View>
      </ContainerGroup>

      <ContainerGroup title="Overall">
        <SelectGroup
          title=""
          options={["Win", "Lose", "Tie"]}
          value={allianceResult}
          onChange={(value) => setAllianceResult(value ?? "NONE_SELECTED")}
        />
        <SelectGroup
          title="Violations"
          options={["Yellow", "Red", "Disabled", "Disqualified"]}
          value={violations}
          onChange={(value) => setViolations(value ?? "NONE_SELECTED")}
        />
      </ContainerGroup>

      <ContainerGroup title={penaltiesLabel()}>
        <MinusPlusPair
          label="Penalties"
          count={penalties}
          onChange={(delta) => setPenalties(penalties + delta)}
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
            placeholder="Note anything that you didn't capture in Auto, Teleop or Endgame..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

      <ContainerGroup title="Your Reward">
        <Text>JOKE HERE</Text>
      </ContainerGroup>

      <MatchScoutingNavigation
        previousLabel="Final"
        nextLabel="Done"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default FinalScreen;
