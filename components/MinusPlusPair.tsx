import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import MetricLabel from "@/components/MetricLabel";
import MetricCount from "@/components/MetricCount";
import Styles from "@/constants/Styles";

type MinusPlusProps = {
  label: string;
  count: number | 0;
  onChange: (delta: number) => void;
  style?: {};
};

export default function MinusPlus({
  label,
  count,
  onChange,
  style,
}: MinusPlusProps) {
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
        style={Styles.minusPlusButton}
      >
        <FontAwesomeIcon icon={faMinus} size={32} style={{ color: "white" }} />
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <MetricLabel label={label} />
        <MetricCount count={count ?? 0} />
      </View>
      <TouchableOpacity
        onPress={handleIncrement}
        style={Styles.minusPlusButton}
      >
        <FontAwesomeIcon icon={faPlus} size={32} style={{ color: "white" }} />
      </TouchableOpacity>
    </View>
  );
}
