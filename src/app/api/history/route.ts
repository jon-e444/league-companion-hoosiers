import { NextResponse } from 'next/server';
import { buildLeagueHistory } from '@/lib/history';
import { cache } from '@/lib/cache';
export async function GET() {
  try {
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const key = `history:${id}`;
    const cached = cache.get(key);
    if (cached) return NextResponse.json({ history: cached, cached: true });
    const history = await buildLeagueHistory(id);
    cache.set(key, history, 1000 * 60 * 60 * 24);
    return NextResponse.json({ history, cached: false });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
