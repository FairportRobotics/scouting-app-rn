import { Alert, Button, Share, View } from "react-native";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";
import * as FileSystem from "expo-file-system";

// Function to export SQLite database
const exportDatabase = async () => {
  try {
    // Format the heck out of the date so it can become part of the filename.
    let date = new Date();
    let formattedDate = date.toISOString();
    formattedDate = formattedDate.replaceAll("T", ".");
    formattedDate = formattedDate.replaceAll("-", "");
    formattedDate = formattedDate.replaceAll(/\.\d+Z$/g, "");
    formattedDate = formattedDate.replaceAll(":", "");

    // Create a copy of the database file in the app's cache directory
    const databaseUri = `${FileSystem.documentDirectory}/SQLite/scouting-app.db`;
    const cacheUri = `${FileSystem.cacheDirectory}Scouting-Harp-${formattedDate}.db`;
    await FileSystem.copyAsync({ from: databaseUri, to: cacheUri });
    return cacheUri;
  } catch (error) {
    console.error("Error exporting database:", error);
    throw error;
  }
};

const handleDeleteAndInitialize = () => {
  Alert.alert("Warning", "This will delete all data. Are you sure?", [
    {
      text: "Cancel",
      onPress: () => {},
      style: "cancel",
    },
    {
      text: "Delete",
      onPress: () => {
        Database.initializeDatabase(false, true);
      },
    },
  ]);
};

const handleDropAndInitialize = () => {
  Alert.alert(
    "Warning",
    "This will drop and recreate all tables. Are you sure?",
    [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          Database.initializeDatabase(true, true);
        },
      },
    ]
  );
};

// Function to handle sharing via AirDrop
const handleShare = async () => {
  try {
    const databaseUri = await exportDatabase();
    const shareOptions = {
      url: `file://${databaseUri}`,
      type: "application/x-sqlite3", // Adjust MIME type if needed
    };
    await Share.share(shareOptions);
  } catch (error) {
    console.error("Error sharing via AirDrop:", error);
  }
};

export default function DatabaseSettings() {
  return (
    <ContainerGroup title="Database">
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Share" onPress={handleShare} />
        <Button
          title="Delete data and initialize"
          onPress={handleDeleteAndInitialize}
        />
        <Button
          title="Drop tables and initialize"
          onPress={handleDropAndInitialize}
        />
      </View>
    </ContainerGroup>
  );
}
