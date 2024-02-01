import { StyleSheet, ScrollView } from "react-native";
import FRSettings from "./FRSettings";
import TBASettings from "./TBASettings";
import TBACaches from "./TBACaches";

export default function SettingsScreen() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <FRSettings />
      <TBASettings />
      <TBACaches />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
