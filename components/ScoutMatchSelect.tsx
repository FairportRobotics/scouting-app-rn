import React from "react";
import { View, Text } from "react-native";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import ScoutTeamSelect from "@/components/ScoutTeamSelect";
import { MatchModel } from "@/data/db";

type ScoutMatchSelectProps = {
  matchModel: MatchModel;
  onSelect: (sessionKey: string) => void;
};

export default function ScoutMatchSelect({
  matchModel,
  onSelect,
}: ScoutMatchSelectProps) {
  // Map the TBA match types to a more friendly string.
  const matchTypes: Record<string, string> = {
    qm: "Quals",
    sf: "Semi",
    f: "Final",
  };

  // Provide a map to weekday strings.
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleOnSelect = (sessionKey: string) => {
    onSelect(sessionKey);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
      <View style={{ marginRight: 20, width: 100 }}>
        {matchModel.matchNumber === 0 && (
          <View>
            <Text style={{ fontSize: 22 }}>Scouter Training</Text>
            <Text>Anytime</Text>
          </View>
        )}
        {matchModel.matchNumber !== 0 && (
          <View>
            <Text style={{ fontSize: 22 }}>
              {matchTypes[matchModel.matchType]} {matchModel.matchNumber}
              {matchModel.matchType === "sf" ? `/${matchModel.setNumber}` : ""}
            </Text>
            <Text>{weekday[new Date(matchModel.predictedTime).getDay()]}</Text>
            <Text>
              {new Date(matchModel.predictedTime).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          gap: 4,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ScoutTeamSelect
          teamModel={matchModel.blueTeams["1"]}
          alliance="Blue"
          allianceTeam={1}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={matchModel.blueTeams["2"]}
          alliance="Blue"
          allianceTeam={2}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={matchModel.blueTeams["3"]}
          alliance="Blue"
          allianceTeam={3}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />

        <ScoutTeamSelect
          teamModel={matchModel.redTeams["1"]}
          alliance="Red"
          allianceTeam={1}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={matchModel.redTeams["3"]}
          alliance="Red"
          allianceTeam={2}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={matchModel.redTeams["3"]}
          alliance="Red"
          allianceTeam={3}
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
      </View>
    </View>
  );
}
