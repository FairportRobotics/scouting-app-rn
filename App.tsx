import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import themes from "./themes/themes"


import MatchScoutAuto from "./features/match/scouting/Auto"

export default function App() {
  return (
    <SafeAreaView style={themes.app}>
      <MatchScoutAuto></MatchScoutAuto>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
