import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import { SectionHeader, AIContentLoader, TeamAvatar } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';

export default async function PowerRankingsPage() {
  const id = process.env.SLEEPER_LEAGUE_ID!;
  const league = await sleeper.getLeague(id);
  const [users, rosters] = await Promise.all([sleeper.getUsers(id), sleeper.getRosters(id)]);
  const standings = buildStandings(rosters, users);
  const week = league.settings?.leg ?? 1;
  return (
    <div>
      <SectionHeader title="Power Rankings" badge={`WEEK ${week}`} />
      {standings.map((t, i) => {
        const mgr = LEAGUE_LORE.managers[t.manager as keyof typeof LEAGUE_LORE.managers];
        return (
          <div key={t.roster_id} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:6,padding:'10px 12px',display:'grid',gridTemplateColumns:'28px 36px 1fr auto',alignItems:'center',gap:10,marginBottom:7 }}>
            <div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:900,color:i<3?'var(--gold)':'var(--muted)',textAlign:'center' }}>{i+1}</div>
            <TeamAvatar team={t} size={34} />
            <div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:14,fontWeight:700 }}>{t.manager}</div>
              <div style={{ fontSize:10,color:'var(--muted)' }}>{t.wins}-{t.losses} · {t.name}</div>
              {mgr && <div style={{ fontSize:9,color:'var(--gold)',fontWeight:600,marginTop:1 }}>{mgr.archetype}</div>}
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:12,color:'var(--gold)' }}>{t.avgPpg.toFixed(1)} ppg</div>
              <div style={{ fontSize:10,color:t.playoffOdds>=60?'#22c55e':t.playoffOdds>=35?'#f59e0b':'#ef4444' }}>{t.playoffOdds}% playoffs</div>
              <div style={{ fontSize:10,color:t.luckScore<0?'#22c55e':'#ef4444' }}>{t.luckScore>0?'+':''}{t.luckScore} luck</div>
            </div>
          </div>
        );
      })}
      <SectionHeader title="Skip's Power Rankings Take" badge="AI" badgeColor="gold" />
      <AIContentLoader type="powerRankings" label="SKIP MORALES — HOT TAKES" personaName="Skip Morales" />
    </div>
  );
}
