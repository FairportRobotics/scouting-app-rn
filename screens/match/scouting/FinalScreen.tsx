import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  Check,
  ContainerGroup,
  MinusPlusPair,
  OptionSelect,
} from "@/components";
import themes from "@/themes/themes";
import ROUTES from "../../../constants/routes";
import * as Database from "@/helpers/database";

function FinalScreen({ navigation }) {
  const { params } = useRoute();
  const sessionKey = params["sessionKey"];

  const [totalScore, setTotalScore] = useState<number>(0);
  const [rankingPoints, setRankingPoints] = useState<number>(0);
  const [allianceResult, setAllianceResult] = useState<string>();
  const [violations, setViolations] = useState<string>();
  const [penalties, setPenalties] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [totalScore, rankingPoints, allianceResult, violations, penalties, notes]);

  const loadData = async () => {
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);

    setTotalScore(dtoSession?.finalAllianceScore ?? 0);
    setRankingPoints(dtoSession?.finalRankingPoints ?? 0);
    setAllianceResult(dtoSession?.finalAllianceResult ?? null);
    setViolations(dtoSession?.finalViolations ?? null);
    setPenalties(dtoSession?.finalPenalties ?? 0);
    setNotes(dtoSession?.finalNotes ?? "");
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionFinal(
      sessionKey,
      totalScore,
      rankingPoints,
      allianceResult,
      violations,
      penalties,
      notes
    );
  };

  const navigatePrevious = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_ENDGAME, {
      sessionKey: sessionKey,
    });
  };

  const navigateNext = () => {
    console.log("Final Screen TBD: Clear Stack");
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_SELECT, {
      sessionKey: sessionKey,
    });
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
          style={[themes.textInput, { height: 100 }]}
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
