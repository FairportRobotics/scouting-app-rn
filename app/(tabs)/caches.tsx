import {
  ScrollView,
  View,
  Text,
  Button,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ContainerGroup } from "@/components";
import { useEffect, useState } from "react";
import { ItemKey } from "@/constants/Types";
import flushAndFillLookups from "@/helpers/flushAndFillLookups";
import refreshMatchScoutingKeys from "@/helpers/refreshMatchScoutingKeys";
import refreshPitScoutingKeys from "@/helpers/refreshPitScoutingKeys";
import Colors from "@/constants/Colors";
import {
  getDatabasePath,
  getEvent,
  getMatches,
  getMatchScoutingKeys,
  getPitScoutingKeys,
  getTeams,
} from "@/data/db";
import { Event, Match, Team } from "@/data/schema";

export default function Caches() {
  const [showCaches, setShowCaches] = useState<boolean>(false);

  const [event, setEvent] = useState<Event>();
  const [matches, setMatches] = useState<Match[]>();
  const [teams, setTeams] = useState<Team[]>();

  const [matchKeys, setMatchKeys] = useState<Array<ItemKey>>([]);
  const [showMatchKeys, setShowMatchKeys] = useState<boolean>(false);

  const [pitKeys, setPitKeys] = useState<Array<ItemKey>>([]);
  const [showPitKeys, setShowPitKeys] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [databasePath, setDatabasePath] = useState<string>(getDatabasePath());

  useEffect(() => {
    async function loadData() {
      setEvent(await getEvent());
      setMatches(await getMatches());
      setTeams(await getTeams());

      setMatchKeys(await getMatchScoutingKeys());
      setPitKeys(await getPitScoutingKeys());
    }

    loadData();
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
    setMatchKeys(await getMatchScoutingKeys());
  };

  const handleRefreshPitSessionKeys = async () => {
    await refreshPitScoutingKeys();
    setPitKeys(await getPitScoutingKeys());
  };

  return (
    <ScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl
          title="Refreshing data for the Event, Matches, Teams and loading saved Match and Pit Scouting session keys..."
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          titleColor={Colors.placeholder}
          tintColor={Colors.placeholder}
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
            <Text>{JSON.stringify(event, null, 2)}</Text>
            <Text>{JSON.stringify(matches, null, 2)}</Text>
            <Text>{JSON.stringify(teams, null, 2)}</Text>
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

      <ContainerGroup title="SQLite Database Path">
        <View>
          <TextInput
            multiline
            maxLength={2048}
            numberOfLines={6}
            value={databasePath}
          />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}
