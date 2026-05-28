'use client';
import { useMatchups } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, Spinner, MatchupCard } from '@/components/ui';
import type { MatchupPair } from '@/types';
export default function MatchupsPage() {
  const { matchups, week, isLoading, error } = useMatchups();
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  if (error) return <div style={{ color:'#f87171',padding:20 }}>Error: {error}</div>;
  return (
    <div>
      <SectionHeader title={`Week ${week} Matchups`} badge="FULL COVERAGE" />
      {matchups.map((mp: MatchupPair) => <MatchupCard key={mp.matchup_id} mp={mp} />)}
      {matchups.length === 0 && <div style={{ color:'var(--muted)',fontSize:13,padding:'12px 0' }}>No matchup data available yet for this week.</div>}
      <SectionHeader title="SportsCenter Recaps" badge="AI" badgeColor="gold" />
      {matchups.map((mp: MatchupPair) => (
        <AIContentLoader key={mp.matchup_id} type="matchupRecap" params={{ matchup: mp }} label={`RECAP — ${mp.teamA.manager} vs ${mp.teamB.manager}`} personaName="Michelle Carter" />
      ))}
    </div>
  );
}
