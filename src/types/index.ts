export interface SleeperLeague {
  league_id: string; name: string; season: string; status: string;
  previous_league_id?: string;
  settings: { num_teams: number; playoff_week_start: number; leg: number; playoff_teams: number; };
  scoring_settings: Record<string, number>;
  roster_positions: string[];
}
export interface SleeperUser {
  user_id: string; display_name: string; avatar: string | null;
  metadata: { team_name?: string };
}
export interface SleeperRoster {
  roster_id: number; owner_id: string; league_id: string;
  players: string[] | null; starters: string[] | null;
  settings: { wins: number; losses: number; ties: number; fpts: number; fpts_decimal: number; fpts_against: number; fpts_against_decimal: number; waiver_position: number; total_moves: number; };
}
export interface SleeperMatchup {
  roster_id: number; matchup_id: number; points: number;
  players: string[]; starters: string[]; players_points: Record<string, number>;
}
export interface SleeperTransaction {
  transaction_id: string; type: 'trade'|'waiver'|'free_agent';
  status: string; roster_ids: number[];
  adds: Record<string,number>|null; drops: Record<string,number>|null;
  draft_picks: unknown[]; created: number;
  settings: Record<string,unknown>|null;
}
export interface TeamStanding {
  roster_id: number; owner_id: string; name: string; manager: string;
  wins: number; losses: number; ties: number; pf: number; pa: number;
  rank: number; colors: [string,string]; initials: string;
  streak: string; playoffOdds: number; luckScore: number; avgPpg: number;
}
export interface MatchupPair {
  matchup_id: number; teamA: TeamStanding; teamB: TeamStanding;
  scoreA: number; scoreB: number; projA: number; projB: number;
  tags: StorylineTag[]; isLive: boolean;
}
export type StorylineTag = 'upset'|'dynasty'|'collapse'|'fraud'|'revenge'|'destiny'|'hot-streak'|'bad-beat'|'rivalry';
export interface PersonaConfig {
  id: string; name: string; role: string; icon: string;
  colorClass: string; catchphrase: string; systemPrompt: string;
}
