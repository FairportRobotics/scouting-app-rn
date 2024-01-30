import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Final() {
  // [ ] Total Score (-/+)
  // [ ] Ranking Points (-/+)
  // [ ] Alliance Result (Win/Lose/Tie)
  // [ ] Violations (Red/Yellow/Disabled/Disqualified)
  // [ ] Penalties (prompt that the number should be read from the oposing Alliance Scoreboard)
  // [ ] Notes (text)

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>This is where we will add the code and UI for Final.</Text>
      </View>
    </ScrollView>
  );
}
