import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import { Event } from "@/app/helpers/types";
import colors from "@/app/themes/colors";
import * as Database from "@/app/helpers/database";

interface MatchScoutingHeaderProps {
  style?: {};
}

const MatchScoutingHeader: React.FC<MatchScoutingHeaderProps> = ({ style }) => {
  const [eventKey, setEventKey] = useState<string>("2023nyrr");
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await Database.getEvent();
      if (result !== null) setEvent(result);
    };

    fetchData();

    // Cleanup function.
    return () => {};
  }, []);

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
