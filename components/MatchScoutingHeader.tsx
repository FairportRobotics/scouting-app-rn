import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import { Event } from "@/helpers/types";
import storage from "@/helpers/storage";
import colors from "@/themes/colors";
import themes from "@/themes/themes";

interface MatchScoutingHeaderProps {
  style?: {};
}

const MatchScoutingHeader: React.FC<MatchScoutingHeaderProps> = ({ style }) => {
  const [event, setEvent] = useState<Event>();

  try {
    storage
      .load({
        key: "event",
      })
      .then((ret) => {
        setEvent(ret);
      });
  } catch (error) {
    console.error("Something may have gone wrong:", error);
  }

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: colors.primary,
        padding: 8,
        borderRadius: 6,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {event?.name}
        </Text>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Match 1 : Blue 2
        </Text>
      </View>
      <Text style={{ color: "white", fontWeight: "bold" }}>123 : Team XYZ</Text>
    </View>
  );
};

export default MatchScoutingHeader;
