import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { useRouter } from "expo-router";
import getDefaultMatchScoutingSession, {
  MatchScoutingSession,
  MatchModel,
  TeamModel,
} from "@/constants/Types";
import { ContainerGroup, ScoutMatchSelect } from "@/components";
import getMatchSelectModels from "@/helpers/getMatchSelectModels";
import flushAndFillLookups from "@/helpers/flushAndFillLookups";
import refreshMatchScoutingKeys from "@/helpers/refreshMatchScoutingKeys";
import { useCacheStore } from "@/store/cachesStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import Colors from "@/constants/Colors";

export default function IndexScreen() {
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);

  const cacheStore = useCacheStore();
  const matchStore = useMatchScoutingStore();

  const loadData = async () => {
    const matchModels = getMatchSelectModels(
      cacheStore.event,
      cacheStore.matches,
      cacheStore.teams,
      matchStore.sessionKeys(),
      matchStore.uploadedKeys
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
    matchStore.setCurrentKey(key);

    if (!(key in matchStore.sessions)) {
      // Session does not already exist and must be initialized.
      let newSession = getDefaultMatchScoutingSession() as MatchScoutingSession;
      newSession.key = teamModel.sessionKey;
      newSession.eventKey = matchModel.eventKey;
      newSession.matchKey = matchModel.matchKey;
      newSession.matchNumber = matchModel.matchNumber;
      newSession.alliance = teamModel.alliance;
      newSession.allianceTeam = teamModel.allianceTeam;
      newSession.scheduledTeamKey = teamModel.teamKey;
      newSession.scoutedTeamKey = teamModel.teamKey;

      matchStore.saveSession(newSession);

      // HACK: Set the store with the new lookups.
      useMatchScoutingStore.setState((state) => ({
        ...state,
        sessions: matchStore.sessions,
      }));
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
            title="Refreshing data for the Event, Matches, Teams and loading saved Match and Pit Scouting session keys..."
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {matchModels
          .sort(
            (a: MatchModel, b: MatchModel) =>
              new Date(a.predictedTime).getTime() -
              new Date(b.predictedTime).getTime()
          )
          .map((matchModel, index) => (
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
