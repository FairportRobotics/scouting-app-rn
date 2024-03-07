import { RefreshControl, View, ScrollView, Share, Text } from "react-native";
import { useEffect, useState } from "react";
import { Match, Team, MatchScoutingSession, ItemKey } from "@/constants/Types";
import { ContainerGroup, ResultsButton, QrCodeModal } from "@/app/components";
import * as Database from "@/app/helpers/database";
import postMatchSession from "../helpers/postMatchSession";

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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [reportModels, setReportModels] = useState<Array<MatchResultModel>>([]);
  const [sessions, setSessions] = useState<Array<MatchScoutingSession>>([]);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeText, setQrCodeText] = useState<string>("");

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      try {
        // Retrieve data.
        Promise.all([
          // Retrieve from the database.
          Database.getMatches() as Promise<Array<Match>>,
          Database.getTeams() as Promise<Array<Team>>,
          Database.getMatchScoutingSessions() as Promise<
            Array<MatchScoutingSession>
          >,
          Database.getUploadedMatchScoutingKeys() as Promise<Array<ItemKey>>,
        ])
          .then(([dtoMatches, dtoTeams, dtoSessions, uploadedKeys]) => {
            buildModels(dtoMatches, dtoTeams, dtoSessions, uploadedKeys);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const buildModels = (
    matches: Array<Match>,
    teams: Array<Team>,
    sessions: Array<MatchScoutingSession>,
    uploadedKeys: Array<ItemKey>
  ) => {
    // Create Matches dictionary.
    let matchesDictionary: Record<string, Match> = {};
    matches.forEach((match) => {
      matchesDictionary[match.key] = match;
    });

    // Create Teams dictionary.
    let teamsDictionary: Record<string, Team> = {};
    teams.forEach((team) => {
      teamsDictionary[team.key] = team;
    });

    // Build the array of MatchResultModel.
    let models: Array<MatchResultModel> = [];
    sessions.map((session) => {
      try {
        // Retrieve the needed objects from the dictionaries.
        const match = matchesDictionary[session.matchKey];
        const scoutedTeam = teamsDictionary[session.scoutedTeamKey];

        // Initialize the model.
        const model = {
          sessionKey: session.key,
          matchNumber: match.matchNumber,
          alliance: session.alliance,
          allianceTeam: session.allianceTeam,
        } as MatchResultModel;

        // Assign the scouted team.
        if (scoutedTeam !== undefined) {
          model.scoutedTeamNumber = scoutedTeam.teamNumber;
          model.scoutedTeamNickname = scoutedTeam.nickname;
        }

        // Determine if the upload exists.
        model.uploadExists =
          uploadedKeys.find((item) => session.key === item.key) === undefined
            ? false
            : true;

        models.push(model);
      } catch (error) {
        console.error(error);
      }
    });

    setReportModels(models);
    setSessions(sessions);

    setIsRefreshing(false);
  };

  const handleUploadAllSessions = async () => {
    sessions.forEach(async (session) => {
      await postMatchSession(session);
    });
  };

  const handleUploadSession = async (sessionKey: string) => {
    const session = sessions.find((session) => session.key === sessionKey);
    if (session === undefined) return;
    await postMatchSession(session);
  };

  const handleShowSessionJsonQR = async (sessionKey: string) => {
    const session = sessions.find((session) => session.key == sessionKey);
    if (session === undefined) return;

    const json = JSON.stringify(session);
    setQrCodeText(json);
    setShowQrCode(true);
  };

  const handleShareSessionJson = async (sessionKey: string) => {
    const session = sessions.find((session) => session.key == sessionKey);
    if (session === undefined) return;
    const json = JSON.stringify(session);
    const shareOptions = {
      message: json,
      type: "application/json",
    };

    await Share.share(shareOptions);
  };

  if (showQrCode) {
    return (
      <QrCodeModal
        value={qrCodeText}
        onPressClose={() => setShowQrCode(false)}
      />
    );
  }

  if (sessions?.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          gap: 20,
          alignContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={{ fontSize: 24 }}>
            Pull to refresh and load Match results
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <ContainerGroup title="All Matches">
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
        {reportModels.map((match, index) => (
          <ContainerGroup
            key={index}
            title={`Match ${match.matchNumber}: ${match.alliance} ${match.allianceTeam}: ${match.scoutedTeamNumber} - ${match.scoutedTeamNickname}`}
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
                active={!match.uploadExists}
                showUploadExists={match.uploadExists}
                onPress={() => handleUploadSession(match.sessionKey)}
              />
              <ResultsButton
                label="JSON"
                faIcon="qr"
                onPress={() => handleShowSessionJsonQR(match.sessionKey)}
              />
              <ResultsButton
                label="JSON"
                faIcon="share"
                onPress={() => handleShareSessionJson(match.sessionKey)}
              />
            </View>
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
