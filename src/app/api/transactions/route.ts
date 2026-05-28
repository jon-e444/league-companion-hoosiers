import { NextResponse } from 'next/server';
import { sleeper } from '@/lib/sleeper';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = process.env.SLEEPER_LEAGUE_ID!;
    const league = await sleeper.getLeague(id);
    const week = parseInt(searchParams.get('week') ?? String(league.settings?.leg ?? 1));
    const transactions = await sleeper.getTransactions(id, week);
    return NextResponse.json({ transactions, week });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
