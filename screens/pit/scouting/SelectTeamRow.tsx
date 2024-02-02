import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Team } from "@/helpers/types";
import themes from "@/themes/themes";
import ContainerGroup from "@/components/ContainerGroup";

interface SelectTeamRowProps {
  team: Team;
  onSelect: (teamKey: string) => void;
}

const SelectTeamRow: React.FC<SelectTeamRowProps> = ({ team, onSelect }) => {
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);

  const handleOnSelect = () => {
    onSelect(team.key);
  };

  return (
    <ContainerGroup title="">
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <Text style={{ fontSize: 24 }}>{team.teamNumber}</Text>
            <Text style={{ fontSize: 24 }}>{team.nickname}</Text>
          </View>
          <View>
            <Text>(TBD: Change button color if already scouted.)</Text>
            <Text>(TBD: List the matches in which the team is scheduled?)</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleOnSelect()}
          style={[themes.baseButton, { paddingHorizontal: 8 }]}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Scout
          </Text>
        </TouchableOpacity>
      </View>
    </ContainerGroup>
  );
};

export default SelectTeamRow;
