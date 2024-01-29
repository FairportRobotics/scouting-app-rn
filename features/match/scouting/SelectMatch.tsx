import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function SelectMatch() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>
          This is where we will add the code and UI for selecting which
          Match/Team to scout.
        </Text>
        <Text>
          List the Matchess with the ability to select Blue 1, 2, 3 or Red 1, 2,
          3.
        </Text>
        <Text>
          Provide a means of showing/hiding Matches which have already been
          scouted at least once.
        </Text>
      </View>
    </ScrollView>
  );
}
