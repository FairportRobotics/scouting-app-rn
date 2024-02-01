import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";
import ContainerGroup from "@/components/ContainerGroup";
import MinusPlusPair from "@/components/MinusPlusPair";
import Check from "@/components/Check";
import OptionSelect from "@/components/OptionSelect";

export default function EndgameScreen() {
  // [X] Trap Score (-/+)
  // [X] Microphone Score (-/+)
  // [X] Did Robot Park (cechkbox)
  // [X] Did Robot Hang (cechkbox)
  //     [X] Harmony Score (0/1/2)

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

  // Support for Did robot Park?
  const [didRobotPark, setDidRobotPark] = useState(false);
  const handleDidRobotPark = () => {
    setDidRobotPark((prev) => !prev);
  };

  // Support for Did robot Hang?
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

  useEffect(() => {
    console.log("Auto: Update the session");
  }, [trapScore, microphoneScore, didRobotPark, didRobotHang, harmonyScore]);

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
          label="Did robot Park?"
          checked={didRobotPark}
          onToggle={handleDidRobotPark}
        />
        <Check
          style={{ marginTop: 18 }}
          label="Did robot Hang?"
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
