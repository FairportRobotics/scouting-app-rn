import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Endgame() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>This is where we will add the code and UI for Endgame.</Text>
        <Text>We will need to record:</Text>
        <Text>Trap Score (-/+)</Text>
        <Text>Microphone Score (-/+)</Text>
        <Text>Did Robot Park (cechkbox)</Text>
        <Text>Did Robot Hang (cechkbox)</Text>
        <Text>If Did Hang: Harmony Score (0/1/2)</Text>
      </View>
    </ScrollView>
  );
}
