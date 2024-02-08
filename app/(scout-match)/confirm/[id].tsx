import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Team } from "@/constants/Types";
import {
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/app/components";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import * as Database from "@/app/helpers/database";

function ConfirmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sessionKey, setSessionKey] = useState<string>(id);
  const [scouterName, setScouterName] = useState<string>("");
  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();
  const [scoutedTeamKey, setScoutedTeamKey] = useState<string>("");
  const [allTeams, setAllTeams] = useState<Array<Team>>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

  const lookupTeam = (teams: Array<Team>, teamKey: string) => {
    return teams.find((team) => team.key == teamKey);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [sessionKey]);

  useEffect(() => {
    saveData();
  }, [scouterName, scoutedTeam]);

  const loadData = async () => {
    try {
      // Retrieve from the database.
      const dtoSession = await Database.getMatchScoutingSession(sessionKey);
      const dtoTeams = await Database.getTeams();

      // Validate.
      if (dtoSession === undefined) return;
      if (dtoTeams === undefined) return;

      // Set State.
      setScouterName(dtoSession.scouterName ?? "");
      setAllTeams(dtoTeams);
      setScheduledTeam(lookupTeam(dtoTeams, dtoSession.scheduledTeamKey));
      setScoutedTeam(lookupTeam(dtoTeams, dtoSession.scoutedTeamKey));
      setScoutedTeamKey(dtoSession.scoutedTeamKey);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      // Save to database.
      await Database.saveMatchScoutingSessionConfirm(
        sessionKey,
        scoutedTeamKey,
        scouterName
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeFilterText = (value: string) => {
    // Convert the filter text to lower case.
    value = value.toLowerCase();

    // Find matching teams where the filter text is part of the team
    // number of nickname.
    let filtered = allTeams.filter(
      (team) =>
        value.length > 0 &&
        (team.teamNumber.toString().includes(value) ||
          team.nickname.toLowerCase().includes(value))
    );

    setFilteredTeams(filtered);
  };

  const handleChangeScoutedTeam = (value: string) => {
    setScoutedTeamKey(value);
    setScoutedTeam(lookupTeam(allTeams, value));
    setFilterText("");
    setFilteredTeams([]);
    saveData();
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/`);
  };

  const handleNavigateNext = () => {
    saveData();
    router.replace(`/(scout-match)/auto/${sessionKey}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader sessionKey={sessionKey} />
      <ContainerGroup title="Scouter Name (required)">
        <TextInput
          style={Styles.textInput}
          value={scouterName}
          onChangeText={(text) => setScouterName(text)}
          placeholder="My name is..."
        />
      </ContainerGroup>
      <ContainerGroup title="Confirm Team to be Scouted">
        <Text style={{ fontSize: 24 }}>
          {scoutedTeam?.teamNumber} - {scoutedTeam?.nickname}
        </Text>
        <Text>
          ({scheduledTeam?.teamNumber} - {scheduledTeam?.nickname} was
          originally scheduled)
        </Text>
        <TextInput
          style={Styles.textInput}
          value={filterText}
          onChangeText={(text) => handleChangeFilterText(text)}
          placeholder="I actually need to scout..."
        />
        {filteredTeams.map((team) => (
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: Colors.appBackground,
              borderRadius: 6,
              padding: 20,
              marginBottom: 8,
            }}
            key={team.key}
            onPress={() => handleChangeScoutedTeam(team.key)}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            >
              {team.teamNumber} {team.nickname}
            </Text>
          </TouchableOpacity>
        ))}
      </ContainerGroup>
      <MatchScoutingNavigation
        previousLabel="Back"
        nextLabel="Auto"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </View>
  );
}

export default ConfirmScreen;
