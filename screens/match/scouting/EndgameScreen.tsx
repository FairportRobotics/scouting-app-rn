import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import ROUTES from "../../../constants/routes";

function EndgameScreen({ navigation }) {
  const { params } = useRoute();
  const sessionKey = params["sessionKey"];

  return (
    <View>
      <Text>Teleop Screen for {sessionKey}</Text>
      <Button
        title="Next"
        onPress={() =>
          navigation.navigate(ROUTES.MATCH_SCOUT_FINAL, {
            sessionKey: sessionKey,
          })
        }
      />
    </View>
  );
}

export default EndgameScreen;
