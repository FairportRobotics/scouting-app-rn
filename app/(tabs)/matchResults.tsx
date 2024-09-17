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
import postMatchSession from "../../helpers/postMatchSession";
import Colors from "@/constants/Colors";
import refreshMatchScoutingKeys from "../../helpers/refreshMatchScoutingKeys";
import {
  getMatchScoutingResults,
  getMatchScoutingSessionForEdit,
  MatchResultModel,
} from "@/data/db";
import Loading from "@/components/Loading";

export default function MatchResultsScreen() {
  // State.
  const [sessions, setSessions] = useState<MatchResultModel[]>([]);
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
    const dbSessions = await getMatchScoutingResults();
    if (!dbSessions) return;
    setSessions(dbSessions);
  };

  const handleUploadAllSessions = async () => {
    sessions.forEach(async (session) => {
      //await postMatchSession(session);
    });
    await refreshMatchScoutingKeys();
  };

  const handleUploadSession = async (sessionKey: string) => {
    const session = sessions.find((item) => item.sessionKey == sessionKey);
    if (session === undefined) return;

    //await postMatchSession(session);
    await refreshMatchScoutingKeys();
  };

  const handleShowSessionJsonQR = (sessionKey: string) => {
    const session = sessions.find((item) => item.sessionKey == sessionKey);
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShareSessionJson = async (sessionKey: string) => {
    const session = sessions.find((item) => item.sessionKey == sessionKey);
    if (session === undefined) return;

    const json = JSON.stringify(session);
    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);
  };

  const handleShowSessionJson = async (sessionKey: string) => {
    const session = await getMatchScoutingSessionForEdit(sessionKey);

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

  if (!sessions) {
    return <Loading />;
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
            titleColor={Colors.placeholder}
            tintColor={Colors.placeholder}
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
        {sessions
          .sort((a, b) => a.matchNumber - b.matchNumber)
          .map((session, index) => (
            <ContainerGroup
              key={index}
              title={`Match ${session.matchNumber}: ${session.alliance} ${session.allianceTeam}: ${session.scoutedTeamNumber} - ${session.scoutedTeamNickname}`}
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
                  active={session.uploadExists}
                  showUploadExists={session.uploadExists}
                  onPress={() => handleUploadSession(session.sessionKey)}
                />
                <ResultsButton
                  label="JSON"
                  faIcon="qr"
                  onPress={() => handleShowSessionJsonQR(session.sessionKey)}
                />
                <ResultsButton
                  label="JSON"
                  faIcon="share"
                  onPress={() => handleShareSessionJson(session.sessionKey)}
                />
                <ResultsButton
                  label="Data"
                  faIcon="json"
                  onPress={() => handleShowSessionJson(session.sessionKey)}
                />
              </View>
            </ContainerGroup>
          ))}
      </ScrollView>
    </View>
  );
}
