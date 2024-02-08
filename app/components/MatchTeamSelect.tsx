import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Alliance } from "@/constants/Enums";
import type { TeamModel } from "@/constants/Types";
import Styles from "@/constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTabletScreenButton,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";

interface MatchTeamSelectProps {
  teamModel: TeamModel;
  onSelect: (teamModel: TeamModel) => void;
}

const MatchTeamSelect: React.FC<MatchTeamSelectProps> = ({
  teamModel,
  onSelect,
}) => {
  const handleOnPress = () => {
    onSelect(teamModel);
  };

  const renderBadge = () => {
    if (teamModel.sessionExists || teamModel.uploadExists) {
      return (
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            top: -3,
            right: -3,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "darkgray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={teamModel.sessionExists ? faTabletScreenButton : faUserGroup}
            size={20}
            style={{ color: "black" }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleOnPress()}
      style={{
        flex: 1,
      }}
    >
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
              teamModel.sessionExists || teamModel.uploadExists ? 0.5 : 1.0,
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {teamModel.allianceTeam}
        </Text>
        <Text style={{ color: "white" }}>{teamModel.teamNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MatchTeamSelect;
