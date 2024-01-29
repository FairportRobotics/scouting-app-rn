import { useState } from "react";
import {
  Button,
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

import themes from "../../../themes/themes";
import type { Event, Match, Team } from "../../../helpers/types";
import getEvent from "../../../helpers/getEvent";
import getMatches from "../../../helpers/getMatchesForEvent";
import getTeams from "../../../helpers/getTeamsForEvent";

import storage from "../../../helpers/storage";

export default function CacheEvent() {
  // Support for the Cache button.
  const cacheEventData = () => {
    fetchEvent();
    fetchEventMatches();
    fetchEventTeams();
  };

  // Support for the Retrieve button.
  const retrieveEventData = async () => {
    await storage
      .load({
        key: "event",
      })
      .then((ret) => {
        setEvent(ret);
      });

    await storage
      .load({
        key: "event-matches",
      })
      .then((ret) => {
        setEventMatches(ret);
      });

    await storage
      .load({
        key: "event-teams",
      })
      .then((ret) => {
        setEventTeams(ret);
      });
  };

  // Support for editing the Event Key
  const [eventKey, setEventKey] = useState("");
  const handleChangeKey = (key: string) => {
    setEventKey((prev) => key);
  };

  // Support for retrieving Event
  const [event, setEvent] = useState<Event>();
  const fetchEvent = async () => {
    let response: Event = await getEvent(eventKey);
    setEvent((prev) => response);

    await storage.save({
      key: "event",
      data: response,
    });
  };

  // Support for retrieving Event Matches.
  const [eventMatches, setEventMatches] = useState<Record<string, Match>>({});
  const fetchEventMatches = async () => {
    let response: Record<string, Match> = await getMatches(eventKey);
    setEventMatches((prev) => response);

    await storage.save({
      key: "event-matches",
      data: response,
    });
  };

  // Support for retrieving Event Teams.
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});
  const fetchEventTeams = async () => {
    let response: Record<string, Team> = await getTeams(eventKey);
    setEventTeams((prev) => response);

    await storage.save({
      key: "event-teams",
      data: response,
    });
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <View>
        <Text style={{ marginBottom: 8 }}>
          Placeholder for the UI and logic to cache a specific The Blue Alliance
          Event. For now, we'll provide a means for a user to enter an Event Key
          and we'll call out to The Blue Alliance for the Event details, the
          list of Matches and the list of Teams, then cache them all.
        </Text>
        <Text style={{ marginBottom: 8 }}>
          2023nyrr for 2023 Ra Cha Cha Ruckus
        </Text>
        <Text style={{ marginBottom: 8 }}>
          2024paca for 2024 Greater Pittsburgh Regional
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeKey}
          value={eventKey}
          placeholder="Event Key..."
          keyboardType="default"
        />
        <Button title="Cache" onPress={cacheEventData} />
        <Button title="Retrieve" onPress={retrieveEventData} />

        <Text>Scouting Event: {event?.shortName}</Text>
        <Text>Matches Count: {Object.keys(eventMatches).length}</Text>
        <Text>Teams Count: {Object.keys(eventTeams).length}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});
