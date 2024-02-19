import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
import { useRouter } from "expo-router";
import getDefaultMatchScoutingSession, {
  Event,
  Match,
  Team,
  ItemKey,
  MatchScoutingSession,
  MatchModel,
  TeamModel,
  TeamMember,
  MatchAssignment,
} from "@/constants/Types";
import { ContainerGroup, ScoutMatchSelect } from "@/app/components";
import * as Database from "@/app/helpers/database";
import getMatchSelectModels from "@/app/helpers/getMatchSelectModels";

export default function IndexScreen() {
  const router = useRouter();
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);

  const loadData = async () => {
    try {
      // Retrieve data.
      Promise.all([
        Database.getEvent() as Promise<Event>,
        Database.getMatches() as Promise<Array<Match>>,
        Database.getTeams() as Promise<Array<Team>>,
        Database.getMatchScoutingKeys() as Promise<Array<ItemKey>>,
        Database.getUploadedMatchScoutingKeys() as Promise<Array<ItemKey>>,
        Database.getAllTeamMembers() as Promise<Array<TeamMember>>,
        Database.getMatchAssignments() as Promise<Array<MatchAssignment>>,
      ])
        .then(
          ([
            dtoEvent,
            dtoMatches,
            dtoTeams,
            sessionKeys,
            uploadedKeys,
            dtoTeamMembers,
            dtoAssignments,
          ]) => {
            // Build the Match Models.
            const matchModels = getMatchSelectModels(
              dtoEvent,
              dtoMatches,
              dtoTeams,
              sessionKeys,
              uploadedKeys,
              dtoTeamMembers,
              dtoAssignments
            );

            setMatchModels(matchModels);
          }
        )
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log("Something went horribly wrong.");
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
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

      console.log(sessionKey);

      // Save to DB.
      await Database.saveMatchScoutingSession(session);
      router.replace(`/(scout-match)/confirm/${sessionKey}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefeshing} onRefresh={onRefresh} />
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
