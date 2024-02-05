import React, { useEffect, useState } from "react";
import { View, Button, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ContainerGroup, MinusPlusPair, OptionSelect } from "@/app/components";
import { RootStackParamList } from "@/constants/Types";
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";

function FinalScreen() {
  const router = useRouter();

  const route =
    useRoute<RouteProp<RootStackParamList, "ScoutMatchEditScreen">>();
  const { id } = route.params;

  const [sessionKey, setSessionKey] = useState<string>(id);

  const [totalScore, setTotalScore] = useState<number>(0);
  const [rankingPoints, setRankingPoints] = useState<number>(0);
  const [allianceResult, setAllianceResult] = useState<string>("NOT_SET");
  const [violations, setViolations] = useState<string>("NOT_SET");
  const [penalties, setPenalties] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [totalScore, rankingPoints, allianceResult, violations, penalties, notes]);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setTotalScore(dtoSession.finalAllianceScore ?? 0);
      setRankingPoints(dtoSession.finalRankingPoints ?? 0);
      setAllianceResult(dtoSession.finalAllianceResult ?? null);
      setViolations(dtoSession.finalViolations ?? null);
      setPenalties(dtoSession.finalPenalties ?? 0);
      setNotes(dtoSession.finalNotes ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.saveMatchScoutingSessionFinal(
        sessionKey,
        totalScore,
        rankingPoints,
        allianceResult,
        violations,
        penalties,
        notes
      );
    } catch (error) {
      console.error(error);
    }
  };

  const navigatePrevious = () => {
    saveData();
    router.push(`/scout-match/endgame/${sessionKey}`);
  };

  const navigateNext = () => {
    saveData();
    router.push(`/`);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <ContainerGroup title="Alliance">
        <MinusPlusPair
          label="Total Score"
          count={totalScore}
          onChange={(delta) => setTotalScore(totalScore + delta)}
        />
        <MinusPlusPair
          label="Ranking Points"
          count={rankingPoints}
          onChange={(delta) => setRankingPoints(rankingPoints + delta)}
        />
        <OptionSelect
          label="Alliance Result"
          options={["Win", "Lose", "Tie"]}
          value={allianceResult}
          onChange={(value) => setAllianceResult(value)}
        />
        <OptionSelect
          label="Violations"
          options={["Yellow", "Red", "Disabled", "Disqualified"]}
          value={violations}
          onChange={(value) => setViolations(value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Penalties (Read from opposing Alliance Scoreboard)">
        <MinusPlusPair
          label="Penalties"
          count={penalties}
          onChange={(delta) => setPenalties(penalties + delta)}
        />
      </ContainerGroup>
      <ContainerGroup title="Notes">
        <TextInput
          multiline
          maxLength={1024}
          style={[Styles.textInput, { height: 100 }]}
          value={notes}
          onChangeText={(text) => setNotes(text)}
          placeholder="Anything interesting happen?"
        />
      </ContainerGroup>

      <ContainerGroup title="">
        <View style={{ flexDirection: "row" }}>
          <Button title="Previous" onPress={navigatePrevious} />
          <Button title="Done" onPress={navigateNext} />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}

export default FinalScreen;
