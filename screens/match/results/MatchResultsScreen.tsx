import { Text, View, ScrollView } from "react-native";

export default function MatchResultsScreen() {
  // [ ] List of Matches (Match Number/Team) with:
  //    [ ] Team Number
  //    [ ] Team Nickname
  //    [ ] Action to Edit Scout data
  //    [ ] Action to Upload (lighter color if uploaded)
  //    [ ] Action to show QR Code (lighter color if shown)
  //    [ ] Action to show JSON

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text>Match Scouting - Results</Text>
      </View>
    </ScrollView>
  );
}
