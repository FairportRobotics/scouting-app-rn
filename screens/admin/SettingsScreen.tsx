import { ScrollView, View } from "react-native";
import FRSettings from "./FRSettings";
import TBACaches from "./TBACaches";
import DatabaseSettings from "./DatabaseSettings";

function SettingsScreen({ navigation }) {
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
