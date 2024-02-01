import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import type { Match, Team } from "@/helpers/types";
import { Alliance, AllianceTeam } from "@/helpers/constants";

interface MatchTeamSelectProps {
  match: Match;
  teamsLookup: Record<string, Team>;
  alliance: string;
  allianceTeam: number;
  onPress: () => void;
  style?: {};
}

const MatchTeamSelect: React.FC<MatchTeamSelectProps> = ({
  match,
  teamsLookup,
  alliance,
  allianceTeam,
  onPress,
  style,
}) => {
  const handleOnPress = () => {
    onPress();
  };

  const lookupTeam = (alliance: string, allianceTeam: number) => {
    // Using the Alliance and the AllianceTeam, retrieve the teamKey
    // from the dictionary for the Alliance color.
    let teamKey: string = "";

    if (alliance === Alliance.Blue) {
      switch (allianceTeam) {
        case AllianceTeam.One:
          teamKey = match.blue1TeamKey;
          break;
        case AllianceTeam.Two:
          teamKey = match.blue2TeamKey;
          break;
        case AllianceTeam.Three:
          teamKey = match.blue3TeamKey;
          break;
        default:
          teamKey = "";
      }
    } else if (alliance === Alliance.Red) {
      switch (allianceTeam) {
        case AllianceTeam.One:
          teamKey = match.red1TeamKey;
          break;
        case AllianceTeam.Two:
          teamKey = match.red2TeamKey;
          break;
        case AllianceTeam.Three:
          teamKey = match.red3TeamKey;
          break;
        default:
          teamKey = "";
      }
    }

    // Lookup the actual Team based on the teamKey.
    let team: Team = teamsLookup[teamKey];
    if (team === undefined) return "?";
    else return team.teamNumber;
  };

  return (
    <TouchableOpacity onPress={() => handleOnPress()}>
      <View
        style={[
          alliance === Alliance.Blue
            ? themes.allianceBlueButton
            : themes.allianceRedButton,
          { flexDirection: "column", width: 90 },
        ]}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {allianceTeam}
        </Text>
        <Text style={{ color: "white" }}>
          {lookupTeam(alliance, allianceTeam)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MatchTeamSelect;
