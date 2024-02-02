import { ScrollView, View } from "react-native";
import FRSettings from "./FRSettings";
import TBACaches from "./TBACaches";
import DatabaseSettings from "./DatabaseSettings";

export default function SettingsScreen() {
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <DatabaseSettings />
        <FRSettings />
        <TBACaches />
      </View>
    </ScrollView>
  );
}
