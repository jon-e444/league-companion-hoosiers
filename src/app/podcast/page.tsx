'use client';
import { useLeague } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, Spinner } from '@/components/ui';
export default function PodcastPage() {
  const { currentWeek, isLoading } = useLeague();
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,#001f5b,#1a2233)',border:'1px solid var(--bdr)',borderRadius:10,padding:20,marginBottom:14 }}>
        <div style={{ fontFamily:'var(--font-display)',fontSize:19,fontWeight:800,marginBottom:3 }}>Fantasy Insider Network Podcast</div>
        <div style={{ fontSize:11,color:'var(--gold)',fontWeight:600,marginBottom:8 }}>EP. {currentWeek} · WEEK {currentWeek} · HOOSIERS LLC · 2026</div>
        <div style={{ fontSize:12,color:'var(--muted)',lineHeight:1.6 }}>
          Full AI-generated episode script grounded in real Hoosiers LLC history. Hosts reference AJWARE's title defense, Ryanr9's dynasty chase, jonE4's ringless career, and more. Copy into any TTS tool to generate audio.
        </div>
      </div>
      <SectionHeader title="Episode Script" badge="AI" badgeColor="gold" />
      <AIContentLoader type="podcast" label={`WEEK ${currentWeek} EPISODE — ALL 4 HOSTS`} />
    </div>
  );
}
