import { TextInput, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";
import themes from "@/themes/themes";
import colors from "@/themes/colors";
import { MatchScoutingSession, Team } from "@/helpers/types";

// These will ultimately be initialized with values, if any, from the database.
// That is not wired up yet as I'm still learing about navigation/routing.
const sessionKey = "2023nyrr__2023nyrr_qm1__Blue__1";

const Setup = () => {
  // Support for state.
  const [currentSession, setSession] = useState<MatchScoutingSession>();
  const [scouterName, setScouterName] = useState<string>("");
  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);

  // Support for filtering.
  const [filterText, setFilterText] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

  // Upon initialization of the screen.
  useEffect(() => {
    // Define an async function we can call.
    const fetchData = async () => {
      try {
        // Load the session associated with the key.
        const session = await Database.getMatchScoutingSession(sessionKey);
        console.log("session:", session);
        if (session === undefined) return;
        setSession(session);

        // Persist state.
        setScouterName(session.scouterName);
        setEventTeams(await Database.getTeamsForEvent(session.eventKey));
        setScheduledTeam(
          eventTeams.find((team) => team.key === session.scheduledTeamKey)
        );
        setScoutedTeam(
          eventTeams.find((team) => team.key === session.scoutedTeamKey)
        );
      } catch (error) {}
    };

    // Call the async function.
    fetchData();
  }, []);

  useEffect(() => {
    if (scoutedTeam === undefined) return;

    Database.updateScoutingMatchSessionSetup(
      sessionKey,
      scouterName,
      scoutedTeam!.key
    );
  }, [scouterName, scoutedTeam]);

  // Upon changing the filter text.
  useEffect(() => {
    // Capture teams that match the filter.
    let filtered = Object.values(eventTeams).filter(
      (team) =>
        filterText !== "" &&
        (team.teamNumber.toString().includes(filterText.toLowerCase()) ||
          team.nickname.toLowerCase().includes(filterText.toLowerCase()))
    );

    setFilteredTeams(filtered);
  }, [filterText]);

  const handleSelectNewTeam = (teamKey: string) => {
    setScoutedTeam(eventTeams.find((team) => team.key === teamKey));
    setFilterText("");
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Scouter Name">
        <TextInput
          style={themes.textInput}
          value={scouterName}
          onChangeText={(text) => setScouterName(text)}
          placeholder="My name is..."
        />
      </ContainerGroup>
      <ContainerGroup
        title={`${scoutedTeam?.teamNumber} - ${scoutedTeam?.nickname}`}
      >
        <Text>
          {scheduledTeam?.teamNumber} - {scheduledTeam?.nickname} was originally
          scheduled
        </Text>
        <TextInput
          style={themes.textInput}
          value={filterText}
          onChangeText={(text) => setFilterText(text)}
          placeholder="I actually need to scout..."
        />
        {filteredTeams.map((team) => (
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colors.appBackground,
              borderRadius: 6,
              padding: 10,
              marginBottom: 8,
            }}
            key={team.key}
            onPress={() => handleSelectNewTeam(team.key)}
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
      <ContainerGroup title="Session">
        <Text>{JSON.stringify(currentSession, null, 2)}</Text>
      </ContainerGroup>
    </ScrollView>
  );
};

export default Setup;
