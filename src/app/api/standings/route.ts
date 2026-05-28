import { NextResponse } from 'next/server';
import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
export async function GET() {
  try {
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const [users, rosters] = await Promise.all([sleeper.getUsers(id), sleeper.getRosters(id)]);
    return NextResponse.json({ standings: buildStandings(rosters, users) });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
