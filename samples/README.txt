SAMPLE FILES FOR VECTOR TESTING
Client persona: Webb Advisory Group (Marcus Webb, Chicago)
Practice: Operational due diligence for PE firms

FILES
-----
sample_transcript.vtt    → Upload as "+ Transcript"
                           Discovery call — Britt × Marcus, 10 minutes
                           Tests: practice name, founder, team size, BD motion, constraint,
                                  tech stack (HubSpot/Notion), contacts, case study

sample_pitch_deck.txt    → Upload as "+ Pitch deck"
                           Capabilities deck with slides, services, case study, pricing
                           Tests: offer structure extraction, case studies, positioning

sample_proposal.txt      → Upload as "+ Proposal / SOW"
                           Full SOW for Meridian Partners, $31K engagement
                           Tests: pricing, scope, deliverables, ops.duration

sample_case_studies.txt  → Upload as "+ Case studies"
                           4 detailed case studies with outcomes
                           Tests: case study drafting, results specificity, client names

sample_other_doc.txt     → Upload as "+ Other doc"
                           Internal background doc with financials, contacts, tech stack
                           Tests: contact extraction, CRM tools, budget signals

LINKEDIN URL (paste into URL field)
-------------------------------------
linkedin.com/in/britt-bowman-5930075a
→ Tests URL ingestion (stored as signal text, not fetched)

MULTI-SOURCE TEST
-----------------
Upload all 5 files at once → "Analyze sources"
Should produce a rich, fully populated output across all Vector steps.
Conflict test: proposal says $31K, transcript says $22K–$35K range —
should appear in ops.notes per the Signal Extractor prompt.
