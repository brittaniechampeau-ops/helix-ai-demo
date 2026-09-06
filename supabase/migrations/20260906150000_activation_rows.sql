-- Seed the activation rows. Each says what is true today, and where it is stuck.

INSERT INTO public.drive_activation (id, label, deployed, authenticated, armed, schedule_cron, blocked_by_britt, blocked_technically, external_readback) VALUES
  ('stripe-webhook', 'Purchases and fulfilment', true, true, true, 'event-driven',
   NULL, NULL, 'unsigned 401, forged signature 400, one fulfilled test-mode row'),
  ('kit-events', 'Kit subscriber and tag events', true, true, true, 'event-driven',
   NULL, NULL, 'accepted, then duplicate, then stale, verified live'),
  ('calendly-events', 'Booked calls', true, false, false, 'event-driven',
   'One Calendly personal access token', NULL, '503 no signing key, which is correct while disabled'),
  ('cloud-sweep', 'Hourly funnel read and overdue parking', true, true, true, '7,22,37,52 * * * *',
   NULL, NULL, 'manual invocation read 40 completions, 1 purchase, 14 subscribers'),
  ('followup-cron', 'Low-fit follow-up, dry-run', true, true, true, '0 14 * * *',
   NULL, 'FOLLOWUP_AUTOSEND stays off until three dry-run reports are read', 'answered 503 before the secret; redeployed with it'),
  ('newsletter-capture', 'Sign-ups from the website', false, true, false, 'n/a',
   'One paste into the Squarespace code block on /newsletter', NULL, 'live page still posts to the URL that 404s'),
  ('search-console', 'Traffic readings', true, false, false, 'n/a',
   'One Google service-account credential', NULL, 'no property has ever been read; counts report null, never zero'),
  ('linkedin-publish', 'Publishing a post', true, false, false, 'n/a',
   'Create the LinkedIn developer app under the company page', 'Kleo publishes only through a live agent session, and returns no permalink', 'connector verified: publish_now exists, readPost returns no linkedin.com URL'),
  ('kit-draft', 'Newsletter drafts', true, true, true, 'on approval',
   NULL, NULL, 'draft created 201, read back unsent, deleted 204')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label, deployed = EXCLUDED.deployed, authenticated = EXCLUDED.authenticated,
  armed = EXCLUDED.armed, schedule_cron = EXCLUDED.schedule_cron,
  blocked_by_britt = EXCLUDED.blocked_by_britt, blocked_technically = EXCLUDED.blocked_technically,
  external_readback = EXCLUDED.external_readback, updated_at = now();
