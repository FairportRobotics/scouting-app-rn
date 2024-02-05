import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import themes from "@/constants/Styles";

interface OptionGroupProps {
  value: string;
  options: string[] | [];
  style?: {};
  itemStyle?: {};
  onChange: (option: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  value,
  options,
  style,
  itemStyle,
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
          style={{
            backgroundColor: "plum",
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
          onPress={() => handleSelectOption(option)}
        >
          <Text style={itemStyle}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OptionGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
