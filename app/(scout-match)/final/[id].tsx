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
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";
import { MatchScoutingSession } from "@/constants/Types";
import { Alliance } from "@/constants/Enums";
import Colors from "@/constants/Colors";
import postMatchSession from "@/app/helpers/postMatchSession";

function FinalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<MatchScoutingSession>();
  const [sessionKey, setSessionKey] = useState<string>(id);
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
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setSession(dtoSession);
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
    const timeoutId = setTimeout(() => {
      try {
        // Save to database.
        Database.saveMatchScoutingSessionFinal(
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
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const uploadData = async () => {
    const timeoutId = setTimeout(async () => {
      try {
        const session = await Database.getMatchScoutingSession(sessionKey);
        if (session === undefined) return;
        await postMatchSession(session);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
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
    router.replace(`/(scout-match)/endgame/${sessionKey}`);
  };

  const handleNavigateNext = () => {
    saveData();
    uploadData();
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

  if (session === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
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
