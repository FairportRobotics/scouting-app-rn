import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import { PitScoutingSessionAction, Match } from "@/constants/Types";
import ResultsButton from "../components/ResultsButton";
import QrCodeModal from "../components/QrCodeModal";
import * as Database from "@/app/helpers/database";

function ScoutPitScreen() {
  const router = useRouter();

  const [matches, setMatches] = useState<Array<Match>>([]);
  const [actions, setActions] = useState<Array<PitScoutingSessionAction>>([]);
  const [isRefeshing, setIsRefreshing] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  const loadData = async () => {
    try {
      // Load data from database.
      const dtoMatches = await Database.getMatches();
      const dtoActions = await Database.getPitScoutingSessionActions();

      // Validate.
      if (dtoMatches === undefined) return;
      if (dtoActions === undefined) return;

      setMatches(matches);
      setActions(dtoActions);
    } catch (error) {
      console.error(error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadAllPitResults = () => {
    console.log("ScoutPitScreen handleUploadAllPitResults...");
  };

  const handleShareAllPitResultsJson = () => {
    console.log("ScoutPitScreen handleShareAllPitResultsJson...");
  };

  const handleShareAllPitResultsCsv = () => {
    console.log("ScoutPitScreen handleShareAllPitResultsCsv...");
  };

  const handleEditSession = (key: string) => {
    console.log(key, ": Session Edit");
    router.replace(`/scout-pit/${key}`);
  };

  const handleUploadSession = async (key: string) => {
    await Database.savePitScoutingSessionUploadedDate(key);
    loadData();
  };

  const handleShowSessionJsonQR = async (key: string) => {
    await Database.savePitScoutingSessionQrJsonDate(key);
    loadData();

    const session = await Database.getPitScoutingSession(key);
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShowSessionCsvQR = async (key: string) => {
    await Database.savePitScoutingSessionQrCsvDate(key);
    loadData();
  };

  const handleShareSessionJson = async (key: string) => {
    await Database.savePitScoutingSessionShareJsonDate(key);

    loadData();
  };

  const handleShareSessionCsv = async (key: string) => {
    await Database.savePitScoutingSessionShareCsvDate(key);

    loadData();
  };

  if (isRefeshing) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (showQrCode) {
    return (
      <QrCodeModal
        value={qrCodeText}
        onPressClose={() => setShowQrCode(false)}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={isRefeshing} onRefresh={onRefresh} />
      }
    >
      <ContainerGroup title="All Match Data">
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <ResultsButton
              label="Upload"
              faIcon="upload"
              onPress={() => handleUploadAllPitResults()}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              onPress={() => handleShareAllPitResultsJson()}
            />
            <ResultsButton
              label="CSV"
              faIcon="share"
              onPress={() => handleShareAllPitResultsCsv()}
            />
          </View>
        </View>
      </ContainerGroup>
      {actions.map((item, index) => (
        <ContainerGroup
          title={`${item.teamNumber} - ${item.nickname}`}
          key={index}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <ResultsButton
              label="Scout"
              faIcon="edit"
              styles={{ opacity: item.wasScouted ? 0.5 : 1.0 }}
              onPress={() => handleEditSession(item.key)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              styles={{ opacity: item.uploadedDate ? 0.5 : 1.0 }}
              onPress={() => handleUploadSession(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              styles={{ opacity: item.qrJsonDate ? 0.5 : 1.0 }}
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ResultsButton
              label="CSV"
              faIcon="qr"
              styles={{ opacity: item.qrCsvDate ? 0.5 : 1.0 }}
              onPress={() => handleShowSessionCsvQR(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              styles={{ opacity: item.shareJsonDate ? 0.5 : 1.0 }}
              onPress={() => handleShareSessionJson(item.key)}
            />
            <ResultsButton
              label="CSV"
              faIcon="share"
              styles={{ opacity: item.shareCsvDate ? 0.5 : 1.0 }}
              onPress={() => handleShareSessionCsv(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
