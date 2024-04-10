import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { useRouter } from "expo-router";
import getDefaultMatchScoutingSession, {
  MatchScoutingSession,
  MatchModel,
  TeamModel,
} from "@/constants/Types";
import { ContainerGroup, ScoutMatchSelect } from "@/app/components";
import getMatchSelectModels from "@/app/helpers/getMatchSelectModels";
import flushAndFillLookups from "@/app/helpers/flushAndFillLookups";
import refreshMatchScoutingKeys from "@/app/helpers/refreshMatchScoutingKeys";
import { useCacheStore } from "@/store/cachesStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import Colors from "@/constants/Colors";

export default function IndexScreen() {
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);

  const cacheStore = useCacheStore();
  const store = useMatchScoutingStore();

  const loadData = async () => {
    const matchModels = getMatchSelectModels(
      cacheStore.event,
      cacheStore.matches,
      cacheStore.teams,
      store.sessionKeys(),
      store.uploadedKeys
    );

    setMatchModels(matchModels);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await refreshMatchScoutingKeys();
    await flushAndFillLookups();
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
    // Extract the Session Key and assign to the store.
    const key = teamModel.sessionKey;
    store.currentKey = key;

    if (!(key in store.sessions)) {
      // Session does not already exist and must be initialized.
      store.sessions[key] =
        getDefaultMatchScoutingSession() as MatchScoutingSession;
      store.sessions[key].key = teamModel.sessionKey;
      store.sessions[key].eventKey = matchModel.eventKey;
      store.sessions[key].matchKey = matchModel.matchKey;
      store.sessions[key].matchNumber = matchModel.matchNumber;
      store.sessions[key].alliance = teamModel.alliance;
      store.sessions[key].allianceTeam = teamModel.allianceTeam;
      store.sessions[key].scheduledTeamKey = teamModel.teamKey;
      store.sessions[key].scoutedTeamKey = teamModel.teamKey;
    }

    // Navigate to the Confirmation screen.
    router.replace(`/(scout-match)/confirm/${key}`);
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
          <Text style={{ fontSize: 24, width: "100%" }}>
            No data. Pull to refresh.
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
          <RefreshControl
            title="Refreshing data for the Event, Matches, Teams and loading saved Match and Pit Scouting sessions..."
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
