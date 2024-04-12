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
          title: "Match Scouting",
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
        name="matchResults"
        options={{
          title: "Match Results",
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
        name="scoutPit"
        options={{
          title: "Pit Scouting",
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
