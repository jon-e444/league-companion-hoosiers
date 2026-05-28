'use client';
import { useState } from 'react';
import { useLeague } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, TeamAvatar, Spinner } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';
type Tab = 'luck'|'efficiency'|'hotseat';
export default function AnalyticsPage() {
  const { standings, isLoading } = useLeague();
  const [tab, setTab] = useState<Tab>('luck');
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  const tb = (t: Tab): React.CSSProperties => ({ fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,padding:'5px 10px',background:tab===t?'var(--red)':'var(--s2)',border:`1px solid ${tab===t?'var(--red)':'var(--bdr)'}`,color:tab===t?'#fff':'var(--muted)',cursor:'pointer',borderRadius:4 });
  return (
    <div>
      <SectionHeader title="Advanced Analytics" />
      <div style={{ display:'flex',gap:4,marginBottom:14 }}>
        {(['luck','efficiency','hotseat'] as Tab[]).map(t => <button key={t} style={tb(t)} onClick={()=>setTab(t)}>{t==='luck'?'LUCK INDEX':t==='efficiency'?'EFFICIENCY':'HOT SEAT'}</button>)}
      </div>
      {tab==='luck' && (
        <div>
          <p style={{ fontSize:11,color:'var(--muted)',marginBottom:12 }}>Luck Index = actual wins minus expected wins. Positive = overperforming (getting lucky). Negative = underperforming (getting unlucky).</p>
          {standings.map(t => {
            const col = t.luckScore > 1 ? '#ef4444' : t.luckScore < -1 ? '#22c55e' : 'var(--muted)';
            return (
              <div key={t.roster_id} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--bdr)' }}>
                <TeamAvatar team={t} size={28} />
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                    <span style={{ fontWeight:600,fontSize:12 }}>{t.manager}</span>
                    <span style={{ fontFamily:'var(--font-mono)',fontSize:12,color:col,fontWeight:600 }}>{t.luckScore>0?'+':''}{t.luckScore}</span>
                  </div>
                  <div style={{ height:6,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${Math.min(100,Math.abs(t.luckScore)*20+50)}%`,background:col,borderRadius:3 }}/>
                  </div>
                </div>
                <div style={{ fontSize:10,color:'var(--muted)',minWidth:65,textAlign:'right' }}>{t.luckScore<-1?'💀 Unlucky':t.luckScore>1?'🍀 Lucky':'⚖️ Fair'}</div>
              </div>
            );
          })}
        </div>
      )}
      {tab==='efficiency' && (
        <div>
          {standings.map(t => {
            const pct = Math.min(100,(t.avgPpg/160)*100);
            return (
              <div key={t.roster_id} style={{ padding:'9px 0',borderBottom:'1px solid var(--bdr)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                  <span style={{ fontSize:12,fontWeight:600 }}>{t.manager}</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:12,color:'var(--gold)' }}>{t.avgPpg.toFixed(1)} ppg</span>
                </div>
                <div style={{ height:5,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                  <div style={{ height:'100%',width:`${pct}%`,background:'#3b82f6',borderRadius:3 }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab==='hotseat' && (
        <div>
          <p style={{ fontSize:11,color:'var(--muted)',marginBottom:12 }}>Ranked by 2026 pressure — who most needs to turn things around based on current performance and historical expectations.</p>
          {[...standings].reverse().slice(0,6).map((t,i)=>{
            const mgr = LEAGUE_LORE.managers[t.manager as keyof typeof LEAGUE_LORE.managers];
            return (
              <div key={t.roster_id} style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid var(--bdr)' }}>
                <span style={{ fontSize:14 }}>{['🔥🔥🔥','🔥🔥🔥','🔥🔥','🔥🔥','🔥','🔥'][i]}</span>
                <TeamAvatar team={t} size={30} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:14,fontWeight:700 }}>{t.manager}</div>
                  <div style={{ fontSize:10,color:'var(--muted)' }}>{t.wins}-{t.losses} · {t.pf.toFixed(1)} PF</div>
                  {mgr && <div style={{ fontSize:9,color:'var(--gold)',fontWeight:600,marginTop:2 }}>{mgr.archetype}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginTop:20 }}>
        <SectionHeader title="Analytics Deep Dive" badge="AI" badgeColor="gold" />
        <AIContentLoader type="analytics" label="DR. KEVIN PARK — WEEKLY ANALYTICS" personaName="Dr. Kevin Park" />
      </div>
    </div>
  );
}
