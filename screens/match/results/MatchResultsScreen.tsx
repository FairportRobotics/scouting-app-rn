import { Text, View, ScrollView, RefreshControl, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { MatchScoutingSession } from "@/helpers/types";
import * as Database from "@/helpers/database";

export default function MatchResultsScreen() {
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Array<MatchScoutingSession>>([]);

  const onRefresh = () => {
    const loadData = async () => {
      const dtoSessions = await Database.getMatchScoutingSessions();
      setSessions(dtoSessions);
      setIsRefreshing(false);
    };
    loadData();
  };

  useEffect(() => {
    const loadData = async () => {
      const dtoSessions = await Database.getMatchScoutingSessions();
      setSessions(dtoSessions);
    };
    loadData();
  }, []);

  return (
    <FlatList
      data={sessions}
      renderItem={(session) => (
        <View key={session.item.key}>
          <Text>
            {session.item.eventKey} - {session.item.matchKey} -{" "}
            {session.item.alliance} - {session.item.allianceTeam}
          </Text>
          <Text>
            {session.item.scheduledTeamKey} - {session.item.scoutedTeamKey}
          </Text>
        </View>
      )}
      keyExtractor={(session) => session.key}
      refreshControl={
        <RefreshControl
          refreshing={isRefeshing}
          onRefresh={onRefresh}
          colors={["plum", "red"]}
        />
      }
    />
  );
}
