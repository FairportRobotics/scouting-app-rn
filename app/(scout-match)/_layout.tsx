import React from "react";
import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSquareCheck,
  faRobot,
  faTowerBroadcast,
  faHourglassEnd,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="confirm/[id]"
        options={{
          title: "Confirm",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faSquareCheck}
              size={32}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auto/[id]"
        options={{
          title: "Auto",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faRobot}
              size={32}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="teleop/[id]"
        options={{
          title: "Teleop",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faTowerBroadcast}
              size={32}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="endgame/[id]"
        options={{
          title: "Endgame",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faHourglassEnd}
              size={32}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="final/[id]"
        options={{
          title: "Final",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faList} size={32} style={{ color: color }} />
          ),
        }}
      />
    </Tabs>
  );
}
