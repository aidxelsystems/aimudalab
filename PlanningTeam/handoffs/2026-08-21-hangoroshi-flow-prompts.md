# 徳島「半ごろし」Google Flow映像プロンプト

作成日: 2026-08-21  
形式: 9:16、各8秒、2カット  
狙い: 強い緊張から、明るくおいしい和菓子への急激な緩和

## Cut 1 — 強い緊張「米を半ごろしにする」

```text
Create an intense 8-second vertical 9:16 cinematic food sequence, photorealistic, set on a dark rustic wooden table in rural Tokushima, Japan. This is strictly non-violent traditional food preparation.

From the very first frame, show an extreme close-up of a heavy wooden surikogi pestle suspended directly above a steaming wooden bowl filled with freshly cooked Japanese glutinous rice and short-grain rice. The pestle must feel enormous and ominous in the frame. Use harsh low-key lighting, deep black shadows, cold blue-gray tones, a narrow red rim light, dense steam, very high contrast, and a tense shallow depth of field. Leave the upper-center area relatively dark and visually simple for large Japanese title text to be added later.

At 1 second, the wooden pestle suddenly drives down into the hot rice with a powerful impact. Add a brief realistic camera jolt at the exact moment of contact. Immediately push the camera rapidly toward the crushed rice. Show the grains stretching and compressing in extreme macro detail: roughly half of the rice grains remain clearly visible while the other half becomes sticky and mashed. The movement should feel forceful, urgent, and unsettling, but still clearly be ordinary food preparation.

During the final 2 seconds, slow the motion dramatically. The pestle rises again through thick steam above the half-mashed rice, stopping just before a second impact, leaving the action unresolved and suspenseful.

No cuts to a finished dish. No cheerful mood. No faces. Only clean hands if absolutely necessary. No weapons, no blood, no gore, no injury, no threatening person, no horror creature. No text, no subtitles, no logos, no labels, no music performance, no kitchen clutter. Anatomically correct hands and physically realistic rice texture. Commercial-quality 1080p food cinematography.
```

## Cut 2 — 強い緩和「正体は甘いおはぎ」

```text
Create a joyful 8-second vertical 9:16 Japanese confectionery commercial, photorealistic, continuing with the exact same partially mashed rice mixture from the previous clip, but with a sudden and unmistakable emotional shift from tension to warmth.

From the first frame, replace the dark dramatic atmosphere with bright warm morning sunlight, soft golden highlights, gentle pastel colors, and a calm welcoming rural Japanese kitchen. Show clean hands quickly and skillfully flattening the partially mashed rice mixture, placing a smooth round ball of glossy red bean paste in the center, and wrapping the rice around it. Many individual rice grains must remain visible in the sticky outer layer so it clearly looks only half mashed.

Transition smoothly into the finished local sweet: an oval yomogi-green rice cake filled with red bean paste and lightly dusted with golden kinako powder. Show a clean cross-section opening to reveal the rich glossy red bean filling and the visible rice-grain texture. A tiny cloud of kinako floats beautifully through a sunbeam. Use an appetizing slow-motion macro shot, a gentle camera orbit, soft steam, and rich natural food texture.

End on an irresistible hero shot of three finished hangoroshi sweets on a simple dark Japanese ceramic plate, one cut open toward the camera, with warm tea softly blurred in the background. The final mood must feel safe, sweet, comforting, and slightly funny because it is such a peaceful dessert after the ominous first clip. Leave some clean upper-center space for later captions.

No dark or scary lighting. No faces, no crowd, no extra people, no text, no subtitles, no logos, no packaging, no labels, no modern appliances, no excessive props. No chocolate, no cream, no fruit filling, no Western pastry, no smooth mochi exterior: visible partially crushed rice grains are essential. Anatomically correct hands, realistic food physics, premium 1080p Japanese food advertising cinematography.
```

## 編集時のギャップ設計

- 1カット目は暗い低音、心拍、打撃音、短いカメラ振動。
- 2カット目へはフェードせず、明るい画面へハードカットする。
- 切り替えと同時に低音を止め、軽い木琴または鈴の音を入れる。
- 冒頭表示は `この米、半ごろしにします`。
- 2カット目の最初で `正体は、甘いおはぎ。` と回収する。
- 最終オチは `全部つぶすと、みなごろし。名前が物騒すぎる！`。

## 事実確認

- 農林水産省「半ごろし 徳島県」  
  https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/44_8_tokushima.html

公開時は公式表記に合わせ、漢字の「半殺し」ではなく「半ごろし」を使用する。

## Suno AI BGMプロンプト

設定:

- Instrumental: ON
- 目標尺: 30秒前後
- タイトル: `Half-Crushed, Fully Sweet`

Style of Music:

```text
A 30-second instrumental Japanese cinematic comedy cue for a vertical food short, built around an extreme tension-and-release contrast. No vocals, no spoken words, no choir.

0:00–0:08 — serious culinary suspense, genuinely tense and ominous: deep taiko heartbeat, low bowed bass, sparse wooden hyoshigi clicks, cold metallic pulse, restrained dissonant shakuhachi breath, dark low-register strings, 72 BPM, hard accents, rising pressure, very little melody. It should feel as if something irreversible is about to happen, but not like graphic horror.

At exactly 0:08 — an abrupt complete stop, a very short moment of silence, then one dry wooden clack. No fade and no smooth transition.

0:08–0:25 — sudden bright emotional release: warm shamisen plucks, playful koto, marimba, pizzicato strings, light hand claps and cheerful acoustic percussion, switching instantly to 132 BPM. The mood becomes a charming, delicious Japanese confectionery commercial: sweet, safe, warm, lively and slightly ridiculous. Keep the melody simple and leave plenty of space for Japanese narration.

0:25–0:30 — build to a clean comedic ending with two quick shamisen notes and one decisive taiko “don” as the punchline button. End firmly, no fade-out.

High dynamic contrast between the two sections, clean modern mix, punchy transients, minimal reverb, narration-friendly midrange, memorable but not busy, premium Japanese TV food-commercial production.
```

Exclude Styles:

```text
vocals, singing, spoken dialogue, choir, lyrics, cute music from the first second, smooth crossfade, ambient-only, lo-fi, heavy metal, distorted guitar, EDM festival drop, trap beat, epic superhero trailer, graphic horror, long intro, fade-out
```

## 冒頭タイトルと「ドーン」の実装仕様

### 0.00〜0.25秒

- 杵が米の上で止まっている強い画をフレーム0から表示する。
- フェードインや白画面から開始しない。
- BGMは低い心拍だけ。字幕はまだ出さない。

### 0.25〜1.75秒

画面中央へ警告タイトルを表示する。

```text
この米、
半ごろしにします
```

デザイン:

- `この米、`は白、約74px、太字。
- `半ごろし`は赤、約136px、極太。白い内縁と太い黒縁を付ける。
- `にします`は白、約82px。
- 全体幅は約940px。左右70px以上を空ける。
- 背景へ黒の縦グラデーションを40〜55%重ね、マナーモードでも一瞬で読めるようにする。
- 文字は0.12秒で急拡大し、1.75秒まで完全に静止させて読ませる。

### 1.75〜1.95秒

- 映像、文字、BGMを約0.2秒だけ静止させる。
- 視聴者に杵が落ちる瞬間を待たせる。

### 1.95秒：ドーン

- 杵が米へ着地するフレームへ合わせる。
- 太鼓とサブベースの低音を同時に鳴らす。
- 画面全体を約12px、8フレーム振動させる。
- 1〜2フレームだけ露出を上げ、赤橙色の衝撃輪を広げる。
- `半ごろし`の文字だけ一度1.35倍へ膨張させ、中央からひびが入ったように上下へ割って消す。
- 米粒を模した白い小さな粒を画面外側へ飛ばす。
- 漫画文字の `ドーン` は表示しない。音と映像でドーンを感じさせる。

### 2.0〜8.0秒

- すりこぎが米をつぶすマクロ映像へ高速プッシュイン。
- 通常字幕は下部中央へ戻す。
- `米粒を半分だけ残す`まで正体を言い切らず、緊張を維持する。

### 8秒地点：緩和

- 暗い映像から、明るい和菓子映像へフェードなしでハードカットする。
- Suno BGMも同じ位置で完全に切り替える。
- 表示は `正体は、甘いおはぎ。`。

公開タイトル、冒頭表示、料理名の説明はすべて公式表記の `半ごろし` に統一する。文字色、低音、着地演出でフックを作り、漢字の刺激には依存しない。
