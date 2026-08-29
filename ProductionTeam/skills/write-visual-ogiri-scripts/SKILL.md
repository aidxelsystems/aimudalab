---
name: write-visual-ogiri-scripts
description: Design visual-first Japanese "こんな〇〇は嫌だ" scripts with a topic proposal, 14 distinct image concepts, comedy structure, flip text, narration readings, rhythm, effects, and story.json-ready fields. Use when the ProductionTeam must propose a new episode topic, develop imageable jokes, prevent repetitive visuals, draft or revise 14-answer oogiri scripts, or convert comedy ideas into story.json.
---

# Write Visual Ogiri Scripts

## Objective

Build the joke from a readable one-frame image first, then write the flip as the second beat. Optimize the whole 14-answer performance rather than 14 isolated lines.

## Load References

- Read [structures.md](references/structures.md) when choosing a topic, episode shape, title-call placement, or ending.
- Read [comedy-techniques.md](references/comedy-techniques.md) when drafting or diagnosing jokes.
- Read [visual-design.md](references/visual-design.md) before proposing any of the 14 images or image prompts.
- Read [rhythm-and-linebreaks.md](references/rhythm-and-linebreaks.md) when ordering answers, assigning timing/SE, or formatting display text.
- Read [story-contract.md](references/story-contract.md) before editing or validating `story.json`.
- Read [reproducibility-gates.md](references/reproducibility-gates.md) before declaring a first draft or rendered revision complete.

## Workflow

1. Inspect the current `story.json` and recent locally available episodes. Identify repeated topics, dominant joke qualities, visual motifs, structures, and endings.
2. When no topic is given, generate five candidates. Reject a candidate unless it can immediately produce at least eight distinct concrete scenes. Score audience familiarity, visual range, AI-native possibilities, escalation, and novelty. Present the best three.
3. After topic approval, choose one primary structure, one rhythm technique, and optionally one ending technique. Do not use every learned technique in one episode.
4. Design all 14 image beats before polishing flip text. For each beat, specify the main subject, scene, action, one visible wrongness, composition, and one-second glance test.
5. Draft multiple boke candidates for weak slots. Make the flip react to or reframe the image instead of merely describing it.
6. Assign each non-relatable answer a comedy mechanism such as gap, betrayal, self-own, tendon, callback, viewpoint shift, or restrained wordplay.
7. Arrange the 14 beats for empathy, turn, acceleration, pause, recovery, and peak. Place title calls only at meaningful resets.
8. Format display text and separate narration readings. Assign duration, SE, and `visual_pre_roll` where the image must land first.
9. Run the visual diversity gate, continuity gates, and story contract. Replace weak, ambiguous, or abrupt slots instead of padding the set.
10. Let only the secretary agent write the final `story.json` and synchronize every changed representation.

## Non-Negotiable Gates

- Make every answer drawable as one vertical frame.
- Make the main wrongness understandable without reading text.
- Keep one primary visual joke per frame.
- Avoid three consecutive images with the same setting, camera distance, or subject arrangement.
- Mix close-ups, wide scenes, people, objects, UI/signage, reactions, and impossible scale.
- Keep important content outside the lower 25-30% occupied by the flip.
- Include a relatable entry, visual absurdity, rhythmic sequence, and callback or peak.
- Call a beat `伏線回収` only when the reveal changes the viewer's evaluation of the earlier oddity. Target `それはないだろ` at setup and `いや、すげー人じゃん` at payoff. Mere reappearance is tendon; mere explanation is seed disclosure.
- Make `a14` stronger through payoff, value reversal, category shift, or scale—not only louder randomness.
- Prefer a strange affection or benefit at the end when it fits: clearly undesirable, yet oddly appealing.
- Make every flip understandable when read alone: state the actor when context could be lost, and do not rely on the image to supply missing grammar.
- Preserve narrative identity across separated beats. Repeat the person, object, or relationship explicitly when a later clue would otherwise feel sudden.

## Output Contract

For each answer, produce:

```text
id, block, mechanism, flip_text, reading,
image_subject, image_scene, visual_wrongness,
composition, glance_test, image_prompt,
duration, se, optional visual_pre_roll,
optional tendon_group, optional peak
```

Do not declare the script ready until all 14 slots satisfy this contract.
