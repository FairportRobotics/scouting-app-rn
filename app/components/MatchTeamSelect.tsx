import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTabletScreenButton,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { Alliance } from "@/constants/Enums";
import type { TeamModel } from "@/constants/Types";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

type MatchTeamSelectProps = {
  teamModel: TeamModel;
  onSelect: (teamModel: TeamModel) => void;
};

export default function MatchTeamSelect({
  teamModel,
  onSelect,
}: MatchTeamSelectProps) {
  const handleOnPress = () => {
    onSelect(teamModel);
  };

  const renderBadge = () => {
    if (teamModel.sessionExists) {
      return (
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            top: -2,
            right: -2,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor:
              teamModel.sessionExists && teamModel.uploadExists
                ? Colors.uploaded
                : Colors.notUploaded,
            borderWidth: 2,
            borderColor:
              teamModel.sessionExists && teamModel.uploadExists
                ? Colors.uploaded
                : Colors.notUploaded,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={teamModel.uploadExists ? faCloud : faTabletScreenButton}
            size={18}
            style={{
              color: "white",
            }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <TouchableOpacity onPress={() => handleOnPress()} style={{ flex: 1 }}>
      {renderBadge()}
      <View
        style={[
          teamModel.alliance === Alliance.Blue
            ? Styles.allianceBlueButton
            : Styles.allianceRedButton,
          {
            width: "100%",
            flexDirection: "column",
            opacity:
              teamModel.sessionExists || teamModel.uploadExists ? 0.6 : 1.0,
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          {teamModel.allianceTeam}
        </Text>
        <Text style={{ color: "white" }}>{teamModel.teamNumber}</Text>
      </View>
    </TouchableOpacity>
  );
}
