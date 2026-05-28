import type { SleeperLeague, SleeperUser, SleeperRoster, SleeperMatchup, SleeperTransaction } from '@/types';

const BASE = 'https://api.sleeper.app/v1';

async function get<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`Sleeper ${res.status}: ${path}`);
  return res.json();
}

export interface SleeperBracketMatch { r: number; m: number; t1: number; t2: number; w: number; l: number; }
export interface SleeperDraft { draft_id: string; league_id: string; season: string; type: string; status: string; }
export interface SleeperDraftPick { round: number; roster_id: number; player_id: string; picked_by: string; metadata: { first_name: string; last_name: string; position: string; team: string; }; is_keeper: boolean | null; }

async function getLeagueHistory(currentId: string): Promise<SleeperLeague[]> {
  const seasons: SleeperLeague[] = [];
  let id: string | null = currentId;
  let safety = 0;
  while (id && safety < 8) {
    try {
      const fetched: SleeperLeague = await get<SleeperLeague>(`/league/${id}`, 3600);
      seasons.push(fetched);
      id = fetched.previous_league_id ?? null;
      safety++;
    } catch { break; }
  }
  return seasons;
}

export const sleeper = {
  getLeague:         (id: string) => get<SleeperLeague>(`/league/${id}`),
  getUsers:          (id: string) => get<SleeperUser[]>(`/league/${id}/users`),
  getRosters:        (id: string) => get<SleeperRoster[]>(`/league/${id}/rosters`),
  getMatchups:       (id: string, week: number) => get<SleeperMatchup[]>(`/league/${id}/matchups/${week}`),
  getTransactions:   (id: string, week: number) => get<SleeperTransaction[]>(`/league/${id}/transactions/${week}`),
  getWinnersBracket: (id: string) => get<SleeperBracketMatch[]>(`/league/${id}/winners_bracket`),
  getDrafts:         (id: string) => get<SleeperDraft[]>(`/league/${id}/drafts`),
  getDraftPicks:     (draftId: string) => get<SleeperDraftPick[]>(`/draft/${draftId}/picks`),
  getLeagueHistory,
};
