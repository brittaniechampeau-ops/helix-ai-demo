# Helix AI — Demo Script
## For: Paul Yacoubian
## Format: Same-day executive demo | ~20 minutes
## Tone: Founder-to-founder | Concrete, fast, no fluff

---

## THE SETUP (30 seconds before you start)

Have three windows open and ready to tab between:
1. The Northstar AgentOps GTM deck (PDF or markdown rendered)
2. The Helix AI "context extraction" output (the sample_context_output.md)
3. The Salesforce campaign structure + target contact list (the CSVs, ideally in a spreadsheet)

You're not demoing a product UI. You're demoing a workflow. The demo IS the output.

---

## PART 1: THE PAIN (2 minutes)

**What you say:**

"Paul — here's the problem I keep seeing. Every enterprise marketing team I talk to is sitting on this pile of strategy. Decks, campaign briefs, ICP docs, positioning guides. Really good stuff. And then they're also sitting inside Salesforce, HubSpot, Marketo — trying to run campaigns.

And the translation between those two worlds? It's a human. Usually three humans. A PMM who wrote the deck, an ops person who builds the segments, and an SDR manager who has to explain to their team what the campaign is actually about.

That process takes two to three weeks. It introduces drift at every step. And by the time a campaign is live, it's already a lossy copy of the strategy that was on slide one.

The problem isn't AI content generation. Everyone's already got that. The problem is there's no layer that translates strategy into execution context. The gap between a PowerPoint and a Salesforce campaign is still a human being."

**Why this lands with Paul:**
- He's built AI tools for knowledge workers. He immediately gets the "context translation" frame.
- The "lossy copy" line is memorable. Use it.
- The gap between creative and operational systems is a problem he's watched from the AI side.

---

## PART 2: THE PRODUCT PROMISE (1 minute)

**What you say:**

"Helix AI is a GTM context engine. You upload a deck. You get back Salesforce-ready execution context.

Campaign hierarchy. Audience segments. Targeting rules. Buying committee structure. Persona-specific messaging. Contact matching against your CRM. And a scored, deduplicated target list — ready to import.

Not a summary. Not a chatbot. Structured data. JSON. CSVs. Objects your CRM can actually consume.

Let me show you exactly what that looks like."

**Why this lands:**
- The "not a summary, not a chatbot" line immediately differentiates from every LLM wrapper he's seen.
- Structured data → CRM is a concrete, differentiable claim.

---

## PART 3: THE DEMO FLOW (12 minutes)

### Screen 1: The Input (1 minute)

**Show:** The Northstar AgentOps GTM deck (helix_gtm_launch_deck.md)

**What you say:**

"Here's the input. A 10-slide GTM launch deck for a fictional company — Northstar AI — launching an AI agent governance product into financial services. This deck has everything a good deck has: ICP, personas, pain points, value props, competitive positioning, offers, CTAs, sales plays.

This is what lives in Google Drive or Notion right now at every enterprise company. It's the strategy. It's correct. It's useful. And it's completely isolated from the systems that need to act on it."

**What to point at:** Slide 5 (product), Slide 3 (buying committee table), Slide 9 (offers). These three slides contain the most execution-relevant data and they're the most visually impressive to scroll through quickly.

---

### Screen 2: The Extraction Output (4 minutes)

**Show:** sample_context_output.md — start with Section 1 (Executive Summary), then jump to the JSON

**What you say:**

"Now here's what Helix produces. First: a plain-language executive summary. Three sentences that tell a Salesforce admin exactly what this campaign is for, who it's targeting, and what action to drive — without them ever reading the deck.

But that's the easy part. Here's the real output."

**Tab to the JSON block in Section 2.**

"This is fully structured campaign context. Every field labeled with a confidence indicator — whether it was explicit in the deck, inferred from context, or missing entirely. ICP fields. Buying committee. Persona-by-persona pain points and value props. Regulatory triggers by region. Sales plays. Content asset recommendations.

This isn't a summary. This is data that can pipe directly into a CRM. Every field here maps to a Salesforce field, a HubSpot property, a Marketo token."

**Then show Section 3 — Salesforce Campaign Hierarchy.**

"And here's where it gets operationally useful. Helix doesn't just extract the data — it generates the campaign structure. Parent campaign, child campaigns by segment and region, recommended types, descriptions, CTAs. This is a Salesforce import file. Day one."

**Pause here.** Let Paul react. He'll probably ask about the confidence scoring or the inference labeling. That's your opening to talk about the data quality layer.

---

### Screen 3: The CRM Matching (5 minutes)

**Show:** sample_crm_matching_output.md — start with Section 1 (Matching Summary), then Section 2 (Top 20)

**What you say:**

"Now here's where it gets really interesting for an enterprise GTM team. You've got the extracted context. Now you run it against your CRM.

We fed in 75 fake CRM contacts — intentionally messy. Missing fields. Duplicate records. Out-of-ICP accounts. Sanctioned entities that got into the database. This is what real CRM data looks like.

Helix processes the full dataset against the extracted ICP and targeting rules. Hard exclusions first — two contacts flagged DO NOT CONTACT, three duplicate pairs identified. Then scoring."

**Scroll to the Top 20 contacts.**

"Here's the output. 38 contacts in the target list. Each one scored against the GTM context. Segment assigned. Recommended offer matched. Salesforce campaign member status assigned. And buying committee role mapped — so you know if you've got the economic buyer, the champion, or just an influencer.

Notice Sarah Whitfield at the top — score of 107. Why? CCO at a Tier 1 insurance company, engagement score of 92, attended an EU AI Act webinar 44 days ago. The system matched her to the CCO persona, the EU AI Act regulatory trigger, and the primary Readiness Assessment offer — all from the deck.

None of that required a human to decide. That was all derived from the deck content."

**Then show Section 3 — Top 10 Accounts.**

"And at the account level: which accounts have buying committee coverage gaps. Citadel Financial has a CRO but needs CCO, CIO, CTO, and Head of CX. Global Trust Bank is at Negotiation with a single CIO — single-threaded deal risk. The system surfaces that.

That's the kind of insight your ops team is manually building in a spreadsheet right now."

---

### Screen 4: The Export Files (2 minutes)

**Show:** Open the CSVs in a spreadsheet app if possible — salesforce_campaign_structure.csv and target_contact_list.csv

**What you say:**

"And here's the final output. These are import-ready CSVs. Salesforce campaign structure — nine campaign records, parent/child hierarchy, type, status, target segment, CTA. Drop this into Salesforce Data Loader. Done.

Target contact list — 38 contacts, sorted by match score, with campaign member status, recommended offer, buying committee role, enrichment flags.

From deck to this: fully automated. The human adds judgment. Helix removes the translation work."

---

## PART 4: WHY THIS MATTERS (2 minutes)

**What you say:**

"The reason enterprise marketing teams are slow isn't strategy. They have good strategy. The reason they're slow is the translation tax — the manual work of moving context from the strategy layer to the execution layer.

Every campaign is a new translation project. New deck, new brief, new Google Doc — and then a two-week process of re-explaining it to ops, to the MAP team, to the SDRs.

Helix removes that tax. And because the output is structured and labeled, it gets better as data improves. You add a sales play doc, confidence goes up. You add a competitive battlecard, the messaging layer gets richer. The system compounds.

This is the wedge. Once you're inside a marketing tech stack as the context layer, every piece of strategy that flows through that org becomes a Helix input. Decks, briefs, playbooks, call transcripts, win/loss reports. All of it translates into execution context."

---

## PART 5: WHY SALESFORCE IS THE RIGHT SPOKE (1 minute)

**What you say:**

"Why Salesforce first? Three reasons.

One: Salesforce is where marketing execution actually lives for enterprise companies. The campaign hierarchy, the contact records, the opportunity data — that's the source of truth for go-to-market.

Two: Salesforce has the cleanest, most structured data model. Campaign objects, contact objects, campaign member objects — they map cleanly to what Helix extracts. The import path is straightforward.

Three: Salesforce is the hub that connects to everything else. Build the context layer in Salesforce, and you get HubSpot, Marketo, Eloqua, and ServiceNow for free — because they all sync to or from Salesforce.

The deck parser is the wedge. Salesforce is the right first integration. But the product isn't about Salesforce — it's about the context translation layer that sits above every CRM and MAP."

---

## PART 6: HOW THIS BECOMES A $10M PRODUCT (2 minutes)

**What you say:**

"The deck parser is the demo moment. But the real business is the context layer.

Step one: deck in, Salesforce data out. That's what we just showed. That's the wedge — it's immediately useful, obviously valuable, easy to demo.

Step two: the context graph. Every input — deck, brief, transcript, battlecard, ICP doc — enriches a persistent campaign context model. Over time, Helix knows your ICP better than your last PMM who left. It knows which segments work, which offers convert, which personas actually buy.

Step three: bidirectional sync. Helix doesn't just extract from strategy docs — it reads back from execution systems. Opportunity closed? Helix updates the ICP confidence model. Email campaign underperformed? Helix flags the messaging hypothesis.

The pricing model is straightforward: per seat for RevOps teams, plus per-extraction for high-volume campaigns. Enterprise deal size: $80K–$200K ARR. Six to eight enterprise customers is $1M ARR. Land ten Fortune 500 marketing orgs and you're at $10M without a consumer business in sight.

The moat is the context model. Salesforce has the data. Helix has the intelligence layer that makes it usable."

---

## CLOSING LINE

"The question for every enterprise marketing team right now is: how do we move faster without losing quality? The answer they keep trying is more headcount, more tools, more AI-generated content. None of that solves the translation problem.

Helix solves the translation problem. And every marketing team that uses it compounds its advantage over every team that doesn't."

---

## ANTICIPATED QUESTIONS + ANSWERS

**"How is this different from just using ChatGPT on the deck?"**
ChatGPT gives you prose. Helix gives you structured data with confidence labels, CRM-compatible output, and a campaign hierarchy. A CMO doesn't need a summary. They need import-ready CSVs and a scored contact list. That's the difference between a language model and a context engine.

**"What stops a buyer from just doing this with their own LLM?"**
Prompt engineering the extraction is the easy part. The hard parts are: (1) the output schema that maps to Salesforce/HubSpot/Marketo field models, (2) the contact scoring and deduplication logic, (3) the confidence labeling and gap identification that makes the output trustworthy enough for ops teams to actually use. Those are the product. The LLM is the commodity underneath.

**"What's the go-to-market for Helix itself?"**
Land in RevOps and demand gen teams at mid-market and enterprise B2B companies. The buyer is the VP of Marketing Operations or the VP Demand Gen. The champion is whoever is tired of manually translating strategy docs into campaign builds. Initial outreach: direct to RevOps communities, conference sponsorship at Ops Stars / MOPS, content marketing around the "context tax" problem frame.

**"Is this a point solution or a platform?"**
It starts as a point solution: deck in, Salesforce data out. It becomes a platform when the context model accumulates enough signal to make recommendations — "based on your last five campaigns in financial services, your CRO messaging converts at 2x the CCO messaging in EMEA." That's the platform story. The point solution is the wedge that gets you there.
