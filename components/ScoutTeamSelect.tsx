import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTabletScreenButton,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { Alliance } from "@/constants/Enums";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { MatchSelectTeamModel } from "@/data/db";

type ScoutTeamSelectProps = {
  alliance: string;
  allianceTeam: number;
  teamModel: MatchSelectTeamModel;
  onSelect: (sessionKey: string) => void;
};

export default function ScoutTeamSelect({
  alliance,
  allianceTeam,
  teamModel,
  onSelect,
}: ScoutTeamSelectProps) {
  const handleOnPress = () => {
    onSelect(teamModel.sessionKey);
  };

  const renderBadge = () => {
    if (teamModel.scouted) {
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
              teamModel.scouted && teamModel.uploaded
                ? Colors.uploaded
                : Colors.notUploaded,
            borderWidth: 2,
            borderColor:
              teamModel.scouted && teamModel.uploaded
                ? Colors.uploaded
                : Colors.notUploaded,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={teamModel.uploaded ? faCloud : faTabletScreenButton}
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
          alliance === Alliance.Blue
            ? Styles.allianceBlueButton
            : Styles.allianceRedButton,
          {
            width: "100%",
            height: 60,
            flexDirection: "column",
            opacity: teamModel.scouted ? 0.6 : 1.0,
          },
        ]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {allianceTeam}
        </Text>
        <Text style={{ color: "white", fontSize: 24 }}>
          {teamModel.teamNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
