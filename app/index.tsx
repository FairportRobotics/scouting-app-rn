import React from "react";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();
  router.replace(`/(tabs)`);

  return <></>;
}
