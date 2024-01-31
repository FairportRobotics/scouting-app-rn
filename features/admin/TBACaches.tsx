import { useState, useEffect } from "react";
import { Button, Text, View, TextInput } from "react-native";
import type { Event, Match, Team } from "@/helpers/types";

import ContainerGroup from "@/components/ContainerGroup";
import fetchEvent from "@/helpers/fetchEvent";
import fetchEventMatches from "@/helpers/fetchEventMatches";
import fetchEventTeams from "@/helpers/fetchEventTeams";
import * as Database from "@/helpers/database";

export default function TBACaches() {
  useEffect(() => {
    Database.initializeDatabase();
  });

  // Support for editing the Event Key
  const [eventKey, setEventKey] = useState("2023nyrr");
  const handleChangeKey = (key: string) => {
    setEventKey(key);
  };

  // Support for retrieving Event
  const [event, setEvent] = useState<Event>();
  const handleFetchEvent = async () => {
    let event: Event = await fetchEvent(eventKey);
    setEvent(event);
    Database.saveEvent(event);
  };

  // Support for retrieving Event Matches
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const handleFetchEventMatches = async () => {
    let matches: Array<Match> = await fetchEventMatches(eventKey);

    setEventMatches(matches);
    Database.saveEventMatches(eventKey, matches);
  };

  // Support for retrieving Event Teams
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);
  const handleFetchEventTeams = async () => {
    let teams: Array<Team> = await fetchEventTeams(eventKey);

    setEventTeams(teams);
    Database.saveEventTeams(eventKey, teams);
  };

  const handleFetchEventData = async () => {
    handleFetchEvent();
    handleFetchEventMatches();
    handleFetchEventTeams();

    let allEvents = await Database.getEvents();
    console.log("allEvents:", allEvents);
  };

  const handleLoadEventData = async () => {
    let event = await Database.getEvent(eventKey);
    if (event !== null) setEvent(event);

    let matches = await Database.getMatchesForEvent(eventKey);
    if (matches !== undefined) setEventMatches(matches);

    let teams = await Database.getTeamsForEvent(eventKey);
    if (teams !== undefined) setEventTeams(teams);
  };

  return (
    <ContainerGroup title="The Blue Alliance Caches">
      <View>
        <Text style={{ marginBottom: 8 }}>
          Enter The Blue Alliance Event key below and Fill Cache. Use Retrieve
          Cache to confirm that the data has been stored successfully.
        </Text>
        <Text style={{ marginBottom: 8 }}>
          2023nyrr : 2023 Ra Cha Cha Ruckus
        </Text>
        <Text style={{ marginBottom: 8 }}>
          2024paca : 2024 Greater Pittsburgh Regional
        </Text>
        <TextInput
          onChangeText={handleChangeKey}
          style={{ borderWidth: 2, borderColor: "darkgray", padding: 6 }}
          value={eventKey}
          placeholder="Event Key..."
          keyboardType="default"
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button title="Fill Cache" onPress={handleFetchEventData} />
          <Button title="Retrieve Cache" onPress={handleLoadEventData} />
        </View>

        <Text>Scouting Event: {event?.shortName}</Text>
        <Text>Matches Count: {eventMatches.length}</Text>
        <Text>Teams Count: {eventTeams.length}</Text>
      </View>
    </ContainerGroup>
  );
}
