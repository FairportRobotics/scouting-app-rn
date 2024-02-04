import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, ScrollView, Button } from "react-native";
import getDefaultMatchScoutingSession, {
  MatchScoutingSession,
} from "@/helpers/types";
import Check from "@/components/Check";
import MinusPlusPair from "@/components/MinusPlusPair";
import ContainerGroup from "@/components/ContainerGroup";
import * as Database from "@/helpers/database";
import ROUTES from "@/constants/routes";

function AutoScreen({ navigation }) {
  const { params } = useRoute();
  let sessionKey = params["sessionKey"];

  const [session, setSession] = useState<MatchScoutingSession>(
    getDefaultMatchScoutingSession()
  );

  const handleChange = (property: string, value: any) => {
    setSession((currentSession) => {
      return {
        ...currentSession,
        [property]: value,
      };
    });
  };

  const loadData = async () => {
    const dtoSession = await Database.getMatchScoutingSession(sessionKey);
    console.log("AutoScreen session:", dtoSession);
    setSession(dtoSession);
  };

  const saveData = async () => {
    await Database.saveMatchScoutingSessionAuto(session);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [session]);

  const navigatePrevious = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_CONFIRM, {
      session: session,
    });
  };

  const navigateNext = () => {
    saveData();
    navigation.navigate(ROUTES.MATCH_SCOUT_TELEOP, {
      session: session,
    });
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <ContainerGroup title="Start">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 3,
            width: "100%",
          }}
        >
          <Check
            label="Started with Note"
            checked={session.autoStartedWithNote == 1}
            onToggle={() =>
              handleChange(
                "autoStartedWithNote",
                !session.autoStartedWithNote ? 1 : 0
              )
            }
          />
          <Check
            label="Left Start Area"
            checked={session.autoLeftStartArea == 1}
            onToggle={() =>
              handleChange(
                "autoLeftStartArea",
                !session.autoLeftStartArea ? 1 : 0
              )
            }
          />
        </View>
      </ContainerGroup>

      <ContainerGroup title="Speaker">
        <MinusPlusPair
          label="Score"
          count={session.autoSpeakerScore}
          onChange={(delta) =>
            handleChange(
              "autoSpeakerScore",
              (session.autoSpeakerScore += delta)
            )
          }
        />
        <MinusPlusPair
          label="Miss"
          count={session.autoSpeakerMiss}
          onChange={(delta) =>
            handleChange("autoSpeakerMiss", (session.autoSpeakerMiss += delta))
          }
        />
      </ContainerGroup>

      <ContainerGroup title="Amp">
        <MinusPlusPair
          label="Score"
          count={session.autoAmpScore}
          onChange={(delta) =>
            handleChange("autoAmpScore", (session.autoAmpScore += delta))
          }
        />
        <MinusPlusPair
          label="Miss"
          count={session.autoAmpMiss}
          onChange={(delta) =>
            handleChange("autoAmpMiss", (session.autoAmpMiss += delta))
          }
        />
      </ContainerGroup>
      <ContainerGroup title="">
        <View style={{ flexDirection: "row" }}>
          <Button title="Previous" onPress={navigatePrevious} />
          <Button title="Next" onPress={navigateNext} />
        </View>
      </ContainerGroup>
    </ScrollView>
  );
}

export default AutoScreen;
