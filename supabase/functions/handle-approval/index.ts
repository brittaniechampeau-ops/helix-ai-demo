import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPA_URL         = Deno.env.get('SUPABASE_URL')!
const SUPA_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const url    = new URL(req.url)
  const token  = url.searchParams.get('token') || ''
  const action = url.searchParams.get('action') || ''

  const supa = createClient(SUPA_URL, SUPA_SERVICE_KEY)

  // ── POST: submit changes notes ────────────────────────────
  if (req.method === 'POST') {
    try {
      const body  = await req.json()
      const tok   = body.token || token
      const notes = (body.notes || '').slice(0, 2000)

      if (!tok) return htmlResponse(errorPage('Missing token.'), 400)

      const { error } = await supa
        .from('drive_approvals')
        .update({ status: 'changes_requested', notes, responded_at: new Date().toISOString() })
        .eq('token', tok)

      if (error) return htmlResponse(errorPage(error.message), 500)
      return htmlResponse(confirmPage('changes_requested', ''))
    } catch (e) {
      return htmlResponse(errorPage(String(e)), 500)
    }
  }

  // ── GET: approve or show changes form ────────────────────
  if (!token) return htmlResponse(errorPage('Missing token.'), 400)

  if (action === 'approved') {
    const { data, error } = await supa
      .from('drive_approvals')
      .update({ status: 'approved', responded_at: new Date().toISOString() })
      .eq('token', token)
      .select('client_name')
      .single()

    if (error) return htmlResponse(errorPage(error.message), 500)
    return htmlResponse(confirmPage('approved', data?.client_name || ''))
  }

  if (action === 'changes') {
    return htmlResponse(changesFormPage(token))
  }

  return htmlResponse(errorPage('Unknown action.'), 400)
})

// ── HTML pages ────────────────────────────────────────────

function confirmPage(status: string, clientName: string): string {
  const isApproved = status === 'approved'
  const accent     = isApproved ? '#3BBFA3' : '#FF8A3D'
  const icon       = isApproved ? '✓' : '→'
  const heading    = isApproved ? 'Approved — thank you.' : 'Changes requested — thank you.'
  const body       = isApproved
    ? `Your approval has been recorded${clientName ? ` for the ${clientName} engagement` : ''}. The team will be notified.`
    : 'Your feedback has been recorded. The team will review your notes and follow up.'

  return shell(`
    <div style="text-align:center;padding:40px 0">
      <div style="width:56px;height:56px;border-radius:50%;background:${accent}22;color:${accent};font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">${icon}</div>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 12px;color:#EEF2FF">${heading}</h1>
      <p style="font-size:14px;color:#8A9FBF;line-height:1.6;max-width:360px;margin:0 auto">${body}</p>
    </div>
  `)
}

function changesFormPage(token: string): string {
  const SUPA_FUNC = `${SUPA_URL}/functions/v1`
  return shell(`
    <h1 style="font-size:20px;font-weight:700;margin:0 0 10px;color:#EEF2FF">Request Changes</h1>
    <p style="font-size:14px;color:#8A9FBF;margin:0 0 20px;line-height:1.6">Describe what you'd like changed. Be as specific as possible — field names, values, or rules.</p>
    <textarea id="notes" placeholder="e.g. The 'Region' field needs to include APAC. The naming convention should use underscores not hyphens…" style="width:100%;min-height:140px;background:#0C1830;border:1px solid #1A2C48;border-radius:8px;padding:12px 14px;color:#EEF2FF;font-size:14px;font-family:inherit;line-height:1.6;resize:vertical;outline:none;box-sizing:border-box"></textarea>
    <button onclick="submit()" style="margin-top:14px;background:#FF8A3D;color:#060E1C;font-weight:700;font-size:14px;padding:13px 28px;border-radius:8px;border:none;cursor:pointer;width:100%">Submit Feedback</button>
    <div id="msg" style="margin-top:12px;font-size:13px;color:#8A9FBF;min-height:20px"></div>
    <script>
    async function submit() {
      const notes = document.getElementById('notes').value.trim();
      if (!notes) { document.getElementById('msg').textContent = 'Please enter your feedback before submitting.'; return; }
      document.querySelector('button').disabled = true;
      document.querySelector('button').textContent = 'Submitting…';
      try {
        const res = await fetch('${SUPA_FUNC}/handle-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: '${token}', notes }),
        });
        const html = await res.text();
        document.open(); document.write(html); document.close();
      } catch (e) {
        document.getElementById('msg').textContent = 'Error submitting — please try again.';
        document.querySelector('button').disabled = false;
        document.querySelector('button').textContent = 'Submit Feedback';
      }
    }
    </script>
  `)
}

function errorPage(msg: string): string {
  return shell(`
    <div style="text-align:center;padding:40px 0">
      <div style="font-size:32px;margin-bottom:16px;opacity:.4">⚠</div>
      <h1 style="font-size:18px;font-weight:700;margin:0 0 10px;color:#EEF2FF">Something went wrong</h1>
      <p style="font-size:13px;color:#8A9FBF">${msg}</p>
    </div>
  `)
}

function shell(content: string): string {
  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DRIVE · Review</title>
<style>*{box-sizing:border-box;margin:0;padding:0}</style>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#060E1C;color:#EEF2FF;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px">
<div style="max-width:480px;width:100%;background:#0C1830;border:1px solid #1A2C48;border-radius:16px;padding:36px">
  <div style="font-size:11px;font-weight:700;letter-spacing:.12em;color:#8B7FEC;text-transform:uppercase;margin-bottom:24px">✦ DRIVE</div>
  ${content}
</div>
</body></html>`
}

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
