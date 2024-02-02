import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Match Scouting Screens.
import MatchScoutingIndexScreen from "./screens/match/scouting/Index";
import MatchScoutResults from "@/screens/match/results/MatchResultsScreen";

// Pit Scouting Screens.
import PitScoutingIndexScreen from "./screens/pit/scouting/IndexScreen";
import PitResultsScreen from "@/screens/pit/results/PitResultsScreen";

// Other screens.
import SettingsScreen from "@/screens/admin/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { paddingBottom: 10 },
          }}
        >
          <Tab.Screen name="Scout Match" component={MatchScoutingIndexScreen} />
          <Tab.Screen
            name="Scout Pit"
            component={PitScoutingIndexScreen}
            initialParams={{ mode: "Select" }}
          />
          <Tab.Screen name="Match Results" component={MatchScoutResults} />
          <Tab.Screen name="Pit Results" component={PitResultsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
