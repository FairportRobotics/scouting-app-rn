import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Scouting Match Screens.
import MatchScoutSelectMatch from "@/screens/match/scouting/SelectMatchScreen";
import MatchScoutSetup from "@/screens/match/scouting/SetupScreen";
import MatchScoutAuto from "@/screens/match/scouting/AutoScreen";
import MatchScoutTeleop from "@/screens/match/scouting/TeleopScreen";
import MatchScoutEndgame from "@/screens/match/scouting/EndgameScreen";
import MatchScoutFinal from "@/screens/match/scouting/FinalScreen";
import MatchScoutResults from "@/screens/match/results/MatchResultsScreen";

// Pit Scouting screens.
import SelectTeamScreen from "@/screens/pit/scouting/SelectTeamScreen";
import ScoutTeam from "@/screens/pit/scouting/ScoutTeam";
import PitResultsScreen from "@/screens/pit/results/PitResultsScreen";

// Other screens.
import SettingsScreen from "@/screens/admin/SettingsScreen";
import Testing from "@/screens/Testing";
import ShareDB from "@/components/ShareDB";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Scout Match" component={MatchScoutSelectMatch} />
        <Drawer.Screen name="   Setup" component={MatchScoutSetup} />
        <Drawer.Screen name="   Auto" component={MatchScoutAuto} />
        <Drawer.Screen name="   Teleop" component={MatchScoutTeleop} />
        <Drawer.Screen name="   Endgame" component={MatchScoutEndgame} />
        <Drawer.Screen name="   Final" component={MatchScoutFinal} />

        <Drawer.Screen name="Scout Pit" component={SelectTeamScreen} />
        <Drawer.Screen name="   Team" component={ScoutTeam} />

        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="   Testing" component={Testing} />
        <Drawer.Screen name="   Share DB" component={ShareDB} />

        <Drawer.Screen
          name="Results of Match Scouting"
          component={MatchScoutResults}
        />
        <Drawer.Screen
          name="Results of Pit Scouting"
          component={PitResultsScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
