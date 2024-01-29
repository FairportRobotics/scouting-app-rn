import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import themes from "./themes/themes";

// Import all the Screens here (for debugging for now).
import MatchScoutAuto from "./features/match/scouting/Auto";

export default function App() {
  return (
    <SafeAreaView style={themes.app}>
      <View>
        <MatchScoutAuto></MatchScoutAuto>
        <StatusBar style="auto" hidden />
      </View>
    </SafeAreaView>
  );
}
