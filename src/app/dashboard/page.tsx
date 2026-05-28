import { sleeper } from '@/lib/sleeper';
import { buildStandings, detectStorylines } from '@/lib/standings';
import { SectionHeader, StatCard, AIContentLoader, MatchupCard } from '@/components/ui';
import type { MatchupPair } from '@/types';

export default async function DashboardPage() {
  const id = process.env.SLEEPER_LEAGUE_ID!;
  const season = process.env.SLEEPER_SEASON ?? '2026';
  const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
  const week = league.settings?.leg ?? 1;
  const standings = buildStandings(rosters, users);
  let matchups: MatchupPair[] = [];
  try {
    const raw = await sleeper.getMatchups(id, week);
    const groups = new Map<number, typeof raw>();
    raw.forEach(m => { if (!groups.has(m.matchup_id)) groups.set(m.matchup_id, []); groups.get(m.matchup_id)!.push(m); });
    const rMap = new Map(standings.map(s => [s.roster_id, s]));
    groups.forEach((members, mid) => {
      if (members.length !== 2) return;
      const [a, b] = members;
      const ta = rMap.get(a.roster_id), tb = rMap.get(b.roster_id);
      if (ta && tb) matchups.push({ matchup_id: mid, teamA: ta, teamB: tb, scoreA: a.points??0, scoreB: b.points??0, projA: ta.avgPpg, projB: tb.avgPpg, tags: detectStorylines(ta, tb), isLive: (a.points??0)>0 });
    });
  } catch {}
  const top = standings[0], bot = standings[standings.length-1];
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,rgba(0,31,91,0.6),rgba(31,45,66,0.4))', border: '1px solid var(--bdr)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: 2, marginBottom: 4 }}>HOOSIERS LLC — {season} SEASON</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900 }}>Week {week} Coverage</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Named after the Media LLC at IU · Est. 2023 · 12 teams · Keeper format</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
        <StatCard label="Defending Champion" value="AJWARE" sub="2025 Hoosiers LLC Champion" />
        <StatCard label="Current Week" value={String(week)} sub={`of ${league.settings?.playoff_week_start ?? 14} regular season`} variant="warn" />
        <StatCard label="Best Record, No Ring" value="jonE4" sub="Best all-time W% · 0 championships" variant="bad" />
      </div>
      <SectionHeader title={`Week ${week} Matchups`} />
      {matchups.slice(0,3).map(mp => <MatchupCard key={mp.matchup_id} mp={mp} />)}
      {matchups.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13, padding: '12px 0' }}>Matchup data not yet available for this week.</div>}
      <SectionHeader title="Top Story" badge="AI" badgeColor="gold" />
      <AIContentLoader type="topStory" label="FIN ANALYSIS" personaName="Michelle Carter" />
    </div>
  );
}
