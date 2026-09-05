# 宇宙の歩き方｜第2回 金星 制作プロンプト

作成日: 2026-09-04 JST

## 制作契約

- エピソードID: `space-walk-guide-venus-02`
- 目標尺: 29〜32秒
- Flow素材: 縦9:16、各8秒、全2カット
- 図解・計器UI・終端画面: Remotionネイティブ実装
- AI表示: `AIによる宇宙旅行再現`
- 音楽: 既存の `Lab Rocket Switch.mp3` を再利用

## Flow Cut 1｜金星へ到着し、硫酸の雲へ突入（8秒・9:16）

```text
Create an ultra-realistic vertical 9:16 cinematic fictional space-tourism reenactment, exactly 8 seconds, one continuous shot from immediately behind and slightly above a compact sealed descent capsule entering the atmosphere of Venus. The same fictional unbranded tour capsule design used by the series has a dark heat shield, small cold-white navigation lights, stable geometry, and no readable markings. Keep the top 24 percent relatively simple for Japanese captions. Add no baked-in text.

0.0–1.3 seconds: begin immediately at high speed above a vast pale-yellow Venus cloud deck. The capsule descends toward the clouds while the curved planet fills the frame. The opening should initially feel beautiful and inviting, like a premium travel commercial.

1.3–3.0 seconds: the capsule enters dense cream, sulfur-yellow, and muted amber clouds. Cloud layers rush upward past the camera, making the descent unmistakable. Visibility drops and the cold navigation lights become prominent. Do not show rain striking the surface.

3.0–5.2 seconds: move deeper beneath the main cloud layer. The atmosphere becomes darker orange-brown and increasingly oppressive. Add restrained hull heat shimmer and smooth compression waves around the capsule, while keeping it intact and recognizable.

5.2–6.8 seconds: move deeper through the main cloud layer. The atmosphere becomes darker orange-brown and increasingly oppressive. Keep the surface hidden so the descent still feels unresolved.

6.8–8.0 seconds: hold the capsule inside a deep amber opening between cloud layers. Keep it centered and stable with heat shimmer increasing. Leave a clean editing handle that connects naturally to the second clip.

Scientific concept visualization, enormous planetary scale, dense carbon-dioxide atmosphere, sulfuric-acid cloud appearance without acid rain reaching the ground, extreme heat suggested through distortion rather than flames, premium cinematic realism, restrained danger, physically coherent descent.

No astronaut outside, no exposed human, no human suffering, no explosion, no crash, no landing impact, no molten lava ocean, no flames engulfing the capsule, no Earth-like clouds, no blue sky, no green plants, no liquid ocean, no city, no alien structure, no lightning striking the capsule, no duplicate spacecraft, no shape-changing spacecraft, no readable instrument panel, no numbers, no text, no letters, no subtitles, no logo, no watermark, no narration, no music, no sound effects, no camera cut.
```

## Flow Cut 2｜地表付近、熱と圧力で引き返す（8秒・9:16）

```text
Create an ultra-realistic vertical 9:16 cinematic scientific concept visualization, exactly 8 seconds, one continuous shot continuing directly from the previous Venus descent clip. Match the same fictional unbranded compact tour capsule precisely: dark heat shield, small cold-white navigation lights, identical proportions, stable geometry, and no readable markings. Match the dense amber-brown atmosphere and warm directional lighting. Keep the top 24 percent relatively simple for Japanese captions. Add no baked-in text.

0.0–1.4 seconds: begin with the capsule emerging downward from dense amber clouds. Reveal a barren Venusian landscape far below through thick orange haze: broad volcanic plains, low rounded highlands, scattered dark rocks, and no vegetation or liquid water. The capsule has not landed.

1.4–3.2 seconds: descend closer to the surface. Strong heat shimmer distorts the distant terrain and the lower edge of the capsule. Smooth atmospheric compression waves form around the hull, suggesting extreme pressure without showing literal gauges or numbers.

3.2–5.1 seconds: the compression waves tighten and the cold-white navigation lights flicker once. The capsule remains intact, but performs small physically plausible stabilizing corrections. Do not crush, melt, or deform the vehicle.

5.1–6.6 seconds: the descent stops before touchdown. The capsule tilts slightly, activates restrained upward thrusters, and begins a controlled retreat away from the surface. Use pale exhaust distortion only, not dramatic flames.

6.6–8.0 seconds: rise back into the thick cloud layer while the hostile orange landscape recedes below. Hold a clean final view of the intact capsule escaping upward for transition into the comedy line and end card.

Scientific concept visualization, dense carbon-dioxide atmosphere, extreme heat represented by optical distortion, extreme pressure represented by smooth compression waves, volcanic Venusian terrain, premium cinematic realism, restrained public-science danger, clear descent-to-retreat story.

No astronaut outside, no exposed human, no human suffering, no body, no gore, no explosion, no crash, no landing, no crushed capsule, no melting capsule, no molten lava ocean, no open flames, no acid rain reaching the ground, no Earth-like blue sky, no green plants, no liquid ocean, no city, no alien structure, no lightning striking the capsule, no duplicate spacecraft, no shape-changing spacecraft, no readable instrument panel, no numbers, no text, no letters, no subtitles, no logo, no watermark, no narration, no music, no sound effects, no camera cut.
```

## Remotion｜約467℃への到着警告

```text
Canvas: 1080x1920, 30 fps. Build a native Remotion fictional arrival interface over the Venus descent footage. Do not imitate a real spacecraft manufacturer interface.

Begin with a calm white destination panel reading 「目的地　金星」 and a small series badge 「宇宙の歩き方　第2回」. Keep the moving capsule and cloud depth visible.

At the words 「外、約467度です」, rapidly change the destination panel from white and cyan to amber and red-orange. Reveal 「地表温度　約467℃」 in very large numerals. Apply restrained heat distortion to the panel edges and a single decisive warning pulse. Do not flash the entire screen repeatedly.

Next, display two equal-size planet silhouettes labeled 「地球」 and 「金星」 with the heading 「大きさはほぼ同じ」. Hold this reassuring comparison briefly, then surround only Venus with heat waves and transition to 「でも、太陽系で最も高温」.

Disclosure: 「AIによる宇宙旅行再現・概念図」. Footer source: 「出典: NASA Venus Facts」 above the Shorts interface danger zone.

Large readable Japanese typography, premium fictional space-tourism design, warm Venus palette, continuous visual motion, no cluttered telemetry, no invented measurements, no tiny copy, no UI collision.
```

## Remotion｜気圧93倍と硫酸の雲

```text
Canvas: 1080x1920, 30 fps. Create a bold native Remotion scientific comparison over animated amber Venus cloud layers.

First beat: place a small capsule icon at center. Show one thin cyan ring labeled 「地球 1」. Replace it with many tightly spaced orange pressure rings closing around the capsule and the large text 「金星の地表 約93倍」. Keep the capsule intact; this is a pressure comparison, not a destruction scene. Add the smaller support line 「水深 約930mに相当」.

Second beat: pull the view upward through a simplified atmospheric cross-section. Draw dense cloud particles in the upper layer and label them 「硫酸の雲」. Show droplets fading and evaporating before reaching the hot surface; do not show acid rain pooling or striking a person.

Third beat: combine three large danger cards, arriving one at a time: 「約467℃」, 「気圧 約93倍」, 「硫酸の雲」. Keep all three visible for one final comparison frame with the headline 「人がそのまま歩ける環境ではない」.

Disclosure: 「概念図」. Footer: 「出典: NASA Venus Facts」. Use no human body, no gore, no crushing animation, no fake survival timer, no invented values, no tiny labels, no UI collision.
```

## Remotion｜終端画面

```text
Canvas: 1080x1920, 30 fps, approximately 4 seconds. Continue moving Venus clouds and heat haze instead of switching to a blank card. A small fictional tour capsule retreats upward in the background.

0.0–1.0 seconds: display 「地球の姉妹なのに」 in large white text. Briefly show equal-size Earth and Venus icons side by side.

1.0–2.0 seconds: dense orange pressure rings close around the Venus icon without damaging it. Punch in 「圧が強すぎるんかい！」 in warm yellow with one dry comedy impact.

2.0–3.0 seconds: move the punchline upward and reveal 「金星、降りてみたい？」 with two compact choice chips: 「行ってみたい」 and 「上空からで十分」.

2.0–4.0 seconds: keep 「チャンネル登録もよろしく！」 visible in a large cyan rounded panel. It must remain readable for at least two seconds and must not appear only in the final frames.

Include the small series badge 「宇宙の歩き方」. Keep essential content inside the central Shorts safe area. End cleanly with no fade-out.

No empty white page, no static star field alone, no tiny CTA, no fake platform buttons, no teaser text, no UI collision.
```

## 音楽・編集

- `Lab Rocket Switch.mp3` を木星回と同じシリーズ音として再利用する。
- 0秒は上品な到着チャイム。2秒の `約467℃` で低い警告音へ反転する。
- Cut 1は0〜8秒の到着と雲への突入、Cut 2は11〜23秒の地表接近と退避に使う。
- 2本とも速度変更とクロップで全景・船体寄りへ見せ分け、Remotion図解を間に差し込む。
- 9.6秒の `旅行しやすそう` でBGMを薄くし、11.3秒の温度再提示で強い熱波音を入れる。
- `約467℃`、`約93倍`、`硫酸の雲`は同じ強さにせず、最大の衝撃音は最初の温度表示だけに使う。
- ずんだもんの反応前には0.1〜0.2秒の隙間を作り、掛け合いを聞き取りやすくする。
- オチ直前に0.2秒前後の無音ポケットを作る。
- CTAは2秒維持し、フェードアウトせず終了する。

## 投稿文案

タイトル:

```text
金星に着陸すると人はどうなる？約467℃・気圧93倍 #Shorts
```

説明文:

```text
地球とほぼ同じ大きさの「姉妹惑星」金星。
ところが地表は約467℃、気圧は地球の約93倍。さらに厚い雲は硫酸からできています。

姉妹惑星、圧が強すぎるんかい！
金星、降りてみたい？

※AIによる架空の宇宙旅行再現・概念図を含みます。実際の有人飛行記録ではありません。

【参考資料】
NASA Science「Venus Facts」
https://science.nasa.gov/venus/venus-facts/

#宇宙 #金星 #科学 #雑学 #AI動画 #Shorts
```

固定コメント:

```text
金星、降りてみたい？
A：行ってみたい
B：上空からで十分

次に旅行してほしい天体も教えてください。
```
