import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MatchResultsScreen,
  PitScreen,
  PitResultsScreen,
  SettingsScreen,
} from "../screens";
import ScoutMatchNavigator from "./ScoutMatchNavigator";
import ROUTES from "../constants/routes";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={ROUTES.TAB_MATCH_SCOUT}
        component={ScoutMatchNavigator}
      />
      <Tab.Screen
        name={ROUTES.TAB_MATCH_RESULTS}
        component={MatchResultsScreen}
      />
      <Tab.Screen name={ROUTES.TAB_PIT_SCOUT} component={PitScreen} />
      <Tab.Screen name={ROUTES.TAB_PIT_RESULTS} component={PitResultsScreen} />
      <Tab.Screen name={ROUTES.TAB_SCOUTSETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
