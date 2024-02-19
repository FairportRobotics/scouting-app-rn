import React from "react";
import { View, Text } from "react-native";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import ScoutTeamSelect from "@/app/components/ScoutTeamSelect";
import type { MatchModel, TeamModel } from "@/constants/Types";

type ScoutMatchSelectProps = {
  matchModel: MatchModel;
  onSelect: (matchModel: MatchModel, teamModel: TeamModel) => void;
};

export default function ScoutMatchSelect({
  matchModel,
  onSelect,
}: ScoutMatchSelectProps) {
  const handleOnSelect = (teamModel: TeamModel) => {
    onSelect(matchModel, teamModel);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
      <View style={{ marginRight: 20, width: 100 }}>
        {matchModel.matchNumber === 0 && (
          <View>
            <Text style={{ fontSize: 24 }}>Practice</Text>
            <Text>Anytime</Text>
          </View>
        )}
        {matchModel.matchNumber !== 0 && (
          <View>
            <Text style={{ fontSize: 24 }}>Match {matchModel.matchNumber}</Text>
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
          teamModel={
            matchModel.alliances[Alliance.Blue][AllianceTeam.One] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={
            matchModel.alliances[Alliance.Blue][AllianceTeam.Two] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={
            matchModel.alliances[Alliance.Blue][AllianceTeam.Three] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />

        <ScoutTeamSelect
          teamModel={
            matchModel.alliances[Alliance.Red][AllianceTeam.One] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={
            matchModel.alliances[Alliance.Red][AllianceTeam.Two] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
        <ScoutTeamSelect
          teamModel={
            matchModel.alliances[Alliance.Red][AllianceTeam.Three] ??
            ({} as TeamModel)
          }
          onSelect={(teamModel) => handleOnSelect(teamModel)}
        />
      </View>
    </View>
  );
}
