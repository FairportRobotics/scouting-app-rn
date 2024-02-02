import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { MatchScoutingSession, Team } from "@/helpers/types";
import ContainerGroup from "@/components/ContainerGroup";
import themes from "@/themes/themes";
import colors from "@/themes/colors";
import * as Database from "@/helpers/database";

interface ConfirmScreenProps {
  session: MatchScoutingSession;
  eventTeams: Array<Team>;
  onPrevious: () => void;
  onNext: () => void;
  style?: {};
}

const ConfirmScreen: React.FC<ConfirmScreenProps> = ({
  session,
  eventTeams,
  onPrevious,
  onNext,
  style,
}) => {
  // Support for state.
  const [currentSession, setCurrentSession] =
    useState<MatchScoutingSession>(session);

  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();

  // Support for filtering.
  const [filterText, setFilterText] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

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

  const handleSetScouterName = (name: string) => {
    setCurrentSession((previous) => {
      return {
        ...previous,
        scouterName: name,
      };
    });
  };

  const handleSelectNewTeam = (teamKey: string) => {
    const newTeam = eventTeams.find((team) => team.key === teamKey);
    if (newTeam !== undefined) setScoutedTeam(newTeam);
    setFilterText("");
  };

  return (
    <View>
      <ContainerGroup title="Scouter Name">
        <TextInput
          style={themes.textInput}
          value={currentSession.scouterName}
          onChangeText={(text) => handleSetScouterName(text)}
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
    </View>
  );
};

export default ConfirmScreen;
