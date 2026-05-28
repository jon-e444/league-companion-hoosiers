'use client';
import { useState } from 'react';
import { useLeague } from '@/hooks/useLeague';
import { PERSONA_LIST, PERSONAS } from '@/lib/personas';
import { LEAGUE_LORE } from '@/lib/lore';
import { SectionHeader, AIContentLoader, Spinner } from '@/components/ui';

export default function PersonasPage() {
  const { standings, isLoading } = useLeague();
  const [refreshKeys, setRefreshKeys] = useState<Record<string,number>>({});
  const [targetMgr, setTargetMgr] = useState<string>(Object.keys(LEAGUE_LORE.managers)[0]);
  const refresh = (id: string) => setRefreshKeys(prev => ({...prev, [id]: (prev[id]??0)+1}));

  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;

  return (
    <div>
      <SectionHeader title="FIN Media Personalities" />
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12,color:'var(--muted)',marginBottom:8 }}>Get each personality's take on a specific manager:</div>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:14 }}>
          {Object.keys(LEAGUE_LORE.managers).map(mgr => (
            <button key={mgr} onClick={() => setTargetMgr(mgr)} style={{ background:'var(--s2)',border:`1px solid ${targetMgr===mgr?'var(--gold)':'var(--bdr)'}`,color:targetMgr===mgr?'var(--gold)':'var(--txt)',fontSize:11,padding:'5px 9px',borderRadius:4,cursor:'pointer',fontWeight:targetMgr===mgr?700:400 }}>{mgr}</button>
          ))}
        </div>
      </div>
      {PERSONA_LIST.map(p => (
        <div key={p.id} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:8,marginBottom:14,overflow:'hidden' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:'var(--s3)',borderBottom:'1px solid var(--bdr)' }}>
            <div className={p.colorClass} style={{ width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,flexShrink:0 }}>{p.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-display)',fontSize:15,fontWeight:800,color:'#fff' }}>{p.name}</div>
              <div style={{ fontSize:10,color:'var(--muted)',fontWeight:600 }}>{p.role}</div>
              <div style={{ fontSize:10,color:'var(--gold)',fontStyle:'italic' }}>{p.catchphrase}</div>
            </div>
            <button onClick={() => refresh(p.id)} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',color:'var(--txt)',fontSize:11,padding:'5px 10px',borderRadius:4,cursor:'pointer' }}>↻ Refresh</button>
          </div>
          <div style={{ padding:'12px 14px' }}>
            <AIContentLoader key={`${p.id}-${targetMgr}-${refreshKeys[p.id]??0}`} type="personaTake" params={{ personaId: p.id, targetManager: targetMgr }} label={p.name} />
          </div>
        </div>
      ))}
    </div>
  );
}
