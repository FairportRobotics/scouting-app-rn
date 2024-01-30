import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Teleop() {
  // [ ] Speaker
  //     [ ] Score: Non-Amplified (-/+)
  //     [ ] Score: Amplified (-/+)
  //     [ ] Miss (-/+)
  // [ ] Amp
  //     [ ] Score (-/+)
  //     [ ] Miss (-/+)
  //     [ ] Cooperition (checkbox)
  // [ ] Passes (-/+)

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>This is where we will add the code and UI for Teleop.</Text>
      </View>
    </ScrollView>
  );
}
