import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Student, Team } from "@/constants/Types";
import {
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import { useCacheStore } from "@/store/cachesStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import students from "@/data/studentsList";

function ConfirmScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores.
  const cacheStore = useCacheStore();
  const matchStore = useMatchScoutingStore();

  // States.
  const [scouterName, setScouterName] = useState<string>("");
  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();
  const [scoutedTeamKey, setScoutedTeamKey] = useState<string>("");

  // Support for selecting a new Scouter.
  const [scoutFilterText, setScoutFilterText] = useState<string>("");
  const [filteredScouters, setFilteredScouters] = useState<Array<Student>>([]);

  // Support for selected a different Team.
  const [teamFilterText, setTeamFilterText] = useState<string>("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Convert the filter text to lower case.
    const value = scoutFilterText.toLocaleLowerCase();

    // Find matching Students where the filter text is part of the email address or name.
    let filtered = students.filter(
      (student) =>
        value.length > 0 && student.name.toLowerCase().includes(value)
    );

    setFilteredScouters(filtered);
  }, [scoutFilterText]);

  useEffect(() => {
    // Convert the filter text to lower case.
    const value = teamFilterText.toLowerCase();

    // Find matching teams where the filter text is part of the team
    // number of nickname.
    let filtered = cacheStore.teams.filter(
      (team) =>
        value.length > 0 &&
        (team.teamNumber.toString().includes(value) ||
          team.nickname.toLowerCase().includes(value))
    );

    setFilteredTeams(filtered);
  }, [teamFilterText]);

  const lookupTeam = (teams: Array<Team>, teamKey: string) => {
    return teams.find((team) => team.key == teamKey);
  };

  const loadData = async () => {
    // Retrieve from stores.
    if (!(id in matchStore.sessions)) return;
    const cacheSession = matchStore.sessions[id];
    const cacheTeams = cacheStore.teams;

    // Validate.
    if (cacheSession === undefined) return;
    if (cacheTeams === undefined) return;

    // Determine whether we need to use the name from the session or the
    // last scouter name that was selected.
    const name =
      cacheSession.scouterName.length > 0
        ? cacheSession.scouterName
        : matchStore.currentScouter;

    // Set States.
    setScouterName(name);
    setScheduledTeam(lookupTeam(cacheTeams, cacheSession.scheduledTeamKey));
    setScoutedTeam(lookupTeam(cacheTeams, cacheSession.scoutedTeamKey));
    setScoutedTeamKey(cacheSession.scoutedTeamKey);
  };

  const saveData = async () => {
    if (!(id in matchStore.sessions)) return;

    // Set properties and save.
    let current = matchStore.sessions[id];
    current.scouterName = scouterName;
    current.scoutedTeamKey = scoutedTeamKey;
    matchStore.saveSession(current);

    // HACK: Set the store with the new lookups.
    useMatchScoutingStore.setState((state) => ({
      ...state,
      sessions: matchStore.sessions,
    }));
  };

  const handleChangeScouter = (value: string) => {
    matchStore.currentScouter = value;
    setScouterName(value);
    setScoutFilterText("");
    setFilteredScouters([]);
  };

  const handleChangeScoutedTeam = (value: string) => {
    setScoutedTeamKey(value);
    setScoutedTeam(lookupTeam(cacheStore.teams, value));
    setTeamFilterText("");
    setFilteredTeams([]);
  };

  const handleNavigatePrevious = () => {
    saveData();
    router.replace(`/`);
  };

  const handleNavigateNext = () => {
    saveData();
    if (scouterName === "") return;
    router.replace(`/(scout-match)/auto/${id}`);
  };

  if (!(id in matchStore.sessions)) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={matchStore.sessions[id]} />
      <ContainerGroup title={`Scouter Name: ${scouterName}`}>
        <TextInput
          style={[Styles.textInput, {}]}
          value={scoutFilterText}
          onChangeText={(text) => setScoutFilterText(text)}
          placeholder="I am actually..."
          placeholderTextColor={Colors.placeholder}
        />
        <ScrollView style={{ width: "100%" }}>
          {filteredScouters.map((scouter) => (
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: Colors.appBackground,
                borderRadius: 6,
                padding: 20,
                marginBottom: 8,
              }}
              key={scouter.email}
              onPress={() => handleChangeScouter(scouter.name)}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                {scouter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          value={teamFilterText}
          onChangeText={(text) => setTeamFilterText(text)}
          placeholderTextColor={Colors.placeholder}
          placeholder="I actually need to scout..."
        />
        <ScrollView style={{ width: "100%" }}>
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
        </ScrollView>
      </ContainerGroup>
      <MatchScoutingNavigation
        previousLabel="Back"
        nextLabel="Auto"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default ConfirmScreen;
