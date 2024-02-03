import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { MatchScoutingSession, Team } from "@/helpers/types";
import ContainerGroup from "@/components/ContainerGroup";
import themes from "@/themes/themes";
import colors from "@/themes/colors";
import * as Database from "@/helpers/database";

interface ConfirmScreenProps {
  sessionKey: string;
  eventTeams: Array<Team>;
  onPrevious: () => void;
  onNext: () => void;
}

const ConfirmScreen: React.FC<ConfirmScreenProps> = ({
  sessionKey,
  eventTeams,
  onPrevious,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [currentSession, setCurrentSession] = useState<MatchScoutingSession>(
    {} as MatchScoutingSession
  );
  const [scheduledTeam, setScheduledTeam] = useState<Team>();
  const [scoutedTeam, setScoutedTeam] = useState<Team>();
  const [filterText, setFilterText] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>([]);

  // Upon changing the filter text.
  useEffect(() => {
    const loadData = async () => {
      try {
        // Attempt to load the Session.
        const session = await Database.getMatchScoutingSession(sessionKey);
        if (session === undefined) return;
        setCurrentSession(session);
        console.log("ConfirmScreen useEffect session:", session);

        // Attempt to map the scheduled and scouted teams.
        const lookupScheduled = eventTeams.find(
          (team) => team.key === session.scheduledTeamKey
        );
        if (lookupScheduled !== undefined) setScheduledTeam(lookupScheduled);

        // Attempt to map the scheduled and scouted teams.
        const lookupScouted = eventTeams.find(
          (team) => team.key === session.scoutedTeamKey
        );
        if (lookupScouted !== undefined) setScoutedTeam(lookupScouted);

        setIsLoading(false);
      } catch (eror) {
        console.error();
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Respond to the change to the Team filter.
  useEffect(() => {
    let filtered = Object.values(eventTeams).filter(
      (team) =>
        filterText !== "" &&
        (team.teamNumber.toString().includes(filterText.toLowerCase()) ||
          team.nickname.toLowerCase().includes(filterText.toLowerCase()))
    );

    setFilteredTeams(filtered);
  }, [filterText]);

  // Respond to updates against the Session.
  const handleChange = (key: string, value: string) => {
    console.log(key, ":", value);
    setCurrentSession((previous) => {
      return {
        ...previous,
        [key]: value,
      };
    });

    console.log("currentSession:", currentSession);
    // TBD: Save to the damn database.
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <ContainerGroup title="Scouter Name">
        <TextInput
          style={themes.textInput}
          value={currentSession.scouterName}
          onChangeText={(text) => handleChange("scouterName", text)}
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
            onPress={() => handleChange("scoutedTeamKey", team.key)}
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
