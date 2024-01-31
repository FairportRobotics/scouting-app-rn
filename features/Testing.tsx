import { Button, Text, View, TextInput } from "react-native";
import ContainerGroup from "@/components/ContainerGroup";
import fetchEvent from "@/helpers/fetchEvent";
import fetchEventMatches from "@/helpers/fetchEventMatches";
import * as Database from "@/helpers/database";

export default function Testing() {
  const handleFetchEvent = async () => {
    console.log("handleFetchEvent...");
    const dtos = await fetchEvent("2024paca");
    console.log("handleFetchEvent dtos:", dtos);
  };

  const handleFetchMatches = async () => {
    console.log("handleFetchMatches...");
    const dtos = await fetchEventMatches("2023nyrr");
    dtos.forEach((item) => {
      console.log("item comp_level", item.comp_level);
    });
  };

  const handleLoadMatches = async () => {
    console.log("handleLoadMatches...");
    const matches = await Database.getMatchesForEvent("2023nyrr");
    matches.forEach((item) => {
      console.log("item.key:", item.key);
    });
  };

  return (
    <ContainerGroup title="The Blue Alliance API">
      <View>
        <Button title="Fetch Event" onPress={handleFetchEvent} />
        <Button title="Fetch Matches" onPress={handleFetchMatches} />
        <Button title="Load Matches" onPress={handleLoadMatches} />
      </View>
    </ContainerGroup>
  );
}
