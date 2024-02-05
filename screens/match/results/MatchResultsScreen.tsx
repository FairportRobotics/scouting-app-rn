import {
  Text,
  RefreshControl,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { Match, MatchScoutingSession, Team } from "@/helpers/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQrcode,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import ContainerGroup from "@/components/ContainerGroup";
import themes from "@/themes/themes";
import * as Database from "@/helpers/database";

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
      console.log("MatchResultsScreen loadData error:", error);
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

  const handleEditSession = (sessionKey: string) => {
    console.log("Session Edit", sessionKey);
  };

  const handleUploadSession = (sessionKey: string) => {
    console.log("Session Upload", sessionKey);
  };

  const handleShowSessionJsonQR = (sessionKey: string) => {
    console.log("Session JSON QQ Code", sessionKey);
  };

  const handleShowSessionCsvQR = (sessionKey: string) => {
    console.log("Session CSV QQ Code", sessionKey);
  };

  const handleShareSessionJson = (sessionKey: string) => {
    console.log("Session JSON Share", sessionKey);
  };

  const handleShareSessionCsv = (sessionKey: string) => {
    console.log("Session CSV Share", sessionKey);
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
              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleUploadAllSessions()}
              >
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShareAllSessionsJson()}
              >
                <FontAwesomeIcon
                  icon={faShareFromSquare}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>JSON</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShareAllSessionsCsv()}
              >
                <FontAwesomeIcon
                  icon={faShareFromSquare}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>CSV</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleEditSession(match.sessionKey)}
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleUploadSession(match.sessionKey)}
              >
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShowSessionJsonQR(match.sessionKey)}
              >
                <FontAwesomeIcon
                  icon={faQrcode}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>JSON</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShowSessionCsvQR(match.sessionKey)}
              >
                <FontAwesomeIcon
                  icon={faQrcode}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>CSV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShareSessionJson(match.sessionKey)}
              >
                <FontAwesomeIcon
                  icon={faShareFromSquare}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>JSON</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themes.baseButton,
                  { flex: 1, flexDirection: "row", gap: 10 },
                ]}
                onPress={() => handleShareSessionCsv(match.sessionKey)}
              >
                <FontAwesomeIcon
                  icon={faShareFromSquare}
                  size={32}
                  style={{ color: "white" }}
                />
                <Text style={{ color: "white" }}>CSV</Text>
              </TouchableOpacity>
            </View>
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
