---
name: build-mixed-media-history-short
description: Build, revise, render, quality-check, SEO-optimize, and prepare YouTube publishing data for Japanese factual-entertainment Shorts that combine cinematic AI-generated video with verified archival, government, scientific, or other primary sources. Use for 歴史・科学・発明・建築・絶滅種・天才の失敗・バズ動画のAI再現・科学現象・不思議な素材・意外な用途、Google Flow等の8秒映像を組み合わせる動画、「結果先出し→仕組み→意外な応用→ツッコミ」、VOICEVOX・BGM・字幕・Remotion図解、発音修正、半透明中央エンディング、完成MP4検査、YouTube検索キーワード・タイトル・概要欄・タグ設計、または予約投稿を依頼されたとき。
---

# Build Mixed Media History Short

Create a 25–35 second Short in which AI video supplies emotion and primary-source images supply proof. End with a memorable human-scale punchline without weakening factual accuracy.

## Production workflow

### 1. Define the episode contract

1. Read applicable project instructions, especially `ProductionTeam/AGENTS.md` and `OperationTeam/AGENTS.md` before publishing.
2. Confirm the topic, target emotion, one useful fact, one visual proof, and one punchline.
3. Check current channel results and the publishing calendar when available.
4. Treat a new episode as a measurable format test when the sample size is small.

Prefer topics with a familiar subject, a verified reversal, a visible primary-source artifact or comparison, and a payoff that fits one short Japanese line.

### 2. Verify facts before scripting

Use primary sources in this order when possible:

1. The institution, inventor, project, museum, government, or scientific mission involved.
2. National archives, universities, peer-reviewed papers, or official cultural databases.
3. Established museums, professional associations, and reputable reference works.

Separate the visible symptom, defective object, root cause, correction, and evidence that the correction worked. Do not compress these into a misleading statement for a stronger hook. Keep uncertain claims qualified. Save source URLs and exact image credits.

### 3. Assign a role to each medium

- **AI video:** grandeur, isolation, movement, danger, atmosphere, reconstruction, or anonymous action.
- **Official or archival image:** factual proof, before/after comparison, real object, historical record, diagram, or measured result.
- **Remotion graphics:** numbers, timelines, measurement lines, focus changes, wipes, labels, arrows, and the final joke.

Never present AI footage as documentary evidence. Mark AI footage with `AI VISUALIZATION` or a comparably clear label. Mark primary-source media separately with the source and credit.

### 4. Write the story

Use this default sequence:

1. **0–3秒: 強い矛盾** — state a recognizable failure in large centered text.
2. **期待** — establish why the subject mattered.
3. **失敗の証拠** — use the official image and briefly reduce the music.
4. **小さすぎる原因** — reveal the surprising number or overlooked detail with the strongest effect.
5. **回復・再発見** — show the problem being solved or the original purpose restored.
6. **公式の比較** — show the before/after or artifact long enough to understand silently.
7. **人間サイズのツッコミ** — translate the fact into a short joke, then show the CTA.

Favor `威厳 → 失敗 → 納得 → 回復 → 笑い` over a flat chronology. Do not tease the next episode unless explicitly requested.

Preserve useful pauses in narration, but remove decorative Japanese full stops from large punchline text when they make the card feel slow. Keep punctuation in narration readings when it controls timing.

#### Viral phenomenon reproduction variant

Use this variant for a famous experiment, life hack, unusual material, or product demonstration:

1. **0–3秒: 結果を先に見せる** — show the most impossible-looking moment and state the contradiction.
2. **巻き戻し** — return to the intact object so the viewer can compare before and after.
3. **固有名詞** — name an unfamiliar subject in large text within roughly 5–8 seconds; do not assume the viewer knows it.
4. **再現** — show the transformation, reserving the strongest screen shake, flash, ripple, or impact sound for the decisive frame.
5. **誤解を否定** — separate the apparent explanation from the verified mechanism.
6. **数字で納得** — animate the verified temperature, time, force, or scale with a gauge, ruler, diagram, or card.
7. **現実の証拠** — if a real product creates a second reveal, show a current official product image and verified price before the punchline.
8. **価格オチ** — keep the last page to the punchline and CTA; move source, price, and qualifications to the preceding evidence page.

For product evidence, verify the official seller page on the production date and record the date, currency, included items, image credit, and direct URL. Never fabricate a product listing with AI. Treat generated experiment footage as visualization rather than proof.

For a visual phenomenon followed by an unexpected real-world application, read [references/viral-science-seo-benchmark.md](references/viral-science-seo-benchmark.md). Use its `現象→名称→疑問→仕組み→応用→数値→ツッコミ` pattern and SEO gate.

### 5. Generate AI motion footage

For two 8-second vertical clips:

1. Assign clip 1 to the impossible-looking phenomenon, transformation, or subject at its peak.
2. Assign clip 2 to repair, recovery, human intervention, or the unexpected application.
3. Request 9:16, stable geometry, slow camera movement, and caption-safe negative space.
4. Exclude baked-in text, narration, sound, watermarks, logos, insignia, flags, and readable name patches.
5. Avoid precision mechanism close-ups that are likely to hallucinate.
6. Avoid identifiable people when commercial-use publicity rights may apply.

Inspect each clip at the beginning, middle, and end. Reject malformed equipment, changing geometry, extra limbs, unwanted logos, false text, or continuity breaks.

### 6. Handle archival and official media

1. Read the source page and usage terms.
2. Prefer an asset page that gives creator, institution, dimensions, and credit.
3. Avoid unclear third-party material embedded on an official page.
4. Do not imply that the institution reviewed, sponsored, or endorsed the AI video.
5. Keep on-screen credit readable but subordinate to the story.

If the institution restricts its logo in AI imagery, remove the logo from prompts and footage. If it requests AI disclosure, place the disclosure directly on AI scenes.

### 7. Design sound and voice

- Use a restrained low voice for authority, failure, and technical explanation.
- Use a brighter voice only for the final punchline when contrast helps.
- Write ambiguous Japanese readings in kana in the narration field. Never trust kanji pronunciation without listening or explicitly verifying it; for example, write `みずをはじく` when `水を弾く` is misread as `みずをひく`.
- Request an instrumental track with solemn opening, brief stop at failure, warmer recovery, and playful final button.
- Duck the BGM at the official failure image and the main numerical reveal.
- Reserve the strongest impact sound and screen shake for one moment.
- Target about −16 LUFS and a true peak no higher than roughly −1.0 to −1.5 dBTP.

### 8. Assemble in Remotion

1. Register a dedicated 1080×1920, 30 fps composition.
2. Store display text, narration readings, speakers, and audio paths in episode JSON.
3. Generate VOICEVOX audio and derive scene lengths from resolved durations.
4. Mute source-video audio unless intentionally required.
5. Use distinct labels for AI and primary-source scenes.
6. Give horizontal official comparisons enough area; do not crop away the evidence.
7. Use a wipe, split frame, or focused crop to explain before/after relationships.
8. Center mobile captions and keep essential text away from Shorts UI.
9. End with a centered punchline and CTA in the episode's color system. When the established series uses background footage, retain it beneath one large semi-transparent panel instead of switching to an unrelated opaque card or detached bottom banner.

Read [references/hubble-benchmark.md](references/hubble-benchmark.md) when reproducing the established pacing, disclosure, evidence, or technical quality pattern.

For the viral reproduction variant, use Remotion to make the explanation legible rather than merely decorative: use rewind scanlines for the setup reset, one impact cluster at the transformation, an animated measurement graphic for the mechanism, and a clean official-product evidence card before the final joke. Keep source-video audio muted unless intentionally selected.

### 9. Run the quality gate

1. Run TypeScript validation.
2. Render stills for the hook, failure, number reveal, recovery, official comparison, and CTA.
3. Inspect stills at full resolution.
4. Render the full MP4 and extract the same checkpoints from it.
5. Confirm H.264, AAC, 1080×1920, 30 fps, intended duration, 48 kHz stereo, and file integrity with `ffprobe`.
6. Measure loudness and normalize audio without re-encoding video when needed.
7. Re-check the final normalized file.
8. Confirm every factual claim has a saved source and AI scenes cannot be mistaken for archival footage.
9. Listen for names, numbers, homographs, and technical terms. If only narration changes and timing stays fixed, render a new audio-only track and remux it with the approved video stream before re-running loudness QC.

Do not accept `render succeeded` as the quality gate.

### 10. Optimize search and authorize publishing

1. Check channel Analytics before assuming SEO matters. Record the share of YouTube Search and the actual search terms when available.
2. Check current YouTube or web search phrasing for the subject. Treat this as keyword discovery, not proof of scientific claims.
3. Build a hierarchy: exact subject name, plain-language contradiction, intent word such as `仕組み` or `なぜ`, then the distinctive payoff.
4. Put the plain-language phrase and exact subject in the title's first half; end with `#Shorts`. Do not repeat synonyms mechanically.
5. Open the description with the complete search question and answer it in the next sentence. Include primary sources, AI disclosure, VOICEVOX credit, and AI-generated BGM credit below that.
6. Use three focused public hashtags. Put Japanese spelling variants, English name, mechanism, application, and adjacent intent phrases in tags.
7. Validate title length, description length, tag count, output media, `containsSyntheticMedia: true`, and `selfDeclaredMadeForKids: false`.
8. Check the live scheduled list before choosing the next slot. After upload, re-query YouTube and record the video ID, URL, public time, title, and disclosure state.

Only upload or schedule after explicit user authorization. Save the configuration under `OperationTeam/uploads/`, append metadata to `youtube_description.md`, and record the returned video ID and URL.

## Expected outputs

- Final video: `out/<episode-id>-final.mp4`
- Episode data: `data/episodes/<episode-id>.json`
- Production spec and QC report under `ProductionTeam/`
- Primary-source media under `public/image/` with recorded credit
- Upload configuration: `OperationTeam/uploads/<date>-<episode-id>.json`

Report final duration, format, loudness, sources, AI disclosure, scheduled date, video ID, and URL.
