import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Database from "@/app/helpers/database";
import SelectTeamRow from "@/app/components/SelectTeamRow";

export type PitResultModel = {
  key: string;
  number: string;
  nickname: string;
  matches: Set<number>;
};

function ScoutPitScreen() {
  const router = useRouter();
  const [eventTeams, setEventTeams] = useState<Array<PitResultModel>>([]);

  const loadData = async () => {
    try {
      // Load data from database.
      const dtoMatches = await Database.getMatches();
      const dtoTeams = await Database.getTeams();

      // Validate.
      if (dtoMatches === undefined) return;
      if (dtoTeams === undefined) return;

      // Create the dictionary of Teams.
      let teamMatchesDictionary: Record<string, Set<number>> = {};
      dtoTeams.forEach((team) => {
        teamMatchesDictionary[team.key] = new Set();
      });

      // Enumerate over the Matches and add the Match Number to the Set
      // associated with each Team.
      dtoMatches.forEach((match) => {
        teamMatchesDictionary[match.blue1TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.blue2TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.blue3TeamKey].add(match.matchNumber);

        teamMatchesDictionary[match.red1TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.red2TeamKey].add(match.matchNumber);
        teamMatchesDictionary[match.red3TeamKey].add(match.matchNumber);
      });

      // Build the PitResultModel models.
      let models = dtoTeams.map((team) => {
        return {
          key: team.key,
          number: team.teamNumber,
          nickname: team.nickname,
          matches: teamMatchesDictionary[team.key],
        } as PitResultModel;
      });

      // Sort.
      models.sort((a, b) => (a.number > b.number ? 1 : 0));

      // Set State.
      setEventTeams(models);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = (teamKey: string) => {
    console.log(teamKey);
    router.push(`/scout-pit/${teamKey}`);
  };

  return (
    <ScrollView>
      {eventTeams.map((team: PitResultModel, index: number) => (
        <SelectTeamRow
          key={index}
          team={team}
          onSelect={() => handleOnSelect(team.key)}
        />
      ))}
    </ScrollView>
  );
}

export default ScoutPitScreen;
