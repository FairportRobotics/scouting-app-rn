import { useState } from "react";
import { View, ScrollView } from "react-native";
import themes from "@/themes/themes";
import Check from "@/components/Check";
import MinusPlusPair from "@/components/MinusPlusPair";
import ContainerGroup from "@/components/ContainerGroup";
import MatchScoutingHeader from "@/components/MatchScoutingHeader";

export default function Auto() {
  // Support for Started with Note
  const [startedWithNote, setStartedWithNote] = useState(false);
  const handleToggleStartedWithNote = () => {
    setStartedWithNote((prev) => !prev);
  };

  // Support for Left Start Area
  const [leftStartArea, setLeftStartArea] = useState(false);
  const handleToggleLeftStartArea = () => {
    setLeftStartArea((prev) => !prev);
  };

  // Support for Speaker Score Non-Amplified
  const [speakerScore, setSpeakerScore] = useState(0);
  const handleSpeakerScore = (delta: number) => {
    setSpeakerScore((prev) => (prev += delta));
  };

  // SUpport for Speaker Score Amplified
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState(0);
  const handleSpeakerScoreAmplified = (delta: number) => {
    setSpeakerScoreAmplified((prev) => (prev += delta));
  };

  // Support for Speaker Miss
  const [speakerMiss, setSpeakerMiss] = useState(0);
  const handleSpeakerMiss = (delta: number) => {
    setSpeakerMiss((prev) => (prev += delta));
  };

  // Support for Amp Score
  const [ampScore, setAmpScore] = useState(0);
  const handleAmpScore = (delta: number) => {
    setAmpScore((prev) => (prev += delta));
  };

  // Support for Amp Score
  const [ampMiss, setAmpMiss] = useState(0);
  const handleAmpMiss = (delta: number) => {
    setAmpMiss((prev) => (prev += delta));
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <MatchScoutingHeader />
      <ContainerGroup title="Start">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 3,
            width: "100%",
          }}
        >
          <Check
            label="Started with Note"
            checked={startedWithNote}
            onToggle={handleToggleStartedWithNote}
          />
          <Check
            label="Left Start Area"
            checked={leftStartArea}
            onToggle={handleToggleLeftStartArea}
          />
        </View>
      </ContainerGroup>

      <ContainerGroup title="Speaker">
        <MinusPlusPair
          label="Score: Non-Amplified"
          count={speakerScore}
          onChange={handleSpeakerScore}
        />
        <MinusPlusPair
          label="Score: Amplified"
          count={speakerScoreAmplified}
          onChange={handleSpeakerScoreAmplified}
        />
        <MinusPlusPair
          label="Miss"
          count={speakerMiss}
          onChange={handleSpeakerMiss}
        />
      </ContainerGroup>

      <ContainerGroup title="Amp">
        <MinusPlusPair
          label="Score"
          count={ampScore}
          onChange={handleAmpScore}
        />
        <MinusPlusPair label="Miss" count={ampMiss} onChange={handleAmpMiss} />
      </ContainerGroup>
    </ScrollView>
  );
}
