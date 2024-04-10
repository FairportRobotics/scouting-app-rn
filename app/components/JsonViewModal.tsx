import { View, Text, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import Styles from "@/constants/Styles";

type JsonModalProps = {
  value: string;
  onPressClose: () => void;
};

export default function JsonModal({ value, onPressClose }: JsonModalProps) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        margin: 30,
      }}
    >
      <TouchableOpacity
        style={[Styles.baseButton]}
        onPress={() => onPressClose()}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            paddingHorizontal: 20,
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(JSON.parse(value), null, 2)}</Text>
    </View>
  );
}
