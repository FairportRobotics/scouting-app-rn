import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import themes from "../themes/themes";

import MetricCount from "./MetricCount";
import MetricLabel from "./MetricLabel";

interface MinusPlusProps {
  label: string;
  count: number | 0;
  onChange: (delta: number) => void;
}

const MinusPlus: React.FC<MinusPlusProps> = ({ label, count, onChange }) => {
  const handleDecrement = () => {
    if (count == 0) onChange(0);
    else onChange(-1);
  };

  const handleIncrement = () => {
    onChange(+1);
  };

  return (
    <View
      style={{
        flex: 0,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={handleDecrement}
        style={themes.minusPlusButton}
      >
        <FontAwesomeIcon icon={faMinus} size={32} style={{ color: "white" }} />
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <MetricLabel label={label} />
        <MetricCount count={count} />
      </View>
      <TouchableOpacity
        onPress={handleIncrement}
        style={themes.minusPlusButton}
      >
        <FontAwesomeIcon icon={faPlus} size={32} style={{ color: "white" }} />
      </TouchableOpacity>
    </View>
  );
};

export default MinusPlus;
