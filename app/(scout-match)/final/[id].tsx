import React, { useEffect, useState } from "react";
import {
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ContainerGroup,
  SelectGroup,
  MatchScoutingNavigation,
  MatchScoutingHeader,
} from "@/components";
import Styles from "@/constants/Styles";
import Colors from "@/constants/Colors";
import {
  getMatchScoutingSessionForEdit,
  getRandomJoke,
  MatchScoutingSessionModel,
  saveMatchSessionFinal,
} from "@/data/db";
import Loading from "@/components/Loading";
import postMatchSession from "@/helpers/postMatchSession";

function FinalScreen() {
  // Route.
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // States.
  const [session, setSession] = useState<MatchScoutingSessionModel>();
  const [allianceResult, setAllianceResult] = useState<string>("NONE_SELECTED");
  const [violations, setViolations] = useState<string>("NONE_SELECTED");
  const [notes, setNotes] = useState<string>("");
  const [joke, setJoke] = useState<string>("");

  useEffect(() => {
    async function getJoke() {
      const dbJoke = await getRandomJoke();
      setJoke(dbJoke);
    }

    getJoke();

    loadData();
  }, []);

  const loadData = async () => {
    // Retrieve the session.
    const dbSession = await getMatchScoutingSessionForEdit(id);

    // Validate.
    if (!dbSession) return;

    // Set State.
    setSession(dbSession);
    setAllianceResult(dbSession.finalAllianceResult ?? "");
    setViolations(dbSession.finalViolations ?? "");
    setNotes(dbSession.finalNotes ?? "");
  };

  const saveData = async () => {
    if (!session) return;

    // Set properties and save.
    session.finalAllianceResult = allianceResult;
    session.finalViolations = violations;
    session.finalNotes = notes;

    await saveMatchSessionFinal(session);
    await postMatchSession(session);
  };

  const handleNavigatePrevious = async () => {
    await saveData();
    router.replace(`/(scout-match)/endgame/${id}`);
  };

  const handleNavigateNext = async () => {
    await saveData();
    router.replace(`/`);
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MatchScoutingHeader session={session} />

      <ContainerGroup title="Overall">
        <SelectGroup
          title=""
          options={["Win", "Lose", "Tie"]}
          value={allianceResult}
          onChange={(value) => setAllianceResult(value ?? "NONE_SELECTED")}
        />
        <SelectGroup
          title="Violations"
          options={["Yellow", "Red", "Disabled", "Disqualified"]}
          value={violations}
          onChange={(value) => setViolations(value ?? "NONE_SELECTED")}
        />
      </ContainerGroup>
      <KeyboardAvoidingView behavior="position">
        <ContainerGroup title="Notes">
          <TextInput
            multiline
            maxLength={1024}
            style={[Styles.textInput, { height: 80 }]}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Note anything that you didn't capture in Auto, Teleop or Endgame..."
            placeholderTextColor={Colors.placeholder}
          />
        </ContainerGroup>
      </KeyboardAvoidingView>

      <ContainerGroup title="Your Reward">
        <Text>{joke}</Text>
      </ContainerGroup>

      <MatchScoutingNavigation
        previousLabel="Final"
        nextLabel="Done"
        onPrevious={() => handleNavigatePrevious()}
        onNext={() => handleNavigateNext()}
      />
    </ScrollView>
  );
}

export default FinalScreen;
