# 宇宙の歩き方｜第3回 火星 制作プロンプト

作成日: 2026-09-05 JST

## 制作契約

- エピソードID: `space-walk-guide-mars-03`
- 目標尺: 29〜32秒
- Flow素材: 縦9:16、各8秒、全2カット
- 図解・計器UI・終端画面: Remotionネイティブ実装
- AI表示: `AIによる宇宙旅行再現`
- 音楽: 既存の `Lab Rocket Switch.mp3` を再利用

## Flow Cut 1｜火星へ到着し、赤い平原へ着陸（8秒・9:16）

```text
Create an ultra-realistic vertical 9:16 cinematic fictional space-tourism reenactment, exactly 8 seconds, one continuous shot from immediately behind and slightly above a compact sealed descent capsule approaching the surface of Mars. Use the same fictional unbranded tour-capsule design as the series: dark heat shield, small cold-white navigation lights, stable geometry, and no readable markings. Keep the top 24 percent relatively simple for Japanese captions. Add no baked-in text.

0.0–1.2 seconds: begin immediately in fast controlled descent with the curved rust-red surface of Mars filling most of the middle and lower frame. Show broad cratered plains, layered mesas, shallow channels, and distant dusty highlands. Avoid a slow outer-space establishing shot.

1.2–3.0 seconds: descend through the extremely thin atmosphere. Use only a restrained ochre haze with no thick cloud layer. The terrain grows rapidly beneath the capsule, making the downward travel unmistakable. Maintain a beautiful premium travel-commercial mood.

3.0–5.2 seconds: approach a wide, level rocky plain. Reveal scattered dark basaltic rocks, fine reddish regolith, and a distant eroded ridge. The capsule performs small physically plausible stabilizing corrections. Do not show vegetation, liquid water, roads, buildings, or artificial landing infrastructure.

5.2–6.7 seconds: activate restrained downward landing thrusters. Pale exhaust distortion and a modest circular dust displacement appear beneath the capsule. Do not create a huge dust explosion or open flames.

6.7–8.0 seconds: complete a gentle upright landing on the rocky plain. The capsule remains intact and stable while the dust settles. Hold a clean final composition with the capsule centered below the caption-safe upper area, suitable for continuing into the second clip.

Scientific concept visualization, recognizable Mars-like geology, extremely thin atmosphere, dry rocky surface, enormous planetary scale, premium cinematic realism, controlled and nonviolent landing, no implication of documentary footage.

No astronaut outside yet, no exposed human, no human suffering, no crash, no explosion, no fireball, no parachute entanglement, no dense Earth-like clouds, no blue Earth sky, no rain, no snowstorm, no liquid ocean, no river, no green plants, no city, no base, no landing pad, no alien structure, no Earth visible as a large nearby planet, no duplicate spacecraft, no shape-changing spacecraft, no readable instrument panel, no numbers, no text, no letters, no subtitles, no logo, no watermark, no narration, no music, no sound effects, no camera cut.
```

## Flow Cut 2｜密閉宇宙服で一歩歩き、カプセルへ戻る（8秒・9:16）

```text
Create an ultra-realistic vertical 9:16 cinematic scientific concept visualization, exactly 8 seconds, one continuous shot continuing directly from the previous Mars landing clip. Match the same fictional unbranded compact tour capsule precisely: dark heat shield, small cold-white navigation lights, identical proportions, stable geometry, and no readable markings. Match the same rust-red rocky plain, distant ridge, ochre daylight, shadows, and camera direction. Keep the top 24 percent relatively simple for Japanese captions. Add no baked-in text.

0.0–1.3 seconds: begin with the intact tour capsule resting upright on the Martian plain as the last fine dust settles. A side hatch opens smoothly. Keep the scene calm and inviting, like the start of a premium guided excursion.

1.3–3.1 seconds: one adult traveler in a fully sealed fictional white-and-charcoal pressure suit carefully descends a short integrated ladder. The opaque reflective visor stays closed. The suit is unbranded, technically plausible, and consistent throughout the shot.

3.1–5.0 seconds: the traveler places both boots on the reddish regolith and takes one clear, cautious step away from the capsule. Show a small boot impression and a light puff of fine dust. Keep movement deliberate and physically grounded in lower Martian gravity without exaggerated bouncing.

5.0–6.5 seconds: the traveler pauses, looks down at the sunlit boots, then looks toward the helmet and the cold barren horizon as if noticing an unexpected environmental warning. Use body language only; show no readable display and no physical distress.

6.5–8.0 seconds: the traveler calmly turns back toward the open hatch and takes one step toward the capsule. Hold a clean final frame with both traveler and capsule visible for transition to the comedy line and end card.

Scientific concept visualization, safe fictional Mars excursion, dry rocky terrain, thin dusty atmosphere, restrained realism, one clearly readable walk-and-return action, stable character and spacecraft continuity.

No exposed face, no open visor, no second astronaut, no unsealed casual clothing, no human suffering, no suffocation, no collapse, no fall, no damaged suit, no torn hose, no blood, no gore, no body-temperature visualization, no frost forming on the person, no flames, no crash, no dust storm engulfing the person, no dense clouds, no vegetation, no liquid water, no city, no Mars colony, no alien, no readable instrument panel, no numbers, no text, no letters, no subtitles, no logo, no watermark, no narration, no music, no sound effects, no camera cut.
```

## Remotion｜足元は約24℃、頭の高さは約0℃

```text
Canvas: 1080x1920, 30 fps. Build a native Remotion environmental-temperature comparison over the moving Mars landing and walking footage. Do not imitate a real spacecraft or spacesuit manufacturer interface.

Begin with a calm destination panel reading 「目的地　火星」 and a small badge 「宇宙の歩き方　第3回」. Keep the descending capsule and Martian landscape visible. At the first reveal, show the qualifier 「赤道付近・昼の一例」 above the main measurement.

First beat: track a warm coral ring around the traveler's boots or the lower edge of the capsule and reveal 「足元 約24℃」 in large text. Briefly use a soft spring-like color palette so the arrival feels unexpectedly comfortable.

Second beat: extend a simple vertical guide from the boots to helmet height. Change the upper region to icy cyan and reveal 「頭の高さ 約0℃」. Keep both values visible together with the headline 「足元は春／頭は冬」. The contrast must read within one second on a phone screen.

Clarify visually that these are environmental temperatures at different heights, not the person's internal body temperature. Use the support label 「地表付近の環境温度」. Do not color or deform the human body itself.

Third beat: show a simplified warm ground releasing a small number of heat particles upward into a very thin atmosphere. The particles spread and fade quickly. Transition to the explanation card 「火星は大気が非常に薄い」 without inventing a detailed atmospheric simulation.

Disclosure: 「AIによる宇宙旅行再現・概念図」. Footer source: 「出典: NASA Mars Facts」 above the Shorts interface danger zone.

Large readable Japanese typography, premium fictional space-tourism design, restrained rust-red and cyan palette, continuous visual motion, no cluttered telemetry, no fake body scan, no invented measurement, no tiny copy, no UI collision.
```

## Remotion｜薄い大気と地表気圧の比較

```text
Canvas: 1080x1920, 30 fps. Create a bold native Remotion scientific comparison over a slowly moving Martian horizon. This is a conceptual diagram and must not imply scale-accurate atmospheric thickness.

First beat: place simplified Earth and Mars discs side by side with equal visual prominence but visibly different actual planet sizes. Draw a thick blue atmospheric halo around Earth and a very thin rust-colored halo around Mars. Use the heading 「火星の大気は非常に薄い」.

Second beat: replace the planets with two large pressure columns. Label the Earth column 「地球 1」 and the much shorter Mars column 「火星 1/100未満」. Add the explicit heading 「地表気圧の比較」. Do not animate pressure crushing a person or spacecraft.

Third beat: reveal a large molecule card 「主成分　二酸化炭素 CO₂」, followed by the conclusion 「そのまま呼吸できない」. Keep the sealed spacesuit icon intact beside the conclusion and add 「密閉宇宙服が必要」 as the final support line.

Final comparison frame: show three large cards arriving one at a time: 「大気が薄い」, 「呼吸できない」, 「宇宙服が必要」. Keep all three readable for at least one second before the end-card transition.

Disclosure: 「概念図」. Footer sources: 「出典: NASA Mars Facts / NASA InSight Press Kit」. Use no human suffering, no suffocation animation, no exposed body, no fake survival timer, no radiation symbol, no invented percentages beyond the cited pressure comparison, no tiny labels, no UI collision.
```

## Remotion｜終端画面

```text
Canvas: 1080x1920, 30 fps, approximately 4 seconds. Continue the moving Martian plain and the safely suited traveler returning toward the landed capsule instead of switching to a blank card.

0.0–1.0 seconds: display 「散歩日和なのに」 in large white text. Briefly keep both temperature labels visible beside a simple vertical traveler silhouette.

1.0–2.0 seconds: remove the cold upper label, circle only the warm boots, and punch in 「足元だけなんかい！」 in warm yellow with one dry comedy impact.

2.0–3.0 seconds: move the punchline upward and reveal 「火星、歩いてみたい？」 with two compact choice chips: 「歩いてみたい」 and 「カプセルから見る」.

2.0–4.0 seconds: keep 「チャンネル登録もよろしく！」 visible in a large cyan rounded panel for at least two seconds. Keep the traveler fully suited and safely beside the capsule.

Include the small series badge 「宇宙の歩き方」. Keep essential content inside the central Shorts safe area. End cleanly with no fade-out.

No empty white page, no static star field alone, no tiny CTA, no fake platform buttons, no exposed human, no teaser text, no UI collision.
```

## 音楽・編集

- `Lab Rocket Switch.mp3`を木星・金星回と同じシリーズ音として再利用する。
- 0秒は上品な到着チャイム。火星の地表へ向かう動きを最初のフレームから見せる。
- 2秒の`足元 約24℃`は暖かい肯定音にし、一度安心させる。
- 6秒の`頭の高さ 約0℃`でBGMを約0.2秒抜き、寒色への反転と短い冷却音を入れる。
- 8.1秒のずんだもんの反応前に0.1〜0.2秒の隙間を作る。
- シリーズ名は背景を止めず、0.7秒程度で表示する。
- 12〜22秒はFlow Cut 2とRemotion図解を交互に使い、説明だけの静止画を3秒以上続けない。
- 最大の衝撃音は`地球の1/100未満`に使い、`CO₂`は小さな確認音に留める。
- オチ直前に0.2秒前後の無音ポケットを作る。
- CTAは最低2秒維持し、フェードアウトせず終了する。

## 投稿文案

タイトル:

```text
火星に着陸すると人はどうなる？足元は春、頭は冬 #Shorts
```

説明文:

```text
火星の赤道付近の昼。足元付近は約24℃でも、頭の高さでは約0℃に感じられることがあります。
しかも火星の地表気圧は地球の100分の1未満。大気の主成分は二酸化炭素なので、そのまま呼吸することはできません。

散歩日和、足元だけなんかい！
火星、歩いてみたい？

※温度は場所、季節、時刻で大きく異なります。
※AIによる架空の宇宙旅行再現・概念図を含みます。実際の有人火星飛行記録ではありません。

【参考資料】
NASA Science「Mars Facts」
https://science.nasa.gov/mars/facts/

NASA「Mars InSight Landing Press Kit – Mars at a Glance」
https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/mars_insight_landing_presskit.pdf

映像：Flow AI生成／Remotion編集
音声：VOICEVOX 青山龍星、VOICEVOX ずんだもん
BGM：Lab Rocket Switch（Suno AI生成・既存曲を再利用）

#火星 #宇宙 #科学 #雑学 #AI動画 #Shorts
```

固定コメント:

```text
火星、歩いてみたい？
A：歩いてみたい
B：カプセルから見る

次に旅行してほしい天体も教えてください。
```

