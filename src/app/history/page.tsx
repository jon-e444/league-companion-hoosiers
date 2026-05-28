import { buildLeagueHistory } from '@/lib/history';
import { SectionHeader, AIContentLoader } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';

export default async function HistoryPage() {
  let history = null;
  try {
    history = await buildLeagueHistory(process.env.SLEEPER_LEAGUE_ID!);
  } catch {}

  const finishEmoji: Record<string,string> = { champion:'🏆', 'runner-up':'🥈', semifinal:'🥉', quarterfinal:'4️⃣', missed:'❌' };

  return (
    <div>
      <SectionHeader title="Hoosiers LLC History" badge={history ? `${history.seasons.length} SEASONS` : 'ARCHIVE'} />

      {/* League origin story */}
      <div style={{ background:'linear-gradient(135deg,rgba(0,31,91,0.6),rgba(31,45,66,0.4))',border:'1px solid var(--bdr)',borderRadius:8,padding:'14px 16px',marginBottom:16 }}>
        <div style={{ fontFamily:'var(--font-display)',fontSize:12,fontWeight:700,color:'var(--gold)',letterSpacing:2,marginBottom:6 }}>THE ORIGIN</div>
        <div style={{ fontSize:13,lineHeight:1.65,color:'var(--txt)' }}>{LEAGUE_LORE.founded}</div>
      </div>

      {/* Championship roll */}
      <SectionHeader title="Championship History" />
      <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:20 }}>
        {LEAGUE_LORE.championships.map(c => (
          <div key={c.season} style={{ background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.3)',borderRadius:6,padding:'10px 16px',textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)',fontSize:22,fontWeight:900,color:'var(--gold)' }}>{c.season}</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:16,fontWeight:700 }}>{c.winner}</div>
            <div style={{ fontSize:10,color:'var(--muted)',marginTop:2,maxWidth:160 }}>{c.notes}</div>
          </div>
        ))}
      </div>

      {/* State of the league AI */}
      <SectionHeader title="State of the League" badge="AI" badgeColor="gold" />
      <AIContentLoader type="historyPage" label="MICHELLE CARTER — HOOSIERS LLC RETROSPECTIVE" personaName="Michelle Carter" />

      {/* 2025 Final standings */}
      <SectionHeader title="2025 Final Standings" />
      <div style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:8,overflow:'hidden',marginBottom:20 }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--bdr)' }}>
              {['RANK','MANAGER','NOTES'].map(h=><th key={h} style={{ fontFamily:'var(--font-display)',fontSize:10,fontWeight:700,letterSpacing:'0.7px',color:'var(--muted)',padding:'7px 10px',textAlign:h==='RANK'?'center':'left' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {LEAGUE_LORE.standings2025.map(s => (
              <tr key={s.rank} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', background:s.rank<=6?'rgba(34,197,94,0.03)':'transparent' }}>
                <td style={{ padding:'9px 10px',textAlign:'center',fontFamily:'var(--font-display)',fontSize:18,fontWeight:900,color:s.rank===1?'var(--gold)':s.rank<=3?'#a8b0bc':'var(--muted)' }}>{s.rank}</td>
                <td style={{ padding:'9px 10px',fontWeight:700,color:'var(--txt)',fontSize:12 }}>
                  {s.manager}
                  {LEAGUE_LORE.championships.some(c=>c.winner===s.manager) && <span style={{ marginLeft:6,fontSize:10,color:'var(--gold)' }}>🏆</span>}
                </td>
                <td style={{ padding:'9px 10px',fontSize:11,color:'var(--muted)' }}>{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sleeper-pulled historical data */}
      {history && history.seasons.length > 0 && (
        <>
          <SectionHeader title="Historical Season-by-Season" badge={`FROM SLEEPER`} />
          <div style={{ overflowX:'auto',marginBottom:20 }}>
            <table style={{ borderCollapse:'collapse',minWidth:500 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--bdr)' }}>
                  <th style={{ fontFamily:'var(--font-display)',fontSize:10,fontWeight:700,color:'var(--muted)',padding:'7px 10px',textAlign:'left',whiteSpace:'nowrap' }}>MANAGER</th>
                  {history.seasons.map(s=><th key={s} style={{ fontFamily:'var(--font-display)',fontSize:10,fontWeight:700,color:'var(--muted)',padding:'7px 10px',textAlign:'center' }}>{s}</th>)}
                </tr>
              </thead>
              <tbody>
                {history.franchises.sort((a,b)=>b.championships-a.championships||b.playoffAppearances-a.playoffAppearances).map(f=>(
                  <tr key={f.ownerId} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'8px 10px',fontWeight:600,fontSize:12,whiteSpace:'nowrap' }}>{f.managerName}{f.championships>0&&<span style={{ marginLeft:4,color:'var(--gold)' }}>🏆×{f.championships}</span>}</td>
                    {history.seasons.map(s=>{
                      const rec = f.seasons.find(sr=>sr.season===s);
                      if(!rec) return <td key={s} style={{ padding:'8px 10px',textAlign:'center',color:'var(--muted)',fontSize:10 }}>—</td>;
                      const col = rec.playoffFinish==='champion'?'var(--gold)':rec.made_playoffs?'#22c55e':'var(--muted)';
                      return <td key={s} style={{ padding:'8px 10px',textAlign:'center',fontSize:10,color:col }}><div style={{ fontFamily:'var(--font-mono)' }}>{rec.wins}-{rec.losses}</div><div>{finishEmoji[rec.playoffFinish??'missed']}</div></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Manager narrative cards */}
      <SectionHeader title="Manager Profiles" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12 }}>
        {Object.values(LEAGUE_LORE.managers).map(mgr => (
          <div key={mgr.username} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:8,padding:14 }}>
            <div style={{ fontFamily:'var(--font-display)',fontSize:16,fontWeight:800,marginBottom:2 }}>{mgr.username}</div>
            <div style={{ fontSize:10,color:'var(--gold)',fontWeight:700,marginBottom:8 }}>{mgr.archetype}</div>
            <div style={{ fontSize:11,color:'var(--txt)',lineHeight:1.6 }}>{mgr.story}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
