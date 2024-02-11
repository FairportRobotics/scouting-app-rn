import React from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSquareCheck,
  faRobot,
  faTowerBroadcast,
  faHourglassEnd,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function TabLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="confirm/[id]"
        initialParams={{ id: id }}
        options={{
          title: "Confirm",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faSquareCheck}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auto/[id]"
        initialParams={{ id: id }}
        options={{
          title: "Auto",
          headerShown: false,
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
        name="teleop/[id]"
        initialParams={{ id: id }}
        options={{
          title: "Teleop",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faTowerBroadcast}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="endgame/[id]"
        initialParams={{ id: id }}
        options={{
          title: "Endgame",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faHourglassEnd}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="final/[id]"
        initialParams={{ id: id }}
        options={{
          title: "Final",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faList}
              size={size}
              style={{ color: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
