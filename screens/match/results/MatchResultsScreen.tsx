import { Text, RefreshControl, FlatList, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Match, Team } from "@/helpers/types";
import * as Database from "@/helpers/database";
import ContainerGroup from "@/components/ContainerGroup";

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

      setIsRefreshing(false);
    } catch (error) {
      console.log("MatchResultsScreen loadData error:", error);
    }
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
            <Text>[Upload]</Text>
            <Text>[Share JSON]</Text>
            <Text>[Share CSV]</Text>
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
              }}
            >
              <Text>[Edit]</Text>
              <Text>[Upload]</Text>
              <Text>[QR JSON]</Text>
              <Text>[QR CSV]</Text>
              <Text>[Share JSON]</Text>
              <Text>[Share CSV]</Text>
            </View>
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}
