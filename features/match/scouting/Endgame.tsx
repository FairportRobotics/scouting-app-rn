import { Text, View, ScrollView } from "react-native";

import themes from "../../../themes/themes";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import MinusPlusPair from "@/components/MinusPlusPair";
import { useState } from "react";
import Check from "@/components/Check";
import OptionSelect from "@/components/OptionSelect";

export default function Endgame() {
  // [ ] Trap Score (-/+)
  // [ ] Microphone Score (-/+)
  // [ ] Did Robot Park (cechkbox)
  // [ ] Did Robot Hang (cechkbox)
  //     [ ] Harmony Score (0/1/2)

  // Support for Trap Score
  const [trapScore, setTrapScore] = useState(0);
  const handleTrapScore = (delta: number) => {
    setTrapScore((prev) => (prev += delta));
  };

  // Support for Microphone Score
  const [microphoneScore, setMicrophoneScore] = useState(0);
  const handleMicrophoneScore = (delta: number) => {
    setMicrophoneScore((prev) => (prev += delta));
  };

  // Support for Did robot hang?
  const [didRobotHang, setDidRobotHang] = useState(false);
  const handleDidRobotHang = () => {
    setDidRobotHang((prev) => !prev);
    setHarmonyScore("");
  };

  // Support for Harmony
  const [harmonyScore, setHarmonyScore] = useState("");
  const handleHarmonyScore = (option: string) => {
    setHarmonyScore(option);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Stage">
        <MinusPlusPair
          label="Trap"
          count={trapScore}
          onChange={handleTrapScore}
        />
        <MinusPlusPair
          label="Microphone"
          count={microphoneScore}
          onChange={handleMicrophoneScore}
        />
        <Check
          style={{ marginTop: 18 }}
          label="Did robot hang?"
          checked={didRobotHang}
          onToggle={handleDidRobotHang}
        />
        {didRobotHang && (
          <OptionSelect
            label="Harmony"
            options={["0", "1", "2"]}
            onChange={handleHarmonyScore}
          />
        )}
      </ContainerGroup>
    </ScrollView>
  );
}
