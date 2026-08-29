# Story JSON Contract

## Ownership

Only the secretary agent writes the final `story.json`. Other agents return proposals.

## Episode fields

Preserve or produce:

- `id`
- `odai` with display line breaks
- `odai_reading` without display breaks
- `theme`
- `bgm`
- `voice_dir`
- `title_after`
- exactly 14 `answers`
- `outro` and `outro_reading`
- `_notes` describing structure, title placement, viewer emotion, image direction, and effect direction

## Answer fields

Every answer requires:

- sequential `id` matching the project's established ID style;
- `text` with manual display breaks;
- `reading` with natural narration punctuation;
- `tag` that reflects its structural job;
- `duration` appropriate to speech and hold;
- `se` appropriate to the beat.

Add when used:

- `visual_pre_roll` around 0.55-0.75 for image-first discovery;
- `tendon_group` for intentional repeated motifs;
- `peak: true` for the final or designated peak.

## Consistency checks

- Parse the file as JSON.
- Confirm exactly 14 unique answer IDs.
- Confirm every `title_after` value references an answer ID.
- Confirm tendon groups are intentional and repeated.
- Confirm readings match changed wording and difficult pronunciations.
- Confirm duration is not shorter than the spoken line can support.
- Confirm SE timing described in `_notes` matches answer tags and effects.
- Preserve unrelated project-specific fields when revising an existing episode.
- For every wording change, update `text` and `reading` together.
- If wording changes after voice generation, regenerate narration, remeasure audio, regenerate the resolved JSON, type-check, and rerender.
- Confirm the rendered input imports the current resolved episode rather than a previous episode's durations or audio paths.
- Confirm image files exist and match in both `out/image` and `public/image`.

## Revision synchronization

Treat one line as four linked representations:

```text
display text → narration reading → generated WAV → resolved duration/audio path
```

Treat one visual beat as three linked representations:

```text
script meaning → image brief/prompt → out/image and public/image assets
```

Never update only the first item in either chain. After rerendering, verify the MP4 codec, dimensions, duration, size, and update time.

## Notes template

```json
"_notes": {
  "structure": "block-by-block technique and escalation",
  "title_call_placement": "positions and why each reset occurs",
  "viewer_emotion": "expected feeling by block",
  "image_direction": "visual variety and image-first blocks",
  "effect_direction": "SE, pauses, callbacks, and peak treatment"
}
```
