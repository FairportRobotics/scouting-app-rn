import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import type { Match, Team } from "@/helpers/types";
import MatchTeamSelect from "./MatchTeamSelect";

interface ScoutingMatchSelectProps {
  match: Match;
  teamsLookup: Record<string, Team>;
  onSelect: (matchKey: string, alliance: string, allianceTeam: number) => void;
  style?: {};
}

const ScoutingMatchSelect: React.FC<ScoutingMatchSelectProps> = ({
  match,
  teamsLookup,
  onSelect,
  style,
}) => {
  const handleOnPress = (
    matchKey: string,
    alliance: string,
    allianceTeam: number
  ) => {
    onSelect(matchKey, alliance, allianceTeam);
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <View style={{ marginRight: 20, width: 100 }}>
        <Text>Match {match.matchNumber}</Text>
        <Text>{new Date(match.predictedTime).toLocaleTimeString()}</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Blue"}
          allianceTeam={1}
          onPress={() => handleOnPress(match.key, "Blue", 1)}
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Blue"}
          allianceTeam={2}
          onPress={() => handleOnPress(match.key, "Blue", 2)}
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Blue"}
          allianceTeam={3}
          onPress={() => handleOnPress(match.key, "Blue", 3)}
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Red"}
          allianceTeam={1}
          onPress={() => handleOnPress(match.key, "Red", 1)}
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Red"}
          allianceTeam={2}
          onPress={() => handleOnPress(match.key, "Red", 2)}
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={"Red"}
          allianceTeam={3}
          onPress={() => handleOnPress(match.key, "Red", 3)}
        />
      </View>
    </View>
  );
};

export default ScoutingMatchSelect;
