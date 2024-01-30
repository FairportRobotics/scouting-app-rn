import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import type { Match, Team } from "@/helpers/types";
import ContainerGroup from "./ContainerGroup";

interface PitTeamSelectProps {
  team: Team;
  onPress: () => void;
  style?: {};
}

const PitTeamSelect: React.FC<PitTeamSelectProps> = ({
  team,
  onPress,
  style,
}) => {
  // Respond to the team being selected and pass to the parent.
  const handleOnPress = () => {
    onPress();
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <ContainerGroup title="">
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text>
              {team.teamNumber} - {team.nickname}
            </Text>
            <Text>Matches 1, 3, 7, 12</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text>[Scout]</Text>
          </View>
        </View>
      </ContainerGroup>
    </TouchableOpacity>
  );
};

export default PitTeamSelect;
