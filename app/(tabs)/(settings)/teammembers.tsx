import { MatchAssignment, TeamMember } from "@/constants/Types";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ContainerGroup } from "@/app/components";
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
  const router = useRouter();
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

  const handleAssignMatches = (teamMemberKey: string) => {
    router.push(`/(tabs)/(settings)/assignments/${teamMemberKey}`);
  };

  const handleUnassignMatches = async (teamMemberKey: string) => {
    await Database.deleteMatchAssignments(teamMemberKey);
    loadData();
  };

  const renderItem = (teamMember: AssignmentModel) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
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
        <View style={{ gap: 8 }}>
          <TouchableOpacity onPress={() => handleAssignMatches(teamMember.key)}>
            <View style={[Styles.baseButton, { padding: 10 }]}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Assign Matches
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUnassignMatches(teamMember.key)}
          >
            <View style={[Styles.baseButton, { padding: 10 }]}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Unassign {teamMember.assignmentCount}
              </Text>
            </View>
          </TouchableOpacity>
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
