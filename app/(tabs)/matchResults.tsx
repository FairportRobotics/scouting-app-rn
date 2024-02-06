import { RefreshControl, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Match, MatchScoutingSession, Team } from "@/constants/Types";
import ContainerGroup from "@/app/components/ContainerGroup";
import ResultsButton from "@/app/components/ResultsButton";
import * as Database from "@/app/helpers/database";

export type MatchResultModel = {
  sessionKey: string;
  matchNumber: number;
  alliance: string;
  allianceTeam: number;
  scheduledTeamNumber: string;
  scheduledTeamNickname: string;
  scoutedTeamNumber: string;
  scoutedTeamNickname: string;
};

export default function MatchResultsScreen() {
  const router = useRouter();

  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [reportModels, setReportModels] = useState<Array<MatchResultModel>>([]);
  const [sessions, setSessions] = useState<Array<MatchScoutingSession>>([]);

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
      // Retrieve from the database.
      const dtoMatches = await Database.getMatches();
      const dtoTeams = await Database.getTeams();
      const dtoSessions = await Database.getMatchScoutingSessions();

      // Create a Matches dictionary for faster lookups.
      let matchesDictionary: Record<string, Match> = {};
      dtoMatches.forEach((match) => {
        matchesDictionary[match.key] = match;
      });

      // Retrieve Teams and produce a Dictionary.
      let teamsDictionary: Record<string, Team> = {};
      dtoTeams.forEach((team) => {
        teamsDictionary[team.key] = team;
      });

      const models = dtoSessions.map((session) => {
        const match = matchesDictionary[session.matchKey];
        const scheduledTeam = teamsDictionary[session.scheduledTeamKey];
        const scoutedTeam = teamsDictionary[session.scoutedTeamKey];

        const model = {
          sessionKey: session.key,
          matchNumber: match.matchNumber,
          alliance: session.alliance,
          allianceTeam: session.allianceTeam,
        } as MatchResultModel;

        if (scheduledTeam !== undefined) {
          model.scheduledTeamNumber = scheduledTeam.teamNumber;
          model.scheduledTeamNickname = scheduledTeam.nickname;
        }

        if (scoutedTeam !== undefined) {
          model.scoutedTeamNumber = scoutedTeam.teamNumber;
          model.scoutedTeamNickname = scoutedTeam.nickname;
        }

        return model;
      });

      setReportModels(models);
      setSessions(dtoSessions);

      setIsRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadAllSessions = () => {
    console.log("Session Upload All");
  };

  const handleShareAllSessionsJson = () => {
    console.log("Session Share JSON for All");
  };

  const handleShareAllSessionsCsv = () => {
    console.log("Session Share CSB for All");
  };

  const handleUploadSession = (sessionKey: string) => {
    console.log(sessionKey, ": Session Upload");
  };

  const handleShowSessionJsonQR = (sessionKey: string) => {
    console.log(sessionKey, ": Session QR JSON");
  };

  const handleShowSessionCsvQR = (sessionKey: string) => {
    console.log(sessionKey, ": Session QR CSV");
  };

  const handleShareSessionJson = (sessionKey: string) => {
    console.log(sessionKey, ": Session Share JSON");
  };

  const handleShareSessionCsv = (sessionKey: string) => {
    console.log(sessionKey, ": Session Share CSV");
  };

  return (
    <View style={{ flex: 1 }}>
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
                onPress={() => handleUploadAllSessions()}
              />
              <ResultsButton
                label="JSON"
                faIcon="share"
                onPress={() => handleShareAllSessionsJson()}
              />
              <ResultsButton
                label="CSV"
                faIcon="share"
                onPress={() => handleShareAllSessionsCsv()}
              />
            </View>
          </View>
        </ContainerGroup>
        {reportModels.map((match, index) => (
          <ContainerGroup
            title={`Match ${match.matchNumber}: ${match.alliance} ${match.allianceTeam}: ${match.scoutedTeamNumber} - ${match.scoutedTeamNickname}`}
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
                label="Upload"
                faIcon="upload"
                onPress={() => handleUploadSession(match.sessionKey)}
              />
              <ResultsButton
                label="JSON"
                faIcon="qr"
                onPress={() => handleShowSessionJsonQR(match.sessionKey)}
              />
              <ResultsButton
                label="CSV"
                faIcon="qr"
                onPress={() => handleShowSessionCsvQR(match.sessionKey)}
              />
              <ResultsButton
                label="JSON"
                faIcon="share"
                onPress={() => handleShareSessionJson(match.sessionKey)}
              />
              <ResultsButton
                label="CSV"
                faIcon="share"
                onPress={() => handleShareSessionCsv(match.sessionKey)}
              />
            </View>
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
