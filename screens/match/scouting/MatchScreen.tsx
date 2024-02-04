import React from "react";
import { View, Text, Button } from "react-native";
import ROUTES from "../../../constants/routes";

function MatchScreen({ navigation }) {
  return (
    <View>
      <Text>Match Screen</Text>
      <Button
        title="Confirm"
        onPress={() => navigation.navigate(ROUTES.MATCH_SCOUT_CONFIRM)}
      />
    </View>
  );
}

export default MatchScreen;
