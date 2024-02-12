import { ScrollView, View, Text, Button } from "react-native";
import { ContainerGroup } from "@/app/components";
import { useEffect, useState } from "react";
import { Event, Match, Team, TeamMember } from "@/constants/Types";
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

  useEffect(() => {
    loadTbaCaches();
  }, [showTbaCaches]);

  useEffect(() => {
    loadTeamMembers();
  }, [showTeamCaches]);

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

  const handleRefreshTeamMembersCache = async () => {
    await Database.saveTeamMembers(teamMembers);
    await loadTeamMembers();
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
    </ScrollView>
  );
}
