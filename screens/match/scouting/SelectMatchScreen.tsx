import React from "react";
import type { Event, Match, Team } from "@/helpers/types";
import ContainerGroup from "@/components/ContainerGroup";
import ScoutingMatchSelect from "@/components/ScoutingMatchSelect";

interface SelectMatchScreenProps {
  event: Event;
  eventMatches: Array<Match>;
  eventTeams: Array<Team>;
  onSelect: (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => void;
  style?: {};
}

const SelectMatchScreen: React.FC<SelectMatchScreenProps> = ({
  event,
  eventMatches,
  eventTeams,
  onSelect,
  style,
}) => {
  const handleOnSelect = (
    matchKey: string,
    alliance: string,
    allianceTeam: number,
    teamKey: string
  ) => {
    onSelect(matchKey, alliance, allianceTeam, teamKey);
  };

  return (
    <ContainerGroup title="Select Match and Team">
      {Object.values(eventMatches).map((match) => (
        <ScoutingMatchSelect
          key={match.key}
          match={match}
          eventTeams={eventTeams}
          onSelect={(matchKey, alliance, allianceNumber, teamKey) =>
            handleOnSelect(matchKey, alliance, allianceNumber, teamKey)
          }
        />
      ))}
    </ContainerGroup>
  );
};

export default SelectMatchScreen;
