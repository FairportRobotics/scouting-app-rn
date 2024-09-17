import { ScrollView, View, Share, RefreshControl, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "@/components";
import { ResultsButton, QrCodeModal, JsonModal } from "@/components";
import postPitScoutingSession from "@/helpers/postPitScoutingSession";
import Colors from "@/constants/Colors";
import {
  getPitScoutingResults,
  getPitScoutingSessionForEdit,
  initPitScoutingSession,
  TeamPitSelectModel,
} from "@/data/db";
import { PitScoutingSession } from "@/data/schema";

export default function ScoutPitScreen() {
  const router = useRouter();

  // State.
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessions, setSessions] = useState<Array<TeamPitSelectModel>>([]);

  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const [showJson, setShowJson] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");

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
    const dbSessions = await getPitScoutingResults();

    if (!dbSessions) return;

    setSessions(dbSessions);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePitScoutTeam = async (teamKey: string) => {
    await initPitScoutingSession(teamKey);
    router.replace(`/scout-pit/${teamKey}`);
  };

  const handleUploadAllSessions = async () => {
    sessions.forEach(async (session) => {
      const dbSession = await getPitScoutingSessionForEdit(session.teamKey);
      if (!dbSession) return;
      await postPitScoutingSession(dbSession);
    });
  };

  const handleUploadPendingSessions = async () => {
    sessions
      .filter((item) => item.uploaded == false)
      .forEach(async (session) => {
        const dbSession = await getPitScoutingSessionForEdit(session.teamKey);
        if (!dbSession) return;
        await postPitScoutingSession(dbSession);
      });
  };

  const handleUploadSession = async (teamKey: string) => {
    const session = sessions.find((item) => item.teamKey == teamKey);
    if (!session) return;
    //await postPitScoutingSession(session);
  };

  const handleShowSessionJsonQR = async (teamKey: string) => {
    const session = sessions.find((item) => item.teamKey == teamKey);
    if (!session) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShareSessionJson = async (teamKey: string) => {
    const session = sessions.find((item) => item.teamKey == teamKey);
    if (!session) return;

    const json = JSON.stringify(session);

    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);

    loadData();
  };

  const handleShowSessionJson = (teamKey: string) => {
    const session = sessions.find((item) => item.teamKey == teamKey);
    if (!session) return;

    const json = JSON.stringify(session);
    setJsonText(json);
    setShowJson(true);
  };

  if (showQrCode) {
    return (
      <QrCodeModal
        value={qrCodeText}
        onPressClose={() => setShowQrCode(false)}
      />
    );
  }

  if (showJson) {
    return (
      <JsonModal value={jsonText} onPressClose={() => setShowJson(false)} />
    );
  }

  if (!sessions || sessions?.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          gap: 20,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              title="Loading..."
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              titleColor={Colors.placeholder}
              tintColor={Colors.placeholder}
            />
          }
        >
          <Text style={{ fontSize: 24 }}>No data. Pull to refresh.</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ padding: 10 }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          title="Loading..."
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          titleColor={Colors.placeholder}
          tintColor={Colors.placeholder}
        />
      }
    >
      <ContainerGroup title="Pit Scouting Sessions">
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
            label="Upload All"
            faIcon="upload"
            active={true}
            showUploadExists={false}
            onPress={() => handleUploadAllSessions()}
          />
          <ResultsButton
            label="Upload Pending"
            faIcon="upload"
            active={true}
            showUploadExists={false}
            onPress={() => handleUploadPendingSessions()}
          />
        </View>
      </ContainerGroup>
      {sessions.map((item, index) => (
        <ContainerGroup
          title={`${item.teamNumber} - ${item.nickname}`}
          key={index}
        >
          <Text style={{ marginTop: -10 }}>{item.schoolName}</Text>
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
              active={!item.scouted && !item.uploaded}
              disabled={!item.scouted && item.uploaded}
              onPress={() => handlePitScoutTeam(item.teamKey)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              active={item.scouted && !item.uploaded}
              disabled={!item.scouted}
              showUploadExists={item.uploaded}
              onPress={() => handleUploadSession(item.teamKey)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              active={item.scouted}
              disabled={!item.scouted}
              onPress={() => handleShowSessionJsonQR(item.teamKey)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              active={item.scouted}
              disabled={!item.scouted}
              onPress={() => handleShareSessionJson(item.teamKey)}
            />
            <ResultsButton
              label="Data"
              faIcon="json"
              active={item.scouted}
              disabled={!item.scouted}
              onPress={() => handleShowSessionJson(item.teamKey)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}
