---
name: build-ai-viral-science-short
description: Build, revise, render, quality-check, and prepare publishing data for Japanese viral-science entertainment Shorts using AI-generated motion, verified sources, VOICEVOX dialogue, Suno BGM, and Remotion. Use for バズ動画のAI再現、気持ちいい加工映像、不思議な実験・素材、レーザー洗浄、過冷却、磁性流体、意外な科学用途、または同形式を別PCへ引き継ぐ依頼。Do not use for AIグルメ or こんな〇〇は嫌だ episodes.
---

# Build AI Viral Science Short

Create a 25–35 second Japanese Short that moves from an impossible-looking visual to a verified mechanism, a larger real-world application, and one concise joke. Preserve the established `AIのムダづかい` visual identity and never present generated footage as documentary proof.

## Mandatory synchronization gate

Before planning, editing, generating voices, rendering, publishing, or changing production files:

1. Run `npm run sync:start`. This must fetch and fast-forward from the configured GitHub upstream with a clean worktree.
2. Read `PROJECT_STATUS.md` and `ProductionTeam/PRODUCTION_BOARD.md` after the pull.
3. Confirm that no other PC owns the episode and that no render is active.
4. Update both progress files with the episode, owner, branch, exact status, and next action.
5. Commit and push that claim before beginning production.

If authentication, network access, a dirty worktree, missing upstream, merge conflict, or a progress ownership conflict prevents synchronization, stop before production and report the blocker. Never auto-stash, discard, overwrite, or silently commit another user's changes.

At completion, update both progress files, commit and push the result, then run `npm run sync:verify`. Do not claim that GitHub or progress is synchronized unless local HEAD equals the remote branch HEAD.

## Start from project context

1. Read `ProductionTeam/AGENTS.md` and the latest relevant production brief.
2. Inspect the episode JSON, received assets, BGM, existing component, handoff contract, and most recent approved final.
3. When publication is requested, also read `OperationTeam/AGENTS.md`, inspect current Analytics and the live scheduled list, and require explicit upload authorization.
4. Treat `src/FerrofluidShort.tsx` and `src/LaserCleaningShort.tsx` as the current visual benchmarks. Do not replace their Shorts-safe caption system with a generic template.
5. When assets are missing on a second PC, read `docs/GOOGLE_DRIVE_ASSETS.md` and restore the exact `public/` paths from Google Drive before changing code.

For a new episode, major revision, voice design, caption placement, Remotion effects, QC, or SEO, read [references/production-standard.md](references/production-standard.md).

For GitHub sharing, a second workstation, binary asset synchronization, branch ownership, or handoff recovery, read [references/cross-pc-workflow.md](references/cross-pc-workflow.md).

## Workflow

1. Define one visible contradiction, one exact subject name, one question, one verified mechanism, one surprising application, and one final punchline.
2. Verify technical claims with primary or manufacturer sources. Store direct URLs and qualification notes in the production brief.
3. Assign AI footage to emotion and movement; assign official sources and Remotion graphics to factual proof. Label generated scenes `AI再現映像` or `AIによる応用イメージ`.
4. Inspect every received clip at the start, midpoint, decisive frame, and end. Reject unstable geometry, false text, unwanted logos, or misleading machinery.
5. Check required binary paths against `ProductionTeam/assets-manifest.json`. Do not commit videos, images, BGM, sound effects, or generated voices to Git.
6. Keep display text separate from narration readings. Use a restrained male voice for facts and a brighter female voice for questions and punchlines when contrast helps.
7. Build a dedicated 1080×1920, 30 fps Remotion composition. Preserve the established upper headline, lower dialogue, and centered ending safe zones.
8. Create `ProductionTeam/handoffs/<episode>.render.json` and finish with:

   ```powershell
   npm run finalize:handoff -- ProductionTeam/handoffs/<episode>.render.json
   ```

9. Inspect full-resolution hook, explanation, application, and CTA frames after final normalization. A successful render alone is not approval.
10. When authorized to publish, save metadata under `OperationTeam/uploads/`, set `containsSyntheticMedia: true`, upload, re-query YouTube, and record the video ID and URL.

## No partial render handoff

- Once a render, FFmpeg normalization, VOICEVOX generation, or finalization command starts, keep polling it until it exits.
- Do not end the task while an execution session is still running.
- A render is complete only after the final MP4, technical inspection, decode check, QC outputs, and progress update exist.
- If the process fails, record the exact failure and restart point as `interrupted`; never mark it `rendered` or `qc-passed`.

## Visual invariants

- Keep badges in the top UI band and begin the main headline around 170–190 px from the top.
- Use large outlined headline text directly over footage; do not default to a small full-width black title card.
- Keep lower dialogue centered around `bottom: 245` and above Shorts description and controls.
- End on one large semi-transparent panel centered on a single vertical axis.
- Keep essential text and faces out of the bottom UI area. Confirm long Japanese phrases at full resolution.
- Reserve the strongest shake, flash, or impact sound for one decisive transformation.

## Completion report

Report the final file, duration, codec, resolution, frame rate, loudness, source/disclosure status, QC result, GitHub synchronization result, progress-file state, and any remaining human review. If uploaded, also report the scheduled JST time, YouTube video ID, URL, title, and synthetic-media status.
