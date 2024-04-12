import {
  RefreshControl,
  View,
  ScrollView,
  Share,
  Text,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import {
  ContainerGroup,
  ResultsButton,
  QrCodeModal,
  JsonModal,
} from "@/components";
import { useCacheStore } from "@/store/cachesStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import postMatchSession from "../../helpers/postMatchSession";
import Colors from "@/constants/Colors";
import refreshMatchScoutingKeys from "../../helpers/refreshMatchScoutingKeys";

export type MatchResultModel = {
  sessionKey: string;
  matchNumber: number;
  alliance: string;
  allianceTeam: number;
  scoutedTeamNumber: string;
  scoutedTeamNickname: string;
  uploadExists: boolean;
};

export default function MatchResultsScreen() {
  // Stores.
  const cacheStore = useCacheStore();
  const matchStore = useMatchScoutingStore();

  // State.
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const [showJson, setShowJson] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await refreshMatchScoutingKeys();
  };

  const getTeamDetails = (teamKey: string) => {
    const team = cacheStore.teams.find((team) => team.key === teamKey);
    if (team === undefined) {
      return `(Team not found with key ${teamKey})`;
    } else {
      return `${team.teamNumber} - ${team.nickname}`;
    }
  };

  const uploadExists = (teamKey: string) => {
    return (
      matchStore.uploadedKeys.find(
        (uploadedKey) => uploadedKey.key === teamKey
      ) !== undefined
    );
  };

  const handleUploadAllSessions = async () => {
    Object.values(matchStore.sessions).forEach(async (session) => {
      await postMatchSession(session);
    });
    await refreshMatchScoutingKeys();
  };

  const handleUploadSession = async (sessionKey: string) => {
    const session = matchStore.sessions[sessionKey];
    if (session === undefined) return;

    await postMatchSession(session);
    await refreshMatchScoutingKeys();
  };

  const handleShowSessionJsonQR = (sessionKey: string) => {
    const session = matchStore.sessions[sessionKey];
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShareSessionJson = async (sessionKey: string) => {
    const session = matchStore.sessions[sessionKey];
    if (session === undefined) return;

    const json = JSON.stringify(session);
    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);
  };

  const handleShowSessionJson = (sessionKey: string) => {
    const session = matchStore.sessions[sessionKey];
    if (session === undefined) return;

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

  if (isRefreshing) {
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
        <Text style={{ fontSize: 24 }}>Refreshing...</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (Object.keys(matchStore.sessions).length == 0) {
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
    <View style={{ flex: 1, padding: 10 }}>
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
        <ContainerGroup title="All Match Scouting Sessions">
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
        {Object.values(matchStore.sessions)
          .filter((session) => session.eventKey == cacheStore.event.key)
          .sort((a, b) => a.matchNumber - b.matchNumber)
          .map((session, index) => (
            <ContainerGroup
              key={index}
              title={`Match ${session.matchNumber}: ${session.alliance} ${
                session.allianceTeam
              }: ${getTeamDetails(session.scoutedTeamKey)}`}
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
                  active={!uploadExists(session.key)}
                  showUploadExists={uploadExists(session.key)}
                  onPress={() => handleUploadSession(session.key)}
                />
                <ResultsButton
                  label="JSON"
                  faIcon="qr"
                  onPress={() => handleShowSessionJsonQR(session.key)}
                />
                <ResultsButton
                  label="JSON"
                  faIcon="share"
                  onPress={() => handleShareSessionJson(session.key)}
                />
                <ResultsButton
                  label="Data"
                  faIcon="json"
                  onPress={() => handleShowSessionJson(session.key)}
                />
              </View>
            </ContainerGroup>
          ))}
      </ScrollView>
    </View>
  );
}
