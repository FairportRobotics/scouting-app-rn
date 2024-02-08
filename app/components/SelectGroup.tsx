import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Styles from "@/constants/Styles";

interface SelectGroupProps {
  title?: string | "";
  value: string;
  options: string[] | [];
  required?: boolean | false;
  disabled?: boolean | false;
  onChange: (option: string) => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  title,
  value,
  options,
  required,
  disabled,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(value ?? "");

  const handleSelectOption = (option: string) => {
    let newOption = option === value && !required ? "" : option;
    setSelectedOption(newOption);
    onChange(newOption);
  };

  if (disabled) {
    return (
      <View style={{}}>
        {title && <Text style={Styles.selectGroupTitle}>{title}</Text>}
        <View style={{ flexDirection: "row", gap: 6 }}>
          {options.map((option: string) => (
            <View
              key={option}
              style={[
                Styles.baseButton,
                {
                  minWidth: 100,
                  backgroundColor: "darkgray",
                },
              ]}
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
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{}}>
      {title && <Text style={Styles.selectGroupTitle}>{title}</Text>}
      <View style={{ flexDirection: "row", gap: 6 }}>
        {options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              Styles.baseButton,
              { opacity: option === value ? 1.0 : 0.5, minWidth: 100 },
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
    </View>
  );
};

export default SelectGroup;
