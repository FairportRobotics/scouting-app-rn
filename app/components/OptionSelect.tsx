import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import themes from "@/app/themes/themes";
import colors from "@/app/themes/colors";
import InputGroup from "@/app/components/InputGroup";

interface OptionSelectProps {
  label: string;
  value: string;
  options: string[] | [];
  onChange: (option: string) => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(value ?? "");

  useEffect(() => {
    setSelectedOption(value);
  });

  const handleSelectOption = (option: string) => {
    let newOption = option === selectedOption ? "" : option;
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <InputGroup title={label}>
      <View style={styles.optionsContainer}>
        {options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              {
                backgroundColor:
                  selectedOption === option ? colors.primary : colors.secondary,
              },
            ]}
            onPress={() => handleSelectOption(option)}
          >
            <Text style={themes.labelText}>{option}</Text>
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
    fontWeight: "900",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
  },
});
