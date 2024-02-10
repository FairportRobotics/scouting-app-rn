import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ContainerGroup, SelectGroup } from "@/app/components";
import { PitScoutingSession, Team } from "@/constants/Types";
import postPitScoutingSession from "@/app/helpers/postPitScoutingSession";
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

function ScoutPitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const defaultSession = {
    key: id,
    eventKey: "",
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
    robotDimensions: "",
    teamExperience: "",
  } as PitScoutingSession;

  // Support for state.
  const [currentSession, setCurrentSession] =
    useState<PitScoutingSession>(defaultSession);
  const [team, setTeam] = useState<Team>();

  const handleChange = async (key: string, value: string) => {
    setCurrentSession((previous) => {
      return {
        ...previous,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoEvent = await Database.getEvent();
      const dtoTeam = await Database.getTeam(id);
      let dtoSession = await Database.getPitScoutingSession(id);

      // Verify
      if (dtoEvent === undefined) return;
      if (dtoTeam === undefined) return;
      if (dtoSession === undefined) {
        dtoSession = defaultSession as PitScoutingSession;
        dtoSession.eventKey = dtoEvent.key;
      }

      // Set State.
      setTeam(dtoTeam);
      setCurrentSession(dtoSession);
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

  const uploadDate = async () => {
    try {
      // Save to database.
      const session = await Database.getPitScoutingSession(id);
      if (session !== undefined) postPitScoutingSession(session);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnComplete = () => {
    saveData();
    uploadDate();
    router.replace("/scoutPit");
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: Colors.primary,
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Team {team?.teamNumber} - {team?.nickname}
        </Text>
      </View>
      <ScrollView style={{ margin: 10 }}>
        <ContainerGroup title="How many Auto methods do you have?">
          <SelectGroup
            value={currentSession?.numberOfAutoMethods}
            options={["1", "2", "3+"]}
            onChange={(value) => handleChange("numberOfAutoMethods", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Can your robot pick up Notes from the ground?">
          <SelectGroup
            value={currentSession.canPickUpNoteFromGround}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canPickUpNoteFromGround", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Can your robot receive Notes from the Source?">
          <SelectGroup
            value={currentSession?.canGetFromSource}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canGetFromSource", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Can you score in the Amp?">
          <SelectGroup
            value={currentSession?.canScoreAmp}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreAmp", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Can you score in the Speaker?">
          <SelectGroup
            value={currentSession?.canScoreSpeaker}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreSpeaker", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Trap?">
          <SelectGroup
            value={currentSession?.canScoreTrap}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreTrap", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Do you plan on scoring in the Trap?">
          <SelectGroup
            value={currentSession?.planOnScoringTrap}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("planOnScoringTrap", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you get Onstage?">
          <SelectGroup
            value={currentSession?.canGetOnStage}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canGetOnStage", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Do you plan on getting Onstage?">
          <SelectGroup
            value={currentSession?.planOnClimbing}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("planOnClimbing", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="How many of your robot can fit Onstage at the same time?">
          <SelectGroup
            value={currentSession?.canFitOnStage}
            options={["1", "2", "3"]}
            onChange={(value) => handleChange("canFitOnStage", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you park?">
          <SelectGroup
            options={["Yes", "No"]}
            value={currentSession?.canPark}
            onChange={(value) => handleChange("canPark", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you achieve Harmony?">
          <SelectGroup
            value={currentSession?.canAchieveHarmony}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canAchieveHarmony", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="What experiance does your Drive Team have?">
          <SelectGroup
            value={currentSession?.teamExperience}
            options={[
              "All New",
              "Mostly New",
              "Mixed",
              "Mostly Veterans",
              "All Veterans",
            ]}
            onChange={(value) => handleChange("teamExperience", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Is your robot ready now?">
          <SelectGroup
            options={["Yes", "No"]}
            value={currentSession?.isRobotReady}
            onChange={(value) => handleChange("isRobotReady", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="Can your Robot recover if a Note gets improperly attached to it?">
          <SelectGroup
            options={["Yes", "No"]}
            value={currentSession?.canRobotRecover}
            onChange={(value) => handleChange("canRobotRecover", value)}
          />
        </ContainerGroup>
        <ContainerGroup title="What are the dimentions of your Robot?">
          <SelectGroup
            value={currentSession?.robotDimensions}
            options={["Do Later"]}
            onChange={(value) => handleChange("robotDimensions", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your Robot fit under the Stage?">
          <SelectGroup
            value={currentSession?.canFitUnderStage}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canFitUnderStage", value)}
          />
        </ContainerGroup>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <ContainerGroup title="">
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  Styles.baseButton,
                  {
                    flex: 1,
                    flexDirection: "row",
                    gap: 8,
                    paddingHorizontal: 20,
                    justifyContent: "center",
                  },
                ]}
                onPress={() => handleOnComplete()}
              >
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </ContainerGroup>
        </View>
      </ScrollView>
    </View>
  );
}

export default ScoutPitScreen;
