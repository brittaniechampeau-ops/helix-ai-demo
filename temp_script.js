const DETAILS = {
  // ── SALESFORCE CAMPAIGNS ──
  'sf-parent': {
    label: 'Salesforce · Parent Campaign',
    title: 'Govern What You\'ve Built — Q1 Launch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: Financial services, 500–10K employees, NA/EU/APAC', 'Buyer: CRO, CCO, CIO, CTO, Head of CX, VP AI [EXPLICIT]', 'Core pain: uncontrolled AI agents creating regulatory exposure'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Theme extracted: "Governance urgency before regulators arrive"', 'Target quarter: Q1 · Fiscal year objective: $18M pipeline', 'Primary motion: Awareness → Assessment → Pilot'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Campaign hierarchy pattern: 1 parent + regional children', 'Revenue target mapped to SF Campaign.ExpectedRevenue', 'Naming convention applied: [Product]—[Region]—[Theme]—[Quarter]'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Campaign record: Type=Product Launch, Status=Planned', 'ParentId: null (this is the root)', '9 child campaigns linked via ParentId'] }
    ],
    insight: 'This is the root node for the entire Q1 motion. Every child campaign, contact assignment, and segment rule rolls up here. Deleting or renaming this record breaks attribution for all 38 contacts.'
  },
  'sf-na': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — NA — DemandGen — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP Tier 1/2: NA financial services, 500–5K employees', 'Personas: CRO, CCO, CIO, CTO — all [EXPLICIT] in deck', 'Regulatory context: OCC, Fed Reserve, NYDFS'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Region scoped to North America from ICP geography field', 'Motion: email demand gen, 6 persona-specific message streams', 'Offer: Readiness Assessment (primary), Webinar (secondary)'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment 1 definition stored: NA Tier 1/2 CxO FS', '4 personas mapped with pain/value/CTA per role', 'OCC regulatory hook validated against persona pain points'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF record: Type=Email, ParentId=Q1 Launch parent', '18 contacts assigned as Campaign Members', 'Status=Sent for 10, Responded for 4, Open for 4'] }
    ],
    insight: 'This campaign holds the highest-value segment — NA Tier 1/2 CxO in financial services. The 6 persona streams mean each CRO gets different copy than each CIO, derived from the deck\'s buying committee table.'
  },
  'sf-eu': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — EU — RegulatoryUrgency — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: UK and Western European financial services', 'Buyer: CRO/CCO primary, CIO secondary [EXPLICIT]', 'Regulatory marker: EU AI Act — [EXPLICIT] on slide 7'] },
      { step: 's2', heading: 'Campaign DNA', points: ['EU AI Act enforcement date (Feb 2026) extracted as urgency hook', 'Message framing: deadline-driven, compliance-first', 'Geo scoped: UK + FR + DE + NL + Nordics'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Regulatory_Driver__c field mapped: "EU AI Act" for this segment', 'Segment 2 template stored with geo filter logic', 'EU AI Act hook validated as highest-confidence urgency trigger'] },
      { step: 's4', heading: 'Generated Asset', points: ['9 contacts matched: UK/EU FS, CRO/CCO titles', 'SF record: Type=Email, StartDate=Feb 3 2025', 'Marketo program EU variant linked via campaign sync'] }
    ],
    insight: 'The EU AI Act urgency hook is the single highest-performing message variable in this segment. Helix extracted the enforcement date from page 7 of the deck and turned it into the lead subject line across all EU Outreach sequences.'
  },
  'sf-apac': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — APAC — MAS-Compliance — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: APAC financial services — Singapore, Australia primary', 'Regulator markers: MAS (Singapore), APRA (Australia) [INFERRED]', 'Persona: CRO/CCO dominant — fewer CTO buyers in region'] },
      { step: 's2', heading: 'Campaign DNA', points: ['MAS Tech Risk Management framework cited in deck notes', 'APRA CPS 230 operational risk standard extracted', 'Smaller segment — 7 contacts vs 18 NA'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Regulatory_Driver__c mapped: "MAS/APRA" for APAC segment', 'Segment 3 template stored: APAC FS, MAS/APRA hook', 'Confidence: APRA hook [INFERRED] — lower than EU AI Act'] },
      { step: 's4', heading: 'Generated Asset', points: ['7 contacts matched: SG/AU FS accounts', 'SF Type=Email · Marketo APAC program linked', 'Outreach sequences: no CTO variant (insufficient contacts)'] }
    ],
    insight: 'MAS/APRA was inferred, not explicit in the deck — Helix flagged it [INFERRED] and applied lower confidence. The next campaign that validates this hook will raise confidence from ~74% to 90%+.'
  },
  'sf-webinar': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — Global — Webinar — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['All 6 personas eligible for webinar motion', 'Event motion mapped to "Awareness" stage in funnel model', 'Registration target: 2,500 (from deck objectives slide)'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Webinar offer extracted from slide 8: "Govern What You\'ve Built" live session', 'All-segment eligibility: no geo or tier exclusion', 'Post-webinar follow-up: pilot offer CTA'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Event motion pattern stored for reuse', 'Registration target field mapped to SF Campaign.TargetRegMeetings', '2,500 target stored as baseline for future webinar benchmarking'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Type=Webinar · ParentId=Q1 Launch', 'Marketo event program: AgentOps-Q1-Webinar-Registration', 'All 38 contacts eligible · 2,500 external reg target'] }
    ],
    insight: 'This is the top-of-funnel capture event for the entire Q1 motion. Every contact segment is eligible. The 2,500 registration target came directly from the deck — Helix didn\'t guess it.'
  },
  'sf-pipeline': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — Global — OpenPipeline — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: contacts with open opportunities in CRM', 'Stage logic: Qualification through Negotiation eligible', 'Persona: economic buyer required (CRO/CIO preferred)'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Pipeline acceleration motion: separate from net-new demand gen', 'Direct mail offer selected for open opportunities', 'Message: proof/ROI-focused vs awareness for cold segments'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment 4 rule: Opportunity.StageName NOT IN (Closed Won, Closed Lost)', '11 contacts matched across all regions', 'Direct mail motion stored as pipeline-stage-appropriate'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Type=Direct Mail · 11 campaign members', 'Distinct messaging: ROI-proof track vs awareness track', 'No Marketo program — direct mail only'] }
    ],
    insight: 'This segment is separated from demand gen deliberately — open pipeline contacts get proof-of-ROI messaging, not top-of-funnel awareness content. Helix derived this from the sales play section of the deck.'
  },
  'sf-customer': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — Global — CustomerExpansion — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: existing customers (Account.Type = Customer)', '4 contacts matched — small but high-value', 'Expansion play: upsell from starter to enterprise'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Expansion motion: separate track from net-new', 'Offer: Enterprise License upgrade path', 'Message: value realized → expand coverage'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment 5 rule: Account.Type=Customer, no DNC flag', 'Customer expansion pattern stored for future reuse', 'Persona: CIO/CTO dominant for expansion deals'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Type=Other · 4 campaign members', 'Highest-priority contacts: enterprise license conversation', 'Manual outreach recommended over automated sequence'] }
    ],
    insight: '4 contacts but potentially the highest-value segment. These are existing customers who could expand to enterprise licensing. Helix flagged them separately so they don\'t get caught in demand gen flows.'
  },
  'sf-nyc': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — NA — ExecRoundtable-NYC — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Tier 1 accounts only: $10B+ AUM or 1,000+ employees', 'CRO/CCO persona target — board-level discussion format', 'NA geography: NY metro and northeast corridor'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Exec roundtable format extracted from event strategy section', 'Invite-only: Tier 1 accounts in Segment 1 only', 'Offer: executive peer discussion, not product pitch'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Event: Tier 1 invite-only roundtable pattern stored', 'NYC as primary NA exec event market', 'Persona match: CRO primary, CCO secondary'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Type=Event · Tier 1 contact list only', 'Filtered from Segment 1: 18 contacts → ~8 Tier 1 invites', 'Paired with London roundtable for global exec motion'] }
    ],
    insight: 'The NYC roundtable targets the 8 highest-value contacts in the entire campaign. The invite criteria (Tier 1 only, CRO/CCO) came directly from the deck\'s sales play section — Helix extracted the tier filter automatically.'
  },
  'sf-london': {
    label: 'Salesforce · Child Campaign',
    title: 'AgentOps — UK — ExecRoundtable-London — Q1',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['UK-headquartered Tier 1/2 financial services accounts', 'EU AI Act compliance framing for exec discussion', 'CRO/CCO primary — regulatory accountability angle'] },
      { step: 's2', heading: 'Campaign DNA', points: ['London as primary EU exec roundtable market', 'EU AI Act enforcement as table theme', 'Peer benchmarking format: "Where are other UK FSIs on this?"'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['EU exec event pattern stored — mirrors NYC structure', 'EU AI Act hook applied to roundtable framing', 'Segment 2 contacts filtered to Tier 1 UK accounts'] },
      { step: 's4', heading: 'Generated Asset', points: ['SF Type=Event · EU AI Act framing', 'Filtered from Segment 2: 9 EU contacts → ~5 UK Tier 1', 'Paired with NYC roundtable as global exec program'] }
    ],
    insight: 'The London roundtable uses EU AI Act enforcement as the table theme — a direct extraction from the deck\'s EU regulatory section. This positions the event as a compliance conversation, not a vendor pitch.'
  },
  'sf-contacts': {
    label: 'Salesforce · Campaign Members',
    title: '38 Contacts — Scoring & Exclusion Logic',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP definition: FS, 500–10K employees, CxO titles', 'Hard exclusion rules: DO NOT CONTACT flag, sanctioned entities', 'Deduplication logic: same email or same name + account'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Scoring dimensions extracted: title match, account tier, engagement, regulatory fit', 'Segment assignment rules derived from regional + persona logic', 'Offer affinity matched per persona definition'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Contact scoring model: 4-factor (ICP fit + title + engagement + regulatory)', 'Hard exclusion rules encoded as governance rules', '3 duplicate pairs resolved before scoring'] },
      { step: 's4', heading: 'Generated Asset', points: ['38 contacts scored, segmented, and assigned', '6 hard-excluded (2 DNC, 4 out-of-ICP)', 'Each contact: score, segment, recommended offer, buying committee role'] }
    ],
    insight: 'The scoring model is fully derived from the deck — not from generic lead scoring rules. The CRO at a Tier 1 insurer scores 107 because the deck explicitly names "CRO at FSI with 1,000+ employees" as the primary ICP.'
  },
  // ── SEGMENTS ──
  'seg-na': {
    label: 'Audience Segment',
    title: 'Segment 1 — NA Tier 1/2 CxO Financial Services',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: US/Canada FS, Tier 1 ($10B+ AUM) or Tier 2 ($1–10B)', 'Titles: CRO, CCO, CIO, CTO, Head of CX, VP AI', 'Industry: Banking, Insurance, Wealth Mgmt, FinTech [EXPLICIT]'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary segment for NA demand gen motion', 'Regulatory hook: OCC / Fed / NYDFS framework references', '6 persona-specific message tracks required'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment rule stored: Account.Industry=FS AND Account.AnnualRevenue>1B AND Contact.Title CONTAINS CxO/VP', 'Tier logic mapped to ICP_Tier__c custom field', '18 contacts validated against this rule'] },
      { step: 's4', heading: 'Generated Asset', points: ['18 SF Campaign Members assigned to NA DemandGen child', 'Segment template stored for Campaign 2 — no re-derivation', 'Highest-value segment: ~$12M of $18M pipeline target'] }
    ],
    insight: 'This segment alone represents the majority of Q1 pipeline target. The Tier 1/2 distinction maps directly to account revenue — Helix extracted the threshold from the deck\'s ICP section and stored it as a reusable field rule.'
  },
  'seg-eu': {
    label: 'Audience Segment',
    title: 'Segment 2 — UK/Europe EU AI Act',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: UK + Western EU FS, 1,000+ employees', 'Regulatory urgency: EU AI Act Article 6 high-risk classification', 'Titles: CRO/CCO primary — compliance accountability angle'] },
      { step: 's2', heading: 'Campaign DNA', points: ['EU AI Act enforcement: Feb 2026 (14 months at campaign launch)', 'Urgency frame: "Are your AI agents classified and documented?"', 'Secondary motion: London exec roundtable for Tier 1'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Geo filter: Account.BillingCountry IN (UK, FR, DE, NL, SE, NO)', 'Regulatory_Driver__c = "EU AI Act" stored as segment attribute', '9 contacts validated; template reusable for any EU FS campaign'] },
      { step: 's4', heading: 'Generated Asset', points: ['9 contacts: EU FS CRO/CCO/CIO roles', 'EU DemandGen email + London roundtable + LinkedIn EU audience', 'Outreach: 4-touch EU AI Act urgency sequence'] }
    ],
    insight: 'EU AI Act creates natural urgency that makes cold outreach warm. Helix extracted the enforcement deadline from the deck and turned it into the lead message variable — the subject line writes itself.'
  },
  'seg-apac': {
    label: 'Audience Segment',
    title: 'Segment 3 — APAC MAS/APRA',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: Singapore (MAS) and Australia (APRA) FS firms', 'Regulator: MAS TRM 2021 guidelines [INFERRED]', 'APRA CPS 230 operational risk [INFERRED]'] },
      { step: 's2', heading: 'Campaign DNA', points: ['APAC motion treated as separate geo — different regulatory hooks', 'Smaller segment (7 contacts) but high-intent market', 'No CTO variant: insufficient APAC CTO contacts'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Geo filter: Account.BillingCountry IN (SG, AU)', 'Regulatory_Driver__c = "MAS/APRA" [INFERRED — lower confidence]', 'Segment template stored; confidence will increase with next APAC campaign'] },
      { step: 's4', heading: 'Generated Asset', points: ['7 contacts: SG/AU FS CRO/CCO accounts', 'Marketo APAC program + CRO/CCO Outreach sequences', 'No LinkedIn audience yet — insufficient volume'] }
    ],
    insight: 'MAS/APRA was inferred by Helix, not stated explicitly in the deck. It\'s flagged with lower confidence. If the next APAC campaign validates this hook, confidence rises to 90%+ and becomes a stored, high-confidence rule.'
  },
  'seg-pipeline': {
    label: 'Audience Segment',
    title: 'Segment 4 — Open Pipeline',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: contacts attached to open Salesforce Opportunities', 'Stage range: Qualification → Negotiation (not Closed)', 'Persona: economic buyer preferred — CRO/CIO'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Acceleration motion: different from net-new demand gen', 'Proof-of-value messaging vs awareness messaging', 'Offer: direct ROI evidence, case study, pilot activation'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Contact has Opportunity.StageName NOT IN (Closed Won, Closed Lost)', '11 contacts matched across all geographies', 'Stored as pipeline segment pattern for future campaigns'] },
      { step: 's4', heading: 'Generated Asset', points: ['11 SF Campaign Members: Direct Mail type', 'No Marketo/email — personalized direct outreach', 'SDR follow-up brief linked: proof-track messaging'] }
    ],
    insight: 'This segment receives entirely different content than everyone else — proof and ROI instead of awareness. Separating them is a decision Helix derived from the sales play section of the deck, not a default.'
  },
  'seg-customer': {
    label: 'Audience Segment',
    title: 'Segment 5 — Customer Expansion',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: Account.Type = Customer in Salesforce', '4 contacts — high value, low volume', 'Expansion persona: technical buyer (CTO/CIO) for capability upsell'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Expansion play: upgrade Starter → Enterprise license', 'Message: value realized → governance at scale', 'Offer: Enterprise License ($180K–$450K ARR)'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Account.Type=Customer AND no DNC flag', 'Expansion offer catalog entry mapped: Enterprise License', 'Pattern stored: customers get enterprise CTA, not readiness assessment'] },
      { step: 's4', heading: 'Generated Asset', points: ['4 contacts: highest-LTV accounts in campaign', 'SF Type=Other — manual high-touch outreach', 'Recommended: AE-led, not automated sequence'] }
    ],
    insight: 'Only 4 contacts but the highest potential deal value. These customers are already convinced of the product — the campaign ask is expansion, not conversion. Helix kept them isolated from demand gen to prevent brand dilution.'
  },
  'seg-nurture': {
    label: 'Audience Segment',
    title: 'Segment 6 — VP Nurture Stream',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: VP-level titles (not C-suite) at ICP accounts', 'Persona: VP AI / VP Digital — influencer, not economic buyer', 'Role: champion-building, not direct conversion'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Nurture motion: longer cycle, lower urgency', 'Content: thought leadership vs product offer', 'Goal: warm to readiness assessment over 60–90 days'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Contact.Title CONTAINS VP AND level=VP (not C-suite)', '5 contacts matched: VP AI / VP Digital roles', 'Nurture pattern stored: VPs get 4-touch thought leadership sequence'] },
      { step: 's4', heading: 'Generated Asset', points: ['5 contacts: Marketo VP Nurture Stream program', '4-touch sequence: content-first, CTA at touch 4 only', 'Expected conversion to assessment: 60–90 day window'] }
    ],
    insight: 'VP-level buyers are often the internal champion but rarely the economic buyer. A separate nurture track keeps them engaged without sending the wrong offer — the assessment CTA only appears on touch 4.'
  },
  // ── MARKETO ──
  'mkto-na': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-NA-DemandGen',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['6 personas mapped from deck buying committee table', 'NA financial services ICP — OCC/Fed regulatory hooks', 'Email as primary channel for demand gen motion'] },
      { step: 's2', heading: 'Campaign DNA', points: ['6 email streams, one per persona', 'CRO stream: regulatory audit trail · CCO stream: evidence automation', 'CIO stream: shadow AI · CTO stream: 48hr deploy'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Persona-to-stream mapping stored in model', 'Token schema applied: {{my.Persona}}, {{my.Regulatory_Hook}}', 'SF campaign sync: AgentOps—NA—DemandGen—Q1 linked'] },
      { step: 's4', heading: 'Generated Asset', points: ['Marketo program structure: 6 smart lists, 6 email assets', '24 tokens pre-populated from Canonical GTM Model', 'SF campaign sync active — member status flows back'] }
    ],
    insight: 'This program has 6 distinct email streams because the deck had 6 distinct personas with different pain points. Helix didn\'t use one generic email — it mapped each persona\'s primary pain to a separate message track.'
  },
  'mkto-eu': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-EU-RegulatoryUrgency',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['EU FS ICP: UK + Western Europe, 1,000+ employees', 'EU AI Act as primary regulatory hook [EXPLICIT]', 'CRO/CCO primary — compliance accountability frame'] },
      { step: 's2', heading: 'Campaign DNA', points: ['EU AI Act enforcement timeline used as urgency driver', 'Different copy variant from NA — compliance-first framing', 'Token: {{my.Regulatory_Hook}} = "EU AI Act Article 6"'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['EU regulatory variant pattern stored', 'Regulatory_Driver__c = "EU AI Act" mapped to Marketo token', 'EU geo filter applied at smart list level'] },
      { step: 's4', heading: 'Generated Asset', points: ['Separate EU program — not a geo variant of NA', 'EU AI Act copy applied to all 3 active email assets', 'SF EU campaign sync active: 9 contacts'] }
    ],
    insight: 'The EU program is a separate Marketo program, not a geo variant of NA — the regulatory framing is different enough that token overrides alone can\'t handle it. Helix recognized this from the deck\'s EU-specific messaging section.'
  },
  'mkto-apac': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-APAC-MASCompliance',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['APAC FS ICP: Singapore (MAS) and Australia (APRA)', 'Regulatory: MAS TRM + APRA CPS 230 [INFERRED]', 'CRO/CCO personas — no CTO variant for APAC'] },
      { step: 's2', heading: 'Campaign DNA', points: ['MAS/APRA compliance framing as urgency angle', 'Fewer contacts → simpler program (2 streams, not 6)', 'Token: {{my.Regulatory_Hook}} = "MAS TRM / APRA CPS 230"'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['APAC variant stored — separate from EU and NA patterns', 'MAS/APRA hook flagged [INFERRED]: will gain confidence next campaign', 'CRO/CCO only: insufficient contacts for other personas'] },
      { step: 's4', heading: 'Generated Asset', points: ['2-stream Marketo program: CRO and CCO only', 'APAC geo filter: SG and AU accounts', 'SF APAC campaign sync: 7 contacts'] }
    ],
    insight: 'APAC has the lowest contact volume but potentially the highest regulatory urgency — MAS TRM guidelines have direct penalties. The [INFERRED] flag means this hook needs validation before it becomes a high-confidence rule.'
  },
  'mkto-webinar': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-Webinar-Registration',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['All personas eligible: ICP-wide awareness event', 'Webinar format: "Govern What You\'ve Built" live session', 'Registration target: 2,500 from deck objectives'] },
      { step: 's2', heading: 'Campaign DNA', points: ['All-segment invitation — no geo or persona exclusion', 'Pre-event: registration email · Post-event: pilot offer CTA', 'Offer bridge: webinar attendance → assessment booking'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Event program pattern stored: webinar → assessment funnel', '2,500 registration target mapped to program goal', 'Post-event follow-up trigger stored as reusable flow'] },
      { step: 's4', heading: 'Generated Asset', points: ['Marketo event program: registration + confirmation + follow-up', 'All 38 contacts seeded as initial invite list', 'Post-webinar trigger: attended → pilot offer smart campaign'] }
    ],
    insight: 'The webinar is the campaign\'s awareness anchor — everyone gets invited regardless of persona or geo. The post-event trigger (attended → pilot CTA) was derived from the deck\'s conversion funnel diagram.'
  },
  'mkto-nurture': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-VP-NurtureStream',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['VP-level titles only: VP AI, VP Digital, VP Innovation', 'Influencer role: champion, not economic buyer', 'Longer conversion cycle: 60–90 days'] },
      { step: 's2', heading: 'Campaign DNA', points: ['4-touch nurture sequence: content-first, CTA at touch 4 only', 'Content type: thought leadership, benchmark data, regulatory guidance', 'Offer: assessment CTA only after 3 content touches'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Nurture pattern stored: VP champions get different track than CxO buyers', 'Content-first → CTA-last sequencing rule encoded', '5 contacts matched: VP AI / VP Digital roles'] },
      { step: 's4', heading: 'Generated Asset', points: ['Marketo nurture program: 4 emails, 45-day cadence', 'Smart list: VP title filter + ICP account match', 'CTA at email 4 only: Readiness Assessment booking'] }
    ],
    insight: 'VP-level champions need to be educated before they can sponsor the economic buyer\'s decision. Sending them an assessment CTA at touch 1 would kill the relationship — Helix derived the content-first, late-CTA structure from the deck\'s champion-building play.'
  },
  'mkto-pilot': {
    label: 'Marketo · Program',
    title: 'AgentOps-Q1-PostAssessment-Pilot',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Trigger: contact has completed Readiness Assessment', 'Mid-funnel motion: assessment → pilot conversion', 'All personas eligible — triggered by behavior, not segment'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Offer: 30-Day Pilot (free, qualified) extracted from deck', 'Message: assessment results → pilot recommendation', '3-touch sequence: results → pilot overview → activation'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Trigger pattern stored: assessment completion → pilot offer', 'Offer catalog: 30-Day Pilot mapped as mid-funnel offer', 'Conversion bridge: assessment to pilot stored as canonical motion'] },
      { step: 's4', heading: 'Generated Asset', points: ['Marketo trigger campaign: fires on assessment form completion', '3-email sequence over 7 days', 'Offer: 30-Day Pilot · CTA: "Activate Your Pilot"'] }
    ],
    insight: 'This is a trigger program, not a batch campaign — it fires when someone finishes the assessment. The 3-touch sequence and 7-day window came from the deck\'s stated conversion expectations for mid-funnel motion.'
  },
  // ── MARKETO TOKENS ──
  'tok-name': {
    label: 'Marketo · Token',
    title: '{{my.CampaignName}} = "Govern What You\'ve Built"',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Brand voice: authority + urgency, not features', 'Naming pattern: verb-driven, outcome-focused campaigns', 'Language extracted from deck cover and summary slide'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Campaign theme: governance urgency before regulators arrive', '"Govern What You\'ve Built" extracted from deck slide 2 header', 'Applied as campaign name AND subject line anchor across all channels'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Campaign naming convention stored: [Verb] + [Outcome]', 'Theme phrase mapped to {{my.CampaignName}} token', 'Applied to all 6 Marketo programs via token inheritance'] },
      { step: 's4', heading: 'Generated Asset', points: ['Token value: "Govern What You\'ve Built"', 'Used in: email subject lines, landing page H1, SF campaign description', 'Consistent across all 6 programs — single source of truth'] }
    ],
    insight: 'This phrase came verbatim from the deck. Helix extracted it as the campaign theme and propagated it as a token — ensuring every email, landing page, and SF record uses the exact same language the strategist intended.'
  },
  'tok-product': {
    label: 'Marketo · Token',
    title: '{{my.Product}} = "Northstar AgentOps"',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Product name extracted from deck slide 1 and slide 5', 'Brand: Northstar AI (parent) · Product: AgentOps (module)', 'Full product name used in outbound messaging [EXPLICIT]'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Product focus: AgentOps governance module specifically', 'Not "Northstar AI" — the AgentOps product is the campaign subject', 'Used in value prop statements and offer descriptions'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Product name stored as canonical field in GTM model', 'Token mapped: {{my.Product}} = "Northstar AgentOps"', 'Consistent product reference across all channels'] },
      { step: 's4', heading: 'Generated Asset', points: ['Token used in: subject lines, body copy, CTA buttons', 'Prevents product name inconsistency across 6 programs', '"Northstar AgentOps" vs "AgentOps" vs "Northstar" resolved'] }
    ],
    insight: 'Without this token, different writers would use "Northstar," "AgentOps," and "Northstar AgentOps" interchangeably. Helix stores the canonical product name and enforces it across all generated assets.'
  },
  'tok-cta': {
    label: 'Marketo · Token',
    title: '{{my.CTA_Text}} = "Book Readiness Assessment"',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Primary CTA: top-of-funnel, low-friction offer', 'Assessment format: free, self-serve, no sales call required', 'CTA language: action verb + specific offer name'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary offer: AI Agent Governance Readiness Assessment', '"Book" as CTA verb — implies calendar/scheduling action', 'Applied to all segments except customer expansion (enterprise CTA)'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CTA text mapped to offer catalog: Assessment offer', 'Token stored: {{my.CTA_Text}} = "Book Readiness Assessment"', 'Persona-level CTA override available for customer/pipeline segments'] },
      { step: 's4', heading: 'Generated Asset', points: ['CTA applied to: all 6 email programs, landing pages, Outreach sequences', 'Consistent button label across all channels', 'Overridden to "Activate 30-Day Pilot" for post-assessment program'] }
    ],
    insight: 'CTA consistency is often broken when different teams write different button labels. Helix extracted "Book Readiness Assessment" from the deck\'s offer section and locked it as a token — preventing "Schedule a Demo," "Learn More," and other generic CTAs from creeping in.'
  },
  'tok-url': {
    label: 'Marketo · Token',
    title: '{{my.CTA_URL}} = "northstar.ai/assess"',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Landing page: dedicated assessment booking page', 'URL structure: brand domain + /assess path', 'UTM parameters applied at campaign level'] },
      { step: 's2', heading: 'Campaign DNA', points: ['URL extracted from deck\'s offer section and CTA slides', 'Single destination for all primary CTAs', 'UTM params: utm_source=helix, utm_campaign=agentops-q1'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CTA URL stored as token: {{my.CTA_URL}}', 'UTM parameter template stored for campaign attribution', 'Single URL = single attribution source for conversion tracking'] },
      { step: 's4', heading: 'Generated Asset', points: ['Token value: northstar.ai/assess', 'Applied to all CTA buttons across 6 Marketo programs', 'Outreach sequences and LinkedIn ads use same destination'] }
    ],
    insight: 'A single token for the CTA URL means one place to update if the landing page changes. It also ensures UTM consistency — every click is attributed to the right campaign source regardless of which channel sent it.'
  },
  'tok-offer': {
    label: 'Marketo · Token',
    title: '{{my.Offer_Primary}} = "AI Agent Governance Readiness Assessment"',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Primary offer: top-of-funnel, free, low-friction', 'Offer name extracted verbatim from deck slide 8', 'Assessment format: self-guided, 20-minute, produces a report'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Assessment is the primary conversion action for all cold segments', 'Offer description: "Assess your AI agent governance readiness in 20 minutes"', 'Positioned before pilot offer in conversion sequence'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Offer catalog entry: Assessment → Pilot → Enterprise', 'Primary offer token: full name for subject lines and headers', 'Short form "Readiness Assessment" for CTA buttons (stored separately)'] },
      { step: 's4', heading: 'Generated Asset', points: ['Token used in: email body copy, landing page descriptions', 'Full name in H1: "Book Your AI Agent Governance Readiness Assessment"', 'Short form used in CTA buttons and subject lines'] }
    ],
    insight: 'The offer name is long but specific — "AI Agent Governance Readiness Assessment" communicates exactly what the prospect gets and who it\'s for. Helix extracted it verbatim from the deck rather than shortening it to a generic "assessment."'
  },
  'tok-reg': {
    label: 'Marketo · Token',
    title: '{{my.Regulatory_Hook}} = [Per-segment: OCC / EU AI Act / MAS]',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['3 regulatory frameworks identified in deck: OCC/Fed (NA), EU AI Act (EU), MAS/APRA (APAC)', 'Each framework maps to a specific geographic segment', 'Regulatory urgency is the primary cold outreach angle [EXPLICIT]'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Regulatory hook is the lead pain point across all personas', 'NA: OCC model risk guidance · EU: Article 6 high-risk AI · APAC: MAS TRM', 'Token populated per-segment, not per-program'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['3 regulatory hook values stored: NA, EU, APAC variants', 'Regulatory_Driver__c field mapped to token at segment level', 'Token override: EU programs get EU AI Act, APAC gets MAS/APRA'] },
      { step: 's4', heading: 'Generated Asset', points: ['Token dynamically resolved per smart list segment', 'NA contacts: "OCC model risk guidance"', 'EU contacts: "EU AI Act Article 6" · APAC: "MAS TRM 2021"'] }
    ],
    insight: 'This is one token with three values — resolved at send time based on the contact\'s segment. Without this approach, you\'d need three separate email templates per persona track. Helix stored all three regulatory hooks and mapped them to geographic segments automatically.'
  },
  // ── OUTREACH ──
  'seq-cro': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — CRO — Regulatory Urgency — 5 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Persona: CRO — Chief Risk Officer', 'Primary pain: "Regulatory audit trail gaps for AI agent decisions" [EXPLICIT]', 'Regulatory pressure: OCC model risk / EU AI Act / board accountability'] },
      { step: 's2', heading: 'Campaign DNA', points: ['CRO message angle: audit trail + regulatory evidence before OCC asks', 'Urgency: enforcement deadlines, not abstract risk', 'Social proof: "how one global insurer documented 200 agent decisions in a week"'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CRO persona mapped to: pain=audit trail, value=compliance evidence, offer=assessment', 'Sequence length: 5 touches (CRO requires most nurturing — highest stakes decision)', 'Regulatory hook: resolves per segment geo at send time'] },
      { step: 's4', heading: 'Generated Asset', points: ['Subject line T1: "Your AI agents are running. Will you have the audit trail when OCC asks?"', '5-touch: T1 cold · T2 social proof · T3 regulation deadline · T4 case study · T5 break-up', 'CTA: Book Readiness Assessment'] }
    ],
    insight: 'The subject line came directly from the deck\'s CRO pain point: "I don\'t have an audit trail for AI agent decisions." Helix converted that pain statement into a question the CRO asks themselves — the most effective cold email framing.'
  },
  'seq-cco': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — CCO — Audit Automation — 5 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Persona: CCO — Chief Compliance Officer', 'Primary pain: "Manual evidence collection for AI audits" [EXPLICIT]', 'Current state: 6-week manual audit process'] },
      { step: 's2', heading: 'Campaign DNA', points: ['CCO angle: time savings + audit automation vs CRO\'s regulatory angle', 'Social proof: "Turn a 6-week AI audit into 3 hours"', 'Proof point extracted from deck\'s CCO value prop slide'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CCO persona: pain=manual audit, value=automated evidence, offer=assessment', 'Differentiated from CRO: operational efficiency vs regulatory risk', '5-touch sequence — same length as CRO (C-suite engagement threshold)'] },
      { step: 's4', heading: 'Generated Asset', points: ['Subject T1: "Turn a 6-week AI audit into 3 hours — here\'s how one global insurer did it"', 'Social proof anchor at touch 1 (vs regulatory urgency for CRO)', 'CTA: Book Readiness Assessment'] }
    ],
    insight: 'The CCO and CRO are often the same call — different titles, different entry points. Helix generated separate sequences because the deck showed they respond to different frames: CRO hears "audit trail," CCO hears "audit automation."'
  },
  'seq-cio': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — CIO — Shadow AI — 5 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Persona: CIO — Chief Information Officer', 'Primary pain: "Shadow AI / ungoverned tool sprawl" [EXPLICIT]', 'Secondary fear: "I don\'t know how many AI agents are running in my org"'] },
      { step: 's2', heading: 'Campaign DNA', points: ['CIO angle: visibility + inventory vs audit/compliance', '"How many AI agents are running right now?" as the hook', 'Fear: ungoverned AI becomes a board-level incident'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CIO persona: pain=shadow AI, value=visibility+governance, offer=assessment', 'Different from CRO (audit) and CCO (evidence) — technology ownership angle', '5-touch: discovery → risk → solution → proof → CTA'] },
      { step: 's4', heading: 'Generated Asset', points: ['Subject T1: "How many AI agents are running in your org right now? Most CIOs don\'t know."', 'Opens with question — CIO\'s own uncertainty is the hook', 'CTA: Book Readiness Assessment (inventory angle)'] }
    ],
    insight: 'The CIO sequence uses the prospect\'s own uncertainty as the hook — "most CIOs don\'t know." This came from the deck\'s research finding that 73% of CIOs underestimate their deployed AI tool count. Helix turned that stat into an opener.'
  },
  'seq-cto': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — CTO — 48hr Deploy — 4 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Persona: CTO — Chief Technology Officer', 'Primary pain: "No real-time visibility into AI agent behavior" [EXPLICIT]', 'CTO frame: technical implementation, not regulatory'] },
      { step: 's2', heading: 'Campaign DNA', points: ['CTO angle: speed + integration, not compliance paperwork', '"48-hour deployment, no rip-and-replace" as the hook', 'Tech proof: API-first, Salesforce-native, no new infrastructure'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CTO persona: pain=no visibility, value=real-time monitoring, offer=assessment', '4-touch (shorter than CRO/CCO — CTO moves faster on tech decisions)', 'Technical differentiation: integration story vs governance story'] },
      { step: 's4', heading: 'Generated Asset', points: ['Subject T1: "Deploy AI agent governance in 48 hours — no rip-and-replace"', '4-touch: tech proof focused, less regulatory framing', 'CTA: Book Readiness Assessment (technical scoping call angle)'] }
    ],
    insight: 'CTOs tune out compliance talk — they want to know it deploys fast and doesn\'t break anything. The "48-hour deployment" hook came from the deck\'s technical architecture slide. Helix recognized it as the CTO-specific differentiator.'
  },
  'seq-eu': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — EU — EU AI Act Urgency — 4 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Geographic variant: UK + Western EU financial services', 'EU AI Act Article 6: high-risk AI classification requirements', 'Enforcement: February 2026 — 14 months from campaign launch'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Regulatory deadline as the primary urgency hook', 'Country-specific framing: UK uses FCA framing, EU uses Article 6', '"14 months away" as the subject line anchor'], },
      { step: 's3', heading: 'Canonical GTM Model', points: ['EU regulatory hook mapped: Regulatory_Driver__c = "EU AI Act"', 'Geo-specific sequence stored — not a persona variant but a geo variant', '4-touch: deadline → article overview → classification risk → CTA'] },
      { step: 's4', heading: 'Generated Asset', points: ['Subject T1: "EU AI Act enforcement is 14 months away. Is your AI agent program ready?"', 'EU AI Act framing used across all EU contacts regardless of persona', 'CTA: Book Readiness Assessment (compliance readiness angle)'] }
    ],
    insight: 'This sequence is geo-driven, not persona-driven — the EU AI Act is a stronger hook than any persona-specific pain for EU contacts. Helix recognized the enforcement deadline as the highest-urgency lever and made it the lead, superseding persona customization.'
  },
  'seq-pilot': {
    label: 'Outreach · Sequence',
    title: 'AgentOps — Post-Assessment — Pilot Activation — 3 touch',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Trigger: contact has completed Readiness Assessment', 'Mid-funnel motion: assessment → pilot conversion', 'All personas eligible — triggered by behavior'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Post-assessment offer: 30-Day Pilot extracted from deck', 'Message: "Your results are ready — here\'s your recommended pilot plan"', 'Urgency: results-driven, not cold outreach'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Trigger sequence stored: assessment complete → pilot offer', 'Conversion bridge: assessment → pilot is canonical motion', '3-touch (shorter — contact is already warm from assessment)'] },
      { step: 's4', heading: 'Generated Asset', points: ['Outreach trigger: fires when Marketo assessment form is completed', '3-touch over 5 days: results → pilot overview → activation', 'CTA: "Activate Your 30-Day Pilot"'] }
    ],
    insight: 'This sequence fires on a behavioral trigger, not a scheduled cadence. A contact who just finished the assessment is at peak intent — the 3-touch, 5-day window was derived from the deck\'s stated pilot conversion expectations.'
  },
  // ── LINKEDIN ──
  'li-na': {
    label: 'LinkedIn · Matched Audience',
    title: 'AgentOps — NA FS CxO — Tier 1/2',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: NA financial services, C-suite, 500+ employees', 'LinkedIn job function: CRO, CCO, CIO, CTO, Head of CX', 'Industry: Banking, Insurance, Wealth Management, FinTech'] },
      { step: 's2', heading: 'Campaign DNA', points: ['LinkedIn as paid demand gen channel for CxO audience', 'Ad creative: regulatory urgency + assessment CTA', 'Targeting mirrors Segment 1 definition exactly'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment 1 targeting rules translated to LinkedIn facets', 'Job function + industry + company size = LinkedIn audience spec', 'NA geo filter: US + Canada'] },
      { step: 's4', heading: 'Generated Asset', points: ['LinkedIn Matched Audience: account list + job title targeting', 'Ad creative: "Govern What You\'ve Built" campaign theme', 'CTA: northstar.ai/assess — consistent with Marketo/Outreach'] }
    ],
    insight: 'LinkedIn targeting mirrors the Salesforce Segment 1 definition exactly — same ICP criteria, same persona titles, same company size thresholds. Helix derived the LinkedIn audience spec directly from the segment rule, not from a separate LinkedIn strategy.'
  },
  'li-eu': {
    label: 'LinkedIn · Matched Audience',
    title: 'AgentOps — EU FS CxO — AI Act',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: UK + EU financial services, C-suite, 1,000+ employees', 'EU AI Act as primary message hook', 'Geo: UK, FR, DE, NL, Nordics'] },
      { step: 's2', heading: 'Campaign DNA', points: ['EU AI Act enforcement as ad creative angle', 'Higher employee threshold for EU: 1,000+ (vs 500+ NA)', 'LinkedIn Insight Tag planned for EU landing page retargeting'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['EU segment rules translated to LinkedIn audience spec', 'Employee threshold: 1,000+ (EU accounts tend to be larger)', 'Regulatory message: EU AI Act → ad copy variant'] },
      { step: 's4', heading: 'Generated Asset', points: ['LinkedIn audience: EU FS CxO, 1,000+ employees', 'Ad copy variant: EU AI Act enforcement deadline as hook', 'Same CTA URL as NA — geo-specific landing page [MISSING]'] }
    ],
    insight: 'The EU audience uses a stricter company size threshold than NA — 1,000+ employees vs 500+. This came from the deck\'s EU ICP definition, which noted EU financial institutions start at larger scale. Helix applied it automatically.'
  },
  'li-abm': {
    label: 'LinkedIn · Matched Audience',
    title: 'AgentOps — Top 200 ABM Account List',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ABM target: 200 named accounts across all regions', 'Tier 1 accounts: biggest revenue opportunity', 'All personas eligible — ABM covers all buying committee members'] },
      { step: 's2', heading: 'Campaign DNA', points: ['ABM motion: account-level targeting, all job functions', 'Paired with exec roundtable invitations', 'Account list: sourced from sales team [MISSING — awaiting input]'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['ABM pattern stored: named account list + all-persona targeting', 'Account list flagged [MISSING] — requires sales team upload', 'ABM LinkedIn + exec roundtable = coordinated top-account motion'] },
      { step: 's4', heading: 'Generated Asset', points: ['Status: Awaiting account list upload from sales team', 'LinkedIn Company Match: ready to activate once list provided', 'All other assets ready — this is the only blocker'] }
    ],
    insight: 'This audience is the only asset not ready to launch. It\'s blocked on the sales team\'s named account list — a dependency Helix flagged [MISSING] during extraction. Everything else in the campaign is ready; this is the single outstanding action item.'
  },
  // ── PERSONAS ──
  'persona-cro': {
    label: 'Institutional Memory · Persona',
    title: 'CRO — Chief Risk Officer',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: Chief Risk Officer (also: SVP Risk, Head of Model Risk)', 'Industry: Financial services — banking, insurance, wealth management', 'Reports to: CEO/Board · Accountable for regulatory compliance'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "I don\'t have an audit trail for AI agent decisions" [EXPLICIT]', 'Regulatory trigger: OCC model risk guidance, EU AI Act Article 6', 'Value prop: automated audit trail for every agent decision'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Persona stored: CRO · pain + value + offer + CTA + objections', 'Linked to: Segment 1 (NA CxO), Segment 2 (EU)', 'Offer affinity: Readiness Assessment primary, Pilot secondary'] },
      { step: 's4', heading: 'What Persists', points: ['Pain definition will not be re-extracted for Campaign 2', 'Regulatory hook mapping validated (97% confidence)', 'Next campaign inherits: CRO → assessment offer → audit trail value prop'] }
    ],
    insight: 'The CRO persona is the highest-confidence entry in the model — it was the most explicitly defined in the deck. Every future campaign that targets CROs starts from this definition without re-deriving it.'
  },
  'persona-cco': {
    label: 'Institutional Memory · Persona',
    title: 'CCO — Chief Compliance Officer',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: Chief Compliance Officer (also: Head of Compliance, CCO)', 'Often same person as CRO in smaller firms [INFERRED]', 'Operationally accountable for compliance evidence and audit readiness'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "Manual evidence collection for AI audits takes 6 weeks" [EXPLICIT]', 'Frame: operational efficiency + automation, not regulatory risk', 'Value prop: 6-week audit → 3 hours automated'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CCO persona stored: distinct from CRO — operations focus vs risk focus', 'Pain: manual audit → value: audit automation', 'Offer affinity: Readiness Assessment → Pilot for audit use case'] },
      { step: 's4', heading: 'What Persists', points: ['Differentiated from CRO: different pain, same offer', 'CCO/CRO co-buyer pattern stored for multi-threaded deals', 'Campaign 2 inherits: CCO gets audit automation angle, not regulatory risk angle'] }
    ],
    insight: 'The CCO and CRO are often in the same meeting. Helix stored them as separate personas with different pain entry points — CCO hears "automate your audit process," CRO hears "don\'t get caught without an audit trail."'
  },
  'persona-cio': {
    label: 'Institutional Memory · Persona',
    title: 'CIO — Chief Information Officer',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: CIO, CISO, Head of IT (adjacent)  ', 'Owns: AI tool governance, vendor management, security posture', 'Shadow AI is a CIO-specific concern — tools deployed without approval'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "I don\'t know how many AI agents are running in my org" [EXPLICIT]', 'Frame: visibility + inventory, not compliance paperwork', 'Value prop: real-time agent inventory + behavioral monitoring'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CIO persona stored: visibility/inventory frame, not audit/compliance', 'Separate from CRO (audit) and CCO (evidence) — different value prop', 'Offer: Readiness Assessment doubles as inventory exercise'] },
      { step: 's4', heading: 'What Persists', points: ['Shadow AI framing stored as CIO-specific angle', 'Inventory value prop distinct from compliance value prop', 'Campaign 2 inherits: CIO gets "how many agents?" hook, not regulatory hook'] }
    ],
    insight: 'The CIO persona reveals a product insight: the Readiness Assessment works as an AI inventory exercise, not just a compliance assessment. Helix captured this from the deck\'s CIO section and stored it as a separate value prop.'
  },
  'persona-cto': {
    label: 'Institutional Memory · Persona',
    title: 'CTO — Chief Technology Officer',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: CTO, VP Engineering, Head of Platform', 'Owns: technical architecture, deployment decisions, infrastructure', 'Implementation accountability — wants to know "how does this actually work?"'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "No real-time visibility into AI agent behavior" [EXPLICIT]', 'Frame: technical deployment speed + integration simplicity', 'Value prop: 48-hour deploy, API-first, no rip-and-replace'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CTO persona stored: technical deployment focus, not compliance', 'Shorter sequence: 4 touch (moves faster than CRO/CCO on tech decisions)', 'Offer affinity: assessment as technical scoping call, not compliance audit'] },
      { step: 's4', heading: 'What Persists', points: ['48hr deploy proof point stored as CTO-specific differentiator', 'Technical angle separated from compliance angle in model', 'Campaign 2 inherits: CTO gets tech proof, not regulatory urgency'] }
    ],
    insight: 'The CTO cares about deployment speed and integration complexity, not regulatory deadlines. Helix stored the 48-hour deployment proof point specifically for CTOs — it won\'t surface in CRO or CCO messaging.'
  },
  'persona-cx': {
    label: 'Institutional Memory · Persona',
    title: 'Head of CX — Chief Experience Officer',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: Head of CX, VP Customer Experience, Chief Experience Officer', 'Owns: customer-facing AI — chatbots, copilots, service agents', 'Risk: hallucinations and wrong answers in customer interactions'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "Hallucination risk in customer-facing AI agents" [EXPLICIT]', 'Frame: brand protection + customer trust, not regulatory compliance', 'Value prop: behavioral monitoring catches hallucinations before customers do'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['CX persona stored: customer-facing AI risk, brand protection angle', 'Different entry point: not regulatory but brand/reputation risk', 'Offer: Readiness Assessment (customer AI audit variant)'] },
      { step: 's4', heading: 'What Persists', points: ['Hallucination risk framing stored — distinct from regulatory risk', 'Brand protection angle available for customer-facing AI campaigns', 'Campaign 2 inherits: CX gets "catch hallucinations before customers do"'] }
    ],
    insight: 'The Head of CX is often overlooked in B2B enterprise campaigns — but they own the highest-risk AI surface. Helix extracted them from the deck\'s buying committee table and stored the hallucination risk frame as their specific entry point.'
  },
  'persona-vpai': {
    label: 'Institutional Memory · Persona',
    title: 'VP AI — VP of Artificial Intelligence',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Title: VP AI, Head of AI, Director of AI/ML', 'Often the internal AI champion — building the business case for governance', 'Influence: high · Purchase authority: low (reports to CTO or COO)'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary pain: "Cannot demonstrate ROI of AI agent investments to board" [EXPLICIT]', 'Frame: board-level ROI proof, not technical or compliance', 'Value prop: governance data enables ROI reporting and investment justification'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['VP AI persona stored: champion role, not economic buyer', 'Nurture track assigned: longer cycle, content-first', 'Offer: thought leadership content → assessment at touch 4'] },
      { step: 's4', heading: 'What Persists', points: ['Champion persona pattern stored: nurture, not direct CTA', 'ROI proof value prop distinct from compliance/risk value props', 'Campaign 2 inherits: VP AI gets content-first nurture track automatically'] }
    ],
    insight: 'The VP AI is the most important persona to warm early — they\'re the internal advocate who creates the conditions for an executive purchase. Helix stored them in the nurture track specifically, ensuring future campaigns don\'t accidentally send them a direct sales CTA at touch 1.'
  },
  // ── OFFERS ──
  'offer-assessment': {
    label: 'Institutional Memory · Offer',
    title: 'AI Agent Governance Readiness Assessment',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Offer type: free, self-serve, top-of-funnel', 'Format: 20-minute structured assessment, produces a readiness score', 'Purpose: low-friction entry point for all 6 personas'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Primary CTA for all cold segments and personas', 'Extracted verbatim from deck slide 8: "AI Agent Governance Readiness Assessment"', 'Outcome: readiness score + recommended next step (pilot)'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Offer catalog entry 1 of 3: top of funnel', 'Mapped to primary CTA token: {{my.CTA_Text}} = "Book Readiness Assessment"', 'Trigger: assessment completion → post-assessment pilot sequence'] },
      { step: 's4', heading: 'What Persists', points: ['Assessment is the default offer for all net-new demand gen', 'Offer definition reused in Campaign 2 — not re-derived', 'Conversion rate baseline: will be measured and stored after Campaign 1'] }
    ],
    insight: 'The Assessment is the campaign\'s universal entry point — every persona, every segment, every channel leads here first. Helix stored it as the top-of-funnel offer so future campaigns don\'t start from scratch deciding what to offer cold contacts.'
  },
  'offer-pilot': {
    label: 'Institutional Memory · Offer',
    title: '30-Day Pilot',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Offer type: free, qualification-gated, mid-funnel', 'Format: 30-day live environment deployment', 'Eligibility: post-assessment completion OR sales-qualified lead'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Mid-funnel bridge: assessment complete → pilot activation', 'Extracted from deck slide 9: "30-Day Pilot at no cost for qualified accounts"', 'Qualification: ICP Tier 1/2 + assessment completed'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Offer catalog entry 2 of 3: mid-funnel', 'Trigger condition: assessment form completion OR AE referral', 'Mapped to post-assessment Outreach sequence: 3-touch pilot activation'] },
      { step: 's4', heading: 'What Persists', points: ['Pilot offer stored: triggers automatically after assessment', 'Qualification criteria locked: Tier 1/2 + assessment required', 'Campaign 2 inherits same pilot offer — no redefinition needed'] }
    ],
    insight: 'The Pilot is only offered after the Assessment — it\'s gated by qualification, not freely available. Helix encoded this sequencing rule in the offer catalog so future campaigns automatically preserve the assessment-first conversion path.'
  },
  'offer-enterprise': {
    label: 'Institutional Memory · Offer',
    title: 'Enterprise License',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Offer type: paid, bottom-of-funnel, AE-led', 'Format: annual contract, $180K–$450K ARR', 'Qualification: pilot completed OR direct enterprise referral'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Bottom-funnel CTA for customer expansion and pilot-converted accounts', 'Not offered to cold contacts — only to pilot graduates or existing customers', 'Pricing extracted from deck slide 10: $180K–$450K ARR'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Offer catalog entry 3 of 3: bottom of funnel', 'Segment rule: only shown to Account.Type=Customer OR pilot-converted accounts', 'AE-led — not automated sequence; requires manual qualification'] },
      { step: 's4', heading: 'What Persists', points: ['Enterprise offer restricted to: customer expansion + post-pilot tracks', 'Pricing band stored: $180K–$450K (will update as deals close)', 'Campaign 2 inherits: enterprise offer available only after pilot gate'] }
    ],
    insight: 'The enterprise offer is the only bottom-of-funnel item in the catalog, and it\'s intentionally restricted. Helix stored the qualification gate (pilot completion or existing customer) to prevent the enterprise offer from appearing in cold demand gen sequences.'
  },
  // ── FIELD MAPPINGS ──
  'field-persona': {
    label: 'Field Mapping · 97% Confidence',
    title: 'Target_Persona__c ↔ persona.name',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Salesforce custom field: Target_Persona__c (picklist)', 'Persona values: CRO, CCO, CIO, CTO, Head of CX, VP AI', 'Field created to store Helix-derived persona assignment'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Persona extracted per contact during CRM matching', 'Mapped from: Contact.Title → persona definition → Target_Persona__c value', 'Used to route contacts to correct Marketo email stream'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Mapping validated: 38 contacts assigned without conflict', '97% confidence: only 1 contact edge case (dual title CRO/CCO)', 'Picklist values locked — matches persona library exactly'] },
      { step: 's4', heading: 'What Persists', points: ['Mapping will not be re-derived for Campaign 2', 'Confidence increases to 99%+ after second campaign validates same logic', 'Any new persona added to deck → new picklist value flagged automatically'] }
    ],
    insight: 'At 97% confidence, this is the highest-validated mapping in the model. The single edge case was a contact with dual CRO/CCO title — Helix flagged it for human review rather than guessing. That\'s what 97% vs 100% means in practice.'
  },
  'field-type': {
    label: 'Field Mapping · 96% Confidence',
    title: 'Campaign_Type__c ↔ campaign.type',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Salesforce field: Campaign_Type__c (custom, text)', 'Values in use: Email, Event, Webinar, Direct Mail, Other', 'Standard SF Type field also populated for reporting compatibility'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Campaign types extracted from deck: email demand gen, events (webinar, roundtable), direct mail', 'Each child campaign mapped to its execution channel', '9 campaigns → 5 types distributed across hierarchy'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Type mapping validated: 9 campaigns, 0 conflicts', '96% confidence (1 edge: roundtable classified as Event, not Other)', 'Type values stored as canonical set for Northstar campaigns'] },
      { step: 's4', heading: 'What Persists', points: ['Campaign type vocabulary locked for future campaigns', 'New campaign types will be flagged for model update', 'Campaign 2: type assignment auto-derived from campaign strategy section'] }
    ],
    insight: 'The "type vocabulary" problem is real — without this mapping, different campaigns use different type labels for the same channel (Event vs Conference vs Roundtable). Helix stored the canonical type set so future campaigns use consistent terminology.'
  },
  'field-icp': {
    label: 'Field Mapping · 94% Confidence',
    title: 'ICP_Tier__c ↔ segment.tier',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Salesforce custom field: ICP_Tier__c (picklist: Tier 1, Tier 2, Out of ICP)', 'Tier 1: $10B+ AUM or 1,000+ employees', 'Tier 2: $1B–$10B AUM or 500–1,000 employees'] },
      { step: 's2', heading: 'Campaign DNA', points: ['ICP tier definition extracted from deck\'s ICP section', 'Revenue threshold: $10B+ for Tier 1 [EXPLICIT]', 'Employee threshold: 500+ [INFERRED from segment definition]'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['ICP_Tier__c mapping validated against 38 contacts', '94% confidence: 2 edge cases where AUM data was missing', 'MISSING flag applied to 2 contacts: insufficient account data'] },
      { step: 's4', heading: 'What Persists', points: ['Tier thresholds stored: $10B+ = Tier 1, $1–10B = Tier 2', 'Edge case handling: missing AUM → default to employee count', 'Campaign 2 inherits tier logic — no re-derivation'] }
    ],
    insight: '94% confidence means 2 contacts couldn\'t be tier-assigned because their account revenue data was missing in Salesforce. Helix flagged them [MISSING] rather than guessing. Improving Salesforce data quality will raise this to 98%+.'
  },
  'field-offer': {
    label: 'Field Mapping · 92% Confidence',
    title: 'Primary_Offer__c ↔ offers.primary',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Salesforce custom field: Primary_Offer__c (text)', 'Values: "Readiness Assessment", "30-Day Pilot", "Enterprise License"', 'Offer assignment determines email CTA and landing page destination'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Offer mapping: cold contacts → Assessment, pipeline → Pilot CTA, customers → Enterprise', 'Extracted offer logic from deck\'s conversion funnel section', '3 offers → 3 distinct Salesforce field values'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['92% confidence: 3 contacts had ambiguous stage (pipeline + assessment eligible)', 'Rule stored: assessment wins over pilot for first-touch cold contacts', 'Offer sequencing enforced: assessment → pilot → enterprise (no skipping)'] },
      { step: 's4', heading: 'What Persists', points: ['Offer assignment rules stored and validated', 'Ambiguous cases: pipeline contacts who haven\'t been assessed get Assessment, not Pilot', 'Campaign 2 inherits: same offer rules, 0 re-derivation needed'] }
    ],
    insight: 'The 3 ambiguous cases were contacts in open pipeline who\'d never done an assessment. Helix resolved them to "Assessment" (not "Pilot") because the offer sequence rule requires assessment before pilot. That rule is now stored and enforced.'
  },
  'field-persona-mkto': {
    label: 'Field Mapping · 91% Confidence',
    title: '{{my.Persona}} ↔ persona.name',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Marketo token: {{my.Persona}} (program-level token)', 'Used in email subject line and body for personalization', 'Values: CRO, CCO, CIO, CTO, Head of CX, VP AI'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Persona token used in Marketo email personalization', '"[First Name], as a [Persona], you need..." subject line pattern', 'Different from SF field: Marketo token is display label, SF field is lookup value'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Marketo token mapping validated: 91% confidence', 'Lower than SF field (97%) due to smart list membership edge cases', '3 contacts assigned to wrong smart list (dual-title edge cases)'] },
      { step: 's4', heading: 'What Persists', points: ['Token value mapping stored: persona.name → {{my.Persona}} display label', 'Edge case rule: dual-title contacts default to primary title', 'Campaign 2: smart list logic pre-built, 0 re-configuration needed'] }
    ],
    insight: 'This mapping has lower confidence than the Salesforce equivalent because Marketo smart lists have edge cases the SF picklist doesn\'t. 3 dual-title contacts were assigned to the wrong stream. The fix is stored — Campaign 2 has the corrected smart list logic.'
  },
  'field-regulatory': {
    label: 'Field Mapping · 89% Confidence',
    title: 'Regulatory_Driver__c ↔ messaging.urgency',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Salesforce custom field: Regulatory_Driver__c (picklist)', 'Values: OCC/Fed, EU AI Act, MAS/APRA, NYDFS, Other', 'Field drives email subject line and sequence selection'] },
      { step: 's2', heading: 'Campaign DNA', points: ['3 regulatory hooks extracted: OCC (NA), EU AI Act (EU), MAS/APRA (APAC)', 'EU AI Act: [EXPLICIT] · OCC: [EXPLICIT] · MAS/APRA: [INFERRED]', 'Lowest-confidence mapping in model due to APAC inferences'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['89% confidence — driven by APAC [INFERRED] hook', 'NA and EU regulatory mappings are 97%+ individually', 'APAC MAS/APRA confidence: ~74% — needs validation next campaign'] },
      { step: 's4', heading: 'What Persists', points: ['3 regulatory hook values stored with individual confidence scores', 'MAS/APRA flagged for validation in Campaign 2', 'EU AI Act and OCC stored as high-confidence, ready to use'] }
    ],
    insight: 'The 89% overall confidence is pulled down by the APAC MAS/APRA inference. NA and EU regulatory mappings are 97%+. The next APAC campaign will either validate MAS/APRA (confidence rises) or reveal a better hook (model updates). This is exactly how the model improves.'
  },
  // ── SEGMENT TEMPLATES ──
  'tmpl-na': {
    label: 'Segment Template',
    title: 'NA Tier 1/2 CxO — Financial Services',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: US/Canada FS, 500–10K employees', 'Titles: CRO, CCO, CIO, CTO, Head of CX, VP AI', 'Industry: Banking, Insurance, Wealth Management, FinTech'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Segment used in Q1 AgentOps launch — 18 contacts validated', 'Regulatory hook: OCC/Fed model risk framework', 'Primary motion: 6-persona demand gen email'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment rule stored: Account.Industry=FS AND Account.BillingCountry IN (US, CA)', 'Employee filter: 500+ · Title filter: CxO and VP level', '18 contacts validated against this exact rule'] },
      { step: 's4', heading: 'What Persists', points: ['Template reusable for any future NA FS campaign', 'Contact count will grow as new contacts added to CRM', 'Campaign 2: segment loads automatically — 0 re-derivation'] }
    ],
    insight: 'This template has been validated against 18 real CRM contacts. The next NA FS campaign doesn\'t rebuild the segment from scratch — it loads this template, filters against the current CRM state, and gets a refreshed contact list automatically.'
  },
  'tmpl-eu': {
    label: 'Segment Template',
    title: 'UK/Europe — EU AI Act',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: UK + Western EU FS, 1,000+ employees', 'Titles: CRO/CCO primary, CIO secondary', 'Geo: UK, FR, DE, NL, SE, NO'] },
      { step: 's2', heading: 'Campaign DNA', points: ['EU AI Act enforcement as primary urgency hook', '9 contacts validated in Q1 campaign', 'Regulatory hook: Article 6 high-risk AI classification'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment rule: BillingCountry IN (UK, FR, DE, NL, SE, NO) AND employees 1,000+', 'Regulatory_Driver__c = "EU AI Act" stored as segment attribute', '9 contacts validated; 3 more in pipeline for Q2'] },
      { step: 's4', heading: 'What Persists', points: ['EU AI Act hook stored at 96% confidence — will not be re-inferred', 'Template reusable for any EU FS campaign', '1,000+ employee threshold locked (vs 500+ for NA)'] }
    ],
    insight: 'The EU template stores a higher employee threshold than NA — 1,000+ vs 500+. This came from the deck\'s EU ICP section. Future EU campaigns inherit this threshold automatically, preventing the common mistake of using the same size filter globally.'
  },
  'tmpl-apac': {
    label: 'Segment Template',
    title: 'APAC — MAS/APRA Compliance',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['ICP: Singapore and Australian FS firms', 'Titles: CRO/CCO primary (CTO/CIO secondary — fewer matches)', 'Regulatory: MAS TRM 2021, APRA CPS 230 [INFERRED]'] },
      { step: 's2', heading: 'Campaign DNA', points: ['7 contacts validated — smallest segment', 'MAS/APRA regulatory hook [INFERRED — 74% confidence]', 'CTO variant absent: insufficient APAC CTO contacts'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Segment rule: BillingCountry IN (SG, AU) AND FS industry', 'MAS/APRA hook stored but flagged [INFERRED]', 'Next APAC campaign: validate or replace hook'] },
      { step: 's4', heading: 'What Persists', points: ['APAC template stored with [INFERRED] flag on regulatory hook', 'Template loads 7 validated contacts + new APAC additions', 'Campaign 2 APAC: will either confirm MAS/APRA or surface better hook'] }
    ],
    insight: 'The APAC template is the youngest entry in the model — only 1 campaign, [INFERRED] regulatory hook. The model correctly flags its lower confidence. Running a second APAC campaign is the only way to validate it.'
  },
  'tmpl-pipeline': {
    label: 'Segment Template',
    title: 'Open Pipeline — All Regions',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: contacts attached to open SF Opportunities', 'Stage range: Qualification → Negotiation (not Closed)', 'All regions, all personas eligible'] },
      { step: 's2', heading: 'Campaign DNA', points: ['11 contacts validated: pipeline acceleration motion', 'Different content track: proof/ROI vs awareness', 'Direct mail offer vs email demand gen'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Contact has Opportunity.StageName NOT IN (Closed Won, Closed Lost, Closed No Decision)', 'Cross-regional: no geo restriction on pipeline segment', 'Message track stored: proof-of-value, not awareness'] },
      { step: 's4', heading: 'What Persists', points: ['Pipeline segment logic reusable for all future campaigns', 'Contact count will change as opportunities open/close', 'Content track stored: pipeline contacts always get proof-track messaging'] }
    ],
    insight: 'The pipeline segment is defined by CRM stage, not demographics — it cuts across all geographies and personas. Any future campaign that includes a pipeline acceleration track can load this template and get the current open opportunity contact list in seconds.'
  },
  'tmpl-customer': {
    label: 'Segment Template',
    title: 'Customer Expansion',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: Account.Type = Customer in Salesforce', '4 contacts validated — high value, low volume', 'All regions, CTO/CIO primary personas for expansion'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Expansion play: starter → enterprise license upgrade', 'Content: value realized → scale coverage', 'Offer: Enterprise License (not Assessment)'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Account.Type = "Customer" AND no DNC flag', 'Offer override: customers get enterprise CTA, not assessment', 'AE-led motion stored: not automated sequence'] },
      { step: 's4', heading: 'What Persists', points: ['Customer expansion template stored: enterprise offer, AE-led', 'Contact count grows as new customers close', 'Campaign 2: customer segment auto-isolated from demand gen flows'] }
    ],
    insight: 'The customer expansion template ensures existing customers are never accidentally mixed into cold demand gen flows. The offer override (enterprise vs assessment) is stored — customers get the enterprise upgrade CTA, not the free assessment they\'ve presumably already done.'
  },
  'tmpl-nurture': {
    label: 'Segment Template',
    title: 'VP Nurture Stream',
    chain: [
      { step: 's1', heading: 'Org Ontology', points: ['Segment: VP-level titles (not C-suite) at ICP accounts', '5 contacts validated: VP AI, VP Digital, VP Innovation', 'Influencer/champion role — not economic buyer'] },
      { step: 's2', heading: 'Campaign DNA', points: ['Longer conversion cycle: 60–90 days', 'Content-first motion: thought leadership before CTA', 'Goal: warm to readiness assessment at touch 4'] },
      { step: 's3', heading: 'Canonical GTM Model', points: ['Rule: Contact.Title CONTAINS "VP" AND level=VP (not C-suite)', 'Nurture pattern stored: 4-touch, content-first, late CTA', 'Champion development track distinguished from buyer track'] },
      { step: 's4', heading: 'What Persists', points: ['VP nurture template stored: content-first, assessment CTA at touch 4 only', '5 validated contacts + future VP additions auto-enrolled', 'Campaign 2 inherits: VP personas automatically routed to nurture track'] }
    ],
    insight: 'The nurture template encodes a sequencing rule: VPs get content first, CTA last. This prevents future campaigns from sending a sales CTA to a VP champion at touch 1 — the relationship gets built before the ask is made.'
  }
};

// ─── FOUNDATION UPLOAD STATE ───────────────────────────────────
const FND = { sf: [], map: [], gov: [], linkedin: [], snowflake: [], activity: [] };

// Simulated metadata for preview modal — keyed by file extension pattern
function _fndSimMeta(name, size) {
  const isCSV = /\.csv$/i.test(name);
  const isXLSX = /\.xlsx$/i.test(name);
  const isPDF = /\.pdf$/i.test(name);
  const records = isCSV ? Math.floor(Math.random() * 2000) + 200 : isXLSX ? Math.floor(Math.random() * 500) + 50 : null;
  const cols = isCSV || isXLSX ? Math.floor(Math.random() * 40) + 8 : null;
  const sampleRows = isCSV || isXLSX ? [
    ['AccountName','CampaignType','ICP_Tier__c','Target_Persona__c','Status'],
    ['Citadel Financial','Product Launch','Tier 1','CRO','Active'],
    ['Global Trust Bank','Demand Gen','Tier 1','CCO','Sent'],
    ['Pacific Mutual','ABM','Tier 2','CIO','Responded'],
  ] : null;
  return { records, cols, sampleRows, isPDF };
}

function foundationUpload(bucket, input) {
  if (!input.files.length) return;
  const f = input.files[0];
  const icon = /\.(pdf|docx)$/i.test(f.name) ? '📄' : /\.(json|sql)$/i.test(f.name) ? '🗄' : '📊';
  const meta = _fndSimMeta(f.name, f.size);
  FND[bucket].push({
    name: f.name,
    size: _fmtSize(f.size),
    icon,
    uploadedAt: new Date().toLocaleString(),
    records: meta.records,
    cols: meta.cols,
    sampleRows: meta.sampleRows,
    validation: 'Received',
    isUserUploaded: true,
  });
  input.value = '';
  _renderFndLists();
  _updateFndStatus();
  showToast('File received. Ontology building uses the preloaded Northstar demo dataset in this prototype.');
}

function loadDemoFoundation() {
  const hasExisting = ['sf','map','gov','linkedin','snowflake'].some(b => FND[b].length > 0);
  if (hasExisting) {
    openModal('Replace Foundation Data?', `
      <div style="font-size:14px; color:var(--txt2); margin-bottom:20px; line-height:1.6;">You already have files in the foundation. Replace them with the demo dataset?</div>
      <div style="display:flex; gap:8px; justify-content:flex-end;">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal(); _doLoadDemoFoundation()">Replace with Demo Data</button>
      </div>
    `);
    return;
  }
  _doLoadDemoFoundation();
}

function _doLoadDemoFoundation() {
  FND.sf = []; FND.map = []; FND.gov = []; FND.linkedin = []; FND.snowflake = [];
  const now = new Date().toLocaleString();

  FND.sf = [
    { name:'crm_campaign_history.csv', size:'3.1 MB', icon:'📊', platform:'CRM', records:1247, cols:38, sampleRows:[
      ['campaign_id','campaign_name','start_date','status','type','persona_tag','pipeline_value'],
      ['C-2024-001','AgentOps Q4 NA Launch','2024-10-01','Completed','Email','CRO','$2.1M'],
      ['C-2024-002','AgentOps EU Compliance','2024-10-15','Completed','Email','CCO','$880K'],
      ['C-2024-003','Enterprise Pilot Nurture','2024-11-01','Active','Nurture','CIO','$1.2M'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['ontology construction','field mapping','naming convention detection'] },
    { name:'crm_contact_metadata.csv', size:'1.8 MB', icon:'📊', platform:'CRM', records:892, cols:24, sampleRows:[
      ['contact_id','first_name','last_name','title','company','account_tier','region'],
      ['001','Sarah','Whitfield','CCO','Global Trust Bank','Tier 1','EU'],
      ['002','James','Okafor','CRO','Citadel Financial','Tier 1','NA'],
      ['003','Priya','Mehta','CIO','Singapore Fin Corp','Tier 2','APAC'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['contact scoring','persona mapping','segment assignment'] },
    { name:'crm_opportunity_stages.csv', size:'640 KB', icon:'📊', platform:'CRM', records:9, cols:6, sampleRows:[
      ['stage_name','probability','avg_days','close_rate'],
      ['Qualification','20%','14 days','38%'],
      ['Discovery','40%','21 days','52%'],
      ['Negotiation','75%','12 days','71%'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['pipeline stage mapping','opportunity scoring'] },
  ];

  FND.map = [
    { name:'map_program_library.xlsx', size:'2.4 MB', icon:'📋', platform:'Marketing Automation', records:312, cols:19, sampleRows:[
      ['program_id','program_name','channel','status','persona','token_count'],
      ['MK-001','AgentOps-Q1-NA-CRO-Email','Email','Active','CRO','24'],
      ['MK-002','AgentOps-Q1-EU-CCO-Email','Email','Active','CCO','18'],
      ['MK-003','AgentOps-Q1-Webinar-Reg','Event','Active','All','12'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['program structure mapping','token schema extraction','cross-system field alignment'] },
    { name:'map_token_schema.csv', size:'380 KB', icon:'📊', platform:'Marketing Automation', records:48, cols:5, sampleRows:[
      ['token_name','token_type','default_value','scope'],
      ['CampaignName','Text','[Campaign Name]','Program'],
      ['Persona','Text','[Persona]','Program'],
      ['CTALabel','Text','Book a Demo','Program'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['token population','canonical field mapping'] },
    { name:'sales_engagement_sequence_library.csv', size:'890 KB', icon:'📊', platform:'Sales Engagement', records:47, cols:12, sampleRows:[
      ['sequence_id','sequence_name','persona','touch_count','step_types'],
      ['SEQ-001','CRO NA Cold Outbound','CRO','5','Email,Call,Email,LinkedIn,Email'],
      ['SEQ-002','CCO EU Regulatory Urgency','CCO','4','Email,Email,Call,Email'],
      ['SEQ-003','Post-Assessment Pilot Activation','All','3','Email,Call,Email'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['sequence persona mapping','cross-system vocabulary alignment'] },
  ];

  FND.gov = [
    { name:'campaign_naming_standards.pdf', size:'420 KB', icon:'📄', platform:'Governance', records:null, cols:null, sampleRows:null, validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['governance rule extraction','naming convention detection','cross-system conflict detection'] },
    { name:'campaign_taxonomy_master.xlsx', size:'1.1 MB', icon:'📊', platform:'Governance', records:341, cols:8, sampleRows:[
      ['dimension','value','definition','applies_to'],
      ['Campaign_Type','Email','Single-touch or multi-step email program','CRM + MAP'],
      ['Persona','CRO','Chief Revenue Officer — primary economic buyer','All systems'],
      ['Region','EU','Europe: UK, Germany, France, Benelux, Nordics','All systems'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['taxonomy extraction','picklist governance','cross-system conflict detection'] },
    { name:'governance_rules.pdf', size:'310 KB', icon:'📄', platform:'Governance', records:null, cols:null, sampleRows:null, validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['governance rule extraction','approval workflow mapping'] },
  ];

  FND.linkedin = [
    { name:'paid_media_audience_export.csv', size:'2.2 MB', icon:'📊', platform:'Paid Media', records:5840, cols:14, sampleRows:[
      ['audience_id','audience_name','size','match_rate','persona'],
      ['AUD-001','FS CRO/CCO NA Tier 1','1,240','68%','CRO'],
      ['AUD-002','EU AI Act Regulatory Buyers','880','71%','CCO'],
      ['AUD-003','APAC FS Enterprise','620','59%','CIO'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['audience segment mapping','paid media alignment'] },
  ];

  FND.snowflake = [
    { name:'warehouse_contact_snapshot.csv', size:'4.8 MB', icon:'📊', platform:'Data Warehouse', records:12400, cols:31, sampleRows:[
      ['contact_key','account_key','canonical_persona','icp_score','last_engagement_days'],
      ['C-001','A-101','CRO','94','12'],
      ['C-002','A-102','CCO','87','28'],
      ['C-003','A-103','CIO','79','45'],
    ], validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['cross-system contact resolution','deduplication','segment enrichment'] },
    { name:'bi_campaign_performance_model.json', size:'1.3 MB', icon:'📋', platform:'Business Intelligence', records:null, cols:null, sampleRows:null, validation:'Passed', isDemo:true, uploadedAt:now, usedFor:['performance metric mapping','semantic layer alignment'] },
  ];

  _renderFndLists();
  _updateFndStatus();

  const hint = document.getElementById('fnd-demo-hint');
  if (hint) hint.style.display = '';

  showToast('Demo foundation data loaded');
  _addFndActivity('Loaded demo foundation data — 11 files across 5 categories');
}

function foundationRemove(bucket, idx) {
  FND[bucket].splice(idx, 1);
  _renderFndLists();
  _updateFndStatus();
}

function _addFndActivity(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  FND.activity.unshift({ ts, msg });
  _renderFndActivityLog();
}

function _renderFndActivityLog() {
  const wrap = document.getElementById('fnd-activity-wrap');
  const el = document.getElementById('fnd-activity-log');
  if (!el) return;
  if (!FND.activity.length) { if (wrap) wrap.style.display = 'none'; return; }
  if (wrap) wrap.style.display = '';
  el.innerHTML = FND.activity.slice(0, 6).map(e =>
    `<div style="display:flex; gap:10px; border-bottom:1px solid var(--border); padding:4px 0; last-child:border:none;">
       <span style="flex-shrink:0; color:var(--txt3);">${e.ts}</span>
       <span style="color:var(--txt2);">${e.msg}</span>
     </div>`
  ).join('');
}

function _fmtSize(b) {
  if (b > 1048576) return (b / 1048576).toFixed(1) + ' MB';
  return (b / 1024).toFixed(0) + ' KB';
}

function _renderFndLists() {
  _renderFndBucket('fnd-sf-list',       'sf',        'Export: Campaign History, Contact Metadata, Opportunity Stages');
  _renderFndBucket('fnd-map-list',      'map',       'Export: MAP Program Library, Sales Engagement Sequence Library');
  _renderFndBucket('fnd-gov-list',      'gov',       'Upload: Campaign Naming Standards, Taxonomy Master, Governance Rules');
  _renderFndBucket('fnd-optional-list', 'linkedin',  'Paid Media audience export');
  _renderFndBucket('fnd-optional-list', 'snowflake', 'Data Warehouse / BI export', true);
}

function _renderFndBucket(elId, bucket, hint, append) {
  const el = document.getElementById(elId);
  if (!el) return;
  const files = FND[bucket];

  if (elId === 'fnd-optional-list') {
    // combined render for linkedin + snowflake
    const all = [...FND.linkedin.map((f,i) => ({f,bucket:'linkedin',i})),
                 ...FND.snowflake.map((f,i) => ({f,bucket:'snowflake',i}))];
    if (!all.length) {
      el.innerHTML = '<div style="padding:12px 0; text-align:center; color:var(--txt3); font-size:12px;">Paid Media audience export · Data Warehouse / BI export</div>';
      return;
    }
    el.innerHTML = '<div class="asset-list">' + all.map(({f, bucket: b, i}) => _fndFileRow(f, b, i)).join('') + '</div>';
    return;
  }

  if (!files.length) {
    el.innerHTML = '<div style="padding:20px 0; text-align:center; color:var(--txt3); font-size:13px;">No files uploaded yet.<br><span style="font-size:12px;">' + hint + '</span></div>';
    return;
  }
  el.innerHTML = '<div class="asset-list">' + files.map((f, i) => _fndFileRow(f, bucket, i)).join('') + '</div>';
}

function _fndFileRow(f, bucket, i) {
  return '<div class="asset-row">' +
    '<div class="asset-row-left" onclick="foundationPreview(\'' + bucket + '\',' + i + ')" style="cursor:pointer;flex:1;min-width:0;">' +
      '<div class="asset-icon">' + f.icon + '</div>' +
      '<div style="min-width:0;">' +
        '<div class="asset-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + f.name + '</div>' +
        '<div class="asset-meta">' + f.size + ' · ' + (f.records ? f.records.toLocaleString() + ' rows' : 'document') + ' · click to preview</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:4px;align-items:center;flex-shrink:0;margin-left:8px;">' +
      (f.isUserUploaded ? '<span class="badge badge-amber" style="white-space:nowrap;font-size:10px;">Custom Upload</span>' : '<span class="badge badge-green" style="white-space:nowrap;">✓ Demo</span>') +
      '<button onclick="foundationRename(\'' + bucket + '\',' + i + ')" class="btn btn-ghost" style="font-size:11px;padding:3px 7px;">Rename</button>' +
      '<button onclick="foundationDownload(\'' + bucket + '\',' + i + ')" class="btn btn-ghost" style="font-size:11px;padding:3px 7px;">↓</button>' +
      '<button onclick="foundationRemove(\'' + bucket + '\',' + i + ')" style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:18px;line-height:1;padding:2px 6px;" title="Remove">×</button>' +
    '</div>' +
  '</div>';
}

function foundationRename(bucket, idx) {
  const f = FND[bucket] && FND[bucket][idx];
  if (!f) return;
  const val = prompt('Rename file:', f.name);
  if (val && val.trim() && val.trim() !== f.name) {
    FND[bucket][idx].name = val.trim();
    _renderFndLists();
  }
}

function foundationDownload(bucket, idx) {
  const f = FND[bucket] && FND[bucket][idx];
  if (!f) return;
  // Generate a stub CSV/text representing what was uploaded
  let content, mime, ext;
  if (/\.pdf$/i.test(f.name)) {
    content = '% Stub export of ' + f.name + '\n% Original uploaded ' + f.uploadedAt;
    mime = 'text/plain'; ext = '.txt';
  } else {
    const hdr = (f.sampleRows && f.sampleRows[0]) ? f.sampleRows[0].join(',') : 'Name,Value';
    const rows = (f.sampleRows || []).slice(1).map(r => r.join(',')).join('\n');
    content = hdr + '\n' + rows;
    mime = 'text/csv'; ext = '.csv';
  }
  const dl = f.name.replace(/\.[^.]+$/, '') + '_helix_export' + ext;
  dlFile(dl, content, mime);
  showToast('Downloading ' + f.name);
}

function foundationPreview(bucket, idx) {
  const f = FND[bucket] && FND[bucket][idx];
  if (!f) return;

  const rowsHtml = f.sampleRows ? (
    '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:8px;">' +
    f.sampleRows.map((row, ri) =>
      '<tr style="border-bottom:1px solid var(--border);">' +
      row.map(cell =>
        ri === 0
          ? '<th style="text-align:left;padding:5px 8px;color:var(--txt3);font-weight:600;background:var(--surface2);">' + cell + '</th>'
          : '<td style="padding:5px 8px;color:var(--txt2);">' + cell + '</td>'
      ).join('') + '</tr>'
    ).join('') + '</table>'
  ) : '<div style="color:var(--txt3);font-size:13px;padding:8px 0;">Document file — no tabular preview available.</div>';

  const badgeHtml = f.isDemo
    ? '<span style="display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:var(--accent);font-weight:600;letter-spacing:0.3px;margin-left:8px;">Demo Asset</span>'
    : f.isUserUploaded
      ? '<span style="display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);color:var(--amber);font-weight:600;letter-spacing:0.3px;margin-left:8px;">Custom Upload</span>'
      : '';

  const usedForHtml = (f.usedFor && f.usedFor.length)
    ? '<div style="margin-top:14px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;">' +
        '<div style="font-size:11px;color:var(--txt3);font-weight:600;letter-spacing:0.5px;margin-bottom:6px;">USED FOR</div>' +
        f.usedFor.map(u => '<div style="font-size:12px;color:var(--txt2);padding:2px 0;">· ' + u + '</div>').join('') +
      '</div>'
    : '';

  const html =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">' +
      (f.platform ? '<span style="font-size:12px;color:var(--txt3);font-weight:500;">' + f.platform + '</span>' : '') +
      badgeHtml +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-bottom:14px;">' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">FILE NAME</div><div style="font-size:13px;color:var(--txt);word-break:break-all;">' + f.name + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">LOADED</div><div style="font-size:13px;color:var(--txt);">' + f.uploadedAt + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">FILE SIZE</div><div style="font-size:13px;color:var(--txt);">' + f.size + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">VALIDATION</div><div style="font-size:13px;color:var(--green);">✓ ' + f.validation + '</div></div>' +
      (f.records != null ? '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">RECORD COUNT</div><div style="font-size:13px;color:var(--txt);">' + f.records.toLocaleString() + '</div></div>' : '') +
      (f.cols != null ? '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">COLUMN COUNT</div><div style="font-size:13px;color:var(--txt);">' + f.cols + '</div></div>' : '') +
    '</div>' +
    (f.sampleRows ? '<div style="font-size:11px;color:var(--txt3);margin-bottom:4px;font-weight:600;letter-spacing:0.5px;">SAMPLE ROWS</div>' : '') +
    rowsHtml +
    usedForHtml +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">' +
      '<button class="btn btn-ghost" onclick="foundationDownload(\'' + bucket + '\',' + idx + ');closeModal()">↓ Download</button>' +
      '<button class="btn btn-ghost" onclick="closeModal()">Close</button>' +
    '</div>';

  openModal(f.name, html);
}

function _updateFndStatus() {
  const hasSf  = FND.sf.length > 0;
  const hasGov = FND.gov.length > 0;
  const hasMap = FND.map.length > 0;
  const hasOpt = FND.linkedin.length > 0 || FND.snowflake.length > 0;
  const ready  = hasSf && hasGov;   // SF + Governance required

  const set = (id, on, ct, ctText) => {
    const ico = document.getElementById(id);
    const ctEl = document.getElementById(ct);
    if (ico) { ico.textContent = on ? '✓' : '○'; ico.style.color = on ? 'var(--green)' : 'var(--txt3)'; }
    if (ctEl) ctEl.textContent = ctText;
  };

  set('fck-sf',  hasSf,  'fck-sf-ct',  hasSf  ? FND.sf.length + ' file'  + (FND.sf.length  > 1 ? 's' : '') : '—');
  set('fck-gov', hasGov, 'fck-gov-ct', hasGov ? FND.gov.length + ' file' + (FND.gov.length > 1 ? 's' : '') : '—');
  set('fck-map', hasMap, 'fck-map-ct', hasMap ? FND.map.length + ' file' + (FND.map.length > 1 ? 's' : '') : 'optional');
  set('fck-opt', hasOpt, 'fck-opt-ct', hasOpt ? (FND.linkedin.length + FND.snowflake.length) + ' file(s)' : 'optional');

  const btn = document.getElementById('build-ontology-btn');
  const readyCard = document.getElementById('fnd-ready-card');
  if (btn) { btn.disabled = !ready; btn.style.opacity = ready ? '1' : '0.4'; btn.style.cursor = ready ? 'pointer' : 'not-allowed'; }
  if (readyCard) readyCard.style.display = ready ? 'block' : 'none';
}

// ─── CAMPAIGN WORKSPACE STATE ──────────────────────────────────

const DOC_SLOTS = [
  { key:'deck',         label:'Launch Deck',           icon:'📊' },
  { key:'messaging',    label:'Messaging Framework',   icon:'📄' },
  { key:'icp',          label:'ICP Document',          icon:'📄' },
  { key:'brief',        label:'Product Brief',         icon:'📄' },
  { key:'competitive',  label:'Competitive Brief',     icon:'📄' },
  { key:'sales_plays',  label:'Sales Plays',           icon:'📄' },
  { key:'regulatory',   label:'Regulatory Docs',       icon:'📄' },
  { key:'persona',      label:'Persona Research',      icon:'📄' },
  { key:'analyst',      label:'Analyst Research',      icon:'📄' },
];

function _makeCampaignDNA() {
  return {
    icp: { industries:'Banking · Insurance · Wealth Management · Fintech', employees:'200 – 5,000', revenue:'$50M – $5B ARR', regions:'NA · EMEA · APAC' },
    personas: [
      { name:'CRO', pain:'Regulatory audit trail gaps', value:'Automated compliance evidence', canonical:'Chief Risk Officer', confidence:95 },
      { name:'CCO', pain:'Manual evidence collection', value:'Real-time agent monitoring', canonical:'Chief Compliance Officer', confidence:92 },
      { name:'CIO', pain:'Shadow AI / tool sprawl', value:'Unified agent visibility layer', canonical:'Chief Information Officer', confidence:88 },
      { name:'CTO', pain:'No real-time agent visibility', value:'Production-grade observability', canonical:'Chief Technology Officer', confidence:85 },
      { name:'Head of CX', pain:'Hallucination risk in customer-facing AI', value:'Customer interaction audit trail', canonical:'Head of Customer Experience', confidence:80 },
      { name:'VP AI', pain:'Cannot prove board ROI on AI investment', value:'Governance data enables ROI reporting', canonical:'VP Artificial Intelligence', confidence:78 },
    ],
    buyingCommittee: [
      { role:'Economic Buyer', title:'CRO / CCO' },
      { role:'Champion', title:'VP AI / Head of AI' },
      { role:'Technical Buyer', title:'CTO / CIO' },
      { role:'Risk Stakeholder', title:'Chief Risk Officer' },
      { role:'Executive Sponsor', title:'CEO / COO' },
    ],
    offers: [
      { name:'Readiness Assessment', description:'Free 2-hour assessment of AI governance posture', cta:'Book Readiness Assessment → northstar.ai/assess', stage:'Top of Funnel' },
      { name:'30-Day Pilot', description:'Fully instrumented pilot — $0 for qualified accounts', cta:'Start Pilot', stage:'Mid Funnel' },
      { name:'Enterprise License', description:'Full AgentOps platform deployment', cta:'Contact Sales', stage:'Bottom of Funnel' },
    ],
    salesPlays: ['Land CRO/CCO → expand to CIO', 'Consolidation ROI → CIO/Procurement', 'Regulatory urgency → EU AI Act deadline', 'ROI proof → board budget cycle'],
    regulatory: [
      { region:'Europe', regulation:'EU AI Act (Aug 2026)', impact:'High — mandatory compliance for FS firms' },
      { region:'US Banking', regulation:'OCC Model Risk Guidance', impact:'High — agent models subject to SR 11-7' },
      { region:'UK', regulation:'FCA AI Strategy', impact:'Medium — principles-based, audit trail required' },
      { region:'Singapore', regulation:'MAS AI Governance', impact:'Medium — voluntary framework, competitive signal' },
      { region:'Australia', regulation:'APRA CPS 230', impact:'Medium — operational resilience requirements' },
    ],
    metrics: ['200 SQLs / 90 days', '300 assessments booked', '40 pilot activations', '$18M pipeline created', 'Avg deal size $230K ARR'],
    inferred: [
      { field:'Campaign Theme', value:'Govern What You\'ve Built', confidence:92, source:'Repeated on slides 1, 4, 9' },
      { field:'Primary Geography', value:'North America + UK first', confidence:85, source:'Sales play ordering + territory references' },
      { field:'Buying Cycle', value:'60–90 days', confidence:78, source:'Pilot duration + urgency framing' },
    ],
    missing: [
      { field:'Budgeted Cost', why:'Required for Salesforce Budgeted_Cost__c — not found in any source document' },
      { field:'Campaign End Date', why:'No hard close date specified in deck' },
      { field:'Partner Involvement', why:'Reseller/SI channel not addressed' },
    ],
    confidence: 91,
    explicit: 42,
  };
}

const CAMPAIGNS = {};  // id → campaign object
let ACTIVE_CAMPAIGN = null;
let _campIdSeq = 0;

function _newCampaign(name, quarter, product, motion, objective) {
  const id = 'c' + (++_campIdSeq);
  CAMPAIGNS[id] = {
    id, name, quarter, product, motion, objective,
    status: 'draft',   // 'draft' | 'extracted' | 'ready'
    docs: {},          // key → { name, size, uploadedAt }
    dna: null,
    activity: [],
    createdAt: new Date().toLocaleString(),
  };
  _logActivity(id, 'Campaign created: ' + name);
  return id;
}

function _logActivity(id, msg) {
  const c = CAMPAIGNS[id];
  if (!c) return;
  c.activity.unshift(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + ' — ' + msg);
  if (ACTIVE_CAMPAIGN === id) _renderActivityLog();
}

function _activateCampaign(id) {
  ACTIVE_CAMPAIGN = id;
  _renderCampaignList();
  _renderWorkspace();
}

// ── Campaign List ──────────────────────────────────────────────
function _renderCampaignList() {
  const el = document.getElementById('campaign-list');
  if (!el) return;
  const ids = Object.keys(CAMPAIGNS);
  if (!ids.length) { el.innerHTML = '<div style="font-size:12px;color:var(--txt3);padding:4px 6px;">No campaigns yet</div>'; return; }
  el.innerHTML = ids.map(id => {
    const c = CAMPAIGNS[id];
    const active = id === ACTIVE_CAMPAIGN;
    const statusDot = c.status === 'ready' ? 'var(--green)' : c.status === 'extracted' ? 'var(--accent)' : 'var(--txt3)';
    return '<div onclick="campSelect(\'' + id + '\')" style="cursor:pointer; padding:7px 10px; border-radius:7px; background:' +
      (active ? 'var(--surface3)' : 'var(--surface2)') + '; border:1px solid ' + (active ? 'var(--accent)' : 'var(--border)') + '; font-size:13px; color:' + (active ? 'var(--txt)' : 'var(--txt2)') + '; font-weight:' + (active ? '600' : '400') + ';">' +
      '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + statusDot + ';margin-right:6px;flex-shrink:0;"></span>' +
      c.name + '</div>';
  }).join('');
}

function campSelect(id) { _activateCampaign(id); }

// ── Workspace render ───────────────────────────────────────────
function _renderWorkspace() {
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const emptyState = document.getElementById('ws-empty-state');
  const content = document.getElementById('ws-content');
  const nameEl = document.getElementById('ws-campaign-name');
  const metaEl = document.getElementById('ws-campaign-meta');
  const statusBadge = document.getElementById('ws-status-badge');
  const dnaBtn = document.getElementById('extract-dna-btn');

  if (!c) {
    if (emptyState) emptyState.style.display = '';
    if (content) content.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (content) content.style.display = '';

  if (nameEl) nameEl.textContent = c.name;
  if (metaEl) {
    const metaParts = c.inherited
      ? ['New Campaign', 'Created from: ' + (c.createdFrom || 'Institutional Memory')]
      : [c.product, c.quarter, c.motion].filter(Boolean);
    metaEl.textContent = metaParts.join(' · ');
  }

  // Inheritance banner — show only for inherited campaigns
  const banner = document.getElementById('ws-inheritance-banner');
  if (banner) banner.style.display = c.inherited ? '' : 'none';

  // Status badge
  if (statusBadge) {
    statusBadge.style.display = '';
    if (c.inherited && c.status === 'draft') { statusBadge.textContent = 'New Campaign'; statusBadge.className = 'badge badge-accent'; }
    else if (c.status === 'ready') { statusBadge.textContent = 'Campaign Ready'; statusBadge.className = 'badge badge-green'; }
    else if (c.status === 'extracted') { statusBadge.textContent = 'DNA Extracted'; statusBadge.className = 'badge badge-accent'; }
    else { statusBadge.textContent = 'Campaign Draft'; statusBadge.className = 'badge badge-amber'; }
  }

  // Extract DNA button
  const hasAnyDoc = Object.keys(c.docs).length > 0;
  if (dnaBtn) {
    dnaBtn.disabled = !hasAnyDoc;
    dnaBtn.style.opacity = hasAnyDoc ? '1' : '0.4';
    dnaBtn.style.cursor = hasAnyDoc ? 'pointer' : 'not-allowed';
  }

  _renderDocSlots();
  _renderDNASection();
  _renderActivityLog();
}

// ── Document Slots ─────────────────────────────────────────────
function _renderDocSlots() {
  const el = document.getElementById('strat-doc-slots');
  if (!el || !ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  el.innerHTML = DOC_SLOTS.map(slot => {
    const f = c.docs[slot.key];
    if (f) {
      return '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:8px 10px; display:flex; align-items:center; gap:8px;">' +
        '<div style="font-size:18px; flex-shrink:0;">' + slot.icon + '</div>' +
        '<div style="flex:1; min-width:0; cursor:pointer;" onclick="stratPreview(\'' + slot.key + '\')">' +
          '<div style="font-size:12px; font-weight:600; color:var(--txt); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + f.name + '</div>' +
          '<div style="font-size:11px; color:var(--txt3);">' + slot.label + ' · ' + f.size + '</div>' +
        '</div>' +
        '<div style="display:flex; gap:4px; flex-shrink:0;">' +
          '<button onclick="stratReplaceSlot(\'' + slot.key + '\')" class="btn btn-ghost" style="font-size:10px;padding:2px 6px;">↺</button>' +
          '<button onclick="stratRemoveSlot(\'' + slot.key + '\')" style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:16px;line-height:1;padding:1px 4px;">×</button>' +
        '</div>' +
      '</div>';
    } else {
      return '<div style="background:var(--surface); border:1px dashed var(--border2); border-radius:8px; padding:8px 10px; display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="stratUploadSlot(\'' + slot.key + '\')">' +
        '<div style="font-size:18px; flex-shrink:0; opacity:0.4;">' + slot.icon + '</div>' +
        '<div style="flex:1; min-width:0;">' +
          '<div style="font-size:12px; font-weight:500; color:var(--txt3);">' + slot.label + '</div>' +
          '<div style="font-size:11px; color:var(--txt3); opacity:0.7;">Click to upload</div>' +
        '</div>' +
        '<div style="font-size:18px; color:var(--txt3); opacity:0.5;">+</div>' +
      '</div>';
    }
  }).join('');
}

function stratUpload(input, slotKey) {
  if (!input.files.length || !ACTIVE_CAMPAIGN) return;
  const f = input.files[0];
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const key = slotKey || 'deck';
  c.docs[key] = { name: f.name, size: _fmtSize(f.size), uploadedAt: new Date().toLocaleString(), pages: Math.floor(Math.random()*40)+5, isUserUploaded: true };
  input.value = '';
  _logActivity(ACTIVE_CAMPAIGN, 'Document received: ' + f.name + ' (' + DOC_SLOTS.find(s=>s.key===key)?.label + ')');
  showToast('File received. DNA extraction uses the preloaded Northstar demo dataset in this prototype.');
  _renderWorkspace();
}

function stratUploadSlot(slotKey) {
  if (!ACTIVE_CAMPAIGN) return;
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.pdf,.pptx,.docx,.xlsx,.csv,.md';
  inp.onchange = () => {
    if (!inp.files.length) return;
    const f = inp.files[0];
    const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
    c.docs[slotKey] = { name: f.name, size: _fmtSize(f.size), uploadedAt: new Date().toLocaleString(), pages: Math.floor(Math.random()*40)+5, isUserUploaded: true };
    _logActivity(ACTIVE_CAMPAIGN, 'Document received: ' + f.name + ' (' + DOC_SLOTS.find(s=>s.key===slotKey)?.label + ')');
    showToast('File received. DNA extraction uses the preloaded Northstar demo dataset in this prototype.');
    _renderWorkspace();
  };
  inp.click();
}

function stratReplaceSlot(slotKey) {
  if (!ACTIVE_CAMPAIGN) return;
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.pdf,.pptx,.docx,.xlsx,.csv,.md';
  inp.onchange = () => {
    if (!inp.files.length) return;
    const f = inp.files[0];
    const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
    c.docs[slotKey] = { name: f.name, size: _fmtSize(f.size), uploadedAt: new Date().toLocaleString(), pages: Math.floor(Math.random()*40)+5, isUserUploaded: true };
    _logActivity(ACTIVE_CAMPAIGN, 'Document replaced: ' + f.name + ' (' + DOC_SLOTS.find(s=>s.key===slotKey)?.label + ')');
    showToast('File received. DNA extraction uses the preloaded Northstar demo dataset in this prototype.');
    _renderWorkspace();
  };
  inp.click();
}

function stratRemoveSlot(slotKey) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const label = DOC_SLOTS.find(s=>s.key===slotKey)?.label || slotKey;
  _logActivity(ACTIVE_CAMPAIGN, 'Document removed: ' + label);
  delete c.docs[slotKey];
  _renderWorkspace();
}

function stratPreview(slotKey) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.docs[slotKey];
  if (!f) return;
  const slot = DOC_SLOTS.find(s => s.key === slotKey);
  const dna = c.dna;
  const entityCount = dna ? Object.keys(dna.personas || []).length + (dna.offers||[]).length : null;
  const docTypeLabel = f.isDemo ? 'Demo Asset · Preloaded Example' : f.isUserUploaded ? 'Custom Upload · Not processed in this prototype' : (slot?.label || slotKey);
  const docTypeCls = f.isDemo ? 'var(--accent)' : f.isUserUploaded ? 'var(--amber)' : 'var(--txt)';
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-bottom:14px;">' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">FILE NAME</div><div style="font-size:13px;color:var(--txt);word-break:break-all;">' + f.name + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">DOCUMENT TYPE</div><div style="font-size:13px;color:' + docTypeCls + ';">' + docTypeLabel + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">UPLOADED</div><div style="font-size:13px;color:var(--txt);">' + f.uploadedAt + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">PAGES</div><div style="font-size:13px;color:var(--txt);">' + f.pages + '</div></div>' +
      (entityCount ? '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">EXTRACTED ENTITIES</div><div style="font-size:13px;color:var(--green);">' + entityCount + ' entities</div></div>' : '') +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:2px;">EXTRACTION STATUS</div><div style="font-size:13px;color:' + (dna ? 'var(--green)">✓ Extracted' : 'var(--amber)">Pending extraction') + '</div></div>' +
    '</div>' +
    (f.isUserUploaded ? '<div style="padding:9px 12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:6px;font-size:12px;color:var(--amber);margin-bottom:14px;">Custom uploads are not processed in this prototype. Use <strong>⚡ Load Demo Documents</strong> to experience the full extraction workflow.</div>' : '') +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">' +
      '<button class="btn btn-ghost" onclick="stratReplaceSlot(\'' + slotKey + '\');closeModal()">↺ Replace</button>' +
      '<button class="btn btn-ghost" onclick="_stratDownload(\'' + slotKey + '\');closeModal()">↓ Download</button>' +
      '<button class="btn btn-ghost" onclick="stratRemoveSlot(\'' + slotKey + '\');closeModal()" style="color:var(--red);">× Delete</button>' +
      '<button class="btn btn-ghost" onclick="closeModal()">Close</button>' +
    '</div>';
  openModal(f.name, html);
}

function _stratDownload(slotKey) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.docs[slotKey];
  if (!f) return;
  dlFile(f.name.replace(/\.[^.]+$/, '') + '_helix.csv', 'file,slot\n' + f.name + ',' + slotKey, 'text/csv');
  showToast('Downloading ' + f.name);
}

// ── Campaign CRUD ──────────────────────────────────────────────
function openNewCampaignModal() {
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">' +
      '<div style="grid-column:1/-1;"><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">CAMPAIGN NAME *</div><input id="nc-name" class="rename-input" style="width:100%;padding:6px 10px;font-size:13px;" placeholder="e.g. Q1 AgentOps Launch"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">QUARTER</div><input id="nc-quarter" class="rename-input" style="width:100%;padding:6px 10px;font-size:13px;" placeholder="Q1 2026"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">PRODUCT</div><input id="nc-product" class="rename-input" style="width:100%;padding:6px 10px;font-size:13px;" placeholder="Northstar AgentOps"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">MOTION</div><input id="nc-motion" class="rename-input" style="width:100%;padding:6px 10px;font-size:13px;" placeholder="Demand Gen · ABM · Product Launch"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">OBJECTIVE</div><input id="nc-objective" class="rename-input" style="width:100%;padding:6px 10px;font-size:13px;" placeholder="200 SQLs in 90 days"></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="createCampaignFromModal()">Create Campaign</button>' +
    '</div>';
  openModal('New Campaign', html);
}

function createCampaignFromModal() {
  const name = (document.getElementById('nc-name')?.value || '').trim();
  if (!name) { showToast('Campaign name is required'); return; }
  const quarter   = document.getElementById('nc-quarter')?.value.trim() || '';
  const product   = document.getElementById('nc-product')?.value.trim() || '';
  const motion    = document.getElementById('nc-motion')?.value.trim() || '';
  const objective = document.getElementById('nc-objective')?.value.trim() || '';
  const id = _newCampaign(name, quarter, product, motion, objective);
  closeModal();
  _activateCampaign(id);
  showToast('Campaign created: ' + name);
}

function renameCampaign() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const val = prompt('Rename campaign:', c.name);
  if (val && val.trim() && val.trim() !== c.name) {
    _logActivity(ACTIVE_CAMPAIGN, 'Campaign renamed: ' + c.name + ' → ' + val.trim());
    c.name = val.trim();
    _renderCampaignList();
    _renderWorkspace();
    showToast('Renamed to: ' + c.name);
  }
}

function duplicateCampaign() {
  if (!ACTIVE_CAMPAIGN) return;
  const src = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const newName = 'Copy of ' + src.name;
  const id = _newCampaign(newName, src.quarter, src.product, src.motion, src.objective);
  CAMPAIGNS[id].docs = JSON.parse(JSON.stringify(src.docs));
  _logActivity(id, 'Duplicated from: ' + src.name);
  _activateCampaign(id);
  showToast('Duplicated: ' + newName);
}

function archiveCampaign() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  if (!confirm('Archive "' + c.name + '"? It will be removed from the active list.')) return;
  _logActivity(ACTIVE_CAMPAIGN, 'Campaign archived: ' + c.name);
  delete CAMPAIGNS[ACTIVE_CAMPAIGN];
  ACTIVE_CAMPAIGN = null;
  _renderCampaignList();
  _renderWorkspace();
  showToast('Campaign archived');
}

function deleteCampaign() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  if (!confirm('Permanently delete "' + c.name + '"? This cannot be undone.')) return;
  delete CAMPAIGNS[ACTIVE_CAMPAIGN];
  ACTIVE_CAMPAIGN = null;
  _renderCampaignList();
  _renderWorkspace();
  showToast('Campaign deleted');
}

// ── Load Demo Documents ────────────────────────────────────────
function loadDemoDocs() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const demos = [
    { key:'deck',      name:'Northstar_AgentOps_GTM_Deck.pdf',   size:'4.2 MB', pages:22 },
    { key:'icp',       name:'ICP_Definition_Financial_Services.pdf', size:'1.1 MB', pages:8 },
    { key:'messaging', name:'Messaging_Framework_Q1.docx',        size:'890 KB',  pages:14 },
    { key:'brief',     name:'Product_Brief_AgentOps_v2.pdf',      size:'2.3 MB',  pages:18 },
  ];
  demos.forEach(d => {
    if (!c.docs[d.key]) {
      c.docs[d.key] = { name:d.name, size:d.size, uploadedAt: new Date().toLocaleString(), pages:d.pages, isDemo:true };
      _logActivity(ACTIVE_CAMPAIGN, 'Demo document loaded: ' + d.name);
    }
  });
  _renderWorkspace();
  showToast('Demo documents loaded — ready to extract Campaign DNA');
}

// ── DNA Extraction ─────────────────────────────────────────────
function extractDNA() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const docCount = Object.keys(c.docs).length;
  if (!docCount) return;

  const hasUserUploads = Object.values(c.docs).some(d => d.isUserUploaded);
  const deckLabel = hasUserUploads ? 'Northstar AgentOps GTM Deck (demo dataset)' : (c.docs.deck ? c.docs.deck.name : 'Northstar AgentOps GTM Deck');
  runProcessing('Phase 2 of 7 — Strategy', 'Extracting Campaign DNA', [
    'Loading ' + deckLabel + '...',
    'Extracting ICP definition...',
    'Identifying buyer personas...',
    'Mapping buying committee...',
    'Extracting offers and CTAs...',
    'Extracting regulatory drivers...',
    'Detecting success metrics...',
    'Building Campaign DNA...',
  ], () => {
    c.dna = _makeCampaignDNA();
    c.status = 'extracted';
    _logActivity(ACTIVE_CAMPAIGN, 'Campaign DNA extracted — 91% confidence');
    setPhase(Math.max(PHASE, 3));
    _renderWorkspace();
    showToast('Campaign DNA extracted — 91% confidence');
  });
}

// ── DNA Section Render ─────────────────────────────────────────
function _renderDNASection() {
  const section = document.getElementById('ws-dna-section');
  if (!section || !ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  if (!c || !c.dna) { section.style.display = 'none'; return; }
  section.style.display = '';
  const d = c.dna;

  // Conf badge
  const cb = document.getElementById('ws-conf-badge');
  if (cb) cb.textContent = d.confidence + '% confidence · ' + d.explicit + ' explicit · ' + d.inferred.length + ' inferred · ' + d.missing.length + ' missing';
  const pct = document.getElementById('dna-conf-pct');
  if (pct) pct.textContent = d.confidence + '%';
  const explEl = document.getElementById('dna-explicit-ct'); if (explEl) explEl.textContent = d.explicit;
  const infEl  = document.getElementById('dna-inferred-ct'); if (infEl)  infEl.textContent  = d.inferred.filter(x=>x.status!=='rejected').length;
  const misEl  = document.getElementById('dna-missing-ct');  if (misEl)  misEl.textContent  = d.missing.filter(x=>!x.resolved).length;

  // ICP fields pre-populate
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setInp = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  setVal('icp-industries', d.icp.industries); setInp('icp-f-industries', d.icp.industries);
  setVal('icp-employees',  d.icp.employees);  setInp('icp-f-employees',  d.icp.employees);
  setVal('icp-revenue',    d.icp.revenue);    setInp('icp-f-revenue',    d.icp.revenue);
  setVal('icp-regions',    d.icp.regions);    setInp('icp-f-regions',    d.icp.regions);

  // Personas
  const pEl = document.getElementById('dna-personas');
  if (pEl) pEl.innerHTML = d.personas.map((p, i) =>
    '<div style="border-bottom:1px solid var(--border); padding:8px 0; cursor:pointer;" onclick="openPersonaModal(' + i + ')">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div><span style="font-weight:600;color:var(--txt);">' + p.name + '</span><span style="font-size:12px;color:var(--txt3);margin-left:8px;">→ ' + p.pain + '</span></div>' +
        '<span class="badge badge-green" style="font-size:10px;">' + p.confidence + '%</span>' +
      '</div>' +
    '</div>'
  ).join('');

  // Buying Committee
  const bcEl = document.getElementById('dna-buying-committee');
  if (bcEl) bcEl.innerHTML = d.buyingCommittee.map((r, i) =>
    '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border);">' +
      '<div style="width:130px;font-size:12px;color:var(--txt3);">' + r.role + '</div>' +
      '<input class="rename-input" style="flex:1;padding:4px 8px;font-size:13px;" value="' + r.title + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.buyingCommittee[' + i + '].title=this.value">' +
      '<button onclick="removeBuyingRole(' + i + ')" style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:16px;line-height:1;padding:2px 6px;">×</button>' +
    '</div>'
  ).join('');

  // Offers
  const offEl = document.getElementById('dna-offers');
  if (offEl) offEl.innerHTML = d.offers.map((o, i) =>
    '<div style="border:1px solid var(--border); border-radius:8px; padding:10px; margin-bottom:8px;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:2px;">NAME</div><input class="rename-input" style="width:100%;padding:4px 8px;font-size:12px;" value="' + o.name + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.offers[' + i + '].name=this.value"></div>' +
        '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:2px;">FUNNEL STAGE</div><input class="rename-input" style="width:100%;padding:4px 8px;font-size:12px;" value="' + o.stage + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.offers[' + i + '].stage=this.value"></div>' +
        '<div style="grid-column:1/-1;"><div style="font-size:10px;color:var(--txt3);margin-bottom:2px;">DESCRIPTION</div><input class="rename-input" style="width:100%;padding:4px 8px;font-size:12px;" value="' + o.description + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.offers[' + i + '].description=this.value"></div>' +
        '<div style="grid-column:1/-1;"><div style="font-size:10px;color:var(--txt3);margin-bottom:2px;">CTA</div><input class="rename-input" style="width:100%;padding:4px 8px;font-size:12px;" value="' + o.cta + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.offers[' + i + '].cta=this.value"></div>' +
      '</div>' +
    '</div>'
  ).join('');

  // Sales Plays
  const spEl = document.getElementById('dna-sales-plays');
  if (spEl) spEl.innerHTML = d.salesPlays.map((p, i) =>
    '<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border);">' +
      '<span style="color:var(--accent);flex-shrink:0;">›</span>' +
      '<input class="rename-input" style="flex:1;padding:3px 7px;font-size:12px;" value="' + p + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.salesPlays[' + i + ']=this.value">' +
    '</div>'
  ).join('');

  // Regulatory
  const regEl = document.getElementById('dna-regulatory');
  if (regEl) regEl.innerHTML = d.regulatory.map((r, i) =>
    '<div style="padding:6px 0;border-bottom:1px solid var(--border);">' +
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">' +
        '<input class="rename-input" style="width:80px;padding:3px 6px;font-size:11px;" value="' + r.region + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.regulatory[' + i + '].region=this.value">' +
        '<input class="rename-input" style="flex:1;padding:3px 6px;font-size:12px;" value="' + r.regulation + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.regulatory[' + i + '].regulation=this.value">' +
      '</div>' +
      '<input class="rename-input" style="width:100%;padding:3px 6px;font-size:11px;color:var(--txt3);" value="' + r.impact + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.regulatory[' + i + '].impact=this.value">' +
    '</div>'
  ).join('');

  // Metrics
  const mEl = document.getElementById('dna-metrics');
  if (mEl) mEl.innerHTML = d.metrics.map((m, i) =>
    '<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border);">' +
      '<span style="color:var(--green);flex-shrink:0;">✓</span>' +
      '<input class="rename-input" style="flex:1;padding:3px 7px;font-size:12px;" value="' + m + '" onchange="CAMPAIGNS[ACTIVE_CAMPAIGN].dna.metrics[' + i + ']=this.value">' +
    '</div>'
  ).join('');

  // Inferred
  const infListEl = document.getElementById('dna-inferred');
  if (infListEl) infListEl.innerHTML = d.inferred.filter(x => x.status !== 'rejected').map((f, i) =>
    '<div style="border-bottom:1px solid var(--border2);padding:8px 0;">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:12px;font-weight:600;color:var(--txt);">' + f.field + '</div>' +
          '<div style="font-size:12px;color:var(--txt2);margin-top:1px;">' + f.value + '</div>' +
          '<div style="font-size:11px;color:var(--txt3);margin-top:2px;">Source: ' + f.source + ' · Confidence: ' + f.confidence + '%</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;flex-shrink:0;">' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;color:var(--green);" onclick="inferredAccept(' + i + ')">Accept</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;" onclick="inferredEdit(' + i + ')">Edit</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;color:var(--red);" onclick="inferredReject(' + i + ')">Reject</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('') || '<div style="font-size:13px;color:var(--green);padding:8px 0;">All inferred fields reviewed.</div>';

  // Missing
  const misListEl = document.getElementById('dna-missing');
  if (misListEl) misListEl.innerHTML = d.missing.filter(x => !x.resolved && !x.ignored).map((f, i) =>
    '<div style="border-bottom:1px solid var(--border2);padding:8px 0;">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:12px;font-weight:600;color:var(--txt);">' + f.field + '</div>' +
          '<div style="font-size:12px;color:var(--txt3);margin-top:1px;">' + f.why + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;flex-shrink:0;">' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;color:var(--accent);" onclick="missingResolve(' + i + ')">Provide Value</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;" onclick="missingIgnore(' + i + ')">Ignore</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('') || '<div style="font-size:13px;color:var(--green);padding:8px 0;">All missing fields resolved.</div>';
}

// ── Persona Modal ──────────────────────────────────────────────
function openPersonaModal(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const p = c.dna.personas[idx];
  if (!p) return;
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">NAME</div><input id="pm-name" class="rename-input" style="width:100%;padding:5px 8px;font-size:13px;" value="' + p.name + '"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">MAPPED CANONICAL</div><input id="pm-canonical" class="rename-input" style="width:100%;padding:5px 8px;font-size:13px;" value="' + p.canonical + '"></div>' +
      '<div style="grid-column:1/-1;"><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">PAIN POINT</div><input id="pm-pain" class="rename-input" style="width:100%;padding:5px 8px;font-size:13px;" value="' + p.pain + '"></div>' +
      '<div style="grid-column:1/-1;"><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">VALUE PROPOSITION</div><input id="pm-value" class="rename-input" style="width:100%;padding:5px 8px;font-size:13px;" value="' + p.value + '"></div>' +
      '<div><div style="font-size:11px;color:var(--txt3);margin-bottom:3px;">CONFIDENCE</div><input id="pm-confidence" class="rename-input" style="width:100%;padding:5px 8px;font-size:13px;" value="' + p.confidence + '"></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="savePersonaModal(' + idx + ')">Save</button>' +
    '</div>';
  openModal(p.name + ' — Persona', html);
}

function savePersonaModal(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const p = c.dna.personas[idx];
  p.name      = document.getElementById('pm-name')?.value.trim() || p.name;
  p.canonical = document.getElementById('pm-canonical')?.value.trim() || p.canonical;
  p.pain      = document.getElementById('pm-pain')?.value.trim() || p.pain;
  p.value     = document.getElementById('pm-value')?.value.trim() || p.value;
  p.confidence= parseInt(document.getElementById('pm-confidence')?.value) || p.confidence;
  _logActivity(ACTIVE_CAMPAIGN, 'Persona updated: ' + p.name);
  closeModal();
  _renderDNASection();
  showToast('Persona saved');
}

// ── Buying Committee ───────────────────────────────────────────
function addBuyingRole() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const role = prompt('Role name:', 'New Role');
  if (!role || !role.trim()) return;
  c.dna.buyingCommittee.push({ role: role.trim(), title: '' });
  _logActivity(ACTIVE_CAMPAIGN, 'Buying committee role added: ' + role.trim());
  _renderDNASection();
}

function removeBuyingRole(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const r = c.dna.buyingCommittee[idx];
  c.dna.buyingCommittee.splice(idx, 1);
  _logActivity(ACTIVE_CAMPAIGN, 'Buying committee role removed: ' + r.role);
  _renderDNASection();
}

// ── Offers ─────────────────────────────────────────────────────
function addOffer() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  c.dna.offers.push({ name: 'New Offer', description: '', cta: '', stage: 'Top of Funnel' });
  _renderDNASection();
}

// ── ICP Edit ───────────────────────────────────────────────────
function icpEdit() {
  document.getElementById('icp-view').style.display = 'none';
  document.getElementById('icp-edit').style.display = '';
}
function icpCancel() {
  document.getElementById('icp-view').style.display = '';
  document.getElementById('icp-edit').style.display = 'none';
}
function icpSave() {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  c.dna.icp.industries = document.getElementById('icp-f-industries')?.value || c.dna.icp.industries;
  c.dna.icp.employees  = document.getElementById('icp-f-employees')?.value  || c.dna.icp.employees;
  c.dna.icp.revenue    = document.getElementById('icp-f-revenue')?.value    || c.dna.icp.revenue;
  c.dna.icp.regions    = document.getElementById('icp-f-regions')?.value    || c.dna.icp.regions;
  _logActivity(ACTIVE_CAMPAIGN, 'ICP updated');
  icpCancel();
  _renderDNASection();
  showToast('ICP saved');
}

// ── Inferred / Missing field actions ──────────────────────────
function inferredAccept(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.dna.inferred[idx];
  f.status = 'accepted';
  _logActivity(ACTIVE_CAMPAIGN, 'Inference accepted: ' + f.field);
  _renderDNASection();
  showToast('Accepted: ' + f.field);
}

function inferredEdit(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.dna.inferred[idx];
  const val = prompt('Edit value for "' + f.field + '":', f.value);
  if (val !== null && val.trim()) {
    f.value = val.trim();
    f.status = 'edited';
    _logActivity(ACTIVE_CAMPAIGN, 'Inference edited: ' + f.field + ' → ' + f.value);
    _renderDNASection();
    showToast('Updated: ' + f.field);
  }
}

function inferredReject(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.dna.inferred[idx];
  f.status = 'rejected';
  _logActivity(ACTIVE_CAMPAIGN, 'Inference rejected: ' + f.field);
  _renderDNASection();
  showToast('Rejected: ' + f.field);
}

function missingResolve(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.dna.missing[idx];
  const val = prompt('Provide value for "' + f.field + '":');
  if (val !== null && val.trim()) {
    f.resolved = true;
    f.value = val.trim();
    _logActivity(ACTIVE_CAMPAIGN, 'Missing field resolved: ' + f.field + ' = ' + f.value);
    _renderDNASection();
    showToast('Resolved: ' + f.field);
  }
}

function missingIgnore(idx) {
  if (!ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  const f = c.dna.missing[idx];
  f.ignored = true;
  _logActivity(ACTIVE_CAMPAIGN, 'Missing field ignored: ' + f.field);
  _renderDNASection();
  showToast('Ignored: ' + f.field);
}

// ── Activity Log ───────────────────────────────────────────────
function _renderActivityLog() {
  const el = document.getElementById('campaign-activity-log');
  if (!el || !ACTIVE_CAMPAIGN) return;
  const c = CAMPAIGNS[ACTIVE_CAMPAIGN];
  if (!c || !c.activity.length) {
    el.innerHTML = '<span style="color:var(--txt3);">No activity yet.</span>';
    return;
  }
  el.innerHTML = c.activity.map(a => '<div>' + a + '</div>').join('');
}

// ── Init Campaign Workspace ────────────────────────────────────
function _initCampaignWorkspace() {
  _renderCampaignList();
  _renderWorkspace();
}

// ─── ORG DISCOVERY + REVIEW STATE ─────────────────────────────
const OD = {
  namingPattern: '[Product] — [Region] — [Motion] — [Quarter]',
  namingStatus: 'pending', // 'pending' | 'approved' | 'rejected'

  govRules: [
    { text: 'Campaign_Type__c required before contact assignment', severity: 'blocker', active: true },
    { text: 'DO NOT CONTACT flag enforced at all contact stages', severity: 'blocker', active: true },
    { text: 'ICP_Tier__c must be populated before segment assignment', severity: 'warning', active: true },
    { text: 'Duplicate contacts suppressed by email + account match', severity: 'warning', active: true },
    { text: 'Target_Persona__c picklist — only defined values accepted', severity: 'warning', active: true },
    { text: 'Regulatory_Driver__c required for EU/APAC campaigns', severity: 'blocker', active: true },
    { text: 'Campaign start date required before contact assignment', severity: 'info', active: true },
    { text: 'Outreach sequence must match persona picklist value', severity: 'warning', active: true },
    { text: 'Parent campaign required for all child campaign records', severity: 'blocker', active: true },
    { text: 'ICP_Tier__c must align with Marketo lead score threshold', severity: 'info', active: true },
    { text: 'Pilot offer requires CRO or CCO persona match', severity: 'info', active: false },
  ],

  conflicts: [
    { label: 'Persona label mismatch', sysA: 'Salesforce: "VP AI"', sysB: 'Marketo: "AI Leader"', helixRec: 'VP AI', custom: '', status: 'pending' },
    { label: 'Tier naming mismatch', sysA: 'Salesforce: "Tier 1 / Tier 2"', sysB: 'Marketo: "Enterprise / Mid-Market"', helixRec: 'Tier 1 / Tier 2', custom: '', status: 'pending' },
    { label: 'Campaign type mismatch', sysA: 'Salesforce: "Event"', sysB: 'Marketo: "Event / Webinar"', helixRec: 'Preserve split — map both to Event canonical', custom: '', status: 'pending' },
  ],

  ontologyVersion: 'Draft',
};

const SEV_META = {
  blocker: { label: 'Blocker', cls: 'tag-red' },
  warning: { label: 'Warning', cls: 'tag-amber' },
  info:    { label: 'Info',    cls: 'tag-blue' },
};

// ── File inspect ──────────────────────────────────────────────
function odInspectFile(name, detail) {
  alert('File: ' + name + '\n\n' + detail);
}

// ── Picklist inspect / rename ─────────────────────────────────
function odInspectPicklist(field) {
  const el = document.getElementById('pl-' + field);
  if (!el) return;
  const vals = Array.from(el.querySelectorAll('.tag')).map(t => t.textContent).join(', ');
  alert('Field: ' + field + '\n\nValues:\n' + vals.split(', ').map((v, i) => (i + 1) + '. ' + v).join('\n'));
}

function odRenamePicklistVal(field, oldVal) {
  const newVal = prompt('Rename picklist value for ' + field + ':', oldVal);
  if (!newVal || !newVal.trim() || newVal.trim() === oldVal) return;
  // update all matching tags in both step-2 and step-3
  document.querySelectorAll('#pl-' + field + ' .tag').forEach(t => {
    if (t.textContent === oldVal) t.textContent = newVal.trim();
  });
  showToast(field + ': "' + oldVal + '" → "' + newVal.trim() + '"');
}

// ── Naming convention ─────────────────────────────────────────
function odEditNaming() {
  const val = prompt('Edit naming pattern:', OD.namingPattern);
  if (!val || !val.trim()) return;
  OD.namingPattern = val.trim();
  OD.namingStatus = 'pending';
  _syncNamingUI();
  showToast('Naming pattern updated');
}

function odApproveNaming() {
  OD.namingStatus = 'approved';
  _syncNamingUI();
  _updateApprovalSummary();
  showToast('Naming pattern approved');
}

function odRejectNaming() {
  OD.namingStatus = 'rejected';
  _syncNamingUI();
  _updateApprovalSummary();
  showToast('Naming pattern rejected — enter a replacement');
}

function _syncNamingUI() {
  const statusMap = {
    pending:  { text: 'Pending',  cls: 'badge-amber' },
    approved: { text: 'Approved', cls: 'badge-green' },
    rejected: { text: 'Rejected', cls: 'badge-red'   },
  };
  const s = statusMap[OD.namingStatus] || statusMap.pending;
  ['od-naming-badge', 'naming-status-badge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = s.text; el.className = 'badge ' + s.cls; }
  });
  ['od-naming-pattern', 'naming-pattern-display'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = OD.namingPattern;
  });
  const summEl = document.getElementById('summary-naming');
  if (summEl) {
    summEl.textContent = s.text;
    summEl.style.color = OD.namingStatus === 'approved' ? 'var(--green)' : OD.namingStatus === 'rejected' ? 'var(--red)' : 'var(--amber)';
  }
}

// ── Governance rules ──────────────────────────────────────────
function _renderGovRules() {
  const el = document.getElementById('gov-rules-list');
  if (!el) return;
  const activeCount = OD.govRules.filter(r => r.active).length;
  const cntEl = document.getElementById('gov-rule-count');
  if (cntEl) cntEl.textContent = '— ' + activeCount + ' active, ' + (OD.govRules.length - activeCount) + ' disabled';
  const summEl = document.getElementById('summary-rules');
  if (summEl) { summEl.textContent = activeCount + ' of ' + OD.govRules.length; summEl.style.color = 'var(--green)'; }

  el.innerHTML = OD.govRules.map((r, i) => {
    const sev = SEV_META[r.severity] || SEV_META.info;
    const rowBg = r.active ? '' : 'opacity:0.45;';
    return '<div style="display:flex; align-items:flex-start; gap:10px; padding:10px 14px; border-bottom:1px solid var(--border); ' + rowBg + '">' +
      '<span style="color:' + (r.active ? 'var(--green)' : 'var(--txt3)') + '; margin-top:1px; flex-shrink:0;">' + (r.active ? '✓' : '○') + '</span>' +
      '<div style="flex:1; min-width:0;">' +
        '<div style="font-size:13px; color:' + (r.active ? 'var(--txt)' : 'var(--txt3)') + '; margin-bottom:4px;">' + r.text + '</div>' +
        '<span class="tag ' + sev.cls + '" style="font-size:10px; padding:2px 6px;">' + sev.label + '</span>' +
      '</div>' +
      '<div style="display:flex; gap:4px; flex-shrink:0;">' +
        '<button class="btn btn-ghost" style="font-size:11px;padding:2px 7px;" onclick="odEditRule(' + i + ')">Edit</button>' +
        '<select onchange="odSetSeverity(' + i + ',this.value)" style="font-size:11px; background:var(--surface2); border:1px solid var(--border); color:var(--txt2); border-radius:5px; padding:2px 4px; cursor:pointer;">' +
          ['blocker','warning','info'].map(s => '<option value="' + s + '"' + (r.severity === s ? ' selected' : '') + '>' + s + '</option>').join('') +
        '</select>' +
        '<button class="btn btn-ghost" style="font-size:11px;padding:2px 7px;" onclick="odToggleRule(' + i + ')">' + (r.active ? 'Disable' : 'Enable') + '</button>' +
        '<button style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:16px;line-height:1;padding:2px 6px;" onclick="odDeleteRule(' + i + ')" title="Delete">×</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function odEditRule(i) {
  const val = prompt('Edit rule:', OD.govRules[i].text);
  if (val && val.trim()) { OD.govRules[i].text = val.trim(); _renderGovRules(); showToast('Rule updated'); }
}

function odSetSeverity(i, sev) {
  OD.govRules[i].severity = sev;
  _renderGovRules();
}

function odToggleRule(i) {
  OD.govRules[i].active = !OD.govRules[i].active;
  _renderGovRules();
  showToast(OD.govRules[i].active ? 'Rule enabled' : 'Rule disabled');
}

function odDeleteRule(i) {
  if (!confirm('Delete rule: "' + OD.govRules[i].text.slice(0, 60) + '"?')) return;
  OD.govRules.splice(i, 1);
  _renderGovRules();
  showToast('Rule deleted');
}

function odAddRule() {
  const text = prompt('New governance rule:');
  if (!text || !text.trim()) return;
  OD.govRules.push({ text: text.trim(), severity: 'warning', active: true });
  _renderGovRules();
  showToast('Rule added');
}

// ── Conflicts ─────────────────────────────────────────────────
function _renderConflicts() {
  const el = document.getElementById('conflicts-list');
  if (!el) return;
  const resolved = OD.conflicts.filter(c => c.status !== 'pending').length;
  const summEl = document.getElementById('summary-conflicts');
  if (summEl) {
    summEl.textContent = resolved + ' of ' + OD.conflicts.length;
    summEl.style.color = resolved === OD.conflicts.length ? 'var(--green)' : 'var(--amber)';
  }

  el.innerHTML = OD.conflicts.map((c, i) => {
    const resolved = c.status !== 'pending';
    const chosenLabel = resolved ? _conflictChosenLabel(c) : '';
    return '<div style="padding:12px 14px; border-bottom:1px solid var(--border);">' +
      '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:8px;">' +
        '<div>' +
          '<div style="font-size:13px; font-weight:600; color:' + (resolved ? 'var(--green)' : 'var(--txt)') + '; margin-bottom:3px;">' + (resolved ? '✓ ' : '⚠ ') + c.label + '</div>' +
          '<div style="font-size:12px; color:var(--txt3);">' + c.sysA + ' &nbsp;·&nbsp; ' + c.sysB + '</div>' +
        '</div>' +
        (resolved ? '<span class="badge badge-green" style="flex-shrink:0;">' + chosenLabel + '</span>' : '<span class="badge badge-amber" style="flex-shrink:0;">Unresolved</span>') +
      '</div>' +
      '<div style="font-size:12px; color:var(--txt3); margin-bottom:8px; padding:6px 8px; background:var(--surface2); border-radius:5px;">Helix recommends: <strong style="color:var(--accent);">' + c.helixRec + '</strong></div>' +
      (!resolved
        ? '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
            '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="odResolveConflict(' + i + ',\'helix\')">Accept Helix Rec</button>' +
            '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="odResolveConflict(' + i + ',\'sysA\')">Use System A</button>' +
            '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="odResolveConflict(' + i + ',\'sysB\')">Use System B</button>' +
            '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="odResolveConflict(' + i + ',\'custom\')">Create Canonical</button>' +
          '</div>'
        : '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="odUndoConflict(' + i + ')">Undo</button>'
      ) +
    '</div>';
  }).join('');
}

function _conflictChosenLabel(c) {
  if (c.status === 'helix') return 'Helix rec accepted';
  if (c.status === 'sysA') return 'System A chosen';
  if (c.status === 'sysB') return 'System B chosen';
  if (c.status === 'custom') return c.custom ? '"' + c.custom + '"' : 'Custom canonical';
  return '';
}

function odResolveConflict(i, resolution) {
  if (resolution === 'custom') {
    const val = prompt('Enter canonical value for "' + OD.conflicts[i].label + '":');
    if (!val || !val.trim()) return;
    OD.conflicts[i].custom = val.trim();
  }
  OD.conflicts[i].status = resolution;
  _renderConflicts();
  _updateApprovalSummary();
  showToast('Conflict resolved');
}

function odUndoConflict(i) {
  OD.conflicts[i].status = 'pending';
  OD.conflicts[i].custom = '';
  _renderConflicts();
  _updateApprovalSummary();
}

// ── Approval summary ──────────────────────────────────────────
function _updateApprovalSummary() {
  _renderConflicts();
  _syncNamingUI();
  _renderGovRules();
}

// ── Init (called on page load) ────────────────────────────────
function _initOntologyUI() {
  _renderGovRules();
  _renderConflicts();
  _syncNamingUI();
}

// ─── DOWNLOAD HELPER ───────────────────────────────────────────
function dlFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportOutreach() {
  const csv = [
    'Contact Name,Title,Company,Score,Sequence,Persona,BC Role,Region,Regulatory Driver,Offer,Status',
    'Sarah Whitfield,CCO,Citadel Financial,107,CCO — Audit Automation — 5 touch,CCO,Economic Buyer,EU,EU AI Act,Readiness Assessment,Ready',
    'David Chen,CRO,Global Trust Bank,98,CRO — Regulatory Urgency — 5 touch,CRO,Economic Buyer,NA,OCC Circular 2023-17,Readiness Assessment,Ready',
    'Marcus Thompson,CIO,Pacific Mutual Insurance,94,CIO — Shadow AI — 5 touch,CIO,Technical Buyer,NA,OCC Circular 2023-17,Readiness Assessment,Ready',
    'Elena Vasquez,CCO,European Capital Partners,91,CCO — Audit Automation — 5 touch,CCO,Economic Buyer,EU,EU AI Act,Readiness Assessment,Ready',
    'James Okafor,CRO,First National Wealth,88,CRO — Regulatory Urgency — 5 touch,CRO,Economic Buyer,NA,OCC Circular 2023-17,Readiness Assessment,Ready',
    'Priya Sharma,CIO,Meridian Capital,85,CIO — Shadow AI — 5 touch,CIO,Technical Buyer,APAC,MAS TRM,Readiness Assessment,Ready',
    'Thomas Brennan,CTO,Citadel Financial,82,CTO — 48hr Deploy — 4 touch,CTO,Technical Evaluator,EU,EU AI Act,30-Day Pilot,Ready',
    'Aiko Tanaka,VP AI,Pacific Mutual Insurance,79,VP AI Nurture — 4 touch,VP AI,Champion,APAC,APRA CPS 230,Readiness Assessment,Ready',
    'Robert Klein,CRO,Meridian Capital,76,CRO — Regulatory Urgency — 5 touch,CRO,Economic Buyer,EU,EU AI Act,Readiness Assessment,Ready',
    'Lisa Park,CCO,Global Trust Bank,73,CCO — Audit Automation — 5 touch,CCO,Economic Buyer,NA,OCC Circular 2023-17,Readiness Assessment,Ready',
  ].join('\n');
  dlFile('helix_outreach_contacts.csv', csv, 'text/csv');
  showToast('Exported 38 contacts to Outreach format');
}

function exportContactsCsv() {
  const csv = [
    'Name,Title,Company,Score,Segment,Persona,Offer,BC Role,Region,Regulatory Driver,Outreach Status',
    'Sarah Whitfield,CCO,Citadel Financial,107,UK/Europe — EU AI Act,CCO,Readiness Assessment,Economic Buyer,EU,EU AI Act,Enrolled',
    'David Chen,CRO,Global Trust Bank,98,NA Tier 1/2 CxO,CRO,Readiness Assessment,Economic Buyer,NA,OCC Circular 2023-17,Enrolled',
    'Marcus Thompson,CIO,Pacific Mutual Insurance,94,NA Tier 1/2 CxO,CIO,Readiness Assessment,Technical Buyer,NA,OCC Circular 2023-17,Enrolled',
    'Elena Vasquez,CCO,European Capital Partners,91,UK/Europe — EU AI Act,CCO,Readiness Assessment,Economic Buyer,EU,EU AI Act,Enrolled',
    'James Okafor,CRO,First National Wealth,88,NA Tier 1/2 CxO,CRO,Readiness Assessment,Economic Buyer,NA,OCC Circular 2023-17,Enrolled',
    'Priya Sharma,CIO,Meridian Capital,85,APAC — MAS/APRA,CIO,Readiness Assessment,Technical Buyer,APAC,MAS TRM,Enrolled',
    'Thomas Brennan,CTO,Citadel Financial,82,UK/Europe — EU AI Act,CTO,30-Day Pilot,Technical Evaluator,EU,EU AI Act,Enrolled',
    'Aiko Tanaka,VP AI,Pacific Mutual Insurance,79,APAC — MAS/APRA,VP AI,Readiness Assessment,Champion,APAC,APRA CPS 230,Enrolled',
    'Robert Klein,CRO,Meridian Capital,76,UK/Europe — EU AI Act,CRO,Readiness Assessment,Economic Buyer,EU,EU AI Act,Enrolled',
    'Lisa Park,CCO,Global Trust Bank,73,NA Tier 1/2 CxO,CCO,Readiness Assessment,Economic Buyer,NA,OCC Circular 2023-17,Enrolled',
  ].join('\n');
  dlFile('helix_target_contacts.csv', csv, 'text/csv');
  showToast('Downloaded target_contacts.csv — 38 contacts');
}

// ─── PHASE STATE ───────────────────────────────────────────────
// 0=foundation ready    1=org discovered   2=ontology approved
// 3=canonical built     4=assets generated 5=sales activated
// 6=analytics viewed    7=memory viewed
let PHASE = 0;

// minimum phase required to freely navigate each step
const STEP_MIN_PHASE = { 1:0, 2:1, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7 };

function setPhase(n) {
  PHASE = n;
  _refreshNav();
  _refreshTopbar();
}

function _refreshNav() {
  document.querySelectorAll('.step-btn').forEach((btn, i) => {
    const step = i + 1;
    const needsPhase = STEP_MIN_PHASE[step] || 0;
    if (needsPhase > PHASE) {
      btn.classList.add('locked');
    } else {
      btn.classList.remove('locked');
    }
  });
}

function _refreshTopbar() {
  const cfg = [
    { o:'Ontology: Not Built',   oc:'badge-amber',  d:'DNA: Not Extracted',     dc:'badge-amber',  m:'Model: Not Created',      mc:'badge-amber'  },
    { o:'Ontology: Discovered',  oc:'badge-amber',  d:'DNA: Not Extracted',     dc:'badge-amber',  m:'Model: Not Created',      mc:'badge-amber'  },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: Not Extracted',     dc:'badge-amber',  m:'Model: Not Created',      mc:'badge-amber'  },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: 91% Confidence',    dc:'badge-green',  m:'Model: Not Created',      mc:'badge-amber'  },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: 91% Confidence',    dc:'badge-green',  m:'Canonical Model: Active', mc:'badge-accent' },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: 91% Confidence',    dc:'badge-green',  m:'Canonical Model: Active', mc:'badge-accent' },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: 91% Confidence',    dc:'badge-green',  m:'Canonical Model: Active', mc:'badge-accent' },
    { o:'Ontology: Active',       oc:'badge-green',  d:'DNA: 91% Confidence',    dc:'badge-green',  m:'Canonical Model: Active', mc:'badge-accent' },
  ];
  const c = cfg[Math.min(PHASE, cfg.length - 1)];
  const bo = document.getElementById('badge-ontology');
  const bd = document.getElementById('badge-dna');
  const bm = document.getElementById('badge-model');
  if (!bo) return;
  bo.textContent = c.o; bo.className = 'badge ' + c.oc;
  bd.textContent = c.d; bd.className = 'badge ' + c.dc;
  bm.textContent = c.m; bm.className = 'badge ' + c.mc;
}

// ─── GENERIC MODAL ─────────────────────────────────────────────
function openModal(title, bodyHtml) {
  const bg = document.getElementById('helix-modal-bg');
  const box = document.getElementById('helix-modal');
  const t = document.getElementById('helix-modal-title');
  const b = document.getElementById('helix-modal-body');
  if (!bg || !box) return;
  if (t) t.textContent = title;
  if (b) b.innerHTML = bodyHtml;
  bg.style.display = '';
  box.style.display = '';
}

function closeModal() {
  const bg = document.getElementById('helix-modal-bg');
  const box = document.getElementById('helix-modal');
  if (bg) bg.style.display = 'none';
  if (box) box.style.display = 'none';
}

// ─── LOCK TOAST ────────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('lock-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ─── PROCESSING ANIMATION ──────────────────────────────────────
function runProcessing(phaseLabel, title, messages, onComplete) {
  const overlay = document.getElementById('proc-overlay');
  const plEl    = document.getElementById('proc-phase-lbl');
  const ptEl    = document.getElementById('proc-title-lbl');
  const pmEl    = document.getElementById('proc-msg-lbl');
  const barEl   = document.getElementById('proc-bar');
  const logoMk  = document.getElementById('logo-mark');

  plEl.textContent = phaseLabel;
  ptEl.textContent = title;
  pmEl.textContent = messages[0];
  barEl.style.width = '0%';

  overlay.classList.add('active');
  logoMk && logoMk.classList.add('processing');

  let i = 0;
  const stepMs = Math.min(580, Math.floor(3000 / messages.length));

  function tick() {
    if (i < messages.length) {
      pmEl.style.opacity = '0';
      setTimeout(() => {
        pmEl.textContent = messages[i];
        pmEl.style.opacity = '1';
        barEl.style.width = ((i + 1) / messages.length * 100) + '%';
        i++;
        setTimeout(tick, stepMs);
      }, 110);
    } else {
      setTimeout(() => {
        overlay.classList.remove('active');
        logoMk && logoMk.classList.remove('processing');
        onComplete();
      }, 420);
    }
  }
  setTimeout(tick, 280);
}

// ─── COUNTER ANIMATION ─────────────────────────────────────────
function countUp(el, target, duration) {
  if (!el) return;
  const start = Date.now();
  const update = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

// ─── NAVIGATE (internal — bypasses lock) ───────────────────────
function _goStep(n) {
  document.querySelectorAll('.step-btn').forEach((btn, i) => {
    const step = i + 1;
    btn.classList.remove('active', 'done');
    const needsPhase = STEP_MIN_PHASE[step] || 0;
    if (needsPhase > PHASE) {
      btn.classList.add('locked');
    } else if (step < n) {
      btn.classList.add('done');
    }
  });
  const activeBtn = document.querySelectorAll('.step-btn')[n - 1];
  if (activeBtn) { activeBtn.classList.add('active'); activeBtn.classList.remove('locked'); }
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('step-' + n);
  if (panel) { panel.classList.add('active'); panel.classList.add('fade-in'); setTimeout(() => panel.classList.remove('fade-in'), 400); }
  // Scroll content area to top
  const content = document.querySelector('.content');
  if (content) content.scrollTop = 0;
}

// ─── PHASE TRANSITION FUNCTIONS ────────────────────────────────
function processFoundation() {
  runProcessing('Phase 1 of 7 — Foundation', 'Building Customer GTM Ontology', [
    'Reading CRM schema...',
    'Analyzing ' + (FND.sf[0] ? FND.sf[0].records.toLocaleString() : '1,247') + ' campaign records...',
    'Indexing marketing automation fields...',
    'Reading sales engagement sequences...',
    'Extracting governance rules...',
    'Detecting naming conventions...',
    'Mapping cross-system vocabulary...',
    'Identifying cross-system conflicts...',
    'Building Customer GTM Ontology...',
  ], () => {
    setPhase(1);
    _goStep(2);
  });
}

function approveOntology() {
  const btn = document.getElementById('approve-btn');
  if (btn && btn.classList.contains('btn-green')) { _goStep(4); return; }

  runProcessing('Phase 3 of 7 — Approval', 'Locking Customer GTM Ontology v1.0', [
    'Validating conflict resolutions...',
    'Locking canonical vocabulary...',
    'Encoding governance rules...',
    'Customer GTM Ontology v1.0 — Approved.',
  ], () => {
    setPhase(2);
    OD.ontologyVersion = 'v1.0';

    // Update version badge in header
    const verBadge = document.getElementById('ontology-version-badge');
    if (verBadge) verBadge.innerHTML = 'Status: <span style="color:var(--green);">Approved · v1.0</span>';

    if (btn) {
      btn.textContent = '✓ Ontology v1.0 — Approved';
      btn.className = 'btn btn-green';
      btn.onclick = () => _goStep(4);
    }
    _goStep(4);
  });
}

// ─── CANONICAL MODEL STATE ─────────────────────────────────────

const CM = {
  status: 'not_built',   // 'not_built' | 'draft' | 'published' | 'dirty'
  version: null,         // null | 'v1.0 Draft' | 'v1.0 Published' | 'v1.1 Draft'
  versionNum: 0,
  pendingChanges: [],    // [{label, field, old, new, ts}]
  activity: [],

  mappings: [
    { id:'m1', label:'Persona Label', dnaValue:'VP AI', canonical:'persona.vp_ai', sf:'Contact.Target_Persona__c = VP AI', marketo:'{{my.Persona}} = AI Leader', outreach:'persona_tag = VP_AI_Buyer', snowflake:'canonical_persona = vp_ai', powerbi:'Persona dimension = VP AI', confidence:95, status:'resolved', conflict:true, conflictSys:'Marketo says "AI Leader" · Outreach says "VP_AI_Buyer"', conflictRec:'VP AI' },
    { id:'m2', label:'Account Tier',  dnaValue:'Tier 1 / Tier 2', canonical:'icp.account_tier', sf:'Campaign.ICP_Tier__c = Tier 1', marketo:'{{my.Tier}} = Enterprise', outreach:'tier_tag = enterprise', snowflake:'account_tier = tier_1', powerbi:'Tier dimension = Tier 1', confidence:92, status:'resolved', conflict:true, conflictSys:'Marketo says "Enterprise" · Salesforce says "Tier 1"', conflictRec:'Tier 1' },
    { id:'m3', label:'Campaign Type', dnaValue:'Exec roundtable', canonical:'campaign.type', sf:'Campaign.Campaign_Type__c = Event', marketo:'Program.Channel = Event', outreach:'sequence_type = event', snowflake:'campaign_type = event', powerbi:'Campaign Type = Event', confidence:88, status:'resolved', conflict:false },
    { id:'m4', label:'Regulatory Driver', dnaValue:'EU AI Act urgency', canonical:'regulatory_triggers', sf:'Campaign.Regulatory_Driver__c = EU AI Act', marketo:'{{my.Regulatory_Hook}} = EU AI Act', outreach:'reg_tag = eu_ai_act', snowflake:'regulatory_driver = eu_ai_act', powerbi:'Regulatory dimension = EU AI Act', confidence:97, status:'resolved', conflict:false },
    { id:'m5', label:'Primary CTA', dnaValue:'Book Readiness Assessment', canonical:'campaign.primary_cta', sf:'Campaign.Primary_CTA__c = Assessment', marketo:'{{my.CTA_Text}} = Book Readiness Assessment', outreach:'cta_tag = assessment', snowflake:'primary_cta = assessment', powerbi:'CTA dimension = Assessment', confidence:98, status:'resolved', conflict:false },
    { id:'m6', label:'Industry', dnaValue:'Banking · Insurance · Wealth Mgmt · Fintech', canonical:'icp.industries', sf:'Account.Industry (multi-select)', marketo:'{{my.Industry}} = Financial Services', outreach:'industry_tag = financial_services', snowflake:'industry = financial_services', powerbi:'Industry dimension = Financial Services', confidence:95, status:'resolved', conflict:false },
    { id:'m7', label:'Region', dnaValue:'NA · EMEA · APAC', canonical:'icp.geography', sf:'Campaign.Region__c', marketo:'{{my.Region}}', outreach:'region_tag', snowflake:'region', powerbi:'Region dimension', confidence:90, status:'resolved', conflict:false },
    { id:'m8', label:'Primary Offer', dnaValue:'Readiness Assessment — Free', canonical:'offers.primary', sf:'Campaign.Primary_Offer__c = Assessment', marketo:'{{my.Offer_Primary}}', outreach:'offer_tag = assessment', snowflake:'primary_offer = assessment', powerbi:'Offer dimension = Assessment', confidence:96, status:'resolved', conflict:false },
  ],

  conflicts: [
    { id:'cf1', label:'Persona Label — VP AI vs AI Leader', sysA:'Salesforce: VP AI', sysB:'Marketo: AI Leader', sysC:'Outreach: VP_AI_Buyer', rec:'VP AI', status:'resolved', choice:'helix', mappingId:'m1' },
    { id:'cf2', label:'Account Tier — Tier 1 vs Enterprise', sysA:'Salesforce: Tier 1', sysB:'Marketo: Enterprise', sysC:null, rec:'Tier 1', status:'resolved', choice:'sysA', mappingId:'m2' },
  ],

  personas: [
    { id:'p1', name:'CRO', title:'Chief Risk Officer', pain:'Regulatory audit trail gaps', value:'Automated compliance evidence', bcRole:'Economic Buyer', offerAffinity:'Readiness Assessment', confidence:95, source:'explicit' },
    { id:'p2', name:'CCO', title:'Chief Compliance Officer', pain:'Manual evidence collection', value:'Real-time agent monitoring', bcRole:'Economic Buyer', offerAffinity:'Readiness Assessment', confidence:92, source:'explicit' },
    { id:'p3', name:'CIO', title:'Chief Information Officer', pain:'Shadow AI / tool sprawl', value:'Unified agent visibility layer', bcRole:'Technical Buyer', offerAffinity:'30-Day Pilot', confidence:88, source:'explicit' },
    { id:'p4', name:'CTO', title:'Chief Technology Officer', pain:'No real-time agent visibility', value:'Production-grade observability', bcRole:'Technical Buyer', offerAffinity:'30-Day Pilot', confidence:85, source:'explicit' },
    { id:'p5', name:'Head of CX', title:'Head of Customer Experience', pain:'Hallucination risk in customer-facing AI', value:'Customer interaction audit trail', bcRole:'Risk Stakeholder', offerAffinity:'Readiness Assessment', confidence:80, source:'inferred' },
    { id:'p6', name:'VP AI', title:'VP Artificial Intelligence', pain:'Cannot prove board ROI on AI investment', value:'Governance data enables ROI reporting', bcRole:'Champion', offerAffinity:'Readiness Assessment', confidence:78, source:'inferred' },
  ],

  segments: [
    { id:'s1', name:'Segment 1 — NA Tier 1/2 CxO', rule:'ICP_Tier IN (Tier 1, Tier 2) AND Region = NA AND Persona IN (CRO, CCO, CIO, CTO)', region:'NA', industry:'Financial Services', persona:'CRO/CCO/CIO/CTO', tier:'Tier 1/2', offer:'Readiness Assessment', contacts:18 },
    { id:'s2', name:'Segment 2 — UK/EU EU AI Act', rule:'Region IN (UK, EU) AND Regulatory_Driver__c CONTAINS EU AI Act', region:'EMEA', industry:'Financial Services', persona:'CRO/CCO', tier:'Tier 1/2', offer:'Readiness Assessment', contacts:9 },
    { id:'s3', name:'Segment 3 — APAC MAS/APRA', rule:'Region = APAC AND Regulatory_Driver__c IN (MAS, APRA)', region:'APAC', industry:'Financial Services', persona:'CRO/CCO/CIO', tier:'Tier 1', offer:'Readiness Assessment', contacts:7 },
    { id:'s4', name:'Segment 4 — Open Pipeline', rule:'StageName IN (Discovery, Demo, Proposal) AND Campaign_Active__c = true', region:'Global', industry:'All', persona:'All ICP personas', tier:'All', offer:'30-Day Pilot', contacts:11 },
    { id:'s5', name:'Segment 5 — Customer Expansion', rule:'Type = Customer AND Product_Version__c < Current', region:'Global', industry:'All', persona:'CIO/CTO', tier:'All', offer:'Enterprise License', contacts:4 },
    { id:'s6', name:'Segment 6 — VP Nurture', rule:'Persona = VP AI AND Stage = Awareness AND Last_Touch_Days > 30', region:'Global', industry:'All', persona:'VP AI', tier:'Tier 2', offer:'Content → Assessment', contacts:5 },
  ],

  offers: [
    { id:'o1', name:'Readiness Assessment', description:'Free 2-hour AI governance posture assessment', cta:'Book Readiness Assessment → northstar.ai/assess', stage:'Top of Funnel', gate:'Must be Tier 1 or Tier 2 ICP account', next:'30-Day Pilot' },
    { id:'o2', name:'30-Day Pilot', description:'Fully instrumented pilot — $0 for qualified accounts', cta:'Start Pilot', stage:'Mid Funnel', gate:'Assessment complete + CRO/CCO engaged', next:'Enterprise License' },
    { id:'o3', name:'Enterprise License', description:'Full AgentOps platform — $180K–$450K ARR', cta:'Contact Sales', stage:'Bottom of Funnel', gate:'Pilot complete + Legal engaged', next:'' },
  ],

  governance: [
    { id:'g1', text:'Campaign name must follow: [Product] — [Region] — [Motion] — [Quarter]', severity:'blocker', appliesAt:'Asset Generation', active:true },
    { id:'g2', text:'All Salesforce campaigns must have a non-empty Campaign_Type__c value', severity:'blocker', appliesAt:'Export', active:true },
    { id:'g3', text:'Target_Persona__c must match canonical persona vocabulary', severity:'blocker', appliesAt:'Mapping', active:true },
    { id:'g4', text:'DO NOT CONTACT accounts must be excluded from all lists', severity:'blocker', appliesAt:'Export', active:true },
    { id:'g5', text:'Duplicate contacts must be resolved before export', severity:'warning', appliesAt:'Export', active:true },
    { id:'g6', text:'Marketo tokens must be validated against Salesforce field values', severity:'warning', appliesAt:'Asset Generation', active:true },
    { id:'g7', text:'Regulatory hook must be region-specific — no global regulatory catch-all', severity:'warning', appliesAt:'Asset Generation', active:true },
    { id:'g8', text:'All campaigns must have ICP_Tier__c populated', severity:'info', appliesAt:'Mapping', active:true },
    { id:'g9', text:'Persona affinity must map to at least one offer', severity:'info', appliesAt:'Mapping', active:true },
    { id:'g10', text:'Primary CTA URL must be resolvable (no broken links)', severity:'info', appliesAt:'Analytics', active:true },
    { id:'g11', text:'Success metric targets must be numeric and non-zero', severity:'info', appliesAt:'Analytics', active:true },
  ],

  missing: [
    { id:'mi1', field:'Budgeted_Cost__c', system:'Salesforce Campaign', why:'Required field — no budget figure found in any source document', status:'open', value:'' },
    { id:'mi2', field:'Campaign_End_Date__c', system:'Salesforce Campaign', why:'No campaign close date specified in deck', status:'open', value:'' },
  ],
};

// ─── CANONICAL MODEL FUNCTIONS ─────────────────────────────────

function _cmLog(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  CM.activity.unshift(ts + ' — ' + msg);
  _renderCMActivityLog();
}

function _cmAddPending(label) {
  CM.pendingChanges.push({ label, ts: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
  _refreshCMTopbar();
  _cmLog('Draft change: ' + label);
}

function _refreshCMTopbar() {
  const statusBadge = document.getElementById('cm-status-badge');
  const versionBadge = document.getElementById('cm-version-badge');
  const pendingBadge = document.getElementById('cm-pending-badge');
  const publishBtn   = document.getElementById('cm-publish-btn');

  const statusMap = {
    not_built: ['Not Built',         'badge-amber'],
    draft:     ['Draft',             'badge-amber'],
    published: ['Published',         'badge-green'],
    dirty:     ['Has Unpublished Changes', 'badge-amber'],
  };
  const [label, cls] = statusMap[CM.status] || statusMap.not_built;
  if (statusBadge) { statusBadge.textContent = label; statusBadge.className = 'badge ' + cls; }
  if (versionBadge) versionBadge.textContent = CM.version || '';

  const n = CM.pendingChanges.length;
  if (pendingBadge) {
    if (n > 0) { pendingBadge.textContent = n + ' unpublished change' + (n > 1 ? 's' : ''); pendingBadge.style.display = ''; }
    else pendingBadge.style.display = 'none';
  }

  if (publishBtn) {
    const canPublish = CM.status === 'draft' || CM.status === 'dirty';
    publishBtn.disabled = !canPublish;
    publishBtn.style.opacity = canPublish ? '1' : '0.4';
    publishBtn.style.cursor = canPublish ? 'pointer' : 'not-allowed';
  }

  const genCta = document.getElementById('cm-generate-cta');
  if (genCta) genCta.style.display = CM.status === 'published' ? '' : 'none';
}

function _initCM() {
  if (CM.status === 'not_built') {
    CM.status = 'draft';
    CM.version = 'v1.0 Draft';
    CM.versionNum = 1;
    _cmLog('Canonical Model built from Campaign DNA');
  }
  _refreshCMTopbar();
  cmTab('mappings');
}

// ── Tab navigation ─────────────────────────────────────────────
function cmTab(name) {
  const panels = ['mappings','personas','segments','offers','governance','missing'];
  panels.forEach(p => {
    const el = document.getElementById('cm-panel-' + p);
    if (el) el.style.display = p === name ? '' : 'none';
  });
  document.querySelectorAll('#cm-tabs .system-tab').forEach((t, i) => {
    t.classList.toggle('active', panels[i] === name);
  });
  if (name === 'mappings')   _renderCMMappings();
  if (name === 'personas')   _renderCMPersonas();
  if (name === 'segments')   _renderCMSegments();
  if (name === 'offers')     _renderCMOffers();
  if (name === 'governance') _renderCMGovernance();
  if (name === 'missing')    _renderCMMissing();
}

// ── Mappings ───────────────────────────────────────────────────
function _renderCMMappings() {
  // Conflicts
  const cfEl = document.getElementById('cm-conflicts-list');
  if (cfEl) {
    const open = CM.conflicts.filter(c => c.status !== 'resolved');
    if (!open.length) {
      cfEl.innerHTML = '<div style="font-size:13px;color:var(--green);padding:8px 0 4px;">✓ All conflicts resolved.</div>';
    } else {
      cfEl.innerHTML = open.map(c => _conflictRowHtml(c)).join('');
    }
  }

  // Mappings list
  const el = document.getElementById('cm-mappings-list');
  if (!el) return;
  el.innerHTML = '<div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 80px;gap:0;background:var(--surface2);padding:7px 12px;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--txt3);">' +
      '<div>Campaign DNA</div><div>Canonical Object</div><div>Downstream Systems</div><div>Status</div>' +
    '</div>' +
    CM.mappings.map((m, i) =>
      '<div class="map-row" style="grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr 1fr 80px;gap:0;cursor:pointer;" onclick="openMappingDrawer(\'' + m.id + '\')">' +
        '<div style="padding:9px 12px;border-right:1px solid var(--border2);">' +
          '<div style="font-size:12px;font-weight:600;color:var(--txt);">' + m.label + '</div>' +
          '<div style="font-size:11px;color:var(--txt3);margin-top:1px;">' + m.dnaValue + '</div>' +
        '</div>' +
        '<div style="padding:9px 12px;border-right:1px solid var(--border2);">' +
          '<div class="field-name" style="font-size:11px;">' + m.canonical + '</div>' +
        '</div>' +
        '<div style="padding:9px 12px;border-right:1px solid var(--border2);font-size:11px;color:var(--txt3);">' +
          'SF · MKT · Outreach · Snowflake · PowerBI' +
        '</div>' +
        '<div style="padding:9px 12px;display:flex;align-items:center;">' +
          '<span class="badge ' + (m.status === 'resolved' ? 'badge-green' : m.status === 'draft' ? 'badge-amber' : 'badge-amber') + '" style="font-size:10px;">' + (m.status === 'draft' ? 'Draft' : '✓') + '</span>' +
        '</div>' +
      '</div>'
    ).join('') +
  '</div>';
}

function _conflictRowHtml(c) {
  return '<div style="border:1px solid rgba(245,158,11,0.35);border-radius:8px;padding:12px 14px;margin-bottom:8px;background:rgba(245,158,11,0.04);">' +
    '<div style="font-size:13px;font-weight:600;color:var(--txt);margin-bottom:4px;">' + c.label + '</div>' +
    '<div style="font-size:12px;color:var(--txt3);margin-bottom:8px;">' + c.sysA + (c.sysB ? ' · ' + c.sysB : '') + (c.sysC ? ' · ' + c.sysC : '') + '</div>' +
    '<div style="font-size:12px;color:var(--accent);margin-bottom:8px;">Helix recommends: <strong>' + c.rec + '</strong></div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
      '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;color:var(--green);" onclick="resolveConflict(\'' + c.id + '\',\'helix\')">✓ Accept Recommendation</button>' +
      '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="resolveConflict(\'' + c.id + '\',\'sysA\')">Use ' + c.sysA.split(':')[0] + ' Value</button>' +
      (c.sysB ? '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="resolveConflict(\'' + c.id + '\',\'sysB\')">Use ' + c.sysB.split(':')[0] + ' Value</button>' : '') +
      '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;" onclick="resolveConflictCustom(\'' + c.id + '\')">Enter Custom Value</button>' +
      '<button class="btn btn-ghost" style="font-size:11px;padding:3px 8px;color:var(--txt3);" onclick="resolveConflict(\'' + c.id + '\',\'defer\')">Defer</button>' +
    '</div>' +
  '</div>';
}

function resolveConflict(id, choice) {
  const c = CM.conflicts.find(x => x.id === id);
  if (!c) return;
  const choiceLabel = choice === 'helix' ? 'Helix recommendation: ' + c.rec : choice === 'sysA' ? c.sysA : choice === 'sysB' ? c.sysB : 'Deferred';
  c.status = choice === 'defer' ? 'deferred' : 'resolved';
  c.choice = choice;
  if (CM.status === 'published') CM.status = 'dirty';
  else if (CM.status !== 'dirty') CM.status = 'draft';
  _cmAddPending('Conflict resolved: ' + c.label + ' → ' + choiceLabel);
  _renderCMMappings();
  showToast('Conflict resolved: ' + c.label);
}

function resolveConflictCustom(id) {
  const c = CM.conflicts.find(x => x.id === id);
  if (!c) return;
  const val = prompt('Enter canonical value for "' + c.label + '":');
  if (!val || !val.trim()) return;
  c.status = 'resolved'; c.choice = 'custom'; c.rec = val.trim();
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  _cmAddPending('Conflict resolved (custom): ' + c.label + ' → ' + val.trim());
  _renderCMMappings();
  showToast('Custom value set: ' + val.trim());
}

// ── Mapping Drawer ─────────────────────────────────────────────
function openMappingDrawer(id) {
  const m = CM.mappings.find(x => x.id === id);
  if (!m) return;
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
      _drawerField('DNA Value', 'md-dnaValue', m.dnaValue) +
      _drawerField('Canonical Object', 'md-canonical', m.canonical) +
      _drawerField('Salesforce', 'md-sf', m.sf) +
      _drawerField('Marketo', 'md-marketo', m.marketo) +
      _drawerField('Outreach', 'md-outreach', m.outreach) +
      _drawerField('Snowflake', 'md-snowflake', m.snowflake) +
      _drawerField('PowerBI', 'md-powerbi', m.powerbi) +
      _drawerField('Confidence %', 'md-confidence', m.confidence) +
    '</div>' +
    _impactNote(m.label) +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="saveMappingDraft(\'' + id + '\')">Save to Draft</button>' +
    '</div>';
  openModal(m.label + ' — Edit Mapping', html);
}

function _drawerField(label, id, val) {
  return '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.4px;">' + label + '</div>' +
    '<input id="' + id + '" class="rename-input" style="width:100%;padding:5px 8px;font-size:12px;" value="' + (val||'') + '"></div>';
}

function _impactNote(label) {
  return '<div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:6px;padding:10px 12px;font-size:12px;color:var(--txt2);">' +
    '<div style="font-weight:600;color:var(--accent);margin-bottom:4px;">Impact of this change</div>' +
    'Affects: 1 active campaign · 6 generated sequences · 2 Marketo tokens · 1 Salesforce picklist · 1 Snowflake dimension · 1 PowerBI semantic layer<br>' +
    '<span style="color:var(--txt3);">Changes will be saved to draft. Downstream systems update on Publish.</span>' +
  '</div>';
}

function saveMappingDraft(id) {
  const m = CM.mappings.find(x => x.id === id);
  if (!m) return;
  const read = f => document.getElementById(f)?.value || '';
  m.dnaValue   = read('md-dnaValue');
  m.canonical  = read('md-canonical');
  m.sf         = read('md-sf');
  m.marketo    = read('md-marketo');
  m.outreach   = read('md-outreach');
  m.snowflake  = read('md-snowflake');
  m.powerbi    = read('md-powerbi');
  m.confidence = parseInt(read('md-confidence')) || m.confidence;
  m.status = 'draft';
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  CM.version = 'v' + (CM.versionNum || 1) + '.1 Draft';
  _cmAddPending('Mapping updated: ' + m.label);
  closeModal();
  _renderCMMappings();
  _refreshCMTopbar();
  showToast('Saved to draft: ' + m.label);
}

function addMapping() {
  CM.mappings.push({ id:'m'+(CM.mappings.length+1), label:'New Mapping', dnaValue:'', canonical:'', sf:'', marketo:'', outreach:'', snowflake:'', powerbi:'', confidence:0, status:'draft', conflict:false });
  _renderCMMappings();
  openMappingDrawer('m' + CM.mappings.length);
}

// ── Personas ───────────────────────────────────────────────────
function _renderCMPersonas() {
  const el = document.getElementById('cm-personas-list');
  if (!el) return;
  el.innerHTML = CM.personas.filter(p => p.status !== 'archived').map(p =>
    '<div style="border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:8px;cursor:pointer;" onclick="openPersonaCMDrawer(\'' + p.id + '\')">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div>' +
          '<span style="font-size:14px;font-weight:700;color:var(--txt);">' + p.name + '</span>' +
          '<span style="font-size:12px;color:var(--txt3);margin-left:8px;">' + p.title + '</span>' +
          '<span class="badge ' + (p.source === 'explicit' ? 'badge-green' : 'badge-amber') + '" style="font-size:10px;margin-left:8px;">' + p.source + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:6px;">' +
          '<span class="badge badge-accent" style="font-size:10px;">' + p.confidence + '%</span>' +
          '<button onclick="event.stopPropagation();clonePersonaCM(\'' + p.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;">Clone</button>' +
          '<button onclick="event.stopPropagation();archivePersonaCM(\'' + p.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;color:var(--txt3);">Archive</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--txt3);margin-top:4px;">Pain: ' + p.pain + '</div>' +
      '<div style="font-size:12px;color:var(--txt3);">BC Role: ' + p.bcRole + ' · Offer: ' + p.offerAffinity + '</div>' +
    '</div>'
  ).join('');
}

function openPersonaCMDrawer(id) {
  const p = CM.personas.find(x => x.id === id);
  if (!p) return;
  const src = ['explicit','inferred','manual'];
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
      _drawerField('Name', 'pd-name', p.name) +
      _drawerField('Full Title', 'pd-title', p.title) +
      '<div style="grid-column:1/-1;">' + _drawerField('Pain Point', 'pd-pain', p.pain) + '</div>' +
      '<div style="grid-column:1/-1;">' + _drawerField('Value Proposition', 'pd-value', p.value) + '</div>' +
      _drawerField('Buying Committee Role', 'pd-bcRole', p.bcRole) +
      _drawerField('Offer Affinity', 'pd-offerAffinity', p.offerAffinity) +
      _drawerField('Confidence %', 'pd-confidence', p.confidence) +
      '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.4px;">Source</div>' +
        '<select id="pd-source" class="rename-input" style="width:100%;padding:5px 8px;font-size:12px;">' +
          src.map(s => '<option value="' + s + '"' + (s === p.source ? ' selected' : '') + '>' + s + '</option>').join('') +
        '</select></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="savePersonaCMDraft(\'' + id + '\')">Save to Draft</button>' +
    '</div>';
  openModal(p.name + ' — Edit Persona', html);
}

function savePersonaCMDraft(id) {
  const p = CM.personas.find(x => x.id === id);
  if (!p) return;
  const r = f => document.getElementById(f)?.value || '';
  p.name = r('pd-name'); p.title = r('pd-title'); p.pain = r('pd-pain');
  p.value = r('pd-value'); p.bcRole = r('pd-bcRole'); p.offerAffinity = r('pd-offerAffinity');
  p.confidence = parseInt(r('pd-confidence')) || p.confidence;
  p.source = r('pd-source') || p.source;
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  CM.version = 'v' + (CM.versionNum||1) + '.1 Draft';
  _cmAddPending('Persona updated: ' + p.name);
  closeModal(); _renderCMPersonas(); _refreshCMTopbar();
  showToast('Saved to draft: ' + p.name);
}

function clonePersonaCM(id) {
  const p = CM.personas.find(x => x.id === id);
  if (!p) return;
  const clone = Object.assign({}, p, { id:'p'+(CM.personas.length+1), name:'Copy of '+p.name });
  CM.personas.push(clone);
  _cmAddPending('Persona cloned: ' + clone.name);
  _renderCMPersonas();
  showToast('Cloned: ' + p.name);
}

function archivePersonaCM(id) {
  const p = CM.personas.find(x => x.id === id);
  if (!p || !confirm('Archive persona "' + p.name + '"?')) return;
  p.status = 'archived';
  _cmAddPending('Persona archived: ' + p.name);
  _renderCMPersonas();
  showToast('Archived: ' + p.name);
}

function addPersonaCM() {
  const id = 'p' + (CM.personas.length + 1);
  CM.personas.push({ id, name:'New Persona', title:'', pain:'', value:'', bcRole:'', offerAffinity:'', confidence:0, source:'manual' });
  _renderCMPersonas();
  openPersonaCMDrawer(id);
}

// ── Segments ───────────────────────────────────────────────────
function _renderCMSegments() {
  const el = document.getElementById('cm-segments-list');
  if (!el) return;
  el.innerHTML = CM.segments.filter(s => s.status !== 'archived' && s.status !== 'deleted').map(s =>
    '<div style="border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:8px;cursor:pointer;" onclick="openSegmentCMDrawer(\'' + s.id + '\')">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--txt);">' + s.name + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="badge badge-green" style="font-size:10px;">' + s.contacts + ' contacts</span>' +
          '<button onclick="event.stopPropagation();cloneSegmentCM(\'' + s.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;">Clone</button>' +
          '<button onclick="event.stopPropagation();deleteSegmentCM(\'' + s.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;color:var(--red);">Delete</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--txt3);margin-top:4px;font-family:monospace;">' + s.rule + '</div>' +
      '<div style="font-size:12px;color:var(--txt3);margin-top:4px;">Region: ' + s.region + ' · Persona: ' + s.persona + ' · Offer: ' + s.offer + '</div>' +
    '</div>'
  ).join('');
}

function openSegmentCMDrawer(id) {
  const s = CM.segments.find(x => x.id === id);
  if (!s) return;
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
      '<div style="grid-column:1/-1;">' + _drawerField('Segment Name', 'sd-name', s.name) + '</div>' +
      '<div style="grid-column:1/-1;">' + _drawerField('Rule', 'sd-rule', s.rule) + '</div>' +
      _drawerField('Region', 'sd-region', s.region) +
      _drawerField('Industry', 'sd-industry', s.industry) +
      _drawerField('Persona', 'sd-persona', s.persona) +
      _drawerField('Account Tier', 'sd-tier', s.tier) +
      _drawerField('Offer', 'sd-offer', s.offer) +
      _drawerField('Contact Count', 'sd-contacts', s.contacts) +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="saveSegmentCMDraft(\'' + id + '\')">Save to Draft</button>' +
    '</div>';
  openModal(s.name + ' — Edit Segment', html);
}

function saveSegmentCMDraft(id) {
  const s = CM.segments.find(x => x.id === id);
  if (!s) return;
  const r = f => document.getElementById(f)?.value || '';
  s.name = r('sd-name'); s.rule = r('sd-rule'); s.region = r('sd-region');
  s.industry = r('sd-industry'); s.persona = r('sd-persona'); s.tier = r('sd-tier');
  s.offer = r('sd-offer'); s.contacts = parseInt(r('sd-contacts')) || s.contacts;
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  CM.version = 'v' + (CM.versionNum||1) + '.1 Draft';
  _cmAddPending('Segment updated: ' + s.name);
  closeModal(); _renderCMSegments(); _refreshCMTopbar();
  showToast('Saved to draft: ' + s.name);
}

function cloneSegmentCM(id) {
  const s = CM.segments.find(x => x.id === id);
  if (!s) return;
  CM.segments.push(Object.assign({}, s, { id:'s'+(CM.segments.length+1), name:'Copy of '+s.name }));
  _cmAddPending('Segment cloned: ' + s.name);
  _renderCMSegments(); showToast('Cloned: ' + s.name);
}

function deleteSegmentCM(id) {
  const s = CM.segments.find(x => x.id === id);
  if (!s || !confirm('Delete segment "' + s.name + '"?')) return;
  s.status = 'deleted';
  _cmAddPending('Segment deleted: ' + s.name);
  _renderCMSegments(); showToast('Deleted: ' + s.name);
}

function addSegmentCM() {
  const id = 's' + (CM.segments.length + 1);
  CM.segments.push({ id, name:'New Segment', rule:'', region:'', industry:'', persona:'', tier:'', offer:'', contacts:0 });
  _renderCMSegments(); openSegmentCMDrawer(id);
}

// ── Offers ─────────────────────────────────────────────────────
function _renderCMOffers() {
  const el = document.getElementById('cm-offers-list');
  if (!el) return;
  el.innerHTML = CM.offers.filter(o => o.status !== 'archived').map(o =>
    '<div style="border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:8px;cursor:pointer;" onclick="openOfferCMDrawer(\'' + o.id + '\')">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--txt);">' + o.name + '</div>' +
        '<div style="display:flex;gap:6px;">' +
          '<span class="badge badge-accent" style="font-size:10px;">' + o.stage + '</span>' +
          '<button onclick="event.stopPropagation();cloneOfferCM(\'' + o.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;">Clone</button>' +
          '<button onclick="event.stopPropagation();archiveOfferCM(\'' + o.id + '\')" class="btn btn-ghost" style="font-size:11px;padding:2px 6px;color:var(--txt3);">Archive</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--txt3);margin-top:4px;">' + o.description + '</div>' +
      '<div style="font-size:12px;color:var(--accent);margin-top:2px;">CTA: ' + o.cta + '</div>' +
    '</div>'
  ).join('');
}

function openOfferCMDrawer(id) {
  const o = CM.offers.find(x => x.id === id);
  if (!o) return;
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
      _drawerField('Name', 'od-name', o.name) +
      _drawerField('Funnel Stage', 'od-stage', o.stage) +
      '<div style="grid-column:1/-1;">' + _drawerField('Description', 'od-desc', o.description) + '</div>' +
      '<div style="grid-column:1/-1;">' + _drawerField('CTA', 'od-cta', o.cta) + '</div>' +
      _drawerField('Qualification Gate', 'od-gate', o.gate) +
      _drawerField('Next Offer', 'od-next', o.next) +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="saveOfferCMDraft(\'' + id + '\')">Save to Draft</button>' +
    '</div>';
  openModal(o.name + ' — Edit Offer', html);
}

function saveOfferCMDraft(id) {
  const o = CM.offers.find(x => x.id === id);
  if (!o) return;
  const r = f => document.getElementById(f)?.value || '';
  o.name = r('od-name'); o.stage = r('od-stage'); o.description = r('od-desc');
  o.cta = r('od-cta'); o.gate = r('od-gate'); o.next = r('od-next');
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  CM.version = 'v' + (CM.versionNum||1) + '.1 Draft';
  _cmAddPending('Offer updated: ' + o.name);
  closeModal(); _renderCMOffers(); _refreshCMTopbar();
  showToast('Saved to draft: ' + o.name);
}

function cloneOfferCM(id) {
  const o = CM.offers.find(x => x.id === id);
  if (!o) return;
  CM.offers.push(Object.assign({}, o, { id:'o'+(CM.offers.length+1), name:'Copy of '+o.name }));
  _cmAddPending('Offer cloned: ' + o.name); _renderCMOffers(); showToast('Cloned: ' + o.name);
}

function archiveOfferCM(id) {
  const o = CM.offers.find(x => x.id === id);
  if (!o || !confirm('Archive offer "' + o.name + '"?')) return;
  o.status = 'archived'; _cmAddPending('Offer archived: ' + o.name); _renderCMOffers(); showToast('Archived: ' + o.name);
}

function addOfferCM() {
  const id = 'o' + (CM.offers.length + 1);
  CM.offers.push({ id, name:'New Offer', description:'', cta:'', stage:'Top of Funnel', gate:'', next:'' });
  _renderCMOffers(); openOfferCMDrawer(id);
}

// ── Governance ─────────────────────────────────────────────────
function _renderCMGovernance() {
  const el = document.getElementById('cm-governance-list');
  if (!el) return;
  const sevColor = { blocker:'var(--red)', warning:'var(--amber)', info:'var(--txt3)' };
  el.innerHTML = CM.governance.map(g =>
    '<div style="border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:6px;' + (!g.active ? 'opacity:0.5;' : '') + '">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">' +
        '<div style="flex:1;">' +
          '<span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:' + (sevColor[g.severity]||'var(--txt3)') + ';margin-right:6px;">' + g.severity.toUpperCase() + '</span>' +
          '<span style="font-size:10px;color:var(--txt3);">' + g.appliesAt + '</span>' +
          '<div style="font-size:13px;color:var(--txt);margin-top:4px;">' + g.text + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;flex-shrink:0;">' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:2px 7px;" onclick="editRuleCM(\'' + g.id + '\')">Edit</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:2px 7px;" onclick="toggleRuleCM(\'' + g.id + '\')">' + (g.active ? 'Disable' : 'Enable') + '</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:2px 7px;color:var(--red);" onclick="deleteRuleCM(\'' + g.id + '\')">Delete</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('');
}

function editRuleCM(id) {
  const g = CM.governance.find(x => x.id === id);
  if (!g) return;
  const sevOpts = ['blocker','warning','info'];
  const atOpts = ['Mapping','Asset Generation','Export','Analytics'];
  const html =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
      '<div style="grid-column:1/-1;">' + _drawerField('Rule Text', 'gd-text', g.text) + '</div>' +
      '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.4px;">Severity</div>' +
        '<select id="gd-sev" class="rename-input" style="width:100%;padding:5px 8px;font-size:12px;">' +
          sevOpts.map(s => '<option value="' + s + '"' + (s===g.severity?' selected':'') + '>' + s + '</option>').join('') +
        '</select></div>' +
      '<div><div style="font-size:10px;color:var(--txt3);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.4px;">Applies At</div>' +
        '<select id="gd-at" class="rename-input" style="width:100%;padding:5px 8px;font-size:12px;">' +
          atOpts.map(s => '<option value="' + s + '"' + (s===g.appliesAt?' selected':'') + '>' + s + '</option>').join('') +
        '</select></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="saveRuleCM(\'' + id + '\')">Save to Draft</button>' +
    '</div>';
  openModal('Edit Governance Rule', html);
}

function saveRuleCM(id) {
  const g = CM.governance.find(x => x.id === id);
  if (!g) return;
  g.text = document.getElementById('gd-text')?.value || g.text;
  g.severity = document.getElementById('gd-sev')?.value || g.severity;
  g.appliesAt = document.getElementById('gd-at')?.value || g.appliesAt;
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  _cmAddPending('Governance rule updated: ' + g.text.slice(0,40) + '…');
  closeModal(); _renderCMGovernance(); _refreshCMTopbar();
  showToast('Rule saved to draft');
}

function toggleRuleCM(id) {
  const g = CM.governance.find(x => x.id === id);
  if (!g) return;
  if (g.active) {
    const impacted = CM.mappings.filter(m => true).length;
    if (!confirm('Disabling this rule may affect ' + impacted + ' mappings and downstream asset generation. Continue?')) return;
  }
  g.active = !g.active;
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  _cmAddPending('Governance rule ' + (g.active ? 'enabled' : 'disabled') + ': ' + g.text.slice(0,40) + '…');
  _renderCMGovernance(); _refreshCMTopbar();
  showToast('Rule ' + (g.active ? 'enabled' : 'disabled'));
}

function deleteRuleCM(id) {
  const g = CM.governance.find(x => x.id === id);
  if (!g || !confirm('Delete governance rule? This cannot be undone.')) return;
  CM.governance.splice(CM.governance.indexOf(g), 1);
  _cmAddPending('Governance rule deleted: ' + g.text.slice(0,40) + '…');
  _renderCMGovernance(); showToast('Rule deleted');
}

function addRuleCM() {
  const id = 'g' + (CM.governance.length + 1);
  CM.governance.push({ id, text:'New governance rule', severity:'info', appliesAt:'Mapping', active:true });
  _renderCMGovernance(); editRuleCM(id);
}

// ── Missing Inputs ─────────────────────────────────────────────
function _renderCMMissing() {
  const el = document.getElementById('cm-missing-list');
  if (!el) return;
  const open = CM.missing.filter(m => m.status !== 'resolved' && m.status !== 'notRequired');
  if (!open.length) { el.innerHTML = '<div style="font-size:13px;color:var(--green);padding:8px 0;">✓ All missing inputs resolved.</div>'; return; }
  el.innerHTML = open.map(m =>
    '<div style="border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px 14px;margin-bottom:8px;background:rgba(239,68,68,0.03);">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:13px;font-weight:700;color:var(--txt);">' + m.field + '</div>' +
          '<div style="font-size:12px;color:var(--txt3);margin-top:2px;">System: ' + m.system + '</div>' +
          '<div style="font-size:12px;color:var(--txt3);margin-top:2px;">' + m.why + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;">' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;color:var(--accent);" onclick="missingProvide(\'' + m.id + '\')">Provide Value</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;" onclick="missingDefer(\'' + m.id + '\')">Defer</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;" onclick="missingNotRequired(\'' + m.id + '\')">Mark Not Required</button>' +
          '<button class="btn btn-ghost" style="font-size:11px;padding:3px 7px;color:var(--amber);" onclick="missingEscalate(\'' + m.id + '\')">Escalate</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('');
}

function missingProvide(id) {
  const m = CM.missing.find(x => x.id === id);
  if (!m) return;
  const val = prompt('Provide value for ' + m.field + ':');
  if (!val || !val.trim()) return;
  m.value = val.trim(); m.status = 'resolved';
  if (CM.status === 'published') CM.status = 'dirty'; else if (CM.status !== 'dirty') CM.status = 'draft';
  _cmAddPending('Missing field resolved: ' + m.field + ' = ' + m.value);
  _renderCMMissing(); _refreshCMTopbar();
  const badge = document.getElementById('cm-tab-ct-missing');
  if (badge) badge.textContent = CM.missing.filter(x => x.status==='open').length;
  showToast('Value provided: ' + m.field);
}

function missingDefer(id) {
  const m = CM.missing.find(x => x.id === id);
  if (!m) return;
  m.status = 'deferred';
  _cmAddPending('Missing field deferred: ' + m.field);
  _renderCMMissing(); showToast('Deferred: ' + m.field);
}

function missingNotRequired(id) {
  const m = CM.missing.find(x => x.id === id);
  if (!m) return;
  m.status = 'notRequired';
  _cmAddPending('Missing field marked not required: ' + m.field);
  _renderCMMissing(); _refreshCMTopbar(); showToast('Marked not required: ' + m.field);
}

function missingEscalate(id) {
  const m = CM.missing.find(x => x.id === id);
  if (!m) return;
  m.status = 'escalated';
  _cmAddPending('Missing field escalated to owner: ' + m.field);
  _renderCMMissing(); showToast('Escalated: ' + m.field);
}

// ── Publish Flow ───────────────────────────────────────────────
function openPublishModal() {
  if (CM.status !== 'draft' && CM.status !== 'dirty') return;
  const newVer = 'v' + (CM.versionNum || 1) + (CM.pendingChanges.length ? '.1' : '.0');
  const changesList = CM.pendingChanges.length
    ? CM.pendingChanges.map(c => '<div style="padding:3px 0;font-size:12px;color:var(--txt2);">· ' + c.label + '</div>').join('')
    : '<div style="font-size:12px;color:var(--txt3);">No pending changes — publishing current draft.</div>';

  const html =
    '<div style="margin-bottom:14px;">' +
      '<div style="font-size:13px;font-weight:600;color:var(--txt);margin-bottom:8px;">Pending Changes</div>' +
      '<div style="background:var(--surface2);border-radius:6px;padding:10px 12px;max-height:120px;overflow-y:auto;margin-bottom:12px;">' + changesList + '</div>' +
      '<div style="font-size:13px;font-weight:600;color:var(--txt);margin-bottom:8px;">Downstream Writes</div>' +
      '<div style="font-size:12px;color:var(--txt3);line-height:1.8;">' +
        '· Snowflake: canonical_gtm_model updated<br>' +
        '· Salesforce: campaign field mappings synced<br>' +
        '· Marketo: program tokens updated<br>' +
        '· Outreach: sequence persona tags updated<br>' +
        '· PowerBI: semantic layer dimensions refreshed' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="publishCM()">Publish ' + newVer + '</button>' +
    '</div>';
  openModal('Publishing Canonical Model ' + newVer, html);
}

function publishCM() {
  closeModal();
  runProcessing('Publishing Canonical Model', 'Syncing to all connected systems', [
    'Diffing draft against published model...',
    'Writing canonical objects to Snowflake...',
    'Syncing Salesforce campaign field mappings...',
    'Updating Marketo program tokens...',
    'Updating Outreach persona tags...',
    'Refreshing PowerBI semantic layer...',
    'Publishing complete.',
  ], () => {
    CM.status = 'published';
    CM.versionNum = (CM.versionNum || 1);
    CM.version = 'v' + CM.versionNum + '.0 Published';
    CM.pendingChanges = [];
    _cmLog('Canonical Model published: ' + CM.version);
    _refreshCMTopbar();
    setPhase(Math.max(PHASE, 4));
    showToast('Canonical Model published: ' + CM.version);
  });
}

// ── Activity Log ───────────────────────────────────────────────
function _renderCMActivityLog() {
  const el = document.getElementById('cm-activity-log');
  if (!el) return;
  if (!CM.activity.length) { el.innerHTML = '<span style="color:var(--txt3);">No activity yet.</span>'; return; }
  el.innerHTML = CM.activity.map(a => '<div>' + a + '</div>').join('');
}

function buildCanonical() {
  runProcessing('Phase 5 of 7 — Translation', 'Building Canonical GTM Model', [
    'Mapping Campaign DNA against Customer GTM Ontology...',
    'Resolving: VP AI ↔ AI Leader → canonical VP AI...',
    'Resolving: Enterprise ↔ Tier 1 → canonical Tier 1...',
    'Normalizing EU AI Act regulatory hook...',
    'Enforcing 11 governance constraints...',
    'Validating 38 field mappings...',
    'Canonical GTM Model — Active.',
  ], () => {
    _initCM();
    setPhase(Math.max(PHASE, 3));
    _goStep(5);
  });
}

function generateAssets() {
  runProcessing('Phase 6 of 7 — Generation', 'Generating Assets', [
    'Generating Salesforce campaign hierarchy (9 records)...',
    'Building Marketo program structure (6 programs)...',
    'Creating Outreach sequences (6 persona tracks)...',
    'Generating LinkedIn audiences (3 segments)...',
    'Generating 12 email assets and 6 landing pages...',
    'Building 4 reports and 8 analytics definitions...',
    'Scoring and segmenting contacts (75 evaluated)...',
    '38 contacts matched, segmented, and assigned...',
    'Validating all 24 assets against governance rules...',
  ], () => {
    setPhase(4);
    _goStep(6);
    _initGA();
  });
}

function activateSales() {
  runProcessing('Phase 7 of 9 — Activation', 'Activating Sales Team', [
    'Loading contacts into Outreach sequences...',
    'Mapping buying committee by account...',
    'Assigning persona-matched opening angles...',
    'Generating call openers and objection handlers...',
    'Flagging single-threaded account risks...',
    'Writing SDR activation context to all 38 contacts...',
    'Sales activation ready.',
  ], () => {
    setPhase(5);
    _goStep(7);
    _initSA();
  });
}

function viewAnalytics() {
  setPhase(6);
  _goStep(8);
  setTimeout(_initAN, 100);
}

function viewMemory() {
  setPhase(7);
  _goStep(9);
  setTimeout(_initIM, 100);
}

function createNextCampaign() {
  // Loop back to Strategy Discovery with a fresh campaign context
  _goStep(4);
}

// ─── PUBLIC showStep (respects locks) ──────────────────────────
function showStep(n) {
  const needsPhase = STEP_MIN_PHASE[n] || 0;
  if (PHASE < needsPhase) {
    const gateNames = ['','Foundation Setup','Foundation Setup','Ontology Approval','Strategy Discovery','Canonical Model','Asset Generation','Asset Generation','Sales Activation','Analytics'];
    showToast('Complete ' + (gateNames[n] || 'the previous step') + ' first');
    return;
  }
  _goStep(n);
}

// ─── PROVENANCE DETAIL PANEL ───────────────────────────────────
function showDetail(key) {
  const d = DETAILS[key];
  if (!d) return;
  document.getElementById('dp-label').textContent = d.label;
  document.getElementById('dp-title').textContent = d.title;

  const chain = document.getElementById('dp-chain');
  chain.innerHTML = d.chain.map(s => `
    <div class="prov-step ${s.step}" style="padding:10px 12px; margin-bottom:10px; border-radius:6px; background:var(--surface2);">
      <div style="font-size:11px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:var(--txt3); margin-bottom:6px;">${s.heading}</div>
      ${s.points.map(p => `<div class="prov-point" style="display:flex; gap:6px; font-size:13px; color:var(--txt2); margin-bottom:3px;"><span>·</span><span>${p}</span></div>`).join('')}
    </div>
  `).join('');

  if (d.insight) {
    document.getElementById('dp-insight').innerHTML = `
      <div class="insight-box">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:var(--accent); margin-bottom:6px;">Why This Matters</div>
        <div style="font-size:13px; color:var(--txt2); line-height:1.55;">${d.insight}</div>
      </div>`;
  } else {
    document.getElementById('dp-insight').innerHTML = '';
  }

  document.getElementById('detail-overlay').classList.add('open');
  document.getElementById('detail-panel').classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.remove('open');
  document.getElementById('detail-panel').classList.remove('open');
}

// ─── SYSTEM TABS ───────────────────────────────────────────────
function showSys(sys) {
  document.querySelectorAll('#sys-tabs .system-tab').forEach(t => t.classList.remove('active'));
  event.target.closest('.system-tab').classList.add('active');
  ['salesforce','marketo','outreach','linkedin','email','landing','reports','analytics'].forEach(s => {
    const el = document.getElementById('sys-' + s);
    if (el) el.style.display = s === sys ? 'block' : 'none';
  });
}

// ─── GENERATED ASSETS STATE ────────────────────────────────────
const GA = { generatedAt: null, campaign: null, activity: [] };

function _initGA() {
  const now = new Date();
  GA.generatedAt = now;
  GA.campaign = ACTIVE_CAMPAIGN ? (CAMPAIGNS[ACTIVE_CAMPAIGN]?.name || 'Q1 AgentOps Launch') : 'Q1 AgentOps Launch';

  // Update header bar
  const nameEl = document.getElementById('ga-campaign-name');
  const tsEl   = document.getElementById('ga-generated-at');
  if (nameEl) nameEl.textContent = GA.campaign;
  if (tsEl)   tsEl.textContent   = 'Generated: ' + now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  // Inject ⋯ action buttons into all asset rows that don't already have one
  document.querySelectorAll('#step-6 .asset-row').forEach(row => {
    if (row.querySelector('.ga-asset-menu-btn')) return;
    const key   = (row.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1] || '';
    const label = row.querySelector('.asset-name')?.textContent || 'Asset';
    const btn   = document.createElement('button');
    btn.className = 'btn btn-ghost ga-asset-menu-btn';
    btn.style.cssText = 'font-size:11px;padding:3px 8px;margin-left:4px;flex-shrink:0;';
    btn.textContent = '⋯';
    btn.onclick = (e) => { e.stopPropagation(); openAssetMenu(key, label); };
    row.appendChild(btn);
  });

  // Show activity log
  _addGAActivity('Assets generated for campaign: ' + GA.campaign + ' — 24 assets across 8 systems.');
  const logEl = document.getElementById('ga-activity-log');
  if (logEl) logEl.style.display = '';
}

function _addGAActivity(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  GA.activity.unshift({ ts, msg });
  _renderGALog();
}

function _renderGALog() {
  const el = document.getElementById('ga-log-entries');
  if (!el) return;
  el.innerHTML = GA.activity.slice(0, 8).map(e =>
    `<div style="padding:6px 0; border-bottom:1px solid var(--border); display:flex; gap:10px;">
       <span style="flex-shrink:0; color:var(--txt3);">${e.ts}</span>
       <span style="color:var(--txt2);">${e.msg}</span>
     </div>`
  ).join('');
}

function regenerateAssets() {
  const totalAssets = 24;
  const bodyHtml = `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2); line-height:1.55;">
      Regenerating will refresh all <strong>${totalAssets} assets</strong> for <strong>${GA.campaign || 'this campaign'}</strong> from the current Canonical Model.
    </div>
    <div style="background:var(--surface2); border:1px solid var(--border); border-radius:6px; padding:10px 12px; margin-bottom:16px;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Impact</div>
      <div style="font-size:12px; color:var(--txt2); line-height:1.8;">
        • 9 Salesforce campaign records updated<br>
        • 6 Marketo programs refreshed — tokens re-mapped<br>
        • 6 Outreach sequences re-generated with latest persona data<br>
        • 3 LinkedIn audiences re-exported<br>
        • 12 email assets regenerated with updated messaging<br>
        • 6 landing pages refreshed<br>
        • 4 reports rebuilt · 8 analytics definitions updated
      </div>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); _runRegenerate();">Regenerate All Assets</button>
    </div>`;
  openModal('Regenerate Assets', bodyHtml);
}

function _runRegenerate() {
  runProcessing('Asset Regeneration', 'Regenerating Assets', [
    'Reading current Canonical GTM Model...',
    'Refreshing Salesforce campaign hierarchy...',
    'Rebuilding Marketo program structure and tokens...',
    'Regenerating Outreach sequences with updated personas...',
    'Refreshing LinkedIn audiences...',
    'Regenerating 12 email assets...',
    'Rebuilding 6 landing pages...',
    'Updating 4 reports and 8 analytics definitions...',
    'Validating all 24 assets against governance rules...',
  ], () => {
    _initGA();
    _addGAActivity('All 24 assets regenerated from Canonical Model v' + (CM.versionNum || 1) + '.');
    showToast('24 assets regenerated');
  });
}

function exportAllAssets() {
  const ts = new Date().toISOString().slice(0,10);
  const payload = {
    campaign: GA.campaign || 'Q1 AgentOps Launch',
    exportedAt: new Date().toISOString(),
    canonicalModelVersion: CM.versionNum || 1,
    assets: {
      salesforce: { campaigns: 9, contactMembers: 38, segmentRules: 6 },
      marketo:    { programs: 6, tokens: 24 },
      outreach:   { sequences: 6 },
      linkedin:   { audiences: 3 },
      email:      { assets: 12 },
      landingPages: { pages: 6 },
      reports:    { reports: 4 },
      analytics:  { definitions: 8 }
    },
    totalAssets: 24
  };
  dlFile('helix_all_assets_' + ts + '.json', JSON.stringify(payload, null, 2), 'application/json');
  _addGAActivity('Exported all 24 assets to JSON.');
  showToast('Exported helix_all_assets_' + ts + '.json');
}

function generateMissingAssets() {
  // Evaluate which asset types could be augmented
  const missing = [
    { type: 'Outreach Sequences', detail: 'APAC-specific MAS/APRA sequence not yet generated', badge: 'badge-amber' },
    { type: 'LinkedIn Audience',  detail: 'APAC financial services matched audience pending account list upload', badge: 'badge-amber' },
    { type: 'Email Assets',       detail: 'Post-pilot nurture sequence (touches 2–5) not yet generated', badge: 'badge-amber' },
  ];
  const rows = missing.map(m => `
    <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid var(--border);">
      <input type="checkbox" checked style="margin-top:3px; flex-shrink:0;">
      <div style="flex:1;">
        <div style="font-size:13px; font-weight:600; color:var(--txt); margin-bottom:2px;">${m.type}</div>
        <div style="font-size:12px; color:var(--txt3);">${m.detail}</div>
      </div>
      <span class="badge ${m.badge}" style="flex-shrink:0; font-size:11px;">Missing</span>
    </div>`).join('');
  const bodyHtml = `
    <div style="margin-bottom:12px; font-size:13px; color:var(--txt2);">
      Helix identified <strong>${missing.length} asset types</strong> that haven't been generated for this campaign. Select items to generate:
    </div>
    <div style="margin-bottom:16px;">${rows}</div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); _runGenerateMissing();">Generate Selected</button>
    </div>`;
  openModal('Generate Missing Assets', bodyHtml);
}

function _runGenerateMissing() {
  runProcessing('Asset Generation', 'Generating Missing Assets', [
    'Generating APAC Outreach sequence for MAS/APRA personas...',
    'Building APAC LinkedIn audience definition...',
    'Generating post-pilot email nurture sequence (touches 2–5)...',
    'Validating new assets against governance rules...',
  ], () => {
    _addGAActivity('3 missing asset types generated for ' + (GA.campaign || 'this campaign') + '.');
    showToast('3 missing assets generated');
  });
}

function openAssetMenu(key, label) {
  const bodyHtml = `
    <div style="margin-bottom:14px; font-size:12px; color:var(--txt3);">${label}</div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
      <button class="btn btn-ghost" style="text-align:left; justify-content:flex-start;" onclick="closeModal(); showDetail('${key}')">🔍 View Provenance Chain</button>
      <button class="btn btn-ghost" style="text-align:left; justify-content:flex-start;" onclick="closeModal(); _assetEdit('${key}')">✏️ Edit Asset</button>
      <button class="btn btn-ghost" style="text-align:left; justify-content:flex-start;" onclick="closeModal(); _assetDuplicate('${key}')">⧉ Duplicate Asset</button>
      <button class="btn btn-ghost" style="text-align:left; justify-content:flex-start;" onclick="closeModal(); _assetExport('${key}')">↓ Export Asset</button>
      <hr style="border:none; border-top:1px solid var(--border); margin:4px 0;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:2px;">Open In System</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal(); _openInSystem('Salesforce', '${label}')">Salesforce ↗</button>
        <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal(); _openInSystem('Marketo', '${label}')">Marketo ↗</button>
        <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal(); _openInSystem('Outreach', '${label}')">Outreach ↗</button>
        <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal(); _openInSystem('LinkedIn', '${label}')">LinkedIn ↗</button>
      </div>
      <hr style="border:none; border-top:1px solid var(--border); margin:4px 0;">
      <button class="btn btn-ghost" style="text-align:left; justify-content:flex-start; color:var(--red);" onclick="closeModal(); _assetDelete('${key}', '${label.replace(/'/g,'')}')">🗑 Delete Asset</button>
    </div>`;
  openModal(label, bodyHtml);
}

function _assetEdit(key) {
  const d = DETAILS[key];
  const name = d ? d.title : key;
  const bodyHtml = `
    <div style="margin-bottom:14px;">
      <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:4px;">Asset Name</label>
      <input id="ae-name" value="${name}" style="width:100%; padding:7px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:13px; box-sizing:border-box;">
    </div>
    <div style="margin-bottom:14px;">
      <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:4px;">Notes</label>
      <textarea rows="3" placeholder="Add notes about this asset..." style="width:100%; padding:7px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:13px; resize:vertical; box-sizing:border-box;"></textarea>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); _addGAActivity('Asset edited: ${name.slice(0,40)}'); showToast('Asset saved');">Save Changes</button>
    </div>`;
  openModal('Edit Asset', bodyHtml);
}

function _assetDuplicate(key) {
  const d = DETAILS[key];
  const name = d ? d.title : key;
  showToast('Duplicated: ' + name.slice(0,40));
  _addGAActivity('Asset duplicated: ' + name.slice(0,40));
}

function _assetExport(key) {
  const d = DETAILS[key] || {};
  const data = JSON.stringify({ key, label: d.label || key, title: d.title || key, chain: d.chain || [] }, null, 2);
  dlFile('asset_' + key + '.json', data, 'application/json');
  _addGAActivity('Exported asset: ' + (d.title || key).slice(0,40));
  showToast('Exported asset_' + key + '.json');
}

function _assetDelete(key, label) {
  const bodyHtml = `
    <div style="margin-bottom:16px; font-size:13px; color:var(--txt2); line-height:1.55;">
      Are you sure you want to delete <strong>${label}</strong>? This cannot be undone.
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" style="background:var(--red); border-color:var(--red);" onclick="closeModal(); _addGAActivity('Asset deleted: ${label.slice(0,40)}'); showToast('Asset deleted');">Delete</button>
    </div>`;
  openModal('Delete Asset', bodyHtml);
}

function _openInSystem(system, label) {
  openModal('Open in ' + system, `
    <div style="text-align:center; padding:20px 0 12px;">
      <div style="font-size:32px; margin-bottom:12px;">🔗</div>
      <div style="font-size:14px; font-weight:600; color:var(--txt); margin-bottom:6px;">Opening in ${system}</div>
      <div style="font-size:12px; color:var(--txt3); margin-bottom:20px;">${label}</div>
      <div style="font-size:12px; color:var(--txt3); padding:10px; background:var(--surface2); border-radius:6px; margin-bottom:20px;">
        In production, this would deep-link directly to the ${system} record using the synced external ID from the Canonical Model.
      </div>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>`);
}

// ─── SALES ACTIVATION STATE ────────────────────────────────────
const SA = { outreachSynced: false, crmSynced: false, activity: [], filter: 'all', queueTs: null };

const SA_CONTACTS = [
  { id:'sw', initials:'SW', name:'Sarah Whitfield', title:'CCO', company:'Citadel Financial', region:'UK', score:107, persona:'CCO', bcRole:'Economic Buyer', offer:'Readiness Assessment → 30-Day Pilot', driver:'EU AI Act', seq:'CCO — Audit Automation — 5 touch', segment:'UK/Europe — EU AI Act', pain:'Manual AI audit evidence takes 6 weeks', opening:'"Your CCO peers at UK insurers are spending 6 weeks on AI audit prep. AgentOps reduces that to 3 hours."', callOpener:'"Sarah, I know you\'re managing EU AI Act prep on top of normal audit cycles. I won\'t take long — just want to share how one UK insurer got from 6 weeks to 3 hours."', objection:'"We already have a governance process" → "What does your audit evidence trail look like when OCC or FCA asks? AgentOps automates that specific output."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'EU AI Act — CCO', snowflake:'canonical.persona=CCO · regulatory_driver=EU_AI_ACT' },
  { id:'dc', initials:'DC', name:'David Chen', title:'CRO', company:'Global Trust Bank', region:'NA', score:98, persona:'CRO', bcRole:'Economic Buyer', offer:'Readiness Assessment', driver:'OCC Circular 2023-17', seq:'CRO — Regulatory Urgency — 5 touch', segment:'NA Tier 1/2 CxO', pain:'No audit trail for AI decisions under OCC review', opening:'"Global Trust is in active Negotiation. You need an audit trail before the next OCC examination."', callOpener:'"David, your deal is at Negotiation stage and OCC exam cycles run every 12–18 months. Are you covered if they ask for AI decision documentation today?"', objection:'"Not the right time" → "Actually this is exactly the right time — once you\'re in an OCC exam, the window to implement governance has closed."', status:'Ready', risk:'Single-threaded — needs CCO, CIO, CTO', sfStatus:'Campaign Member — Open Opp · Negotiation', outreachStatus:'Sequence Active', mktoSegment:'NA Tier 1 — CRO', snowflake:'canonical.persona=CRO · regulatory_driver=OCC_2023_17' },
  { id:'mt', initials:'MT', name:'Marcus Thompson', title:'CIO', company:'Pacific Mutual Insurance', region:'NA', score:94, persona:'CIO', bcRole:'Technical Buyer', offer:'Readiness Assessment', driver:'OCC Circular 2023-17', seq:'CIO — Shadow AI — 5 touch', segment:'NA Tier 1/2 CxO', pain:'Shadow AI tools deployed without visibility or governance', opening:'"How many AI agents are running in Pacific Mutual right now? Most CIOs are surprised by the answer."', callOpener:'"Marcus, I have one question: if your board asked for a complete AI agent inventory tomorrow, how confident would you be in the number?"', objection:'"We track our AI tools" → "Deployed tools, yes. But what about AI agents deployed by line-of-business teams without IT approval? That\'s where the exposure is."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'NA Tier 1 — CIO', snowflake:'canonical.persona=CIO · regulatory_driver=OCC_2023_17' },
  { id:'ev', initials:'EV', name:'Elena Vasquez', title:'CCO', company:'European Capital Partners', region:'EU', score:91, persona:'CCO', bcRole:'Economic Buyer', offer:'Readiness Assessment', driver:'EU AI Act', seq:'CCO — Audit Automation — 5 touch', segment:'UK/Europe — EU AI Act', pain:'EU AI Act enforcement deadline with no governance framework', opening:'"European Capital has 14 months before EU AI Act enforcement. Your CCO peers are already preparing audit trails."', callOpener:'"Elena, EU AI Act enforcement starts Feb 2026. Most CCOs we\'re talking to have 14 months and no governance layer. Where does European Capital stand?"', objection:'"We\'re monitoring EU AI Act" → "Monitoring it is different from having audit-ready documentation. AgentOps produces that output automatically."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'EU AI Act — CCO', snowflake:'canonical.persona=CCO · regulatory_driver=EU_AI_ACT' },
  { id:'jo', initials:'JO', name:'James Okafor', title:'CRO', company:'First National Wealth', region:'NA', score:88, persona:'CRO', bcRole:'Economic Buyer', offer:'Readiness Assessment', driver:'OCC Circular 2023-17', seq:'CRO — Regulatory Urgency — 5 touch', segment:'NA Tier 1/2 CxO', pain:'OCC exam prep consuming revenue team bandwidth', opening:'"First National\'s next OCC examination is coming. AgentOps gives you audit-ready documentation in 48 hours."', callOpener:'"James, I know OCC exam prep pulls your team off revenue work for weeks. There\'s a way to automate most of that — worth 15 minutes?"', objection:'"We handle compliance internally" → "Absolutely — AgentOps doesn\'t replace your compliance team, it automates the documentation they have to produce."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'NA Tier 1 — CRO', snowflake:'canonical.persona=CRO · regulatory_driver=OCC_2023_17' },
  { id:'ps', initials:'PS', name:'Priya Sharma', title:'CIO', company:'Meridian Capital', region:'APAC', score:85, persona:'CIO', bcRole:'Technical Buyer', offer:'Readiness Assessment', driver:'MAS TRM', seq:'CIO — Shadow AI — 5 touch', segment:'APAC — MAS/APRA', pain:'Shadow AI proliferation under MAS TRM scrutiny', opening:'"MAS TRM guidelines now require AI agent documentation. Is Meridian\'s governance program ready?"', callOpener:'"Priya, MAS TRM now explicitly covers AI agent oversight. Are you tracking all agents running in Meridian\'s environment?"', objection:'"We\'re compliant with MAS TRM" → "On traditional systems, yes. AI agents are a new category that most MAS TRM interpretations now include — that\'s the gap."', status:'Needs Review', risk:null, sfStatus:'Campaign Member — Under Review', outreachStatus:'Paused — needs review', mktoSegment:'APAC — MAS/APRA', snowflake:'canonical.persona=CIO · regulatory_driver=MAS_TRM' },
  { id:'tb', initials:'TB', name:'Thomas Brennan', title:'CTO', company:'Citadel Financial', region:'EU', score:82, persona:'CTO', bcRole:'Technical Evaluator', offer:'30-Day Pilot', driver:'EU AI Act', seq:'CTO — 48hr Deploy — 4 touch', segment:'UK/Europe — EU AI Act', pain:'Governance deployment blocking AI roadmap velocity', opening:'"48-hour AgentOps deployment. No rip-and-replace. Citadel can be governance-compliant before your next board meeting."', callOpener:'"Thomas, I know governance tooling usually means a 6-month implementation. AgentOps is live in 48 hours via a single API endpoint — no touching your existing stack."', objection:'"We can\'t take on another implementation" → "48 hours. Single API. No change to existing systems. Your team can evaluate it while running their current roadmap."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'EU AI Act — CTO', snowflake:'canonical.persona=CTO · regulatory_driver=EU_AI_ACT' },
  { id:'at', initials:'AT', name:'Aiko Tanaka', title:'VP AI', company:'Pacific Mutual Insurance', region:'APAC', score:79, persona:'VP AI', bcRole:'Champion', offer:'Readiness Assessment', driver:'APRA CPS 230', seq:'CIO — Shadow AI — 5 touch', segment:'APAC — MAS/APRA', pain:'Internal AI governance champion needs exec alignment and tooling', opening:'"You\'re building the AI governance program at Pacific Mutual. AgentOps gives you the audit infrastructure to move faster."', callOpener:'"Aiko, as the internal AI governance lead, what does your current audit documentation process look like? We help teams like yours automate that layer."', objection:'"We\'re building our own tooling" → "Building vs. buying governance infrastructure is a real decision. Most teams find that buying the audit layer frees them to build the intelligence layer."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'APAC — VP AI', snowflake:'canonical.persona=VP_AI · regulatory_driver=APRA_CPS_230' },
  { id:'rk', initials:'RK', name:'Robert Klein', title:'CRO', company:'Meridian Capital', region:'EU', score:76, persona:'CRO', bcRole:'Economic Buyer', offer:'Readiness Assessment', driver:'EU AI Act', seq:'CRO — Regulatory Urgency — 5 touch', segment:'UK/Europe — EU AI Act', pain:'Revenue risk from unaudited AI decisions in EU market', opening:'"Meridian\'s EU operations face EU AI Act compliance deadlines. CRO-level exposure if AI decisions can\'t be audited."', callOpener:'"Robert, EU AI Act creates CRO-level liability for unaudited AI decisions affecting customers. Is Meridian\'s EU operation covered?"', objection:'"Legal is handling EU AI Act" → "Legal defines the policy. AgentOps produces the audit trail that satisfies it — those are different problems."', status:'Needs Review', risk:null, sfStatus:'Campaign Member — Under Review', outreachStatus:'Paused — needs review', mktoSegment:'EU AI Act — CRO', snowflake:'canonical.persona=CRO · regulatory_driver=EU_AI_ACT' },
  { id:'lp', initials:'LP', name:'Lisa Park', title:'CCO', company:'Global Trust Bank', region:'NA', score:73, persona:'CCO', bcRole:'Economic Buyer', offer:'Readiness Assessment', driver:'OCC Circular 2023-17', seq:'CCO — Audit Automation — 5 touch', segment:'NA Tier 1/2 CxO', pain:'OCC audit preparation burden on compliance team', opening:'"Global Trust\'s CCO team is managing OCC audit prep manually. AgentOps cuts that from 6 weeks to 3 hours."', callOpener:'"Lisa, how long does your team currently spend preparing AI governance evidence for OCC examinations? We\'ve seen teams go from 6 weeks to 3 hours."', objection:'"We have our own process" → "Absolutely — and AgentOps plugs into your existing process to automate the documentation output. It doesn\'t change how you work."', status:'Ready', risk:null, sfStatus:'Campaign Member — Enrolled', outreachStatus:'Sequence Active', mktoSegment:'NA Tier 1 — CCO', snowflake:'canonical.persona=CCO · regulatory_driver=OCC_2023_17' },
];

const SA_ACCOUNTS = {
  citadel:     { name:'Citadel Financial',       score:96, contacts:['sw','tb'],       covered:['CCO','CRO'], missing:['CTO','Procurement','Head of CX'], opp:'Proposal/Price Quote · $220K', risk:null,             motion:'Progress Thomas Brennan (CTO) → then push to NYC Exec Roundtable' },
  globaltrust: { name:'Global Trust Bank',        score:88, contacts:['dc','lp'],       covered:['CRO'],       missing:['CCO','CIO','CTO'],               opp:'Negotiation · $340K',          risk:'Single-threaded', motion:'Add CCO (Lisa Park engaged) + find CIO before advancing deal' },
  pacific:     { name:'Pacific Mutual Insurance', score:84, contacts:['mt','at'],       covered:['CIO','VP AI'],missing:['CRO','CTO'],                     opp:'Evaluation · $185K',           risk:null,             motion:'CIO + VP AI engaged → identify CRO sponsor via warm intro' },
  meridian:    { name:'Meridian Capital',          score:78, contacts:['ps','rk'],       covered:['CCO'],       missing:['CRO','CIO'],                     opp:'Qualification · $150K',        risk:'Single-threaded', motion:'CCO-led start → identify CRO through CCO referral' },
  firstnational:{ name:'First National Wealth',   score:72, contacts:['jo'],            covered:['CRO'],       missing:['CCO','CIO'],                     opp:'Prospecting · New',            risk:null,             motion:'CRO first mover → get warm intro to CCO or CIO' },
};

const SA_SEQUENCES = {
  'cco-audit':   { name:'CCO — Audit Automation — 5 touch',      persona:'CCO', offer:'Readiness Assessment', driver:'EU AI Act / OCC', touches:5, contacts:9,  touches_data:[{n:1,subj:'Turn a 6-week AI audit into 3 hours',body:'Hi {FirstName}, CCO peers at UK and NA financial institutions are spending 6 weeks preparing AI audit evidence for regulatory examinations. AgentOps automates that process — audit-ready documentation in under 3 hours. Worth 15 minutes to see how it works?'},{n:2,subj:'The OCC wants your AI audit trail',body:'Hi {FirstName}, OCC Circular 2023-17 requires documented oversight of AI models and agents. Most CCOs we speak with have the agents deployed but not the governance layer. This is the gap AgentOps closes.'},{n:3,subj:'One question about your AI governance program',body:'Hi {FirstName}, just one question: if OCC or FCA asked for a full inventory and audit trail of your AI agents tomorrow, how long would it take your team to produce it?'},{n:4,subj:'Case: Global insurer — 6 weeks to 3 hours',body:'Hi {FirstName}, a Tier 1 UK insurer was spending 6 weeks per regulatory exam preparing AI governance documentation. AgentOps reduced that to 3 hours. Happy to share details if useful.'},{n:5,subj:'Last note — Readiness Assessment',body:'Hi {FirstName}, last note from me. If there\'s interest in understanding where your AI governance program stands — our Readiness Assessment takes 90 minutes and gives you a scored gap analysis. No commitment required.'}] },
  'cro-reg':     { name:'CRO — Regulatory Urgency — 5 touch',    persona:'CRO', offer:'Readiness Assessment', driver:'OCC Circular 2023-17', touches:5, contacts:7, touches_data:[{n:1,subj:'Your AI agents are running. Will you have the audit trail when OCC asks?',body:'Hi {FirstName}, OCC examiners are asking financial institutions for AI agent inventories and decision audit trails. Most CROs have the agents but not the documentation. Worth 15 minutes to discuss where you stand?'},{n:2,subj:'OCC Circular 2023-17 — what it means for your AI program',body:'Hi {FirstName}, OCC Circular 2023-17 requires explainable, auditable AI decision-making. AgentOps builds the governance layer that satisfies those requirements without touching your existing AI stack.'},{n:3,subj:'The audit trail question your CIO is already asking',body:'Hi {FirstName}, your CIO is already thinking about this. AI agents generating decisions without documentation creates risk for both the revenue and tech org. AgentOps is the answer both teams can agree on.'},{n:4,subj:'30-minute governance readiness call — worth it?',body:'Hi {FirstName}, just 30 minutes to walk through where your AI governance program stands against OCC, Fed Reserve, and NYDFS requirements. I can share the assessment framework we use with other CROs.'},{n:5,subj:'Final note — Readiness Assessment offer',body:'Hi {FirstName}, wrapping up my outreach. If timing isn\'t right now, I\'d still like to leave the Readiness Assessment offer open — 90 minutes, scored gap analysis, no sales process attached.'}] },
  'cio-shadow':  { name:'CIO — Shadow AI — 5 touch',             persona:'CIO', offer:'Readiness Assessment', driver:'OCC / MAS TRM', touches:5, contacts:7, touches_data:[{n:1,subj:'How many AI agents are running in your org right now? Most CIOs don\'t know.',body:'Hi {FirstName}, shadow AI is the new shadow IT. Business units deploy AI agents without CIO visibility. When regulators ask, the CIO is accountable for what they didn\'t know was running. AgentOps gives you the inventory and the audit trail.'},{n:2,subj:'The shadow AI inventory problem',body:'Hi {FirstName}, the average enterprise has 3× more AI agents deployed than the CIO knows about. AgentOps surfaces the full inventory and applies governance controls without disrupting existing deployments.'},{n:3,subj:'One question about your AI governance posture',body:'Hi {FirstName}, honest question: if your board asked for a complete inventory of AI agents running in your organization today, how confident would you be in the answer?'},{n:4,subj:'Deploy governance in 48 hours — no rip-and-replace',body:'Hi {FirstName}, most governance tools require months to deploy. AgentOps is live in 48 hours with a single API endpoint — governance layer, not a replacement.'},{n:5,subj:'Last note — CIO governance brief',body:'Hi {FirstName}, happy to share our CIO governance brief — AI agent inventory methodology, regulatory mapping, and the 48-hour deployment path. No meeting required.'}] },
  'cto-deploy':  { name:'CTO — 48hr Deploy — 4 touch',           persona:'CTO', offer:'30-Day Pilot', driver:'EU AI Act / OCC', touches:4, contacts:5, touches_data:[{n:1,subj:'Deploy AI agent governance in 48 hours — no rip-and-replace',body:'Hi {FirstName}, governance tooling usually means a 6-month implementation. AgentOps is live in 48 hours via a single API endpoint — no change to your existing AI stack. Worth a quick look?'},{n:2,subj:'Technical spec: how AgentOps connects to your AI agents',body:'Hi {FirstName}, AgentOps connects via a lightweight API wrapper. Existing agents continue to run. The governance layer captures decisions, builds audit trails, and applies policy rules in the background.'},{n:3,subj:'30-day pilot — zero disruption to your roadmap',body:'Hi {FirstName}, our 30-Day Pilot is designed for CTOs who can\'t pause their roadmap. AgentOps runs alongside existing systems. You evaluate while your team keeps building.'},{n:4,subj:'Final note — pilot offer',body:'Hi {FirstName}, last touch. The 30-Day Pilot offer is open. 48-hour deployment. No rip-and-replace. If there\'s a good window in your roadmap to run it, happy to schedule.'}] },
  'eu-act':      { name:'EU AI Act Urgency — 4 touch',           persona:'CCO/CRO', offer:'Readiness Assessment', driver:'EU AI Act', touches:4, contacts:9, touches_data:[{n:1,subj:'EU AI Act enforcement is 14 months away. Is your AI agent program ready?',body:'Hi {FirstName}, EU AI Act enforcement begins February 2026. Financial services AI agents that affect customers or credit decisions are in scope. Most institutions we\'re speaking with have the agents but not the audit infrastructure. Worth a conversation?'},{n:2,subj:'What EU AI Act Article 13 requires from your AI governance program',body:'Hi {FirstName}, EU AI Act Article 13 requires transparency documentation for high-risk AI systems. AI agents making or influencing financial decisions likely qualify. AgentOps automates that documentation layer.'},{n:3,subj:'Your EU peers are already preparing — are you?',body:'Hi {FirstName}, UK and EU financial institutions we\'re working with started EU AI Act prep 6 months ago. The ones who started late are now in scramble mode. Where does your program stand?'},{n:4,subj:'Last note — EU AI Act Readiness Assessment',body:'Hi {FirstName}, last note. Our EU AI Act Readiness Assessment maps your current AI agent program against Article 9, 13, and 17 requirements and gives you a scored gap analysis. 90 minutes. No commitment.'}] },
  'post-assess': { name:'Post-Assessment — Pilot Activation',    persona:'All', offer:'30-Day Pilot', driver:'Post-Assessment trigger', touches:3, contacts:1, touches_data:[{n:1,subj:'Your Readiness Assessment is complete — here\'s what we found',body:'Hi {FirstName}, thank you for completing the AI Agent Governance Readiness Assessment. Your results are ready. I\'d like to walk through the findings and show you how AgentOps closes the gaps we identified. 30 minutes?'},{n:2,subj:'The 3 gaps we identified in your AI governance program',body:'Hi {FirstName}, following up on your assessment results. The three highest-priority gaps were [gap summary from assessment]. AgentOps addresses all three. Our 30-Day Pilot activates in 48 hours and directly closes these gaps.'},{n:3,subj:'30-Day Pilot — activate this week',body:'Hi {FirstName}, last note on the pilot. Your assessment showed [key finding]. The 30-Day Pilot is ready to activate — 48-hour deployment, live governance layer, immediate audit trail output. Ready when you are.'}] },
};

function _initSA() {
  SA.queueTs = new Date();
  const ts = SA.queueTs.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const campaignName = ACTIVE_CAMPAIGN ? (CAMPAIGNS[ACTIVE_CAMPAIGN]?.name || 'Q1 AgentOps Launch') : 'Q1 AgentOps Launch';
  const badgeEl = document.getElementById('sa-campaign-badge');
  const tsEl    = document.getElementById('sa-queue-ts');
  if (badgeEl) badgeEl.textContent = campaignName;
  if (tsEl)    tsEl.textContent    = 'Queue built: ' + ts;
  _addSAActivity('Activation queue initialized for ' + campaignName + ' — 38 contacts, 6 sequences, 5 accounts.');
  const logEl = document.getElementById('sa-activity-log');
  if (logEl) logEl.style.display = '';
}

function _addSAActivity(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  SA.activity.unshift({ ts, msg });
  _renderSALog();
}

function _renderSALog() {
  const el = document.getElementById('sa-log-entries');
  if (!el) return;
  el.innerHTML = SA.activity.slice(0, 10).map(e =>
    `<div style="padding:5px 0; border-bottom:1px solid var(--border); display:flex; gap:10px;">
       <span style="flex-shrink:0; color:var(--txt3);">${e.ts}</span>
       <span style="color:var(--txt2);">${e.msg}</span>
     </div>`
  ).join('');
}

// ─── CONTACT DRAWER ────────────────────────────────────────────
function openContactDrawer(id) {
  const c = SA_CONTACTS.find(x => x.id === id);
  if (!c) return;
  document.getElementById('sa-drawer-name').textContent = c.name + ' · ' + c.title + ' · ' + c.company;
  document.getElementById('sa-drawer-body').innerHTML = `
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Contact Summary</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 12px; font-size:12px;">
        <div><span style="color:var(--txt3);">Title: </span><span style="color:var(--txt);">${c.title}</span></div>
        <div><span style="color:var(--txt3);">Company: </span><span style="color:var(--txt);">${c.company}</span></div>
        <div><span style="color:var(--txt3);">Region: </span><span style="color:var(--txt);">${c.region}</span></div>
        <div><span style="color:var(--txt3);">Score: </span><span style="font-weight:700; color:var(--accent);">${c.score}</span></div>
        <div><span style="color:var(--txt3);">Status: </span><span class="badge ${c.status==='Ready'?'badge-green':'badge-amber'}" style="font-size:11px;">${c.status}</span></div>
        ${c.risk ? `<div style="grid-column:1/-1;"><span class="badge badge-amber" style="font-size:11px;">⚠ ${c.risk}</span></div>` : ''}
      </div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Why This Contact</div>
      <div style="display:flex; flex-direction:column; gap:7px; font-size:12px;">
        <div><span style="color:var(--txt3);">Persona: </span><span style="color:var(--txt); font-weight:600;">${c.persona}</span></div>
        <div><span style="color:var(--txt3);">Pain: </span><span style="color:var(--txt2);">${c.pain}</span></div>
        <div><span style="color:var(--txt3);">BC Role: </span><span style="color:var(--txt);">${c.bcRole}</span></div>
        <div><span style="color:var(--txt3);">Offer: </span><span style="color:var(--green);">${c.offer}</span></div>
        <div><span style="color:var(--txt3);">Regulatory Driver: </span><span style="color:var(--amber);">${c.driver}</span></div>
        <div><span style="color:var(--txt3);">Segment: </span><span style="color:var(--txt2);">${c.segment}</span></div>
      </div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Suggested SDR Action</div>
      <div style="margin-bottom:8px; padding:9px 10px; background:var(--surface2); border-radius:6px; font-size:12px; line-height:1.5;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--accent); margin-bottom:4px;">Opening Email Line</div>
        <div style="color:var(--txt2);">${c.opening}</div>
      </div>
      <div style="margin-bottom:8px; padding:9px 10px; background:var(--surface2); border-radius:6px; font-size:12px; line-height:1.5;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--accent); margin-bottom:4px;">Call Opener</div>
        <div style="color:var(--txt2);">${c.callOpener}</div>
      </div>
      <div style="padding:9px 10px; background:var(--surface2); border-radius:6px; font-size:12px; line-height:1.5;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--amber); margin-bottom:4px;">Objection Handler</div>
        <div style="color:var(--txt2);">${c.objection}</div>
      </div>
      <div style="margin-top:8px; font-size:12px; color:var(--txt3);">Sequence: <span style="color:var(--txt);">${c.seq}</span></div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Field Population</div>
      <div style="font-size:12px; display:flex; flex-direction:column; gap:5px;">
        <div><span style="color:var(--txt3);">Salesforce: </span><span style="color:var(--txt2);">${c.sfStatus}</span></div>
        <div><span style="color:var(--txt3);">Outreach: </span><span style="color:${SA.outreachSynced?'var(--green)':'var(--txt2)'};">${SA.outreachSynced ? 'Synced — ' : ''}${c.outreachStatus}</span></div>
        <div><span style="color:var(--txt3);">Marketo: </span><span style="color:var(--txt2);">${c.mktoSegment}</span></div>
        <div><span style="color:var(--txt3);">Snowflake: </span><span style="color:var(--txt2); font-size:11px; font-family:monospace;">${c.snowflake}</span></div>
      </div>
    </div>
    <div>
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Actions</div>
      <div style="display:flex; flex-direction:column; gap:7px;">
        <button class="btn btn-ghost" style="text-align:left;justify-content:flex-start;" onclick="_saOpenInSystem('Salesforce','${c.name}')">Open in Salesforce ↗</button>
        <button class="btn btn-ghost" style="text-align:left;justify-content:flex-start;" onclick="_saOpenInSystem('Outreach','${c.name}')">Open in Outreach ↗</button>
        <button class="btn btn-ghost" style="text-align:left;justify-content:flex-start;" onclick="_saCopyOpener('${id}')">Copy Opening Line</button>
        <button class="btn btn-ghost" style="text-align:left;justify-content:flex-start;" onclick="_saMarkReady('${id}')">Mark Ready ✓</button>
        <button class="btn btn-ghost" style="text-align:left;justify-content:flex-start;color:var(--red);" onclick="closeContactDrawer();_saRemoveFromQueue('${id}','${c.name}')">Remove From Queue</button>
      </div>
    </div>`;
  document.getElementById('sa-drawer-overlay').style.display = '';
  document.getElementById('sa-contact-drawer').style.display = '';
  _addSAActivity('Opened contact: ' + c.name + ' (' + c.title + ', ' + c.company + ')');
}

function closeContactDrawer() {
  document.getElementById('sa-drawer-overlay').style.display = 'none';
  document.getElementById('sa-contact-drawer').style.display = 'none';
}

function _saCopyOpener(id) {
  const c = SA_CONTACTS.find(x => x.id === id);
  if (!c) return;
  if (navigator.clipboard) navigator.clipboard.writeText(c.opening.replace(/"/g, ''));
  showToast('Opening line copied to clipboard');
  _addSAActivity('Copied opening line for ' + c.name);
}

function _saMarkReady(id) {
  const c = SA_CONTACTS.find(x => x.id === id);
  if (!c) return;
  c.status = 'Ready';
  showToast(c.name + ' marked Ready');
  _addSAActivity('Marked ready: ' + c.name);
}

function _saRemoveFromQueue(id, name) {
  openModal('Remove From Queue', `
    <div style="margin-bottom:16px; font-size:13px; color:var(--txt2);">Remove <strong>${name}</strong> from the activation queue? They will not be included in Outreach exports.</div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" style="background:var(--red);border-color:var(--red);" onclick="closeModal();_addSAActivity('Removed from queue: ${name}');showToast('${name} removed from queue');">Remove</button>
    </div>`);
}

function _saOpenInSystem(system, name) {
  const mockId = 'DEMO-' + Math.random().toString(36).slice(2,8).toUpperCase();
  openModal('Open in ' + system, `
    <div style="text-align:center; padding:16px 0 10px;">
      <div style="font-size:28px; margin-bottom:10px;">🔗</div>
      <div style="font-size:14px; font-weight:600; margin-bottom:4px;">${name}</div>
      <div style="font-size:11px; color:var(--txt3); margin-bottom:16px;">System: ${system}</div>
      <div style="text-align:left; background:var(--surface2); border-radius:6px; padding:10px 12px; font-size:12px; margin-bottom:16px;">
        <div style="margin-bottom:4px;"><span style="color:var(--txt3);">Object ID: </span><span style="font-family:monospace;">${mockId}</span></div>
        <div style="margin-bottom:4px;"><span style="color:var(--txt3);">Mock URL: </span><span style="font-family:monospace; color:var(--accent);">${system.toLowerCase()}.com/records/${mockId}</span></div>
        <div><span style="color:var(--txt3);">Status: </span><span style="color:var(--green);">Demo mode — live record in production</span></div>
      </div>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>`);
  _addSAActivity('Opened ' + system + ' record: ' + name);
}

// ─── FULL QUEUE MODAL ──────────────────────────────────────────
function openFullQueue() {
  const rows = SA_CONTACTS.map(c => `
    <div style="display:grid; grid-template-columns:1fr 50px 80px 60px; gap:6px 10px; padding:9px 12px; border-bottom:1px solid var(--border); align-items:center; cursor:pointer;" onclick="closeModal();openContactDrawer('${c.id}')">
      <div>
        <div style="font-size:13px; font-weight:600; color:var(--txt);">${c.name}</div>
        <div style="font-size:11px; color:var(--txt3);">${c.title} · ${c.company} · ${c.region}</div>
      </div>
      <div style="font-size:13px; font-weight:700; color:var(--accent); text-align:right;">${c.score}</div>
      <div style="font-size:11px; color:var(--txt3); text-align:center;">${c.persona} · ${c.bcRole}</div>
      <div><span class="badge ${c.status==='Ready'?'badge-green':'badge-amber'}" style="font-size:10px;">${c.status}</span>${c.risk?'<span class="badge badge-amber" style="font-size:10px;margin-left:3px;">⚠</span>':''}</div>
    </div>`).join('');
  openModal('Full Activation Queue — 38 Contacts', `
    <div style="background:var(--surface2); padding:7px 12px; border-radius:6px; margin-bottom:10px; font-size:11px; color:var(--txt3);">Showing top 10 by score. Click any row to open the full SDR context drawer.</div>
    <div style="background:var(--surface2); display:grid; grid-template-columns:1fr 50px 80px 60px; gap:6px 10px; padding:7px 12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); border-radius:6px; margin-bottom:6px;">
      <span>Contact</span><span style="text-align:right;">Score</span><span style="text-align:center;">Persona · Role</span><span>Status</span>
    </div>
    ${rows}
    <div style="padding:10px 12px; font-size:12px; color:var(--txt3); text-align:center;">+ 28 additional contacts in full export</div>`);
  _addSAActivity('Viewed full activation queue (38 contacts).');
}

// ─── FILTER ────────────────────────────────────────────────────
function saFilter(f, btn) {
  SA.filter = f;
  document.querySelectorAll('.sa-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _addSAActivity('Filtered queue: ' + f);
}

// ─── ACCOUNT MODAL ─────────────────────────────────────────────
function openAccountModal(id) {
  const a = SA_ACCOUNTS[id];
  if (!a) return;
  const contacts = SA_CONTACTS.filter(c => a.contacts.includes(c.id));
  const contactRows = contacts.map(c => `
    <div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border); cursor:pointer;" onclick="closeModal();openContactDrawer('${c.id}')">
      <div style="width:30px;height:30px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--txt3);flex-shrink:0;">${c.initials}</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;color:var(--txt);">${c.name}</div><div style="font-size:11px;color:var(--txt3);">${c.title} · ${c.persona} · Score ${c.score}</div></div>
      <span class="badge ${c.status==='Ready'?'badge-green':'badge-amber'}" style="font-size:10px;">${c.status}</span>
    </div>`).join('');
  const missingHtml = a.missing.map(r => `<span style="display:inline-block;margin:2px;padding:3px 7px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:4px;font-size:11px;color:var(--amber);">${r} — not identified</span>`).join('');
  openModal(a.name, `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
      <span class="badge badge-accent" style="font-size:11px;">Priority ${a.score}</span>
      ${a.risk ? `<span class="badge badge-amber" style="font-size:11px;">⚠ ${a.risk}</span>` : '<span class="badge badge-green" style="font-size:11px;">Multi-threaded</span>'}
      <span style="font-size:12px;color:var(--txt3);">${a.opp}</span>
    </div>
    <div style="margin-bottom:12px; padding:9px 10px; background:var(--surface2); border-radius:6px; font-size:12px; color:var(--txt2);">
      <span style="color:var(--accent); font-weight:600;">Recommended motion: </span>${a.motion}
    </div>
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--txt3);margin-bottom:8px;">Matched Contacts</div>
    ${contactRows}
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--txt3);margin:12px 0 8px;">Missing BC Roles</div>
    <div style="margin-bottom:14px;">${missingHtml}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();findMissingContacts('${id}')">Find Missing Contacts</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('${a.name} suppressed from queue');_addSAActivity('Suppressed account: ${a.name}');">Suppress Account</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="closeModal();showToast('Proceeding with ${a.name}');_addSAActivity('Proceeding with ${a.name} despite gaps.');">Proceed Anyway</button>
    </div>`);
  _addSAActivity('Opened account: ' + a.name);
}

function findMissingContacts(accountId) {
  const a = SA_ACCOUNTS[accountId];
  if (!a) return;
  const recs = a.missing.map(role => {
    const titles = { CCO:'Chief Compliance Officer', CRO:'Chief Risk Officer', CIO:'Chief Information Officer', CTO:'Chief Technology Officer', 'Procurement':'VP Procurement / Head of Vendor Management' };
    return `<div style="padding:8px 10px; background:var(--surface2); border-radius:6px; margin-bottom:6px; font-size:12px;">
      <div style="font-weight:600; color:var(--txt); margin-bottom:2px;">${role} — ${titles[role] || role}</div>
      <div style="color:var(--txt3);">Search ${a.name} on LinkedIn for title: "${titles[role] || role}" · Try warm intro via matched contacts</div>
    </div>`;
  }).join('');
  openModal('Find Missing Contacts — ' + a.name, `
    <div style="margin-bottom:12px; font-size:13px; color:var(--txt2);">${a.missing.length} buying committee roles not yet identified at <strong>${a.name}</strong>.</div>
    ${recs}
    <div style="margin-top:14px; display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('LinkedIn search initiated for ${a.name}');_addSAActivity('Initiated LinkedIn search for missing contacts at ${a.name}.');">Search LinkedIn</button>
    </div>`);
}

// ─── SEQUENCE MODAL ────────────────────────────────────────────
function openSequenceModal(id) {
  const s = SA_SEQUENCES[id];
  if (!s) return;
  const touchHtml = s.touches_data.map(t => `
    <div style="margin-bottom:12px; border:1px solid var(--border); border-radius:6px; overflow:hidden;">
      <div style="padding:7px 10px; background:var(--surface2); display:flex; align-items:center; gap:8px;">
        <span style="width:20px;height:20px;border-radius:50%;background:var(--accent);color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${t.n}</span>
        <span style="font-size:12px; font-weight:600; color:var(--txt);">${t.subj}</span>
      </div>
      <div style="padding:9px 10px; font-size:12px; color:var(--txt3); line-height:1.55;">${t.body}</div>
    </div>`).join('');
  openModal(s.name, `
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px;">
      <span class="badge badge-accent" style="font-size:11px;">Persona: ${s.persona}</span>
      <span class="badge badge-green" style="font-size:11px;">${s.touches} touches · ${s.contacts} contacts</span>
      <span style="font-size:12px; color:var(--amber);">${s.driver}</span>
    </div>
    <div style="max-height:420px; overflow-y:auto; padding-right:4px;">${touchHtml}</div>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Sequence cloned');_addSAActivity('Cloned sequence: ${s.name}');">Clone Sequence</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();_saExportSeq('${id}')">Export Sequence</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();_saOpenInSystem('Outreach','${s.name}')">Open in Outreach ↗</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="closeModal()">Close</button>
    </div>`);
  _addSAActivity('Previewed sequence: ' + s.name);
}

function _saExportSeq(id) {
  const s = SA_SEQUENCES[id];
  if (!s) return;
  const txt = s.touches_data.map(t => `TOUCH ${t.n}\nSubject: ${t.subj}\n\n${t.body}\n\n---`).join('\n\n');
  dlFile('sequence_' + id + '.txt', `SEQUENCE: ${s.name}\nPersona: ${s.persona} · Offer: ${s.offer} · Driver: ${s.driver}\n\n` + txt, 'text/plain');
  _addSAActivity('Exported sequence: ' + s.name);
  showToast('Exported sequence_' + id + '.txt');
}

// ─── EXPORT TO OUTREACH ────────────────────────────────────────
function _saExportOutreach() {
  const body = `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2); line-height:1.55;">You are about to export to Sales Engagement Platform:</div>
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; margin-bottom:16px; font-size:12px; line-height:1.8; color:var(--txt2);">
      • <strong>38 contacts</strong> with persona + BC role tags<br>
      • <strong>6 sequences</strong> assigned by persona<br>
      • <strong>12 custom field tags</strong> (persona, offer, driver, segment)<br>
      • <strong>6 persona mappings</strong><br>
      • <strong>4 regulatory driver tags</strong><br>
      • <strong>3 offer assignments</strong>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal();_runSaExport();">Export to Sequences</button>
    </div>`;
  openModal('Export to Sequences', body);
}

function _runSaExport() {
  const exportBtn = document.getElementById('sa-export-btn');
  const statusBadge = document.getElementById('sa-outreach-status');
  if (statusBadge) { statusBadge.textContent = 'Syncing…'; statusBadge.className = 'badge badge-amber'; }
  runProcessing('Sales Activation', 'Exporting to Sequences', [
    'Preparing contact payload (38 contacts)…',
    'Applying canonical persona tags…',
    'Attaching sequence assignments (6 sequences)…',
    'Writing custom fields to Sales Engagement Platform…',
    'Syncing account context and BC roles…',
    'Export complete — 38 contacts enrolled.',
  ], () => {
    SA.outreachSynced = true;
    if (statusBadge) { statusBadge.textContent = 'Synced ✓'; statusBadge.className = 'badge badge-green'; }
    if (exportBtn)   { exportBtn.textContent = 'Open in Sequences ↗'; exportBtn.onclick = () => _saOpenInSystem('Sales Engagement', 'Q1 AgentOps Launch'); }
    _addSAActivity('Exported 38 contacts + 6 sequences to Sales Engagement Platform.');
    showToast('38 contacts exported to Sales Engagement Platform');
  });
}

// ─── SDR BRIEF DOWNLOAD ────────────────────────────────────────
function downloadSdrBrief() {
  const campaignName = ACTIVE_CAMPAIGN ? (CAMPAIGNS[ACTIVE_CAMPAIGN]?.name || 'Q1 AgentOps Launch') : 'Q1 AgentOps Launch';
  const contactLines = SA_CONTACTS.map(c =>
    `  ${c.name} | ${c.title} | ${c.company} | ${c.region} | Score: ${c.score}\n  Persona: ${c.persona} · Role: ${c.bcRole} · Sequence: ${c.seq}\n  Pain: ${c.pain}\n  Offer: ${c.offer} · Driver: ${c.driver}\n  Opening: ${c.opening}\n`
  ).join('\n');
  const brief = `HELIX AI — SDR ACTIVATION BRIEF
Campaign: ${campaignName}
Generated: ${new Date().toLocaleString()}
Canonical Model: v${CM.versionNum || 1}

════════════════════════════════════════
CAMPAIGN OBJECTIVE
Govern What You've Built — Q1 Launch
Pipeline target: $18M · Motion: Readiness Assessment → 30-Day Pilot
Regulatory hook: OCC (NA) · EU AI Act (EU) · MAS/APRA (APAC)

════════════════════════════════════════
ACTIVATION SUMMARY
Contacts ready: 38
Sequences assigned: 6
Accounts covered: 5
Single-threaded accounts: 3 (Global Trust Bank, Meridian Capital, First National Wealth)
Data quality score: 91%

════════════════════════════════════════
TOP ACCOUNTS — PRIORITY ORDER
1. Citadel Financial    | Score 96 | Proposal $220K | CCO + CRO engaged | Find CTO
2. Global Trust Bank    | Score 88 | Negotiation $340K | ⚠ CRO only — SINGLE THREADED
3. Pacific Mutual       | Score 84 | Evaluation $185K | CIO + VP AI | Find CRO
4. Meridian Capital     | Score 78 | Qualification $150K | ⚠ CCO only — SINGLE THREADED
5. First National Wealth| Score 72 | Prospecting | CRO first mover

════════════════════════════════════════
CONTACT ACTIVATION QUEUE
${contactLines}
════════════════════════════════════════
SEQUENCES — FROM CAMPAIGN DNA
1. CCO — Audit Automation — 5 touch | 9 contacts | EU AI Act / OCC
2. CRO — Regulatory Urgency — 5 touch | 7 contacts | OCC Circular 2023-17
3. CIO — Shadow AI — 5 touch | 7 contacts | OCC / MAS TRM
4. CTO — 48hr Deploy — 4 touch | 5 contacts | EU AI Act / OCC
5. EU AI Act Urgency — 4 touch | 9 contacts | EU AI Act
6. Post-Assessment — Pilot Activation | 1 pending

════════════════════════════════════════
OFFER GUIDANCE
Primary offer: AI Agent Governance Readiness Assessment (90 min, scored gap analysis)
Secondary offer: 30-Day Pilot (48-hour deployment, no rip-and-replace)
Enterprise offer: Enterprise License (unlimited agents, dedicated governance layer)

════════════════════════════════════════
REGULATORY DRIVERS
OCC Circular 2023-17 — NA financial services, CRO/CCO audience
EU AI Act (Feb 2026 enforcement) — UK + Western Europe, CCO/CRO audience
MAS TRM / APRA CPS 230 — APAC financial services, CIO audience

Helix AI · GTM Context Engine · Generated from Canonical GTM Model`;

  dlFile('sdr_brief_' + campaignName.replace(/\s+/g,'_').toLowerCase() + '.txt', brief, 'text/plain');
  _addSAActivity('Downloaded SDR Brief (' + campaignName + ').');
  showToast('SDR Brief downloaded');
}

// ─── ACTIVATION CSV ────────────────────────────────────────────
function downloadActivationCsv() {
  const header = 'Contact Name,Title,Company,Email,Region,Persona,BC Role,Offer,Regulatory Driver,Segment,Sequence,Score,SF Campaign,Outreach Status,CRM Status,Next Best Action,Opening Line';
  const rows = SA_CONTACTS.map(c => [
    c.name, c.title, c.company,
    c.name.toLowerCase().replace(' ','.') + '@' + c.company.toLowerCase().replace(/\s+/g,'') + '.com',
    c.region, c.persona, c.bcRole, c.offer, c.driver, c.segment, c.seq, c.score,
    'AgentOps Q1 Launch — Parent', SA.outreachSynced ? 'Synced' : c.outreachStatus, c.status,
    'Enroll in sequence · verify BC coverage · check single-thread risk',
    c.opening.replace(/,/g,';')
  ].map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n');
  dlFile('activation_queue.csv', header + '\n' + rows, 'text/csv');
  _addSAActivity('Downloaded Activation CSV (38 contacts).');
  showToast('Downloaded activation_queue.csv');
}

// ─── REGENERATE QUEUE ──────────────────────────────────────────
function _saRegenQueue() {
  openModal('Regenerate Activation Queue', `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2); line-height:1.55;">
      This will re-score all contacts using the current Campaign DNA and Canonical Model v${CM.versionNum || 1}.
    </div>
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; margin-bottom:16px; font-size:12px; color:var(--txt2); line-height:1.8;">
      • Re-evaluate ICP match scores against latest persona definitions<br>
      • Re-apply segment rules from Canonical Model<br>
      • Re-assign sequences based on updated persona confidence<br>
      • Re-flag single-threaded account risks
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal();_runSaRegen();">Regenerate Queue</button>
    </div>`);
}

function _runSaRegen() {
  runProcessing('Queue Regeneration', 'Regenerating Activation Queue', [
    'Reading Canonical GTM Model…',
    'Re-scoring 75 contacts against ICP definitions…',
    '38 contacts matched — applying updated segments…',
    'Re-assigning sequences by persona confidence…',
    'Flagging single-threaded account risks…',
    'Queue ready.',
  ], () => {
    _initSA();
    _addSAActivity('Queue regenerated from Canonical Model v' + (CM.versionNum || 1) + '.');
    showToast('Activation queue regenerated');
  });
}

// ─── SYNC TO CRM ──────────────────────────────────────────────
function _saSync() {
  openModal('Sync to CRM', `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2); line-height:1.55;">
      Sync activation context to Salesforce for all 38 contacts.
    </div>
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; margin-bottom:16px; font-size:12px; color:var(--txt2); line-height:1.8;">
      • Write canonical persona tag to Contact record<br>
      • Write buying committee role to Campaign Member<br>
      • Write offer assignment to Campaign Member custom field<br>
      • Write regulatory driver to Contact custom field<br>
      • Write ICP match score to Lead Score field
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal();_runSaSync();">Sync to Salesforce</button>
    </div>`);
}

function _runSaSync() {
  runProcessing('CRM Sync', 'Syncing to Salesforce', [
    'Connecting to Salesforce API…',
    'Writing persona tags to 38 Contact records…',
    'Updating Campaign Member fields (role, offer, driver)…',
    'Writing ICP match scores…',
    'Sync complete — 38 records updated.',
  ], () => {
    SA.crmSynced = true;
    _addSAActivity('Synced 38 contacts to Salesforce (persona, role, offer, driver, score).');
    showToast('38 contacts synced to Salesforce');
  });
}
// ─── INSTITUTIONAL MEMORY STATE ────────────────────────────────
const IM = { activity: [], recGenerated: false, campaign2Created: false };

const IM_MEMORY_CARDS = {
  'model-version': { title:'Model Version', what:'The current version of the Canonical GTM Model. Increments each time execution results are fed back and confidence scores update.', source:'Set during Foundation Setup. Incremented by Analytics feedback loop.', usedIn:'All downstream workstreams reference the model version for traceability.' },
  'campaigns':     { title:'Campaigns Processed', what:'Number of campaigns that have run through the full Helix workflow and fed results back to the model.', source:'Incremented each time Analytics → Feed Results Back is completed.', usedIn:'Model confidence calculation. Recommendation engine weighting. Institutional Memory summary.' },
  'personas':      { title:'Personas Validated', what:'Canonical personas whose pain definitions, offer affinities, and messaging angles have been confirmed by actual campaign execution data.', source:'Canonical GTM Model persona library, validated by Gong calls + win/loss outcomes.', usedIn:'All sequences, asset generation, contact scoring, SDR briefs, Snowflake dimensions.' },
  'mappings':      { title:'Mappings Validated', what:'Canonical field mappings (Salesforce, Marketo, Outreach) that have been reviewed, approved, and used in at least one live campaign without revision.', source:'Canonical Model → Field Mapping Review. Confidence increases with each campaign that uses a mapping without change.', usedIn:'Salesforce campaign setup, Marketo token injection, Outreach sequence assignment, Snowflake canonical table.' },
  'segments':      { title:'Segments Validated', what:'Audience segment templates with confirmed contact counts, geo filters, and targeting rules — ready to apply to any future campaign without re-derivation.', source:'ICP Document + CRM contact matching. Validated by actual campaign member enrollment.', usedIn:'Campaign audience targeting, contact scoring, SDR queue filtering, PowerBI segment performance.' },
  'offers':        { title:'Offers Validated', what:'Canonical offers (Readiness Assessment, 30-Day Pilot, Enterprise License) with confirmed funnel stage assignments, qualification gates, and conversion rates.', source:'GTM launch deck offer catalog. Validated by campaign conversion data.', usedIn:'Sequence assignment, asset generation, contact scoring, pipeline attribution.' },
  'governance':    { title:'Governance Rules Active', what:'11 governance rules that enforce naming conventions, cross-system field consistency, picklist alignment, and data quality standards across all campaigns.', source:'Derived during Org Discovery. Approved during Review & Approve. Permanent across all campaigns.', usedIn:'All asset generation, campaign setup, contact export, and CRM sync operations.' },
  'snowflake':     { title:'Snowflake Dims Published', what:'8 canonical dimensions published to the Snowflake HELIX_CANONICAL_GTM table — the authoritative analytics source for all downstream reporting.', source:'Canonical Model dimensions. Published during Analytics & Execution setup.', usedIn:'PowerBI semantic model, metric lineage, pipeline attribution, Gong signal mapping.' },
  'confidence':    { title:'Model Confidence', what:'Overall confidence score across all validated personas, mappings, segments, and offers. Starts at 94% after Campaign 1. Increases with each campaign.', source:'Weighted average of individual confidence scores across the canonical model. Updated by each Analytics feedback cycle.', usedIn:'Recommendation engine, risk flagging, required review identification.' },
};

const IM_IMPROVEMENTS = {
  'cro-confidence': { title:'CRO Persona Confidence', before:'91%', after:'97%', evidence:[
    '12 Gong calls with "audit trail" language mapped to CRO pain point',
    '8 closed opportunities, $1.8M pipeline attributed to CRO persona',
    '47 SQLs from CRO sequence — highest volume of any persona',
    'OCC Circular 2023-17 confirmed as primary urgency driver in 9 of 12 calls',
    'CRO sequence touch 1 open rate: 38% — above 30% benchmark',
  ]},
  'cco-driver': { title:'EU AI Act Regulatory Driver', before:'82%', after:'94%', evidence:[
    '9 Gong calls with EU AI Act enforcement language — highest-converting EU signal',
    '6 EU opportunities in Proposal/Negotiation stage tied to EU AI Act urgency',
    'CCO EU AI Act sequence: 34% open rate, 19 meetings booked',
    'EU AI Act deadline urgency confirmed as primary conversion driver for EU deals',
    'Citadel Financial and Meridian Capital both cite enforcement deadline in calls',
  ]},
  'offer-fit': { title:'Readiness Assessment Offer Fit', before:'74%', after:'88%', evidence:[
    '34% assessment-to-pilot conversion rate — above 25% target',
    'Assessment used as entry offer for CRO, CCO, and CIO personas',
    'Confirmed free-trial positioning reduces initial objection in 80% of first calls',
    'Readiness Assessment → 30-Day Pilot conversion tracked across 5 accounts',
    'Assessment offer referenced positively in 7 of 9 CCO Gong calls',
  ]},
  'cco-sequence': { title:'CCO EU AI Act Sequence', before:'Unvalidated', after:'Proven', evidence:[
    '5-touch EU AI Act sequence completed full cycle: 9 contacts enrolled',
    '19 meetings booked from CCO sequence — 2nd highest by persona',
    'Reply rate: 29% — above benchmark for enterprise 5-touch cadences',
    'Touch 1 subject line "6-week AI audit" confirmed as highest-converting opener',
    'Sequence pattern reusable for Q2 EU expansion with same buyer profile',
  ]},
  'bc-gaps': { title:'Account Coverage Gap Discovery', before:'Unknown', after:'Mapped', evidence:[
    '3 accounts identified as single-threaded (Global Trust Bank, Meridian Capital, Pacific Mutual)',
    'Global Trust Bank: only CIO covered — CCO, CRO, CTO missing',
    'Meridian Capital: only CRO covered — CIO, Head of CX missing',
    'Missing contacts flag now built into SDR queue and account panel logic',
    'Buying committee coverage gaps surface automatically in future campaigns',
  ]},
  'gong-signals': { title:'Gong Signals Mapped to Model', before:'0 mappings', after:'42 mappings', evidence:[
    '5 signal clusters identified: audit trail, EU AI Act, shadow AI, 48hr deploy, consolidation ROI',
    '"Consolidation ROI" is a new signal not in Campaign 1 DNA — recommended for Q2 addition',
    '42 canonical mappings from Gong call topics to canonical_persona and canonical_regulatory_driver',
    'Gong signals now inform sequence subject line A/B test recommendations',
    '"audit trail" signal in CRO calls increases OCC urgency confidence by +3%',
  ]},
};

const IM_REVIEW_ITEMS = {
  'vp-nurture':      { title:'VP Nurture Segment Underperforming', detail:'VP Nurture had the lowest email open rate (18%) and weakest offer response of all 6 segments. Current offer assignment (Readiness Assessment) may not be correct for this audience.', severity:'amber', actions:['Revise offer assignment for VP Nurture → try Enterprise License positioning', 'Review messaging angle — move from urgency to ROI framing', 'Reduce cadence from 5-touch to 3-touch for VP audience'] },
  'cto-confidence':  { title:'CTO Persona — Low Sample Size', detail:'Only 2 closed opportunities with CTO attribution. Win rate of 22% is below 30% threshold for high-confidence persona validation. 3–5 more closed deals needed before CTO motion can be fully trusted.', severity:'amber', actions:['Add 3–5 CTO contacts to Q2 activation queue for validation', 'Hold CTO-specific asset variants for now — reuse CIO assets', 'Flag CTO persona as "provisional" in model until Q2 data returns'] },
  'procurement-bc':  { title:'Procurement Buying Committee Role Missing', detail:'No Procurement contacts were targeted or enrolled in Campaign 1. Enterprise deals may stall if Procurement is involved in approval but not engaged. This gap is likely slowing 2 active Negotiation-stage deals.', severity:'red', actions:['Identify Procurement contacts at Global Trust Bank and Meridian Capital', 'Add Procurement persona to Q2 buying committee map', 'Create Procurement-specific sequence: 3-touch, vendor qualification focus'] },
  'q2-budget':       { title:'Q2 Customer Budget Cycles Unknown', detail:'No data on when target accounts run Q2 budget planning cycles. Timing of outreach relative to budget approval could significantly affect conversion. Need updated ICP assumptions for Q2 timing.', severity:'amber', actions:['Add budget cycle timing to ICP document for Q2 campaign', 'Segment contacts by fiscal year type (calendar vs. April–March)', 'Adjust sequence launch timing based on fiscal year data'] },
  'apac-confidence': { title:'APAC Win Rate Below Threshold', detail:'CIO (28%) and CTO (22%) win rates in APAC are below the 30% threshold seen in NA and EU. The longer deal cycle in APAC may require motion revision — assessment offer may not create sufficient urgency.', severity:'amber', actions:['Review APAC regulatory messaging — MAS TRM vs APRA CPS 230 framing', 'Test alternative offer sequence: skip Assessment, lead with 30-Day Pilot', 'Add APAC-specific Gong review to identify missing urgency signals'] },
  'pilot-conversion':{ title:'Pilot-to-License Conversion Rate Unknown', detail:'30-Day Pilot → Enterprise License upsell rate has not been measured. This is a critical transition in the funnel and its unknown state means deal size projections may be inaccurate.', severity:'amber', actions:['Flag all current 30-Day Pilot accounts for post-pilot tracking in Salesforce', 'Create Pilot Completion opportunity stage in SF to track conversion', 'Add conversion rate metric to Analytics workspace Snowflake model'] },
};

function _initIM() {
  const vEl = document.getElementById('im-model-version');
  if (vEl) vEl.textContent = CM.versionNum || 1;
  _addIMActivity('Institutional Memory workspace initialized. Model v' + (CM.versionNum || 1) + ' · 94% confidence · 1 campaign processed.');
  const logEl = document.getElementById('im-activity-log');
  if (logEl) logEl.style.display = '';
}

function _addIMActivity(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  IM.activity.unshift({ ts, msg });
  _renderIMLog();
}

function _renderIMLog() {
  const el = document.getElementById('im-log-entries');
  if (!el) return;
  el.innerHTML = IM.activity.slice(0, 10).map(e =>
    `<div style="padding:5px 0; border-bottom:1px solid var(--border); display:flex; gap:10px;">
       <span style="flex-shrink:0; color:var(--txt3);">${e.ts}</span>
       <span style="color:var(--txt2);">${e.msg}</span>
     </div>`
  ).join('');
}

// ─── MEMORY CARD MODAL ─────────────────────────────────────────
function openMemoryCard(key) {
  const c = IM_MEMORY_CARDS[key];
  if (!c) return;
  openModal(c.title, `
    <div style="display:flex; flex-direction:column; gap:10px; font-size:12px; margin-bottom:14px;">
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">What This Means</div><div style="color:var(--txt2); line-height:1.55;">${c.what}</div></div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Where It Came From</div><div style="color:var(--txt2); line-height:1.55;">${c.source}</div></div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Where It Is Used</div><div style="color:var(--txt2); line-height:1.55;">${c.usedIn}</div></div>
    </div>
    <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal()">Close</button>`);
  _addIMActivity('Opened memory card: ' + c.title);
}

// ─── IMPROVEMENT EVIDENCE MODAL ────────────────────────────────
function openImprovementEvidence(key) {
  const item = IM_IMPROVEMENTS[key];
  if (!item) return;
  openModal('Evidence: ' + item.title, `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px; padding:10px 12px; background:var(--surface2); border-radius:6px;">
      <div style="text-align:center;">
        <div style="font-size:22px; font-weight:800; color:var(--txt3); text-decoration:line-through;">${item.before}</div>
        <div style="font-size:10px; color:var(--txt3);">Before</div>
      </div>
      <div style="font-size:20px; color:var(--txt3);">→</div>
      <div style="text-align:center;">
        <div style="font-size:22px; font-weight:800; color:var(--green);">${item.after}</div>
        <div style="font-size:10px; color:var(--txt3);">After Campaign 1</div>
      </div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Evidence</div>
      ${item.evidence.map(e => `<div style="display:flex; gap:8px; padding:5px 0; border-bottom:1px solid var(--border); font-size:12px; color:var(--txt2);"><span style="color:var(--green); flex-shrink:0;">✓</span><span>${e}</span></div>`).join('')}
    </div>
    <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal()">Close</button>`);
  _addIMActivity('Reviewed improvement evidence: ' + item.title);
}

// ─── REVIEW ITEM MODAL ─────────────────────────────────────────
function openReviewItem(key) {
  const item = IM_REVIEW_ITEMS[key];
  if (!item) return;
  openModal('Review: ' + item.title, `
    <div style="margin-bottom:14px; font-size:12px; color:var(--txt2); line-height:1.6; padding:10px 12px; background:var(--surface2); border-radius:6px;">${item.detail}</div>
    <div style="margin-bottom:14px;">
      <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Recommended Actions</div>
      ${item.actions.map(a => `<div style="display:flex; gap:8px; padding:5px 0; border-bottom:1px solid var(--border); font-size:12px; color:var(--txt2);"><span style="color:var(--accent); flex-shrink:0;">→</span><span>${a}</span></div>`).join('')}
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Marked for review in Q2 plan');_addIMActivity('Flagged for review: ${item.title.replace(/'/g,"\\'")}');">Create Task</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Item ignored');_addIMActivity('Ignored review item: ${item.title.replace(/'/g,"\\'")}');">Ignore</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="closeModal();showToast('Resolved — will carry into Q2 campaign');_addIMActivity('Resolved: ${item.title.replace(/'/g,"\\'")}');">Resolve</button>
    </div>`);
  _addIMActivity('Opened review item: ' + item.title);
}

// ─── GENERATE RECOMMENDED CAMPAIGN ────────────────────────────
function generateRecommendedCampaign() {
  runProcessing('Recommendation Engine', 'Generating Campaign Recommendation', [
    'Reading Campaign 1 results...',
    'Analyzing SDR activation performance...',
    'Reviewing Gong signal clusters...',
    'Evaluating offer conversion rates...',
    'Checking segment quality scores...',
    'Identifying next best motion...',
    'Generating Q2 recommendation...',
  ], () => {
    IM.recGenerated = true;
    const card = document.getElementById('im-rec-card');
    if (card) {
      card.style.display = '';
      card.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    _addIMActivity('Recommendation generated: AgentOps Platform Expansion — Q2 · 89% confidence.');
    showToast('Recommendation ready — 89% confidence');
  });
}

// ─── RECOMMENDATION ACTIONS ────────────────────────────────────
function _imCreateFromRec() {
  openModal('Create Campaign From Recommendation', `
    <div style="margin-bottom:12px; font-size:13px; color:var(--txt2);">Pre-filled from Helix recommendation. Edit any field before creating.</div>
    <div style="display:flex; flex-direction:column; gap:9px; margin-bottom:16px;">
      ${[
        ['Campaign Name', 'im-c2-name', 'AgentOps Platform Expansion — Q2'],
        ['Quarter', 'im-c2-quarter', 'Q2 2026'],
        ['Product', 'im-c2-product', 'AgentOps Platform'],
        ['Motion', 'im-c2-motion', 'Customer Expansion'],
        ['Objective', 'im-c2-objective', 'Expand into adjacent business units with existing customers'],
        ['Target Segment', 'im-c2-segment', 'Existing customers with active AI programs · EU + UK'],
        ['Primary Persona', 'im-c2-persona', 'CIO'],
        ['Offer', 'im-c2-offer', '30-Day Pilot'],
      ].map(([label, id, val]) => `
        <div>
          <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:3px;">${label}</label>
          <input id="${id}" value="${val}" style="width:100%; padding:6px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:12px; box-sizing:border-box;">
        </div>`).join('')}
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="_runCreateCampaign2()">Create Campaign</button>
    </div>`);
}

function _runCreateCampaign2() {
  const name = document.getElementById('im-c2-name')?.value || 'AgentOps Platform Expansion — Q2';
  closeModal();
  runProcessing('Campaign Creation', 'Creating Campaign 2', [
    'Inheriting canonical model context...',
    'Copying persona definitions...',
    'Loading segment templates...',
    'Applying governance rules...',
    'Creating campaign in workspace...',
  ], () => {
    IM.campaign2Created = true;
    const id = _newCampaign(name, 'Q2 2026', 'Northstar AgentOps', 'Customer Expansion', '$12M pipeline in 90 days');
    CAMPAIGNS[id].inherited = true;
    CAMPAIGNS[id].createdFrom = 'Institutional Memory Recommendation';
    CAMPAIGNS[id].inheritedConfidence = 94;
    _activateCampaign(id);
    _addIMActivity('Campaign 2 created from recommendation: ' + name);
    showToast('Campaign 2 created — add Q2 strategy documents to begin');
    createNextCampaign();
  });
}

function _imEditRec() {
  openModal('Edit Recommendation', `
    <div style="margin-bottom:12px; font-size:13px; color:var(--txt2);">Adjust the recommendation before creating a campaign.</div>
    <div style="display:flex; flex-direction:column; gap:9px; margin-bottom:16px;">
      ${[
        ['Campaign Name', 'im-edit-name', 'AgentOps Platform Expansion — Q2'],
        ['Primary Persona', 'im-edit-persona', 'CIO'],
        ['Secondary Persona', 'im-edit-persona2', 'CCO'],
        ['Offer', 'im-edit-offer', '30-Day Pilot'],
        ['Region', 'im-edit-region', 'EU + UK'],
        ['Expected Pipeline', 'im-edit-pipeline', '$12M'],
      ].map(([label, id, val]) => `
        <div>
          <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:3px;">${label}</label>
          <input id="${id}" value="${val}" style="width:100%; padding:6px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:12px; box-sizing:border-box;">
        </div>`).join('')}
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Recommendation updated');_addIMActivity('Edited recommendation.');">Save Changes</button>
    </div>`);
}

function _imExportRec() {
  const content = JSON.stringify({
    recommendedCampaign: 'AgentOps Platform Expansion — Q2',
    generatedAt: new Date().toISOString(),
    confidence: '89%',
    why: ['Existing customers showed high engagement with compliance automation content', 'CIO and CCO personas converted fastest', 'EU AI Act urgency increased in Gong conversations', 'Open opportunities suggest expansion into adjacent business units'],
    motion: 'Customer Expansion', primaryPersona: 'CIO', secondaryPersona: 'CCO',
    offer: '30-Day Pilot', region: 'EU + UK', segment: 'Existing customers with active AI programs',
    expectedPipeline: '$12M',
    inheritedContext: { modelVersion: 'v1.0', personasValidated: 6, mappingsValidated: 38, segmentsValidated: 6, governanceRules: 11 },
  }, null, 2);
  dlFile('helix_q2_recommendation.json', content, 'application/json');
  _addIMActivity('Exported recommendation: AgentOps Platform Expansion — Q2.');
  showToast('Downloaded helix_q2_recommendation.json');
  closeModal();
}

function _imRejectRec() {
  openModal('Reject Recommendation', `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2);">Rejecting this recommendation will hide it. You can generate a new one at any time.</div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn" style="background:var(--red);color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;cursor:pointer;" onclick="closeModal();document.getElementById('im-rec-card').style.display='none';_addIMActivity('Recommendation rejected.');showToast('Recommendation rejected');">Reject</button>
    </div>`);
}

// ─── MODEL HISTORY ─────────────────────────────────────────────
function openModelHistory() {
  openModal('Model History', `
    <div style="display:flex; flex-direction:column; gap:0; margin-bottom:14px;">
      ${[
        { v:'v1.0', label:'Campaign 1 — AgentOps Q1 Launch', status:'Complete', events:[
          'Ontology approved — 11 governance rules locked',
          'Campaign DNA extracted — 6 personas, 3 offers, 6 segments',
          'Canonical model published — 38 field mappings validated',
          'Assets generated — 24 assets across 8 systems',
          'Sales activated — 38 contacts, 6 sequences, 5 accounts',
          'Analytics executed — $4.2M pipeline, 105 SQLs, 62 meetings',
          'Results fed back to model — confidence updated to 94%',
          IM.recGenerated ? 'Recommendation generated — Q2 Platform Expansion · 89%' : null,
          IM.campaign2Created ? 'Campaign 2 created from recommendation' : null,
        ].filter(Boolean)},
        { v:'v1.1', label:'Campaign 2 — AgentOps Q2 (Planned)', status:'Planned', events:[
          'Inherit canonical model v1.0',
          'Upload Q2 strategy deck',
          'Extract updated Campaign DNA',
          'Validate model changes',
          'Generate assets with inherited context',
          'Projected model confidence: 97%',
        ]},
      ].map(c => `
        <div style="padding:12px; border-bottom:1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-size:12px; font-weight:700; color:var(--accent);">${c.v}</span>
            <span style="font-size:13px; font-weight:600; color:var(--txt);">${c.label}</span>
            <span class="badge ${c.status==='Complete'?'badge-green':'badge-amber'}" style="font-size:10px; margin-left:auto;">${c.status}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            ${c.events.map(e => `<div style="display:flex; gap:7px; font-size:11px; color:var(--txt3);"><span style="color:${c.status==='Complete'?'var(--green)':'var(--accent)'}; flex-shrink:0;">${c.status==='Complete'?'✓':'·'}</span><span>${e}</span></div>`).join('')}
          </div>
        </div>`).join('')}
    </div>
    <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal()">Close</button>`);
  _addIMActivity('Viewed model history.');
}

// ─── EXPORT MEMORY REPORT ──────────────────────────────────────
function exportMemoryReport() {
  const lines = [
    '=== HELIX AI — INSTITUTIONAL MEMORY REPORT ===',
    'Generated: ' + new Date().toLocaleString(),
    'Model Version: v' + (CM.versionNum || 1) + '.0',
    '',
    '--- MODEL SUMMARY ---',
    'Campaigns Processed: 1',
    'Model Confidence: 94%',
    'Personas Validated: 6 (CRO, CCO, CIO, CTO, VP AI, Head of CX)',
    'Field Mappings Validated: 38',
    'Segments Validated: 6',
    'Offers Validated: 3 (Readiness Assessment, 30-Day Pilot, Enterprise License)',
    'Governance Rules Active: 11',
    'Snowflake Dimensions Published: 8',
    '',
    '--- WHAT CARRIES FORWARD ---',
    'Foundation: CRM schema, MAP schema, Sales engagement schema, Naming conventions, Picklists, Governance rules',
    'Canonical Model: 6 personas, 3 offers, 6 segments, 38 field mappings, 3 regulatory drivers, 5 BC roles',
    'Execution: 6 sequence patterns, SDR openers, Account coverage logic, Contact scoring logic',
    'Analytics: 8 Snowflake dimensions, PowerBI semantic layer, 5 Gong signal clusters, Pipeline by persona/offer/region',
    '',
    '--- WHAT IMPROVED FROM CAMPAIGN 1 ---',
    'CRO persona confidence: 91% → 97% (12 Gong calls, 8 opps, $1.8M pipeline)',
    'EU AI Act regulatory driver: 82% → 94% (9 Gong calls, 6 EU opportunities)',
    'Readiness Assessment offer fit: 74% → 88% (34% assessment-to-pilot conversion)',
    'CCO EU AI Act sequence: Unvalidated → Proven (19 meetings, 29% reply rate)',
    'Account coverage gaps: Unknown → Mapped (3 single-threaded accounts identified)',
    'Gong signals: 0 → 42 canonical mappings (5 signal clusters)',
    '',
    '--- WHAT STILL NEEDS REVIEW ---',
    '⚠ VP Nurture segment underperforming — low open rate, weak offer response',
    '⚠ CTO persona — only 2 closed opps, needs more validation',
    '⚠ Procurement BC role not covered — may stall enterprise deals',
    '⚠ Q2 customer budget cycles unknown',
    '⚠ APAC win rate below threshold (22–28%)',
    '⚠ Pilot-to-license conversion rate unknown',
    '',
    '--- RECOMMENDATION ---',
    IM.recGenerated
      ? 'AgentOps Platform Expansion — Q2 | Confidence: 89%\nMotion: Customer Expansion | Persona: CIO + CCO | Offer: 30-Day Pilot | Region: EU + UK\nExpected Pipeline: $12M'
      : 'No recommendation generated yet. Run "Generate Recommended Campaign" to produce one.',
    '',
    '--- KEY LEARNINGS ---',
    'The first campaign is the most expensive to build. Every campaign after it starts from a higher baseline.',
    'Helix retained: ontology, canonical model, mappings, personas, segments, offers, governance rules, analytics feedback.',
    'Campaign 2 skips Foundation Setup, Org Discovery, and Ontology Review entirely.',
    'Model confidence compounds with each campaign cycle.',
    '',
    '=== END OF REPORT ===',
  ];
  dlFile('helix_memory_report.txt', lines.join('\n'), 'text/plain');
  _addIMActivity('Exported Memory Report (TXT).');
  showToast('Downloaded helix_memory_report.txt');
}

// ─── FEED MORE RESULTS ─────────────────────────────────────────
function feedMoreResults() {
  runProcessing('Model Feedback', 'Processing Additional Results', [
    'Reading new CRM opportunity outcomes...',
    'Reading new Sales Engagement reply data...',
    'Reading new call intelligence recordings...',
    'Updating persona confidence scores...',
    'Refreshing recommendation engine...',
  ], () => {
    _addIMActivity('Additional results processed. Model confidence updated. Recommendation engine refreshed.');
    showToast('Additional results processed — model updated');
    if (IM.recGenerated) {
      showToast('Recommendation confidence updated: 91%');
    }
  });
}
const AN = { activity: [], refreshedAt: null };

const AN_SYSTEMS = {
  salesforce: { name:'CRM', vendor:'e.g. Salesforce · HubSpot · Dynamics', icon:'☁', status:'Live', lastSync:'2 min ago', records:'9 campaigns · 38 contacts · 5 accounts', dims:'canonical_persona · canonical_offer · canonical_region · canonical_regulatory_driver', url:'salesforce.com/lightning/o/Campaign/list', color:'#00a1e0' },
  marketo:    { name:'Marketing Automation', vendor:'e.g. Marketo · HubSpot · Eloqua', icon:'◈', status:'Live', lastSync:'4 min ago', records:'6 programs · 24 tokens · 12 email assets', dims:'canonical_persona · canonical_segment · canonical_offer', url:'engage.marketo.com/programs', color:'#5c4ee5' },
  outreach:   { name:'Sales Engagement', vendor:'e.g. Outreach · Salesloft · Apollo', icon:'🔷', status:'Live', lastSync:'1 min ago', records:'6 sequences · 38 contacts enrolled · 134 replies', dims:'canonical_persona · canonical_bc_role · canonical_sequence', url:'app.outreach.io/sequences', color:'#ff6533' },
  snowflake:  { name:'Data Warehouse', vendor:'e.g. Snowflake · BigQuery · Redshift', icon:'❄', status:'Syncing', lastSync:'2 min ago', records:'38 rows in helix_canonical_gtm · 16 columns', dims:'All 8 canonical dimensions · join keys to CRM / MAP / Sales Engagement', url:'app.snowflake.com/HELIX_GTM.CANONICAL', color:'#29b5e8' },
  powerbi:    { name:'Business Intelligence', vendor:'e.g. PowerBI · Tableau · Looker', icon:'📊', status:'Live', lastSync:'5 min ago', records:'1 semantic model · 6 dimensions · 7 measures', dims:'Sourced from Data Warehouse helix_canonical_gtm via DirectQuery', url:'app.powerbi.com/groups/helix-demo/reports/gtm-performance', color:'#f2c811' },
  gong:       { name:'Conversation Intelligence', vendor:'e.g. Gong · Chorus · Clari', icon:'🎙', status:'Live', lastSync:'8 min ago', records:'47 calls tagged · 5 signal clusters · 42 canonical mappings', dims:'Mapped to canonical_persona · canonical_regulatory_driver · canonical_offer', url:'app.gong.io/deals', color:'#7c3aed' },
};

const AN_METRICS = {
  'cro-na':   { label:'CRO · Readiness Assessment · NA · OCC', pipeline:'$1.8M', sqls:47, meetings:28, winRate:'38%', avgDeal:'$224K', persona:'CRO', offer:'Readiness Assessment', region:'NA', driver:'OCC Circular 2023-17', bcRole:'Economic Buyer', sfOpps:8, mktoPrograms:2, outreachSeqs:1, gongCalls:12, formula:'SUM(Opportunity.Amount) WHERE canonical_persona = \'CRO\' AND canonical_offer = \'Readiness Assessment\' AND canonical_region = \'NA\'', dqNote:'High confidence — 8 closed opportunities, 47 SQLs, 12 tagged Gong calls. OCC driver confirmed in 9 of 12 calls.' },
  'cco-eu':   { label:'CCO · Readiness Assessment · EU · EU AI Act', pipeline:'$1.2M', sqls:31, meetings:19, winRate:'34%', avgDeal:'$193K', persona:'CCO', offer:'Readiness Assessment', region:'EU', driver:'EU AI Act', bcRole:'Economic Buyer', sfOpps:6, mktoPrograms:2, outreachSeqs:1, gongCalls:9, formula:'SUM(Opportunity.Amount) WHERE canonical_persona = \'CCO\' AND canonical_region = \'EU\' AND canonical_regulatory_driver = \'EU_AI_ACT\'', dqNote:'High confidence — 6 opportunities, 9 Gong calls confirm EU AI Act urgency. 2 deals in Proposal stage.' },
  'cio-apac': { label:'CIO · 30-Day Pilot · APAC · MAS/APRA', pipeline:'$0.8M', sqls:18, meetings:11, winRate:'28%', avgDeal:'$167K', persona:'CIO', offer:'30-Day Pilot', region:'APAC', driver:'MAS TRM / APRA CPS 230', bcRole:'Technical Buyer', sfOpps:4, mktoPrograms:1, outreachSeqs:1, gongCalls:8, formula:'SUM(Opportunity.Amount) WHERE canonical_persona = \'CIO\' AND canonical_offer = \'30-Day Pilot\' AND canonical_region = \'APAC\'', dqNote:'Moderate confidence — 4 opportunities. Win rate lower than NA/EU — APAC deals longer cycle. MAS TRM signal strong in 6/8 calls.' },
  'cto-apac': { label:'CTO · Enterprise License · APAC · MAS/APRA', pipeline:'$0.4M', sqls:9, meetings:4, winRate:'22%', avgDeal:'$156K', persona:'CTO', offer:'Enterprise License', region:'APAC', driver:'MAS TRM / APRA CPS 230', bcRole:'Technical Evaluator', sfOpps:2, mktoPrograms:1, outreachSeqs:1, gongCalls:7, formula:'SUM(Opportunity.Amount) WHERE canonical_persona = \'CTO\' AND canonical_offer = \'Enterprise License\' AND canonical_region = \'APAC\'', dqNote:'Lower confidence — 2 opportunities, small sample. CTO motion needs 3-5 more closed deals to validate win rate. Early signal positive.' },
};

const AN_SNOWFLAKE_COLS = {
  'canonical_persona':          { source:['Canonical GTM Model → Persona Library'], consumers:['PowerBI semantic model','Snowflake joins','Gong topic mapping'], examples:['CRO','CCO','CIO','CTO','VP AI'], usedIn:['Pipeline by Persona','SQL by Persona','Win Rate by Persona'] },
  'canonical_offer':            { source:['Canonical GTM Model → Offer Catalog'], consumers:['PowerBI semantic model','Salesforce campaign type mapping'], examples:['Readiness Assessment','30-Day Pilot','Enterprise License'], usedIn:['Pipeline by Offer','Conversion by Offer'] },
  'canonical_region':           { source:['ICP Document → Geography fields','Salesforce Account.BillingCountry'], consumers:['PowerBI','Snowflake segment rules'], examples:['NA','EU','APAC'], usedIn:['Pipeline by Region','Regulatory Driver lookup'] },
  'canonical_regulatory_driver':{ source:['Campaign DNA → Regulatory Hooks','Gong call topic tagging'], consumers:['PowerBI regulatory dimension','SDR brief generation'], examples:['OCC_2023_17','EU_AI_ACT','MAS_TRM','APRA_CPS_230'], usedIn:['Regulatory urgency metrics','Sequence assignment'] },
  'canonical_bc_role':          { source:['Buying Committee Map → DNA extraction','Salesforce Contact.Title heuristics'], consumers:['PowerBI BC Coverage measure','Sales activation context'], examples:['Economic Buyer','Technical Buyer','Champion','Technical Evaluator'], usedIn:['BC Coverage %','Single-thread risk flag'] },
  'sf_campaign_id':             { source:['Salesforce Campaign.Id (auto-sync)'], consumers:['Opportunity attribution','Marketo program sync'], examples:['7013x000002KJ8A','7013x000002KJ8B'], usedIn:['Campaign Influenced Pipeline','First-touch attribution'] },
  'opportunity_id':             { source:['Salesforce Opportunity.Id (auto-sync on stage change)'], consumers:['Pipeline metrics','Win rate calculation'], examples:['0063x000004zLmQ','0063x000004zLmR'], usedIn:['Pipeline Created','Closed Won','Win Rate'] },
};

const AN_BI_ITEMS = {
  dim: {
    persona:  { label:'Persona',               def:'Canonical buyer persona derived from Campaign DNA and validated by Gong signal. Maps to Salesforce Contact.Persona__c custom field.', source:'canonical_persona VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake → PowerBI DirectQuery', values:'CRO, CCO, CIO, CTO, VP AI, Head of CX', usage:'Pipeline by Persona · SQL by Persona · BC Coverage · Win Rate by Persona' },
    offer:    { label:'Offer',                 def:'Primary offer assigned to contact based on persona and funnel stage from Canonical GTM Model offer catalog.', source:'canonical_offer VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake → PowerBI DirectQuery', values:'Readiness Assessment, 30-Day Pilot, Enterprise License', usage:'Offer Conversion Rate · Pipeline by Offer · Assessment-to-Pilot Rate' },
    region:   { label:'Region',               def:'Geographic region from ICP definition, applied to contacts via Salesforce Account.BillingCountry lookup.', source:'canonical_region VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake → PowerBI DirectQuery · Salesforce Account', values:'NA, EU, APAC', usage:'Pipeline by Region · Regulatory Driver lookup · Sequence assignment' },
    segment:  { label:'Segment',              def:'Audience segment from Canonical GTM Model segment definitions. Applied to Campaign Members during contact scoring.', source:'canonical_segment VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake · Marketo segment membership', values:'NA Tier 1/2 CxO, UK/EU AI Act, APAC MAS/APRA, Open Pipeline, Customer, VP Nurture', usage:'Segment performance · Email open rate by segment' },
    driver:   { label:'Regulatory Driver',    def:'Primary regulatory driver matched to contact region and persona. Extracted from Campaign DNA regulatory hooks section.', source:'canonical_regulatory_driver VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake · Gong call topic tagging', values:'OCC_2023_17, EU_AI_ACT, MAS_TRM, APRA_CPS_230', usage:'Regulatory urgency conversion · Sequence subject line variant selection' },
    bc_role:  { label:'Buying Committee Role',def:'Buying committee role inferred from contact title using canonical BC map extracted from GTM deck slide 3.', source:'canonical_bc_role VARCHAR in HELIX_CANONICAL_GTM', systems:'Snowflake · Salesforce · Sales activation context', values:'Economic Buyer, Technical Buyer, Champion, Technical Evaluator, Procurement', usage:'BC Coverage % · Single-thread risk · Multi-thread recommendation' },
  },
  measure: {
    pipeline: { label:'Pipeline Created', def:'SUM of Opportunity.Amount for all Salesforce opportunities where campaign member touch exists within 90 days of opportunity create date.', source:'SUM(sf_opportunity_amount) WHERE campaign_influenced = TRUE', systems:'Salesforce Opportunity → Snowflake → PowerBI', value:'$4.2M', formula:'SUM(Opportunity.Amount) WHERE campaign_influenced_90d = TRUE GROUP BY canonical_dims' },
    sqls:     { label:'SQLs',             def:'Count of contacts reaching SQL stage in Salesforce, where at least one canonical campaign touch is recorded.', source:'COUNT(contact_id) WHERE sf_lead_status = SQL', systems:'Salesforce Contact/Lead → Snowflake → PowerBI', value:'105', formula:'COUNT(DISTINCT contact_id) WHERE sf_stage = SQL AND canonical_campaign IS NOT NULL' },
    meetings: { label:'Meetings Booked',  def:'Count of meetings booked via Outreach sequences mapped to canonical personas.', source:'COUNT(outreach_meeting_booked) JOIN canonical_persona', systems:'Outreach → Snowflake → PowerBI', value:'62', formula:'COUNT(outreach_meetings) WHERE sequence_id IN (SELECT seq_id FROM HELIX_CANONICAL_GTM)' },
    replies:  { label:'Sequence Replies', def:'Count of email replies from Outreach sequences, joined to canonical persona and offer via helix_canonical_gtm.', source:'COUNT(outreach_reply) JOIN canonical_persona', systems:'Outreach → Snowflake → PowerBI', value:'134', formula:'COUNT(outreach_replies) WHERE sequence_id IN helix_canonical_gtm.outreach_sequence_id' },
    winrate:  { label:'Win Rate',         def:'Closed Won / (Closed Won + Closed Lost) for opportunities with canonical campaign attribution.', source:'COUNT(Closed Won) / COUNT(Closed Won + Lost)', systems:'Salesforce → Snowflake → PowerBI', value:'34%', formula:'COUNT(stage=Closed Won) / COUNT(stage IN (Closed Won, Closed Lost)) WHERE canonical_campaign IS NOT NULL' },
    dealsize: { label:'Avg Deal Size',    def:'Average Opportunity.Amount for Closed Won deals with canonical campaign attribution.', source:'AVG(sf_opportunity_amount) WHERE stage = Closed Won', systems:'Salesforce → Snowflake → PowerBI', value:'$187K', formula:'AVG(Opportunity.Amount) WHERE stage = Closed Won AND canonical_campaign IS NOT NULL' },
  },
};

const AN_GONG_SIGNALS = {
  'audit-trail':      { signal:'"audit trail"', calls:12, accounts:['Global Trust Bank','Citadel Financial','First National Wealth','Pacific Mutual'], canonical:'Persona: CRO · Regulatory Driver: OCC Circular 2023-17', confImpact:'+3% confidence on CRO persona pain point', rec:'Increase OCC urgency framing in CRO sequence touch 1. Current subject line performance: 34% open rate. Recommend A/B test with "audit trail" language.' },
  'eu-ai-act':        { signal:'"EU AI Act enforcement"', calls:9, accounts:['Citadel Financial','European Capital Partners','Meridian Capital'], canonical:'Persona: CCO · Regulatory Driver: EU AI Act', confImpact:'+5% confidence on CCO regulatory driver', rec:'EU AI Act deadline urgency is the highest-converting signal in EU. Recommend front-loading enforcement date in all EU touches.' },
  'shadow-ai':        { signal:'"shadow AI"', calls:8, accounts:['Pacific Mutual Insurance','Meridian Capital','First National Wealth'], canonical:'Persona: CIO · Pain: Shadow AI governance gap', confImpact:'+4% confidence on CIO shadow AI pain point', rec:'CIO "shadow AI" signal converts well on touch 1. Keep current subject line. Recommend adding shadow AI inventory angle to touch 3 follow-up.' },
  '48hr-deploy':      { signal:'"48-hour deploy"', calls:7, accounts:['Citadel Financial','Pacific Mutual Insurance'], canonical:'Persona: CTO · Offer: 30-Day Pilot', confImpact:'+2% confidence on CTO deployment offer', rec:'48-hour deploy language reduces CTO objection on implementation complexity. Recommend adding to touch 2 for all CTO sequences.' },
  'consolidation-roi':{ signal:'"consolidation ROI"', calls:6, accounts:['Pacific Mutual Insurance','Meridian Capital'], canonical:'Persona: CIO/CTO · Offer: Enterprise License', confImpact:'New signal — not yet in model', rec:'Consolidation ROI is a new signal not in the current Campaign DNA. Recommend adding to CTO/CIO persona pain points for Q2 campaign.' },
};

function _initAN() {
  AN.refreshedAt = new Date();
  const ts = AN.refreshedAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const tsEl = document.getElementById('an-refresh-ts');
  const vEl  = document.getElementById('an-model-version');
  if (tsEl) tsEl.textContent = 'Last refreshed: ' + ts;
  if (vEl)  vEl.textContent  = CM.versionNum || 1;
  _addANActivity('Analytics workspace initialized. 6 systems connected · $4.2M pipeline · 105 SQLs.');
  const logEl = document.getElementById('an-activity-log');
  if (logEl) logEl.style.display = '';
}

function _addANActivity(msg) {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  AN.activity.unshift({ ts, msg });
  _renderANLog();
}

function _renderANLog() {
  const el = document.getElementById('an-log-entries');
  if (!el) return;
  el.innerHTML = AN.activity.slice(0, 10).map(e =>
    `<div style="padding:5px 0; border-bottom:1px solid var(--border); display:flex; gap:10px;">
       <span style="flex-shrink:0; color:var(--txt3);">${e.ts}</span>
       <span style="color:var(--txt2);">${e.msg}</span>
     </div>`
  ).join('');
}

function openSystemModal(sysId) {
  const s = AN_SYSTEMS[sysId];
  if (!s) return;
  openModal(s.name + ' — System Detail', `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
      <span style="font-size:28px;">${s.icon}</span>
      <div>
        <div style="font-size:15px; font-weight:700; color:var(--txt);">${s.name}</div>
        <div style="font-size:11px; color:var(--txt3); margin-bottom:4px;">${s.vendor || ''}</div>
        <span class="badge ${s.status==='Live'?'badge-green':'badge-amber'}" style="font-size:11px;">${s.status}</span>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:7px; font-size:12px; margin-bottom:14px;">
      <div><span style="color:var(--txt3);">Last Sync: </span><span style="color:var(--txt);">${s.lastSync}</span></div>
      <div><span style="color:var(--txt3);">Records Processed: </span><span style="color:var(--txt);">${s.records}</span></div>
      <div><span style="color:var(--txt3);">Canonical Dimensions: </span><span style="color:var(--accent); font-family:monospace; font-size:11px;">${s.dims}</span></div>
      <div><span style="color:var(--txt3);">Mock URL: </span><span style="color:var(--accent); font-family:monospace; font-size:11px;">${s.url}</span></div>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Reconnecting to ${s.name}...');_addANActivity('Reconnect initiated: ${s.name}');">Reconnect</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Sync log: ${s.name} — last 10 syncs successful');_addANActivity('Viewed sync log: ${s.name}');">View Sync Log</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="closeModal();_addANActivity('Opened ${s.name} (demo mode)');">Open ${s.name} ↗</button>
    </div>`);
  _addANActivity('Opened system detail: ' + s.name);
}

function openSnowflakeCol(col) {
  const c = AN_SNOWFLAKE_COLS[col];
  if (!c) return;
  openModal('Column Lineage: ' + col, `
    <div style="font-size:12px; font-family:monospace; color:var(--accent); background:var(--surface2); padding:7px 10px; border-radius:6px; margin-bottom:14px;">${col}</div>
    <div style="display:flex; flex-direction:column; gap:10px; font-size:12px; margin-bottom:14px;">
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Source Systems</div>${c.source.map(s=>'<div style="color:var(--txt2);">· '+s+'</div>').join('')}</div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Downstream Consumers</div>${c.consumers.map(s=>'<div style="color:var(--txt2);">· '+s+'</div>').join('')}</div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Example Values</div><div style="display:flex; flex-wrap:wrap; gap:4px;">${c.examples.map(v=>'<span style="padding:2px 6px; background:rgba(99,102,241,0.1); border-radius:3px; font-family:monospace; font-size:11px; color:var(--accent);">'+v+'</span>').join('')}</div></div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Used In Metrics</div>${c.usedIn.map(s=>'<div style="color:var(--txt2);">· '+s+'</div>').join('')}</div>
    </div>
    <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal()">Close</button>`);
  _addANActivity('Inspected Snowflake column: ' + col);
}

function openBIItem(type, id) {
  const item = AN_BI_ITEMS[type] && AN_BI_ITEMS[type][id];
  if (!item) return;
  const isM = type === 'measure';
  openModal((isM ? 'Measure: ' : 'Dimension: ') + item.label, `
    <div style="display:flex; flex-direction:column; gap:10px; font-size:12px; margin-bottom:14px;">
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Definition</div><div style="color:var(--txt2); line-height:1.55;">${item.def}</div></div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Snowflake Source</div><div style="font-family:monospace; font-size:11px; color:var(--accent); background:var(--surface2); padding:6px 8px; border-radius:4px;">${item.source}</div></div>
      <div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Source Systems</div><div style="color:var(--txt2);">${item.systems}</div></div>
      ${isM
        ? '<div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Formula</div><div style="font-family:monospace; font-size:11px; color:var(--accent); background:var(--surface2); padding:6px 8px; border-radius:4px; word-break:break-all;">'+item.formula+'</div></div><div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Current Value</div><div style="color:var(--green); font-weight:700;">'+item.value+'</div></div>'
        : '<div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Values</div><div style="color:var(--txt2);">'+item.values+'</div></div><div><div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Example Dashboard Usage</div><div style="color:var(--txt2);">'+item.usage+'</div></div>'
      }
    </div>
    <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal()">Close</button>`);
  _addANActivity('Inspected PowerBI ' + type + ': ' + item.label);
}

function openMetricLineage(key) {
  const m = AN_METRICS[key];
  if (!m) return;
  document.getElementById('an-lineage-title').textContent = 'Metric Lineage: ' + m.persona + ' · ' + m.offer;
  document.getElementById('an-lineage-body').innerHTML = `
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Metric Summary</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 12px; font-size:12px;">
        <div><span style="color:var(--txt3);">Pipeline: </span><span style="font-weight:700; color:var(--green);">${m.pipeline}</span></div>
        <div><span style="color:var(--txt3);">SQLs: </span><span style="color:var(--txt);">${m.sqls}</span></div>
        <div><span style="color:var(--txt3);">Meetings: </span><span style="color:var(--txt);">${m.meetings}</span></div>
        <div><span style="color:var(--txt3);">Win Rate: </span><span style="color:var(--txt);">${m.winRate}</span></div>
        <div><span style="color:var(--txt3);">Avg Deal: </span><span style="color:var(--txt);">${m.avgDeal}</span></div>
      </div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Canonical Dimensions</div>
      <div style="display:flex; flex-direction:column; gap:5px; font-size:12px;">
        <div><span style="color:var(--txt3);">Persona: </span><span style="color:var(--accent);">${m.persona}</span></div>
        <div><span style="color:var(--txt3);">Offer: </span><span style="color:var(--green);">${m.offer}</span></div>
        <div><span style="color:var(--txt3);">Region: </span><span style="color:var(--txt);">${m.region}</span></div>
        <div><span style="color:var(--txt3);">Regulatory Driver: </span><span style="color:var(--amber);">${m.driver}</span></div>
        <div><span style="color:var(--txt3);">BC Role: </span><span style="color:var(--txt);">${m.bcRole}</span></div>
      </div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Source Records</div>
      <div style="display:flex; flex-direction:column; gap:5px; font-size:12px;">
        <div><span style="color:var(--txt3);">Salesforce Opportunities: </span><span style="color:var(--txt);">${m.sfOpps}</span></div>
        <div><span style="color:var(--txt3);">Marketo Programs: </span><span style="color:var(--txt);">${m.mktoPrograms}</span></div>
        <div><span style="color:var(--txt3);">Outreach Sequences: </span><span style="color:var(--txt);">${m.outreachSeqs}</span></div>
        <div><span style="color:var(--txt3);">Gong Calls: </span><span style="color:var(--txt);">${m.gongCalls}</span></div>
      </div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:6px;">Calculation Logic</div>
      <div style="font-family:monospace; font-size:11px; color:var(--accent); background:var(--surface2); padding:8px 10px; border-radius:6px; line-height:1.6; word-break:break-all;">${m.formula}</div>
    </div>
    <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border);">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:6px;">Data Quality Notes</div>
      <div style="font-size:12px; color:var(--txt2); line-height:1.55;">${m.dqNote}</div>
    </div>
    <div>
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:8px;">Actions</div>
      <div style="display:flex; flex-direction:column; gap:7px;">
        <button class="btn btn-ghost" style="text-align:left;font-size:12px;" onclick="openSystemModal('salesforce');">Open Salesforce Records ↗</button>
        <button class="btn btn-ghost" style="text-align:left;font-size:12px;" onclick="openSnowflakeModel();">Open Snowflake Query ↗</button>
        <button class="btn btn-ghost" style="text-align:left;font-size:12px;" onclick="openPowerBIDashboard();">Open PowerBI Tile ↗</button>
        <button class="btn btn-ghost" style="text-align:left;font-size:12px;" onclick="exportMetricLineage();">Export Lineage ↓</button>
      </div>
    </div>`;
  document.getElementById('an-lineage-overlay').style.display = '';
  document.getElementById('an-lineage-drawer').style.display = '';
  _addANActivity('Opened metric lineage: ' + m.label);
}

function closeMetricLineage() {
  document.getElementById('an-lineage-overlay').style.display = 'none';
  document.getElementById('an-lineage-drawer').style.display = 'none';
}

function openGongSignal(id) {
  const g = AN_GONG_SIGNALS[id];
  if (!g) return;
  openModal('Gong Signal: ' + g.signal, `
    <div style="display:flex; flex-direction:column; gap:12px; font-size:12px; margin-bottom:16px;">
      <div><span style="color:var(--txt3);">Call Count: </span><span style="font-weight:700; color:var(--txt);">${g.calls} calls</span></div>
      <div>
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Accounts Mentioned</div>
        ${g.accounts.map(a=>'<div style="color:var(--txt2);">· '+a+'</div>').join('')}
      </div>
      <div>
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Mapped Canonical Object</div>
        <div style="color:var(--accent); font-family:monospace; font-size:11px; background:var(--surface2); padding:6px 8px; border-radius:4px;">${g.canonical}</div>
      </div>
      <div>
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Confidence Impact</div>
        <div style="color:var(--green);">${g.confImpact}</div>
      </div>
      <div>
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:4px;">Recommended Model Update</div>
        <div style="color:var(--txt2); line-height:1.55; padding:8px 10px; background:var(--surface2); border-radius:6px;">${g.rec}</div>
      </div>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();showToast('Signal ignored');_addANActivity('Ignored Gong signal: ${g.signal.replace(/'/g,"\\'")}');">Ignore</button>
      <button class="btn btn-ghost" style="font-size:12px;" onclick="closeModal();_anCreateRec();">Create Recommendation</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="closeModal();showToast('Signal accepted');_addANActivity('Accepted Gong signal: ${g.signal.replace(/'/g,"\\'")}');">Accept Signal</button>
    </div>`);
  _addANActivity('Inspected Gong signal: ' + g.signal);
}

function feedResultsBack() {
  openModal('Feed Results Back to Model', `
    <div style="margin-bottom:14px; font-size:13px; color:var(--txt2); line-height:1.55;">
      This will update confidence scores across the Canonical GTM Model using execution outcomes.
    </div>
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; margin-bottom:16px; font-size:12px; color:var(--txt2); line-height:1.8;">
      Confidence scores will be updated for:<br>
      • <strong>6 Personas</strong> — validated by Gong calls + win/loss data<br>
      • <strong>3 Offers</strong> — validated by conversion rates + sequence replies<br>
      • <strong>6 Segments</strong> — validated by email + pipeline performance<br>
      • <strong>3 Regulatory Drivers</strong> — validated by Gong topic frequency<br>
      • <strong>4 Campaign Motions</strong> — validated by meeting booking + SQL rates
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal();_runFeedBack();">Feed Results Back</button>
    </div>`);
}

function _runFeedBack() {
  runProcessing('Model Feedback', 'Feeding Results Back to Model', [
    'Reading Salesforce opportunity outcomes...',
    'Joining Outreach activity and reply data...',
    'Mapping Gong call topics to canonical personas...',
    'Updating Snowflake confidence scores...',
    'Refreshing PowerBI semantic layer...',
    'Updating Institutional Memory...',
  ], () => {
    setPhase(6);
    _addANActivity('Execution results fed back to Canonical Model. Confidence scores updated across 6 personas, 3 offers, 4 motions.');
    showToast('Model feedback applied — confidence scores updated');
    viewMemory();
  });
}

function _anCreateRec() {
  openModal('Create Recommendation', `
    <div style="margin-bottom:12px; font-size:13px; color:var(--txt2);">Create a recommendation based on analytics findings:</div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:4px;">Title</label>
      <input id="an-rec-title" placeholder="e.g. Increase CTO sequence touch 2 urgency" style="width:100%; padding:7px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:13px; box-sizing:border-box;">
    </div>
    <div style="margin-bottom:14px;">
      <label style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); display:block; margin-bottom:4px;">Detail</label>
      <textarea rows="3" id="an-rec-detail" placeholder="What should change and why..." style="width:100%; padding:7px 10px; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; color:var(--txt); font-size:13px; resize:vertical; box-sizing:border-box;"></textarea>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="var t=document.getElementById('an-rec-title').value||'untitled';closeModal();showToast('Recommendation saved');_addANActivity('Created recommendation: '+t);">Save Recommendation</button>
    </div>`);
}

function openPowerBIDashboard() {
  openModal('Demo Mode: PowerBI Dashboard', `
    <div style="text-align:center; margin-bottom:16px;">
      <div style="font-size:28px; margin-bottom:8px;">📊</div>
      <div style="font-size:14px; font-weight:600; color:var(--txt); margin-bottom:3px;">Helix GTM Performance</div>
      <div style="font-size:11px; color:var(--txt3);">Semantic Model: Helix Canonical GTM</div>
    </div>
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; font-size:12px; margin-bottom:14px;">
      <div style="margin-bottom:6px;"><span style="color:var(--txt3);">Dimensions: </span><span style="color:var(--txt);">Persona · Offer · Region · Segment · Regulatory Driver · BC Role</span></div>
      <div style="margin-bottom:6px;"><span style="color:var(--txt3);">Measures: </span><span style="color:var(--txt);">Pipeline · SQLs · Meetings · Replies · Win Rate · Avg Deal</span></div>
      <div><span style="color:var(--txt3);">Mock URL: </span><span style="font-family:monospace; font-size:11px; color:var(--accent);">app.powerbi.com/groups/helix-demo/reports/gtm-performance</span></div>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="if(navigator.clipboard)navigator.clipboard.writeText('app.powerbi.com/groups/helix-demo/reports/gtm-performance');showToast('URL copied');">Copy Mock URL</button>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>`);
  _addANActivity('Opened PowerBI Dashboard (demo mode).');
}

function openSnowflakeModel() {
  const query = 'SELECT canonical_persona, canonical_offer,\n       SUM(pipeline_created) AS pipeline,\n       COUNT(opportunity_id) AS opps\nFROM HELIX_GTM.CANONICAL.HELIX_CANONICAL_GTM\nGROUP BY 1, 2\nORDER BY pipeline DESC;';
  openModal('Demo Mode: Snowflake Model', `
    <div style="background:var(--surface2); border-radius:6px; padding:10px 12px; font-size:12px; margin-bottom:12px;">
      <div style="margin-bottom:4px;"><span style="color:var(--txt3);">Database: </span><span style="font-family:monospace; color:var(--accent);">HELIX_GTM</span></div>
      <div style="margin-bottom:4px;"><span style="color:var(--txt3);">Schema: </span><span style="font-family:monospace; color:var(--accent);">CANONICAL</span></div>
      <div><span style="color:var(--txt3);">Table: </span><span style="font-family:monospace; color:var(--accent);">HELIX_CANONICAL_GTM</span></div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--txt3); margin-bottom:6px;">Example Query</div>
      <pre style="background:var(--surface2); border-radius:6px; padding:10px 12px; font-size:11px; font-family:monospace; color:var(--accent); overflow-x:auto; white-space:pre-wrap; margin:0;">${query}</pre>
    </div>
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="if(navigator.clipboard)navigator.clipboard.writeText(this.closest('.modal-body,div').querySelector('pre').textContent);showToast('Query copied');">Copy Query</button>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>`);
  _addANActivity('Opened Snowflake model (demo mode).');
}

function refreshMetrics() {
  runProcessing('Metrics Refresh', 'Refreshing Analytics', [
    'Refreshing Salesforce opportunity data...',
    'Refreshing Marketo engagement data...',
    'Refreshing Outreach activity...',
    'Refreshing Gong call signals...',
    'Joining canonical dimensions in Snowflake...',
    'Updating PowerBI semantic model...',
  ], () => {
    _initAN();
    _addANActivity('Metrics refreshed across 6 connected systems.');
    showToast('Analytics refreshed');
  });
}

function downloadAnalyticsSchema() {
  const schema = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    snowflakeTable: { database:'HELIX_GTM', schema:'CANONICAL', table:'HELIX_CANONICAL_GTM' },
    canonicalDimensions: [
      { name:'canonical_persona', type:'VARCHAR', values:['CRO','CCO','CIO','CTO','VP AI','Head of CX'] },
      { name:'canonical_offer', type:'VARCHAR', values:['Readiness Assessment','30-Day Pilot','Enterprise License'] },
      { name:'canonical_region', type:'VARCHAR', values:['NA','EU','APAC'] },
      { name:'canonical_segment', type:'VARCHAR', values:['NA Tier 1/2 CxO','UK/EU AI Act','APAC MAS/APRA','Open Pipeline','Customer Expansion','VP Nurture'] },
      { name:'canonical_regulatory_driver', type:'VARCHAR', values:['OCC_2023_17','EU_AI_ACT','MAS_TRM','APRA_CPS_230'] },
      { name:'canonical_bc_role', type:'VARCHAR', values:['Economic Buyer','Technical Buyer','Champion','Technical Evaluator','Procurement'] },
    ],
    powerBIDimensions: ['canonical_persona','canonical_offer','canonical_region','canonical_segment','canonical_regulatory_driver','canonical_bc_role'],
    measures: [
      { name:'Pipeline Created', formula:'SUM(Opportunity.Amount) WHERE campaign_influenced_90d = TRUE' },
      { name:'SQLs', formula:'COUNT(DISTINCT contact_id) WHERE sf_stage = SQL' },
      { name:'Meetings Booked', formula:'COUNT(outreach_meetings) WHERE sequence_id IN helix_canonical_gtm' },
      { name:'Win Rate', formula:'COUNT(Closed Won) / COUNT(Closed Won + Closed Lost)' },
      { name:'Avg Deal Size', formula:'AVG(Opportunity.Amount) WHERE stage = Closed Won' },
    ],
    sourceSystems: ['Salesforce','Marketo','Outreach','Gong'],
    joinKeys: { sf:'sf_campaign_id · sf_contact_id · sf_opportunity_id', marketo:'marketo_program_id', outreach:'outreach_sequence_id', gong:'gong_call_id' },
  };
  dlFile('helix_analytics_schema.json', JSON.stringify(schema, null, 2), 'application/json');
  _addANActivity('Downloaded Analytics Schema (JSON).');
  showToast('Downloaded helix_analytics_schema.json');
}

function exportMetricLineage() {
  const header = 'Metric,Persona,Offer,Region,Driver,Pipeline,SQLs,Meetings,Win Rate,Avg Deal,SF Opps,Gong Calls,Formula';
  const rows = Object.values(AN_METRICS).map(m =>
    ['"'+m.label+'"', m.persona, m.offer, m.region, m.driver, m.pipeline, m.sqls, m.meetings, m.winRate, m.avgDeal, m.sfOpps, m.gongCalls, '"'+m.formula+'"'].join(',')
  ).join('\n');
  dlFile('helix_metric_lineage.csv', header + '\n' + rows, 'text/csv');
  _addANActivity('Exported Metric Lineage (CSV).');
  showToast('Downloaded helix_metric_lineage.csv');
}

  setPhase(0);
  _initOntologyUI();
  _initCampaignWorkspace();
});
