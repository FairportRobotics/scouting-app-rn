import { ScrollView, View, Share } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import {
  PitScoutingSessionAction,
  Match,
  PitScoutingSession,
} from "@/constants/Types";
import { ResultsButton, QrCodeModal } from "@/app/components";
import * as Database from "@/app/helpers/database";
import axios from "axios";

function ScoutPitScreen() {
  const router = useRouter();

  const [matches, setMatches] = useState<Array<Match>>([]);
  const [actions, setActions] = useState<Array<PitScoutingSessionAction>>([]);
  const [sessions, setSessions] = useState<Array<PitScoutingSession>>([]);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const onRefresh = () => {
    loadData();
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

      const dtoSessions = await Database.getPitScoutingSessions();
      if (dtoSessions !== undefined) {
        setSessions(dtoSessions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadAllPitResults = () => {};

  const handleShareAllPitResultsJson = async () => {
    const sessions = await Database.getPitScoutingSessions();
    if (sessions === undefined) return;
    const json = JSON.stringify(sessions);

    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);

    loadData();
  };

  const handleShareAllPitResultsCsv = () => {};

  const handlePitScoutTeam = (key: string) => {
    router.replace(`/scout-pit/${key}`);
  };

  const handleUploadSession = async (key: string) => {
    await Database.savePitScoutingSessionUploadedDate(key);
    loadData();

    const session = sessions.find((session) => session.key === key);
    if (session === undefined) return;

    const devUri =
      "https://dev-r3-sync.azurewebsites.net/api/v1?code=n5IRNj-ytnYspnd3d5G8w_iBqkq3YM6NxXkVzk9jCj4dAzFue0si_g==";

    const prodUri =
      "https://r3-sync.azurewebsites.net/api/v1?code=xMdUNvQ4L_bfuMJYpScpqWoxFj61g7YMo0e5puskG6E9AzFuVgcpQw==";

    const postData = {
      type: "pit",
      data: JSON.stringify(session),
    };

    axios
      .post(prodUri, postData)
      .then((response) => {
        // Handle success
        console.log("Response:", JSON.stringify(response.data, null, 2));
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
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
    const session = await Database.getPitScoutingSession(key);
    if (session === undefined) return;
    const json = JSON.stringify(session);

    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);

    await Database.savePitScoutingSessionShareJsonDate(key);

    loadData();
  };

  const handleShareSessionCsv = async (key: string) => {
    await Database.savePitScoutingSessionShareCsvDate(key);

    loadData();
  };

  if (showQrCode) {
    return (
      <QrCodeModal
        value={qrCodeText}
        onPressClose={() => setShowQrCode(false)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              onPress={() => handlePitScoutTeam(item.key)}
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
