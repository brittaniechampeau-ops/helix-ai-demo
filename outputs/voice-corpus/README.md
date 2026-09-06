# Britt Bowman Voice Corpus

Status: Seed corpus, ready for continued ingestion and Claude integration

Purpose: Give drafting agents channel-specific evidence of how Britt actually writes. This corpus separates polished public writing, conversational comments, and private relationship messages so one mode is never mistaken for another.

## Authority order

1. Britt's final text read back from the destination after publication or sending
2. Britt's pasted final text explicitly identified as what she published or sent
3. Britt's inline edit captured by the approval hub immediately before execution
4. Britt's explicit written approval of an unchanged draft
5. Britt's raw language and correction in a drafting conversation
6. Assistant-generated candidates and inferred rules

The ChatGPT LinkedIn Commenting project is not evidence of final wording by itself. Britt normally edits comments directly in LinkedIn before posting and does not paste the final version back into ChatGPT. A ChatGPT draft remains a candidate unless it is matched to the final comment read from LinkedIn.

Other people's words are context only. They must never be retrieved as examples of Britt's voice.

## Privacy classes

- `public`: May inform public drafting.
- `private_style_only`: May inform cadence, warmth, and conversational behavior, but names and facts may not be reused.
- `confidential`: May be retrieved only for the same authorized relationship or task.

## Voice modes

- `public_thought_leadership`
- `public_personal_story`
- `public_event_promotion`
- `conversational_comment`
- `comment_reply`
- `warm_relationship_message`
- `qualified_prospect_reply`
- `cold_outreach`
- `commercial_close`
- `newsletter`
- `speaking_follow_up`

## Current contents

`samples.jsonl` contains the public authenticated LinkedIn corpus captured beginning 2026-09-05. It currently includes fourteen recent public posts and eight published comments.

Selected sent-message examples and the larger archive-derived message corpus live under the gitignored `private/` directory. They are never mixed into the public samples file.

`voice-profile.md` records provisional patterns grounded in those samples. It is not a substitute for retrieval.

`claude-integration.md` is the handoff Claude should apply after the approval hub is complete.

`preference-pairs.jsonl` captures rejected drafts, Britt's correction, and the authoritative final result. These records teach the system why superficially reasonable language still fails.

`ingest_linkedin_messages.py` imports Britt-authored messages from LinkedIn's basic archive. Its output is written under the gitignored `private/` directory because sent messages can contain relationship, client, and commercial context that must not enter a repository.

`distribution-playbook.md` holds algorithm observations and editorial-sequencing hypotheses separately from voice rules. It must be validated against the February-to-present post history before it becomes scheduling policy.

## Ingestion rules

- Preserve text exactly. Do not silently clean punctuation, contractions, capitalization, or paragraphing.
- Store the author of every piece of text.
- Keep the original post or message as context only when needed to understand Britt's response.
- Never combine public and private retrieval pools.
- Deduplicate by normalized-text hash plus channel and date.
- Preserve source URL and capture date.
- Label uncertain dates as uncertain rather than inventing a timestamp.
- Record Britt's edits as a proposed/final pair.
- When Britt pastes back the text she actually posted, store it as `user_attested_published_final`. It is authoritative even when automated destination readback is unavailable, but retain the attestation source so it is never confused with machine-verified readback.
- Natural contractions are mandatory in Britt-authored prose. A contraction-free draft fails voice QA rather than receiving a lower style score.
- Reject fragment-heavy, one-line-per-thought, or staccato influencer cadence. Paragraph breaks may create pacing, but the prose must flow in complete, connected thoughts.
- Do not turn a single example into a universal rule.
- Preserve inline tagged-person placement. Britt normally mentions the person naturally inside the sentence instead of placing a detached name at the beginning or end.
- Store the visible name separately from the platform mention identifier so the draft can render naturally and the execution layer can create a real mention.
- Do not infer that an assistant draft was accepted because the conversation moved on.
