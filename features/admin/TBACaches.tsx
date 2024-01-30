import { useState, useEffect } from "react";
import { Button, Text, View, TextInput } from "react-native";
import type { Event, Match, Team } from "@/helpers/types";

import ContainerGroup from "@/components/ContainerGroup";
import fetchEvent from "@/helpers/fetchEvent";
import fetchEventMatches from "@/helpers/fetchEventMatches";
import fetchEventTeams from "@/helpers/fetchEventTeams";
import * as SQLite from "expo-sqlite";
import * as Database from "@/helpers/database";

export default function TBACaches() {
  const db = SQLite.openDatabase("scouting-app.db");

  useEffect(() => {
    db.transaction((tx) => {
      // Drop existing tables.
      // tx.executeSql("DROP TABLE IF EXISTS event");
      // tx.executeSql("DROP TABLE IF EXISTS event_matches");
      // tx.executeSql("DROP TABLE IF EXISTS event_teams");

      // Create new tables.
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS event (key TEXT PRIMARY KEY, name TEXT, shortName TEXT, startDate TEXT, endDate TEXT)"
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS event_matches (key TEXT PRIMARY KEY, eventKey TEXT, matchNumber INTEGER, predictedTime TEXT, blueTeams TEXT, redTeams TEXT)"
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS event_teams (key TEXT PRIMARY KEY, eventKey TEXT, teamNumber INTEGER, nickname TEXT)"
      );
    });
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

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO event(key, name, shortName, startDate, endDate) VALUES(?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
        [
          event.key,
          event.name,
          event.shortName,
          event.startDate.toISOString(),
          event.endDate.toISOString(),
        ],
        (txObj, resultSet) => {
          // Do nothing.
        },
        (txObj, error) => {
          console.error(error);
          return false;
        }
      );
    });
  };

  // Support for retrieving Event Matches
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const handleFetchEventMatches = async () => {
    let matches: Array<Match> = await fetchEventMatches(eventKey);

    setEventMatches(matches);

    db.transaction((tx) => {
      matches.forEach((match) => {
        tx.executeSql(
          "INSERT INTO event_matches(key, eventKey, matchNumber, predictedTime, blueTeams, redTeams) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
          [
            match.key,
            eventKey,
            match.matchNumber,
            match.predictedTime.toISOString(),
            JSON.stringify(match.blueTeams),
            JSON.stringify(match.redTeams),
          ],
          (txObj, resultSet) => {
            // Do nothing.
          },
          (txObj, error) => {
            console.error(error);
            return false;
          }
        );
      });
    });
  };

  // Support for retrieving Event Teams
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);
  const handleFetchEventTeams = async () => {
    let teams: Array<Team> = await fetchEventTeams(eventKey);

    setEventTeams(teams);

    db.transaction((tx) => {
      teams.forEach((team) => {
        tx.executeSql(
          "INSERT INTO event_teams(key, eventKey, teamNumber, nickname) VALUES(?, ?, ?, ?) ON CONFLICT (key) DO NOTHING",
          [team.key, eventKey, team.teamNumber, team.nickname],
          (txObj, resultSet) => {
            // Do nothing.
          },
          (txObj, error) => {
            console.error(error);
            return false;
          }
        );
      });
    });
  };

  const handleFetchEventData = () => {
    handleFetchEvent();
    handleFetchEventMatches();
    handleFetchEventTeams();
  };

  const handleLoadEventData = () => {
    let event = Database.getEvent(eventKey);
    if (event !== undefined) setEvent(event);

    let matches = Database.getMatchesForEvent(eventKey);
    if (matches !== undefined) setEventMatches(matches);

    let teams = Database.getTeamsForEvent(eventKey);
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
