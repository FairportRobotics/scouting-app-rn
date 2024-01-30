import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import themes from "@/themes/themes";
import colors from "@/themes/colors";
import ContainerGroup from "@/components/ContainerGroup";

interface OptionSelectProps {
  label: string;
  options: string[] | [];
  onChange: (option: string) => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  label,
  options,
  onChange,
}) => {
  // Support for Left Start Area
  const [selectedOption, setSelectedOption] = useState("");
  const handleSelectOption = (option: string) => {
    let newOption = option === selectedOption ? "" : option;
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <ContainerGroup title={label}>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            style={[
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
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ContainerGroup>
  );
};

export default OptionSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
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
    backgroundColor: "orange",
  },
  labelContainer: {},
  text: {
    fontSize: 24,
  },
});
