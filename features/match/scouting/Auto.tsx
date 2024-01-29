import { useState } from "react";
import { View, ScrollView } from "react-native";

import themes from "../../../themes/themes";
import Check from "../../../components/Check";
import MinusPlusPair from "../../../components/MinusPlusPair";
import ContainerGroup from "../../../components/ContainerGroup";

export default function Auto() {
  const [startedWithNote, setStartedWithNote] = useState(false);
  const [leftStartArea, setLeftStartArea] = useState(false);

  const [speakerScore, setSpeakerScore] = useState(0);
  const [speakerScoreAmplified, setSpeakerScoreAmplified] = useState(0);
  const [speakerMiss, setSpeakerMiss] = useState(0);

  const [ampScore, setAmpScore] = useState(0);
  const [ampMiss, setAmpMiss] = useState(0);

  const handleToggleStartedWithNote = () => {
    setStartedWithNote((prev) => !prev);
  };

  const handleToggleLeftStartArea = () => {
    setLeftStartArea((prev) => !prev);
  };

  const handleSpeakerScore = (delta: number) => {
    setSpeakerScore((prev) => (prev += delta));
  };

  const handleSpeakerScoreAmplified = (delta: number) => {
    setSpeakerScoreAmplified((prev) => (prev += delta));
  };

  const handleSpeakerMiss = (delta: number) => {
    setSpeakerMiss((prev) => (prev += delta));
  };

  const handleAmpScore = (delta: number) => {
    setAmpScore((prev) => (prev += delta));
  };

  const handleAmpMiss = (delta: number) => {
    setAmpMiss((prev) => (prev += delta));
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <ContainerGroup title="Start">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
