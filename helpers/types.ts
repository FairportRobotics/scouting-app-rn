export interface Event {
  key: string;
  name: string;
  shortName: string;
  startDate: Date;
  endDate: Date;
  city: string;
  stateProv: string;
}

export interface Match {
  key: string;
  matchNumber: number;
  predictedTime: Date;
  blueTeams: Array<string>;
  redTeams: Array<string>;
}

export interface Team {
  key: string;
  teamNumber: string;
  name: string;
  nickname: string;
  schoolName: string;
  city: string;
  stateProv: string;
}
