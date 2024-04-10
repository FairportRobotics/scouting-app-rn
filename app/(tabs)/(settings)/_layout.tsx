import React from "react";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="caches"
        options={{ title: "Caches", headerTitle: "Caches" }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
