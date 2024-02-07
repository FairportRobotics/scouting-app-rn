import { ScrollView, View, Share, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import { PitScoutingSession, Team } from "@/constants/Types";
import { ResultsButton, QrCodeModal } from "@/app/components";
import * as Database from "@/app/helpers/database";
import postPitScoutingSession from "../helpers/postPitScoutingSession";
import axios from "axios";

function ScoutPitScreen() {
  const router = useRouter();

  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);
  const [sessions, setSessions] = useState<Array<PitScoutingSession>>([]);
  const [uploadedKeys, setUploadedKeys] = useState<Array<string>>([]);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const onRefresh = () => {
    loadData();
  };

  const loadData = async () => {
    try {
      // Load data from database.
      const dtoTeams = await Database.getTeams();
      const dtoSessions = await Database.getPitScoutingSessions();
      const dtoUploadedTeamKeys = await Database.getPitScoutingSessionKeys();

      // Validate.
      if (dtoTeams === undefined) return;
      if (dtoSessions === undefined) return;
      if (dtoUploadedTeamKeys === undefined) return;

      // Set State.
      setEventTeams(dtoTeams);
      setSessions(dtoSessions);
      setUploadedKeys(uploadedKeys);
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

  const handlePitScoutTeam = (key: string) => {
    router.replace(`/scout-pit/${key}`);
  };

  const handleUploadSession = async (key: string) => {
    const session = sessions.find((session) => session.key === key);
    if (session === undefined) return;
    await postPitScoutingSession(session);

    // const devUri =
    //   "https://dev-r3-sync.azurewebsites.net/api/v1?code=n5IRNj-ytnYspnd3d5G8w_iBqkq3YM6NxXkVzk9jCj4dAzFue0si_g==";

    // const prodUri =
    //   "https://r3-sync.azurewebsites.net/api/v1?code=xMdUNvQ4L_bfuMJYpScpqWoxFj61g7YMo0e5puskG6E9AzFuVgcpQw==";

    // const postData = {
    //   type: "pit",
    //   data: JSON.stringify(session),
    // };

    // console.log("POST URL:", devUri);
    // console.log("postData", postData);

    // axios
    //   .post(devUri, postData)
    //   .then((response) => {
    //     // Handle success
    //     console.log("Response:", JSON.stringify(response.data, null, 2));
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     console.error("Error:", error);
    //   });
  };

  const handleShowSessionJsonQR = async (key: string) => {
    loadData();

    const session = await Database.getPitScoutingSession(key);
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
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

    loadData();
  };

  const sessionExistsLocally = (key: string): boolean => {
    return sessions.find((session) => session.key == key) !== undefined;
  };

  const sessionWasUploaded = (key: string): boolean => {
    return uploadedKeys.find((uploadedKey) => uploadedKey == key) !== undefined;
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
              active={true}
              onPress={() => handleUploadAllPitResults()}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              active={true}
              onPress={() => handleShareAllPitResultsJson()}
            />
          </View>
        </View>
      </ContainerGroup>
      {eventTeams.map((item, index) => (
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
              active={!sessionWasUploaded(item.key)}
              onPress={() => handlePitScoutTeam(item.key)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              active={
                sessionExistsLocally(item.key) && sessionWasUploaded(item.key)
              }
              disabled={!sessionExistsLocally(item.key)}
              onPress={() => handleUploadSession(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              active={sessionExistsLocally(item.key)}
              disabled={!sessionExistsLocally(item.key)}
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              active={sessionExistsLocally(item.key)}
              disabled={!sessionExistsLocally(item.key)}
              onPress={() => handleShareSessionJson(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
