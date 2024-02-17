import React from "react";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="teammembers"
        options={{ title: "Team Members", headerTitle: "Team Members" }}
      />
      <Drawer.Screen
        name="caches"
        options={{ title: "Caches", headerTitle: "Caches" }}
      />
      <Drawer.Screen
        name="database"
        options={{
          title: "Database Functions",
          headerTitle: "Database Functions",
        }}
      />
      <Drawer.Screen
        name="thebluealliance"
        options={{
          title: "The Blue Alliance",
          headerTitle: "Refresh from The Blue Alliance",
        }}
      />
      <Drawer.Screen
        name="assignments/[id]"
        options={{
          title: "Match Assignments",
          headerTitle: "Match Assignments",
        }}
      />
      <Drawer.Screen
        name="testing"
        options={{ title: "Testing", headerTitle: "Testing" }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
