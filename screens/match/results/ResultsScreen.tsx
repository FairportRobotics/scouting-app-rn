import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

function MatchResultsScreen({ navigation }) {
  const { params } = useRoute();

  return (
    <View>
      <Text>Match Results</Text>
    </View>
  );
}

export default MatchResultsScreen;
