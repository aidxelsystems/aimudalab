---
name: build-ai-gourmet-short
description: Build, revise, preview, render, quality-check, and prepare YouTube publishing data for Japanese AI gourmet Shorts in the FlipCodex Remotion project. Use when the user asks for AIグルメ・ご当地グルメ・B級グルメ・郷土料理の短尺動画、Google Flow等の料理映像を使った解説、料理の歴史やレシピとオチを組み合わせた企画、「緊張と緩和」で物騒・不穏な料理名を笑いへ変えるシリーズ、「なるほど」からツッコミへ進む二段オチ、VOICEVOX・字幕・BGM付き編集、完成MP4の検査、または同シリーズの予約投稿準備を依頼したとき。
---

# Build AI Gourmet Short

Create a food-first entertainment Short that combines appetite, a useful fact, and an unexpected payoff. Treat the rendered MP4—not the source code—as the final product.

## Production workflow

### 1. Inspect the project and source media

1. Read applicable project instructions, especially `OperationTeam/AGENTS.md` before publishing.
2. Find candidate clips under `public/movie/` and matching episode data under `data/episodes/`.
3. Measure every clip with `ffprobe` and create contact sheets at several timestamps.
4. Inspect AI footage for impossible ingredients, unwanted people, background text, logos, malformed utensils, and continuity errors.
5. Prefer close-ups, steam, frying motion, sauce, cutting, and cross-sections. Use each shot for the claim it visually supports.

Do not describe an AI image as factual evidence. If a shot visually contradicts the narration, replace the shot or rewrite the claim before editing.

### 2. Verify the food facts

Research the dish before scripting. Prefer the following sources in order:

1. National or local government food-culture pages
2. Official tourism associations or museums
3. Established local organizations

Verify the dish name, location, ingredients, exterior coating, cooking method, origin, and how long it has been eaten. Keep uncertain etymology phrased as `〜と言われています` or `〜という説があります`. Preserve the official links for the YouTube description.

### 3. Write the story

Aim for roughly 25–35 seconds unless the user specifies another length. Use one message per scene:

1. **0–3秒: フック** — lead with a contradiction or surprising number, such as `ゼリー0％！？`.
2. **正体** — name the dish and location immediately.
3. **作り方** — explain only the ingredients and process necessary to understand it.
4. **食欲カット** — show frying, sauce, steam, or a cross-section.
5. **由来・歴史** — give one memorable fact, not a lecture.
6. **納得・オチ** — convert the fact into a short emotional payoff.
7. **CTA** — make the joke readable before the subscription request.

Favor `驚き → 納得 → 食べたい → ツッコミ` over a flat encyclopedia summary. Do not tease the next episode unless the user explicitly requests it.

#### Tension-and-relief variant

Use this pattern for dishes whose real names sound dangerous, ominous, or absurd:

1. **0–1秒: 危機予告** — hide the dish name and state a concrete threat, such as `この麺、地獄に落とします。` Use large centered text that works without sound.
2. **1–3秒: 緊張の頂点** — synchronize the strongest physical action, screen shake or color shift, and one impact sound. Use a restrained low voice and dark music.
3. **3–7秒: 正体判明** — reveal the official dish name and location quickly. Switch to a brighter voice and warmer color.
4. **納得** — explain one verified reason for the name and only the preparation details needed to understand it.
5. **食欲** — show the most appetizing close-up after the reveal, not during the threat.
6. **緩和のオチ** — end with a short contrast such as `地獄なのに、つるつる天国！`, then show the CTA separately.

For the established `緊張と緩和グルメ` house format, use this tighter sequence:

1. Put the concrete danger word on screen within 0.5 seconds. Do not begin with a generic label such as `衝撃` alone.
2. Hold the threat long enough to read, then place the physical action peak at about 2.5–3.5 seconds.
3. On the exact impact frame, combine a brief screen shake, color or exposure change, one strong effect sound, and BGM ducking. Reserve this stack for one moment only.
4. Resolve the threat immediately with the dish-name wordplay. A one-word interruption such as `汁！` may overlap the previous phrase when that creates the semantic reversal.
5. After the reveal, move through `正体 → 名前の由来 → 食欲 → 第二の意外な事実 → ツッコミ`. Do not place three encyclopedia-style explanations in a row.
6. Use the second verified fact to renew attention after viewers understand the dish. It must be independently interesting, visually supportable, and short enough to become the final joke.
7. End on a full-screen punchline and subscription CTA. Let the punchline read first; do not let `チャンネル登録` weaken the joke.

Keep the series badge exactly `緊張と緩和グルメ` across episodes. Use the completed `半ごろし`, `地獄炊き`, and `てっぽう汁` episodes in this project as visual and pacing benchmarks, not as text templates.

Keep the threat metaphorical and tied to the established dish name. Avoid cruelty, injury, weapons, or imitable dangerous behavior. For two Google Flow clips, assign clip 1 to tension and the action peak, and clip 2 to warm food reveal and payoff. Match cookware, ingredients, utensils, and noodle or food shape across both prompts. Generate clean 9:16 footage without text, logos, narration, music, or baked-in sound because Remotion supplies them later.

For music, request one instrumental track with a clear transition point: ominous minimal tension before the reveal, a short impact or stop, then playful and appetizing Japanese comedy. Avoid vocals so narration remains intelligible. In Remotion, duck the music under the peak effect and let the impact tail cross the scene boundary only when it does not mask the reveal narration.

Inspect the generated track waveform before editing. Choose a source offset that aligns its musical transition with the action peak; do not assume the useful transition begins at source time zero. If the track has no clean stop, create contrast with a short volume duck around the impact.

Use two contrasting voices when the gap benefits from it: a restrained low voice such as VOICEVOX 青山龍星 for the threat, then a brighter voice such as VOICEVOX ずんだもん from the reveal onward. Change voice, color temperature, music character, and caption styling on the same reveal beat so the emotional turn is unmistakable.

### 4. Design for silent mobile viewing

- Use 1080×1920 vertical output at 30 fps.
- Put the main flip/title card in the upper part of the frame.
- Keep the upper image area uncluttered when generating new media.
- Make the first claim understandable within one second without audio.
- Use high-contrast cards and a maximum of one primary message per screen.
- Break Japanese captions by meaning units; usually use two lines and avoid orphaned particles.
- Center narration captions on the canvas. On a 1080px-wide frame, default to `left: 50%`, `translateX(-50%)`, and a 920px box instead of asymmetric left/right offsets.
- Default narration captions to 47px type, 1.25 line height, no more than two lines, and about 280px above the bottom edge. Adjust only when the actual rendered frame requires it.
- Use a top accent rule rather than a left-only accent rule so the caption does not look optically shifted.
- Keep roughly 80px side margins and move the caption vertically when Shorts UI clearance is needed; do not shift the entire caption box left to avoid the UI.
- Verify centering and mobile readability on full-resolution rendered stills and again on a contact sheet made from the final MP4.
- Make the final CTA full-screen when the user requests a strong close.

### 5. Assemble in Remotion

1. Reuse the project fonts, BGM, effects, VOICEVOX integration, and existing composition registration.
2. Store narration/display text in a matching episode JSON.
3. Generate narration with the selected VOICEVOX speaker; default to ずんだもん only when it matches the established series.
4. Derive scene lengths from resolved audio durations so choices and captions never drift from the voice.
5. Mute source-video audio unless it is intentionally required.
6. Use light zooms, quick entrance motion, and one scene-change effect; do not bury the food under decoration.
7. Keep BGM below narration and reserve the strongest effect for the hook or payoff.
8. For two 8-second Flow clips, use the dark action clip only through the impact and the warm hero clip for the remaining scenes. Reuse the hero clip with different start offsets and moderate slow motion only after checking that no scene freezes or exceeds the source duration.

### 6. Run the production quality gate

Before calling the video complete:

1. Run TypeScript validation.
2. Render stills for the hook before impact, the exact impact, every information scene, the appetite shot, the second fact, and the final CTA.
3. Render the full MP4 and build a contact sheet from the rendered file.
4. Check text clipping, reading order, Japanese line breaks, safe zones, duplicated frames, frozen clips, and visual/narration consistency.
5. Confirm H.264 video, AAC audio, 1080×1920, 30 fps, and the intended duration with `ffprobe`.
6. Measure integrated loudness with `ebur128`. Target about −16 LUFS with true peak no higher than −1.0 to −1.5 dBFS; normalize the audio if it is materially quieter while keeping 48 kHz stereo.
7. Re-check the final normalized file, not only the Remotion source.

Do not accept `render succeeded` as the quality gate. Fix any mismatch found during inspection and render again.

### 7. Prepare YouTube publishing data

- Put the exact food keyword and a curiosity hook in the title; end Shorts titles with `#Shorts` when that is the upload plan.
- Open the description with the dish and location.
- Add a concise viewer question and subscription request.
- State in the description that the cooking footage is an AI-generated image and may differ from the real dish.
- Link to authoritative pages showing the real dish, origin, and recipe.
- Credit VOICEVOX and BGM.
- Use three focused public hashtags; place extra search terms in tags.
- Set `containsSyntheticMedia: true`, `selfDeclaredMadeForKids: false`, and the agreed category.
- Check the YouTube scheduled list before uploading.

Only upload or schedule when the user explicitly authorizes posting. Record upload settings under `OperationTeam/uploads/` and append upload-ready metadata to `youtube_description.md`.

## Expected outputs

- Final video: `out/<episode-id>-final.mp4`
- Episode data: `data/episodes/<episode-id>.json`
- Upload-ready metadata: `out/<episode-id>-youtube.md` and/or `youtube_description.md`
- Scheduled-upload config when authorized: `OperationTeam/uploads/<date>-<episode-id>.json`

Report the final duration, technical format, loudness result, factual sources, AI disclosure, and scheduled video ID when applicable.
