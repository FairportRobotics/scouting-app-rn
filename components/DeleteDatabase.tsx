import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import ContainerGroup from "@/components/ContainerGroup";
import { getDatabasePath } from "@/data/db";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import Dialog from "react-native-dialog";
import Styles from "@/constants/Styles";

export default function DeleteDbScreen() {
  const [databasePath, setDatabasePath] = useState<string>(getDatabasePath());

  const [visible, setVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const showDialog = () => {
    setDeletePassword("");
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    const passwordBase64 = btoa(deletePassword);
    if (passwordBase64 === "ZGVsZXRlbWVwbGVhc2U=") {
      await FileSystem.deleteAsync(databasePath);
    }
    setVisible(false);
  };

  console.log(process.env.EXPO_PUBLIC_SAVE_URI as string);
  console.log(process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string);

  return (
    <ContainerGroup title="SQLite Database Path">
      <View>
        <View>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(databasePath)}
            style={{ paddingBottom: 20 }}
          >
            <Text>{databasePath.replace("file://", "")}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={[Styles.baseButton]}
            onPress={() => showDialog()}
          >
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              Delete Scouting Database
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Delete Scouting Database</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete the Scouting App database? All data
            will be lost. Enter password below.
          </Dialog.Description>
          <Dialog.Input
            label=""
            value={deletePassword}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(e) => setDeletePassword(e)}
          ></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Delete" onPress={handleDelete} />
        </Dialog.Container>
      </View>
    </ContainerGroup>
  );
}
