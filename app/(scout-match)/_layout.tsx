import React from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSquareCheck,
  faRobot,
  faTowerBroadcast,
  faHourglassEnd,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function TabLayout() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="confirm/[id]"
        initialParams={{ id: id }}
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
        initialParams={{ id: id }}
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
        initialParams={{ id: id }}
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
        initialParams={{ id: id }}
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
        initialParams={{ id: id }}
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
