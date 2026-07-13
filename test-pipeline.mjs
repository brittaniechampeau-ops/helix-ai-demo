// Vector pipeline test suite
// Tests each sample file individually, then all combined, then a conflict scenario.
// Calls the real Supabase edge function and validates every output field.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES = path.join(__dir, 'samples');

const SUPABASE_URL = 'https://ilhljjkiijmjpwinovzj.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGxqamtpaWptanB3aW5vdnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTk4MjIsImV4cCI6MjA5OTE5NTgyMn0.w8asDSA-rXuaDfujC2dr4J-EKCzlCVABOuq3VQeeFsE';

// ── Text extractors (mirrors browser logic) ──────────────────────────────────

async function extractVtt(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

async function extractTxt(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

async function extractDocx(filePath) {
  const mammoth = (await import('mammoth')).default;
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractPptx(filePath) {
  const JSZip = (await import('jszip')).default;
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const slideFiles = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  const slideTexts = [];
  for (const name of slideFiles) {
    const xml = await zip.files[name].async('string');
    const matches = xml.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
    const texts = matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    if (texts.length) slideTexts.push(texts.join(' '));
  }
  if (!slideTexts.length) throw new Error('No readable text in PPTX');
  return `[PRESENTATION: ${path.basename(filePath)}]\n\nSlide content:\n\n${slideTexts.map((t, i) => `Slide ${i+1}: ${t}`).join('\n')}`;
}

async function extractPdf(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const buf = fs.readFileSync(filePath);
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(it => it.str).join(' '));
  }
  return pages.join('\n\n');
}

async function extractFile(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (ext === 'vtt' || ext === 'txt') return extractTxt(filePath);
  if (ext === 'docx') return extractDocx(filePath);
  if (ext === 'pptx') return extractPptx(filePath);
  if (ext === 'pdf') return extractPdf(filePath);
  throw new Error('Unknown extension: ' + ext);
}

function bundleSources(sources) {
  return sources.map(s => `=== ${s.label.toUpperCase()} ===\n\n${s.text}`).join('\n\n');
}

// ── Edge function call ───────────────────────────────────────────────────────

async function callEdgeFunction(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/analyze-sources`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'apikey': SUPABASE_ANON,
      },
      body: JSON.stringify({ text, posExamples: [], offerExamples: [], caseExamples: [] })
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    return await res.json();
  } catch(e) {
    clearTimeout(timeout);
    throw e;
  }
}

// ── Field validator ───────────────────────────────────────────────────────────

const REQUIRED_FIELDS = [
  { path: 'practice.name',        label: 'practice.name' },
  { path: 'practice.founder',     label: 'practice.founder' },
  { path: 'diag.size',            label: 'diag.size' },
  { path: 'diag.who',             label: 'diag.who' },
  { path: 'diag.market',          label: 'diag.market' },
  { path: 'diag.motion',          label: 'diag.motion' },
  { path: 'diag.constraint',      label: 'diag.constraint' },
  { path: 'pos.buyer',            label: 'pos.buyer' },
  { path: 'pos.constraint',       label: 'pos.constraint' },
  { path: 'pos.oneline',          label: 'pos.oneline' },
  { path: 'pos.offer1.name',      label: 'pos.offer1.name' },
  { path: 'pos.offer1.price',     label: 'pos.offer1.price' },
  { path: 'pos.offer2.name',      label: 'pos.offer2.name' },
  { path: 'pos.offer2.price',     label: 'pos.offer2.price' },
  { path: 'pos.offer3.name',      label: 'pos.offer3.name' },
  { path: 'pos.offer3.price',     label: 'pos.offer3.price' },
  { path: 'contacts',             label: 'contacts (array, ≥1)', check: v => Array.isArray(v) && v.length > 0 },
  { path: 'cases',                label: 'cases (array, ≥1)',    check: v => Array.isArray(v) && v.length > 0 },
];

function getPath(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => o?.[k], obj);
}

function validate(data) {
  const missing = [];
  const populated = [];
  for (const field of REQUIRED_FIELDS) {
    const val = getPath(data, field.path);
    const ok = field.check ? field.check(val) : (val !== null && val !== undefined && val !== '');
    if (ok) populated.push(field.label);
    else missing.push(field.label);
  }
  return { missing, populated };
}

// ── Pretty print ─────────────────────────────────────────────────────────────

const GREEN = '\x1b[32m';
const RED   = '\x1b[31m';
const CYAN  = '\x1b[36m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';
const RESET = '\x1b[0m';

function printResult(testName, data, durationMs) {
  const { missing, populated } = validate(data);
  const pass = missing.length === 0;
  const status = pass ? `${GREEN}${BOLD}PASS${RESET}` : `${RED}${BOLD}FAIL${RESET}`;
  console.log(`\n${BOLD}${CYAN}━━ ${testName} ━━${RESET} ${status} ${DIM}(${(durationMs/1000).toFixed(1)}s)${RESET}`);
  console.log(`${GREEN}  ✓ Populated (${populated.length}):${RESET} ${populated.join(', ')}`);
  if (missing.length) {
    console.log(`${RED}  ✗ Missing  (${missing.length}):${RESET} ${missing.join(', ')}`);
  }
  // Print key values
  console.log(`${DIM}  practice: ${data.practice?.name} / ${data.practice?.founder}${RESET}`);
  console.log(`${DIM}  oneline:  ${data.pos?.oneline}${RESET}`);
  console.log(`${DIM}  offer1:   ${data.pos?.offer1?.name} @ ${data.pos?.offer1?.price}${RESET}`);
  console.log(`${DIM}  offer2:   ${data.pos?.offer2?.name} @ ${data.pos?.offer2?.price}${RESET}`);
  console.log(`${DIM}  offer3:   ${data.pos?.offer3?.name} @ ${data.pos?.offer3?.price}${RESET}`);
  console.log(`${DIM}  contacts: ${data.contacts?.length} | cases: ${data.cases?.length}${RESET}`);
  if (data.ops?.notes) {
    console.log(`${CYAN}  ops.notes (conflicts): ${data.ops.notes}${RESET}`);
  }
  return pass;
}

// ── Run a single test ────────────────────────────────────────────────────────

async function runTest(testName, sources) {
  const bundled = bundleSources(sources);
  console.log(`\n${DIM}  → Sending ${Math.round(bundled.length/1000)}k chars to edge function...${RESET}`);
  const t0 = Date.now();
  const data = await callEdgeFunction(bundled);
  return printResult(testName, data, Date.now() - t0);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${BOLD}${CYAN}Vector Pipeline Test Suite${RESET}`);
  console.log(`${DIM}Edge function: ${SUPABASE_URL}/functions/v1/analyze-sources${RESET}`);

  // Load all files upfront
  console.log('\nExtracting text from sample files...');
  const transcript = { label: 'Transcript', text: await extractFile(path.join(SAMPLES, 'sample_transcript.vtt')) };
  console.log(`  ✓ transcript.vtt   ${Math.round(transcript.text.length/1000)}k chars`);

  const deck = { label: 'Pitch Deck', text: await extractFile(path.join(SAMPLES, 'sample_pitch_deck.pptx')) };
  console.log(`  ✓ pitch_deck.pptx  ${Math.round(deck.text.length/1000)}k chars`);

  const proposal = { label: 'Proposal', text: await extractFile(path.join(SAMPLES, 'sample_proposal.docx')) };
  console.log(`  ✓ proposal.docx    ${Math.round(proposal.text.length/1000)}k chars`);

  const cases = { label: 'Case Studies', text: await extractFile(path.join(SAMPLES, 'sample_case_studies.pdf')) };
  console.log(`  ✓ case_studies.pdf ${Math.round(cases.text.length/1000)}k chars`);

  const results = [];

  // ── TEST 1: Transcript only ──
  results.push(await runTest('TEST 1: Transcript only (.vtt)', [transcript]));

  // ── TEST 2: Pitch deck only ──
  results.push(await runTest('TEST 2: Pitch deck only (.pptx)', [deck]));

  // ── TEST 3: Proposal only ──
  results.push(await runTest('TEST 3: Proposal only (.docx)', [proposal]));

  // ── TEST 4: Case studies only ──
  results.push(await runTest('TEST 4: Case studies only (.pdf)', [cases]));

  // ── TEST 5: Transcript + deck (may conflict on pricing/team details) ──
  results.push(await runTest('TEST 5: Transcript + Pitch Deck', [transcript, deck]));

  // ── TEST 6: All 4 sources ──
  results.push(await runTest('TEST 6: All 4 sources combined', [transcript, deck, proposal, cases]));

  // ── TEST 7: CONFLICT — deck has $8.5K entry vs transcript $22-35K range only ──
  // Inject a modified deck that states a different price to test conflict handling
  const conflictDeck = {
    label: 'Pitch Deck (CONFLICT VERSION)',
    text: deck.text.replace('$22,000–$35,000', '$55,000–$75,000').replace('$8,500', '$15,000')
  };
  results.push(await runTest('TEST 7: Transcript vs conflicting deck pricing', [transcript, conflictDeck]));

  // ── Summary ──
  const passed = results.filter(Boolean).length;
  console.log(`\n${BOLD}━━ SUMMARY ━━${RESET}`);
  console.log(`${passed === results.length ? GREEN : RED}${BOLD}${passed}/${results.length} tests passed${RESET}\n`);
}

main().catch(e => { console.error(RED + 'Fatal: ' + RESET, e); process.exit(1); });
