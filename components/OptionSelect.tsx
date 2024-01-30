import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import colors from "@/themes/colors";
import InputGroup from "@/components/InputGroup";

interface OptionSelectProps {
  label: string;
  options: string[] | [];
  onChange: (option: string) => void;
  style?: {};
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  label,
  options,
  onChange,
  style,
}) => {
  // Support for Left Start Area
  const [selectedOption, setSelectedOption] = useState("");
  const handleSelectOption = (option: string) => {
    let newOption = option === selectedOption ? "" : option;
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <InputGroup title={label}>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              style,
              styles.option,
              {
                backgroundColor:
                  selectedOption === option
                    ? colors.selected
                    : colors.unselected,
              },
            ]}
            onPress={() => handleSelectOption(option)}
          >
            <Text style={styles.text}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </InputGroup>
  );
};

export default OptionSelect;

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  option: {
    borderRadius: 8,
    backgroundColor: "orange",
    color: "white",
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
  },
  optionSelected: {
    // backgroundColor: "orange",
  },
  labelContainer: {},
  text: {
    fontSize: 24,
  },
});
