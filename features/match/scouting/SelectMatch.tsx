import { ScrollView } from "react-native";
import type { Match, Team } from "@/helpers/types";
import storage from "@/helpers/storage";
import themes from "../../../themes/themes";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import React, { useState } from "react";
import ScoutingMatchSelect from "@/components/ScoutingMatchSelect";

export default function SelectMatch() {
  // Support for retrieving Event Matches and Teams.
  const [eventMatches, setEventMatches] = useState<Record<string, Match>>({});
  const [eventTeams, setEventTeams] = useState<Record<string, Team>>({});

  // Retrieve Matches and Teams from the cache.
  const retrieveEventData = async () => {
    await storage.load({ key: "event-matches" }).then((ret) => {
      setEventMatches(ret);
    });

    await storage.load({ key: "event-teams" }).then((ret) => {
      setEventTeams(ret);
    });
  };
  retrieveEventData();

  const handleMatchSelect = (
    matchKey: string,
    alliance: string,
    allianceTeam: number
  ) => {
    console.log("SelectMatch:", matchKey, alliance, allianceTeam);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Select Match and Team">
        {Object.values(eventMatches).map((match) => (
          <ScoutingMatchSelect
            key={match.key}
            match={match}
            teamsLookup={eventTeams}
            onSelect={(matchKey, alliance, allianceNumber) =>
              handleMatchSelect(matchKey, alliance, allianceNumber)
            }
          />
        ))}
      </ContainerGroup>
    </ScrollView>
  );
}
