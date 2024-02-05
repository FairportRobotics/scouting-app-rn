import React from "react";
import { View, Text } from "react-native";
import type { Match, Team } from "@/constants/Types";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import MatchTeamSelect from "./MatchTeamSelect";

interface ScoutingMatchSelectProps {
  match: Match;
  eventTeams: Array<Team>;
  onSelect: (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => void;
}

const ScoutingMatchSelect: React.FC<ScoutingMatchSelectProps> = ({
  match,
  eventTeams,
  onSelect,
}) => {
  const handleOnSelect = (
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
            <Text style={{ fontSize: 18 }}>Practice</Text>
            <Text>Anytime</Text>
          </View>
        )}
        {match.matchNumber !== 0 && (
          <View>
            <Text style={{ fontSize: 18 }}>Match {match.matchNumber}</Text>
            <Text>{new Date(match.predictedTime).toLocaleTimeString()}</Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.One}
          onSelect={() =>
            handleOnSelect(
              match.key,
              Alliance.Blue,
              AllianceTeam.One,
              match.blue1TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.Two}
          onSelect={() =>
            handleOnSelect(
              match.key,
              Alliance.Blue,
              AllianceTeam.Two,
              match.blue2TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Blue}
          allianceTeam={AllianceTeam.Three}
          onSelect={() =>
            handleOnSelect(
              match.key,
              Alliance.Blue,
              AllianceTeam.Three,
              match.blue3TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.One}
          onSelect={() =>
            handleOnSelect(
              match.key,
              Alliance.Red,
              AllianceTeam.One,
              match.red1TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.Two}
          onSelect={() =>
            handleOnSelect(
              match.key,
              Alliance.Red,
              AllianceTeam.Two,
              match.red2TeamKey
            )
          }
        />
        <MatchTeamSelect
          match={match}
          eventTeams={eventTeams}
          alliance={Alliance.Red}
          allianceTeam={AllianceTeam.Three}
          onSelect={() =>
            handleOnSelect(
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
