import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function SelectMatch() {
  // [ ] List of Matches with
  //     [ ] Match Number
  //     [ ] Scheduled time
  //     [ ] Action to select Blue 1 / Team Number
  //     [ ] Action to select Blue 2 / Team Number
  //     [ ] Action to select Blue 3 / Team Number
  //     [ ] Action to select Red 1 / Team Number
  //     [ ] Action to select Red 2 / Team Number
  //     [ ] Action to select Red 3 / Team Number
  // (Actions should use lighter shade if Match/Team has already been scouted.)

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>
          This is where we will add the code and UI for selecting which
          Match/Team to scout.
        </Text>
      </View>
    </ScrollView>
  );
}
