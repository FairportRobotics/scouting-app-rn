import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import type { Match, MatchScoutingSession, Team } from "@/constants/Types";
import Styles from "@/constants/Styles";

interface MatchTeamSelectProps {
  match: Match;
  eventTeams: Array<Team>;
  sessions: Array<MatchScoutingSession>;
  alliance: string;
  allianceTeam: number;
  onSelect: () => void;
  style?: {};
}

const MatchTeamSelect: React.FC<MatchTeamSelectProps> = ({
  match,
  eventTeams,
  sessions,
  alliance,
  allianceTeam,
  onSelect,
  style,
}) => {
  const handleOnPress = () => {
    onSelect();
  };

  const lookupTeam = (alliance: string, allianceTeam: number) => {
    // Obtain the Team key.
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
    let team: Team | undefined = eventTeams.find(
      (team: Team) => team.key === teamKey
    );
    if (team === undefined) return "?";
    else return team.teamNumber;
  };

  const opacity = () => {
    const session = sessions.find(
      (session) =>
        session.matchKey == match.key &&
        session.alliance == alliance &&
        session.allianceTeam == allianceTeam
    );

    return session ? 0.5 : 1.0;
  };

  return (
    <TouchableOpacity
      onPress={() => handleOnPress()}
      style={{ opacity: opacity() }}
    >
      <View
        style={[
          alliance === Alliance.Blue
            ? Styles.allianceBlueButton
            : Styles.allianceRedButton,
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
