import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Final() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>This is where we will add the code and UI for Final.</Text>
        <Text>We will need to record:</Text>
        <Text>Total Score (-/+)</Text>
        <Text>Ranking Points (-/+)</Text>
        <Text>Alliance Result (Win/Lose/Tie)</Text>
        <Text>Violations (Red/Yellow/Disabled/Disqualified)</Text>
        <Text>
          Penalties (# but prompt that the number should be read from the
          opposite Alliance scoreboard)
        </Text>
        <Text>Notes (free text)</Text>
      </View>
    </ScrollView>
  );
}
