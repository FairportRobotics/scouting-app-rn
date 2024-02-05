import { ScrollView, View } from "react-native";
import FRSettings from "@/app/admin/FRSettings";
import TBACaches from "@/app/admin/TBACaches";
import DatabaseSettings from "@/app/admin/DatabaseSettings";

function SettingsScreen() {
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

export default SettingsScreen;
