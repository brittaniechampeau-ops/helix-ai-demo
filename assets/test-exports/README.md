# DRIVE Test Exports — Taxonomy Conflict Dataset

Fake but realistic system exports for testing Resolve's conflict detection and resolution.
Upload the files for a given tier into Discover > Materials > Taxonomy sources, then run through Resolve.

---

## MICRO — Brightpath Consulting
3-person professional services firm. $250K revenue. No dedicated marketing function.
**Stack:** Mailchimp (free) + HubSpot Free CRM

Key conflicts:
- Same contacts appear in both systems with different names (Mike vs Michael, Jen vs Jennifer)
- "C-Suite" tag in Mailchimp vs "Chief Executive Officer" job title in HubSpot — no shared persona vocabulary
- Lifecycle stages (Mailchimp: Newsletter Subscribers / Warm Prospects / Cold) vs HubSpot (Lead / MQL / SQL / Subscriber) — completely parallel, no mapping
- Robert Nguyen: "r.nguyen" in HubSpot, no match in Mailchimp despite identical domain
- No ICP definition exists in either system

---

## SMB — Meridian Health Partners
22-person healthcare consulting firm. $1.4M revenue. One marketing coordinator.
**Stack:** HubSpot Marketing Hub Starter + Mailchimp (legacy, being phased out) + LinkedIn Sales Navigator

Key conflicts:
- Anita Patel (CMO): "Clinical Decision Maker" (HubSpot) vs "C-Suite Contacts" segment (Mailchimp) vs "C-level executive; Healthcare Decision Maker" (LinkedIn)
- Christine Wu (VP): "C-Suite Buyer" in HubSpot persona — she's VP, not C-Suite
- Elena Rosa (COO): consistent seniority signal across all 3 systems but 3 different labels
- Grace Harris: in Mailchimp + LinkedIn, not in HubSpot at all
- Howard Kim (VP Marketing, HealthSys): only in LinkedIn, same org as Elena Rosa — not in either marketing system
- Frank Nguyen: only in Mailchimp, not in HubSpot
- Brian Jones: no email in LinkedIn, making cross-system match impossible

---

## MID-MARKET — Vantage Commerce Group
85-person B2B retail tech company. $6.2M ARR. 4-person marketing team.
**Stack:** Salesforce + Marketo + Canto DAM

Key conflicts:
- Jennifer Cole: "Economic Buyer" (Salesforce) vs "Ops Leader" persona (Marketo) — also Salesforce says Enterprise tier, Marketo says MM
- Rachel Kim (CDO): "Executive Sponsor" (Salesforce) vs "CXO" (Marketo) vs "Decision Makers; CXO" (DAM)
- Carlos Rivera: "Economic Buyer" (Salesforce) vs "Owner/Founder" (Marketo) — Salesforce says SMB, Marketo says SME
- Tier naming: Enterprise / Mid-Market / SMB (Salesforce) vs ENT / MM / SME (Marketo) vs Enterprise Clients / Mid-Market / Small Business / Large Retail (DAM) — 4 systems, 12+ labels for 3 tiers
- Company name variants: "Cornerstone Brands" vs "Cornerstone Brands LLC" vs "Cornerstone Brands LLC" — inconsistent legal name usage
- DAM asset "Retailer-Persona-Research-Deck-v3.pptx" marked OUTDATED but still tagged for all audiences
- Alex Dupont at Horizon Retail Group: in Marketo, not in Salesforce

---

## ENTERPRISE — Axiom Systems
320-person B2B SaaS (IT security). $19M ARR. 12-person GTM team.
**Stack:** Salesforce + Marketo + Bynder DAM + ZoomInfo + Outreach

Key conflicts:
- Persona naming explosion: CISO (Marketo) = Chief Information Security Officer (ZoomInfo, Salesforce) = "C-level executive" (Outreach criteria) = "Enterprise CISO; Security Executives" (Bynder)
- Sandra Wright at Nexus: "VP IT Security" (Marketo) vs "VP Information Security" (ZoomInfo) vs "VP IT Security / Director InfoSec" (Outreach target criteria) — 3 different strings for same role
- Robert Kim (CEO, Global Dynamics): "CXO" in Marketo, "Chief Executive Officer" in ZoomInfo, "CXO / C-Level" in Outreach — content in Bynder tagged for CISO/CTO audience for his account
- NEXUS Corporation (Salesforce) vs NEXUS Corp (Marketo) — same company, different legal name
- Tier naming: T0 / T1 / T2 / T3 (Salesforce) vs ICP Tier 1 / ICP Tier 2 / Non-ICP (Marketo) vs "Enterprise / Mid-Market / Small Business" (Bynder) — no crosswalk defined
- Industry: Marketo uses "FinServ" and "Healthcare IT" — ZoomInfo uses "Finance, Commercial Banking" and "Hospitals and Health Systems" — Salesforce uses "Financial Services" and "Healthcare" — Bynder uses both in same tag field
- Outreach SEQ-004 targeting Director + VP + CISO in same sequence ("Consider splitting" noted in comments — hasn't happened)
- ceo@globaldyn.com: role-based email address, not personal — data quality risk
- BYN-009 (Competitor Battlecard): downloaded 156 times but marked "Do not share" — no enforcement mechanism
