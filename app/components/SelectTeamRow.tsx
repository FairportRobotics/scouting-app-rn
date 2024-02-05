import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Team } from "@/app/helpers/types";
import themes from "@/app/themes/themes";
import ContainerGroup from "@/app/components/ContainerGroup";
import { PitResultModel } from "../(tabs)/scoutPit";

interface SelectTeamRowProps {
  team: PitResultModel;
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
            <Text style={{ fontSize: 24 }}>{team.number}</Text>
            <Text style={{ fontSize: 24 }}>{team.nickname}</Text>
          </View>
          <View>
            <Text>Scheduled Matches: {[...team.matches].join(", ")}</Text>
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
