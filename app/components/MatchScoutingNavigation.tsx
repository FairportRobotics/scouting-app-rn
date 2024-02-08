import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Styles from "@/constants/Styles";
import ContainerGroup from "./ContainerGroup";

interface MatchScoutingNavigationProps {
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

const MatchScoutingNavigation: React.FC<MatchScoutingNavigationProps> = ({
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
}) => {
  const handleOnPrevious = () => {
    onPrevious();
  };

  const handleOnNext = () => {
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <ContainerGroup title="">
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
              {
                flex: 1,
                flexDirection: "row",
                gap: 8,
                paddingHorizontal: 20,
                justifyContent: "flex-start",
              },
            ]}
            onPress={() => handleOnPrevious()}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              size={32}
              style={{ color: "white" }}
            />
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {previousLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              Styles.baseButton,
              {
                flex: 1,
                flexDirection: "row",
                gap: 8,
                paddingHorizontal: 20,
                justifyContent: "flex-end",
              },
            ]}
            onPress={() => handleOnNext()}
          >
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {nextLabel}
            </Text>
            <FontAwesomeIcon
              icon={faAngleRight}
              size={32}
              style={{ color: "white" }}
            />
          </TouchableOpacity>
        </View>
      </ContainerGroup>
    </View>
  );
};

export default MatchScoutingNavigation;
