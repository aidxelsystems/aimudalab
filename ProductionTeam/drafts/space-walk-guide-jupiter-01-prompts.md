# 宇宙の歩き方｜第1回 木星 制作プロンプト

作成日: 2026-09-03 JST

## 制作契約

- エピソードID: `space-walk-guide-jupiter-01`
- 目標尺: 29〜32秒
- Flow素材: 縦9:16、8秒、全2カット（格納済み・1080×1920）
- 図解・航法UI・終端画面: Remotionネイティブ実装
- AI表示: `AIによる宇宙旅行再現`
- 音楽: 既存の `Lab Rocket Switch.mp3` を再利用

## Gemini Omni｜木星へ降下、地面が現れない（10秒・9:16・この1本のみ生成）

```text
Create an ultra-realistic vertical 9:16 cinematic fictional space-tourism reenactment, exactly 10 seconds, one continuous shot from immediately behind and slightly above a compact sealed descent capsule approaching Jupiter. The enormous curved planet fills almost the entire lower and middle frame, with scientifically recognizable cream, tan, rust-red, and pale orange cloud bands and turbulent oval storms. The capsule is a clearly fictional unbranded vehicle with a dark heat shield, small cold-white navigation lights, and no readable markings. Keep the top 24 percent relatively dark and uncluttered for Japanese title captions. Add no baked-in text. This is the only generated footage required for the episode, so include a clean approach, cloud entry, and a stable deep-cloud ending that can be reused and reframed in editing.

0.0–1.4 seconds: begin instantly at high speed. The capsule drops toward Jupiter and the planet rapidly grows beneath it. Use a controlled forward push and strong scale change, with no slow space establishing shot.

1.4–3.1 seconds: the capsule crosses the upper haze and enters the first cloud layer. Thin amber cloud ribbons sweep upward past the camera, making the downward motion unmistakable. The capsule remains intact and centered.

3.1–5.5 seconds: reveal layer after layer of turbulent clouds below, but never reveal rock, ocean, platform, horizon ground, or any solid landing surface. A restrained searchlight scans downward and disappears into the cloud depth without finding a floor.

5.5–8.0 seconds: descend deeper. The light becomes dimmer and warmer, cloud motion becomes denser, and the capsule makes small physically plausible stabilizing corrections. Maintain a premium tourism-commercial look turning into suspense.

8.0–10.0 seconds: hold the capsule suspended above an apparently bottomless opening between swirling cloud bands. Keep the camera and capsule stable while the clouds continue flowing upward. This final two-second handle will be looped beneath Remotion graphics.

Scientific visual plausibility, Jupiter-inspired banded atmosphere, immense planetary scale, strong vertical descent, premium cinematic realism, restrained danger, stable spacecraft geometry, no implication of documentary footage.

No astronaut outside the vehicle, no exposed human, no solid surface, no rocky ground, no ocean surface, no landing pad, no city, no alien structure, no rings around Jupiter, no Saturn appearance, no explosion, no crash, no fireball, no gore, no body, no lightning striking the capsule, no duplicate spacecraft, no shape-changing spacecraft, no readable instrument panel, no text, no letters, no subtitles, no logo, no watermark, no narration, no music, no sound effects, no camera cut.
```

## Remotion｜着陸地点を検索しても見つからない

```text
Canvas: 1080x1920, 30 fps. Build a native Remotion navigation-search animation over moving Jupiter cloud layers. Do not generate a raster dashboard and do not imitate a real spacecraft manufacturer interface.

Background: multiple horizontal cream, tan, orange, and rust cloud bands moving upward at different speeds. Add subtle turbulence using distorted SVG paths. The entire composition must communicate continuous downward travel.

Header: small series badge 「宇宙の歩き方」 and episode label 「第1回・木星」. Main question 「着陸地点を検索中…」 appears in large white Japanese text.

Center: a cyan scanning ring repeatedly travels downward through cloud layers. Each time it reaches a possible horizontal boundary, that line dissolves into particles instead of becoming ground. Show three successive failed detection beats, increasing speed each time.

Search result: after the third failure, stop the sound and stamp 「該当なし」 in large warm-yellow text. Immediately replace it with the scientific reveal 「木星には本当の意味での地表がない」. Highlight 「地表がない」 in red-orange.

Side indicators: left label 「降下中」 with an arrow continuing below the frame; right labels 「圧力 上昇中」 and 「温度 上昇中」. Do not display invented numbers, percentages, altitude, pressure, or temperature values.

Disclosure: 「AIによる宇宙旅行再現・概念図」. Footer source: 「出典: NASA Jupiter Facts」 above the Shorts interface danger zone.

Style: premium fictional space-tourism UI, strong depth, highly readable Japanese typography, restrained cyan and amber accents, one decisive warning beat, no cluttered telemetry, no pseudo-scientific measurements, no tiny copy, no UI collision.
```

## Remotion｜圧力・温度上昇の断面演出

```text
Canvas: 1080x1920, 30 fps. Create a bold native Remotion conceptual cutaway showing a small capsule descending through Jupiter's atmosphere. This is an explanatory animation, not a literal cross-section to scale.

Use four stacked atmospheric zones that move upward: pale ammonia-cloud colors, dense tan gas, dark amber fluid-like hydrogen, and a deep red-orange high-pressure region. Do not draw a solid floor or a sharply bounded solid core.

Animate the capsule downward while concentric pressure rings close around it. On the right, animate two simple vertical indicators labeled 「圧力」 and 「温度」, both changing from cyan to amber to red. Use only the word 「上昇」; do not invent numeric values.

Reveal the sequence in three large verbs, one at a time: 「押し潰される」 → 「溶ける」 → 「蒸発する」. The capsule icon compresses, softens, and then becomes particles. Keep it technical and non-graphic.

Headline: 「地面へ着く前に 機体が耐えられない」. Footer: 「出典: NASA Jupiter Facts」. Disclosure: 「概念図」.

No person, no gore, no explosion, no hard surface, no dramatic fake number, no radiation warning symbol, no flashing full-screen red, no tiny labels, no UI collision.
```

## Remotion｜終端画面

```text
Canvas: 1080x1920, 30 fps, approximately 4 seconds. Continue the moving Jupiter atmosphere instead of switching to a blank card.

Background: a large curved Jupiter horizon occupies the middle and lower screen, with slow-moving cream and orange cloud bands. Add a small fictional tour capsule retreating upward toward space.

0.0–1.0 seconds: display 「宇宙の歩き方なのに」 in large white text.

1.0–2.0 seconds: a giant white boot-print icon approaches the cloud tops, sinks through them, and disappears. At the exact disappearance frame, punch in 「歩く場所ないんかい！」 in warm yellow with one dry comedy impact.

2.0–3.0 seconds: shift the punchline upward and reveal the question 「木星、降りてみたい？」 with two compact choice chips: 「行きたい」 and 「遠慮します」.

2.0–4.0 seconds: keep 「チャンネル登録もよろしく！」 visible in a large cyan rounded panel. The CTA must remain readable for at least two seconds and must not wait until the final few frames.

Include the small series badge 「宇宙の歩き方」. Keep essential content inside the central Shorts safe area. End with a clean upbeat button sound and no fade-out.

No empty white page, no static star field alone, no tiny CTA, no teaser for the next episode, no fake platform buttons, no UI collision.
```

## 音楽・編集

- 既存の `Lab Rocket Switch.mp3` を冒頭から再利用する。
- 0秒は到着チャイムを一瞬だけ鳴らし、1.5秒以内に低い警告音へ反転。
- 2.1秒の「地面がありません」でBGMを約0.2秒抜く。
- 7〜15秒は雲の流れと検索リングを止めず、説明への切り替わりを視覚的に作らない。
- `該当なし`、`地表がない`、`押し潰される`のうち、最大の衝撃音は`地表がない`だけに使う。
- オチ直前に0.15〜0.25秒の無音ポケットを作る。
- 最後はCTA表示を2秒維持し、フェードアウトせず終了する。

## 投稿文案

タイトル:

```text
木星に着陸すると人はどうなる？地面がない惑星 #Shorts
```

説明文:

```text
木星に着陸しようとすると、人はどうなるのでしょうか？
実は木星には、本当の意味で着陸できる固体の地表がありません。さらに深く進むほど圧力と温度が上がり、NASAは侵入する宇宙船が押し潰され、溶け、蒸発すると説明しています。

宇宙の歩き方なのに、歩く場所ないんかい！
木星、降りてみたい？

※AIによる架空の宇宙旅行再現・概念図を含みます。実際の有人飛行記録ではありません。

【参考資料】
NASA Science「Jupiter Facts」
https://science.nasa.gov/jupiter/jupiter-facts/

映像：Flow AI生成／Remotion編集
音声：VOICEVOX 青山龍星、VOICEVOX ずんだもん
BGM：Lab Rocket Switch（Suno AI生成・既存曲を再利用）

#木星 #宇宙 #Shorts
```
