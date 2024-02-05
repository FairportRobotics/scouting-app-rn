import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import type { AppSettings } from "@/constants/Types";
import ContainerGroup from "@/app/components/ContainerGroup";
import themes from "@/constants/Styles";
import * as Database from "@/app/helpers/database";

export default function FRSettings() {
  const isFocused = useIsFocused();

  const [appSettings, setAppSettings] = useState<AppSettings>({
    key: "dev",
    tbaKey: "x8rBFFn8bO55wh2IfDAxZgDX0FBdT13jIuWpcAzQbPntINbK74CRw2WuXPfhOJcs",
    saveUri:
      "https://dev-r3-sync.azurewebsites.net/api/v1?code=cTLmtCoMrQE_HyCtUXhMD2MsgsMGYiDyVheoF6GCFx6_AzFu2CuY5g==",
  });

  const handleChange = (key: string, value: string) => {
    setAppSettings((previous) => {
      return {
        ...previous,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    const getSettings = async () => {
      try {
        const dtoSettings = await Database.getSettings("dev");
        if (dtoSettings !== undefined) setAppSettings(dtoSettings);
      } catch (error) {
        console.error("Error saving data to database:", error);
      }
    };

    if (isFocused) {
      getSettings();
    }
  }, [isFocused]);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        Database.saveSettings(appSettings);
      } catch (error) {
        console.error("Error saving data to database:", error);
      }
    };

    saveSettings();
  }, [appSettings]);

  return (
    <ContainerGroup title="Fairport Robotics Settings">
      <View style={{ width: "100%" }}>
        <Text>The Blue Alliance API Key</Text>
        <TextInput
          style={themes.textInput}
          value={appSettings.tbaKey}
          secureTextEntry={true}
          onChangeText={(text) => handleChange("tbaKey", text)}
        ></TextInput>
      </View>
      <View style={{ width: "100%" }}>
        <Text>Save URI</Text>
        <TextInput
          style={themes.textInput}
          value={appSettings.saveUri}
          onChangeText={(text) => handleChange("saveUri", text)}
        ></TextInput>
      </View>
    </ContainerGroup>
  );
}
