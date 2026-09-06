# Claude Integration Requirements

Apply this package after the central approval hub is stable.

## Required behavior

1. Ingest the corpus without modifying source text.
2. Keep public, private-style-only, and confidential retrieval pools separate.
3. Retrieve examples by voice mode, channel, audience, relationship, purpose, and emotional register.
4. Use other people's words only as context, never as Britt-authored training evidence.
5. Show the approval hub which examples and rules influenced a draft without exposing confidential text unnecessarily.
6. Store every proposed draft, Britt edit, final text, disposition, and outcome as a linked feedback record. The destination readback, not the earlier chat, is authoritative for the final text.
7. Treat Britt's final text as higher authority than generated rules.
8. Improve retrieval weights and drafting guidance from edits without allowing scheduled jobs to rewrite code, policies, or guardrails.
9. Never make one style rule universal when it is demonstrated only in one channel.
10. Do not impose universal character counts. Length follows the job being done.
11. Model tagged mentions as structured entities with a platform identifier, display name, and insertion point. Render the person's name naturally inside the sentence.
12. Never promote a ChatGPT or agent candidate to `final` without explicit approval or destination readback.
13. Treat natural contractions as a hard voice requirement in every Britt-authored channel. Reject and rewrite a contraction-free draft before it reaches the hub.
14. Treat fragment-heavy, one-line-per-thought, or staccato influencer cadence as a hard voice failure. Short paragraphs are allowed only when they contain complete, connected thoughts.
15. If the requested channel has no authoritative same-channel samples, do not silently draft from abstract rules. Either retrieve verified examples from the live destination first or label the draft as calibration-blocked. Newsletter drafting requires actual sent newsletter examples.
16. When Britt pastes the exact text she ultimately posted, store it as `user_attested_published_final`, link it to the proposed draft, and calculate the difference. Destination readback may later verify it but is not required to learn from Britt's explicit attestation.

## Approval-hub fields for communications

- voice mode
- intended channel
- audience and relationship type
- communication purpose
- privacy class
- retrieved example IDs
- applied voice rules
- proposed text
- Britt-edited text
- final text
- manual or automated delivery boundary
- outcome
- mention targets and insertion points
- destination readback text
- user-attested published text
- difference between approved draft and published text

## Evaluation dimensions

- sounds spoken rather than generated
- adds a point rather than restating context
- specificity
- sentence flow
- correct warmth for the relationship
- strength of judgment
- commercial posture
- disclosure safety
- channel appropriateness
- generic AI phrasing
- unnecessary hedging
- unnecessary praise
- forced CTA behavior

Voice evaluation should be advisory except for true safety, attribution, confidentiality, and prohibited-language failures. It must not reject good writing merely because it differs in length, cadence, or vocabulary from a narrow template.

## Comment-specific generation sequence

1. Identify the one substantive point Britt can add.
2. Draft the thought without generic praise or source restatement.
3. Place the tagged person's name where it sounds natural in the sentence.
4. Remove engagement-engineering language, canned transitions, and inspirational cleanup.
5. Present the editable draft in the approval hub.
6. After Britt posts it manually, read back or capture the published text when permitted.
7. Treat Britt's final inline changes as the highest-authority learning record.
