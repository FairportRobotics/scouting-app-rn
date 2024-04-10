import { ScrollView, View, Share, RefreshControl, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "@/app/components";
import { ResultsButton, QrCodeModal } from "@/app/components";
import { useCacheStore } from "@/store/cachesStore";
import { usePitScoutingStore } from "@/store/pitScoutingStore";
import postPitScoutingSession from "@/app/helpers/postPitScoutingSession";
import Colors from "@/constants/Colors";

export type ReportRecord = {
  key: string;
  teamNumber: string;
  nickname: string;
  sessionExists: boolean;
  uploadExists: boolean;
};

export default function ScoutPitScreen() {
  const router = useRouter();

  // Stores.
  const cacheStore = useCacheStore();
  const pitStore = usePitScoutingStore();

  // State.
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
    // Build a Model to encapsulate properties from multiple sources so we can
    // more easily display the rows.
    const teamRecords: Array<ReportRecord> = [];

    cacheStore.teams.forEach((team) => {
      let newRecord = {
        key: team.key,
        teamNumber: team.teamNumber,
        nickname: team.nickname,
        sessionExists: team.key in pitStore.sessions,
        uploadExists: team.key in pitStore.uploadedKeys,
      } as ReportRecord;

      teamRecords.push(newRecord);
    });

    // Set State.
    setReportRecords(teamRecords);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePitScoutTeam = (key: string) => {
    router.replace(`/scout-pit/${key}`);
  };

  const handleUploadAllSessions = async () => {
    Object.values(pitStore.sessions).forEach(async (session) => {
      await postPitScoutingSession(session);
    });
  };

  const handleUploadSession = async (key: string) => {
    const session = pitStore.sessions[key];
    if (session === undefined) return;

    await postPitScoutingSession(session);
  };

  const handleShowSessionJsonQR = async (key: string) => {
    const session = pitStore.sessions[key];
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShareSessionJson = async (key: string) => {
    const session = pitStore.sessions[key];
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

  if (!reportRecords || reportRecords?.length == 0) {
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
              tintColor={Colors.primary}
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
          tintColor={Colors.primary}
        />
      }
    >
      <ContainerGroup title="All Scouting Sessions">
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
              active={!item.sessionExists && !item.uploadExists}
              disabled={!item.sessionExists && item.uploadExists}
              onPress={() => handlePitScoutTeam(item.key)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              active={item.sessionExists && !item.uploadExists}
              disabled={!item.sessionExists}
              showUploadExists={item.uploadExists}
              onPress={() => handleUploadSession(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              active={item.sessionExists}
              disabled={!item.sessionExists}
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              active={item.sessionExists}
              disabled={!item.sessionExists}
              onPress={() => handleShareSessionJson(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}
