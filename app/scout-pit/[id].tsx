import React, { useEffect, useState } from "react";
import { View, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { OptionSelect } from "@/app/components";
import { RootStackParamList } from "@/constants/Types";
import * as Database from "@/app/helpers/database";
import { PitScoutingSession } from "../helpers/types";

function ScoutPitScreen() {
  const router = useRouter();

  const route =
    useRoute<RouteProp<RootStackParamList, "ScoutMatchEditScreen">>();
  const { id } = route.params;

  const [teamKey, setTeamKey] = useState<string>(id);

  const defaultSession = {
    key: id,
    canAchieveHarmony: "",
    canFitOnStage: "",
    canFitUnderStage: "",
    canGetFromSource: "",
    canGetOnStage: "",
    canPark: "",
    canPickUpNoteFromGround: "",
    canRobotRecover: "",
    canScoreAmp: "",
    canScoreSpeaker: "",
    canScoreTrap: "",
    isRobotReady: "",
    numberOfAutoMethods: "",
    planOnClimbing: "",
    planOnScoringTrap: "",
    robotDimenions: "",
    teamExperiance: "",
  } as PitScoutingSession;

  // Support for state.
  const [currentSession, setCurrentSession] =
    useState<PitScoutingSession>(defaultSession);

  const handleChange = async (key: string, value: string) => {
    setCurrentSession((previous) => {
      return {
        ...previous,
        [key]: value,
      };
    });

    saveData();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [currentSession]);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getPitScoutingSession(id);

      // Validate.
      if (dtoSession === undefined) return;

      // Set State.
      setCurrentSession(dtoSession || defaultSession);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.updatePitScoutingSession(currentSession);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnComplete = () => {
    console.log("Navigate somewhere");
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <OptionSelect
        label="Can your robot pick up Notes from the ground?"
        options={["Yes", "No"]}
        value={currentSession.canPickUpNoteFromGround}
        onChange={(value) => handleChange("canPickUpNoteFromGround", value)}
      />
      <OptionSelect
        label="Can your robot receive Notes from the Source?"
        options={["Yes", "No"]}
        value={currentSession?.canGetFromSource || ""}
        onChange={(value) => handleChange("canGetFromSource", value)}
      />
      <OptionSelect
        label="Can you score in the Amp?"
        options={["Yes", "No"]}
        value={currentSession?.canScoreAmp || ""}
        onChange={(value) => handleChange("canScoreAmp", value)}
      />
      <OptionSelect
        label="Can you score in the Speaker?"
        options={["Yes", "No"]}
        value={currentSession?.canScoreSpeaker || ""}
        onChange={(value) => handleChange("canScoreSpeaker", value)}
      />
      <OptionSelect
        label="Can you score in the trap?"
        options={["Yes", "No"]}
        value={currentSession?.canScoreTrap || ""}
        onChange={(value) => handleChange("canScoreTrap", value)}
      />
      <OptionSelect
        label="Can you park?"
        options={["Yes", "No"]}
        value={currentSession?.canPark || ""}
        onChange={(value) => handleChange("canPark", value)}
      />
      <OptionSelect
        label="Can you get Onstage?"
        options={["Yes", "No"]}
        value={currentSession?.canGetOnStage || ""}
        onChange={(value) => handleChange("canGetOnStage", value)}
      />
      <OptionSelect
        label="Can you achieve Harmony?"
        options={["Yes", "No"]}
        value={currentSession?.canAchieveHarmony || ""}
        onChange={(value) => handleChange("canAchieveHarmony", value)}
      />
      <OptionSelect
        label="What experiance does your Drive Team have?"
        options={["New", "Mixed", "Veterans"]}
        value={currentSession?.teamExperiance || ""}
        onChange={(value) => handleChange("teamExperiance", value)}
      />
      <OptionSelect
        label="Is your robot ready now?"
        options={["Yes", "No"]}
        value={currentSession?.isRobotReady || ""}
        onChange={(value) => handleChange("isRobotReady", value)}
      />
      <OptionSelect
        label="Can your Robot recover from a Note improperly attached to it?"
        options={["Yes", "No"]}
        value={currentSession?.canRobotRecover || ""}
        onChange={(value) => handleChange("canRobotRecover", value)}
      />
      <OptionSelect
        label="What are the dimentions of your Robot?"
        options={["Do Later"]}
        value={currentSession?.robotDimenions || ""}
        onChange={(value) => handleChange("robotDimenions", value)}
      />
      <OptionSelect
        label="How many can fit onstage at the same time?"
        options={["1", "2", "3"]}
        value={currentSession?.canFitOnStage || ""}
        onChange={(value) => handleChange("canFitOnStage", value)}
      />
      <OptionSelect
        label="Can your Robot fit under the Stage?"
        options={["Yes", "No"]}
        value={currentSession?.canFitUnderStage || ""}
        onChange={(value) => handleChange("canFitUnderStage", value)}
      />
      <OptionSelect
        label="How many Auto methods do you have?"
        options={["1", "2", "3+"]}
        value={currentSession?.numberOfAutoMethods || ""}
        onChange={(value) => handleChange("numberOfAutoMethods", value)}
      />
      <OptionSelect
        label="Do you plan on climbing?"
        options={["Yes", "No"]}
        value={currentSession?.planOnClimbing || ""}
        onChange={(value) => handleChange("planOnClimbing", value)}
      />
      <OptionSelect
        label="Do you plan on scoring in the Trap?"
        options={["Yes", "No"]}
        value={currentSession?.planOnScoringTrap || ""}
        onChange={(value) => handleChange("planOnScoringTrap", value)}
      />

      <View>
        <Button title="Complete" onPress={handleOnComplete} />
      </View>
    </ScrollView>
  );
}

export default ScoutPitScreen;
