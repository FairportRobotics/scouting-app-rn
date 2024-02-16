import { MatchAssignment, TeamMember } from "@/constants/Types";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  RefreshControl,
  Pressable,
} from "react-native";
import { Check, ContainerGroup } from "@/app/components";
import Colors from "@/constants/Colors";
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";

type AssignmentModel = {
  key: string;
  firstName: string;
  lastName: string;
  canScout: boolean;
  assignmentCount: number;
};

export default function TeamMembers() {
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [assignmentModels, setAssignmentModels] = useState<
    Array<AssignmentModel>
  >([]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  const loadData = async () => {
    try {
      // Retrieve data.
      Promise.all([
        Database.getAllTeamMembers() as Promise<Array<TeamMember>>,
        Database.getMatchAssignments() as Promise<Array<MatchAssignment>>,
      ])
        .then(([dtoTeamMembers, dtoAssignments]) => {
          // XXX
          let models: Array<AssignmentModel> = [];
          dtoTeamMembers.forEach((teamMember) => {
            let model = {
              key: teamMember.key,
              firstName: teamMember.firstName,
              lastName: teamMember.lastName,
              canScout: teamMember.canScout,
              assignmentCount: dtoAssignments.filter(
                (assignment) => assignment.teamMemberKey == teamMember.key
              ).length,
            } as AssignmentModel;

            models.push(model);
          });

          // XXX
          setAssignmentModels(models);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetCanScout = async (teamMemberKey: string, value: boolean) => {
    await Database.saveTeamMemberCanScout(teamMemberKey, value);
    loadData();
  };

  const renderItem = (teamMember: AssignmentModel) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          paddingVertical: 10,
          backgroundColor: Colors.appBackground,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1, alignItems: "flex-start", gap: 10 }}>
          <Text style={{ fontSize: 20 }}>
            {teamMember.firstName} {teamMember.lastName}
          </Text>
          <Text style={{ fontSize: 20 }}>{teamMember.key}</Text>
        </View>
        <View style={{}}>
          <Pressable onPress={() => console.log("Pressed", teamMember.key)}>
            <View style={[Styles.baseButton, { padding: 10 }]}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Assign Matches
              </Text>
            </View>
          </Pressable>
          <Text style={{ fontSize: 20 }}>
            Assigned to {teamMember.assignmentCount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <ContainerGroup title="Team Member Scouting Assignments">
        <FlatList
          style={{ width: "100%", marginBottom: 50 }}
          data={assignmentModels}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.key}
          refreshControl={
            <RefreshControl refreshing={isRefeshing} onRefresh={onRefresh} />
          }
        />
      </ContainerGroup>
    </View>
  );
}
