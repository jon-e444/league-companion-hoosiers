import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import type { SleeperBracketMatch } from '@/lib/sleeper';

export interface SeasonRecord {
  season: string; leagueId: string;
  wins: number; losses: number; pf: number; pa: number;
  playoffFinish: string | null; made_playoffs: boolean;
}

export interface FranchiseHistory {
  ownerId: string; managerName: string;
  currentTeamName: string; teamNames: string[];
  seasons: SeasonRecord[];
  allTimeWins: number; allTimeLosses: number;
  championships: number; playoffAppearances: number;
  bestFinish: string; avgPpg: number;
  isDynasty: boolean; isCursed: boolean;
  isConsistent: boolean; isRebuild: boolean;
}

export interface LeagueHistoryData {
  franchises: FranchiseHistory[];
  allTimeChampions: { season: string; managerName: string; teamName: string }[];
  seasons: string[];
}

export async function buildLeagueHistory(currentLeagueId: string): Promise<LeagueHistoryData> {
  const allSeasons = await sleeper.getLeagueHistory(currentLeagueId);
  const franchiseMap = new Map<string, FranchiseHistory>();
  const champions: LeagueHistoryData['allTimeChampions'] = [];

  for (const league of allSeasons) {
    const lid = league.league_id;
    const season = league.season;
    try {
      const [users, rosters] = await Promise.all([sleeper.getUsers(lid), sleeper.getRosters(lid)]);
      const standings = buildStandings(rosters, users);
      let bracket: SleeperBracketMatch[] = [];
      try { bracket = await sleeper.getWinnersBracket(lid); } catch {}

      const finishMap = new Map<number, string>();
      if (bracket.length > 0) {
        const maxRound = Math.max(...bracket.map(m => m.r));
        bracket.forEach(m => {
          if (m.r === maxRound) { if (m.w) finishMap.set(m.w, 'champion'); if (m.l) finishMap.set(m.l, 'runner-up'); }
          if (m.r === maxRound - 1 && m.l && !finishMap.has(m.l)) finishMap.set(m.l, 'semifinal');
          if (m.r === maxRound - 2 && m.l && !finishMap.has(m.l)) finishMap.set(m.l, 'quarterfinal');
        });
      }

      const playoffSpots = league.settings?.playoff_teams ?? 6;
      const playoffSet = new Set(standings.slice(0, playoffSpots).map(t => t.roster_id));

      standings.forEach(t => {
        if (!t.owner_id) return;
        const madePlayoffs = playoffSet.has(t.roster_id);
        const finish = finishMap.get(t.roster_id) ?? (madePlayoffs ? 'quarterfinal' : 'missed');
        const record: SeasonRecord = { season, leagueId: lid, wins: t.wins, losses: t.losses, pf: t.pf, pa: t.pa, playoffFinish: finish, made_playoffs: madePlayoffs };

        const existing = franchiseMap.get(t.owner_id);
        if (existing) {
          existing.seasons.push(record);
          if (!existing.teamNames.includes(t.name)) existing.teamNames.push(t.name);
          existing.currentTeamName = t.name;
        } else {
          franchiseMap.set(t.owner_id, { ownerId: t.owner_id, managerName: t.manager, currentTeamName: t.name, teamNames: [t.name], seasons: [record], allTimeWins: 0, allTimeLosses: 0, championships: 0, playoffAppearances: 0, bestFinish: 'missed', avgPpg: 0, isDynasty: false, isCursed: false, isConsistent: false, isRebuild: false });
        }
        if (finish === 'champion') champions.push({ season, managerName: t.manager, teamName: t.name });
      });
    } catch (e) { console.warn(`History: could not load ${season}`, e); }
  }

  const franchises = Array.from(franchiseMap.values()).map(f => {
    f.seasons.sort((a, b) => parseInt(a.season) - parseInt(b.season));
    f.allTimeWins = f.seasons.reduce((s, r) => s + r.wins, 0);
    f.allTimeLosses = f.seasons.reduce((s, r) => s + r.losses, 0);
    f.championships = f.seasons.filter(r => r.playoffFinish === 'champion').length;
    f.playoffAppearances = f.seasons.filter(r => r.made_playoffs).length;
    const totalGames = f.seasons.reduce((s, r) => s + r.wins + r.losses, 0);
    f.avgPpg = totalGames > 0 ? f.seasons.reduce((s, r) => s + r.pf, 0) / totalGames : 0;
    const order = ['champion','runner-up','semifinal','quarterfinal','missed'];
    const allFinishes = f.seasons.map(r => r.playoffFinish ?? 'missed');
    f.bestFinish = order.find(o => allFinishes.includes(o)) ?? 'missed';
    f.isDynasty = f.championships >= 2 || (f.championships >= 1 && f.playoffAppearances >= 3);
    f.isCursed = f.seasons.filter(r => r.playoffFinish === 'runner-up').length >= 2;
    f.isConsistent = f.seasons.length >= 2 && f.seasons.every(r => r.made_playoffs);
    f.isRebuild = f.seasons.length >= 2 && !f.seasons[f.seasons.length-1]?.made_playoffs && f.playoffAppearances >= 1;
    return f;
  });

  return { franchises, allTimeChampions: champions.sort((a,b) => parseInt(b.season)-parseInt(a.season)), seasons: allSeasons.map(l => l.season).sort((a,b) => parseInt(b)-parseInt(a)) };
}
