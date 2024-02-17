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

  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);

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
    console.log("onRefresh...");
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    console.log("onRefresh.");
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = async (
    matchModel: MatchModel,
    teamModel: TeamModel
  ) => {
    await Database.saveMatchAssignment(teamModel.sessionKey, id);

    let model = matchModels.find((model) => model.matchKey === matchModel.key)
      ?.alliances[teamModel.alliance][teamModel.allianceTeam];

    if (model === undefined) return;

    model.assignedTeamMember = id;
  };

  const handleDone = () => {
    router.push(`/(tabs)/(settings)/teammembers`);
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
          <Text>{id}</Text>
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
