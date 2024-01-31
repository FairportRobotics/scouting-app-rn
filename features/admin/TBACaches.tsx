import { useState, useEffect } from "react";
import { Button, Text, View, TextInput } from "react-native";
import type { TbaEvent, TbaMatch, TbaTeam } from "@/helpers/tbaTypes";
import type { Match, Team } from "@/helpers/types";
import { Event } from "@/helpers/types";

import ContainerGroup from "@/components/ContainerGroup";
import fetchEvent from "@/helpers/fetchEvent";
import fetchEventMatches from "@/helpers/fetchEventMatches";
import fetchEventTeams from "@/helpers/fetchEventTeams";
import * as Database from "@/helpers/database";

export default function TBACaches() {
  // Declare the various states that we want to manage.
  const [eventKey, setEventKey] = useState("2023nyrr");
  const [event, setEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  useEffect(() => {
    Database.initializeDatabase(false);
  });

  // Support for editing the Event Key
  const handleChangeKey = (key: string) => {
    setEventKey(key);
  };

  const handleFetchEventData = async () => {
    handleFetchEvent();
    handleFetchEventMatches();
    handleFetchEventTeams();
  };

  // Support for retrieving Event
  const handleFetchEvent = async () => {
    // Fetch the Event from TBA and save to the DB.
    let tbaEvent: TbaEvent = await fetchEvent(eventKey);
    Database.saveEvent(tbaEvent);

    // Retrieve the Event from the DB and save to state.
    let event = await Database.getEvent(eventKey);
    if (event !== null) {
      setEvent(event);
    }
  };

  // Support for retrieving Event Matches
  const handleFetchEventMatches = async () => {
    // Fetch the Matches from TBA and save to the DB.
    let tbaMatches: Array<TbaMatch> = await fetchEventMatches(eventKey);
    Database.saveEventMatches(eventKey, tbaMatches);

    // Retrieve the Matches from the DB and save to state.
    let matches = await Database.getMatchesForEvent(eventKey);
    setEventMatches(matches);
  };

  // Support for retrieving Event Teams
  const handleFetchEventTeams = async () => {
    // Fetch the Matches from TBA and save to the DB.
    let tbaTeams: Array<TbaTeam> = await fetchEventTeams(eventKey);
    Database.saveEventTeams(eventKey, tbaTeams);

    // Retrieve the Matches from the DB and save to state.
    let teams = await Database.getTeamsForEvent(eventKey);
    setEventTeams(teams);
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
