//=================================================================================================
// The Blue Alliance types
//=================================================================================================
export interface TbaEvent {
  key: string;
  name: string;
  short_name: string;
  start_date: string;
  end_date: string;
}

export interface TbaMatch {
  key: string;
  comp_level: string;
  match_number: number;
  predicted_time: number;
  alliances: {
    blue: {
      team_keys: Array<string>;
    };
    red: {
      team_keys: Array<string>;
    };
  };
}

export interface TbaTeam {
  key: string;
  team_number: string;
  name: string;
  nickname: string;
}
