import { useEffect, useState } from "react";
import { View, Text, Button, Pressable } from "react-native";
import { Event, Match, MatchAssignment, TeamMember } from "@/constants/Types";
import { FlatList } from "react-native-gesture-handler";
import { ContainerGroup } from "@/app/components";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import * as Database from "@/app/helpers/database";
import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";

type TeamMemberSummary = {
  key: string;
  firstName: string;
  lastName: string;
  assignmentCount: number;
};

type TeamSelectItem = {
  key: string;
  alliance: string;
  allianceTeam: number;
  teamNumber: string;
  assignedTo: string;
};

type MatchRow = {
  key: string;
  matchNumber: number;
  teamSelections: Array<TeamSelectItem>;
};

export default function Assignments() {
  const [event, setEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const [teamMembers, setTeamMembers] = useState<Array<TeamMemberSummary>>([]);
  const [teamMember, setTeamMember] = useState<TeamMemberSummary>();
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(true);

  const [matchRows, setMatchRows] = useState<Array<MatchRow>>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildMatchRows();
  }, [assignments]);

  const loadData = async () => {
    console.log("loadData started  :", new Date().toISOString());
    try {
      // Retrieve data.
      Promise.all([
        Database.getEvent() as Promise<Event>,
        Database.getMatches() as Promise<Array<Match>>,
        Database.getScoutTeamMembers() as Promise<Array<TeamMember>>,
        Database.getMatchAssignments() as Promise<Array<MatchAssignment>>,
      ])
        .then(([dtoEvent, dtoMatches, dtoTeamMembers, dtoAssignments]) => {
          setEvent(dtoEvent);
          setEventMatches(dtoMatches);

          let assignmentsLookup: Record<string, string> = {};
          dtoAssignments.forEach((assignment) => {
            let teamMemberName = "(Unknown)";
            let teamMember = dtoTeamMembers.find(
              (teamMember) => teamMember.key === assignment.teamMemberKey
            );
            if (teamMember !== undefined)
              teamMemberName = `${teamMember.firstName} ${teamMember.lastName[0]}`;
            assignmentsLookup[assignment.key] = teamMemberName;
          });
          setAssignments(assignmentsLookup);

          // Build the list of Team Members and the number of assignments they are currently bound to.
          let summary: Array<TeamMemberSummary> = [];
          dtoTeamMembers.forEach((teamMember) => {
            let tms = {
              key: teamMember.key,
              firstName: teamMember.firstName,
              lastName: teamMember.lastName,
              assignmentCount: dtoAssignments.filter(
                (assignment) => assignment.teamMemberKey === teamMember.key
              ).length,
            } as TeamMemberSummary;

            summary.push(tms);
          });

          summary.sort((a, b) => a.key.localeCompare(b.key));
          setTeamMembers(summary);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
    console.log("loadData completed:", new Date().toISOString());
  };

  const buildMatchRows = () => {
    // Enumerate over the Macthes and begin to define the MatchRow collection.
    let matchRows: Array<MatchRow> = [];
    //let selectors: Record<string, TeamSelectItem> = {};

    eventMatches.forEach((match) => {
      let matchRow = {
        key: match.key,
        matchNumber: match.matchNumber,
        teamSelections: new Array<TeamSelectItem>(),
      } as MatchRow;

      let sessionKey: string;
      let teamItem: TeamSelectItem;

      // Blue / 1
      sessionKey = `${event?.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.One}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Blue,
        allianceTeam: AllianceTeam.One,
        teamNumber: match.blue1TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Blue / 2
      sessionKey = `${event?.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.Two}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Blue,
        allianceTeam: AllianceTeam.Two,
        teamNumber: match.blue2TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Blue / 3
      sessionKey = `${event?.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.Three}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Blue,
        allianceTeam: AllianceTeam.Three,
        teamNumber: match.blue3TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Red / 1
      sessionKey = `${event?.key}__${match.key}__${Alliance.Red}__${AllianceTeam.One}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Red,
        allianceTeam: AllianceTeam.One,
        teamNumber: match.red1TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Red / 2
      sessionKey = `${event?.key}__${match.key}__${Alliance.Red}__${AllianceTeam.Two}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Red,
        allianceTeam: AllianceTeam.Two,
        teamNumber: match.red2TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Red / 3
      sessionKey = `${event?.key}__${match.key}__${Alliance.Red}__${AllianceTeam.Three}`;
      teamItem = {
        key: sessionKey,
        alliance: Alliance.Red,
        allianceTeam: AllianceTeam.Three,
        teamNumber: match.red3TeamKey.replace("frc", ""),
        assignedTo: assignments[sessionKey],
      } as TeamSelectItem;
      matchRow.teamSelections.push(teamItem);
      //selectors[teamItem.key] = teamItem;

      // Add the MatchRow to the collection.
      matchRows.push(matchRow);
    });

    setMatchRows(matchRows);
  };

  const handleOnSelectTeamMember = async (teamMember: TeamMemberSummary) => {
    console.log(
      "handleOnSelectTeamMember started  :",
      new Date().toISOString()
    );
    setTeamMember(teamMember);
    setShowTeamMembers(false);
    console.log(
      "handleOnSelectTeamMember completed:",
      new Date().toISOString()
    );
  };

  const handleToggleShowTeamMembers = async () => {
    console.log(
      "handleToggleShowTeamMembers started  :",
      new Date().toISOString()
    );
    await loadData();
    setShowTeamMembers(!showTeamMembers);
    console.log(
      "handleToggleShowTeamMembers completed:",
      new Date().toISOString()
    );
  };

  const handleOnPress = async (
    matchKey: string,
    alliance: string,
    allianceNumber: number
  ) => {
    console.log(
      "handleOnPress",
      new Date().toISOString(),
      matchKey,
      alliance,
      allianceNumber
    );
    requestAnimationFrame(() => {
      if (teamMember === undefined) return;

      // Build the session key.
      const sessionKey = `${event?.key}__${matchKey}_${alliance}__${allianceNumber}`;

      // If the key is already associated with the team member, remove the mapping,
      // otherwise, create the mapping.

      Database.saveMatchAssignment(sessionKey, teamMember.key);

      let newAssignments = { ...assignments };
      newAssignments[
        sessionKey
      ] = `${teamMember.firstName} ${teamMember.lastName[0]}`;
      setAssignments(newAssignments);
    });
    console.log("handleOnPress", new Date().toISOString());
  };

  const assignmentLookup = (sessionKey: string) => {
    return assignments[sessionKey];
  };

  const renderTeamMember = (teamMember: TeamMemberSummary) => {
    return (
      <Pressable
        onPress={() => handleOnSelectTeamMember(teamMember)}
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          backgroundColor: Colors.appBackground,
          padding: 20,
          marginVertical: 5,
          justifyContent: "space-between",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 20 }}>
          {teamMember.firstName} {teamMember.lastName}
        </Text>
        <Text style={{ fontSize: 20 }}>{teamMember.assignmentCount ?? 0}</Text>
      </Pressable>
    );
  };

  const renderEventMatchTeam = (
    matchKey: string,
    alliance: string,
    allianceNumber: number,
    teamKey: string
  ) => {
    const sessionKey = `${event?.key}__${matchKey}_${alliance}__${allianceNumber}`;
    const assignedTeamMember = assignmentLookup(sessionKey);
    const opacity = assignedTeamMember === undefined ? 1.0 : 0.6;

    return (
      <Pressable
        onPress={() => handleOnPress(matchKey, alliance, allianceNumber)}
        style={{ flex: 1 }}
      >
        <View
          style={[
            alliance === Alliance.Blue
              ? Styles.allianceBlueButton
              : Styles.allianceRedButton,
            {
              flex: 1,
              width: "100%",
              height: 80,
              flexDirection: "column",
              opacity: opacity,
            },
          ]}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {allianceNumber}
          </Text>
          <Text style={{ color: "white" }}>{teamKey.replace("frc", "")}</Text>
          <Text style={{ color: "white" }}>
            {assignedTeamMember ?? "(Unassigned)"}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderEventMatch = (match: MatchRow) => {
    if (match.matchNumber === 0) return <></>;

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{}}>
          <Text style={{ width: 90, fontSize: 20 }}>
            Match {match.matchNumber}
          </Text>
        </View>
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            contentContainerStyle={{
              flex: 1,
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            data={match.teamSelections}
            horizontal={true}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "blue",
                }}
              >
                <Text style={{ backgroundColor: "plum" }}>
                  {item.allianceTeam}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ContainerGroup
        title={`Assign Matches to ${teamMember?.firstName} ${teamMember?.lastName}`}
      >
        <Text>
          Approximately{" "}
          {Math.floor((eventMatches.length * 6) / teamMembers.length)} Matches
          per Team Member
        </Text>
        <View>
          <Button
            title={
              showTeamMembers ? "Hide team members" : "Select a team member"
            }
            onPress={() => handleToggleShowTeamMembers()}
          />
          {showTeamMembers && (
            <FlatList
              data={teamMembers}
              renderItem={({ item }) => renderTeamMember(item)}
              keyExtractor={(item) => item.key}
              style={{ marginBottom: 100 }}
            />
          )}
        </View>
        <FlatList
          style={{ width: "100%" }}
          data={matchRows}
          renderItem={({ item }) => renderEventMatch(item)}
          keyExtractor={(item) => item.key}
        />
      </ContainerGroup>
    </View>
  );
}
