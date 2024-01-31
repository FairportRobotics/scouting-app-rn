import { Button, Text, View, TextInput } from "react-native";
import ContainerGroup from "@/components/ContainerGroup";
import fetchEvent from "@/helpers/fetchEvent";
import fetchEventMatches from "@/helpers/fetchEventMatches";

export default function Testing() {
  const handleFetchEvent = async () => {
    console.log("handleFetchEvent...");
    const dtos = await fetchEvent("2024paca");
    console.log("handleFetchEvent dtos:", dtos);
  };

  const handleFetchMatches = async () => {
    console.log("handleFetchMatches...");
    const dtos = await fetchEventMatches("2024paca");
    console.log("handleFetchMatches dtos:", dtos);
  };

  return (
    <ContainerGroup title="The Blue Alliance API">
      <View>
        <Button title="Fetch Event" onPress={handleFetchEvent} />
        <Button title="Fetch Matches" onPress={handleFetchMatches} />
      </View>
    </ContainerGroup>
  );
}
