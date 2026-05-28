'use client';
import { useState } from 'react';
import { useLeague } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, TeamAvatar, Spinner } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';
export default function FranchisePage() {
  const { standings, league, isLoading } = useLeague();
  const [selected, setSelected] = useState<string|null>(null);
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  const selectedTeam = standings.find(t => t.manager === selected);
  const selectedLore = selected ? LEAGUE_LORE.managers[selected as keyof typeof LEAGUE_LORE.managers] : null;
  const s2025 = selected ? LEAGUE_LORE.standings2025.find(s => s.manager === selected) : null;
  const champ = selected ? LEAGUE_LORE.championships.find(c => c.winner === selected) : null;
  return (
    <div>
      <SectionHeader title="Franchise Directory" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24 }}>
        {Object.values(LEAGUE_LORE.managers).map(mgr => {
          const team = standings.find(t => t.manager === mgr.username);
          const s25 = LEAGUE_LORE.standings2025.find(s => s.manager === mgr.username);
          const isChamp = LEAGUE_LORE.championships.some(c => c.winner === mgr.username);
          return (
            <div key={mgr.username} onClick={() => setSelected(mgr.username)} style={{ background:'linear-gradient(135deg,#001f5b,#1f2d42)',border:`1px solid ${selected===mgr.username?'rgba(245,166,35,0.6)':'var(--bdr)'}`,borderRadius:8,padding:14,cursor:'pointer',transition:'border-color .15s' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
                {team ? <TeamAvatar team={team} size={38} /> : <div style={{ width:38,height:38,borderRadius:'50%',background:'var(--s3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:13,fontWeight:800,flexShrink:0 }}>{mgr.username.slice(0,2).toUpperCase()}</div>}
                <div>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:14,fontWeight:800 }}>{mgr.username}</div>
                  {isChamp && <div style={{ fontSize:9,color:'var(--gold)',fontWeight:700 }}>🏆 CHAMPION</div>}
                </div>
              </div>
              <div style={{ fontSize:9,color:'var(--gold)',fontWeight:700,marginBottom:4,letterSpacing:'0.3px' }}>{mgr.archetype}</div>
              {team && <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2 }}><span style={{ color:'var(--muted)' }}>2026</span><span style={{ fontFamily:'var(--font-mono)' }}>{team.wins}-{team.losses}</span></div>}
              {s25 && <div style={{ display:'flex',justifyContent:'space-between',fontSize:11 }}><span style={{ color:'var(--muted)' }}>2025</span><span style={{ fontFamily:'var(--font-mono)' }}>#{s25.rank}</span></div>}
            </div>
          );
        })}
      </div>
      {selected && selectedLore && (
        <div>
          <div style={{ background:'linear-gradient(135deg,#001f5b,#1f2d42)',border:'1px solid var(--bdr)',borderRadius:10,padding:20,marginBottom:14 }}>
            <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:14 }}>
              {selectedTeam ? <TeamAvatar team={selectedTeam} size={60} /> : <div style={{ width:60,height:60,borderRadius:'50%',background:'var(--s3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:20,fontWeight:900 }}>{selected.slice(0,2).toUpperCase()}</div>}
              <div>
                <div style={{ fontFamily:'var(--font-display)',fontSize:24,fontWeight:900 }}>{selected}</div>
                <div style={{ fontSize:11,color:'var(--gold)',fontWeight:700 }}>{selectedLore.archetype}</div>
                {champ && <div style={{ fontSize:11,color:'var(--gold)' }}>🏆 {champ.season} Champion</div>}
              </div>
            </div>
            <div style={{ fontSize:12,color:'var(--txt)',lineHeight:1.65 }}>{selectedLore.story}</div>
            {s25 && (
              <div style={{ marginTop:12,padding:'10px 12px',background:'rgba(0,0,0,0.2)',borderRadius:6 }}>
                <div style={{ fontSize:10,color:'var(--muted)',fontWeight:700,letterSpacing:'0.5px',marginBottom:4 }}>2025 SEASON</div>
                <div style={{ fontSize:13,fontWeight:600 }}>Final Rank: #{s25.rank}</div>
                <div style={{ fontSize:11,color:'var(--muted)',marginTop:2 }}>{s25.notes}</div>
              </div>
            )}
            {selectedTeam && (
              <div style={{ marginTop:10,display:'flex',gap:18,flexWrap:'wrap' }}>
                {[['2026 Record',`${selectedTeam.wins}-${selectedTeam.losses}`],['PF',selectedTeam.pf.toFixed(1)],['PPG',selectedTeam.avgPpg.toFixed(1)],['Rank',`#${selectedTeam.rank}`],['Luck',`${selectedTeam.luckScore>0?'+':''}${selectedTeam.luckScore}`]].map(([l,v])=>(
                  <div key={l}><div style={{ fontSize:9,color:'var(--muted)',textTransform:'uppercase',fontWeight:700,letterSpacing:'0.5px' }}>{l}</div><div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:800 }}>{v}</div></div>
                ))}
              </div>
            )}
          </div>
          <SectionHeader title="AI Franchise Profile" badge="AI" badgeColor="gold" />
          <AIContentLoader key={selected} type="franchise" params={{ manager: selected }} label="FIN FRANCHISE PROFILE" personaName="Michelle Carter" />
        </div>
      )}
    </div>
  );
}
