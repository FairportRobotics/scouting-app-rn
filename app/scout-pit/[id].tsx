import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  PitScoutingQuestion,
  PitScoutingSession,
  Team,
} from "@/constants/Types";
import { ContainerGroup, SelectGroup } from "@/app/components";
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import pitScoutingQuestions from "@/data/pitScoutingQuestions";
import postPitScoutingSession from "@/app/helpers/postPitScoutingSession";

function ScoutPitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Support for state.
  const [currentSession, setCurrentSession] = useState<PitScoutingSession>(
    {} as PitScoutingSession
  );
  const [team, setTeam] = useState<Team>();

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
          questions: pitScoutingQuestions,
        } as PitScoutingSession;
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
      await Database.updatePitScoutingSession(currentSession);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadDate = async () => {
    try {
      postPitScoutingSession(currentSession);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetOption = (key: string, value: string) => {
    // Find the index of the item in the nested array
    const itemIndex = currentSession.questions.findIndex(
      (item) => item.key === key
    );

    if (itemIndex !== -1) {
      // Create a new array with the updated item name
      const updatedArray = [...currentSession.questions];
      updatedArray[itemIndex] = { ...updatedArray[itemIndex], value: value };

      // Update the state with the new nested array
      setCurrentSession((prevData) => ({
        ...prevData,
        questions: updatedArray,
      }));
    }
  };

  const handleOnComplete = () => {
    saveData();
    uploadDate();
    router.replace("/scoutPit");
  };

  const renderItem = ({ item }: { item: PitScoutingQuestion }) => {
    return (
      <ContainerGroup title={item.title}>
        <SelectGroup
          value={item.value}
          options={item.options}
          onChange={(value) => handleSetOption(item.key, value)}
        />
      </ContainerGroup>
    );
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
      <FlatList
        data={currentSession.questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      <ScrollView style={{ margin: 10 }}>
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
