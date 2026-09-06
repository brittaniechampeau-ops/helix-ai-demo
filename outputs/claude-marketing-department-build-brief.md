# Britt Marketing Department: Claude Build Brief

## Build objective

Build a private, source-aware marketing operating system for Britt Bowman LLC. It must contain the same four layers advertised in the reference image:

- 50 marketing skills
- 50 named marketing agents
- 50 repeatable marketing systems
- 100 user-invocable prompts

This is not a content calendar, a generic ghostwriter, or a LinkedIn bot. It is a durable marketing department that can create, audit, prepare, route, measure, and improve work across Britt's owned assets, newsletter, speaking, partnerships, offers, website, and social publishing. Kleo remains the drafting, design, scheduling, and publishing surface when useful.

## Operating contract

The implementation target is the existing private `britt-marketing-os` repository. Put project skills at the repository root in `.claude/skills/<skill>/SKILL.md` and named subagents at `.claude/agents/`, so the commands are invocable. Keep workflow definitions in `marketing-systems/` and the human-readable control plane in `marketing-os/`. Do not create an isolated `marketing-department/` subdirectory or move the existing `.claude/` structure.

Every item must be source-aware. It may use a verified fact, a clearly labeled inference, or a question for Britt. It must never silently invent claims, metrics, customer results, client names, access, or current-event facts.

Do not use browser automation, scraping, automated commenting, outreach, connection requests, DMs, likes, follows, or attempts to mimic a human on LinkedIn. Publishing must stay inside Kleo's supported integration or LinkedIn's official publishing route. Any external send, publish, schedule, ad-spend change, CRM write, or destructive action needs explicit approval immediately before execution.

The department serves a paid-first independent practice. Prioritize revenue, qualified conversations, authority with the right buyer, reusable delivery leverage, and then visibility. Do not build campaigns around unvalidated offers or turn a warm relationship into an assumed prospect.

## Source hierarchy

1. Executed SOWs, signed proposals, delivered assets, first-party analytics, and approved public materials.
2. Britt's supplied notes, transcripts, decisions, calendars, and approved working documents.
3. Current authoritative external sources, explicitly cited.
4. Hypotheses, always labelled as such.

Keep private client material and pricing out of public outputs unless Britt specifically authorizes it. Preserve her direct, conversational prose: full sentences, contractions, a real point of view, no em dashes, no generic LinkedIn filler.

## Department architecture

### Control plane

Create these files:

- `marketing-os/brand-and-voice.md`: approved identity, thesis, vocabulary, banned filler, examples, and corrections.
- `marketing-os/offers-and-ctas.md`: current offers, qualification thresholds, approved destinations, CTA routing rules, and claims boundaries.
- `marketing-os/source-registry.md`: authoritative artifacts and freshness dates.
- `marketing-os/editorial-ledger.csv`: every proposed, approved, published, repurposed, or retired asset, source IDs, objective, CTA, channel, and outcome.
- `marketing-os/approval-queue.md`: only work requiring Britt's decision or external authorization.
- `marketing-os/learning-log.md`: what to repeat, change, or stop, with evidence.

### Core agents

Do not run 50 agents in parallel. The 50 named agents are specialized entry points. Route ordinary work through the smallest useful set, usually 1 to 3 agents. The Director agent owns orchestration, scope, and final recommendation.

## 50 skills

1. `source-intake` — classify and register source material.
2. `fact-check` — verify claims and mark evidence gaps.
3. `brand-voice` — apply Britt's actual writing rules.
4. `positioning` — sharpen category, audience, and differentiated point of view.
5. `message-house` — create messaging hierarchy and proof.
6. `audience-segmentation` — define buyer, partner, subscriber, and community cohorts.
7. `icp-qualification` — assess buyer fit and paid next step.
8. `offer-design` — package a constrained, purchasable offer.
9. `pricing-guardrail` — protect scope, cash terms, and value.
10. `competitive-intelligence` — compare public positioning with cited evidence.
11. `market-research` — create source-backed market briefs.
12. `trend-to-thesis` — turn a verified development into a useful argument.
13. `idea-mining` — extract publishable ideas from real work.
14. `editorial-brief` — create Kleo-ready production briefs.
15. `linkedin-post` — produce a source-grounded LinkedIn draft.
16. `newsletter-editor` — produce or edit a newsletter issue.
17. `article-editor` — create long-form owned-content drafts.
18. `carousel-spec` — convert an argument into a slide-by-slide brief.
19. `video-script` — create short-form and talk-derived video scripts.
20. `podcast-brief` — prepare guest pitches, talking points, and follow-up assets.
21. `talk-to-content` — repurpose a talk, webinar, or panel safely.
22. `content-repurposing` — make bounded derivatives from an approved anchor.
23. `content-qa` — check voice, claims, confidentiality, and usefulness.
24. `cta-router` — select the right approved commercial destination.
25. `utm-builder` — create consistent, trackable destinations.
26. `newsletter-growth` — improve subscriber conversion and referral paths.
27. `lead-magnet` — create or improve a lead magnet without giving away diagnosis.
28. `landing-page-cro` — audit and improve landing-page conversion.
29. `website-copy` — write or revise owned-site pages.
30. `seo-content` — plan and audit search-intent content.
31. `ai-search-visibility` — improve evidence, structure, and discoverability for AI search.
32. `email-campaign` — create newsletter, launch, and nurture copy.
33. `follow-up` — create warm, specific relationship follow-ups.
34. `partnership-marketing` — prepare referral, co-sell, and community material.
35. `speaking-marketing` — convert speaking into authority and qualified conversation.
36. `event-marketing` — create only approved event assets and follow-up.
37. `pr-media` — write press, bylines, and media pitches.
38. `social-listening` — synthesize allowed public sources without platform automation.
39. `community` — plan community participation and member value.
40. `influencer-partnerships` — assess and brief credible partners.
41. `customer-proof` — capture evidence without fabricating a case study.
42. `onboarding` — improve client or subscriber onboarding.
43. `lifecycle` — map activation, retention, re-engagement, and referral moments.
44. `campaign-architecture` — design integrated campaigns and handoffs.
45. `launch-management` — manage a bounded offer or asset launch.
46. `project-management` — translate marketing work into owned decisions and milestones.
47. `dashboarding` — define decision-grade measures and reporting.
48. `attribution` — inspect funnel evidence without false precision.
49. `experiment-design` — create controlled marketing tests.
50. `monthly-review` — recommend what to continue, change, or stop.

## 50 agents

1. Marketing Director
2. Chief of Staff
3. Source Librarian
4. Evidence Editor
5. Voice Guardian
6. Positioning Strategist
7. Offer Architect
8. Pricing Guardrail
9. ICP Analyst
10. Buyer Researcher
11. Market Researcher
12. Competitive Analyst
13. Trend Analyst
14. Editorial Director
15. Idea Miner
16. LinkedIn Editor
17. Newsletter Editor
18. Long-Form Editor
19. Carousel Producer
20. Video Producer
21. Podcast Producer
22. Content Repurposing Editor
23. Content QA Editor
24. CTA Strategist
25. Website Editor
26. SEO Strategist
27. AI Search Strategist
28. Landing-Page Optimizer
29. Email Strategist
30. Newsletter Growth Lead
31. Lead-Magnet Strategist
32. Lifecycle Marketer
33. Customer Onboarding Lead
34. Partnership Lead
35. Referral Program Lead
36. Speaking Strategist
37. Event Marketer
38. PR Manager
39. Community Lead
40. Influencer Partnerships Lead
41. Customer Proof Lead
42. Campaign Manager
43. Launch Coordinator
44. Media Buyer
45. Social Listening Analyst
46. Marketing Operations Lead
47. Attribution Analyst
48. Dashboard Analyst
49. Experiment Lead
50. Performance Reviewer

## 50 systems

1. Source registry and freshness review.
2. Brand and voice correction loop.
3. Message-house maintenance.
4. Offer and CTA governance.
5. ICP signal watchlist.
6. Buyer-intent qualification queue.
7. Competitor-watch cycle.
8. Market-trend evidence cycle.
9. Editorial idea mining.
10. Daily publishing handoff to Kleo.
11. Newsletter production.
12. Anchor-to-derivative repurposing.
13. Carousel production.
14. Video production.
15. Webinar and talk follow-up.
16. Podcast guesting.
17. Website freshness.
18. SEO topic cluster.
19. AI-search visibility audit.
20. Landing-page conversion review.
21. Lead-magnet promotion.
22. Assessment-to-call conversion.
23. Email newsletter growth.
24. Welcome and nurture sequence.
25. Re-engagement sequence.
26. Referral activation.
27. Partner co-marketing.
28. Speaking-to-pipeline.
29. Event-before-during-after.
30. PR and byline pipeline.
31. Community participation.
32. Influencer and expert collaboration.
33. Customer proof capture.
34. Case-study approval workflow.
35. Campaign planning.
36. Campaign production.
37. Campaign measurement.
38. Offer launch.
39. New-channel launch.
40. Paid-media readiness.
41. Content inventory cleanup.
42. Asset library maintenance.
43. UTM governance.
44. Funnel attribution review.
45. Dashboard review.
46. Weekly performance review.
47. Monthly strategic review.
48. Experiment backlog.
49. Stop-doing review.
50. Quarterly marketing planning.

## 100 prompt commands

Implement each as a short slash command with an explicit output artifact and no side effect by default. Use these names, numbered by group:

`/source-add`, `/source-audit`, `/source-refresh`, `/source-search`, `/fact-check`, `/claim-check`, `/voice-check`, `/voice-learn`, `/positioning-review`, `/message-house`.

`/icp`, `/buyer-brief`, `/buyer-qualify`, `/offer-design`, `/offer-pressure-test`, `/scope-check`, `/price-check`, `/competitor-brief`, `/market-brief`, `/trend-brief`.

`/idea-mine`, `/idea-rank`, `/editorial-brief`, `/daily-brief`, `/linkedin-draft`, `/linkedin-series`, `/newsletter-draft`, `/article-draft`, `/carousel-brief`, `/video-script`.

`/podcast-brief`, `/talk-repurpose`, `/webinar-follow-up`, `/content-repurpose`, `/content-qa`, `/cta-route`, `/utm`, `/content-calendar`, `/content-inventory`, `/content-retire`.

`/website-audit`, `/website-copy`, `/landing-page-audit`, `/landing-page-copy`, `/seo-brief`, `/seo-audit`, `/ai-search-audit`, `/lead-magnet-brief`, `/lead-magnet-qa`, `/assessment-promotion`.

`/email-draft`, `/email-subjects`, `/newsletter-growth`, `/welcome-sequence`, `/nurture-sequence`, `/reengagement`, `/follow-up-draft`, `/referral-ask`, `/partner-brief`, `/co-sell-plan`.

`/speaking-brief`, `/speaker-page`, `/event-plan`, `/event-announcement`, `/event-follow-up`, `/podcast-pitch`, `/pr-pitch`, `/byline-outline`, `/community-plan`, `/influencer-brief`.

`/proof-capture`, `/case-study-brief`, `/testimonial-request`, `/campaign-plan`, `/campaign-brief`, `/campaign-qa`, `/launch-plan`, `/launch-brief`, `/channel-plan`, `/paid-readiness`.

`/social-listen`, `/community-listen`, `/marketing-project`, `/handoff`, `/dashboard`, `/attribution-audit`, `/funnel-review`, `/experiment`, `/experiment-review`, `/weekly-review`.

`/monthly-review`, `/quarterly-plan`, `/stop-doing`, `/approval-queue`, `/kleo-export`, `/kleo-brief`, `/publish-check`, `/schedule-check`, `/performance-brief`, `/department-status`.

## Current operating context for Claude

This is the current known operating context as of September 5, 2026. Some systems below were last directly verified in late August or early September. Treat their existence and design as reliable context, but re-read the named authenticated source before stating a live status, count, metric, schedule, or enrollment result.

### 1. Business objective and commercial rules

- Britt Bowman LLC is the primary business. Its core offers are scoped transformation projects, fractional transformation leadership, executive advisory, speaking, and diagnostic-led entry points.
- The central market thesis: AI pilots fail in deployment when ownership, governance, data, definitions, workflows, incentives, and decision rights do not change with the technology.
- Primary near-term buyer: an empowered founder, CEO, or CxO at a funded or early-growth company with an AI, GTM, data, or operational deployment problem. Secondary buyer: enterprise transformation leaders, usually via a warm path.
- Default commercial order: cash revenue, authority with right buyers, qualified relationships/referrals, reusable leverage, then visibility. Cash beats equity. Do not offer employee-grade work free to prove value.
- Do not write rates on the public site. Do not turn a warm relationship into a prospect unless there is an actual commercial signal.

### 2. Daily social publishing

- Britt posts on LinkedIn every day and already has a functioning daily publishing system. Do not propose a new cadence, content calendar, or a replacement for that system.
- Kleo is the existing drafting and publishing surface. Its job is production and scheduling, not strategy or source judgment. Claude's job is to make Kleo's upstream inputs, briefs, source selection, QA, and learning loop materially better and less manual.
- Claude must treat current Kleo queues, scheduled posts, voice settings, performance history, and publishing configuration as the live authority. Inspect them only through a permitted Kleo integration or a user-authorized read-only session.
- Do not automate LinkedIn navigation, scraping, connection requests, DMs, comments, reactions, follows, or simulated human activity. Keep any publishing within Kleo's supported integration or an official LinkedIn route. Never claim an external post is published until the execution surface confirms it.
- Existing LinkedIn content tends to draw from operating-model transformation, AI deployment, GTM handoffs, data and taxonomy, leadership, founder work, speaking, and selected personal experience. The department must avoid accidental duplication of a recently used lead magnet or thesis.

### 3. Newsletter and owned audience

- Kit is the email platform and the Newsletter Site is the active subscriber-facing surface. The owned signup URL is `https://www.brittbowman.ai/newsletter`; the Kit Newsletter Site also exists at `https://britt-bowman-llc.kit.com/profile`.
- Newsletter voice is warm, highly conversational, excitable when earned, and intellectually serious about GTM and enterprise transformation. It must not sound like a clinical executive memo or generic social copy.
- Editorial emphasis: GTM operating models, cross-functional handoffs, AI deployment, data architecture, governance, measurement, workflow ownership, and decision rights. Founder-bottleneck material is selective, roughly every four to six weeks, not a default series.
- CTA routing rule: GTM handoffs, shared definitions, buying signals, and GTM diagnostic themes normally route to SCALER. AI deployment and readiness themes may route to BRIDGE. Reader-facing CTA copy stays clean even when the destination is UTM-tagged.
- Late-August/early-September audit: mature Kit sends from August 4 through August 25 had an approximately 68.9% weighted open rate, zero unsubscribes, and zero clicks. The zero clicks reflected missing deliberate in-body CTAs in most audited messages, not a conclusion that the writing failed. This is historical, not a current benchmark.
- A September Tuesday newsletter schedule was verified in Kit for September 1, 8, 15, 22, and 29 at 12:00 PM Eastern. Recheck Kit immediately before assuming any future broadcast remains scheduled or has sent.
- A private DRIVE newsletter feed and ledger support weekly candidate selection. It is drafting-only and must not modify Kit without explicit approval. Kit owns schedule, delivery status, publication IDs, and metrics. DRIVE owns source-post identity, source completeness, classification, ranking, and reuse exclusions.
- The weekly task is `weekly-newsletter-candidate`, Friday at 9:00 AM. It reads only the private Supabase feed. It cannot create a candidate or draft from incomplete source text, and it fails closed when the feed is unavailable.

### 4. Lead magnets, assessments, and conversion path

- Live, tested, and ready to promote: Revenue Leak Map, AI Readiness Diagnostic, Forecast Trust Diagnostic, GTM Plateau Diagnostic, Founder Bottleneck Audit, and Pilot Adoption Pre-Mortem. Do not describe them as waiting for launch.
- Revenue Leak Map is the GTM-oriented route. Its framing is to find the funnel stage costing revenue before buying more lead volume. It is appropriate for GTM and funnel topics.
- Forecast Trust is the `5 Stops to Close the Trust Gap in Your Forecast` resource at `/forecast-trust`, with assessment handoff to `/scaler`. Its real components are Definition, Entry, Movement, Judgment, and Ownership.
- SCALER currently has 27 scored questions across System, Credibility, Audience, Learnings, and Execution, plus five unscored Route questions. BRIDGE has six dimensions. Do not repeat stale public language that says SCALER has 30 questions.
- The asset-performance tracker is Google Sheet `1EC0XbgENkj2n399ZwGKIJAIj2Wp5_qZP_h0iG0rDzq8`. `Performance!A4:G14` is the decision surface, and `Live Opt-ins` is the hidden formula-backed import tab. The authorized metric flow is pageviews -> opt-ins -> qualified calls, not generic engagement.
- When sources are unavailable or an account is wrong/unauthenticated, fail closed. Never replace known values with zero or blank. The current Squarespace and assessment data must be authenticated and source-specific before updating or reporting it.

### 5. Cold outreach and prospecting

- Apollo is the live cold-email platform. The two last-confirmed active sequences are `AI BRIDGE | Free Assessment | Cold` (`6a8defb6573695000c2bf24d`) and `GTM SCALER | Free Assessment | Cold` (`6a8dece6eaa0ce00205dda49`). Reconfirm in Apollo before assuming either is active, paused, or enrollable.
- The last observed early baseline was 158 sent, 157 delivered, one reply, and one bounce over seven days. An earlier Aug. 26-31 cut was 135 sent, 134 delivered, one reply, and one bounce. These are early historical baselines, not current performance conclusions.
- Apollo's tracking configuration made open/click data unreliable. Do not use open/click metrics, aggregate Squarespace traffic, or a few days of sending as proof of campaign performance. The desired measured funnel is: sent -> delivered -> clicked -> landing-page visit -> opt-in/download -> assessment start/completion -> meeting -> pipeline.
- Cold email should begin with a recognizable buyer problem and relevance, give one earned diagnosis, and end with one concrete next step. Use Britt's flowing, conversational voice. Do not write boxy, vertical, generic outreach or force pop-culture references.
- Instantly is only a watchlist. Do not migrate, scale volume, or add tooling until a controlled Apollo test establishes a specific capacity, deliverability, or qualified-demand constraint. If tested later, isolate one warmed domain and one campaign.
- The `daily-two-motion-prospecting` automation runs daily at 8:30 AM Eastern, with additional every-two-hour wakeups for public-intent discovery. It is capacity-gated by Apollo credits, mailbox health, warmup pacing, daily limits, existing contact/history checks, assessment-completion suppression, and schedule slots.
- Enrollment or outbound activation is irreversible external action. Claude may research, qualify, deduplicate, score, prepare, and queue contacts automatically, but it must obtain current evidence and explicit approval before enrolling new people or changing a sequence.
- The durable action surface is the `Intent Action Queue` tab in the Britt Bowman Founder Office Pipeline spreadsheet. Its allowed recommendation actions are `ADD TO BUYER 50`, `REPLACE BUYER 50`, `CONNECT`, `COMMENT`, `EMAIL`, `APOLLO`, `OBSERVE`, and `SUPPRESS`. A row is `Ready for Britt` only when no further research is needed.

### 6. Commercial CRM, warm relationships, and relationship debt

- The live commercial source is Google Sheet `Britt Bowman Founder Office Pipeline`, ID `1EEjNQSrUH_A3XdIEYY4SVki3mez7VmQcI_k_nMi2fGA`. Core tabs are Dashboard, Pipeline, Network, Prospecting Queue, Commitments, Activity Log, and Daily Tasks.
- Use this pipeline, not a parallel tracker. Before changing a prospect or relationship, read the live record, preserve user edits, and use the existing stage/next-action logic.
- Current business-development work must distinguish cash prospects, warm referral relationships, network-only contacts, equity/advisor opportunities, and selective executive-search relationships. Do not collapse them into one funnel or report activity as pipeline.
- ServiceNow-related relationship restrictions were time-bound through August 17, 2026. Because that date has passed, do not carry the old prohibition forward automatically; inspect current restrictions and the live CRM note before a commercial action.

### 7. Speaking, events, and public authority

- Speaking is an authority and qualified-relationship channel, not vanity content. The department should create an appropriate asset, follow-up, referral path, and reuse plan for each appearance.
- The Founder Office Pipeline's `Daily Tasks` tab contains event and content milestones using source keys such as `CONTENT:EVENT:<calendar-event-id>:{ANNOUNCEMENT|POINT-OF-VIEW|PRACTICAL|SYNTHESIS}`. Calendar, business Gmail, and organizer details are evidence sources.
- Do not make attendance-only events public content by default. Create public milestones mainly for speaking, chairing, approved announcements, or a real published asset. Maintain confidentiality and exact organizer facts.
- Existing event workflow is drafting and planning only. It never publishes or accesses LinkedIn. Preserve that boundary until a specific publication is approved.

### 8. Performance and learning systems

- The purpose of content, email, speaking, lead magnets, and cold outreach is measurable movement toward subscriber growth, opt-ins, assessment completions, booked conversations, qualified pipeline, and revenue. LinkedIn reach is supplementary evidence, not the operating objective.
- Do not overrotate on a single channel, metric, or hygiene finding. A high or low rate without its denominator, audience composition, downstream conversion, and revenue contribution is a diagnostic clue, not a funnel priority. The newsletter is one branch of the system, not the system.
- Before recommending a channel-specific build or fix, produce the complete funnel map: source -> visitor or recipient -> opt-in -> assessment/lead-magnet completion -> booked conversation -> qualified opportunity -> revenue. Show the count, current source of truth, confidence, owner, and next verification for every stage. Then identify the binding constraint across the whole funnel.
- Timebox branch-level investigation. Once a fact is sufficient to classify a branch as working, unknown, or constrained, return to the complete funnel rather than endlessly auditing that branch.
- Keep a first-party evidence trail: source asset, topic, channel, CTA, destination/UTM, actual execution ID, page visit, opt-in, assessment completion, meeting, opportunity, and revenue where available.
- Do not claim causal performance from a post, email, or event without enough evidence. Label hypotheses and create a specific disproof test.
- A monthly review must recommend a short list of what to repeat, change, stop, or investigate, not a generic performance summary.

### 9. Human ownership and approval model

- Britt retains positioning, commercial judgment, public voice, confidentiality decisions, final approval, sends, publishing, scheduling, CRM writes, and budget changes.
- The department may own research, preparation, source indexing, evidence checks, idea extraction, briefing, QA, UTM generation, attribution preparation, ledger maintenance, and decision-ready queues.
- The department must not create a new channel, campaign, paid-media plan, or product build merely because it can. It must identify the buyer, intended behavior, evidence of demand, capacity cost, and smallest test first.

## Kleo contract

Create a `kleo-export` adapter with two modes:

- **API mode:** only if Kleo exposes a supported authenticated API, webhook, or import endpoint. Store credentials outside the repository. Send only explicit, approved payloads and read back the resulting post or schedule ID.
- **Brief-pack mode:** generate one structured Markdown and CSV package for Kleo's web app. Each row includes title, channel, goal, audience, thesis, source references, claim limits, CTA, approved destination, visual direction, draft, scheduled window, and approval status.

The department must function fully in Brief-pack mode. Do not use GUI scripting as a substitute for a supported Kleo integration without Britt's explicit approval.

## Build sequence

1. Build the system now. Do not turn the build into a funnel diagnostic, a prioritization exercise, or a sequence of questions for Britt.
2. Create the control-plane files and populate them from existing approved material. Represent unknown or time-sensitive values as live adapters and scheduled refresh jobs, not as build blockers.
3. Implement the six core skills first: `source-intake`, `brand-voice`, `editorial-brief`, `content-qa`, `cta-router`, and `kleo-export`.
4. Add all 50 skill folders with concise routing instructions, not repeated boilerplate.
5. Add all 50 named agent definitions and all 50 systems. Each system must have a trigger and a machine-runnable default action. Read-only source collection, data normalization, deduplication, queue preparation, draft generation, brief generation, performance refresh, and internal reporting run without asking Britt to prompt them.
6. Add all 100 commands as a discovery index that routes to skills and agents.
7. Make the department operate as a persistent loop: collect -> classify -> decide -> prepare -> hand off to Kleo -> record -> learn. Its normal output is an updated queue, draft/brief pack, and exceptions requiring judgment, not a prose report about what it discovered.
8. Only stop for an actual authority boundary: a real external send, publish, schedule, CRM write, paid spend, destructive change, a missing credential that cannot be discovered in the authorized environment, or a decision that materially changes Britt's positioning/commercial commitment. Do not stop for ordinary read-only verification or to narrate intermediate findings.
9. Validate that the system can produce a Kleo-ready brief pack from a single approved source without invented facts or a publish action.

## Claude build prompt

Use the following instruction in Claude Code from the repository root:

> Read `outputs/claude-marketing-department-build-brief.md` in full, especially `Current operating context for Claude`. Build the private Claude Marketing Department in the existing private `britt-marketing-os` repository. Preserve the existing repository-root `.claude/skills/` and `.claude/agents/` layout. Do not create an isolated `marketing-department/` directory and do not modify unrelated production files. This is an autonomous-build task, not a request for a funnel analysis, marketing diagnosis, or a report about source findings. Build the complete system now. Treat the operating-context section as configuration, not a research agenda. Convert every permitted read-only source into a collector, every known workflow into a scheduled system, every unknown live datum into a refreshable adapter, and every recurring decision into a queue or rule. Do not pause to narrate intermediate findings or ask Britt to prompt routine work. The operating loop is collect -> classify -> decide -> prepare -> hand off to Kleo -> record -> learn. Its outputs are updated queues and ready work, with a short exception list only when human authority is genuinely required. External sends, publication, scheduling, CRM writes, paid spend, destructive changes, missing credentials unavailable in the authorized environment, and material positioning or commercial decisions still require explicit approval. Implement the control plane, six core skills, full 50-item skill/agent/system/command registries, and the Kleo Brief-pack adapter. Do not invent facts, metrics, clients, or current status. Give me a concise implementation summary and file tree only after the system is built.
