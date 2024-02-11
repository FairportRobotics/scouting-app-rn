import React from "react";
import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faPeopleRobbery,
  faGear,
  faToiletPaper,
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
              icon={faToiletPaper}
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
              icon={faPeopleRobbery}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faGear}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
