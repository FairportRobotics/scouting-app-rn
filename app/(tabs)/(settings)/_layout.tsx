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
    </Drawer>
  );
};

export default DrawerLayout;
