import { View, Text, ColorValue } from "react-native";
import { MatchScoutingSession } from "@/constants/Types";
import { Alliance } from "@/constants/Enums";
import Colors from "@/constants/Colors";

type MatchScoutingHeaderProps = {
  session: MatchScoutingSession;
};

export default function MatchScoutingHeader({
  session,
}: MatchScoutingHeaderProps) {
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
        Match {session.matchNumber}
      </Text>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        Team {session.teamNumber}
      </Text>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        {session.alliance} {session.allianceTeam}
      </Text>
    </View>
  );
}
