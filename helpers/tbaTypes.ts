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
  match_number: number;
  comp_level: string;
  predicted_time: number;
  alliances: {
    blue: {
      team_keys: [string];
    };
    red: {
      team_keys: [string];
    };
  };
}

export interface TbaTeam {
  key: string;
  team_number: string;
  name: string;
  nickname: string;
}
