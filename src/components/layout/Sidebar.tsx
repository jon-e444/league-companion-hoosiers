import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import { TeamAvatar } from '@/components/ui';
import { LEAGUE_LORE } from '@/lib/lore';

export async function Sidebar() {
  let standings = [] as Awaited<ReturnType<typeof buildStandings>>;
  let week = 0;
  try {
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
    week = league.settings?.leg ?? 0;
    standings = buildStandings(rosters, users);
  } catch {}

  const cutoff = 6;
  const awards = [
    { e: '🏆', label: 'Defending Champ', name: 'AJWARE', stat: '2025 Champion' },
    { e: '⚡', label: 'Back-to-Back Finalist', name: 'Ryanr9', stat: 'Won \'24, Runner-Up \'25' },
    { e: '😤', label: 'Best Record, No Ring', name: 'jonE4', stat: 'Best all-time W%' },
    { e: '👻', label: 'Ghost Manager', name: 'jpelms', stat: 'Chronically inactive' },
  ];

  return (
    <aside style={{ background: 'var(--s1)', borderLeft: '1px solid var(--bdr)', overflowY: 'auto' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--bdr)', background: 'rgba(0,31,91,0.4)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900, color: '#fff' }}>HOOSIERS LLC</div>
        <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>{week > 0 ? `2026 SEASON · WEEK ${week}` : '2026 SEASON'}</div>
      </div>

      <section style={{ borderBottom: '1px solid var(--bdr)', padding: '12px 14px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>League Lore</div>
        {awards.map(a => (
          <div key={a.label} style={{ background: 'var(--s3)', borderRadius: 5, padding: '8px 10px', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{a.e}</span>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{a.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.name}</div>
              <div style={{ fontSize: 10, color: 'var(--gold)' }}>{a.stat}</div>
            </div>
          </div>
        ))}
      </section>

      {standings.length > 0 && (
        <>
          <section style={{ borderBottom: '1px solid var(--bdr)', padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>2026 Standings</div>
            {standings.map((t, i) => (
              <div key={t.roster_id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--bdr)' }}>
                {i === cutoff && <div style={{ width: '100%', borderTop: '2px solid var(--gold)', marginBottom: 4 }} />}
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: i < 3 ? 'var(--gold)' : 'var(--muted)', width: 18 }}>{i+1}</span>
                <TeamAvatar team={t} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.manager}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{t.wins}-{t.losses} · {t.pf.toFixed(0)}</div>
                </div>
              </div>
            ))}
          </section>

          <section style={{ padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Playoff Odds</div>
            {standings.map((t, i) => {
              const col = t.playoffOdds >= 65 ? '#22c55e' : t.playoffOdds >= 35 ? '#f59e0b' : '#ef4444';
              return (
                <div key={t.roster_id} style={{ marginBottom: 7 }}>
                  {i === cutoff && <div style={{ borderTop: '2px solid var(--gold)', marginBottom: 7 }} />}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{t.manager}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: col, flexShrink: 0 }}>{t.playoffOdds}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bdr)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${t.playoffOdds}%`, background: col, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </aside>
  );
}
