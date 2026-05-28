import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import { SectionHeader, AIContentLoader, TeamAvatar } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';

export default async function StandingsPage() {
  const id = process.env.SLEEPER_LEAGUE_ID!;
  const [users, rosters] = await Promise.all([sleeper.getUsers(id), sleeper.getRosters(id)]);
  const standings = buildStandings(rosters, users);
  const cutoff = 6;
  return (
    <div>
      <SectionHeader title="2026 League Standings" />
      <div style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:8,overflow:'hidden',marginBottom:16 }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--bdr)' }}>
              {['RK','MANAGER','TEAM','W-L','PF','PA','DIFF','PPG','LUCK'].map(h => (
                <th key={h} style={{ fontFamily:'var(--font-display)',fontSize:10,fontWeight:700,letterSpacing:'0.7px',color:'var(--muted)',padding:'7px 8px',textAlign:h==='MANAGER'||h==='TEAM'?'left':'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((t, i) => {
              const mgr = LEAGUE_LORE.managers[t.manager as keyof typeof LEAGUE_LORE.managers];
              return (
                <tr key={t.roster_id} style={{ borderTop: i===cutoff?'2px solid var(--gold)':undefined, borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding:'8px 8px',fontFamily:'var(--font-display)',fontSize:16,fontWeight:900,color:i<3?'var(--gold)':'var(--muted)',textAlign:'center' }}>{i+1}</td>
                  <td style={{ padding:'8px 8px' }}>
                    <div style={{ fontSize:12,fontWeight:700,color:'var(--txt)' }}>{t.manager}</div>
                    {mgr && <div style={{ fontSize:9,color:'var(--gold)',fontWeight:600 }}>{mgr.archetype}</div>}
                  </td>
                  <td style={{ padding:'8px 8px' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                      <TeamAvatar team={t} size={24} />
                      <span style={{ fontSize:11,color:'var(--muted)' }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--txt)' }}>{t.wins}-{t.losses}</td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--gold)' }}>{t.pf.toFixed(1)}</td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--muted)' }}>{t.pa.toFixed(1)}</td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:(t.pf-t.pa)>0?'#22c55e':'#ef4444' }}>{(t.pf-t.pa)>0?'+':''}{(t.pf-t.pa).toFixed(1)}</td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--muted)' }}>{t.avgPpg.toFixed(1)}</td>
                  <td style={{ padding:'8px 8px',textAlign:'right',fontFamily:'var(--font-mono)',fontSize:12,color:t.luckScore<0?'#22c55e':t.luckScore>0?'#ef4444':'var(--muted)' }}>{t.luckScore>0?'+':''}{t.luckScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:10,color:'var(--muted)',marginBottom:16 }}>— Gold line = playoff cutoff (top 6) · Luck = actual wins minus expected wins by point differential</div>
      <SectionHeader title="Standings Analysis" badge="AI" badgeColor="gold" />
      <AIContentLoader type="standingsInsight" label="DR. KEVIN PARK — ANALYTICS" personaName="Dr. Kevin Park" />
    </div>
  );
}
