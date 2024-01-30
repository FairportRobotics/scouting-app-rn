import { Text, View, ScrollView, TextInput } from "react-native";

import themes from "../../../themes/themes";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import MinusPlusPair from "@/components/MinusPlusPair";
import { useState } from "react";
import OptionSelect from "@/components/OptionSelect";

export default function Final() {
  // [X] Total Score (-/+)
  // [X] Ranking Points (-/+)
  // [X] Alliance Result (Win/Lose/Tie)
  // [X] Violations (Red/Yellow/Disabled/Disqualified)
  // [X] Penalties (prompt that the number should be read from the oposing Alliance Scoreboard)
  // [ ] Notes (text)

  // Support for Total Score
  const [totalScore, setTotalScore] = useState(0);
  const handleTotalScore = (delta: number) => {
    setTotalScore((prev) => (prev += delta));
  };

  // Support for Ranking Points
  const [rankingPoints, setRankingPoints] = useState(0);
  const handleRankingPoints = (delta: number) => {
    setRankingPoints((prev) => (prev += delta));
  };

  // Support for Alliance Result
  const [allianceResult, setAllianceResult] = useState("");
  const handleAllianceResult = (option: string) => {
    setAllianceResult(option);
  };

  // Support for Penalties
  const [penalties, setPenalties] = useState("");
  const handlePenalties = (option: string) => {
    setPenalties(option);
  };

  // Support for Notes
  const [notes, setNotes] = useState("");
  const handleNotes = (note: string) => {
    setNotes(note);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Alliance">
        <MinusPlusPair
          label="Total Score"
          count={totalScore}
          onChange={handleTotalScore}
        />
        <MinusPlusPair
          label="Ranking Points"
          count={rankingPoints}
          onChange={handleRankingPoints}
        />
        <OptionSelect
          label="Alliance Result"
          options={["Win", "Lose", "Tie"]}
          onChange={handleAllianceResult}
        />
        <OptionSelect
          label="Penalties (Record from opposing Alliance Scoreboard)"
          options={["Yellow", "Red", "Disabled", "Disqualified"]}
          onChange={handlePenalties}
        />

        <View>
          <Text style={themes.labelText}>Notes</Text>
          <TextInput
            multiline
            maxLength={1024}
            value={notes}
            onChangeText={(text) => handleNotes(text)}
            placeholder="Make note of anything interesting that happened during the Match that we might want to consider later."
          />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}
