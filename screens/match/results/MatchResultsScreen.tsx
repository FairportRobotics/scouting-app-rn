import { Text, RefreshControl, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Match, Team, MatchScoutingSession } from "@/helpers/types";
import * as Database from "@/helpers/database";
import ContainerGroup from "@/components/ContainerGroup";
import ScoutTeam from "@/screens/pit/scouting/ScoutTeam";

export type MatchResultModel = {
  sessionKey: string;
  matchNumber: number;
  alliance: string;
  allianceTeam: number;
  teamNumber: string;
  teamNickname: string;
};

export default function MatchResultsScreen() {
  const eventKey = "2023nyrr";
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Array<MatchResultModel>>([]);
  const [matchesLookup, setMatchesLookup] = useState<Record<string, Match>>({});
  const [teamsLookup, setTeamsLookup] = useState<Record<string, Team>>({});

  const loadData = async () => {
    // Retrieve Matches and produce a Dictionary.
    let matchesDictionary: Record<string, Match> = {};
    const matches = await Database.getMatchesForEvent(eventKey);
    matches.forEach((match) => {
      matchesDictionary[match.key] = match;
    });
    setMatchesLookup(matchesDictionary);

    // Retrieve Teams and produce a Dictionary.
    let teamsDictionary: Record<string, Team> = {};
    const teams = await Database.getTeamsForEvent(eventKey);
    teams.forEach((team) => {
      teamsDictionary[team.key] = team;
    });
    setTeamsLookup(teamsDictionary);

    // Retrieve sessions and convert to the model.
    const dtoSessions = await Database.getMatchScoutingSessions();

    const models = dtoSessions.map((session) => {
      const match = matchesDictionary[session.matchKey];
      const scheduledTeam = teamsLookup[session.scheduledTeamKey];
      const scoutedTeam = teamsLookup[session.scoutedTeamKey];

      const model = {
        sessionKey: session.key,
        matchNumber: match.matchNumber,
        alliance: session.alliance,
        allianceTeam: session.allianceTeam,
        teamNumber:
          scheduledTeam !== undefined
            ? scoutedTeam.teamNumber
            : session.scheduledTeamKey,
        teamNickname:
          scheduledTeam !== undefined
            ? scoutedTeam.nickname
            : session.scheduledTeamKey,
      } as MatchResultModel;

      return model;
    });

    setSessions(models);

    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <FlatList
      data={sessions}
      renderItem={(session) => (
        <ContainerGroup title="" key={session.item.sessionKey}>
          <Text>
            Match {session.item.matchNumber}: {session.item.alliance}{" "}
            {session.item.allianceTeam}
          </Text>
          <Text>
            {session.item.teamNumber} - {session.item.teamNickname}
          </Text>
        </ContainerGroup>
      )}
      keyExtractor={(session) => session.sessionKey}
      refreshControl={
        <RefreshControl refreshing={isRefeshing} onRefresh={loadData} />
      }
    />
  );
}