import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ContainerGroup, ScoutMatchSelect } from "@/components";
import { getMatchScouting, MatchModel } from "@/data/db";
import flushAndFillLookups from "@/helpers/flushAndFillLookups";
import Colors from "@/constants/Colors";

export default function IndexScreen() {
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);

  const loadData = async () => {
    const matchModels = await getMatchScouting();
    setMatchModels(matchModels);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await flushAndFillLookups();
    loadData();

    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = async (sessionKey: string) => {
    router.replace(`/(scout-match)/confirm/${sessionKey}`);
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
            titleColor={Colors.placeholder}
            tintColor={Colors.placeholder}
          />
        }
      >
        {matchModels.map((matchModel, index) => (
          <ContainerGroup title="" key={index}>
            <ScoutMatchSelect
              matchModel={matchModel}
              onSelect={(sessionKey) => console.log("Selected", sessionKey)}
            />
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
