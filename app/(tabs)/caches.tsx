import { ScrollView, View, Text, Button, RefreshControl } from "react-native";
import { ContainerGroup } from "@/components";
import { useCacheStore } from "@/store/cachesStore";
import { usePitScoutingStore } from "@/store/pitScoutingStore";
import { useMatchScoutingStore } from "@/store/matchScoutingStore";
import { useEffect, useState } from "react";
import { ItemKey } from "@/constants/Types";
import flushAndFillLookups from "@/helpers/flushAndFillLookups";
import refreshMatchScoutingKeys from "@/helpers/refreshMatchScoutingKeys";
import refreshPitScoutingKeys from "@/helpers/refreshPitScoutingKeys";
import Colors from "@/constants/Colors";

export default function Caches() {
  // Stores.
  const cacheStore = useCacheStore();
  const matchStore = useMatchScoutingStore();
  const pitStore = usePitScoutingStore();

  const [showCaches, setShowCaches] = useState<boolean>(false);

  const [matchKeys, setMatchKeys] = useState<Array<ItemKey>>([]);
  const [showMatchKeys, setShowMatchKeys] = useState<boolean>(false);

  const [pitKeys, setPitKeys] = useState<Array<ItemKey>>([]);
  const [showPitKeys, setShowPitKeys] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setMatchKeys(matchStore.uploadedKeys);
    setPitKeys(pitStore.uploadedKeys);
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);

    await flushAndFillLookups();
    await refreshMatchScoutingKeys();
    await refreshPitScoutingKeys();

    setIsRefreshing(false);
  };

  const handleRefreshMatchSessionKeys = async () => {
    await refreshMatchScoutingKeys();
    setMatchKeys(matchStore.uploadedKeys);
  };

  const handleRefreshPitSessionKeys = async () => {
    await refreshPitScoutingKeys();
    setPitKeys(pitStore.uploadedKeys);
  };

  return (
    <ScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl
          title="Refreshing data for the Event, Matches, Teams and loading saved Match and Pit Scouting session keys..."
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      <ContainerGroup title="Competition Lookups">
        <Button
          onPress={() => setShowCaches(!showCaches)}
          title={showCaches ? "Hide" : "Show"}
        />
        {showCaches && (
          <View>
            <Text>{JSON.stringify(cacheStore.event, null, 2)}</Text>
            <Text>{JSON.stringify(cacheStore.matches, null, 2)}</Text>
            <Text>{JSON.stringify(cacheStore.teams, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>

      <ContainerGroup title="Match Session Keys">
        <Button
          onPress={() => handleRefreshMatchSessionKeys()}
          title="Refresh Keys"
        />
        <Button
          onPress={() => setShowMatchKeys(!showMatchKeys)}
          title={showMatchKeys ? "Hide" : "Show"}
        />
        {showMatchKeys && (
          <View>
            <Text>{JSON.stringify(matchKeys, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>

      <ContainerGroup title="Pit Session Keys">
        <Button
          onPress={() => handleRefreshPitSessionKeys()}
          title="Refresh Keys"
        />
        <Button
          onPress={() => setShowPitKeys(!showPitKeys)}
          title={showPitKeys ? "Hide" : "Show"}
        />
        {showPitKeys && (
          <View>
            <Text>{JSON.stringify(pitKeys, null, 2)}</Text>
          </View>
        )}
      </ContainerGroup>
    </ScrollView>
  );
}
