import { Text, View, ScrollView } from "react-native";
import storage from "@/helpers/storage";

export default function PitScoutSelectTeam() {
  // [ ] Retrieve Teams from cache
  // [ ] Enumerate over Teams and emit a row that provides the following:
  //     [ ] Team Number
  //     [ ] Team Nickname
  //     [ ] Action to Edit (lighter color if already scouted)

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>Pit Scouting - Select Team</Text>
      </View>
    </ScrollView>
  );
}
