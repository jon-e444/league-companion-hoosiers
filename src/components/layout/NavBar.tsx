'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NAV = [
  ['/dashboard','DASHBOARD'],['/matchups','MATCHUPS'],['/standings','STANDINGS'],
  ['/power-rankings','POWER RANKINGS'],['/media','MEDIA FEED'],['/personas','PERSONALITIES'],
  ['/podcast','PODCAST'],['/debate','DEBATE'],['/analytics','ANALYTICS'],
  ['/trades','TRADES'],['/franchise','FRANCHISES'],['/history','HISTORY'],
];
export function NavBar() {
  const path = usePathname();
  return (
    <nav style={{ background: 'var(--navy)', borderBottom: '2px solid rgba(255,255,255,0.1)', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto' }}>
      {NAV.map(([href, label]) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href));
        return (
          <Link key={href} href={href} style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.4px', padding: '9px 12px', color: active ? '#fff' : 'rgba(255,255,255,0.6)', background: 'none', border: 'none', borderBottom: active ? '3px solid var(--gold)' : '3px solid transparent', marginBottom: -2, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block' }}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
