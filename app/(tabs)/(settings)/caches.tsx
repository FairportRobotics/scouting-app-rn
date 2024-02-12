import { ScrollView, View, Text, Button } from "react-native";
import { ContainerGroup } from "@/app/components";
import { useEffect, useState } from "react";
import {
  Event,
  ItemKey,
  Match,
  MatchScoutingSession,
  Team,
  TeamMember,
} from "@/constants/Types";
import * as Database from "@/app/helpers/database";
import teamMembers from "@/data/teamMembers";

export default function Caches() {
  // The Blue Alliance
  const [showTbaCaches, setShowTbaCaches] = useState<boolean>(false);
  const [event, setEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  // Team
  const [showTeamCaches, setShowTeamCaches] = useState<boolean>(false);
  const [teamMembersCache, setTeamMembers] = useState<Array<TeamMember>>([]);

  // Match Session Keys
  const [showMatchSessionKeys, setShowMatchSessionKeys] =
    useState<boolean>(false);
  const [matchScoutingKeys, setMatchScoutingKeys] = useState<Array<ItemKey>>(
    []
  );

  // Pit Session Keys
  const [showPitSessionKeys, setShowPitSessionKeys] = useState<boolean>(false);
  const [pitScoutingKeys, setPitScoutingKeys] = useState<Array<ItemKey>>([]);

  useEffect(() => {
    try {
      // Retrieve data.
      Promise.all([Database.getEvent() as Promise<Event>])
        .then(([dtoEvent]) => {
          setEvent(dtoEvent);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    loadTbaCaches();
  }, [showTbaCaches]);

  useEffect(() => {
    loadTeamMembers();
  }, [showTeamCaches]);

  useEffect(() => {
    loadMatchSessionKeys();
  }, [showMatchSessionKeys]);

  useEffect(() => {
    loadPitSessionKeys();
  }, [showPitSessionKeys]);

  const loadTbaCaches = async () => {
    try {
      // Retrieve data.
      Promise.all([
        Database.getEvent() as Promise<Event>,
        Database.getMatches() as Promise<Array<Match>>,
        Database.getTeams() as Promise<Array<Team>>,
      ])
        .then(([dtoEvent, dtoMatches, dtoTeams]) => {
          setEvent(dtoEvent);
          setEventMatches(dtoMatches);
          setEventTeams(dtoTeams);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  const loadTeamMembers = async () => {
    try {
      // Retrieve data.
      Promise.all([Database.getTeamMembers()])
        .then(([dtoTeamMembers]) => {
          setTeamMembers(dtoTeamMembers);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  const loadMatchSessionKeys = async () => {
    try {
      // Retrieve data.
      Promise.all([Database.getUploadedMatchScoutingKeys()])
        .then(([dtoMatchScoutingKeys]) => {
          setMatchScoutingKeys(dtoMatchScoutingKeys);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  const loadPitSessionKeys = async () => {
    try {
      // Retrieve data.
      Promise.all([Database.getUploadedPitScoutingKeys()])
        .then(([dtoPitScoutingKeys]) => {
          setPitScoutingKeys(dtoPitScoutingKeys);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  const handleRefreshTeamMembersCache = async () => {
    await Database.saveTeamMembers(teamMembers);
    await loadTeamMembers();
  };

  const handleRefreshMatchSessionKeys = async () => {
    await loadMatchSessionKeys();
  };

  const handleRefreshPitSessionKeys = async () => {
    await loadPitSessionKeys();
  };

  return (
    <ScrollView>
      <ContainerGroup title="The Blue Alliance">
        <Button
          onPress={() => setShowTbaCaches(!showTbaCaches)}
          title={showTbaCaches ? "Hide" : "Show"}
        />
        {showTbaCaches && (
          <View>
            <Text>{JSON.stringify(event, null, 2)}</Text>
            <Text>{JSON.stringify(eventMatches, null, 2)}</Text>
            <Text>{JSON.stringify(eventTeams, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>

      <ContainerGroup title="Team Members">
        <Button
          onPress={() => handleRefreshTeamMembersCache()}
          title="Refresh"
        />
        <Button
          onPress={() => setShowTeamCaches(!showTeamCaches)}
          title={showTeamCaches ? "Hide" : "Show"}
        />
        {showTeamCaches && (
          <View>
            <Text>{JSON.stringify(teamMembersCache, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>

      <ContainerGroup title="Match Session Keys">
        <Button
          onPress={() => handleRefreshMatchSessionKeys()}
          title="Refresh Keys"
        />
        <Button
          onPress={() => setShowMatchSessionKeys(!showMatchSessionKeys)}
          title={showMatchSessionKeys ? "Hide" : "Show"}
        />
        {showMatchSessionKeys && (
          <View>
            <Text>{JSON.stringify(matchScoutingKeys, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>

      <ContainerGroup title="Pit Session Keys">
        <Button
          onPress={() => handleRefreshPitSessionKeys()}
          title="Refresh Keys"
        />
        <Button
          onPress={() => setShowPitSessionKeys(!showPitSessionKeys)}
          title={showPitSessionKeys ? "Hide" : "Show"}
        />
        {showPitSessionKeys && (
          <View>
            <Text>{JSON.stringify(pitScoutingKeys, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>
    </ScrollView>
  );
}
