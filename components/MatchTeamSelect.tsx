import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import type { Match, Team } from "@/helpers/types";

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
    let teamKey: string =
      alliance === "Blue"
        ? match.blueTeams[allianceTeam - 1]
        : match.redTeams[allianceTeam - 1];

    let team: Team = teamsLookup[teamKey];
    if (team === undefined) return "?";
    else return team.teamNumber;
  };

  return (
    <TouchableOpacity onPress={() => handleOnPress()}>
      <View
        style={[
          alliance === "Blue"
            ? themes.allianceBlueButton
            : themes.allianceRedButton,
          { flexDirection: "column" },
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
