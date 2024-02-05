import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import ActionButton from "../components/ActionButton";
import * as Database from "@/app/helpers/database";

export type PitResultModel = {
  key: string;
  number: string;
  nickname: string;
  wasScouted: boolean;
  wasUploaded: boolean;
  qrJson: boolean;
  qrCsv: boolean;
  shareJson: boolean;
  shareCsv: boolean;
  matches: Set<number>;
};

function ScoutPitScreen() {
  const router = useRouter();
  const [reportModels, setEventTeams] = useState<Array<PitResultModel>>([]);
  const [isRefeshing, setIsRefreshing] = useState<boolean>(true);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  const loadData = async () => {
    try {
      // Load data from database.
      const dtoMatches = await Database.getMatches();
      const dtoTeams = await Database.getTeams();
      const dtoSessions = await Database.getPitScoutingSessions();

      // Validate.
      if (dtoMatches === undefined) return;
      if (dtoTeams === undefined) return;

      // Create the dictionary of Teams.
      let teamMatchesDictionary: Record<string, Set<number>> = {};
      dtoTeams.forEach((team) => {
        teamMatchesDictionary[team.key] = new Set();
      });

      // Create the dictionary of Teams.
      let sessionsDictionary: Record<string, boolean> = {};
      dtoSessions.forEach((session) => {
        sessionsDictionary[session.key] = true;
      });

      // Enumerate over the Matches and add the Match Number to the Set
      // associated with each Team.
      dtoMatches.forEach((match) => {
        try {
          teamMatchesDictionary[match.blue1TeamKey].add(match.matchNumber);
        } catch (error) {
          console.error("ScoutPitScreen match.blue1TeamKey:", error);
        }
        teamMatchesDictionary[match.blue2TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.blue3TeamKey].add(match.matchNumber);

        teamMatchesDictionary[match.red1TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.red2TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.red3TeamKey].add(match.matchNumber);
      });

      // Build the PitResultModel models.
      let models = dtoTeams.map((team) => {
        return {
          key: team.key,
          number: team.teamNumber,
          nickname: team.nickname,
          matches: teamMatchesDictionary[team.key],
        } as PitResultModel;
      });

      // Sort.
      models.sort((a, b) => (a.number > b.number ? 1 : 0));

      // Set State.
      setEventTeams(models);
    } catch (error) {
      console.error(error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadAllPitResults = () => {
    console.log("ScoutPitScreen handleUploadAllPitResults...");
  };

  const handleShareAllPitResultsJson = () => {
    console.log("ScoutPitScreen handleShareAllPitResultsJson...");
  };

  const handleShareAllPitResultsCsv = () => {
    console.log("ScoutPitScreen handleShareAllPitResultsCsv...");
  };

  const handleEditSession = (key: string) => {
    console.log(key, ": Session Edit");
    router.replace(`/scout-pit/${key}`);
    //router.push(`/scout-match/confirm/${key}`);
  };

  const handleUploadSession = (key: string) => {
    console.log(key, ": Session Upload");
  };

  const handleShowSessionJsonQR = (key: string) => {
    console.log(key, ": Session QR JSON");
  };

  const handleShowSessionCsvQR = (key: string) => {
    console.log(key, ": Session QR CSV");
  };

  const handleShareSessionJson = (key: string) => {
    console.log(key, ": Session Share JSON");
  };

  const handleShareSessionCsv = (key: string) => {
    console.log(key, ": Session Share CSV");
  };

  if (isRefeshing) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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
            <ActionButton
              label="Upload"
              faIcon="upload"
              onPress={() => handleUploadAllPitResults()}
            />
            <ActionButton
              label="JSON"
              faIcon="share"
              onPress={() => handleShareAllPitResultsJson()}
            />
            <ActionButton
              label="CSV"
              faIcon="share"
              onPress={() => handleShareAllPitResultsCsv()}
            />
          </View>
        </View>
      </ContainerGroup>
      {reportModels.map((item, index) => (
        <ContainerGroup title={`${item.number} - ${item.nickname}`} key={index}>
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <ActionButton
              label="Scout"
              faIcon="edit"
              onPress={() => handleEditSession(item.key)}
            />
            <ActionButton
              label="Upload"
              faIcon="upload"
              onPress={() => handleUploadSession(item.key)}
            />
            <ActionButton
              label="JSON"
              faIcon="qr"
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ActionButton
              label="CSV"
              faIcon="qr"
              onPress={() => handleShowSessionCsvQR(item.key)}
            />
            <ActionButton
              label="JSON"
              faIcon="share"
              onPress={() => handleShareSessionJson(item.key)}
            />
            <ActionButton
              label="CSV"
              faIcon="share"
              onPress={() => handleShareSessionCsv(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
