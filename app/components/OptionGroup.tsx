import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";

interface OptionGroupProps {
  value: string;
  options: string[] | [];
  onChange: (option: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  value,
  options,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(value ?? "");

  const handleSelectOption = (option: string) => {
    let newOption = option === selectedOption ? "" : option;
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", gap: 6 }}>
      {options.map((option: string) => (
        <TouchableOpacity
          key={option}
          style={[
            Styles.baseButton,

            option === value
              ? Styles.optionGroupActive
              : Styles.optionGroupDefault,
          ]}
          onPress={() => handleSelectOption(option)}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              paddingHorizontal: 20,
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OptionGroup;
