import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') ?? 'drive@brittbowman.ai'
const VECTOR_URL     = 'https://drive.brittbowman.ai'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    const { clientEmail, clientName, practiceName, founderName, senderName } = await req.json()

    if (!clientEmail) {
      return new Response(JSON.stringify({ error: 'clientEmail is required' }), { status: 400, headers: corsHeaders() })
    }

    const greeting = clientName ? `Hi ${clientName.split(' ')[0]},` : 'Hi,'
    const from     = senderName || founderName || 'Your advisor'
    const subject  = practiceName
      ? `Your ${practiceName} workspace is ready`
      : 'Your Visualize workspace is ready'

    const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#060E1C;color:#EEF2FF;margin:0;padding:40px 20px">
  <div style="max-width:480px;margin:0 auto">

    <div style="font-size:12px;font-weight:700;letter-spacing:.1em;color:#00C8FF;text-transform:uppercase;margin-bottom:32px">Visualize</div>

    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin:0 0 12px;line-height:1.25">
      ${practiceName ? `Your ${practiceName} workspace is ready` : 'Your workspace is ready'}
    </h1>

    <p style="font-size:15px;color:#8A9FBF;line-height:1.6;margin:0 0 28px">
      ${greeting}<br><br>
      ${from} has set up your growth workspace in Visualize. Your positioning, offer structure, referral engine, and 90-day plan are loaded and waiting for you.
    </p>

    <a href="${VECTOR_URL}" style="display:inline-block;background:#00C8FF;color:#060E1C;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none;letter-spacing:-.01em;margin-bottom:32px">
      Open my workspace →
    </a>

    <div style="background:#0C1830;border:1px solid #1A2C48;border-radius:8px;padding:16px 18px;margin-bottom:32px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#52608080;text-transform:uppercase;margin-bottom:10px">To sign in</div>
      <div style="font-size:13px;color:#8A9FBF;line-height:1.6">
        ${from} has set up your account. You'll get a separate email to choose your password — once you have, sign in with your email and password at <span style="color:#00C8FF">${VECTOR_URL}</span>.
      </div>
    </div>

    <p style="font-size:13px;color:#52608080;line-height:1.6;margin:0">
      Questions? Reply to this email and it'll reach ${from} directly.
    </p>

  </div>
</body></html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: clientEmail, subject, html }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: corsHeaders() })
    }

    const data = await res.json()
    return new Response(JSON.stringify({ ok: true, id: data.id }), { headers: corsHeaders() })

  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders() })
  }
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  }
}
