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

import CacheEvent from "./features/admin/caches/CacheEvent";

export default function App() {
  return (
    <SafeAreaView style={themes.app}>
      <View>
        <CacheEvent></CacheEvent>
        <StatusBar style="auto" hidden />
      </View>
    </SafeAreaView>
  );
}
