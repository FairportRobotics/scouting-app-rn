import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
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
  const [selectedOption, setSelectedOption] = useState<string>(
    value ?? "NOT_SELECTED"
  );

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
                  selectedOption === option ? Colors.primary : Colors.secondary,
              },
            ]}
            onPress={() => handleSelectOption(option)}
          >
            {option && <Text style={Styles.labelText}>{option}</Text>}
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
