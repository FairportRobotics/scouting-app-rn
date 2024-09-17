import React from "react";
import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faRobot,
  faDatabase,
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Scout Matches",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faHouse}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matchScoutingResults"
        options={{
          title: "Match Scouting Results",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faRobot}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scoutPits"
        options={{
          title: "Scout Pits",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faPeopleArrows}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="caches"
        options={{
          title: "Caches",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faDatabase}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
