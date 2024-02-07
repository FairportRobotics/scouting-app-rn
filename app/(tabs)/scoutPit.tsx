import { ScrollView, View, Share, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import { ResultsButton, QrCodeModal } from "@/app/components";
import * as Database from "@/app/helpers/database";
import postPitScoutingSession from "../helpers/postPitScoutingSession";

export type ReportRecord = {
  key: string;
  teamNumber: string;
  nickname: string;
  sessionKey: string | undefined;
  uploadedKey: string | undefined;
};

function ScoutPitScreen() {
  const router = useRouter();

  const [reportRecords, setReportRecords] = useState<Array<ReportRecord>>([]);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
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

      const teamRecords: Array<ReportRecord> = [];
      dtoTeams.forEach((dtoTeam) => {
        let newRecord = {
          key: dtoTeam.key,
          teamNumber: dtoTeam.teamNumber,
          nickname: dtoTeam.nickname,
          sessionKey: dtoSessions.find((session) => session.key === dtoTeam.key)
            ?.key,
          uploadedKey: dtoUploadedTeamKeys.find(
            (uploaded) => uploaded.key === dtoTeam.key
          )?.key,
        } as ReportRecord;

        teamRecords.push(newRecord);
      });

      // Set State.
      setReportRecords(teamRecords);
    } catch (error) {
      console.log(error);
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
    const session = await Database.getPitScoutingSession(key);
    if (session === undefined) return;
    await postPitScoutingSession(session);
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
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
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
      {reportRecords.map((item, index) => (
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
              active={item.sessionKey === undefined}
              disabled={
                item.sessionKey === undefined && item.uploadedKey !== undefined
              }
              onPress={() => handlePitScoutTeam(item.key)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              active={item.uploadedKey === undefined}
              disabled={item.sessionKey === undefined}
              onPress={() => handleUploadSession(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              active={item.sessionKey !== undefined}
              disabled={item.sessionKey === undefined}
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              active={item.sessionKey !== undefined}
              disabled={item.sessionKey === undefined}
              onPress={() => handleShareSessionJson(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
