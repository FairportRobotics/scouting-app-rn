import { ScrollView, View, Button, Text } from "react-native";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import type { Event, Match, Team, MatchScoutingSession } from "@/helpers/types";
import * as Database from "@/helpers/database";

import ContainerGroup from "@/components/ContainerGroup";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";

import SelectMatchScreen from "@/screens/match/scouting/SelectMatchScreen";
import ConfirmScreen from "@/screens/match/scouting/ConfirmScreen";
import AutoScreen from "@/screens/match/scouting/AutoScreen";
import TeleopScreen from "@/screens/match/scouting/TeleopScreen";
import EndgameScreen from "@/screens/match/scouting/EndgameScreen";
import FinalScreen from "@/screens/match/scouting/FinalScreen";

const Mode = {
  Select: { previousMode: "Select", nextMode: "Confirm" },
  Confirm: { previousMode: "Select", nextMode: "Auto" },
  Auto: { previousMode: "Confirm", nextMode: "Teleop" },
  Teleop: { previousMode: "Auto", nextMode: "Endgame" },
  Endgame: { previousMode: "Teleop", nextMode: "Final" },
  Final: { previousMode: "Endgame", nextMode: "Select" },
};

export default function IndexScreen() {
  const isFocused = useIsFocused();

  // State related to the Event.
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [eventTeams, setEventTeams] = useState<Array<Team>>([]);
  const [mode, setMode] = useState(Mode.Select);
  const [sessionKey, setSessionKey] = useState<string>();

  useEffect(() => {
    const loadData = async () => {
      const dtoMatches = await Database.getMatches();
      const dtoTeams = await Database.getTeams();

      // Assign to state.
      setEventMatches(dtoMatches);
      setEventTeams(dtoTeams);
    };
    loadData();
  }, [isFocused]);

  const handleChangeMode = (newMode: string) => {
    switch (newMode) {
      case "Select":
        setMode(Mode.Select);
        break;
      case "Confirm":
        setMode(Mode.Confirm);
        break;
      case "Auto":
        setMode(Mode.Auto);
        break;
      case "Teleop":
        setMode(Mode.Teleop);
        break;
      case "Endgame":
        setMode(Mode.Endgame);
        break;
      case "Final":
        setMode(Mode.Final);
        break;
      default:
        setMode(Mode.Select);
        break;
    }
  };

  const handleStartScouting = async (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => {
    console.log("handleStartScouting");
    const selectedMatch = eventMatches.find((match) => match.key === matchKey);
    if (selectedMatch === undefined) return;

    // Initialize the Match Scouting Session properties.
    let session: MatchScoutingSession = {
      key: `${matchKey}__${alliance}__${allianceTeam}`,
      matchKey: matchKey,
      matchNumber: selectedMatch.matchNumber,
      alliance: alliance,
      allianceTeam: allianceTeam,
      scheduledTeamKey: teamKey,
      scoutedTeamKey: teamKey,
    } as MatchScoutingSession;

    // Initialize and retrieve the Session.
    await Database.initializeMatchScoutingSession(session);
    setSessionKey(session.key);
    console.log("handleStartScouting session:", session.key);

    setMode(Mode.Confirm);
  };

  const handleNavigatePrevious = () => {
    console.log("Previous");
  };

  const handleNavigateNext = () => {
    console.log("Next");
  };

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader />
      <ScrollView>
        <View style={{ flex: 1 }}>
          {mode === Mode.Select && (
            <SelectMatchScreen
              eventMatches={eventMatches}
              eventTeams={eventTeams}
              onSelect={(matchKey, alliance, allianceNumber, teamKey) =>
                handleStartScouting(matchKey, alliance, allianceNumber, teamKey)
              }
            />
          )}
          {sessionKey === undefined && mode === Mode.Confirm && (
            <View>
              <Text>Error with Session.</Text>
            </View>
          )}
          {sessionKey !== undefined && mode === Mode.Confirm && (
            <ConfirmScreen
              sessionKey={sessionKey}
              eventTeams={eventTeams}
              onPrevious={handleNavigatePrevious}
              onNext={handleNavigateNext}
            />
          )}
          {mode === Mode.Auto && <AutoScreen />}
          {mode === Mode.Teleop && <TeleopScreen />}
          {mode === Mode.Endgame && <EndgameScreen />}
          {mode === Mode.Final && <FinalScreen />}
        </View>
        {mode !== Mode.Select && (
          <ContainerGroup title="">
            <View
              style={{
                flexDirection: "row",
                gap: 100,
                alignSelf: "center",
              }}
            >
              <Button
                title={mode.previousMode}
                onPress={() => handleChangeMode(mode.previousMode)}
              />
              <Button
                title={mode.nextMode}
                onPress={() => handleChangeMode(mode.nextMode)}
              />
            </View>
          </ContainerGroup>
        )}
      </ScrollView>
    </View>
  );
}
