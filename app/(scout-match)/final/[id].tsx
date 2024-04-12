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
} from "@/app/components";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import { Alliance } from "@/constants/Enums";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import postMatchSession from "@/app/helpers/postMatchSession";

function FinalScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const matchStore = useMatchScoutingStore();

  // States.
  const [totalScore, setTotalScore] = useState<number>(0);
  const [rankingPoints, setRankingPoints] = useState<number>(0);
  const [allianceResult, setAllianceResult] = useState<string>("NONE_SELECTED");
  const [violations, setViolations] = useState<string>("NONE_SELECTED");
  const [penalties, setPenalties] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [totalScore, rankingPoints, allianceResult, violations, penalties, notes]);

  const loadData = async () => {
    // Retrieve from stores.
    if (!(id in matchStore.sessions)) return;
    const cacheSession = matchStore.sessions[id];

    // Validate.
    if (cacheSession === undefined) return;

    setTotalScore(cacheSession.finalAllianceScore ?? 0);
    setRankingPoints(cacheSession.finalRankingPoints ?? 0);
    setAllianceResult(cacheSession.finalAllianceResult ?? null);
    setViolations(cacheSession.finalViolations ?? null);
    setPenalties(cacheSession.finalPenalties ?? 0);
    setNotes(cacheSession.finalNotes ?? "");
  };

  const saveData = async () => {
    if (!(id in matchStore.sessions)) return;

    // Set properties and save.
    let current = matchStore.sessions[id];
    current.finalAllianceScore = totalScore;
    current.finalRankingPoints = rankingPoints;
    current.finalAllianceResult = allianceResult;
    current.finalViolations = violations;
    current.finalPenalties = penalties;
    current.finalNotes = notes;
    matchStore.saveSession(current);

    // Upload.
    postMatchSession(matchStore.sessions[id]);
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
    switch (matchStore.sessions[id]?.alliance) {
      case Alliance.Blue:
        return "Penalties: (Read the value for Penalties from the Red Alliance column)";
      case Alliance.Red:
        return "Penalties: (Read the value for Penalties from the Blue Alliance column)";
      default:
        return "Penalties: (Error. Ignore Penalties.)";
    }
  };

  if (!(id in matchStore.sessions)) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={matchStore.sessions[id]} />
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
            style={[Styles.textInput, { height: 100 }]}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Note anything that you didn't capture in Auto, Teleop or Endgame..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

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
