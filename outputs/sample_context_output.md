# Helix AI — Sample Context Extraction Output
## Source: Northstar AgentOps GTM Launch Deck
## Extracted: 2024-12-01 | Confidence: 84/100

---

## SECTION 1: EXECUTIVE SUMMARY

Northstar AI is launching Northstar AgentOps, an AI agent governance platform targeting enterprise financial services firms — specifically banks, insurance carriers, wealth management platforms, and fintech companies with $1B+ in annual revenue. The campaign, "Govern What You've Built," runs in Q1 and aims to generate 200 enterprise SQLs in 90 days by positioning agent governance as a strategic imperative driven by regulatory pressure (EU AI Act, OCC, FCA, MAS) and the business risk of ungoverned AI agent sprawl. The primary conversion offer is a free AI Agent Governance Readiness Assessment, with a 30-day pilot as the next stage and enterprise licenses ranging from $180K–$450K ARR as the end goal. The campaign is designed to land with Chief Risk Officers and Chief Compliance Officers on regulatory exposure, then expand to CIOs and CTOs on operational scale.

---

## SECTION 2: STRUCTURED CAMPAIGN CONTEXT

```json
{
  "campaign": {
    "name": "Govern What You've Built",
    "description": "Product launch campaign for Northstar AgentOps targeting enterprise financial services firms on AI agent governance, compliance, and ROI.",
    "company": "Northstar AI",
    "product": "Northstar AgentOps",
    "product_category": "AI Governance / MLOps / AIOps",
    "launch_quarter": "Q1",
    "campaign_type": "Product Launch / Demand Generation",
    "funnel_stages": ["Awareness", "Consideration"],
    "campaign_objectives": [
      "Generate 200 enterprise SQLs in 90 days [EXPLICIT]",
      "Achieve 30-day pilot conversion rate of 40% from Readiness Assessment [INFERRED]",
      "Drive 3 closed enterprise deals in Q1 [INFERRED]"
    ],
    "kpis": [
      "SQL volume: 200 in 90 days [EXPLICIT]",
      "Readiness Assessment bookings [EXPLICIT]",
      "Pilot program activations [INFERRED]",
      "Pipeline value created [INFERRED]"
    ],
    "primary_cta": "Book Readiness Assessment",
    "primary_cta_url": "northstar.ai/assess",
    "campaign_duration_days": 90,
    "campaign_tagline": "AI agent adoption will stall without governance, context, controls, and operating model readiness"
  },
  "icp": {
    "industries": ["Banking", "Insurance", "Wealth Management", "Fintech"],
    "sub_industries": [
      "Retail Banking", "Commercial Banking", "Investment Banking", "Private Banking",
      "P&C Insurance", "Life Insurance", "Asset Management", "Wealth Management",
      "Digital Banking", "Payments", "Regtech"
    ],
    "employee_count_min": 500,
    "employee_count_max": null,
    "revenue_min_usd": "1000000000",
    "revenue_max_usd": null,
    "geography": ["North America", "United Kingdom", "Western Europe", "Singapore", "Australia"],
    "excluded_geography": ["Africa", "LATAM", "Eastern Europe", "Russia"],
    "account_signals": [
      "Active AI initiative or AI agent deployment [INFERRED]",
      "Recent OCC model risk review [INFERRED]",
      "EU AI Act compliance project in progress [INFERRED]",
      "Enterprise AI budget > $5M [INFERRED]",
      "AI agent program announced publicly [INFERRED]"
    ],
    "technologies_used": [
      "LangChain [EXPLICIT]",
      "AutoGen [EXPLICIT]",
      "CrewAI [EXPLICIT]",
      "Proprietary agent frameworks [EXPLICIT]"
    ],
    "account_tier": "Tier 1 and Tier 2 [INFERRED]"
  },
  "buying_committee": {
    "primary_buyers": ["Chief Risk Officer", "Chief Compliance Officer", "CIO", "CTO"],
    "secondary_buyers": ["Head of Customer Experience", "VP Engineering", "VP AI/ML", "CISO"],
    "economic_buyer": "CIO or CRO [INFERRED]",
    "champion_profile": "Chief Risk Officer or Chief Compliance Officer [EXPLICIT]",
    "blocker_profile": "Procurement / Legal (contract complexity) or IT Security (data access concerns) [INFERRED]",
    "committee_size_estimate": 5
  },
  "personas": [
    {
      "persona_name": "CRO",
      "title_variations": ["Chief Risk Officer", "Head of Risk", "SVP Risk Management", "EVP Enterprise Risk"],
      "department": "Risk",
      "seniority": "C-Suite",
      "primary_pain": "Cannot produce regulatory audit trails for AI agents; exposure to OCC, FCA, MAS findings",
      "primary_value_prop": "Immutable audit logs and one-click regulatory evidence packages for any exam",
      "preferred_channel": "Executive roundtable, direct outbound, peer referral [INFERRED]",
      "messaging_angle": "Regulatory urgency — audit readiness and compliance cost avoidance"
    },
    {
      "persona_name": "CCO",
      "title_variations": ["Chief Compliance Officer", "VP Compliance", "Head of Compliance", "Director of Compliance"],
      "department": "Compliance",
      "seniority": "C-Suite",
      "primary_pain": "AI agents making decisions that cannot be explained or documented for regulators",
      "primary_value_prop": "6-week audit preparation reduced to 3 hours; zero compliance findings",
      "preferred_channel": "Industry events, compliance publications, direct outbound [INFERRED]",
      "messaging_angle": "Explainability and documentation — never fail an audit because of AI"
    },
    {
      "persona_name": "CIO",
      "title_variations": ["Chief Information Officer", "Chief Digital Officer", "Chief Data & AI Officer"],
      "department": "Technology",
      "seniority": "C-Suite",
      "primary_pain": "Agent sprawl across business units with no central inventory or governance framework",
      "primary_value_prop": "Complete agent inventory in 30 days; replaces 3-5 point solutions",
      "preferred_channel": "Analyst research, peer CIO community, CIO forums [INFERRED]",
      "messaging_angle": "Operational control and tool consolidation — one platform to govern everything"
    },
    {
      "persona_name": "CTO",
      "title_variations": ["Chief Technology Officer", "SVP Engineering", "VP of Technology"],
      "department": "Technology",
      "seniority": "C-Suite",
      "primary_pain": "No real-time visibility into agent performance, drift, or incident detection",
      "primary_value_prop": "48-hour time to first governance insight; SDK-based deployment in 14 days",
      "preferred_channel": "Technical conferences, developer communities, peer outreach [INFERRED]",
      "messaging_angle": "Speed to deployment and engineering-friendly integration"
    },
    {
      "persona_name": "VP AI",
      "title_variations": ["VP AI Strategy", "VP AI/ML", "Head of AI", "Director of AI", "Chief AI Officer"],
      "department": "Technology / AI Center of Excellence",
      "seniority": "VP",
      "primary_pain": "Cannot prove ROI from AI programs to justify continued investment",
      "primary_value_prop": "ROI attribution connecting agent actions to business outcomes; board-ready reporting",
      "preferred_channel": "AI-specific publications, LinkedIn, developer communities [INFERRED]",
      "messaging_angle": "Prove AI value to the board and unlock next budget cycle"
    }
  ],
  "pain_points": [
    "No inventory of AI agents running in production across the organization [EXPLICIT]",
    "Cannot produce regulatory audit trail for AI agent decisioning [EXPLICIT]",
    "No real-time monitoring or anomaly detection for agent behavior [EXPLICIT]",
    "Cannot prove ROI from AI agent programs to the board [EXPLICIT]",
    "Shadow AI — agents deployed outside central IT governance [EXPLICIT]",
    "EU AI Act, OCC, FCA, MAS compliance gap [EXPLICIT]",
    "Agent sprawl across business units with no coordination [EXPLICIT]",
    "3-5 fragmented tools required to approximate governance [EXPLICIT]",
    "Agent quality and hallucination risk damaging customer experience [EXPLICIT]",
    "6-12 month governance project timelines vs. fast-moving AI roadmaps [INFERRED]"
  ],
  "value_propositions": [
    "Complete AI agent inventory in 30 days [EXPLICIT]",
    "OCC/FCA/MAS compliant audit infrastructure out of the box [EXPLICIT]",
    "48-hour time to first governance insight [EXPLICIT]",
    "Full deployment in 14 days [EXPLICIT]",
    "One-click regulatory report generation [EXPLICIT]",
    "ROI attribution framework connecting agent activity to business outcomes [EXPLICIT]",
    "Replaces 3-5 point solutions — tool consolidation ROI [EXPLICIT]",
    "6-week audit prep reduced to 3 hours [EXPLICIT]",
    "$2.1M compliance cost avoidance [EXPLICIT]",
    "340% measured ROI on AI agent program [EXPLICIT]"
  ],
  "proof_points": [
    "73% of enterprise financial services firms running live AI agents in production [EXPLICIT]",
    "61% have no formal AI agent monitoring program [EXPLICIT]",
    "48% cannot produce complete audit trail for regulatory review [EXPLICIT]",
    "$4.2M average cost of AI-related compliance incident in financial services (2024) [EXPLICIT]",
    "Regional Bank: 100% agent inventory in 30 days, OCC review passed, $2.1M cost avoidance [EXPLICIT]",
    "Global Insurance Carrier: 6-week audit prep to 3 hours, 0 compliance findings [EXPLICIT]",
    "Wealth Management Platform: 340% ROI, 3x AI budget expansion [EXPLICIT]"
  ],
  "competitors": {
    "named_competitors": ["Aporia", "Weights & Biases", "Arize AI", "Fiddler AI", "Arthur AI"],
    "implied_competitors": [
      "MLOps tools (monitoring-only, no compliance)",
      "Observability vendors (no audit trail, no ROI)",
      "Compliance point solutions (no monitoring, no ROI)"
    ],
    "differentiation_claims": [
      "Only platform delivering agent inventory + monitoring + compliance + ROI together [EXPLICIT]",
      "Financial services specific — others are horizontal [EXPLICIT]",
      "14-day deployment vs. 6-12 month governance projects [INFERRED]"
    ]
  },
  "offers": {
    "primary_offer": "AI Agent Governance Readiness Assessment — free, 2-hour working session [EXPLICIT]",
    "secondary_offer": "30-Day Pilot Program — $0 for qualified enterprise accounts [EXPLICIT]",
    "enterprise_offer": "Enterprise License — unlimited agents, dedicated CS, SLA [EXPLICIT]",
    "offer_pricing": "$180K–$450K ARR for Enterprise License [EXPLICIT]",
    "offer_qualification_criteria": "Qualified enterprise accounts for pilot; enterprise accounts for license [EXPLICIT]"
  },
  "messaging": {
    "campaign_theme": "Govern What You've Built",
    "primary_headline": "AI Agents Are Running Your Business. Do You Know What They're Doing?",
    "supporting_messages": [
      "AI agent adoption will stall without governance infrastructure",
      "The regulatory clock is already ticking",
      "The enterprises that win will be the ones that deployed agents they could trust, prove, and scale",
      "One platform. One operating model. Complete governance."
    ],
    "proof_statements": [
      "$4.2M average compliance incident cost",
      "48-hour time to first insight",
      "340% ROI from AI agent program"
    ],
    "urgency_drivers": [
      "EU AI Act effective August 2026",
      "OCC model risk management guidance updated 2024",
      "FCA AI Strategy 2025",
      "Competitors already deploying at scale (JPMorgan 2,000+ agents)"
    ],
    "emotional_hooks": [
      "Flying blind with production agents",
      "Board accountability for AI governance",
      "First mover vs. late mover penalty",
      "The cost of inaction exceeds the cost of governance"
    ]
  },
  "sales_plays": [
    "Land with CRO/CCO on compliance risk, expand to CIO on scale [EXPLICIT]",
    "Consolidation ROI story for CIO/procurement personas [EXPLICIT]",
    "Regulatory urgency play: EU AI Act deadline, OCC model risk review [EXPLICIT]",
    "ROI proof play: use the 340% ROI and $2.1M cost avoidance stats for budget justification [INFERRED]",
    "Competitive displacement: 3-5 tools → 1 platform consolidation [INFERRED]"
  ],
  "regulatory_triggers": [
    "EU AI Act (effective August 2026) — Western Europe, Germany, France, Ireland [EXPLICIT]",
    "OCC Model Risk Management Guidance (updated 2024) — US Banking [EXPLICIT]",
    "FCA AI Strategy 2025 — United Kingdom [EXPLICIT]",
    "MAS AI Governance Framework — Singapore [EXPLICIT]",
    "BaFin AI Guidance — Germany [INFERRED]",
    "DORA (Digital Operational Resilience Act) — EU Financial Services [INFERRED]",
    "HKMA AI Governance — Hong Kong [INFERRED]",
    "FSC AI Framework — South Korea [INFERRED]",
    "CFPB AI Guidance — US Consumer Finance [INFERRED]"
  ],
  "campaign_channels": [
    "Executive roundtable / CxO events [INFERRED]",
    "Direct outbound (email + LinkedIn) [INFERRED]",
    "Webinar / virtual event [INFERRED]",
    "Industry conference sponsorship (e.g. Risk.net, FS-ISAC) [INFERRED]",
    "Content / thought leadership [INFERRED]",
    "Paid digital (LinkedIn, targeted trade publications) [INFERRED]"
  ],
  "content_assets_implied": [
    "AI Agent Governance Readiness Assessment (free offer) [EXPLICIT]",
    "EU AI Act compliance guide for financial services [INFERRED]",
    "OCC model risk review checklist [INFERRED]",
    "ROI calculator: AI governance cost vs. compliance incident cost [INFERRED]",
    "Case study: Regional Bank OCC review [EXPLICIT]",
    "Case study: Global Insurance Carrier audit reduction [EXPLICIT]",
    "Case study: Wealth Management ROI attribution [EXPLICIT]",
    "Competitive comparison whitepaper [INFERRED]",
    "AgentOps technical architecture overview [INFERRED]"
  ]
}
```

---

## SECTION 3: SALESFORCE CAMPAIGN HIERARCHY

```
PARENT CAMPAIGN
├── Name: Govern What You've Built — Q1 Launch
├── Type: Product Launch
├── Status: Planning
├── Start Date: 2025-01-06
├── End Date: 2025-03-31
├── Budgeted Cost: [MISSING — not stated in deck]
├── Description: Enterprise demand generation campaign for Northstar AgentOps targeting financial services CxOs on AI agent governance.

├── CHILD CAMPAIGN 1: AgentOps — North America — Demand Gen
│   ├── Type: Email
│   ├── Target Segment: Segment 1 (US/CA Tier 1 Financial Services CxO)
│   ├── Channel: Direct Outbound + Paid LinkedIn
│   └── Primary CTA: Book Readiness Assessment

├── CHILD CAMPAIGN 2: AgentOps — UK/Europe — Regulatory Urgency
│   ├── Type: Email
│   ├── Target Segment: Segment 2 (UK/EU Financial Services — EU AI Act)
│   ├── Channel: Direct Outbound + Regional Events
│   └── Primary CTA: EU AI Act Readiness Assessment

├── CHILD CAMPAIGN 3: AgentOps — APAC — MAS/FSC Compliance
│   ├── Type: Email
│   ├── Target Segment: Segment 3 (Singapore/Japan/South Korea CxO)
│   ├── Channel: Direct Outbound + Regional Events
│   └── Primary CTA: MAS Governance Readiness Assessment

├── CHILD CAMPAIGN 4: AgentOps — Existing Customers — Expansion
│   ├── Type: Other
│   ├── Target Segment: Segment 6 (Existing Customers — New BU Expansion)
│   ├── Channel: Customer Success + Executive Outreach
│   └── Primary CTA: AgentOps Enterprise Upgrade Call

└── CHILD CAMPAIGN 5: AgentOps — Open Opportunities — Acceleration
    ├── Type: Direct Mail / SDR Outreach
    ├── Target Segment: Contacts with Open Opportunities
    ├── Channel: SDR + AE Direct Outreach
    └── Primary CTA: Pilot Program Activation
```

**CSV Format:**
```
Campaign Name,Parent Campaign,Type,Status,Start Date,End Date,Description,Target Segment,Primary CTA
"Govern What You've Built — Q1 Launch",,Product Launch,Planning,2025-01-06,2025-03-31,"Q1 product launch for Northstar AgentOps",All Financial Services,Book Readiness Assessment
"AgentOps — North America — Demand Gen","Govern What You've Built — Q1 Launch",Email,Planning,2025-01-06,2025-03-31,"NA financial services CxO outbound",Segment 1,Book Readiness Assessment
"AgentOps — UK/Europe — Regulatory Urgency","Govern What You've Built — Q1 Launch",Email,Planning,2025-01-13,2025-03-31,"UK/EU AI Act urgency campaign",Segment 2,EU AI Act Readiness Assessment
"AgentOps — APAC — MAS/FSC Compliance","Govern What You've Built — Q1 Launch",Email,Planning,2025-01-20,2025-03-31,"APAC regulatory compliance campaign",Segment 3,MAS Governance Assessment
"AgentOps — Existing Customers — Expansion","Govern What You've Built — Q1 Launch",Other,Planning,2025-01-06,2025-03-31,"Customer expansion into new BUs",Segment 6,Enterprise Upgrade Call
"AgentOps — Open Opportunities — Acceleration","Govern What You've Built — Q1 Launch",Direct Mail,Planning,2025-01-06,2025-03-31,"Accelerate open pipeline with pilot offer",Open Opportunities,Pilot Program Activation
```

---

## SECTION 4: AUDIENCE SEGMENTS

```
SEGMENT 1: NA Financial Services — Tier 1 CxO
├── Description: Senior executives at large North American banks, insurers, and wealth management firms with active AI programs
├── Included Industries: Banking, Insurance, Wealth Management, Fintech
├── Included Sub-Industries: Retail Banking, Commercial Banking, P&C Insurance, Life Insurance, Asset Management
├── Included Personas: CRO, CCO, CIO, CTO
├── Included Job Titles: Chief Risk Officer, Chief Compliance Officer, CIO, CTO, Chief Digital Officer
├── Included Seniority Levels: C-Suite
├── Geography: North America (USA, Canada)
├── Employee Count Range: 1,000+
├── Revenue Range: $1B+
├── Account Signals Required: Active AI initiative OR AI agents in production
├── Exclusion Criteria: Employee Count < 500, Annual Revenue < $500M, Data Quality = Poor
├── Estimated Addressable Contacts: 18–25 in current CRM dataset
├── Recommended Offer: Readiness Assessment (free)
├── Recommended Channel: Direct outbound + executive events
└── Salesforce Segment Logic: Industry IN ('Banking','Insurance','Wealth Management','Fintech') AND Region = 'North America' AND Seniority = 'C-Suite' AND Employee_Count >= 1000 AND Annual_Revenue >= 1000000000

SEGMENT 2: UK/Europe — Regulatory Urgency (EU AI Act)
├── Description: Financial services CxOs in UK and Western Europe facing EU AI Act compliance deadlines
├── Included Industries: Banking, Insurance, Financial Services
├── Included Sub-Industries: Retail Banking, Commercial Banking, Life Insurance, P&C Insurance
├── Included Personas: CRO, CCO, CIO
├── Geography: United Kingdom, Western Europe (Germany, France, Sweden, Ireland, Netherlands, Switzerland, Norway)
├── Employee Count Range: 2,000+
├── Revenue Range: $1B+
├── Account Signals Required: EU AI Act compliance exposure
├── Exclusion Criteria: Region NOT IN EU/UK, Employee Count < 1000
├── Estimated Addressable Contacts: 12–18 in current CRM dataset
├── Recommended Offer: EU AI Act Readiness Assessment (free)
└── Salesforce Segment Logic: Region IN ('United Kingdom','Western Europe') AND Industry IN ('Banking','Insurance','Financial Services') AND Seniority = 'C-Suite' AND Employee_Count >= 2000

SEGMENT 3: APAC — MAS/FSC/FSA Compliance
├── Description: Financial services executives in Singapore, Japan, South Korea, and Australia facing MAS/FSC/FSA AI governance requirements
├── Included Industries: Banking, Financial Services, Insurance
├── Included Personas: CRO, CCO, CIO
├── Geography: Singapore, Japan, South Korea, Australia, Hong Kong
├── Employee Count Range: 1,000+
├── Revenue Range: $800M+
├── Exclusion Criteria: China (restricted market), Region = Africa/LATAM
├── Estimated Addressable Contacts: 8–12 in current CRM dataset
└── Salesforce Segment Logic: Region = 'APAC' AND Country IN ('Singapore','Japan','South Korea','Australia','Hong Kong') AND Industry IN ('Banking','Financial Services','Insurance') AND Seniority IN ('C-Suite','VP')

SEGMENT 4: Open Pipeline Acceleration
├── Description: Any contact with an active open opportunity in the CRM, regardless of other criteria
├── Included: All contacts with Open_Opportunity = TRUE
├── Recommended Offer: Pilot Program Activation
└── Salesforce Segment Logic: Open_Opportunity = TRUE AND Data_Quality_Status != 'Poor'

SEGMENT 5: Existing Customer Expansion
├── Description: Existing customers with potential to expand to new business units or upgrade to Enterprise license
├── Included: All contacts with Existing_Customer = TRUE
├── Recommended Offer: Enterprise Upgrade or New Module
└── Salesforce Segment Logic: Existing_Customer = TRUE

SEGMENT 6: Secondary Buyers — VP Level
├── Description: VP-level AI, Engineering, and Technology leaders at target accounts who influence the buying decision
├── Included Personas: VP AI, VP Engineering, VP Technology, Head of Digital
├── Included Seniority: VP, Director
├── Geography: All target regions
└── Salesforce Segment Logic: Seniority IN ('VP','Director') AND Department IN ('Technology','Engineering','AI/ML','Digital') AND Industry IN ('Banking','Insurance','Wealth Management','Fintech')
```

---

## SECTION 5: TARGETING RULES

**INCLUDE — Must match ALL:**
```
Industry IN ('Banking', 'Insurance', 'Wealth Management', 'Fintech', 'Financial Services') AND
Employee_Count >= 500 AND
Annual_Revenue >= 200000000 AND
Region IN ('North America', 'United Kingdom', 'Western Europe', 'APAC') AND
Data_Quality_Status != 'Poor' AND
Notes NOT CONTAINS 'DO NOT CONTACT' AND
Notes NOT CONTAINS 'Sanctioned'
```

**INCLUDE — Must match ANY ONE:**
```
Seniority = 'C-Suite' OR
Open_Opportunity = TRUE OR
(Engagement_Score >= 60 AND Seniority = 'VP') OR
Existing_Customer = TRUE
```

**EXCLUDE — Any of these = exclude:**
```
Data_Quality_Status = 'Poor' AND Open_Opportunity != TRUE OR
Email IS NULL OR Email CONTAINS '@@' OR
Country IN ('Russia', 'Nigeria', 'Ghana', 'Senegal') OR
Notes CONTAINS 'DO NOT CONTACT' OR
Notes CONTAINS 'Sanctioned' OR
Employee_Count < 500 AND Existing_Customer != TRUE OR
Annual_Revenue < 200000000 AND Existing_Customer != TRUE OR
Data_Quality_Status = 'Duplicate'
```

**PRIORITY SCORING:**
```
+30 pts: Industry IN ('Banking', 'Insurance', 'Wealth Management', 'Fintech')
+25 pts: Persona IN ('CRO', 'CCO', 'CIO', 'CTO')
+25 pts: Open_Opportunity = TRUE
+20 pts: Seniority = 'C-Suite'
+15 pts: Account_Tier = 'Tier 1'
+15 pts: Existing_Customer = TRUE
+15 pts: Annual_Revenue >= 5000000000
+15 pts: Engagement_Score >= 75
+10 pts: Region IN ('North America', 'United Kingdom')
+10 pts: Employee_Count >= 5000
+10 pts: Engagement_Score >= 50 AND < 75
+10 pts: Last_Campaign_Engagement within 60 days
+8 pts:  Account_Tier = 'Tier 2'
+8 pts:  Employee_Count >= 1000 AND < 5000
-10 pts: Last_Campaign_Engagement > 90 days ago
-15 pts: Data_Quality_Status = 'Incomplete'
-25 pts: Data_Quality_Status = 'Poor'
```

---

## SECTION 9: MISSING CONTEXT

| Missing Field | Impact | Recommended Resolution |
|---|---|---|
| Campaign budget | HIGH — cannot plan paid media or event spend | Request from campaign owner |
| Specific launch date | MEDIUM — Salesforce start date placeholder only | Confirm with campaign manager |
| Channel mix and spend allocation | HIGH — channel campaigns cannot be sized | Request media plan |
| Martech stack (Marketo vs. Eloqua vs. HubSpot) | HIGH — output format depends on MAP | Confirm with RevOps |
| Excluded competitor list (not to be named) | LOW — affects competitive messaging | Confirm with product marketing |
| Content calendar and asset delivery dates | MEDIUM — gating offers to readiness | Request from content team |
| SQL definition / MQL to SQL threshold | HIGH — cannot calibrate campaign goals | Confirm with sales ops |

---

## SECTION 11: CONFIDENCE SCORE

```
EXTRACTION CONFIDENCE REPORT
├── Overall Confidence Score: 84/100
├── ICP Completeness: 88/100
│   └── Strong on industry, size, geography; missing max size bounds and secondary tech signals
├── Persona Completeness: 86/100
│   └── 5 personas well-defined; CISO and Head of CX less developed
├── Messaging Clarity: 90/100
│   └── Campaign theme, headlines, and urgency drivers all explicit and strong
├── Offer Completeness: 92/100
│   └── Three-tier offer structure fully defined with pricing signal
├── Competitive Context: 75/100
│   └── Competitors named but competitive messaging is implicit, not explicit
├── Regional Specificity: 82/100
│   └── Good regional coverage but missing explicit country-level exclusions
└── Sales Play Clarity: 80/100
    └── Land/expand motion clear; missing specific SDR sequence and discovery question set

CONFIDENCE NARRATIVE: This GTM deck is exceptionally well-structured for AI extraction, with explicit ICP, persona, pain point, and offer data embedded throughout. The primary gaps are operational: missing campaign budget, martech stack confirmation, and SQL definition. The competitive and sales play context is present but would benefit from a companion sales playbook document for higher confidence on the outbound execution layer.
```
