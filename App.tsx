import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Scouting Match Screens.
import MatchScoutResults from "@/screens/match/results/MatchResultsScreen";

// Pit Scouting screens.
import SelectTeamScreen from "@/screens/pit/scouting/SelectTeamScreen";
import PitResultsScreen from "@/screens/pit/results/PitResultsScreen";

// Other screens.
import SettingsScreen from "@/screens/admin/SettingsScreen";
import IndexScreen from "./screens/match/scouting/Index";

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
          <Tab.Screen name="Scout Match" component={IndexScreen} />
          <Tab.Screen name="Scout Pit" component={SelectTeamScreen} />
          <Tab.Screen name="Match Results" component={MatchScoutResults} />
          <Tab.Screen name="Pit Results" component={PitResultsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
