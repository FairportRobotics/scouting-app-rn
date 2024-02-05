import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
import getDefaultMatchScoutingSession, {
  Match,
  MatchScoutingSession,
  Team,
} from "@/helpers/types";
import ROUTES from "@/constants/routes";
import ContainerGroup from "@/components/ContainerGroup";
import ScoutingMatchSelect from "@/components/ScoutingMatchSelect";
import * as Database from "@/helpers/database";

function IndexScreen({ navigation }) {
  const [isRefeshing, setIsRefreshing] = useState<boolean>(false);
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  const loadData = async () => {
    setEventMatches(await Database.getMatches());
    setEventTeams(await Database.getTeams());
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setEventMatches(await Database.getMatches());
      setEventTeams(await Database.getTeams());
    };
    loadData();
  }, []);

  const handleOnSelect = async (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => {
    // Initialize the Match Scouting Session properties.
    const match = eventMatches.find((match: Match) => match.key === matchKey);
    const dtoEvent = await Database.getEvent();

    // Attempt to retrieve existing session.
    let sessionKey = `${dtoEvent.key}__${matchKey}__${alliance}__${allianceTeam}`;
    let session = await Database.getMatchScoutingSession(sessionKey);
    if (session === undefined) {
      session = getDefaultMatchScoutingSession() as MatchScoutingSession;
      session.key = sessionKey;
      session.matchKey = matchKey;
      session.matchNumber = match.matchNumber;
      session.alliance = alliance;
      session.allianceTeam = allianceTeam;
      session.scheduledTeamKey = teamKey;
      session.scoutedTeamKey = teamKey;
    }

    // Save to DB
    await Database.saveMatchScoutingSession(session);

    // Navigate to the next Screen.
    navigation.navigate(ROUTES.MATCH_SCOUT_CONFIRM, {
      sessionKey: session.key,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefeshing} onRefresh={onRefresh} />
        }
      >
        {eventMatches.map((match, index) => (
          <ContainerGroup title="" key={match.key}>
            <ScoutingMatchSelect
              match={match}
              eventTeams={eventTeams}
              onSelect={(matchKey, alliance, allianceTeam, teamKey) =>
                handleOnSelect(matchKey, alliance, allianceTeam, teamKey)
              }
            />
          </ContainerGroup>
        ))}
      </ScrollView>
    </View>
  );
}

export default IndexScreen;
