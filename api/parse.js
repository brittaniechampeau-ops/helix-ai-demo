export const config = { runtime: 'edge' };

// Server-side Anthropic proxy for all DRIVE tools.
// Holds the single ANTHROPIC_API_KEY (Vercel env). Clients NEVER send a key.
//
// Accepts either shape:
//   Legacy (Discover):  { prompt }
//   Full (Intelligence, Vector): { system, messages, model, max_tokens }
// Returns the raw Anthropic Messages response so callers can read
// data.content[0].text unchanged.

const ALLOWED_MODELS = new Set([
  'claude-haiku-4-5-20251001',
  'claude-haiku-4-5',
  'claude-sonnet-4-6',
]);
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS_CAP = 4096;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: 'API key not configured on server' }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  // Model allowlist + token cap keep this public endpoint's blast radius small.
  const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const maxTokens = Math.min(
    Math.max(1, Number(body.max_tokens) || 1200),
    MAX_TOKENS_CAP,
  );

  // Build messages from either the legacy prompt or a full messages array.
  let messages;
  if (Array.isArray(body.messages)) {
    messages = body.messages;
  } else if (typeof body.prompt === 'string') {
    messages = [{ role: 'user', content: body.prompt }];
  } else {
    return json({ error: 'Missing prompt or messages' }, 400);
  }

  const payload = { model, max_tokens: maxTokens, messages };
  if (typeof body.system === 'string' && body.system.trim()) {
    payload.system = body.system;
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await upstream.json();
  return json(data, upstream.status);
}
