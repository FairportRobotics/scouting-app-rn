import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

function PitResultsScreen({ navigation }) {
  const { params } = useRoute();

  return (
    <View>
      <Text>Pit Results</Text>
    </View>
  );
}

export default PitResultsScreen;
