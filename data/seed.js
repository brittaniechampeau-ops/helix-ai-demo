#!/usr/bin/env node
/**
 * Vector Layer 3 — Knowledge Base Seeder
 *
 * Prerequisites:
 *   npm install @supabase/supabase-js
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node data/seed.js
 *
 * Safe to re-run — uses upsert on the stable `id` field.
 * Set DRY_RUN=true to preview without inserting.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DRY_RUN          = process.env.DRY_RUN === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars before running.');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function seed() {
  const seedPath = path.join(__dirname, 'seed-knowledge.json');
  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const items = raw.knowledge_items;

  console.log(`\nVector Layer 3 — Knowledge Base Seed`);
  console.log(`──────────────────────────────────────`);
  console.log(`Source:  ${seedPath}`);
  console.log(`Items:   ${items.length}`);
  console.log(`Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`──────────────────────────────────────\n`);

  // Count by type
  const byType = {};
  items.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });
  console.log('By type:', byType, '\n');

  if (DRY_RUN) {
    console.log('Sample item:', JSON.stringify(items[0], null, 2));
    console.log('\nDry run complete — no rows written.');
    return;
  }

  let ok = 0, failed = 0;
  const errors = [];

  for (const item of items) {
    const row = {
      id:             item.id,
      type:           item.type,
      content:        item.content,
      metadata:       item.metadata || {},
      outcome_signal: item.outcome_signal || null,
      source:         item.source || 'synthetic-seed',
      practice_id:    item.practice_id || null,
    };

    const { error } = await supa
      .from('knowledge')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      failed++;
      errors.push({ id: item.id, error: error.message });
      process.stdout.write(`✗ ${item.id}\n`);
    } else {
      ok++;
      process.stdout.write(`✓ ${item.id}\n`);
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`Done: ${ok} inserted, ${failed} failed`);

  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  ${e.id}: ${e.error}`));
    process.exit(1);
  }

  // Verify row count
  const { count } = await supa
    .from('knowledge')
    .select('id', { count: 'exact', head: true });
  console.log(`Total rows in knowledge table: ${count}`);
}

seed().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
