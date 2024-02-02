import { ScrollView, View } from "react-native";
import FRSettings from "./FRSettings";
import TBASettings from "./TBASettings";
import TBACaches from "./TBACaches";
import DatabaseSettings from "./DatabaseSettings";

export default function SettingsScreen() {
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <DatabaseSettings />
        <FRSettings />
        <TBASettings />
        <TBACaches />
      </View>
    </ScrollView>
  );
}
