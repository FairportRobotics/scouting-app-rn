import React, { useEffect, useState } from "react";
import { View, Text, ColorValue } from "react-native";
import { MatchScoutingSession, Team } from "@/constants/Types";
import { Alliance } from "@/constants/Enums";
import Colors from "@/constants/Colors";
import * as Database from "@/app/helpers/database";

interface MatchScoutingHeaderProps {
  sessionKey: string;
}

const MatchScoutingHeader: React.FC<MatchScoutingHeaderProps> = ({
  sessionKey,
}) => {
  const [session, setSession] = useState<MatchScoutingSession>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);
      const dtoTeams = await Database.getTeams();
      const dtoTeam = dtoTeams.find(
        (team) => team.key === dtoSession?.scoutedTeamKey
      );

      // Validate.
      if (dtoSession === undefined) return;
      if (dtoTeam === undefined) return;

      // Set State.
      setSession(dtoSession);
      setScoutedTeam(dtoTeam);
    } catch (error) {
      console.error(error);
    }
  };

  const allianceColor = (): ColorValue => {
    switch (session?.alliance) {
      case Alliance.Blue:
        return Colors.allianceBlue;
      case Alliance.Red:
        return Colors.allianceRed;
      default:
        return "gray";
    }
  };

  return (
    <View
      style={{
        backgroundColor: allianceColor(),
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        Match {session?.matchNumber}
      </Text>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        Team {scoutedTeam?.teamNumber}
      </Text>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        {session?.alliance} {session?.allianceTeam}
      </Text>
    </View>
  );
};

export default MatchScoutingHeader;
