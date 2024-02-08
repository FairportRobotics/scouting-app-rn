import type {
  Event,
  Match,
  Team,
  ItemKey,
  TeamModel,
  MatchModel,
} from "@/constants/Types";
import { Alliance, AllianceTeam } from "@/constants/Enums";

const getTeamModel = (
  event: Event,
  match: Match,
  alliance: string,
  allianceTeam: number,
  teams: Array<Team>,
  sessionKeys: Array<ItemKey>,
  uploadedKeys: Array<ItemKey>
) => {
  // Create a map so it's easier to retrieve the appropriate key.
  const teamKeyMap = {
    [`${Alliance.Blue}${AllianceTeam.One}`]: match.blue1TeamKey,
    [`${Alliance.Blue}${AllianceTeam.Two}`]: match.blue2TeamKey,
    [`${Alliance.Blue}${AllianceTeam.Three}`]: match.blue3TeamKey,
    [`${Alliance.Red}${AllianceTeam.One}`]: match.red1TeamKey,
    [`${Alliance.Red}${AllianceTeam.Two}`]: match.red2TeamKey,
    [`${Alliance.Red}${AllianceTeam.Three}`]: match.red3TeamKey,
  };

  // Obtain the key and lookup the Team.
  const teamKey = teamKeyMap[`${alliance}${allianceTeam}`];
  const team = teams.find((team) => team.key == teamKey);
  if (team === undefined) return undefined;

  const sessionKey = `${event.key}__${match.key}__${alliance}__${allianceTeam}`;
  let teamModel = {
    sessionKey: sessionKey,
    teamKey: team.key,
    teamNumber: team.teamNumber,
    sessionExists: sessionKeys.find((session) => session.key === sessionKey)
      ? true
      : false,
    uploadExists: uploadedKeys.find(
      (uploadedSession) => uploadedSession.key === sessionKey
    )
      ? true
      : false,
  } as TeamModel;

  return teamModel;
};

export default (
  event: Event,
  matches: Array<Match>,
  teams: Array<Team>,
  sessionKeys: Array<ItemKey>,
  uploadedKeys: Array<ItemKey>
) => {
  // Enumerate of the Matches and begin to produce the MatchModel collection.
  let models: Array<MatchModel> = [];
  matches.forEach((match) => {
    let model = {
      eventKey: event.key,
      matchKey: match.key,
      matchNumber: match.matchNumber,
      predictedTime: match.predictedTime,
      alliances: {},
    } as MatchModel;

    model.alliances[Alliance.Blue] = {};
    model.alliances[Alliance.Red] = {};

    model.alliances[Alliance.Blue][AllianceTeam.One] = getTeamModel(
      event,
      match,
      Alliance.Blue,
      AllianceTeam.One,
      teams,
      sessionKeys,
      uploadedKeys
    );
    model.alliances[Alliance.Blue][AllianceTeam.Two] = getTeamModel(
      event,
      match,
      Alliance.Blue,
      AllianceTeam.Two,
      teams,
      sessionKeys,
      uploadedKeys
    );
    model.alliances[Alliance.Blue][AllianceTeam.Three] = getTeamModel(
      event,
      match,
      Alliance.Blue,
      AllianceTeam.Three,
      teams,
      sessionKeys,
      uploadedKeys
    );

    model.alliances[Alliance.Red][AllianceTeam.One] = getTeamModel(
      event,
      match,
      Alliance.Red,
      AllianceTeam.One,
      teams,
      sessionKeys,
      uploadedKeys
    );
    model.alliances[Alliance.Red][AllianceTeam.Two] = getTeamModel(
      event,
      match,
      Alliance.Red,
      AllianceTeam.Two,
      teams,
      sessionKeys,
      uploadedKeys
    );
    model.alliances[Alliance.Red][AllianceTeam.Three] = getTeamModel(
      event,
      match,
      Alliance.Red,
      AllianceTeam.Three,
      teams,
      sessionKeys,
      uploadedKeys
    );

    models.push(model);
  });

  return models;
};
