import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons/faSquareCheck";

interface CheckProps {
  label: string;
  checked: boolean | false;
  onToggle: () => void;
  style?: {};
}

const Check: React.FC<CheckProps> = ({ label, checked, onToggle, style }) => {
  const handleToggle = () => {
    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <FontAwesomeIcon
        icon={checked ? faSquareCheck : faSquare}
        size={32}
        style={{ color: "orange", marginRight: 8 }}
      />
      <Text style={{ fontSize: 24 }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Check;
