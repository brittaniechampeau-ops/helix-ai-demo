import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY   = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL       = Deno.env.get('FROM_EMAIL') ?? 'drive@brittbowman.ai'
const SUPA_URL         = Deno.env.get('SUPABASE_URL')!
const SUPA_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FUNCTION_BASE    = `${SUPA_URL}/functions/v1`

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() })

  try {
    const {
      engagementId, ownerEmail, contactEmail, contactName,
      clientName, summaryJson,
    } = await req.json()

    if (!engagementId || !contactEmail || !clientName) {
      return new Response(JSON.stringify({ error: 'engagementId, contactEmail, clientName required' }), { status: 400, headers: cors() })
    }

    // Generate a secure token
    const token = crypto.randomUUID()

    // Insert approval record
    const supa = createClient(SUPA_URL, SUPA_SERVICE_KEY)
    const { data: record, error: insertErr } = await supa
      .from('drive_approvals')
      .insert({
        engagement_id: engagementId,
        owner_email: ownerEmail,
        client_name: clientName,
        contact_email: contactEmail,
        contact_name: contactName || '',
        approval_type: 'taxonomy',
        summary_json: summaryJson || {},
        status: 'pending',
        token,
        sent_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertErr) throw insertErr

    // Build approve / changes links
    const approveUrl = `${FUNCTION_BASE}/handle-approval?token=${token}&action=approved`
    const changesUrl = `${FUNCTION_BASE}/handle-approval?token=${token}&action=changes`

    // Build taxonomy table rows
    const fields: Array<{ name?: string; field?: string; type?: string; values?: string[]; notes?: string; description?: string }> =
      summaryJson?.taxonomy || []
    const naming: string = summaryJson?.naming?.pattern || ''
    const rules: string[] = (summaryJson?.rules || [])
      .map((r: string | { text?: string; rule?: string }) =>
        typeof r === 'string' ? r : r.text || r.rule || ''
      )
      .filter(Boolean)

    const taxRows = fields.slice(0, 20).map(f => {
      const name = f.name || f.field || ''
      const type = f.type || ''
      const vals = Array.isArray(f.values) ? f.values.join(', ') : (f.notes || f.description || '')
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #1A2C48;color:#EEF2FF;font-size:13px">${esc(name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1A2C48;color:#8A9FBF;font-size:13px">${esc(type)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1A2C48;color:#8A9FBF;font-size:13px">${esc(vals)}</td>
      </tr>`
    }).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#060E1C;color:#EEF2FF;margin:0;padding:40px 20px">
<div style="max-width:600px;margin:0 auto">

  <div style="font-size:11px;font-weight:700;letter-spacing:.12em;color:#8B7FEC;text-transform:uppercase;margin-bottom:28px">✦ DRIVE · Review Request</div>

  <h1 style="font-size:22px;font-weight:700;letter-spacing:-.02em;margin:0 0 10px;line-height:1.3">
    Taxonomy review for ${esc(clientName)}
  </h1>
  <p style="font-size:14px;color:#8A9FBF;line-height:1.6;margin:0 0 28px">
    ${contactName ? `Hi ${esc(contactName.split(' ')[0])}, — ` : ''}Please review the proposed canonical taxonomy and naming convention below, then click Approve or Request Changes.
  </p>

  ${naming ? `
  <div style="background:#0C1830;border:1px solid #1A2C48;border-radius:8px;padding:14px 18px;margin-bottom:20px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.09em;color:#4A5270;text-transform:uppercase;margin-bottom:8px">Naming Convention</div>
    <div style="font-family:monospace;font-size:14px;color:#4DE8FF">${esc(naming)}</div>
  </div>` : ''}

  ${fields.length ? `
  <div style="margin-bottom:20px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.09em;color:#4A5270;text-transform:uppercase;margin-bottom:10px">Canonical Taxonomy Fields</div>
    <table style="width:100%;border-collapse:collapse;background:#0C1830;border:1px solid #1A2C48;border-radius:8px;overflow:hidden">
      <thead><tr>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.06em;color:#4A5270;text-transform:uppercase;border-bottom:1px solid #1A2C48">Field</th>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.06em;color:#4A5270;text-transform:uppercase;border-bottom:1px solid #1A2C48">Type</th>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.06em;color:#4A5270;text-transform:uppercase;border-bottom:1px solid #1A2C48">Values / Notes</th>
      </tr></thead>
      <tbody>${taxRows}</tbody>
    </table>
  </div>` : ''}

  ${rules.length ? `
  <div style="background:#0C1830;border:1px solid #1A2C48;border-radius:8px;padding:14px 18px;margin-bottom:28px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.09em;color:#4A5270;text-transform:uppercase;margin-bottom:10px">Governance Rules</div>
    ${rules.map(r => `<div style="font-size:13px;color:#8A9FBF;padding:5px 0;border-bottom:1px solid #1A2C4844;line-height:1.5">${esc(r)}</div>`).join('')}
  </div>` : ''}

  <div style="display:flex;gap:12px;margin-bottom:36px">
    <a href="${approveUrl}" style="display:inline-block;background:#3BBFA3;color:#060E1C;font-weight:700;font-size:14px;padding:13px 28px;border-radius:8px;text-decoration:none">
      ✓ Approve
    </a>
    <a href="${changesUrl}" style="display:inline-block;background:#1A2C48;color:#EEF2FF;font-weight:700;font-size:14px;padding:13px 28px;border-radius:8px;text-decoration:none;border:1px solid #2A3C58">
      → Request Changes
    </a>
  </div>

  <p style="font-size:12px;color:#4A5270;line-height:1.6;margin:0">
    This review was sent via ✦ DRIVE. Reply to this email with questions.
  </p>

</div>
</body></html>`

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: contactEmail,
        subject: `Review requested: Taxonomy for ${clientName}`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const err = await resendRes.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: cors() })
    }

    return new Response(JSON.stringify({ ok: true, id: record?.id }), { headers: cors() })

  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors() })
  }
})

function esc(s: unknown): string {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  }
}
