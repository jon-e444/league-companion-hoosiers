import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import { SectionHeader, AIContentLoader } from '@/components/ui';
export default async function TradesPage() {
  const id = process.env.SLEEPER_LEAGUE_ID!;
  const league = await sleeper.getLeague(id);
  const week = league.settings?.leg ?? 1;
  const [users, rosters, transactions] = await Promise.all([sleeper.getUsers(id), sleeper.getRosters(id), sleeper.getTransactions(id, week)]);
  const standings = buildStandings(rosters, users);
  const rMap = new Map(standings.map(s => [s.roster_id, s]));
  const trades = transactions.filter(t => t.type === 'trade');
  const waivers = transactions.filter(t => t.type === 'waiver' || t.type === 'free_agent');
  return (
    <div>
      <SectionHeader title="Trade Tracker" badge={`WEEK ${week}`} />
      {trades.length > 0 ? trades.map(t => {
        const t1 = rMap.get(t.roster_ids?.[0]), t2 = rMap.get(t.roster_ids?.[1]);
        const a1 = Object.entries(t.adds??{}).filter(([,v])=>v===t.roster_ids?.[0]).map(([k])=>k);
        const a2 = Object.entries(t.adds??{}).filter(([,v])=>v===t.roster_ids?.[1]).map(([k])=>k);
        return (
          <div key={t.transaction_id} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:7,marginBottom:10,overflow:'hidden' }}>
            <div style={{ background:'var(--s3)',padding:'7px 12px',fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'0.5px',color:'var(--muted)',display:'flex',justifyContent:'space-between' }}>
              <span>TRADE — {new Date(t.created).toLocaleDateString()}</span>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 32px 1fr' }}>
              <div style={{ padding:'10px 12px',borderRight:'1px solid var(--bdr)' }}>
                <div style={{ fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',color:'var(--muted)',marginBottom:4 }}>Receives</div>
                <div style={{ fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,marginBottom:4,color:'var(--gold)' }}>{t1?.manager ?? `Roster ${t.roster_ids?.[0]}`}</div>
                {a1.map(p=><div key={p} style={{ fontSize:11,color:'var(--txt)',padding:'2px 0' }}>{p.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>)}
                {a1.length===0&&<div style={{ fontSize:11,color:'var(--muted)' }}>Draft pick(s)</div>}
              </div>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontSize:16 }}>⇄</div>
              <div style={{ padding:'10px 12px' }}>
                <div style={{ fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',color:'var(--muted)',marginBottom:4 }}>Receives</div>
                <div style={{ fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,marginBottom:4,color:'var(--gold)' }}>{t2?.manager ?? `Roster ${t.roster_ids?.[1]}`}</div>
                {a2.map(p=><div key={p} style={{ fontSize:11,color:'var(--txt)',padding:'2px 0' }}>{p.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>)}
                {a2.length===0&&<div style={{ fontSize:11,color:'var(--muted)' }}>Draft pick(s)</div>}
              </div>
            </div>
          </div>
        );
      }) : <div style={{ color:'var(--muted)',fontSize:13,padding:'8px 0',marginBottom:14 }}>No trades this week. Sources say the deadline conversation is getting interesting.</div>}
      <SectionHeader title="Waiver Wire" />
      {waivers.length > 0 ? waivers.map(w=>(
        <div key={w.transaction_id} style={{ background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:5,padding:'9px 12px',marginBottom:7,fontSize:12 }}>
          <span style={{ color:'#22c55e',fontWeight:600 }}>ADD</span>{' '}
          {Object.keys(w.adds??{}).map(p=>p.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())).join(', ')||'Unknown'}
          {w.drops&&Object.keys(w.drops).length>0&&<span style={{ color:'var(--muted)' }}> · dropped {Object.keys(w.drops).map(p=>p.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())).join(', ')}</span>}
          {` — by ${rMap.get(w.roster_ids?.[0])?.manager ?? 'Unknown'}`}
        </div>
      )) : <div style={{ color:'var(--muted)',fontSize:12,padding:'6px 0' }}>No waiver moves this week.</div>}
      <div style={{ marginTop:14 }}>
        <SectionHeader title="Adrian's Trade Report" badge="AI" badgeColor="gold" />
        <AIContentLoader type="tradeReport" label="ADRIAN VAZQUEZ — INSIDER REPORT" personaName="Adrian Vazquez" />
      </div>
    </div>
  );
}
