import { NextResponse } from 'next/server';
import { generate } from '@/lib/ai';
import { cache } from '@/lib/cache';
import { PERSONAS } from '@/lib/personas';
import { sleeper } from '@/lib/sleeper';
import { buildStandings } from '@/lib/standings';
import {
  topStoryPrompt, matchupRecapPrompt, powerRankingsPrompt,
  podcastScriptPrompt, debatePrompt, tradeReportPrompt,
  franchiseProfilePrompt, analyticsReportPrompt,
  historyPagePrompt, standingsInsightPrompt,
} from '@/lib/prompts';
import type { MatchupPair } from '@/types';

export async function POST(req: Request) {
  try {
    const { type, params = {} } = await req.json() as { type: string; params: Record<string, unknown> };
    const cacheKey = `${type}:${JSON.stringify(params)}`;
    const cached = cache.get<string>(cacheKey);
    if (cached) return NextResponse.json({ content: cached, cached: true });

    const id = process.env.SLEEPER_LEAGUE_ID!;
    const season = process.env.SLEEPER_SEASON ?? '2026';
    const [league, users, rosters] = await Promise.all([sleeper.getLeague(id), sleeper.getUsers(id), sleeper.getRosters(id)]);
    const week = league.settings?.leg ?? 1;
    const standings = buildStandings(rosters, users);

    let prompt = '', system = '';

    switch (type) {
      case 'topStory': {
        let mp: MatchupPair | undefined;
        try {
          const raw = await sleeper.getMatchups(id, week);
          const groups = new Map<number, typeof raw>();
          raw.forEach(m => { if (!groups.has(m.matchup_id)) groups.set(m.matchup_id, []); groups.get(m.matchup_id)!.push(m); });
          const rMap = new Map(standings.map(s => [s.roster_id, s]));
          groups.forEach((members, mid) => {
            if (members.length !== 2 || mp) return;
            const [a, b] = members;
            const ta = rMap.get(a.roster_id), tb = rMap.get(b.roster_id);
            if (ta && tb) mp = { matchup_id: mid, teamA: ta, teamB: tb, scoreA: a.points??0, scoreB: b.points??0, projA: ta.avgPpg, projB: tb.avgPpg, tags: [], isLive: false };
          });
        } catch {}
        prompt = topStoryPrompt(standings, week, season, mp);
        system = PERSONAS.anchor.systemPrompt; break;
      }
      case 'matchupRecap': {
        const mp = params.matchup as MatchupPair;
        if (!mp) throw new Error('matchup required');
        prompt = matchupRecapPrompt(mp, week, season, standings);
        system = PERSONAS.anchor.systemPrompt; break;
      }
      case 'powerRankings':
        prompt = powerRankingsPrompt(standings, week, season);
        system = PERSONAS.hottak.systemPrompt; break;
      case 'podcast': {
        let matchups: MatchupPair[] = [];
        try {
          const raw = await sleeper.getMatchups(id, week);
          const groups = new Map<number, typeof raw>();
          raw.forEach(m => { if (!groups.has(m.matchup_id)) groups.set(m.matchup_id, []); groups.get(m.matchup_id)!.push(m); });
          const rMap = new Map(standings.map(s => [s.roster_id, s]));
          groups.forEach((members, mid) => {
            if (members.length !== 2) return;
            const [a, b] = members;
            const ta = rMap.get(a.roster_id), tb = rMap.get(b.roster_id);
            if (ta && tb) matchups.push({ matchup_id: mid, teamA: ta, teamB: tb, scoreA: a.points??0, scoreB: b.points??0, projA: ta.avgPpg, projB: tb.avgPpg, tags: [], isLive: false });
          });
        } catch {}
        prompt = podcastScriptPrompt(standings, week, season, matchups);
        break;
      }
      case 'debate': {
        const { topic, personaId, side } = params as { topic: string; personaId: string; side: 'for'|'against' };
        const p = PERSONAS[personaId]; if (!p) throw new Error('Unknown persona');
        prompt = debatePrompt(topic, p.name, side, standings, week, season);
        system = p.systemPrompt; break;
      }
      case 'tradeReport': {
        let txns: {type:string;adds:Record<string,number>|null;roster_ids:number[]}[] = [];
        try { const t = await sleeper.getTransactions(id, week); txns = t; } catch {}
        prompt = tradeReportPrompt(standings, week, season, txns);
        system = PERSONAS.reporter.systemPrompt; break;
      }
      case 'franchise': {
        const mgr = params.manager as string;
        const team = standings.find(s => s.manager === mgr);
        if (!team) throw new Error('Manager not found: ' + mgr);
        prompt = franchiseProfilePrompt(mgr, team, standings, season);
        system = PERSONAS.anchor.systemPrompt; break;
      }
      case 'analytics':
        prompt = analyticsReportPrompt(standings, week, season);
        system = PERSONAS.analyst.systemPrompt; break;
      case 'standingsInsight':
        prompt = standingsInsightPrompt(standings, week, season);
        system = PERSONAS.analyst.systemPrompt; break;
      case 'historyPage':
        prompt = historyPagePrompt(standings, season);
        system = PERSONAS.anchor.systemPrompt; break;
      case 'personaTake': {
        const { personaId, targetManager } = params as { personaId: string; targetManager?: string };
        const p = PERSONAS[personaId]; if (!p) throw new Error('Unknown persona');
        const target = targetManager
          ? standings.find(s => s.manager === targetManager) ?? standings[0]
          : standings[Math.floor(Math.random() * Math.min(6, standings.length))];
        const { buildLoreContext } = await import('@/lib/lore');
        const { managerLore } = await import('@/lib/lore');
        prompt = `${buildLoreContext(`Current: ${target.manager}(${target.wins}-${target.losses}, ${target.pf.toFixed(1)}PF, rank #${target.rank}) in ${season} Week ${week}`)}\n\n${managerLore(target.manager)}\n\nAs ${p.name}, give your take on ${target.manager}'s ${season} season so far in 1 short paragraph. Stay fully in character. Reference their real history from the lore above. Use their username.`;
        system = p.systemPrompt; break;
      }
      case 'teamStory': {
        const mgr = params.manager as string;
        const team = standings.find(s => s.manager === mgr) ?? standings[0];
        prompt = franchiseProfilePrompt(mgr, team, standings, season);
        system = PERSONAS.anchor.systemPrompt; break;
      }
      default: throw new Error('Unknown type: ' + type);
    }

    const content = await generate(prompt, system, type === 'podcast' ? 2000 : 1000);
    cache.set(cacheKey, content, 1000 * 60 * 60 * 6);
    return NextResponse.json({ content, cached: false });
  } catch (e) {
    const msg = (e as Error).message;
    console.error('[generate/content]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
