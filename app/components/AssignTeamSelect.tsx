import { View, Text, TouchableOpacity } from "react-native";
import { Alliance } from "@/constants/Enums";
import type { TeamModel } from "@/constants/Types";
import Styles from "@/constants/Styles";

type AssignTeamSelectProps = {
  teamModel: TeamModel;
  onSelect: (teamModel: TeamModel) => void;
};

export default function AssignTeamSelect({
  teamModel,
  onSelect,
}: AssignTeamSelectProps) {
  const handleOnPress = () => {
    onSelect(teamModel);
  };

  return (
    <TouchableOpacity onPress={() => handleOnPress()} style={{ flex: 1 }}>
      <View
        style={[
          teamModel.alliance === Alliance.Blue
            ? Styles.allianceBlueButton
            : Styles.allianceRedButton,
          {
            width: "100%",
            height: 80,
            flexDirection: "column",
            opacity: teamModel.assignedTeamMember ? 0.6 : 1.0,
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          {teamModel.allianceTeam}
        </Text>
        <Text style={{ color: "white" }}>{teamModel.teamNumber}</Text>
        <Text style={{ color: "white" }}>
          {teamModel.assignedTeamMember ?? "Unassigned"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
