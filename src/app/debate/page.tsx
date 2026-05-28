'use client';
import { useLeague } from '@/hooks/useLeague';
import { SectionHeader, AIContentLoader, Spinner } from '@/components/ui';
import { PERSONAS } from '@/lib/personas';
export default function DebatePage() {
  const { standings, isLoading } = useLeague();
  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Spinner size={32}/></div>;
  const topics = [
    { q:`jonE4 has the best all-time winning percentage in Hoosiers LLC and zero championships. Is he the most elite manager in league history or is a ringless career disqualifying?`, a:'hottak', b:'analyst' },
    { q:`Ryanr9 won the championship his first year and made the finals his second. Is he now the best manager in Hoosiers LLC history, surpassing even AJWARE?`, a:'anchor', b:'chaos' },
    { q:`Is BSmitty3030's constant waiver wire activity an asset or a liability? Does maximum engagement produce results, or is he just rearranging deck chairs?`, a:'exjock', b:'analyst' },
    { q:`jpelms is inactive every season and somehow stays mid-table. Does his continued existence in the playoff conversation embarrass the rest of the league?`, a:'hottak', b:'chaos' },
    { q:`QuinnRicha won in 2023 and fell to 8th in 2025. Is this a temporary rebuild or a franchise in permanent decline?`, a:'reporter', b:'anchor' },
  ];
  return (
    <div>
      <SectionHeader title="First Take: Hoosiers LLC" badge="DEBATE" />
      {topics.map((d, i) => (
        <div key={i} style={{ marginBottom:20 }}>
          <div style={{ background:'var(--red)',color:'#fff',fontFamily:'var(--font-display)',fontSize:13,fontWeight:800,padding:'10px 14px',letterSpacing:'0.3px',borderRadius:'6px 6px 0 0',lineHeight:1.3 }}>{d.q}</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid var(--bdr)',borderTop:'none',borderRadius:'0 0 6px 6px',overflow:'hidden' }}>
            <div style={{ padding:13,background:'rgba(239,68,68,0.07)',borderRight:'1px solid var(--bdr)' }}>
              <div style={{ fontFamily:'var(--font-display)',fontSize:12,fontWeight:700,color:'var(--gold)',marginBottom:5 }}>{PERSONAS[d.a]?.name} — FOR</div>
              <AIContentLoader type="debate" params={{ topic:d.q, personaId:d.a, side:'for' }} label={PERSONAS[d.a]?.name} />
            </div>
            <div style={{ padding:13,background:'rgba(59,130,246,0.07)' }}>
              <div style={{ fontFamily:'var(--font-display)',fontSize:12,fontWeight:700,color:'var(--gold)',marginBottom:5 }}>{PERSONAS[d.b]?.name} — AGAINST</div>
              <AIContentLoader type="debate" params={{ topic:d.q, personaId:d.b, side:'against' }} label={PERSONAS[d.b]?.name} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
