import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import themes from "../themes/themes";
import { Event } from "../helpers/types";

import storage from "../helpers/storage";

const MatchScoutingHeader: React.FC = () => {
  const [event, setEvent] = useState<Event>();

  storage
    .load({
      key: "event",
    })
    .then((ret) => {
      setEvent(ret);
    });

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "orange",
        padding: 8,
        borderRadius: 6,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{event?.name}</Text>
        <Text>Match 1 : Blue 2</Text>
      </View>
      <Text>123 : Team XYZ</Text>
    </View>
  );
};

export default MatchScoutingHeader;
