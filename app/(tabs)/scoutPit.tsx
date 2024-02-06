import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ContainerGroup } from "../components";
import ResultsButton from "../components/ResultsButton";
import * as Database from "@/app/helpers/database";
import { PitScoutingSessionAction, Match } from "@/constants/Types";

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
  const [actions, setActions] = useState<
    Record<string, PitScoutingSessionAction>
  >({});
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
      const dtoActions = await Database.getPitScoutingSessionActions();

      // Validate.
      if (dtoMatches === undefined) return;
      if (dtoActions === undefined) return;

      let models = dtoActions.map((action) => {
        return {
          key: action.key,
          number: action.teamNumber,
          nickname: action.nickname,
          wasScouted: action.wasScouted,
          wasUploaded: action.uploadedDate ? true : false,
          qrJson: action.qrJsonDate ? true : false,
          qrCsv: action.qrCsvDate ? true : false,
          shareJson: action.shareJsonDate ? true : false,
          shareCsv: action.shareCsvDate ? true : false,
          matches: new Set<number>(),
        } as PitResultModel;
      });

      // Create a dictionary where the key is the Team key and the value is
      // a set of all the Match Numbers scheduled for that Team.
      const dictionary: Record<string, Set<Number>> = {};
      dtoMatches.forEach((match) => {
        let teamKey: string = "";

        teamKey = match.blue1TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);

        teamKey = match.blue2TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);

        teamKey = match.blue3TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);

        teamKey = match.red1TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);

        teamKey = match.red2TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);

        teamKey = match.red3TeamKey;
        if (!dictionary[teamKey]) {
          dictionary[teamKey] = new Set<number>();
        }
        dictionary[teamKey].add(match.matchNumber);
      });

      console.log("loadData dictionary:", dictionary);
      // Resulting dictionary where keys are populated from team keys and values are Sets of match numbers
      //console.log("loadData models:", JSON.stringify(models, null, 2));
      //

      // // Create the dictionary of Teams.
      // let teamMatchesDictionary: Record<string, Set<number>> = {};
      // dtoTeams.forEach((team) => {
      //   teamMatchesDictionary[team.key] = new Set();
      // });

      // // Create a dictionary of Sessions.
      // let sessionsDictionary: Record<string, PitScoutingSession> = {};
      // dtoSessions.forEach((session) => {
      //   sessionsDictionary[session.key] = session;
      // });

      // // Create a dictionary of Actions.
      // let actionsDictionary: Record<string, PitScoutingSessionAction> = {};
      // dtoActions.forEach((action) => {
      //   actionsDictionary[action.key] = action;
      // });

      // // Enumerate over the Matches and add the Match Number to the Set
      // // associated with each Team.
      // dtoMatches.forEach((match) => {
      //   try {
      //     teamMatchesDictionary[match.blue1TeamKey].add(match.matchNumber);
      //   } catch {}

      //   try {
      //     teamMatchesDictionary[match.blue2TeamKey].add(match.matchNumber);
      //   } catch {}

      //   try {
      //     teamMatchesDictionary[match.blue3TeamKey].add(match.matchNumber);
      //   } catch {}

      //   try {
      //     teamMatchesDictionary[match.red1TeamKey].add(match.matchNumber);
      //   } catch {}

      //   try {
      //     teamMatchesDictionary[match.red2TeamKey].add(match.matchNumber);
      //   } catch {}

      //   try {
      //     teamMatchesDictionary[match.red3TeamKey].add(match.matchNumber);
      //   } catch {}
      // });

      // // Build the PitResultModel models.
      // let models = dtoTeams.map((team) => {
      //   return {
      //     key: team.key,
      //     number: team.teamNumber,
      //     nickname: team.nickname,
      //     matches: teamMatchesDictionary[team.key],

      //     wasScouted: sessionsDictionary?.teamKey ? true : false,
      //     wasUploaded: actionsDictionary?.teamKey?.uploadedDate ? true : false,
      //     qrJson: actionsDictionary?.teamKey?.qrJsonDate ? true : false,
      //     qrCsv: actionsDictionary?.teamKey?.qrCsvDate ? true : false,
      //     shareJson: actionsDictionary?.teamKey?.shareJsonDate ? true : false,
      //     shareCsv: actionsDictionary?.teamKey?.shareCsvDate ? true : false,
      //   } as PitResultModel;
      // });

      // // Sort.
      // models.sort((a, b) => (a.number > b.number ? 1 : 0));

      // // Set State.
      // setEventTeams(models);
      // setActions(actionsDictionary);
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
  };

  const handleUploadSession = (key: string) => {
    console.log("handleUploadSession:", key);

    // Retrieve the session from State, update the Date and Save.
    let actionSession = actions[key];
    if (actionSession === undefined) {
      actionSession = {
        key: key,
        uploadedDate: null,
        qrJsonDate: null,
        qrCsvDate: null,
        shareJsonDate: null,
        shareCsvDate: null,
      } as PitScoutingSessionAction;
    }
    console.log("handleUploadSession:", actionSession);
    actionSession.uploadedDate = new Date();
    console.log("handleUploadSession:", actionSession);
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
            <ResultsButton
              label="Upload"
              faIcon="upload"
              onPress={() => handleUploadAllPitResults()}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              onPress={() => handleShareAllPitResultsJson()}
            />
            <ResultsButton
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
            <ResultsButton
              label="Scout"
              faIcon="edit"
              styles={{ opacity: item.wasScouted ? 0.5 : 1.0 }}
              onPress={() => handleEditSession(item.key)}
            />
            <ResultsButton
              label="Upload"
              faIcon="upload"
              styles={{ opacity: item.wasUploaded ? 0.5 : 1.0 }}
              onPress={() => handleUploadSession(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="qr"
              styles={{ opacity: item.qrJson ? 0.5 : 1.0 }}
              onPress={() => handleShowSessionJsonQR(item.key)}
            />
            <ResultsButton
              label="CSV"
              faIcon="qr"
              styles={{ opacity: item.qrCsv ? 0.5 : 1.0 }}
              onPress={() => handleShowSessionCsvQR(item.key)}
            />
            <ResultsButton
              label="JSON"
              faIcon="share"
              styles={{ opacity: item.shareJson ? 0.5 : 1.0 }}
              onPress={() => handleShareSessionJson(item.key)}
            />
            <ResultsButton
              label="CSV"
              faIcon="share"
              styles={{ opacity: item.shareCsv ? 0.5 : 1.0 }}
              onPress={() => handleShareSessionCsv(item.key)}
            />
          </View>
        </ContainerGroup>
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
