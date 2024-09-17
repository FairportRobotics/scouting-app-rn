import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ContainerGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import {
  getMatchScoutingSessionForEdit,
  getTeamMembers,
  getTeams,
  MatchScoutingSessionModel,
  saveMatchSessionConfirm,
} from "@/data/db";
import { Team, TeamMember } from "@/data/schema";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import Loading from "@/components/Loading";
import postMatchSession from "@/helpers/postMatchSession";

function ConfirmScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
  const [scouterName, setScouterName] = useState<string>("");
  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();
  const [scoutedTeamKey, setScoutedTeamKey] = useState<string>("");

  // Support for selecting a new Scouter.
  const [allScouters, setAllScouters] = useState<Array<TeamMember>>([]);
  const [scoutFilterText, setScoutFilterText] = useState<string>("");
  const [filteredScouters, setFilteredScouters] = useState<Array<TeamMember>>(
    []
  );

  // Support for selected a different Team.
  const [allTeams, setAllTeams] = useState<Array<Team>>([]);
  const [teamFilterText, setTeamFilterText] = useState<string>("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Support for responding to searching for a scouter.
  useEffect(() => {
    // Convert the filter text to lower case.
    const value = scoutFilterText.toLocaleLowerCase();

    // Find matching Students where the filter text is part of the email address or name.
    let filtered = allScouters.filter(
      (student) =>
        value.length > 0 && student.name.toLowerCase().includes(value)
    );

    setFilteredScouters(filtered);
  }, [scoutFilterText]);

  // Support for searching for a team.
  useEffect(() => {
    // Convert the filter text to lower case.
    const value = teamFilterText.toLowerCase();

    // Find matching teams where the filter text is part of the team
    // number of nickname.
    let filtered = allTeams.filter(
      (team) =>
        value.length > 0 &&
        (team.number.toString().includes(value) ||
          team.nickname.toLowerCase().includes(value))
    );

    setFilteredTeams(filtered);
  }, [teamFilterText]);

  const lookupTeam = (teams: Array<Team>, teamKey: string) => {
    return teams.find((team) => team.id == teamKey);
  };

  const loadData = async () => {
    const dbSession = await getMatchScoutingSessionForEdit(id);
    const dbTeams = await getTeams();
    const dbMembers = await getTeamMembers();

    // Retrieve from stores.
    if (!dbSession) return;

    // Set States.
    setSession(dbSession);
    setAllTeams(dbTeams);
    setAllScouters(dbMembers);

    setScouterName(dbSession.scouterName ?? "");
    setScheduledTeam(lookupTeam(dbTeams, dbSession.scheduledTeamKey));
    setScoutedTeam(lookupTeam(dbTeams, dbSession.scoutedTeamKey));
    setScoutedTeamKey(dbSession.scoutedTeamKey);
  };

  const saveData = async () => {
    if (!session) return;

    session.scouterName = scouterName;
    session.scoutedTeamKey = scoutedTeamKey;

    await saveMatchSessionConfirm(session);
    await postMatchSession(session);
  };

  const handleChangeScouter = (value: string) => {
    setScouterName(value);
    setScoutFilterText("");
    setFilteredScouters([]);
  };

  const handleChangeScoutedTeam = (value: string) => {
    setScoutedTeamKey(value);
    setScoutedTeam(lookupTeam(allTeams, value));
    setTeamFilterText("");
    setFilteredTeams([]);
  };

  const handleNavigatePrevious = async () => {
    await saveData();
    router.replace(`/`);
  };

  const handleNavigateNext = async () => {
    await saveData();

    if (scouterName.length === 0) {
      Alert.alert("Scouter Name Missing", "Select Scouter Name to continue");
      return;
    }

    router.replace(`/(scout-match)/auto/${id}`);
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />
      <ContainerGroup title={`Scouter Name: ${scouterName}`}>
        <TextInput
          style={[
            scouterName.length > 0 ? Styles.textInput : Styles.textInputError,
          ]}
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
          {scoutedTeam?.number} - {scoutedTeam?.nickname}
        </Text>
        <Text>
          ({scheduledTeam?.number} - {scheduledTeam?.nickname} was originally
          scheduled)
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
              key={team.id}
              onPress={() => handleChangeScoutedTeam(team.id)}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                {team.number} {team.nickname}
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
