'use client';
import { useState, useEffect } from 'react';
import type { TeamStanding, StorylineTag } from '@/types';

export function TeamAvatar({ team, size = 36 }: { team: TeamStanding; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: team.colors[0], color: team.colors[1], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(size * 0.33), flexShrink: 0 }}>
      {team.initials}
    </div>
  );
}

export function SectionHeader({ title, badge, badgeColor = 'red' }: { title: string; badge?: string; badgeColor?: 'red'|'gold'|'green' }) {
  const bg = badgeColor === 'gold' ? 'var(--gold)' : badgeColor === 'green' ? '#166534' : 'var(--red)';
  const tc = badgeColor === 'gold' ? '#000' : '#fff';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</span>
      {badge && <span style={{ background: bg, color: tc, fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700, padding: '2px 6px', letterSpacing: 1 }}>{badge}</span>}
    </div>
  );
}

export function StorylineTags({ tags }: { tags: StorylineTag[] }) {
  if (!tags.length) return null;
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {tags.map(t => <span key={t} className={`tag-${t}`} style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t}</span>)}
    </div>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <div style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />;
}

export function AIText({ content }: { content: string }) {
  return (
    <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--txt)' }}>
      {content.split(/\n\n+/).filter(Boolean).map((p, i, arr) => (
        <p key={i} style={{ marginBottom: i < arr.length - 1 ? 10 : 0 }}>{p}</p>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, variant = 'neutral' }: { label: string; value: string; sub?: string; variant?: 'good'|'warn'|'bad'|'neutral' }) {
  const vc = variant === 'good' ? '#22c55e' : variant === 'warn' ? '#f59e0b' : variant === 'bad' ? '#ef4444' : '#fff';
  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--bdr)', borderRadius: 6, padding: '10px 12px' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, lineHeight: 1, marginBottom: 2, color: vc }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}

export function AIContentLoader({ type, params = {}, label, personaName }: { type: string; params?: Record<string, unknown>; label: string; personaName?: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetch('/api/generate/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, params }) })
      .then(r => r.json())
      .then(d => { if (cancelled) return; if (d.error) setError(d.error); else setContent(d.content); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, JSON.stringify(params)]);

  const fullLabel = personaName ? `${label} — ${personaName}` : label;
  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--bdr)', borderLeft: '3px solid var(--gold)', borderRadius: 6, padding: 14, marginBottom: 10 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 800, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{fullLabel}</div>
      {loading ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 12 }}><Spinner />Generating...</div>
        : error ? <div style={{ fontSize: 12, color: '#f87171' }}>Error: {error}</div>
        : content ? <AIText content={content} /> : null}
    </div>
  );
}

export function MatchupCard({ mp }: { mp: import('@/types').MatchupPair }) {
  const aWin = mp.scoreA > mp.scoreB;
  const has = mp.scoreA > 0 || mp.scoreB > 0;
  const sc = (w: boolean) => has ? (w ? '#fff' : 'var(--muted)') : 'var(--gold)';
  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--bdr)', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ background: 'var(--s3)', padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', color: 'var(--muted)' }}>
        <span>MATCHUP #{mp.matchup_id}</span>
        {has ? <span style={{ color: 'var(--red)' }}>● LIVE</span> : <span style={{ color: 'var(--gold)' }}>PROJECTED</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: 14, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamAvatar team={mp.teamA} size={32} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>{mp.teamA.name}</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>{mp.teamA.manager}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{mp.teamA.wins}-{mp.teamA.losses} · #{mp.teamA.rank}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: sc(aWin) }}>{mp.scoreA.toFixed(1)}</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 900 }}>—</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: sc(!aWin) }}>{mp.scoreB.toFixed(1)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>{mp.teamB.name}</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>{mp.teamB.manager}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{mp.teamB.wins}-{mp.teamB.losses} · #{mp.teamB.rank}</div>
          </div>
          <TeamAvatar team={mp.teamB} size={32} />
        </div>
      </div>
      {mp.tags.length > 0 && <div style={{ padding: '7px 14px', borderTop: '1px solid var(--bdr)' }}><StorylineTags tags={mp.tags} /></div>}
    </div>
  );
}
