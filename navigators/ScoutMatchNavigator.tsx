import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MatchSelectTeamScreen,
  ConfirmScreen,
  AutoScreen,
  TeleopScreen,
  EndgameScreen,
  FinalScreen,
} from "@/screens";

import ROUTES from "@/constants/routes";

const Stack = createStackNavigator();

function ScoutMatchNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.MATCH_SCOUT_SELECT}
        component={MatchSelectTeamScreen}
      />
      <Stack.Screen
        name={ROUTES.MATCH_SCOUT_CONFIRM}
        component={ConfirmScreen}
      />
      <Stack.Screen name={ROUTES.MATCH_SCOUT_AUTO} component={AutoScreen} />
      <Stack.Screen name={ROUTES.MATCH_SCOUT_TELEOP} component={TeleopScreen} />
      <Stack.Screen
        name={ROUTES.MATCH_SCOUT_ENDGAME}
        component={EndgameScreen}
      />
      <Stack.Screen name={ROUTES.MATCH_SCOUT_FINAL} component={FinalScreen} />
    </Stack.Navigator>
  );
}

export default ScoutMatchNavigator;
