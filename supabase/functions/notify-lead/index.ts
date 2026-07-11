import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const NOTIFY_EMAIL   = Deno.env.get('NOTIFY_EMAIL') ?? 'britt@brittbowman.ai'
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL')   ?? 'drive@brittbowman.ai'
const VECTOR_URL     = Deno.env.get('VECTOR_URL')   ?? 'https://vector.brittbowman.ai/vector.html'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    const body = await req.json()
    const { email, org_name, org_industry, org_team, org_rev, scores, path, type, team_emails } = body

    const isGate = type === 'gate'
    const isSaved = type === 'saved'

    // ── 1. Notify Britt ─────────────────────────────────────────────────────
    const adminSubject = isGate
      ? `New DRIVE lead: ${org_name || email}`
      : `DRIVE assessment complete: ${org_name}`

    const scoreRows = scores ? `
      <tr><td style="padding:4px 8px;color:#6B7A8D">Resolve</td><td style="padding:4px 8px;font-weight:600;color:${scoreColor(scores.taxonomy)}">${scores.taxonomy ?? '—'}/8</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Intelligence</td><td style="padding:4px 8px;font-weight:600;color:${scoreColor(scores.signal)}">${scores.signal ?? '—'}/8</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Vector</td><td style="padding:4px 8px;font-weight:600;color:${scoreColor(scores.strategy)}">${scores.strategy ?? '—'}/8</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Engine</td><td style="padding:4px 8px;font-weight:600;color:${scoreColor(scores.execution)}">${scores.execution ?? '—'}/8</td></tr>
    ` : '<tr><td colspan="2" style="padding:4px 8px;color:#6B7A8D">Scores pending</td></tr>'

    const adminHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#07090C;color:#E8EDF3;margin:0;padding:32px">
  <div style="max-width:520px;margin:0 auto">
    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#3BBFA3;margin-bottom:24px">✦ DRIVE</div>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:-.03em">${adminSubject}</h1>
    <p style="color:#6B7A8D;font-size:14px;margin:0 0 28px">${isGate ? 'A visitor reached the end of the assessment and entered their email.' : 'Assessment complete — client workspace is ready.'}</p>
    <table style="width:100%;border-collapse:collapse;background:#0E1218;border-radius:10px;overflow:hidden;margin-bottom:24px">
      <tr><td style="padding:4px 8px;color:#6B7A8D">Email</td><td style="padding:4px 8px;font-weight:600">${email}</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Org</td><td style="padding:4px 8px;font-weight:600">${org_name || '—'}</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Industry</td><td style="padding:4px 8px">${org_industry || '—'}</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Team size</td><td style="padding:4px 8px">${org_team || '—'}</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Revenue</td><td style="padding:4px 8px">${org_rev || '—'}</td></tr>
      <tr><td style="padding:4px 8px;color:#6B7A8D">Path</td><td style="padding:4px 8px">${path || '—'}</td></tr>
      ${scoreRows}
    </table>
    <a href="https://vector.brittbowman.ai/admin.html" style="display:inline-block;background:#3BBFA3;color:#07090C;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;text-decoration:none">View in Lead Dashboard →</a>
  </div>
</body></html>`

    await sendEmail(NOTIFY_EMAIL, adminSubject, adminHtml)

    // ── 2. Welcome email to client + teammates (only on full save, not gate) ──
    const welcomeRecipients: string[] = [];
    if (isSaved && email && email !== NOTIFY_EMAIL) welcomeRecipients.push(email);
    if (isSaved && Array.isArray(team_emails)) {
      for (const te of team_emails) {
        if (te && te !== NOTIFY_EMAIL && !welcomeRecipients.includes(te)) welcomeRecipients.push(te);
      }
    }
    for (const recipient of welcomeRecipients) {
      const clientHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#07090C;color:#E8EDF3;margin:0;padding:32px">
  <div style="max-width:520px;margin:0 auto">
    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#3BBFA3;margin-bottom:24px">✦ DRIVE</div>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:-.03em">Your AI readiness workspace is ready</h1>
    <p style="color:#6B7A8D;font-size:14px;margin:0 0 24px">
      ${org_name ? `We've completed your AI readiness assessment for <strong style="color:#E8EDF3">${org_name}</strong>.` : 'Your AI readiness assessment is complete.'}
      Your scores are loaded into your private workspace — click below to access it.
    </p>

    ${scores ? `
    <table style="width:100%;border-collapse:collapse;background:#0E1218;border-radius:10px;overflow:hidden;margin-bottom:28px">
      <tr><td colspan="2" style="padding:8px 12px;font-size:11px;font-weight:600;letter-spacing:.06em;color:#6B7A8D;border-bottom:1px solid #1A2030">READINESS SCORES</td></tr>
      <tr><td style="padding:8px 12px;color:#6B7A8D">Resolve</td><td style="padding:8px 12px;font-weight:600;color:${scoreColor(scores.taxonomy)}">${scores.taxonomy ?? '—'} / 8</td></tr>
      <tr><td style="padding:8px 12px;color:#6B7A8D">Intelligence</td><td style="padding:8px 12px;font-weight:600;color:${scoreColor(scores.signal)}">${scores.signal ?? '—'} / 8</td></tr>
      <tr><td style="padding:8px 12px;color:#6B7A8D">Vector</td><td style="padding:8px 12px;font-weight:600;color:${scoreColor(scores.strategy)}">${scores.strategy ?? '—'} / 8</td></tr>
      <tr><td style="padding:8px 12px;color:#6B7A8D">Engine</td><td style="padding:8px 12px;font-weight:600;color:${scoreColor(scores.execution)}">${scores.execution ?? '—'} / 8</td></tr>
    </table>` : ''}

    <a href="${VECTOR_URL}" style="display:inline-block;background:#3BBFA3;color:#07090C;font-weight:600;font-size:14px;padding:14px 24px;border-radius:8px;text-decoration:none;margin-bottom:28px">Open my workspace →</a>

    <p style="color:#6B7A8D;font-size:13px;margin:0">
      Enter your email address to sign in — no password needed. Your readiness data will be waiting.<br><br>
      Questions? Reply to this email.
    </p>
  </div>
</body></html>`

      await sendEmail(recipient, `Your AI readiness workspace is ready — ${org_name || 'DRIVE'}`, clientHtml)
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders() })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders() })
  }
})

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
    throw new Error(err)
  }
  return res.json()
}

function scoreColor(v: number | undefined) {
  if (v == null) return '#6B7A8D'
  if (v >= 6) return '#3BBFA3'
  if (v >= 4) return '#E8C36B'
  return '#E87070'
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  }
}
