import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface ButtonState {
  color: string;
  text: string;
}

interface GridButtonProps {
  onPress: () => void;
  color: string;
  text: string;
}

const GridButton: React.FC<GridButtonProps> = ({ onPress, color, text }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.button, { backgroundColor: color }]}>
      <Text style={styles.buttonText}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const Grid: React.FC = () => {
  const [buttonStates, setButtonStates] = useState<ButtonState[]>(
    Array(33 * 6).fill({ color: "white", text: "Click" })
  );

  const handlePress = (index: number) => {
    const row = Math.floor(index / 6); // Calculate the row index
    const newButtonStates = buttonStates.map((state, i) => {
      // For buttons in the same row, toggle color
      if (Math.floor(i / 6) === row) {
        return {
          ...state,
          color:
            i === index
              ? state.color === "white"
                ? "darkgray"
                : "white"
              : "white",
          text:
            i === index
              ? state.text === "Click"
                ? "Pressed"
                : "Click"
              : "Click",
        };
      }
      return state;
    });
    setButtonStates(newButtonStates);
  };

  const renderButton = ({ index }: { index: number }) => (
    <GridButton
      onPress={() => handlePress(index)}
      color={buttonStates[index].color}
      text={buttonStates[index].text}
    />
  );

  return (
    <FlatList
      data={Array(33 * 6).fill(undefined)}
      renderItem={renderButton}
      keyExtractor={(item, index) => index.toString()}
      numColumns={6}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    padding: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
  },
});

export default Grid;
