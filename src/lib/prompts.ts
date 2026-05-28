import type { TeamStanding, MatchupPair } from '@/types';
import { buildLoreContext, managerLore } from '@/lib/lore';

function currentSeasonCtx(standings: TeamStanding[], week: number, season: string): string {
  if (!standings.length) return '';
  const top = standings.slice(0, 4).map(t => `${t.manager}(${t.wins}-${t.losses},${t.pf.toFixed(1)}PF,#${t.rank})`).join(', ');
  const bot = standings.slice(-4).map(t => `${t.manager}(${t.wins}-${t.losses},#${t.rank})`).join(', ');
  return `Season:${season} Week:${week} | Top 4: ${top} | Bottom 4: ${bot}`;
}

export function buildFullContext(standings: TeamStanding[], week: number, season: string): string {
  return buildLoreContext(currentSeasonCtx(standings, week, season));
}

export function topStoryPrompt(standings: TeamStanding[], week: number, season: string, matchup?: MatchupPair): string {
  const ctx = buildFullContext(standings, week, season);
  const mp = matchup ? `Featured matchup this week: ${matchup.teamA.manager} vs ${matchup.teamB.manager} (${matchup.scoreA.toFixed(1)}-${matchup.scoreB.toFixed(1)})` : '';
  return `${ctx}

${mp}

Write a 3-paragraph ESPN/Fox Sports-style top story for Hoosiers LLC Week ${week}, ${season}.

Paragraph 1: The biggest storyline of this moment in the season — ground it in the real history of this league. Reference specific managers by username. Connect the current week to the larger narrative arc (e.g., jonE4's ringless career, AJWARE defending the title, Ryanr9's dynasty building, QuinnRicha's fall from grace).

Paragraph 2: The most important matchup this week and what is at stake — playoff positioning, revenge, continuation of a rivalry, or a manager fighting for their season.

Paragraph 3: The playoff picture and what Week ${week} means for the rest of the season. Who is in, who is on the bubble, who needs a miracle.

Write in Michelle Carter's authoritative anchor voice. Every claim must be grounded in the history and data above.`;
}

export function matchupRecapPrompt(mp: MatchupPair, week: number, season: string, standings: TeamStanding[]): string {
  const ctx = buildFullContext(standings, week, season);
  const aLore = managerLore(mp.teamA.manager);
  const bLore = managerLore(mp.teamB.manager);
  return `${ctx}

MATCHUP: ${mp.teamA.manager}(${mp.teamA.wins}-${mp.teamA.losses}, ${mp.teamA.pf.toFixed(1)} total PF, rank #${mp.teamA.rank}) vs ${mp.teamB.manager}(${mp.teamB.wins}-${mp.teamB.losses}, ${mp.teamB.pf.toFixed(1)} total PF, rank #${mp.teamB.rank})
Score: ${mp.scoreA.toFixed(1)} — ${mp.scoreB.toFixed(1)}

${aLore}
${bLore}

Write a 2-paragraph SportsCenter-style matchup recap.
Paragraph 1: How this game went down. Who won and why. Reference both managers' identities and what this result means for them personally — does it extend jonE4's frustration, add to Ryanr9's legend, etc.
Paragraph 2: What this result means for the playoff picture and each manager's season trajectory.

Be specific. Use real manager usernames. Connect to real league history. Never invent scores or past results.`;
}

export function powerRankingsPrompt(standings: TeamStanding[], week: number, season: string): string {
  const ctx = buildFullContext(standings, week, season);
  const ranked = standings.map((t, i) => `${i+1}. ${t.manager} (${t.wins}-${t.losses}, ${t.pf.toFixed(1)}PF)`).join('\n');
  return `${ctx}

CURRENT STANDINGS:
${ranked}

You are Skip Morales. Write your weekly Hoosiers LLC Power Rankings commentary — 4 sharp paragraphs.

Paragraph 1: Your #1 team right now and why. Is AJWARE still the standard? Has Ryanr9 taken over? Make a case.
Paragraph 2: The most overrated team in the current standings — who has a record that flatters them. Be specific about why.
Paragraph 3: The most underrated team — who is sleeping on a manager who is about to make a run. Reference their history.
Paragraph 4: Your championship prediction for the season AND who you guarantee will collapse in the playoffs. Back it up with real history from this league.

Use manager usernames throughout. Be bold. Reference real Hoosiers LLC history.`;
}

export function podcastScriptPrompt(standings: TeamStanding[], week: number, season: string, matchups: MatchupPair[]): string {
  const ctx = buildFullContext(standings, week, season);
  const top = standings.slice(0, 3).map(t => `${t.manager}(${t.wins}-${t.losses})`).join(', ');
  const bot = standings.slice(-3).map(t => `${t.manager}(${t.wins}-${t.losses})`).join(', ');
  const feat = matchups[0];
  return `${ctx}

Write a complete 5-minute podcast script for "Fantasy Insider Network" — Hoosiers LLC Week ${week}, ${season}.
Hosts: Michelle Carter (anchor), Skip Morales (hot takes), Dr. Kevin Park (analytics), Adrian Vazquez (reporter).

All hosts must refer to managers by their Sleeper usernames (AJWARE, Ryanr9, jonE4, etc.).
Every talking point must be grounded in real league history or current season data above.
Never invent scores or results.

Use these exact segment labels on their own line:
[COLD OPEN]
[OPENING HEADLINES]
[BIGGEST STORY]
[MATCHUP BREAKDOWN]
[FRAUD WATCH]
[TRADE RUMORS]
[PLAYOFF IMPLICATIONS]
[DEBATE — SKIP VS KEVIN]
[PREDICTIONS]
[SIGN OFF]

Top of the league: ${top}
Struggling: ${bot}
Featured matchup: ${feat ? `${feat.teamA.manager} vs ${feat.teamB.manager}` : 'TBD'}

Write full dialogue in each host's distinct voice. Make it sound like a real sports podcast — natural banter, arguments, specific references to real Hoosiers LLC history.`;
}

export function debatePrompt(topic: string, personaName: string, side: 'for' | 'against', standings: TeamStanding[], week: number, season: string): string {
  const ctx = buildFullContext(standings, week, season);
  return `${ctx}

Debate topic: "${topic}"
As ${personaName}, argue ${side === 'for' ? 'FOR' : 'AGAINST'} this position in 4-5 sentences.
Stay fully in character. Use manager usernames. Reference real Hoosiers LLC history from the context above.
Be direct and opinionated. No hedging.`;
}

export function tradeReportPrompt(standings: TeamStanding[], week: number, season: string, transactions: {type:string;adds:Record<string,number>|null;roster_ids:number[]}[]): string {
  const ctx = buildFullContext(standings, week, season);
  const rMap = new Map(standings.map(s => [s.roster_id, s.manager]));
  const trades = transactions.filter(t => t.type === 'trade');
  const waivers = transactions.filter(t => t.type === 'waiver' || t.type === 'free_agent');
  const tradeDesc = trades.length > 0
    ? trades.map(t => {
        const m1 = rMap.get(t.roster_ids?.[0]) ?? 'Unknown';
        const m2 = rMap.get(t.roster_ids?.[1]) ?? 'Unknown';
        return `${m1} and ${m2} completed a trade`;
      }).join('; ')
    : 'No confirmed trades this week.';
  const waiverDesc = waivers.length > 0 ? `${waivers.length} waiver/free agent moves processed.` : 'Quiet on the waiver wire.';

  return `${ctx}

ACTUAL TRANSACTIONS THIS WEEK:
Trades: ${tradeDesc}
Waivers: ${waiverDesc}

As Adrian Vazquez, write a 3-paragraph trade and transaction report for Hoosiers LLC Week ${week}.

Paragraph 1: Report on the actual transactions above. If there were trades, describe what happened and speculate on motivation using each manager's known profile. If no trades, report the quiet but speculate on who should be making moves.
Paragraph 2: Given the standings and each manager's situation (jonE4 still chasing a ring, QuinnRicha in rebuild mode, Ryanr9 building a dynasty, BSmitty3030 always active), who are the most likely buyers and sellers? Be specific.
Paragraph 3: In the keeper league context — with the draft coming up — what keeper decisions loom that will define franchises this off-season? Reference specific managers.

Use manager usernames. Reference real history. Use "league sources tell FIN" style.`;
}

export function franchiseProfilePrompt(manager: string, team: TeamStanding, standings: TeamStanding[], season: string): string {
  const ctx = buildLoreContext(`Current: ${team.manager}(${team.wins}-${team.losses}, ${team.pf.toFixed(1)}PF, rank #${team.rank}, luck:${team.luckScore>0?'+':''}${team.luckScore})`);
  const lore = managerLore(manager);
  return `${ctx}

FOCUS FRANCHISE: ${lore}

Write a full ESPN The Magazine / The Athletic-style franchise profile for ${manager} in Hoosiers LLC.

Paragraph 1: Who is ${manager} in the context of this league's history? Reference their archetype (champion, grinder, fallen champion, eternal bridesmaid, ghost manager, new dynasty, etc.) with specific evidence from the history above.
Paragraph 2: Their defining narrative arc — what is the story of their Hoosiers LLC career? What moment or pattern defines them? (jonE4 never winning, Ryanr9's instant dominance, QuinnRicha's fall, BSmitty3030's tireless activity, etc.)
Paragraph 3: What do they need to do in ${season} to change their narrative? What does success look like for them specifically — not generically?
Paragraph 4: Bold prediction for their ${season} season. Where do they finish and why?

Write with genuine sports journalism quality. Specific. Vivid. Every claim grounded in the lore above.`;
}

export function analyticsReportPrompt(standings: TeamStanding[], week: number, season: string): string {
  const ctx = buildFullContext(standings, week, season);
  const luckSorted = [...standings].sort((a,b) => b.luckScore - a.luckScore);
  const unlucky = luckSorted[luckSorted.length - 1];
  const lucky = luckSorted[0];
  const efficient = [...standings].sort((a,b) => b.avgPpg - a.avgPpg)[0];
  return `${ctx}

ANALYTICS SNAPSHOT:
Most unlucky (best record vs expected): ${unlucky?.manager} (luck score: ${unlucky?.luckScore > 0 ? '+' : ''}${unlucky?.luckScore})
Most lucky (overperforming record): ${lucky?.manager} (luck score: ${lucky?.luckScore > 0 ? '+' : ''}${lucky?.luckScore})
Most efficient scorer: ${efficient?.manager} (${efficient?.avgPpg.toFixed(1)} avg PPG)

As Dr. Kevin Park, write a 3-paragraph weekly analytics report for Hoosiers LLC Week ${week}.

Paragraph 1: The luck story this week — who is overperforming their point totals (getting lucky with matchups) and who deserves better than their record? Connect to their historical profile — is this consistent with who they are (e.g., does jonE4's historical consistency match his current numbers, or is something off)?
Paragraph 2: Keeper league value analysis — given where teams stand right now, which manager's keepers are looking like the best investment entering ${season}? Who built their current record on a solid keeper foundation vs lucked into it?
Paragraph 3: A bold statistical prediction for the rest of the season. Back it up with the numbers provided. Who makes the playoffs that people don't expect?

Use manager usernames throughout. Only cite data from the context above.`;
}

export function historyPagePrompt(standings: TeamStanding[], season: string): string {
  const ctx = buildLoreContext();
  return `${ctx}

Write a comprehensive "State of the League" piece for Hoosiers LLC entering the ${season} season. This should read like an ESPN 30-for-30 opening or a Fox Sports season preview special.

Paragraph 1: The founding of Hoosiers LLC — named after the Media LLC where founding members lived freshman year of college — and what the league has become. Establish the emotional stakes.
Paragraph 2: The championship lineage — QuinnRicha winning in 2023, Ryanr9's stunning debut championship in 2024, AJWARE's 2025 title. What does this history tell us about the league's competitive landscape?
Paragraph 3: The defining unsolved story — jonE4 has the best all-time winning percentage in league history and zero championships. This is the league's central dramatic tension. Is ${season} the year it finally changes?
Paragraph 4: The ${season} landscape — what are the two or three biggest questions entering this season? Reference the keeper system and how it shapes the competitive hierarchy.
Paragraph 5: A prediction for how ${season} ends — who lifts the trophy and why.

Write with genuine quality. This is the definitive document of Hoosiers LLC history.`;
}

export function standingsInsightPrompt(standings: TeamStanding[], week: number, season: string): string {
  const ctx = buildFullContext(standings, week, season);
  return `${ctx}

As Dr. Kevin Park, write a standings analysis for Hoosiers LLC through Week ${week}.
Focus on: who is in legitimate playoff position vs who is fooling themselves, the playoff bubble story, and one team whose record doesn't match their talent level (point differential tells a different story than wins). Reference specific managers by username. 2-3 paragraphs.`;
}
