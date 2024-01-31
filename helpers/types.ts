export interface EventDto {
  key: string;
  name: string;
  shortName: string;
  startDate: Date;
  endDate: Date;
}

export class Event {
  key: string;
  name: string;
  shortName: string;
  startDate: Date;
  endDate: Date;

  constructor(
    key: string,
    name: string,
    shortName: string,
    startDate: Date,
    endDate: Date
  ) {
    this.key = key;
    this.name = name;
    this.shortName = shortName;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static fromDto(dto: EventDto) {
    return new Event(
      dto.key,
      dto.name,
      dto.shortName,
      dto.startDate,
      dto.endDate
    );
  }

  static fromDtos(dtos: Array<EventDto>) {
    return dtos.map((dto) => {
      return Event.fromDto(dto);
    });
  }
}

export interface MatchDto {
  key: string;
  matchNumber: number;
  predictedTime: string;
  blueTeams: string;
  redTeams: string;
}

export class Match {
  key: string;
  matchNumber: number;
  predictedTime: Date;
  blueTeams: Record<number, string>;
  redTeams: Record<number, string>;

  constructor(
    key: string,
    matchNumber: number,
    predictedTime: Date,
    blueTeams: string,
    redTeams: string
  ) {
    this.key = key;
    this.matchNumber = matchNumber;
    this.predictedTime = new Date(predictedTime);

    this.blueTeams = Match.getDictionaryFromString(blueTeams);
    this.redTeams = Match.getDictionaryFromString(redTeams);
  }

  static getDictionaryFromString(value: string) {
    let array = JSON.parse(value);
    let dictionary: Record<number, string> = {};

    array.forEach((item: string, index: number) => {
      dictionary[index + 1] = item;
    });

    return dictionary;
  }

  static fromDto(dto: MatchDto) {
    return new Match(
      dto.key,
      dto.matchNumber,
      new Date(dto.predictedTime),
      dto.blueTeams,
      dto.redTeams
    );
  }

  static fromDtos(dtos: Array<MatchDto>) {
    return dtos.map((dto) => {
      return Match.fromDto(dto);
    });
  }
}

export interface TeamDto {
  key: string;
  teamNumber: string;
  name: string;
  nickname: string;
}

export class Team {
  key: string;
  teamNumber: string;
  name: string;
  nickname: string;

  constructor(key: string, teamNumber: string, name: string, nickname: string) {
    this.key = key;
    this.teamNumber = teamNumber;
    this.name = name;
    this.nickname = nickname;
  }

  static fromDto(dto: TeamDto) {
    return new Team(dto.key, dto.teamNumber, dto.name, dto.nickname);
  }

  static fromDtos(dtos: Array<TeamDto>) {
    return dtos.map((dto) => {
      return Team.fromDto(dto);
    });
  }
}
