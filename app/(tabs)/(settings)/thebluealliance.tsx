import { useState } from "react";
import { Button, View, TextInput } from "react-native";
import type { TbaEvent, TbaMatch, TbaTeam } from "@/constants/Types";
import ContainerGroup from "@/app/components/ContainerGroup";
import fetchEvent from "@/app/helpers/fetchEvent";
import fetchEventMatches from "@/app/helpers/fetchEventMatches";
import fetchEventTeams from "@/app/helpers/fetchEventTeams";
import backfillMissingTeams from "@/app/helpers/backfillMissingTeams";
import * as Database from "@/app/helpers/database";
import Styles from "@/constants/Styles";
import SignInForAdvanced from "@/app/components/SignInForAdvanced";

export default function TBACaches() {
  // Declare the various states that we want to manage.
  const [eventKey, setEventKey] = useState("2024nyro");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Support for editing the Event Key
  const handleChangeKey = (key: string) => {
    setEventKey(key);
  };

  // Handles fetching and saving all TBA data to the database.
  const handleFetchEventData = async () => {
    await handleFetchEvent();
    await handleFetchEventMatches();
    await handleFetchEventTeams();
    await backfillMissingTeams();
  };

  // Support for retrieving Event
  const handleFetchEvent = async () => {
    // Fetch the Event from TBA and save to the DB.
    let tbaEvent: TbaEvent = await fetchEvent(eventKey);
    Database.saveEvent(tbaEvent);
  };

  // Support for retrieving Event Matches
  const handleFetchEventMatches = async () => {
    // Fetch the Matches from TBA and save to the DB.
    let tbaMatches: Array<TbaMatch> = await fetchEventMatches(eventKey);
    Database.saveMatches(tbaMatches);
  };

  // Support for retrieving Event Teams
  const handleFetchEventTeams = async () => {
    // Fetch the Matches from TBA and save to the DB.
    let tbaTeams: Array<TbaTeam> = await fetchEventTeams(eventKey);
    Database.saveTeams(tbaTeams);
  };

  const onSuccessfulSignin = () => {
    setShowAdvanced(true);
  };

  if (!showAdvanced) {
    return <SignInForAdvanced onSuccessfulSignin={onSuccessfulSignin} />;
  }

  return (
    <View style={{ padding: 10 }}>
      <ContainerGroup title="The Blue Alliance Caches">
        <View>
          <View style={{ alignItems: "flex-start", gap: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                onChangeText={handleChangeKey}
                style={[Styles.textInput, { width: "50%" }]}
                value={eventKey}
                placeholder="Event Key..."
                keyboardType="default"
              />
              <Button
                title="Fill cache for key"
                onPress={handleFetchEventData}
              />
            </View>
          </View>
        </View>
      </ContainerGroup>
    </View>
  );
}
