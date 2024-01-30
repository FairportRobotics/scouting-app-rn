import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import themes from "./themes/themes";

// Import all the Screens here (for debugging).
import MatchScoutAuto from "./features/match/scouting/Auto";
import MatchScoutEndgame from "./features/match/scouting/Endgame";
import MatchScoutFinal from "./features/match/scouting/Final";
import MatchScoutSelectMatch from "./features/match/scouting/SelectMatch";
import MatchScoutSetup from "./features/match/scouting/Setup";
import MatchScoutTeleop from "./features/match/scouting/Teleop";
import CacheEvent from "./features/admin/TBACaches";
import PitScoutTeam from "@/features/pit/scouting/PitScoutTeam";
import Settings from "@/features/admin/Settings";
import Endgame from "./features/match/scouting/Endgame";
import Final from "./features/match/scouting/Final";
import SelectMatch from "./features/match/scouting/SelectMatch";
import Setup from "./features/match/scouting/Setup";
import Teleop from "./features/match/scouting/Teleop";

export default function App() {
  return (
    <SafeAreaView style={themes.app}>
      <View>
        <Teleop />
        <StatusBar style="auto" hidden />
      </View>
    </SafeAreaView>
  );
}
