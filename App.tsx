import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigators/TabNavigator";
import React from "react";
import { View } from "react-native";

function App() {
  return (
    <React.StrictMode>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <TabNavigator />
        </View>
      </NavigationContainer>
    </React.StrictMode>
  );
}

export default App;
