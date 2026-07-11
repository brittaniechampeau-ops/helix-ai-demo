import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const SUPABASE_URL           = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const body = await req.text()

  // Verify Stripe signature
  let event: any
  try {
    event = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (e) {
    console.error('Signature verification failed:', e)
    return new Response('Invalid signature', { status: 400 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const email = session.customer_details?.email ?? session.customer_email
      const customerId = session.customer
      const subscriptionId = session.subscription
      if (email) {
        await supabase.from('subscriptions').upsert({
          email,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'active',
          plan: 'drive-monthly',
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object
      const status = sub.status // 'active' | 'past_due' | 'canceled' | 'unpaid'
      await supabase.from('subscriptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await supabase.from('subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

// Minimal Stripe signature verification (HMAC-SHA256)
async function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=')))
  const timestamp = parts['t']
  const signature = parts['v1']
  const signed = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
  const computed = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
  if (computed !== signature) throw new Error('Signature mismatch')
  return JSON.parse(payload)
}
