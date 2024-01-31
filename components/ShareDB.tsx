import React from "react";
import { Button, Share } from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

// Open the database
const db = SQLite.openDatabase("scouting-app.db");

// Function to export SQLite database
const exportDatabase = async () => {
  try {
    // Create a copy of the database file in the app's cache directory
    const databaseUri = `${FileSystem.documentDirectory}/SQLite/scouting-app.db`;
    const cacheUri = `${FileSystem.cacheDirectory}scouting-app.db`;
    await FileSystem.copyAsync({ from: databaseUri, to: cacheUri });
    return cacheUri;
  } catch (error) {
    console.error("Error exporting database:", error);
    throw error;
  }
};

// Function to handle sharing via AirDrop
const shareViaAirDrop = async () => {
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

const ShareDB = () => {
  return (
    <Button title="Share Database via AirDrop" onPress={shareViaAirDrop} />
  );
};

export default ShareDB;
