import { View, Text, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import Styles from "@/constants/Styles";

type QrCodeModalProps = {
  value: string;
  onPressClose: () => void;
};

export default function QrCodeModal({ value, onPressClose }: QrCodeModalProps) {
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
      <QRCode value={value} size={width - 20} />
    </View>
  );
}
