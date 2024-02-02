import { Text, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import type { Event, Match, Team } from "@/helpers/types";
import * as Database from "@/helpers/database";

import ContainerGroup from "@/components/ContainerGroup";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";

// const MatchScoutingMode = {
//   SelectMatch: { previous: "", next: "" },
//   Confirm: { previous: "", next: "" },
//   Auto: { previous: "", next: "" },
//   Teleop: { previous: "", next: "" },
//   Endgame: { previous: "", next: "" },
//   Final: { previous: "", next: "" },
// };

export default function IndexScreen() {
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>(
    new Array<Match>()
  );
  const [eventTeams, setEventTeams] = useState<Array<Team>>(new Array<Team>());

  useEffect(() => {
    console.log("useEffect start...");
    const loadData = async () => {
      // Load data from the DB. Hard-code for ease of development experience.
      let eventKey: string = "2023nyrr";
      const dtoEvent = await Database.getEvent(eventKey);
      const dtoMatches = await Database.getMatchesForEvent(eventKey);
      const dtoTeams = await Database.getTeamsForEvent(eventKey);

      // Assign to state.
      setCurrentEvent(dtoEvent);
      setEventMatches(dtoMatches);
      setEventTeams(dtoTeams);

      // Sanity check.
      console.log("Loaded Event:", currentEvent);
      console.log("Loaded Matches:", eventMatches.length);
      console.log("Loaded Teams:", eventTeams.length);

      console.log("useEffect loadData end.");
    };
    loadData();
    console.log("useEffect end.");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MatchScoutingHeader />
      <View style={{ flex: 1, backgroundColor: "plum" }}>
        <Text>Content here...</Text>
      </View>
      <ContainerGroup title="" style={{}}>
        <Text>Buttons here...</Text>
      </ContainerGroup>
    </View>
  );
}
