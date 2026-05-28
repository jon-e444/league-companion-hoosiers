import { NextResponse } from 'next/server';
import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
export async function GET() {
  try {
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const season = process.env.SLEEPER_SEASON ?? '2026';
    const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
    const standings = buildStandings(rosters, users);
    const currentWeek = league.settings?.leg ?? 1;
    return NextResponse.json({ league, users, rosters, standings, currentWeek, season });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
