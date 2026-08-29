---
name: run-channel-council
description: Run and document recurring cross-team review meetings for the AIのムダ遣い YouTube channel. Use when Codex is asked for an OperationTeam定例会, 全Team会議, 週次運用会議, 自動議事録, scheduled channel review, or a recurring meeting that must combine OperationTeam, PlanningTeam, ProductionTeam, and BusinessTeam findings without autonomously publishing or contacting outsiders.
---

# Run Channel Council

Run a read-only weekly council that turns channel evidence into a small set of reviewable decisions. Save a dated Markdown record so the user can inspect every run.

## Prepare the meeting

1. Locate the project root by finding `OperationTeam/AGENTS.md` and `CHANNEL_VISION.md`.
2. Read `references/meeting-contract.md` completely.
3. Run `node OperationTeam/scripts/prepare-weekly-meeting.mjs` from the project root.
4. If network or OAuth refresh fails, continue with the newest saved snapshots and record the exact data age and missing fields. Never invent fresh values.
5. Read the generated input manifest, every source it names, and the current team contracts needed for the agenda.

## Convene the council

Use the same evidence cutoff for all roles.

- OperationTeam states facts, data quality, comparable performance, and up to three measurable experiments.
- PlanningTeam evaluates what the evidence changes about audience, topic, and next-video hypotheses. Do not finalize an unapproved production brief.
- ProductionTeam assesses hook, pacing, factual proof, repeatability, effort, and the smallest production change worth testing.
- BusinessTeam evaluates monetization readiness and risks in WATCH/VALIDATE/READY/ACTIVE terms. Do not perform external outreach.

When subagents are available, delegate these role assessments independently and give each the input manifest rather than another role's conclusion. Let the chair compare disagreements after all assessments return. If subagents are unavailable, perform the same roles sequentially and label each position.

Require one challenge round: identify claims that rely on small samples, stale data, unequal publication age, or unverified causality. Resolve only what the evidence supports; place the rest under `保留`.

## Write decisions and minutes

Keep facts, interpretations, proposals, and approvals separate. Select no more than three next actions. Every action needs an owner, deadline or decision point, and success condition.

Write:

- `OperationTeam/meetings/YYYY-MM-DD-channel-council.md`
- `OperationTeam/meetings/LATEST.md`
- `OperationTeam/meetings/INDEX.md`

Create the dated minutes first, then run `node OperationTeam/scripts/refresh-meeting-index.mjs`. Return a concise summary and the dated file path.

## Safety boundary

Treat the council as analysis and planning only.

- Do not upload, reschedule, delete, or edit YouTube content.
- Do not change `story.json`, render media, buy services, contact external parties, submit proposals, or promise prices.
- Put any such recommendation under `ユーザー承認が必要な事項`.
- Never include OAuth tokens, API keys, personal information, or raw `.env` contents in a report.
- Do not silently overwrite a dated meeting. If one already exists, update it only when the run explicitly continues the same meeting and record the revision time.

