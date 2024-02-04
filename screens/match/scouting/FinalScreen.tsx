import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import ROUTES from "../../../constants/routes";

function FinalScreen({ navigation }) {
  const { params } = useRoute();
  const sessionKey = params["sessionKey"];

  return (
    <View>
      <Text>Teleop Screen for {sessionKey}</Text>
      <Button
        title="Done"
        onPress={() =>
          navigation.navigate(ROUTES.MATCH_SCOUT_SELECT, {
            sessionKey: sessionKey,
          })
        }
      />
    </View>
  );
}

export default FinalScreen;
