import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';

export async function TopBar() {
  let items = ['HOOSIERS LLC', 'FANTASY INSIDER NETWORK', 'SLEEPER · AI COVERAGE'];
  let week = 0;
  try {
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
    week = league.settings?.leg ?? 0;
    const standings = buildStandings(rosters, users);
    items = [...standings.slice(0, 6).map(t => `${t.manager.toUpperCase()} ${t.wins}-${t.losses}`), `HOOSIERS LLC · WEEK ${week}`, `DEFENDING CHAMPION: AJWARE`, `RYANR9 BACK-TO-BACK FINALIST`];
  } catch {}
  const doubled = [...items, ...items];
  return (
    <div style={{ background: 'var(--red)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700 }}>
      <style>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.ticker{display:flex;gap:32px;animation:tickerScroll 50s linear infinite;white-space:nowrap}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-1px', whiteSpace: 'nowrap' }}>⚡ FIN</div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="ticker">
          {doubled.map((item, i) => <span key={i} style={{ color: 'rgba(255,255,255,0.85)' }}>{item}<span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>|</span></span>)}
        </div>
      </div>
      {week > 0 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>WEEK {week}</span>}
    </div>
  );
}
