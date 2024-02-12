import { View, Text, Button } from "react-native";
import { ContainerGroup } from "@/app/components";
import { useEffect, useState } from "react";
import { Event, Match, Team, TeamMember } from "@/constants/Types";
import * as Database from "@/app/helpers/database";
import teamMembers from "@/data/teamMembers";

export default function Assign() {
  return (
    <View>
      <Text>Hello World.</Text>
    </View>
  );
}
