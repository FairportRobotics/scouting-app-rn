import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { PitScoutingSession, Team } from "@/constants/Types";
import { ContainerGroup, SelectGroup } from "@/app/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useCacheStore } from "@/store/cachesStore";
import { usePitScoutingStore } from "@/store/pitScoutingStore";
import postPitScoutingSession from "@/app/helpers/postPitScoutingSession";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

function ScoutPitScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const cacheStore = useCacheStore();
  const pitStore = usePitScoutingStore();

  // Support for state.
  const [team, setTeam] = useState<Team>();
  const [session, setSession] = useState<PitScoutingSession>(
    {} as PitScoutingSession
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Extract the Session Key and assign to the store.
    const key = id;
    pitStore.currentKey = key;

    // Retrieve the team.
    const cacheTeam = cacheStore.teams.find((team) => team.key == id);

    // Retrieve existing or create new PitScoutingSession.
    let cacheSession = {} as PitScoutingSession;
    if (key in pitStore.sessions) {
      cacheSession = pitStore.sessions[id];
    } else {
      cacheSession = {
        key: id,
        eventKey: cacheStore.event.key,
        driveTeamExperience: "",
        numberOfAutoMethods: "",
        canPickUpFromGround: "",
        canReceiveFromSourceChute: "",
        canScoreInAmp: "",
        canScoreInSpeaker: "",
        canScoreInTrap: "",
        whereCanYouScoreInSpeaker: "",
        canFitUnderStage: "",
        canGetOnstage: "",
        robotWidth: "",
        onstagePosition: "",
        notes: "",
      } as PitScoutingSession;
    }

    setTeam(cacheTeam);
    setSession(cacheSession);
  };

  const saveData = async () => {
    pitStore.sessions[id] = session;
  };

  const uploadDate = async () => {
    try {
      await postPitScoutingSession(session);
      pitStore.sessions[id].uploadedDate = new Date();
      loadData;
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSession((prevState) => ({
      ...prevState,
      editedDate: new Date(),
      [key]: value,
    }));
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
            value={session.driveTeamExperience}
            options={[
              "All New",
              "Mostly New",
              "Mixed",
              "Mostly Veterans",
              "All Veterans",
            ]}
            onChange={(value) => handleChange("driveTeamExperience", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="How many Auto methods do you have?">
          <TextInput
            style={[Styles.textInput, {}]}
            value={session.numberOfAutoMethods}
            onChangeText={(value) => handleChange("numberOfAutoMethods", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot pick up Notes from the ground?">
          <SelectGroup
            value={session.canPickUpFromGround}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canPickUpFromGround", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot receive Notes from the Source Chute?">
          <SelectGroup
            value={session.canReceiveFromSourceChute}
            options={["Yes", "No"]}
            onChange={(value) =>
              handleChange("canReceiveFromSourceChute", value)
            }
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Amp?">
          <SelectGroup
            value={session.canScoreInAmp}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInAmp", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Speaker?">
          <SelectGroup
            value={session.canScoreInSpeaker}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInSpeaker", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Trap?">
          <SelectGroup
            value={session.canScoreInTrap}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInTrap", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="What is the farthest your robot can score in the Speaker?">
          <SelectGroup
            value={session.whereCanYouScoreInSpeaker}
            options={[
              "Adjacent to Subwoofer",
              "Between Subwoofer and Stage",
              "At or under the Stage",
              "Beyond the Stage",
            ]}
            onChange={(value) =>
              handleChange("whereCanYouScoreInSpeaker", value)
            }
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot fit under the Stage?">
          <SelectGroup
            value={session.canFitUnderStage}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canFitUnderStage", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot get Onstage?">
          <SelectGroup
            value={session.canGetOnstage}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canGetOnstage", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="How wide is your robot with the bumpers attached (in inches)?">
          <TextInput
            style={[Styles.textInput, {}]}
            value={session.robotWidth}
            onChangeText={(value) => handleChange("robotWidth", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="If you can score in the Trap from Onstage, where does your robot need to be positioned?">
          <SelectGroup
            value={session.onstagePosition}
            options={["Left", "Center", "Right", "Anywhere"]}
            onChange={(value) => handleChange("onstagePosition", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Notes">
          <TextInput
            multiline
            maxLength={1024}
            style={[Styles.textInput, { height: 100 }]}
            value={session.notes}
            onChangeText={(text) => handleChange("notes", text)}
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
