import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Import all the Screens here (for debugging).

// Scouting Match Screens.
import MatchScoutSelectMatch from "./features/match/scouting/SelectMatch";
import MatchScoutSetup from "./features/match/scouting/Setup";
import MatchScoutAuto from "./features/match/scouting/Auto";
import MatchScoutTeleop from "./features/match/scouting/Teleop";
import MatchScoutEndgame from "./features/match/scouting/Endgame";
import MatchScoutFinal from "./features/match/scouting/Final";

import PitScoutSelectTeam from "./features/pit/scouting/PitScoutSelectTeam";
import PitScoutTeam from "@/features/pit/scouting/PitScoutTeam";

import Settings from "@/features/admin/Settings";
import MatchScoutResults from "./features/match/results/MatchResults";
import PitScoutResults from "./features/pit/results/PitScoutResults";

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

        <Drawer.Screen name="Scout Pit" component={PitScoutSelectTeam} />
        <Drawer.Screen name="   Team" component={PitScoutTeam} />
        <Drawer.Screen name="Settings" component={Settings} />

        <Drawer.Screen
          name="Results of Match Scouting"
          component={MatchScoutResults}
        />
        <Drawer.Screen
          name="Results of Pit Scouting"
          component={PitScoutResults}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
