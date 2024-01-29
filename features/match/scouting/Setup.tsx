import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";

export default function Setup() {
  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>
          This is where we will add the code and UI for setting up the Match
          they will be scouting.
        </Text>
        <Text>We will need record:</Text>
        <Text>Name (free text)</Text>
        <Text>Team being scouted if it is not the Team scheduled</Text>
      </View>
    </ScrollView>
  );
}
