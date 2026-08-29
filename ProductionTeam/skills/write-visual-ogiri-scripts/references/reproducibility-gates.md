# Reproducibility Gates

Apply these gates to every first draft and every revision. The secretary must reject the episode if any gate fails.

## 1. Standalone line gate

Read each `text` without its image or neighboring answers.

- Identify who acts, what happens, and what is abnormal.
- State the actor when omission creates more than one interpretation.
- Prefer `女将のあいさつが、なぜか敬礼` over a phrase whose actor or action must be inferred.
- Reject passive phrases such as `もう磨かれている` when the target or agent is unclear. Prefer a visible action such as `靴を脱ぐ前から、足ごと磨いてくる`.

## 2. Image agreement gate

Read the line while viewing only its assigned image.

- Confirm the image shows the same actor, object, and action.
- Confirm the flip adds reaction or interpretation instead of repairing missing information.
- Revise the line and image brief together when either changes meaning.

## 3. Subject continuity gate

For any person, object, or motif returning after two or more intervening answers:

- Name it again in the returning clue.
- Do not assume the viewer remembers an implicit subject.
- Use the same visual identity markers in setup, clue, and payoff.

Example:

```text
setup: 女将のあいさつが、なぜか敬礼
bridge: 女将の夜の見回り、館内じゃなくて街全体
payoff: 女将、実は元府警の幹部で、今も街を守っている
```

The word `女将` in the bridge prevents `夜の見回り` from arriving as an unrelated new topic.

## 4. Causal bridge gate

Map each narrative payoff as:

```text
odd setup → observable clue → causal reveal → present proof of value
```

- Make the clue narrower than the reveal: point toward the answer without giving it away.
- Make the reveal explain both setup and clue.
- Show a present admirable action; a past title alone is exposition.
- For伏線回収, record `それはないだろ → いや、すげー人じゃん`.

If no causal arrow can be written between adjacent stages, insert a bridge or replace the payoff.

## 5. Role-separated review gate

- Structure writer: verify setup, bridge, reveal, and emotion curve.
- Boke writer: verify each scene works as one visible action.
- Tsukkomi writer: verify standalone grammar, subject, and spoken clarity.
- Rhythm agent: verify the bridge reactivates memory without spoiling the reveal.
- Secretary: resolve conflicts, edit `story.json`, and run all gates again.

No specialist may rely on another specialist to repair a known ambiguity later.

## 6. Artifact synchronization gate

After any wording revision:

1. Update display `text`.
2. Update narration `reading`.
3. Update the visual brief if meaning changed.
4. Regenerate narration WAV.
5. Remeasure audio into the resolved JSON.
6. Confirm the render imports the current resolved JSON.
7. Type-check.
8. Rerender the MP4.
9. Probe dimensions, codec, duration, size, and update time.

After an image revision, synchronize both `out/image/aNN.png` and `public/image/aNN.png`, then compare hashes before rendering.

## 7. Final secretary checklist

- Exactly 14 unique answer IDs.
- Every line passes the standalone line gate.
- Every image passes the one-second glance test.
- Returning subjects are explicitly named at the bridge.
- Every claimed伏線回収 contains evaluation reversal.
- No new topic appears without a visible or verbal bridge.
- `text`, `reading`, image brief, WAV, resolved JSON, and rendered MP4 agree.
- The final MP4 is the most recently rendered artifact.

