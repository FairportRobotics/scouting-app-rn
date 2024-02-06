import React, { useEffect, useState } from "react";
import { View, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ContainerGroup } from "@/app/components";
import { RootStackParamList } from "@/constants/Types";
import { PitScoutingSession } from "@/constants/Types";
import OptionGroup from "../components/OptionGroup";
import * as Database from "@/app/helpers/database";

function ScoutPitScreen() {
  const router = useRouter();

  const route =
    useRoute<RouteProp<RootStackParamList, "ScoutMatchEditScreen">>();
  const { id } = route.params;

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
    saveData();
    router.replace("/scoutPit");
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <ContainerGroup title="Wow many Auto methods do you have?">
        <OptionGroup
          options={["1", "2", "3+"]}
          value={currentSession?.numberOfAutoMethods || ""}
          onChange={(value) => handleChange("numberOfAutoMethods", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can your robot pick up Notes from the ground?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession.canPickUpNoteFromGround}
          onChange={(value) => handleChange("canPickUpNoteFromGround", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Can your robot receive Notes from the Source?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canGetFromSource || ""}
          onChange={(value) => handleChange("canGetFromSource", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Can you score in the Amp?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canScoreAmp || ""}
          onChange={(value) => handleChange("canScoreAmp", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Can you score in the Speaker?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canScoreSpeaker || ""}
          onChange={(value) => handleChange("canScoreSpeaker", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can you score in the Trap?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canScoreTrap || ""}
          onChange={(value) => handleChange("canScoreTrap", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Do you plan on scoring in the Trap?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.planOnScoringTrap || ""}
          onChange={(value) => handleChange("planOnScoringTrap", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can you get Onstage?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canGetOnStage || ""}
          onChange={(value) => handleChange("canGetOnStage", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Do you plan on getting Onstage?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.planOnClimbing || ""}
          onChange={(value) => handleChange("planOnClimbing", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="How many of your robot can fit Onstage at the same time?">
        <OptionGroup
          options={["1", "2", "3"]}
          value={currentSession?.canFitOnStage || ""}
          onChange={(value) => handleChange("canFitOnStage", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can you park?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canPark || ""}
          onChange={(value) => handleChange("canPark", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can you achieve Harmony?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canAchieveHarmony || ""}
          onChange={(value) => handleChange("canAchieveHarmony", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="What experiance does your Drive Team have?">
        <OptionGroup
          options={[
            "All New",
            "Mostly New",
            "Mixed",
            "Mostly Veterans",
            "All Veterans",
          ]}
          value={currentSession?.teamExperiance || ""}
          onChange={(value) => handleChange("teamExperiance", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Is your robot ready now?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.isRobotReady || ""}
          onChange={(value) => handleChange("isRobotReady", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="Can your Robot recover if a Note gets improperly attached to it?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canRobotRecover || ""}
          onChange={(value) => handleChange("canRobotRecover", value)}
        />
      </ContainerGroup>
      <ContainerGroup title="What are the dimentions of your Robot?">
        <OptionGroup
          options={["Do Later"]}
          value={currentSession?.robotDimenions || ""}
          onChange={(value) => handleChange("robotDimenions", value)}
        />
      </ContainerGroup>

      <ContainerGroup title="Can your Robot fit under the Stage?">
        <OptionGroup
          options={["Yes", "No"]}
          value={currentSession?.canFitUnderStage || ""}
          onChange={(value) => handleChange("canFitUnderStage", value)}
        />
      </ContainerGroup>

      <View>
        <Button title="Complete" onPress={handleOnComplete} />
      </View>
    </ScrollView>
  );
}

export default ScoutPitScreen;
