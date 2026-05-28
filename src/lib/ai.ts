import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

export async function generate(prompt: string, system?: string, maxTokens = 1000): Promise<string> {
  const msg = await client().messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: maxTokens,
    system: system ?? 'You are a sports media personality covering a fantasy football league called Hoosiers LLC. Be specific, grounded in facts provided, and treat fantasy events with the seriousness of real professional sports coverage.',
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content.filter(b => b.type === 'text').map(b => (b as {type:'text';text:string}).text).join('');
}

export async function generateBatch(
  items: { key: string; prompt: string; system?: string; maxTokens?: number }[]
): Promise<Record<string, string>> {
  const results = await Promise.allSettled(
    items.map(i => generate(i.prompt, i.system, i.maxTokens ?? 1000))
  );
  const out: Record<string, string> = {};
  items.forEach((item, idx) => {
    const r = results[idx];
    out[item.key] = r.status === 'fulfilled' ? r.value : `[Error: ${(r.reason as Error)?.message}]`;
  });
  return out;
}
