import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ContainerGroup } from "@/app/components";
import Styles from "@/constants/Styles";

interface NavigationProps {
  previousLabel: string;
  doneLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onDone: () => void;
  onNext: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  previousLabel,
  doneLabel,
  nextLabel,
  onPrevious,
  onDone,
  onNext,
}) => {
  const handleOnPrevious = () => {
    onPrevious();
  };
  const handleOnDone = () => {
    onDone();
  };
  const handleOnNext = () => {
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <ContainerGroup title="" style={{}}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={[
              Styles.baseButton,
              { flex: 1, flexDirection: "row", gap: 8 },
            ]}
            onPress={() => handleOnPrevious()}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {previousLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              Styles.baseButton,
              { flex: 1, flexDirection: "row", gap: 8 },
            ]}
            onPress={() => handleOnDone()}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {doneLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              Styles.baseButton,
              { flex: 1, flexDirection: "row", gap: 8 },
            ]}
            onPress={() => handleOnNext()}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {nextLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </ContainerGroup>
    </View>
  );
};

export default Navigation;
