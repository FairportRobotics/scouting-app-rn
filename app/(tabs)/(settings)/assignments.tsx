import { useEffect, useState } from "react";
import { View, Text, Button, Pressable, TouchableOpacity } from "react-native";
import { Event, Match, MatchAssignment, TeamMember } from "@/constants/Types";
import { FlatList } from "react-native-gesture-handler";
import { ContainerGroup } from "@/app/components";
import { Alliance, AllianceTeam } from "@/constants/Enums";
import * as Database from "@/app/helpers/database";
import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import { all } from "axios";

type TeamMemberSummary = {
  key: string;
  firstName: string;
  lastName: string;
  assignmentCount: number;
};

export default function Assignments() {
  const [event, setEvent] = useState<Event>();
  const [eventMatches, setEventMatches] = useState<Array<Match>>([]);
  const [teamMembers, setTeamMembers] = useState<Array<TeamMemberSummary>>([]);
  const [assignmentsLookup, setAssignmentsLookup] = useState<
    Record<string, string>
  >({});
  const [teamMember, setTeamMember] = useState<TeamMemberSummary>();
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(true);

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
          setAssignmentsLookup(assignmentsLookup);

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

  useEffect(() => {
    loadData();
  }, []);

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
    requestAnimationFrame(() => {
      if (teamMember === undefined) return;

      // Build the session key.
      const sessionKey = `${event?.key}__${matchKey}_${alliance}__${allianceNumber}`;

      // If the key is already associated with the team member, remove the mapping,
      // otherwise, create the mapping.

      Database.saveMatchAssignment(sessionKey, teamMember.key);

      let newAssignments = { ...assignmentsLookup };
      newAssignments[
        sessionKey
      ] = `${teamMember.firstName} ${teamMember.lastName[0]}`;
      setAssignmentsLookup(newAssignments);
    });
  };

  const assignmentLookup = (sessionKey: string) => {
    return assignmentsLookup[sessionKey];
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

  const renderEventMatch = (match: Match) => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{}}>
          <Text style={{ width: 90, fontSize: 20 }}>
            Match {match.matchNumber}
          </Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", gap: 8, marginBottom: 10 }}
        >
          {renderEventMatchTeam(
            match.key,
            Alliance.Blue,
            AllianceTeam.One,
            match.blue1TeamKey
          )}
          {renderEventMatchTeam(
            match.key,
            Alliance.Blue,
            AllianceTeam.Two,
            match.blue2TeamKey
          )}
          {renderEventMatchTeam(
            match.key,
            Alliance.Blue,
            AllianceTeam.Three,
            match.blue3TeamKey
          )}
          {renderEventMatchTeam(
            match.key,
            Alliance.Red,
            AllianceTeam.One,
            match.red1TeamKey
          )}
          {renderEventMatchTeam(
            match.key,
            Alliance.Red,
            AllianceTeam.Two,
            match.red2TeamKey
          )}
          {renderEventMatchTeam(
            match.key,
            Alliance.Red,
            AllianceTeam.Three,
            match.red3TeamKey
          )}
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
          data={eventMatches}
          renderItem={({ item }) => renderEventMatch(item)}
          keyExtractor={(item) => item.key}
        />
      </ContainerGroup>
    </View>
  );
}
