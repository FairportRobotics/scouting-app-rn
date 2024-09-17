import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ContainerGroup, SelectGroup } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import {
  getPitScoutingSessionForEdit,
  getRandomJoke,
  PitScoutingSessionModel,
  savePitSession,
} from "@/data/db";
import Loading from "@/components/Loading";
import { PitScoutingSession } from "@/data/schema";
import postPitScoutingSession from "@/helpers/postPitScoutingSession";

function ScoutPitScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Support for state.
  const [session, setSession] = useState<PitScoutingSessionModel>();
  const [joke, setJoke] = useState<string>("");

  useEffect(() => {
    async function getJoke() {
      const dbJoke = await getRandomJoke();
      setJoke(dbJoke);
    }

    getJoke();

    loadData();
  }, []);

  const loadData = async () => {
    const dbSession = await getPitScoutingSessionForEdit(id);

    if (!dbSession) return;

    setSession(dbSession);
  };

  const saveData = async () => {
    await savePitSession(session as PitScoutingSessionModel);
    await postPitScoutingSession(session as PitScoutingSession);
  };

  const uploadDate = async () => {
    await postPitScoutingSession(session as PitScoutingSession);
  };

  const handleChange = (key: string, value: string) => {
    if (!session) return;
    setSession({ ...session, [key]: value });
  };

  const handleOnCancel = () => {
    router.replace("/scoutPits");
  };

  const handleOnComplete = async () => {
    await saveData();
    await uploadDate();
    router.replace("/scoutPits");
  };

  if (!session) {
    return <Loading />;
  }

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
          Team {session.number} - {session.nickname}
        </Text>
      </View>

      <KeyboardAwareScrollView style={{}}>
        <ContainerGroup title="What experience does your Drive Team have?">
          <SelectGroup
            value={session.driveTeamExperience ?? ""}
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
            value={session.numberOfAutoMethods ?? ""}
            onChangeText={(value) => handleChange("numberOfAutoMethods", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot pick up Notes from the ground?">
          <SelectGroup
            value={session.canPickUpFromGround ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canPickUpFromGround", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot receive Notes from the Source Chute?">
          <SelectGroup
            value={session.canReceiveFromSourceChute ?? ""}
            options={["Yes", "No"]}
            onChange={(value) =>
              handleChange("canReceiveFromSourceChute", value)
            }
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Amp?">
          <SelectGroup
            value={session.canScoreInAmp ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInAmp", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Speaker?">
          <SelectGroup
            value={session.canScoreInSpeaker ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInSpeaker", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can you score in the Trap?">
          <SelectGroup
            value={session.canScoreInTrap ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canScoreInTrap", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Can your robot get Onstage?">
          <SelectGroup
            value={session.canGetOnstage ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canGetOnstage", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="If you can score in the Trap from Onstage, where does your robot need to be positioned?">
          <SelectGroup
            value={session.onstagePosition ?? ""}
            options={["Left", "Center", "Right", "Anywhere"]}
            onChange={(value) => handleChange("onstagePosition", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="What is the farthest your robot can score in the Speaker?">
          <SelectGroup
            value={session.whereCanYouScoreInSpeaker ?? ""}
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
            value={session.canFitUnderStage ?? ""}
            options={["Yes", "No"]}
            onChange={(value) => handleChange("canFitUnderStage", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="How big is your robot with the bumpers attached (in inches)?">
          <TextInput
            style={[Styles.textInput, {}]}
            value={session.robotWidth ?? ""}
            placeholder="L x W x H"
            onChangeText={(value) => handleChange("robotWidth", value)}
          />
        </ContainerGroup>

        <ContainerGroup title="Notes">
          <TextInput
            multiline
            maxLength={1024}
            style={[Styles.textInput, { height: 100 }]}
            value={session.notes ?? ""}
            onChangeText={(text) => handleChange("notes", text)}
            placeholder="Anything else we didn't ask that might be important?"
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>

        <ContainerGroup title="Your Reward">
          <Text>{joke}</Text>
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
