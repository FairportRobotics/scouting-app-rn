import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Button, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Event,
  Match,
  Team,
  MatchModel,
  TeamModel,
  TeamMember,
  MatchAssignment,
} from "@/constants/Types";
import { ContainerGroup, ScoutingMatchSelect } from "@/app/components";
import * as Database from "@/app/helpers/database";
import getMatchSelectModels from "@/app/helpers/getMatchSelectModels";

function Assignments() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Assignments...", id);

  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);
  const [teamMember, setTeamMember] = useState<TeamMember>();

  const loadData = async () => {
    try {
      // Retrieve data.
      Promise.all([
        Database.getEvent() as Promise<Event>,
        Database.getMatches() as Promise<Array<Match>>,
        Database.getTeams() as Promise<Array<Team>>,
        Database.getAllTeamMembers() as Promise<Array<TeamMember>>,
        Database.getMatchAssignments() as Promise<Array<MatchAssignment>>,
      ])
        .then(
          ([
            dtoEvent,
            dtoMatches,
            dtoTeams,
            dtoTeamMembers,
            dtoAssignments,
          ]) => {
            // Build the Match Models.
            const matchModels = getMatchSelectModels(
              dtoEvent,
              dtoMatches,
              dtoTeams,
              [],
              [],
              dtoTeamMembers,
              dtoAssignments
            );

            // Get the Team Member.
            setTeamMember(
              dtoTeamMembers.find((teamMember) => teamMember.key == id)
            );

            setMatchModels(matchModels);
          }
        )
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log("Something went horribly wrong.");
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = async (
    matchModel: MatchModel,
    teamModel: TeamModel
  ) => {
    await Database.saveMatchAssignment(teamModel.sessionKey, id);
    loadData();
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefeshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text>Assigning Matches for {id}</Text>
        </View>
        <Button title="Done" onPress={() => handleDone()} />
        {matchModels.map((matchModel, index) => (
          <ContainerGroup title="" key={index}>
            <ScoutingMatchSelect
              matchModel={matchModel}
              onSelect={(matchModel, teamModel) =>
                handleOnSelect(matchModel, teamModel)
              }
            />
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}

export default Assignments;
