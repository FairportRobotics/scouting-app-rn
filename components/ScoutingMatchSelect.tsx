import React from "react";
import { View, Text } from "react-native";
import themes from "@/themes/themes";
import type { Match, Team } from "@/helpers/types";
import { Alliance, AllianceTeam } from "@/helpers/constants";
import MatchTeamSelect from "./MatchTeamSelect";

interface ScoutingMatchSelectProps {
  match: Match;
  teamsLookup: Record<string, Team>;
  onSelect: (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => void;
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
    allianceTeam: number,
    teamKey: string
  ) => {
    onSelect(matchKey, alliance, allianceTeam, teamKey);
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <View style={{ marginRight: 20, width: 100 }}>
        {match.matchNumber === 0 && (
          <View>
            <Text>Practice</Text>
            <Text>Anytime</Text>
          </View>
        )}
        {match.matchNumber !== 0 && (
          <View>
            <Text>Match {match.matchNumber}</Text>
            <Text>{new Date(match.predictedTime).toLocaleTimeString()}</Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.One}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Blue,
              AllianceTeam.One,
              match.blue1TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.Two}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Blue,
              AllianceTeam.Two,
              match.blue2TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.Three}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Blue,
              AllianceTeam.Three,
              match.blue3TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.One}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Red,
              AllianceTeam.One,
              match.red1TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.Two}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Red,
              AllianceTeam.Two,
              match.red2TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          teamsLookup={teamsLookup}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.Three}
          onPress={() =>
            handleOnPress(
              match.key,
              Alliance.Red,
              AllianceTeam.Three,
              match.red3TeamKey
            )
          }
        />
      </View>
    </View>
  );
};

export default ScoutingMatchSelect;
