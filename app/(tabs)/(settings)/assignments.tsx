import { useEffect, useState } from "react";
import { View, Text, Button, Pressable } from "react-native";
import {
  Event,
  Match,
  MatchAssignment,
  MatchModel,
  Team,
  TeamMember,
} from "@/constants/Types";
import * as Database from "@/app/helpers/database";
import getMatchSelectModels from "@/app/helpers/getMatchSelectModels";
import { ContainerGroup } from "@/app/components";
import Colors from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { Alliance, AllianceTeam } from "@/constants/Enums";

type TeamMemberSummary = {
  key: string;
  firstName: string;
  lastName: string;
  assignmentCount: number;
};

type SessionModel = {
  alliance: string;
  allianceTeam: number;
  teamNumber: number;
  teamMemberKey: string;
};

type AssignmentModel = {
  eventKey: string;
  matchKey: string;
  matchNumber: number;
  sessions: Record<string, SessionModel>;
};

export default function Assignments() {
  const [teamMembers, setTeamMembers] = useState<Array<TeamMemberSummary>>([]);
  const [teamMember, setTeamMember] = useState<TeamMemberSummary>();
  const [matchModels, setMatchModels] = useState<Array<MatchModel>>([]);
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(true);

  const loadData = async () => {
    try {
      // Retrieve data.
      Promise.all([
        Database.getEvent() as Promise<Event>,
        Database.getMatches() as Promise<Array<Match>>,
        Database.getScoutTeamMembers() as Promise<Array<TeamMember>>,
        Database.getMatchAssignments() as Promise<Array<MatchAssignment>>,
      ])
        .then(([dtoEvent, dtoMatches, dtoTeamMembers, dtoAssignments]) => {
          // Initialize the list of AssignementModel.
          let assignmentModels: Array<AssignmentModel> = [];
          dtoMatches.forEach((match) => {
            let assignment = {
              eventKey: dtoEvent.key,
              matchKey: match.key,
              matchNumber: match.matchNumber,
              sessions: {},
            } as AssignmentModel;

            let key = `${dtoEvent.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.One}`;
            let sessionModel = {
              alliance: Alliance.Blue,
              allianceTeam: AllianceTeam.One,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            key = `${dtoEvent.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.Two}`;
            sessionModel = {
              alliance: Alliance.Blue,
              allianceTeam: AllianceTeam.Two,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            key = `${dtoEvent.key}__${match.key}__${Alliance.Blue}__${AllianceTeam.Three}`;
            sessionModel = {
              alliance: Alliance.Blue,
              allianceTeam: AllianceTeam.Three,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            key = `${dtoEvent.key}__${match.key}__${Alliance.Red}__${AllianceTeam.One}`;
            sessionModel = {
              alliance: Alliance.Red,
              allianceTeam: AllianceTeam.One,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            key = `${dtoEvent.key}__${match.key}__${Alliance.Red}__${AllianceTeam.Two}`;
            sessionModel = {
              alliance: Alliance.Red,
              allianceTeam: AllianceTeam.Two,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            key = `${dtoEvent.key}__${match.key}__${Alliance.Red}__${AllianceTeam.Three}`;
            sessionModel = {
              alliance: Alliance.Red,
              allianceTeam: AllianceTeam.Three,
              teamNumber: 0,
              teamMemberKey: "",
            } as SessionModel;
            assignment.sessions[key] = sessionModel;

            assignmentModels.push(assignment);
          });

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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelectTeamMember = async (teamMember: TeamMemberSummary) => {
    setTeamMember(teamMember);
    setShowTeamMembers(false);
  };

  const handleToggleShowTeamMembers = () => {
    setShowTeamMembers(!showTeamMembers);
  };

  type TeamMemberItemProps = { teamMember: TeamMemberSummary };
  const TeamMemberItem = ({ teamMember }: TeamMemberItemProps) => {
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

  const renderMatchItem = (matchModel: MatchModel) => {
    if (matchModel.matchNumber === 0) return <></>;
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.appBackground,
          paddingHorizontal: 5,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ width: 100 }}>
          <Text>Match {matchModel.matchNumber}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable>
            <View>
              <Text>1</Text>
              <Text>
                {
                  matchModel.alliances[Alliance.Blue][AllianceTeam.One]
                    ?.teamNumber
                }
              </Text>
              <Text>John H.</Text>
            </View>
          </Pressable>
          <Pressable>
            <View>
              <Text>Blue 2</Text>
            </View>
          </Pressable>
          <Pressable>
            <View>
              <Text>Blue 3</Text>
            </View>
          </Pressable>
          <Pressable>
            <View>
              <Text>Red 1</Text>
            </View>
          </Pressable>
          <Pressable>
            <View>
              <Text>Red 2</Text>
            </View>
          </Pressable>
          <Pressable>
            <View>
              <Text>Red 3</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ContainerGroup
        title={`Assign Matches to ${teamMember?.firstName} ${teamMember?.lastName}`}
      >
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
              renderItem={({ item }) => <TeamMemberItem teamMember={item} />}
              keyExtractor={(item) => item.key}
              style={{ marginBottom: 100 }}
            />
          )}
        </View>
        {teamMember && (
          <FlatList
            style={{ width: "100%" }}
            data={matchModels}
            renderItem={({ item }) => renderMatchItem(item)}
            keyExtractor={(item) => item.matchNumber.toString()}
          />
        )}
      </ContainerGroup>
    </View>
  );
}
