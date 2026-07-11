import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    const { text, urls = [], posExamples = [], offerExamples = [], caseExamples = [] } = await req.json()
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text is required' }), { status: 400, headers: corsHeaders() })
    }

    // ── Fetch any URLs via Jina Reader (server-side, handles JS rendering) ──
    let fullText = text
    if (Array.isArray(urls) && urls.length > 0) {
      const fetched = await Promise.allSettled(
        urls.map(async ({ url, label }: { url: string; label: string }) => {
          const jinaUrl = `https://r.jina.ai/${url}`
          const res = await fetch(jinaUrl, {
            headers: { 'Accept': 'text/plain', 'X-Return-Format': 'text' },
            signal: AbortSignal.timeout(15000),
          })
          if (!res.ok) throw new Error(`Jina fetch failed: ${res.status}`)
          const content = await res.text()
          if (!content || content.length < 100) throw new Error('Jina returned empty content')
          return `=== ${label.toUpperCase()} (${url}) ===\n\n${content.slice(0, 15000)}`
        })
      )
      const fetchedSections = fetched
        .map((r, i) => r.status === 'fulfilled' ? r.value : `=== ${urls[i].label.toUpperCase()} ===\n\n[Could not fetch ${urls[i].url} — skipped]`)
        .join('\n\n')
      fullText = text + '\n\n' + fetchedSections
    }

    // ── STAGE 1: Signal Extractor (haiku — fast + cheap) ──────────────────
    const signalData = await callClaude(
      'claude-haiku-4-5-20251001', 'stage1',
      `You are extracting raw facts from consulting intake materials.
Sources are separated by === SECTION HEADERS === — extract signal from all sections.
Where values conflict across sources (e.g. different prices), use the transcript value and note the discrepancy in ops.notes.
Return ONLY valid JSON. Use null for anything not mentioned.

{
  "practice": { "name": "string or null", "founder": "string or null", "email": "string or null", "website": "string or null" },
  "diag": {
    "size": "solo|small|mid|large or null",
    "bdRole": "founder-only|founder-plus|dedicated|team-bd or null",
    "marketState": "warm|transitioning|cold or null",
    "who": "string — ideal client description or null",
    "market": "string — geographic or sector focus or null",
    "motion": "referral|outbound|content|mixed or null",
    "constraint": "string — #1 growth bottleneck or null",
    "crm": [], "pm": [], "storage": [], "comms": [], "calendly": false
  },
  "contacts": [{ "name": "string", "company": "string or null", "type": "past-client|peer|prospect", "status": "not-asked" }],
  "rawCases": [{ "client": "string", "industry": "string or null", "situation": "string", "rawResult": "string — any outcome or metric mentioned" }],
  "ops": { "duration": "string or null", "budget": "string or null", "urgency": "string or null", "notes": "string or null — conflicts between sources, e.g. 'transcript says $20k, proposal says $35k'" }
}

Rules:
- size: solo=1, small=2-5, mid=6-15, large=16+
- bdRole: "founder-only" if founder drives growth alone; "founder-plus" if one other helps; "dedicated" if growth hire exists; "team-bd" if distributed
- marketState: "warm"=strong referral network in niche; "transitioning"=entering new market; "cold"=no reputation there yet
- motion: "referral"|"outbound"|"content"|"mixed"
- crm/pm/storage/comms: only tools explicitly mentioned; use empty array [] if none mentioned — never add comments
- contacts: ALL people named across ALL sources — past clients, referral sources, collaborators, prospects
- rawCases: any client engagements described across ALL sources — even partial, even unnamed
- If sources conflict on a value, prefer the transcript section; note the discrepancy in ops.notes
- Return ONLY the JSON object. No markdown fences. No // comments inside the JSON. No trailing text after the closing brace.`,
      `Source materials:\n\n${fullText.slice(0, 60000)}`,
      2000
    )

    // ── STAGE 2: Parallel — Positioning Agent + Credibility Drafter ───────
    const posExStr = posExamples.length
      ? `\nEXAMPLE POSITIONING from similar practices (match specificity, not content):\n${posExamples.map((e: { content: string }) => `- "${e.content}"`).join('\n')}`
      : ''
    const caseExStr = caseExamples.length
      ? `\nEXAMPLE CASE STUDY FORMAT from similar practices:\n${caseExamples.map((e: { content: string }) => e.content).join('\n\n')}`
      : ''

    const [posData, casesData] = await Promise.all([

      callClaude(
        'claude-sonnet-4-6', 'stage2-pos',
        `You are a positioning specialist for small B2B consulting firms.
Given intake signals about a practice, craft a sharp positioning statement and buyer profile.
Return ONLY valid JSON.
${posExStr}

{
  "buyer": "string — ideal client profile (role, company type, situation)",
  "constraint": "string — the core problem this firm solves",
  "oneline": "string — one plain-language sentence: what they do + for whom. No jargon, no buzzwords.",
  "proof": "string or null — strongest result or credential mentioned"
}

Rules:
- oneline must be a complete sentence a stranger would immediately understand
- buyer should be specific: not just 'CEOs' but 'founders of 10-50 person professional services firms entering a new market'
- constraint should name the pain, not the solution
- Return ONLY the raw JSON object. No markdown fences. No // comments. No trailing text.`,
        `Practice signals:\n${JSON.stringify(signalData, null, 2)}`,
        600
      ),

      callClaude(
        'claude-sonnet-4-6', 'stage2-cases',
        `You are a case study writer for B2B consulting firms.
Structure raw case notes into compelling before/after narratives.
Return ONLY valid JSON array (may be empty []).
${caseExStr}

[{
  "client": "string — company or persona name",
  "industry": "string or null",
  "situation": "string — what was happening before engagement",
  "constraint": "string — the real underlying problem",
  "solution": "string — what was done, concisely",
  "result": "string — specific outcome or metric. If none stated, infer a plausible range based on the situation.",
  "quote": "string or null — any quote from the source materials"
}]

Rules:
- result must be specific — numbers, timeframes, percentages where mentioned
- If a result is vague, make it concrete (e.g. 'reduced time' → '~40% reduction in time')
- Draw case material from ALL source sections, not just the transcript
- Return [] if no case material found
- Return ONLY the raw JSON array. No markdown fences. No // comments. No trailing text.`,
        `Raw case notes from materials:\n${JSON.stringify(signalData.rawCases || [], null, 2)}\n\nFull context:\n${text.slice(0, 20000)}`,
        1600
      )
    ])

    // ── STAGE 3: Offer Architect ───────────────────────────────────────────
    const offerExStr = offerExamples.length
      ? `\nEXAMPLE OFFER STRUCTURES from similar practices:\n${offerExamples.map((e: { content: string }) => e.content).join('\n\n')}`
      : ''

    const offersData = await callClaude(
      'claude-sonnet-4-6', 'stage3',
      `You are an offer architect for small B2B consulting firms.
Design exactly 3 tiered offers based on what you know about this practice.
Return ONLY valid JSON.
${offerExStr}

{
  "offer1": { "name": "string — entry/diagnostic offer name", "price": "string", "duration": "string", "desc": "string — what the client gets, 1-2 sentences" },
  "offer2": { "name": "string — core engagement name", "price": "string", "duration": "string", "desc": "string — what the client gets, 1-2 sentences" },
  "offer3": { "name": "string — retained advisory name", "price": "string/month", "duration": "string — minimum commitment", "desc": "string — what the client gets, 1-2 sentences" }
}

Rules:
- offer1: scoped entry point — assessment, audit, or sprint. Lower risk, faster decision. Price: 20-30% of offer2.
- offer2: their core service as described. Use actual scope/price/duration from the transcript if mentioned.
- offer3: ongoing retained relationship. Even if not discussed — infer a monthly fee ~10-15% of offer2 price, 3-month minimum.
- Names should be distinctive, not generic. Not "Consulting Package" — more like "Revenue Architecture Sprint"
- Never return null for any field
- Return ONLY the raw JSON object. No markdown fences. No // comments. No trailing text.`,
      `Practice positioning:\n${JSON.stringify(posData, null, 2)}\n\nPractice signals:\n${JSON.stringify({ diag: signalData.diag, ops: signalData.ops }, null, 2)}`,
      700
    )

    // ── Assemble ───────────────────────────────────────────────────────────
    const result = {
      practice: signalData.practice || {},
      diag:     signalData.diag || {},
      pos: {
        buyer:      posData.buyer      || null,
        constraint: posData.constraint || null,
        oneline:    posData.oneline    || null,
        proof:      posData.proof      || null,
        offer1:     offersData.offer1  || {},
        offer2:     offersData.offer2  || {},
        offer3:     offersData.offer3  || {},
      },
      contacts: signalData.contacts || [],
      cases:    Array.isArray(casesData) ? casesData : [],
      ops: {
        duration:  signalData.ops?.duration || null,
        refAsk:    true,
        caseDraft: false,
      }
    }

    return new Response(JSON.stringify(result), { headers: corsHeaders() })

  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders() })
  }
})

async function callClaude(model: string, stage: string, system: string, userContent: string, maxTokens: number) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }]
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error (${res.status}): ${err}`)
  }

  const data = await res.json()
  const raw = data.content[0].text.trim()
  // Strip markdown code fences (Claude sometimes wraps JSON in ```json ... ```)
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  // Extract outermost JSON — pick regex based on first character to avoid
  // object regex greedily matching inner objects inside an array response
  const firstChar = stripped.trimStart()[0]
  const jsonStr = firstChar === '['
    ? (stripped.match(/\[[\s\S]*\]/) || [])[0]
    : (stripped.match(/\{[\s\S]*\}/) || [])[0]
  if (!jsonStr) throw new Error('No JSON in Claude response')
  // Strip JS-style line comments (// ...) which Claude occasionally adds inside JSON
  const cleanJson = jsonStr.replace(/\/\/[^\n\r"]*/g, '')
  try {
    return JSON.parse(cleanJson)
  } catch (_e1) {
    // Repair: escape unescaped control characters inside string literals
    const repaired = repairJson(cleanJson)
    try {
      return JSON.parse(repaired)
    } catch (e2) {
      console.error(`[${stage}] JSON parse failed after repair. First 500 chars:`, repaired.slice(0, 500))
      throw new Error(`[${stage}] JSON parse failed: ${(e2 as Error).message}`)
    }
  }
}

function repairJson(str: string): string {
  let result = '';
  let inString = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const prev = i > 0 ? str[i - 1] : '';
    if (ch === '"' && prev !== '\\') {
      inString = !inString;
      result += ch;
    } else if (inString && ch === '\n') {
      result += '\\n';
    } else if (inString && ch === '\r') {
      result += '\\r';
    } else if (inString && ch === '\t') {
      result += '\\t';
    } else {
      result += ch;
    }
  }
  return result;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  }
}
