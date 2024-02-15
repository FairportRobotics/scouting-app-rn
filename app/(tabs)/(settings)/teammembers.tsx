import { TeamMember } from "@/constants/Types";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ContainerGroup, SelectGroup } from "@/app/components";
import Colors from "@/constants/Colors";
import * as Database from "@/app/helpers/database";

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState<Array<TeamMember>>([]);

  const loadData = async () => {
    try {
      // Retrieve data.
      Promise.all([Database.getAllTeamMembers() as Promise<Array<TeamMember>>])
        .then(([dtoTeamMembers]) => {
          dtoTeamMembers.sort((a, b) => a.firstName.localeCompare(b.firstName));
          setTeamMembers(dtoTeamMembers);
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

  const handleSetCanScout = async (teamMemberKey: string, value: string) => {
    await Database.saveTeamMemberCanScout(teamMemberKey, value == "Yes");
    loadData();
  };

  const renderItem = (teamMember: TeamMember) => {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 5,
          paddingVertical: 10,
          backgroundColor: Colors.appBackground,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20 }}>
            {teamMember.firstName} {teamMember.lastName}
          </Text>
          <Text style={{ fontSize: 20 }}>{teamMember.key}</Text>
        </View>
        <SelectGroup
          title=""
          value={teamMember.canScout ? "Yes" : "No"}
          options={["Yes", "No"]}
          required={true}
          disabled={false}
          onChange={(value) => handleSetCanScout(teamMember.key, value)}
        />
      </View>
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <ContainerGroup title="Team Members Can Scout">
        <FlatList
          style={{ width: "100%", marginBottom: 50 }}
          data={teamMembers}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.key}
        />
      </ContainerGroup>
    </View>
  );
}
