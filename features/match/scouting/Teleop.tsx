import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Teleop() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>This is where we will add the code and UI for Teleop.</Text>
        <Text>Speaker Score Non-Amplified (-/+)</Text>
        <Text>Speaker Score Amplified (-/+)</Text>
        <Text>Speaker Miss (-/+)</Text>
        <Text>Amp Score (-/+)</Text>
        <Text>Amp Miss (-/+)</Text>
        <Text>Amp Cooperition (checkbox)</Text>
        <Text>Passes (-/+)</Text>
      </View>
    </ScrollView>
  );
}
