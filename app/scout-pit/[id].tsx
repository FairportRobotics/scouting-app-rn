import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { PitScoutingSession, Team } from "@/constants/Types";
import { ContainerGroup, SelectGroup } from "@/app/components";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import postPitScoutingSession from "@/app/helpers/postPitScoutingSession";
import * as Database from "@/app/helpers/database";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function ScoutPitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Support for state.
  const [team, setTeam] = useState<Team>();
  const [currentSession, setSession] = useState<PitScoutingSession>();

  const [driveTeamExperience, setDriveTeamExperience] = useState<string>("");
  const [numberOfAutoMethods, setNumberOfAutoMethods] = useState<number>(0);
  const [canPickUpFromGround, setCanPickUpFromGround] = useState<string>("");
  const [canReceiveFromSourceChute, setCanReceiveFromSourceChute] =
    useState<string>("");
  const [canScoreInAmp, setCanScoreInAmp] = useState<string>("");
  const [canScoreInSpeaker, setCanScoreInSpeaker] = useState<string>("");
  const [canScoreInTrap, setCanScoreInTrap] = useState<string>("");
  const [whereCanYouScoreInSpeaker, setWhereCanYouScoreInSpeaker] =
    useState<string>("");
  const [canFitUnderStage, setCanFitUnderStage] = useState<string>("");
  const [canGetOnstage, setCanGetOnstage] = useState<string>("");
  const [robotWidth, setRobotWidth] = useState<number>(0);
  const [onstagePosition, setOnstagePosition] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

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
        dtoSession = {
          key: id,
          eventKey: dtoEvent.key,
        } as PitScoutingSession;
      }

      // Set State.
      setTeam(dtoTeam);
      setSession(dtoSession);
      setDriveTeamExperience(dtoSession.driveTeamExperience);
      setNumberOfAutoMethods(dtoSession.numberOfAutoMethods ?? 0);
      setCanPickUpFromGround(dtoSession.canPickUpFromGround);
      setCanReceiveFromSourceChute(dtoSession.canReceiveFromSourceChute);
      setCanScoreInAmp(dtoSession.canScoreInAmp);
      setCanScoreInSpeaker(dtoSession.canScoreInSpeaker);
      setCanScoreInTrap(dtoSession.canScoreInTrap);
      setWhereCanYouScoreInSpeaker(dtoSession.whereCanYouScoreInSpeaker);
      setCanFitUnderStage(dtoSession.canFitUnderStage);
      setCanGetOnstage(dtoSession.canGetOnstage);
      setRobotWidth(dtoSession?.robotWidth ?? 0);
      setOnstagePosition(dtoSession.onstagePosition);
      setNotes(dtoSession.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      await Database.updatePitScoutingSession(
        id,
        currentSession?.eventKey!,
        driveTeamExperience,
        numberOfAutoMethods,
        canPickUpFromGround,
        canReceiveFromSourceChute,
        canScoreInAmp,
        canScoreInSpeaker,
        canScoreInTrap,
        whereCanYouScoreInSpeaker,
        canFitUnderStage,
        canGetOnstage,
        robotWidth,
        onstagePosition,
        notes
      );
    } catch (error) {
      console.error(error);
    }
  };

  const uploadDate = async () => {
    const timeoutId = setTimeout(async () => {
      try {
        const session = await Database.getPitScoutingSession(id);
        if (session === undefined) return;
        await postPitScoutingSession(session);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleOnCancel = () => {
    router.replace("/scoutPit");
  };

  const handleOnComplete = () => {
    saveData();
    uploadDate();
    router.replace("/scoutPit");
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Scout Pit" }} />
      <View
        style={{
          backgroundColor: Colors.placeholder,
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Team {team?.teamNumber} - {team?.nickname}
        </Text>
      </View>

      <KeyboardAwareScrollView style={{ marginBottom: 100 }}>
        <ContainerGroup title="What experience does your Drive Team have?">
          <SelectGroup
            value={driveTeamExperience}
            options={[
              "All New",
              "Mostly New",
              "Mixed",
              "Mostly Veterans",
              "All Veterans",
            ]}
            onChange={(value) => setDriveTeamExperience(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="How many Auto methods do you have?">
          <TextInput
            style={[Styles.textInput, {}]}
            inputMode="numeric"
            keyboardType="numeric"
            value={numberOfAutoMethods.toString()}
            onChangeText={(value) =>
              setNumberOfAutoMethods(
                parseInt("0" + value.replace(/[^0-9]/g, ""))
              )
            }
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot pick up Notes from the ground?">
          <SelectGroup
            value={canPickUpFromGround}
            options={["Yes", "No"]}
            onChange={(value) => setCanPickUpFromGround(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot receive Notes from the Source Chute?">
          <SelectGroup
            value={canReceiveFromSourceChute}
            options={["Yes", "No"]}
            onChange={(value) => setCanReceiveFromSourceChute(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Amp?">
          <SelectGroup
            value={canScoreInAmp}
            options={["Yes", "No"]}
            onChange={(value) => setCanScoreInAmp(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Speaker?">
          <SelectGroup
            value={canScoreInSpeaker}
            options={["Yes", "No"]}
            onChange={(value) => setCanScoreInSpeaker(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Trap?">
          <SelectGroup
            value={canScoreInTrap}
            options={["Yes", "No"]}
            onChange={(value) => setCanScoreInTrap(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="What is the farthest your robot can score in the Speaker?">
          <SelectGroup
            value={whereCanYouScoreInSpeaker}
            options={[
              "Adjacent to Subwoofer",
              "Between Subwoofer and Stage",
              "At or under the Stage",
              "Beyond the Stage",
            ]}
            onChange={(value) => setWhereCanYouScoreInSpeaker(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot fit under the Stage?">
          <SelectGroup
            value={canFitUnderStage}
            options={["Yes", "No"]}
            onChange={(value) => setCanFitUnderStage(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot get Onstage?">
          <SelectGroup
            value={canGetOnstage}
            options={["Yes", "No"]}
            onChange={(value) => setCanGetOnstage(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="How wide is your robot with the bumpers attached (in inches)?">
          <TextInput
            style={[Styles.textInput, {}]}
            inputMode="numeric"
            keyboardType="numeric"
            value={robotWidth.toString()}
            onChangeText={(value) =>
              setRobotWidth(parseInt("0" + value.replace(/[^0-9]/g, "")))
            }
          />
        </ContainerGroup>

        <ContainerGroup title="If you can score in the Trap from Onstage, where does your robot need to be positioned?">
          <SelectGroup
            value={onstagePosition}
            options={["Left", "Center", "Right", "Anywhere"]}
            onChange={(value) => setOnstagePosition(value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Notes">
          <TextInput
            multiline
            maxLength={1024}
            style={[Styles.textInput, { height: 100 }]}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Anything else we didn't ask that might be important?"
            placeholderTextColor={Colors.placeholder}
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
                onPress={() => handleOnCancel()}
              >
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
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
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ScoutPitScreen;
