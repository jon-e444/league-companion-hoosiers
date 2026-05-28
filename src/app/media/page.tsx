'use client';
import { useState } from 'react';
import { useLeague } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, Spinner } from '@/components/ui';
import { PERSONAS } from '@/lib/personas';
import { LEAGUE_LORE } from '@/lib/lore';

type Cat = 'all'|'insider'|'analytics'|'hottake';

export default function MediaPage() {
  const { standings, currentWeek, isLoading, error } = useLeague();
  const [cat, setCat] = useState<Cat>('all');
  const [selectedMgr, setSelectedMgr] = useState<string|null>(null);
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  if (error) return <div style={{ color:'#f87171',padding:20 }}>Error: {error}</div>;

  const top = standings[0], bot = standings[standings.length-1];
  const unlucky = [...standings].sort((a,b) => b.luckScore - a.luckScore)[0];

  const headlines = [
    { p:'anchor', cat:'insider' as Cat, hl:`${top?.manager ?? 'AJWARE'} Leads Hoosiers LLC Through Week ${currentWeek}`, sn:`At ${top?.wins ?? 0}-${top?.losses ?? 0} with ${top?.pf.toFixed(1) ?? 0} total PF, ${top?.manager ?? 'the league leader'} continues to make a case as the team to beat in 2026.` },
    { p:'hottak', cat:'hottake' as Cat, hl:`jonE4 Has The Best Record In League History And STILL No Championship. I'm Tired Of Excuses.`, sn:`Another week, another strong jonE4 performance. Another week without a ring. At what point does the record stop mattering?` },
    { p:'reporter', cat:'insider' as Cat, hl:`SOURCES: Ryanr9's Championship Window Is Wide Open — And He Knows It`, sn:`League sources tell FIN that Ryanr9 entered 2026 with one goal. Back-to-back finalists don't stay hungry. They stay focused.` },
    { p:'chaos', cat:'hottake' as Cat, hl:`QuinnRicha's Fall From Champion To 8th Is The Most Interesting Story In This League`, sn:`Won the title in 2023. Eighth place in 2025. In a keeper league, that collapse tells a story about roster mismanagement that is worth examining.` },
    { p:'analyst', cat:'analytics' as Cat, hl:`Keeper Value Report: Who Built a Dynasty, Who Paid Too Much`, sn:`In Hoosiers LLC's keeper format, this week's standings reflect last off-season's decisions as much as this week's lineup. The numbers are revealing.` },
    ...(unlucky ? [{ p:'analyst', cat:'analytics' as Cat, hl:`${unlucky.manager} Is The Unluckiest Team In Hoosiers LLC Right Now`, sn:`Expected wins model shows ${unlucky.manager} at ${unlucky.wins}-${unlucky.losses} despite point totals that suggest a better record. Luck score: ${unlucky.luckScore > 0 ? '+' : ''}${unlucky.luckScore}.` }] : []),
    { p:'exjock', cat:'insider' as Cat, hl:`Big Ray's Weekly Film Room: BSmitty3030 Works Harder Than Anyone — Does It Show?`, sn:`Most waiver moves in the league. Constant activity. Fifth place last season. In my playing days, we called that spinning your wheels.` },
    { p:'chaos', cat:'hottake' as Cat, hl:`jpelms Watch: Is He Even Checking The App This Season?`, sn:`The most low-effort manager in Hoosiers LLC history continues to confound. Inactive. Mysterious. Somehow still relevant.` },
  ];

  const filtered = cat === 'all' ? headlines : headlines.filter(h => h.cat === cat);
  const tbtnStyle = (t: Cat): React.CSSProperties => ({ fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,padding:'5px 10px',background:cat===t?'var(--red)':'var(--s2)',border:`1px solid ${cat===t?'var(--red)':'var(--bdr)'}`,color:cat===t?'#fff':'var(--muted)',cursor:'pointer',borderRadius:4 });

  return (
    <div>
      <SectionHeader title="Hoosiers LLC Media Feed" badge="BREAKING" />
      <div style={{ display:'flex',gap:4,marginBottom:14,flexWrap:'wrap' }}>
        {(['all','insider','analytics','hottake'] as Cat[]).map(t => (
          <button key={t} style={tbtnStyle(t)} onClick={() => setCat(t)}>{t.toUpperCase()}</button>
        ))}
      </div>
      {filtered.map((item, i) => {
        const p = PERSONAS[item.p];
        return (
          <div key={i} style={{ padding:'12px 0',borderBottom:'1px solid var(--bdr)',display:'flex',gap:10 }}>
            <div className={p.colorClass} style={{ width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0 }}>{p.icon}</div>
            <div>
              <div style={{ fontSize:10,color:'var(--muted)',fontWeight:600 }}><span style={{ color:'var(--gold)' }}>{p.name}</span> · {p.role}</div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,lineHeight:1.3,color:'#fff' }}>{item.hl}</div>
              <div style={{ fontSize:11,color:'var(--muted)',lineHeight:1.5,marginTop:2 }}>{item.sn}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop:16 }}>
        <SectionHeader title="Generate Manager Story" />
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:10 }}>
          {Object.keys(LEAGUE_LORE.managers).map(mgr => (
            <button key={mgr} onClick={() => setSelectedMgr(mgr)} style={{ background:'var(--s2)',border:`1px solid ${selectedMgr===mgr?'var(--red)':'var(--bdr)'}`,color:'var(--txt)',fontSize:11,padding:'5px 9px',borderRadius:4,cursor:'pointer' }}>{mgr}</button>
          ))}
        </div>
        {selectedMgr && (
          <AIContentLoader key={selectedMgr} type="franchise" params={{ manager: selectedMgr }} label="FIN FRANCHISE PROFILE" personaName="Michelle Carter" />
        )}
      </div>
    </div>
  );
}
