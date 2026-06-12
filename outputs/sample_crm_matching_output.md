# Helix AI — Sample CRM Matching Output
## Source: Northstar AgentOps GTM Context + Fake CRM Dataset
## Processed: 2024-12-01 | Records Evaluated: 75

---

## SECTION 1: MATCHING SUMMARY

```
MATCHING SUMMARY
├── Total Contacts Evaluated: 75
├── Hard Excluded (compliance/quality): 6
│   ├── DO NOT CONTACT / Sanctioned: 2 (C-020, C-074)
│   ├── Missing critical fields (no email): 2 (C-051, C-009)
│   └── Hard quality failures: 2 (C-039, C-017)
│
├── Duplicates Identified: 3 pairs
│   ├── C-014 (duplicate of C-001)
│   ├── C-055 (duplicate of C-007)
│   └── C-037 (duplicate of C-009 — both excluded)
│
├── Below ICP Threshold (size, industry, geography): 14
├── Below Score Threshold (score < 30): 8
│
├── TARGET LIST SIZE (recommended): 38 contacts
│   ├── Tier 1 Targets (score ≥ 80): 16
│   ├── Tier 2 Targets (score 60–79): 14
│   └── Tier 3 Targets (score 30–59): 8
│
├── Accounts Represented: 32 unique accounts
├── Industries Covered: Banking (14), Insurance (8), Wealth Management (7), Fintech (5), Diversified Financial (4)
├── Regions Covered: North America (18), Western Europe (9), APAC (8), UK (2), MENA (2)
└── Open Opportunities Included: 11
```

---

## SECTION 2: TOP 20 RECOMMENDED CONTACTS

```
RANK 1 — Sarah Whitfield | Chief Compliance Officer | PrimeGuard Insurance
├── Contact ID: C-002
├── Match Score: 107/100 (multi-factor bonus)
├── Segment Assignment: Segment 1 (NA Financial Services — Tier 1 CxO)
├── Persona Match: CCO
├── Account Tier: Tier 1
├── Industry: Financial Services / P&C Insurance
├── Region: North America / USA
├── Open Opportunity: No
├── Existing Customer: No
├── Engagement Score: 92
├── Last Engagement: 2024-10-28 (44 days ago)
├── Recommended Offer: Readiness Assessment (free)
├── Salesforce Campaign Member Status: Responded
├── Match Reasons:
│   • Industry = Primary Target (+30)
│   • Persona = CCO / Primary Buyer (+25)
│   • Seniority = C-Suite (+20)
│   • Account Tier = Tier 1 (+15)
│   • Engagement Score = 92 (+20)
│   • Region = North America (+10)
│   • Last Engagement within 60 days (+10)
└── Notes: Attended webinar on EU AI Act — hot lead

RANK 2 — Marcus Chen | Chief Risk Officer | First Capital Bank
├── Contact ID: C-001
├── Match Score: 105/100
├── Segment Assignment: Segment 1 (NA Financial Services — Tier 1 CxO)
├── Persona Match: CRO
├── Account Tier: Tier 1
├── Industry: Financial Services / Retail Banking
├── Region: North America / USA
├── Open Opportunity: YES — Stage: Discovery
├── Existing Customer: No
├── Engagement Score: 87
├── Last Engagement: 2024-11-15 (16 days ago)
├── Recommended Offer: Pilot Program (fast-track due to open opp)
├── Salesforce Campaign Member Status: Open Opportunity
├── Match Reasons:
│   • Industry = Primary Target (+30)
│   • Persona = CRO / Primary Buyer (+25)
│   • Open Opportunity = TRUE (+25)
│   • Seniority = C-Suite (+20)
│   • Account Tier = Tier 1 (+15)
│   • Engagement Score = 87 (+20)
│   • Region = North America (+10)
└── Notes: Active opp in pipeline — prioritize for SDR acceleration

RANK 3 — Diane Reeves | Chief Risk Officer | Citadel Financial Corp
├── Contact ID: C-043
├── Match Score: 104/100
├── Segment Assignment: Segment 5 (Existing Customer Expansion)
├── Persona Match: CRO
├── Account Tier: Tier 1
├── Industry: Financial Services / Diversified
├── Region: North America / USA
├── Open Opportunity: YES — Stage: Closed Won
├── Existing Customer: YES
├── Engagement Score: 94
├── Last Engagement: 2024-11-18 (13 days ago)
├── Recommended Offer: Enterprise Upgrade / New BU Expansion
├── Salesforce Campaign Member Status: Customer
└── Notes: Closed customer renewing + expansion opportunity to new BU — highest priority existing account

RANK 4 — Andrew Fleming | Chief Risk Officer | Royal Sterling Bank
├── Contact ID: C-019
├── Match Score: 103/100
├── Segment Assignment: Segment 2 (UK/Europe — EU AI Act)
├── Persona Match: CRO
├── Account Tier: Tier 1
├── Industry: Banking / Retail Banking
├── Region: United Kingdom
├── Open Opportunity: YES — Stage: Discovery
├── Existing Customer: No
├── Engagement Score: 88
├── Last Engagement: 2024-11-08 (23 days ago)
├── Recommended Offer: FCA Governance Readiness Assessment
├── Salesforce Campaign Member Status: Open Opportunity
└── Notes: UK flagship target — FCA urgency angle; open opp active

RANK 5 — Michelle Torres | CIO | Global Trust Bank
├── Contact ID: C-006
├── Match Score: 102/100
├── Segment Assignment: Segment 1 (NA Financial Services — Tier 1 CxO)
├── Persona Match: CIO
├── Account Tier: Tier 1
├── Industry: Financial Services / Retail Banking
├── Region: North America / USA
├── Open Opportunity: YES — Stage: Negotiation
├── Existing Customer: YES
├── Engagement Score: 95
├── Last Engagement: 2024-11-20 (11 days ago)
├── Recommended Offer: AgentOps Enterprise (expansion)
├── Salesforce Campaign Member Status: Customer
└── Notes: Existing customer at Negotiation stage — highest urgency; AE should be leading

RANK 6 — Rebecca Sullivan | Chief Compliance Officer | Forum Financial Services
├── Contact ID: C-047
├── Match Score: 101/100
├── Segment Assignment: Segment 1 (NA Financial Services — Tier 1 CxO)
├── Persona Match: CCO
├── Account Tier: Tier 1
├── Industry: Financial Services / Wealth Management
├── Region: North America / USA
├── Open Opportunity: YES — Stage: Discovery
├── Existing Customer: No
├── Engagement Score: 86
├── Last Engagement: 2024-11-14 (17 days ago)
├── Recommended Offer: Readiness Assessment → Pilot
├── Salesforce Campaign Member Status: Open Opportunity
└── Notes: Strong pipeline candidate — CCO champion profile matches exactly

RANK 7 — David Strömberg | Chief Risk Officer | Nordic Bancorp
├── Contact ID: C-005
├── Match Score: 96/100
├── Segment Assignment: Segment 2 (UK/Europe — EU AI Act)
├── Persona Match: CRO
├── Account Tier: Tier 1
├── Industry: Banking / Commercial Banking
├── Region: Western Europe / Sweden
├── Open Opportunity: No
├── Existing Customer: No
├── Engagement Score: 71
├── Last Engagement: 2024-10-05 (57 days ago)
├── Recommended Offer: EU AI Act Readiness Assessment
├── Salesforce Campaign Member Status: Responded
└── Notes: EU AI Act urgency — Swedish market with MiFID II + AI Act overlay

RANK 8 — Thomas Becker | CIO | Deutsche Kommerzbank
├── Contact ID: C-027
├── Match Score: 94/100
├── Segment Assignment: Segment 2 (UK/Europe — EU AI Act)
├── Persona Match: CIO
├── Account Tier: Tier 1
├── Industry: Banking / Commercial Banking
├── Region: Western Europe / Germany
├── Open Opportunity: YES — Stage: Qualification
├── Existing Customer: No
├── Engagement Score: 79
├── Last Engagement: 2024-10-25 (37 days ago)
├── Recommended Offer: EU AI Act / BaFin Readiness Assessment
├── Salesforce Campaign Member Status: Open Opportunity
└── Notes: German market — BaFin + EU AI Act + DORA; open opp in qualification

RANK 9 — Tom Bergmann | Chief Technology Officer | Allegiant Bank
├── Contact ID: C-010
├── Match Score: 93/100
├── Segment Assignment: Segment 1 (NA Financial Services — Tier 1 CxO)
├── Persona Match: CTO
├── Account Tier: Tier 1
├── Industry: Financial Services / Retail Banking
├── Region: North America / USA
├── Open Opportunity: YES — Stage: Discovery
├── Existing Customer: No
├── Engagement Score: 82
├── Last Engagement: 2024-11-10 (21 days ago)
├── Recommended Offer: 30-Day Pilot Program
├── Salesforce Campaign Member Status: Open Opportunity
└── Notes: Discovery call scheduled for next week — hot

RANK 10 — Brian Donnelly | VP of AI Strategy | Atlantic Mutual
├── Contact ID: C-025
├── Match Score: 91/100
├── Segment Assignment: Segment 5 (Existing Customer Expansion)
├── Persona Match: VP AI
├── Account Tier: Tier 1
├── Industry: Financial Services / P&C Insurance
├── Region: North America / USA
├── Open Opportunity: No
├── Existing Customer: YES
├── Engagement Score: 80
├── Last Engagement: 2024-11-01 (30 days ago)
├── Recommended Offer: AI Governance Module upsell
├── Salesforce Campaign Member Status: Customer
└── Notes: Existing customer — VP AI Strategy is perfect expansion champion

RANK 11 — Christopher Nash | CTO | Liberty Financial Group
├── Contact ID: C-036
├── Match Score: 90/100
├── Segment: Segment 1 (NA Tier 1 CxO)
├── Persona Match: CTO | Open Opportunity: YES — Qualification
├── Engagement Score: 85 | Last Engagement: 2024-11-12
└── Recommended Offer: 30-Day Pilot

RANK 12 — Peter Johansson | CIO | Swedbank Digital
├── Contact ID: C-057
├── Match Score: 88/100
├── Segment: Segment 2 (UK/Europe — EU AI Act)
├── Persona Match: CIO | Open Opportunity: YES — Qualification
├── Engagement Score: 83 | Last Engagement: 2024-11-16
└── Recommended Offer: EU AI Act Assessment → Pilot

RANK 13 — Jason Brooks | CTO | Horizon Insurance Group
├── Contact ID: C-061
├── Match Score: 87/100
├── Segment: Segment 1 (NA Tier 1 CxO)
├── Persona Match: CTO | Open Opportunity: YES — Discovery
├── Engagement Score: 81 | Last Engagement: 2024-11-06
└── Recommended Offer: 30-Day Pilot

RANK 14 — Daniel Cheung | Chief Risk Officer | Victoria Capital HK
├── Contact ID: C-075
├── Match Score: 83/100
├── Segment: Segment 3 (APAC — MAS/HKMA)
├── Persona Match: CRO | Open Opportunity: No
├── Engagement Score: 68 | Last Engagement: 2024-10-08
└── Recommended Offer: APAC Governance Readiness Assessment

RANK 15 — Jennifer Walsh | VP of Compliance | Heartland Mutual Insurance
├── Contact ID: C-013
├── Match Score: 82/100
├── Segment: Segment 6 (Secondary Buyers — VP Level)
├── Persona Match: VP Compliance | Engagement Score: 74
└── Recommended Offer: Readiness Assessment

RANK 16 — Helen Fitzgerald | CCO | Midwest Mutual Insurance
├── Contact ID: C-033
├── Match Score: 81/100
├── Segment: Segment 1 (NA Tier 1 CxO)
├── Persona Match: CCO | Open Opportunity: YES — Discovery
└── Recommended Offer: Pilot Program

RANK 17 — Thomas Klein | CIO | Deutsche Living Insurance
├── Contact ID: C-067
├── Match Score: 81/100
├── Segment: Segment 2 (UK/Europe)
├── Persona Match: CIO | Open Opportunity: YES — Discovery
└── Recommended Offer: EU AI Act Assessment

RANK 18 — Yuna Choi | Chief Risk Officer | KB Financial Group
├── Contact ID: C-064
├── Match Score: 80/100
├── Segment: Segment 3 (APAC)
├── Persona Match: CRO | Engagement Score: 73
└── Recommended Offer: APAC Governance Assessment

RANK 19 — Marcus Chen | CRO | Northstar AgentOps — Duplicate
├── Contact ID: C-014 — DUPLICATE of C-001 — EXCLUDED FROM LIST
└── Action: Merge into C-001; delete C-014

RANK 19 (adjusted) — Eleanor Osei | Chief Risk Officer | Trinity Financial Corp
├── Contact ID: C-068
├── Match Score: 79/100
├── Segment: Segment 1 (NA Tier 1 CxO)
├── Persona Match: CRO | Engagement Score: 77
└── Recommended Offer: Readiness Assessment

RANK 20 — Richard Hoffman | Chief Risk Officer | United Capital Management
├── Contact ID: C-040
├── Match Score: 77/100
├── Segment: Segment 1 (NA Tier 1 CxO)
├── Persona Match: CRO | Engagement Score: 77
└── Recommended Offer: Readiness Assessment
```

---

## SECTION 3: TOP 10 RECOMMENDED ACCOUNTS

```
ACCOUNT 1 — Citadel Financial Corp
├── Industry: Financial Services / Diversified
├── Region: North America / USA
├── Employee Count: 19,000
├── Annual Revenue: $15B
├── Account Tier: Tier 1
├── Contacts in Target List: 1 (C-043)
├── Open Opportunities: 1 (Closed Won → Expansion)
├── Existing Customer: YES
├── Buying Committee Coverage: 1/5 — CRO covered
├── Missing Committee Roles: CCO, CIO, CTO, Head of CX
├── Aggregate Engagement Score: 94
├── Recommended Next Action: AE-led expansion conversation with Diane Reeves — identify CCO for committee
└── Enrichment Priority: HIGH — need additional committee contacts

ACCOUNT 2 — Global Trust Bank
├── Industry: Financial Services / Retail Banking
├── Region: North America / USA
├── Employee Count: 35,000 | Annual Revenue: $28B
├── Account Tier: Tier 1
├── Contacts in Target List: 1 (C-006)
├── Open Opportunities: 1 (Negotiation)
├── Existing Customer: YES
├── Buying Committee Coverage: 1/5 — CIO covered
├── Missing Committee Roles: CRO, CCO, CTO, Head of CX
├── Recommended Next Action: Accelerate negotiation — identify and add CRO/CCO to committee
└── Enrichment Priority: HIGH — deal at risk if single-threaded

ACCOUNT 3 — Royal Sterling Bank
├── Industry: Banking / Retail Banking | Region: UK
├── Employee Count: 22,000 | Annual Revenue: $18B
├── Account Tier: Tier 1
├── Contacts in Target List: 1 (C-019 — CRO)
├── Open Opportunities: 1 (Discovery)
├── Buying Committee Coverage: 1/5 — CRO covered
├── Recommended Next Action: Multi-thread to CCO and CIO; FCA urgency angle
└── Enrichment Priority: HIGH

ACCOUNT 4 — Liberty Financial Group
├── Industry: Financial Services / Diversified | Region: North America
├── Employee Count: 15,000 | Annual Revenue: $11B
├── Account Tier: Tier 1
├── Contacts in Target List: 1 (C-036 — CTO)
├── Open Opportunities: 1 (Qualification)
├── Buying Committee Coverage: 1/5 — CTO covered
├── Missing Committee Roles: CRO, CCO, CIO, Head of CX
└── Enrichment Priority: HIGH

ACCOUNT 5 — Deutsche Kommerzbank
├── Industry: Banking / Commercial Banking | Region: Western Europe / Germany
├── Employee Count: 31,000 | Annual Revenue: $26B
├── Account Tier: Tier 1
├── Contacts in Target List: 1 (C-027 — CIO)
├── Open Opportunities: 1 (Qualification)
├── Buying Committee Coverage: 1/5 — CIO covered
├── Recommended Next Action: Introduce BaFin + EU AI Act + DORA angle; find CRO/CCO
└── Enrichment Priority: HIGH

ACCOUNT 6 — First Capital Bank
├── Industry: Financial Services / Retail Banking | Region: North America
├── Employee Count: 12,000 | Annual Revenue: $8.5B
├── Contacts in Target List: 1 (C-001 — CRO; C-014 is duplicate)
├── Open Opportunities: 1 (Discovery)
├── Recommended Next Action: SDR acceleration — discovery call, add CCO to committee
└── Enrichment Priority: HIGH

ACCOUNT 7 — Horizon Insurance Group
├── Industry: Insurance / P&C | Region: North America
├── Employee Count: 8,200 | Annual Revenue: $4.8B
├── Contacts in Target List: 1 (C-061 — CTO)
├── Open Opportunities: 1 (Discovery)
├── Recommended Next Action: Add CCO/CRO — CTO is evaluator, need economic buyer
└── Enrichment Priority: HIGH

ACCOUNT 8 — Forum Financial Services
├── Industry: Financial Services / Wealth Management | Region: North America
├── Employee Count: 5,100 | Annual Revenue: $2.7B
├── Contacts in Target List: 1 (C-047 — CCO)
├── Open Opportunities: 1 (Discovery)
└── Enrichment Priority: MEDIUM

ACCOUNT 9 — PrimeGuard Insurance
├── Industry: Financial Services / P&C Insurance | Region: North America
├── Employee Count: 6,800 | Annual Revenue: $3.2B
├── Contacts in Target List: 1 (C-002 — CCO)
├── Open Opportunities: None (highest engagement score in dataset at 92)
├── Recommended Next Action: Move from MQL to Discovery — highest-scoring non-opp account
└── Enrichment Priority: HIGH — need CRO, CIO added

ACCOUNT 10 — Swedbank Digital
├── Industry: Banking / Retail Banking | Region: Western Europe / Sweden
├── Employee Count: 9,800 | Annual Revenue: $8.2B
├── Contacts in Target List: 1 (C-057 — CIO)
├── Open Opportunities: 1 (Qualification)
└── Enrichment Priority: HIGH
```

---

## SECTION 4: EXCLUDED CONTACTS

**1. COMPLIANCE — DO NOT CONTACT**
| Contact ID | Name | Account | Exclusion Reason | Action Required |
|---|---|---|---|---|
| C-020 | Natasha Volkov | Sber Wealth | Notes: "Sanctioned entity — DO NOT CONTACT" | Flag to Compliance. Remove immediately. |
| C-074 | Julia Romanova | Alpha Investments | Notes: "Sanctioned entity — DO NOT CONTACT" | Flag to Compliance. Remove immediately. |

**2. DUPLICATE RECORDS**
| Contact ID | Name | Account | Primary Record | Action |
|---|---|---|---|---|
| C-014 | Marcus Chen | First Capital Bank | C-001 (same person) | Merge data, delete C-014 |
| C-055 | Robert Ashworth | Continental Life | C-007 (same person) | Merge data, delete C-055 |
| C-037 | Aisha Mohammed | Emirates Financial | C-009 (same person, both incomplete) | Manual review — neither record usable |

**3. BELOW ICP THRESHOLD**
| Contact ID | Name | Account | Reason |
|---|---|---|---|
| C-012 | Carlos Mendez | Rapid Pay | Below size threshold (320 employees, $85M rev); LATAM; bad email |
| C-017 | Kevin Adeyemi | Zenith Corp | Africa region; empty record |
| C-021 | Daniel Osei | Ghana Investment Bank | Africa region; size below threshold |
| C-022 | Elizabeth Crawford | First Equity Partners | PE firm, not core ICP; 290 employees |
| C-023 | Michael Huang | Grandview Community Bank | Community bank; 410 employees |
| C-029 | Grace Okonkwo | First Bank Nigeria | Africa region |
| C-031 | Chloe Martin | Blue Peak Capital | Hedge fund; 180 employees |
| C-042 | Marcus Thompson | Redwood Capital Advisors | RIA; 380 employees |
| C-046 | Kwame Asante | Ecobank Transnational | Africa region |
| C-053 | William Foster | Appalachian Community Bank | Community bank; 290 employees |
| C-058 | Diana Okonjo | Access Bank PLC | Africa region |

**4. POOR DATA QUALITY**
| Contact ID | Name | Issue |
|---|---|---|
| C-009 | Aisha Mohammed | Missing industry, persona, job title; also duplicate |
| C-039 | Sandra Williams | Almost entirely empty record |
| C-051 | Amara Diallo | Missing email address |

---

## SECTION 5: DEDUPLICATION RECOMMENDATIONS

```
DUPLICATE PAIR 1
├── PRIMARY (KEEP): C-001 — Marcus Chen — mchen@firstcapitalbank.com — Score: 105
├── DUPLICATE (DELETE): C-014 — Marcus Chen — m.chen@firstcapitalbank.com — Score: 87
├── Recommended Action: Merge engagement history into C-001; delete C-014
└── Confidence: HIGH — same name, account, title; slight email format variation

DUPLICATE PAIR 2
├── PRIMARY (KEEP): C-007 — Robert Ashworth — rashworth@continentallife.com — Score: 58
├── DUPLICATE (DELETE): C-055 — Robert Ashworth — r.ashworth@continentallife.com — Score: 58
├── Recommended Action: Merge and retain both email formats; delete C-055
└── Confidence: HIGH — identical name, account, title

DUPLICATE PAIR 3
├── C-009: Aisha Mohammed — aisha.m@emiratesfinancial.ae — missing fields — Score: EXCLUDED
├── C-037: Aisha Mohammed — same email — more fields — Score: 49
├── Recommended Action: Merge C-009 data into C-037; treat C-037 as primary; enrichment required
└── Confidence: HIGH — same email address; C-037 has more complete data
```

---

## SECTION 6: DATA QUALITY WARNINGS (Included Contacts)

| Contact ID | Name | Issue | Severity | Recommended Fix |
|---|---|---|---|---|
| C-003 | James Okafor | Missing job title and persona | HIGH | Enrich via LinkedIn Sales Nav |
| C-028 | [Missing] Peters | Missing first name | HIGH | CRM cleanup — check source system |
| C-045 | Olivia Fernandez | Account name appears truncated ("Suncoastinsuranc.com") | MEDIUM | Verify account name; update CRM |
| C-063 | Gregory Marsh | Seniority field format inconsistent | LOW | Standardize to CRM picklist values |

**MISSING FIELDS SUMMARY**
```
├── Contacts missing Persona: 8 — Enrichment Priority: HIGH
├── Contacts missing Job Title: 6 — Enrichment Priority: HIGH
├── Contacts missing Email: 1 — Enrichment Priority: CRITICAL
├── Contacts missing Industry: 3 — Enrichment Priority: HIGH
└── Contacts missing Engagement Data: 4 — Enrichment Priority: MEDIUM
```

---

## SECTION 11: FINAL TARGET LIST (CSV)

```
Contact_ID,First_Name,Last_Name,Email,Account_Name,Industry,Region,Job_Title,Persona,Seniority,Match_Score,Segment,Open_Opportunity,Existing_Customer,Engagement_Score,Recommended_Offer,Salesforce_Campaign_Member_Status,Priority_Tier,Notes
C-002,Sarah,Whitfield,s.whitfield@primeguardinsurance.com,PrimeGuard Insurance,Financial Services,North America,Chief Compliance Officer,CCO,C-Suite,107,Segment 1,No,No,92,Readiness Assessment,Responded,Tier 1,Attended EU AI Act webinar — hot lead
C-001,Marcus,Chen,mchen@firstcapitalbank.com,First Capital Bank,Financial Services,North America,Chief Risk Officer,CRO,C-Suite,105,Segment 1,Yes,No,87,Pilot Program,Open Opportunity,Tier 1,Active opp — Discovery stage
C-043,Diane,Reeves,dreeves@citadelfinancial.com,Citadel Financial Corp,Financial Services,North America,Chief Risk Officer,CRO,C-Suite,104,Segment 5,Yes,Yes,94,Enterprise Expansion,Customer,Tier 1,Existing customer — expansion to new BU
C-019,Andrew,Fleming,a.fleming@royalsterling.co.uk,Royal Sterling Bank,Banking,United Kingdom,Chief Risk Officer,CRO,C-Suite,103,Segment 2,Yes,No,88,FCA Readiness Assessment,Open Opportunity,Tier 1,FCA urgency — open opp Discovery
C-006,Michelle,Torres,michelle.t@globaltrustbank.com,Global Trust Bank,Financial Services,North America,CIO,CIO,C-Suite,102,Segment 5,Yes,Yes,95,Enterprise Expansion,Customer,Tier 1,Existing customer — Negotiation stage
C-047,Rebecca,Sullivan,rsullivan@forumfinancial.com,Forum Financial Services,Financial Services,North America,Chief Compliance Officer,CCO,C-Suite,101,Segment 1,Yes,No,86,Readiness Assessment,Open Opportunity,Tier 1,Strong pipeline — CCO champion
C-005,David,Strömberg,d.stromberg@nordicbancorp.se,Nordic Bancorp,Banking,Western Europe,Chief Risk Officer,CRO,C-Suite,96,Segment 2,No,No,71,EU AI Act Assessment,Responded,Tier 1,EU AI Act urgency — Sweden
C-027,Thomas,Becker,t.becker@deutschekommerzbank.de,Deutsche Kommerzbank,Banking,Western Europe,CIO,CIO,C-Suite,94,Segment 2,Yes,No,79,EU AI Act Assessment,Open Opportunity,Tier 1,BaFin + EU AI Act + DORA
C-010,Tom,Bergmann,tbergmann@allegiantbank.com,Allegiant Bank,Financial Services,North America,Chief Technology Officer,CTO,C-Suite,93,Segment 1,Yes,No,82,Pilot Program,Open Opportunity,Tier 1,Discovery call scheduled
C-025,Brian,Donnelly,bdonnelly@atlanticmutual.com,Atlantic Mutual,Financial Services,North America,VP of AI Strategy,VP AI,VP,91,Segment 5,No,Yes,80,AI Governance Module Upsell,Customer,Tier 1,Existing customer expansion
C-036,Christopher,Nash,cnash@libertyfinancialgroup.com,Liberty Financial Group,Financial Services,North America,CTO,CTO,C-Suite,90,Segment 1,Yes,No,85,Pilot Program,Open Opportunity,Tier 1,Large diversified firm
C-057,Peter,Johansson,p.johansson@swedbankdigital.se,Swedbank Digital,Banking,Western Europe,CIO,CIO,C-Suite,88,Segment 2,Yes,No,83,EU AI Act Assessment,Open Opportunity,Tier 1,Swedish market
C-061,Jason,Brooks,jbrooks@horizoninsure.com,Horizon Insurance Group,Insurance,North America,CTO,CTO,C-Suite,87,Segment 1,Yes,No,81,Pilot Program,Open Opportunity,Tier 1,Major insurance opp
C-075,Daniel,Cheung,d.cheung@victoriacapital.hk,Victoria Capital HK,Financial Services,APAC,Chief Risk Officer,CRO,C-Suite,83,Segment 3,No,No,68,APAC Governance Assessment,Sent,Tier 1,HKMA regulatory angle
C-013,Jennifer,Walsh,jwalsh@heartlandmutual.com,Heartland Mutual Insurance,Insurance,North America,VP of Compliance,VP Compliance,VP,82,Segment 6,No,No,74,Readiness Assessment,Responded,Tier 1,Responded to email campaign
C-033,Helen,Fitzgerald,hfitz@midwestmutual.com,Midwest Mutual Insurance,Insurance,North America,CCO,CCO,C-Suite,81,Segment 1,Yes,No,76,Pilot Program,Open Opportunity,Tier 1,Open opp — compliance persona
C-067,Thomas,Klein,t.klein@deutschelivins.de,Deutsche Living Insurance,Insurance,Western Europe,CIO,CIO,C-Suite,81,Segment 2,Yes,No,82,EU AI Act Assessment,Open Opportunity,Tier 1,German insurance
C-064,Yuna,Choi,ychoi@kbstar.co.kr,KB Financial Group,Financial Services,APAC,Chief Risk Officer,CRO,C-Suite,80,Segment 3,No,No,73,APAC Governance Assessment,Sent,Tier 1,Major Korean conglomerate
C-068,Eleanor,Osei,eosei@trinityfinancial.com,Trinity Financial Corp,Financial Services,North America,Chief Risk Officer,CRO,C-Suite,79,Segment 1,No,No,77,Readiness Assessment,Sent,Tier 2,Diversified financial — solid target
C-040,Richard,Hoffman,rhoffman@unitedcapitalmgt.com,United Capital Management,Financial Services,North America,Chief Risk Officer,CRO,C-Suite,77,Segment 1,No,No,77,Readiness Assessment,Sent,Tier 2,Asset management — governance fit
C-059,Mark,Sullivan,msullivan@pinnaclewealth.com,Pinnacle Wealth Management,Financial Services,North America,CIO,CIO,C-Suite,75,Segment 1,No,No,75,Readiness Assessment,Sent,Tier 2,Wealth management target
C-007,Robert,Ashworth,rashworth@continentallife.com,Continental Life Insurance,Insurance,North America,Chief Compliance Officer,CCO,C-Suite,74,Segment 1,No,No,58,Readiness Assessment,Sent,Tier 2,OCC guidance triggered interest
C-026,Francoise,Leblanc,f.leblanc@creditlyon.fr,Crédit Lyon,Banking,Western Europe,Chief Risk Officer,CRO,C-Suite,74,Segment 2,No,No,67,EU AI Act Assessment,Sent,Tier 2,DORA + EU AI Act — French market
C-048,Nicolas,Dupont,n.dupont@bnpalliance.fr,BNP Alliance,Banking,Western Europe,CIO,CIO,C-Suite,74,Segment 2,No,No,74,EU AI Act Assessment,Sent,Tier 2,Top French bank
C-062,Ayesha,Begum,a.begum@standardchartereddigital.com,Standard Chartered Digital,Banking,APAC,CCO,CCO,C-Suite,76,Segment 3,No,No,76,MAS Governance Assessment,Sent,Tier 2,StanChart — Singapore MAS focus
C-071,Howard,Ng,h.ng@merlionbank.sg,Merlion Bank,Banking,APAC,CRO,CRO,C-Suite,74,Segment 3,No,No,74,MAS Governance Assessment,Sent,Tier 2,Singapore — MAS AI governance
C-035,Mei,Lin,mlin@singaporewealth.sg,Singapore Wealth Advisors,Financial Services,APAC,Chief Compliance Officer,CCO,C-Suite,70,Segment 3,No,No,70,MAS Governance Assessment,Sent,Tier 2,MAS framework — Singapore
C-016,Patricia,O'Brien,pobrien@ulsterfinancial.ie,Ulster Financial Services,Financial Services,Western Europe,Chief Compliance Officer,CCO,C-Suite,69,Segment 2,No,No,69,EU AI Act Assessment,Sent,Tier 2,Strong EU AI Act urgency — Ireland
C-069,Marcus,Reed,mreed@capitalridgebank.com,Capital Ridge Bank,Banking,North America,CTO,CTO,C-Suite,79,Segment 1,No,No,79,Readiness Assessment,Sent,Tier 2,Commercial bank — solid target
C-052,Christina,Mueller,c.mueller@allianzdigital.de,Allianz Digital,Insurance,Western Europe,Chief Compliance Officer,CCO,C-Suite,72,Segment 2,No,No,72,EU AI Act Assessment,Sent,Tier 2,Allianz subsidiary — massive account
C-060,Lena,Wagner,l.wagner@swissfinancegroup.ch,Swiss Finance Group,Financial Services,Western Europe,Chief Risk Officer,CRO,C-Suite,66,Segment 2,No,No,66,EU AI Act Assessment,Sent,Tier 2,Swiss private banking — FINMA
C-041,Ingrid,Hansen,i.hansen@nordiclife.no,Nordic Life Insurance,Insurance,Western Europe,Chief Compliance Officer,CCO,C-Suite,63,Segment 2,No,No,63,EU AI Act Assessment,Sent,Tier 2,Nordic market — Solvency II + AI Act
C-011,Lisa,Park,lpark@koreainvestment.kr,Korea Investment Corp,Banking,APAC,Chief Risk Officer,CRO,C-Suite,55,Segment 3,No,No,55,APAC Governance Assessment,Sent,Tier 3,APAC — FSC framework
C-024,Rachel,Kim,rachel.kim@seoulcapital.kr,Seoul Capital,Financial Services,APAC,Chief Compliance Officer,CCO,C-Suite,62,Segment 3,No,No,62,APAC Governance Assessment,Sent,Tier 2,APAC compliance persona
C-038,Paul,Nakamura,p.nakamura@tokyotrustbank.co.jp,Tokyo Trust Bank,Banking,APAC,CIO,CIO,C-Suite,55,Segment 3,No,No,55,APAC Governance Assessment,Sent,Tier 3,Japan — FSA; slower cycle
C-030,Samuel,Goldstein,sgoldstein@templepointinvest.com,Temple Point Investments,Financial Services,North America,Head of Risk,Head of Risk,Director,73,Segment 6,No,No,73,Readiness Assessment,Sent,Tier 2,Good fit smaller wealth platform
C-070,Sophie,Bernstein,s.bernstein@europacapital.fr,Europa Capital,Financial Services,Western Europe,CCO,CCO,C-Suite,64,Segment 2,No,No,64,EU AI Act Assessment,Sent,Tier 2,French asset manager
C-049,Grace,Kim,gkim@seoultrust.kr,Seoul Trust Financial,Financial Services,APAC,Head of Digital,Head of Digital,Director,50,Segment 3,No,No,50,APAC Governance Assessment,Sent,Tier 3,APAC — moderate engagement
```
