import { ScrollView, View } from "react-native";
import Caches from "@/app/admin/caches";
import FRSettings from "@/app/admin/FRSettings";
import TBACaches from "@/app/admin/TBACaches";
import DatabaseSettings from "@/app/admin/DatabaseSettings";

export default function SettingsScreen() {
  return (
    <ScrollView style={{ padding: 10 }}>
      <View style={{ flex: 1 }}>
        <Caches />
        {/* <DatabaseSettings />
        <FRSettings />
        <TBACaches /> */}
      </View>
    </ScrollView>
  );
}
