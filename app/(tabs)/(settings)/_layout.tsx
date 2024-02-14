import React from "react";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer>
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
        name="assignments"
        options={{
          title: "Match Assignments",
          headerTitle: "Match Assignments",
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
