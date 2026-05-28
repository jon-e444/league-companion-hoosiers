import { NextResponse } from 'next/server';
import { sleeper } from '@/lib/sleeper';
import { buildStandings, detectStorylines } from '@/lib/standings';
import type { MatchupPair } from '@/types';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
    const week = parseInt(searchParams.get('week') ?? String(league.settings?.leg ?? 1));
    const raw = await sleeper.getMatchups(id, week);
    const standings = buildStandings(rosters, users);
    const rMap = new Map(standings.map(s => [s.roster_id, s]));
    const groups = new Map<number, typeof raw>();
    raw.forEach(m => { if (!groups.has(m.matchup_id)) groups.set(m.matchup_id, []); groups.get(m.matchup_id)!.push(m); });
    const pairs: MatchupPair[] = [];
    groups.forEach((members, mid) => {
      if (members.length !== 2) return;
      const [a, b] = members;
      const ta = rMap.get(a.roster_id), tb = rMap.get(b.roster_id);
      if (!ta || !tb) return;
      const sa = a.points ?? 0, sb = b.points ?? 0;
      pairs.push({ matchup_id: mid, teamA: ta, teamB: tb, scoreA: sa, scoreB: sb, projA: sa > 0 ? sa * 1.1 : ta.avgPpg, projB: sb > 0 ? sb * 1.1 : tb.avgPpg, tags: detectStorylines(ta, tb), isLive: sa > 0 || sb > 0 });
    });
    return NextResponse.json({ matchups: pairs, week });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
