import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigators/TabNavigator";
import React from "react";

function App() {
  return (
    <React.StrictMode>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </React.StrictMode>
  );
}

export default App;
