import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { useRouter } from "expo-router";
import getDefaultMatchScoutingSession, {
  Event,
  Match,
  Team,
  ItemKey,
  MatchScoutingSession,
  MatchModel,
  TeamModel,
} from "@/constants/Types";
import { ContainerGroup, ScoutMatchSelect } from "@/app/components";
import getMatchSelectModels from "@/app/helpers/getMatchSelectModels";
import flushAndFillLookups from "@/app/helpers/flushAndFillLookups";
import refreshMatchScoutingKeys from "@/app/helpers/refreshMatchScoutingKeys";
import { useCacheStore } from "@/store/cachesStore"; 
import Colors from "@/constants/Colors";
import * as Database from "@/app/helpers/database";

export default function IndexScreen() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);
  const cacheStore = useCacheStore()

  const loadData = async () => {
    try {

      // Retrieve data.
      Promise.all([
        cacheStore.getEvent() as Promise<Event>,
        cacheStore.getMatches() as Promise<Array<Match>>,
        cacheStore.getTeams() as Promise<Array<Team>>,
        Database.getMatchScoutingKeys() as Promise<Array<ItemKey>>,
        Database.getUploadedMatchScoutingKeys() as Promise<Array<ItemKey>>,
      ])
        .then(([event, matches, teams, sessionKeys, uploadedKeys]) => {
          // Build the Match Models.
          const matchModels = getMatchSelectModels(
            event,
            matches,
            teams,
            sessionKeys,
            uploadedKeys
          );

          setMatchModels(matchModels);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await refreshMatchScoutingKeys();
    await flushAndFillLookups()
    loadData();

    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = async (
    matchModel: MatchModel,
    teamModel: TeamModel
  ) => {
    try {
      // Attempt to retrieve existing session.
      let sessionKey = teamModel.sessionKey;
      let session = await Database.getMatchScoutingSession(sessionKey);

      // If the session does not exist, we will initialize it.
      if (session === undefined) {
        session = getDefaultMatchScoutingSession() as MatchScoutingSession;
        session.key = sessionKey;
        session.eventKey = matchModel.eventKey;
        session.matchKey = matchModel.matchKey;
        session.matchNumber = matchModel.matchNumber;
        session.alliance = teamModel.alliance;
        session.allianceTeam = teamModel.allianceTeam;
        session.scheduledTeamKey = teamModel.teamKey;
        session.scoutedTeamKey = teamModel.teamKey;
      }

      // Save to DB.
      await Database.saveMatchScoutingSession(session);
      router.replace(`/(scout-match)/confirm/${sessionKey}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!matchModels || matchModels?.length == 0) {
    return (
      <View
        style={{
          padding: 20,
          width: "100%",
          gap: 20,
          alignContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          contentContainerStyle={{ flexGrow: 1, width: "100%" }}
          refreshControl={
            <RefreshControl
              title="Loading..."
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          <Text style={{ fontSize: 24, width: "100%" }}>No data. Pull to refresh.</Text>
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
        {matchModels.map((matchModel, index) => (
          <ContainerGroup title="" key={index}>
            <ScoutMatchSelect
              matchModel={matchModel}
              onSelect={(matchModel, teamModel) =>
                handleOnSelect(matchModel, teamModel)
              }
            />
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
