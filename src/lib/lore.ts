// ─── HOOSIERS LLC — PERMANENT LEAGUE LORE ────────────────────────────────────
// This file is the factual backbone of all AI-generated content.
// Every claim in here is real. The AI is instructed to only use facts from
// this file or from live Sleeper data — never to invent history.

export const LEAGUE_LORE = {
  name: "Hoosiers LLC",
  founded: "Named after the Media LLC (Living Learning Community) at Indiana University where several founding members lived freshman year.",
  season: "2026",
  leagueId: "1315880118563909632",
  totalTeams: 12,
  playoffTeams: 6,
  format: "Keeper league — managers may keep up to 3 players each year. A kept player costs the same round pick used to draft them the previous season. If a player is kept a second consecutive year, the cost escalates to that player's average draft position (ADP) round on Sleeper from the prior season. This creates real long-term strategic tension around who to keep and at what cost.",

  // ─── CHAMPIONSHIP HISTORY ───────────────────────────────────────────────
  championships: [
    { season: "2025", winner: "AJWARE", notes: "Won the 2025 championship, back-to-back seasons of elite performance." },
    { season: "2024", winner: "Ryanr9", notes: "Won the championship in his very first season in the league — an extraordinary debut. Made the championship game again in 2025, finishing runner-up to AJWARE." },
    { season: "2023", winner: "QuinnRicha", notes: "2023 champion. Fell off significantly — finished 8th in the 2025 final standings." },
  ],

  // ─── 2025 FINAL STANDINGS ───────────────────────────────────────────────
  standings2025: [
    { rank: 1,  manager: "AJWARE",        notes: "2025 champion. The reigning title holder entering 2026. Built a dominant roster." },
    { rank: 2,  manager: "Ryanr9",        notes: "Championship game appearance in only his second season. Already a two-year powerhouse — won it all in 2024, runner-up in 2025." },
    { rank: 3,  manager: "jonE4",         notes: "Third place in 2025. Has the best winning percentage in league history but has never won a championship. The most frustrating storyline in Hoosiers LLC — consistent excellence without a ring." },
    { rank: 4,  manager: "aidenharder",   notes: "Fourth place in 2025. Solid competitor." },
    { rank: 5,  manager: "BSmitty3030",   notes: "Fifth place in 2025. The most active manager in the league — always on the waiver wire, always making moves — but has not competed for a championship. Perpetual mid-tier overachiever." },
    { rank: 6,  manager: "Kaitlyn99",     notes: "Sixth place in 2025. Made the playoffs." },
    { rank: 7,  manager: "jpelms",        notes: "Seventh place in 2025. Known for being inactive. A perennial candidate for tanking accusations." },
    { rank: 8,  manager: "QuinnRicha",    notes: "Eighth place in 2025 — a massive fall from the 2023 championship. Classic title-hangover arc." },
    { rank: 9,  manager: "noahfulf",      notes: "Ninth place in 2025." },
    { rank: 10, manager: "Gdaly4",        notes: "Tenth place in 2025." },
    { rank: 11, manager: "realchase",     notes: "Eleventh place in 2025." },
    { rank: 12, manager: "levijones1520", notes: "Last place in 2025. Has not built a strong track record overall, though competed seriously in at least one season." },
  ],

  // ─── MANAGER PROFILES ────────────────────────────────────────────────────
  managers: {
    AJWARE: {
      username: "AJWARE",
      archetype: "Reigning Champion / Dynasty Builder",
      story: "The defending champion entering 2026. Won the 2025 title and is now the team everyone is gunning for. As a keeper league, the question is whether AJWARE built a sustainable dynasty or a one-year window. Every other manager is scheming to knock them off.",
      strengths: "Championship pedigree, knows how to manage the keeper system to maintain long-term value.",
      narrative_hooks: ["Can they repeat?", "Do they have the keepers to stay elite?", "Is this the start of a dynasty or a one-hit wonder?"],
    },
    Ryanr9: {
      username: "Ryanr9",
      archetype: "Phenom / Back-to-Back Contender",
      story: "Joined the league in 2024 and immediately won the championship — the most stunning debut in Hoosiers LLC history. Came back in 2025 and made the championship game again, losing to AJWARE. In two seasons: championship, runner-up. The rest of the league is terrified of him.",
      strengths: "Elite roster management, clutch playoff performance, wins immediately in new situations.",
      narrative_hooks: ["Is Ryanr9 the best manager in league history?", "Can he get back to the championship and win his second title?", "The AJWARE vs Ryanr9 rivalry is the defining matchup of the current era."],
    },
    jonE4: {
      username: "jonE4",
      archetype: "The Best Manager Never to Win It All",
      story: "Has the best winning percentage in Hoosiers LLC history across all seasons. Consistently finishes near the top. Finished third in 2025. Yet the championship has eluded him entirely. This is the defining narrative of his fantasy career — elite regular season production that somehow never converts to a ring. The league's version of a perennial All-Pro who never gets a Super Bowl.",
      strengths: "Best all-time winning percentage, consistently competitive, strong roster construction.",
      weaknesses: "Has not won a championship despite years of being among the best.",
      narrative_hooks: ["Is jonE4 cursed?", "Will 2026 finally be the year?", "Does consistent regular season success matter if you can never win the title?"],
    },
    aidenharder: {
      username: "aidenharder",
      archetype: "Steady Contender",
      story: "Finished fourth in 2025. A consistent playoff-caliber manager who has yet to break through to the very top.",
      narrative_hooks: ["Dark horse contender", "Can aidenharder make the jump from good to great?"],
    },
    BSmitty3030: {
      username: "BSmitty3030",
      archetype: "The Grinder / Most Active Manager",
      story: "Nobody works the waiver wire harder than BSmitty3030. Constantly making moves, always engaged, fifth place in 2025. But all that activity hasn't translated into a championship run. Raises the philosophical question: does hustle matter more than talent evaluation, or is BSmitty3030 just really busy getting mediocre?",
      strengths: "Most active manager, never asleep on waivers, always engaged.",
      weaknesses: "Has not competed for a championship despite maximum effort.",
      narrative_hooks: ["Is BSmitty3030 the hardest-working manager who can never win the big one?", "At some point does activity become noise?", "The patron saint of 'doing everything right except winning'."],
    },
    Kaitlyn99: {
      username: "Kaitlyn99",
      archetype: "Consistent Playoff Manager",
      story: "Sixth place in 2025, made the playoffs. A reliable presence in the postseason.",
      narrative_hooks: ["Can Kaitlyn99 make a deeper run in 2026?"],
    },
    jpelms: {
      username: "jpelms",
      archetype: "The Ghost / Inactive Manager",
      story: "Seventh place in 2025 despite being known for inactivity. The league manager who the media loves to question — is he tanking? Does he even check the app? When jpelms does well, it's almost more of a story than when anyone else wins.",
      strengths: "Somehow makes the playoffs occasionally despite minimal engagement.",
      weaknesses: "Chronic inactivity, suspected tanker.",
      narrative_hooks: ["Is jpelms even trying?", "How does an inactive manager keep finishing mid-table?", "If jpelms auto-drafts and wins does it prove the rest of the league is overthinking it?"],
    },
    QuinnRicha: {
      username: "QuinnRicha",
      archetype: "The Fallen Champion",
      story: "Won the 2023 championship, then finished eighth in 2025. The poster child for post-championship collapse in keeper leagues — likely let too many key players walk or made poor keeper decisions after winning. Now in full rebuild mode whether they admit it or not.",
      strengths: "Has championship experience and knows what it takes.",
      weaknesses: "Dramatic decline since the 2023 title — the classic champion hangover.",
      narrative_hooks: ["Can QuinnRicha recapture 2023 magic?", "Is this a rebuild or a permanent fall?", "The keeper league is unforgiving to champions who don't plan ahead."],
    },
    noahfulf: {
      username: "noahfulf",
      archetype: "Searching for Consistency",
      story: "Ninth place in 2025. Has not yet established a dominant identity in the league.",
      narrative_hooks: ["Breakout candidate or same story?"],
    },
    Gdaly4: {
      username: "Gdaly4",
      archetype: "On the Rise or Stuck?",
      story: "Tenth place in 2025. Needs a strong 2026 keeper strategy to climb.",
      narrative_hooks: ["What does Gdaly4's 2026 keeper list look like?"],
    },
    realchase: {
      username: "realchase",
      archetype: "Bottom Half Mainstay",
      story: "Eleventh place in 2025. Has ground to make up.",
      narrative_hooks: ["Can realchase make the playoffs in 2026?"],
    },
    levijones1520: {
      username: "levijones1520",
      archetype: "The Boom-or-Bust Wild Card",
      story: "Last place in 2025. Has the reputation of not building consistently well, though did compete seriously in at least one prior season — showing the potential is there. The most volatile history in the league: capable of surprising but also capable of finishing last.",
      strengths: "Has shown the ability to build a serious contender at least once.",
      weaknesses: "Last place in 2025, inconsistent trajectory.",
      narrative_hooks: ["Is levijones1520 in another down year or ready to shock everyone?", "The keeper system might be his path to stability — or it might be the thing that keeps trapping him in the bottom."],
    },
  },

  // ─── KEY NARRATIVES FOR 2026 ─────────────────────────────────────────────
  narratives2026: [
    "AJWARE enters as defending champion — can they repeat, or does Ryanr9 come for revenge?",
    "Ryanr9 is the most successful two-year manager in league history. The championship rematch between AJWARE and Ryanr9 is the storyline of the season.",
    "jonE4 has the best all-time record but zero titles. 2026 could be his year — or another heartbreaking near-miss.",
    "QuinnRicha is a former champion trying to stop the bleeding after an 8th-place finish in 2025.",
    "BSmitty3030 is the most active manager in the league and has never come close to a championship. Maximum effort, minimum rings.",
    "jpelms is an inactive manager who somehow survives. The tanking question never goes away.",
    "The keeper system creates fascinating pre-season storylines — who kept whom, and at what pick cost, shapes the entire season before a ball is thrown.",
  ],

  // ─── RIVALRIES ───────────────────────────────────────────────────────────
  rivalries: [
    { teams: ["AJWARE", "Ryanr9"], description: "The current era's defining rivalry. Champion vs runner-up in 2025. Two elite managers who both know how to win." },
    { teams: ["jonE4", "Everyone"], description: "jonE4's greatest rival is the championship itself. His record says he should have multiple titles. The scoreboard says zero." },
    { teams: ["QuinnRicha", "AJWARE"], description: "Former champion vs current champion. QuinnRicha knows what it takes to win and wants it back." },
  ],

  // ─── KEEPER SYSTEM STORY ANGLES ──────────────────────────────────────────
  keeperAngles: [
    "Which managers protected their elite players at cheap pick costs? Those decisions from last off-season define this year's ceiling.",
    "QuinnRicha's 2023 championship keepers are now very expensive or gone — a case study in why keeper strategy matters more than the trophy.",
    "Ryanr9 joined in 2024, so his keeper costs are naturally low — he drafted his own dynasty from scratch rather than inheriting expensive aging contracts.",
    "BSmitty3030's waiver wire activity likely means he has interesting but volatile keeper options.",
    "jpelms inactive tendencies may mean he forgot to submit keepers or kept suboptimally — a perennial talking point.",
  ],
};

// ─── Helper: Build a rich context string for AI prompts ───────────────────────
export function buildLoreContext(extras?: string): string {
  const champs = LEAGUE_LORE.championships.map(c => `${c.season}: ${c.winner}`).join(', ');
  const s2025 = LEAGUE_LORE.standings2025.map(s => `${s.rank}. ${s.manager}`).join(', ');
  const mgrs = Object.values(LEAGUE_LORE.managers).map(m =>
    `${m.username}(${m.archetype}): ${m.story}`
  ).join('\n');

  return `
LEAGUE: ${LEAGUE_LORE.name}
ORIGIN: ${LEAGUE_LORE.founded}
FORMAT: ${LEAGUE_LORE.format}
SEASON: ${LEAGUE_LORE.season} (current)

CHAMPIONSHIP HISTORY: ${champs}

2025 FINAL STANDINGS: ${s2025}

KEY NARRATIVES ENTERING 2026:
${LEAGUE_LORE.narratives2026.map((n, i) => `${i + 1}. ${n}`).join('\n')}

MANAGER PROFILES:
${mgrs}

RIVALRIES:
${LEAGUE_LORE.rivalries.map(r => `${r.teams.join(' vs ')}: ${r.description}`).join('\n')}

KEEPER SYSTEM ANGLES:
${LEAGUE_LORE.keeperAngles.join('\n')}
${extras ? `\nCURRENT SEASON DATA:\n${extras}` : ''}

CRITICAL INSTRUCTION: Only state facts that are in this document or in the live season data provided. Never invent past results, scores, or events. If something is not in this context, say it is unknown or do not mention it.
`.trim();
}

// ─── Helper: Get a specific manager's narrative summary ──────────────────────
export function managerLore(username: string): string {
  const m = LEAGUE_LORE.managers[username as keyof typeof LEAGUE_LORE.managers];
  if (!m) return `${username}: manager in Hoosiers LLC.`;
  const standing = LEAGUE_LORE.standings2025.find(s => s.manager === username);
  const champ = LEAGUE_LORE.championships.find(c => c.winner === username);
  return [
    `${m.username} (${m.archetype})`,
    m.story,
    standing ? `2025 finish: #${standing.rank}.` : '',
    champ ? `Championship: ${champ.season}.` : '',
  ].filter(Boolean).join(' ');
}
