# 世界のバズ、AIで再現 #7｜エアロゲル 制作ブリーフ

作成日: 2026-08-27 JST

## 制作契約

- Episode ID: `ai-viral-aerogel-01`
- 題材: 炎の熱から花を守り、宇宙でも使われたシリカエアロゲル
- 仮タイトル: `炎の上なのに花が無事!?「エアロゲル」の仕組み｜ほぼ空気で宇宙を守る #Shorts`
- 目標尺: 30〜32秒
- 感情曲線: `危険 → 矛盾 → 正体 → 納得 → 宇宙規模の驚き → ツッコミ`
- 有用な知識: エアロゲルは微細な多孔質構造によって熱を伝えにくくする軽量な固体。
- 現実の証拠: NASA公式の花と炎の断熱実演、火星探査車での断熱利用、Stardustによる彗星粒子回収。
- オチ: `軽すぎるのに、仕事が重いわ！`
- AI映像表示: `AI再現映像`、応用場面は `AIによる応用イメージ`

## 今回もっとも重視する「見せ方」

素材名から説明を始めず、完成状態を最初のフレームから見せる。

1. 0.0秒から `青い炎・半透明の板・無傷の花` の3点を同時に見せる。
2. 0.3秒以内に大きな中央文字 `炎の上なのに／花が無事!?` を読める状態にする。
3. 2.6秒で短い巻き戻しを入れ、5.5秒までに固有名詞 `エアロゲル` を出す。
4. 仕組みは一文と一つの図解に限定し、映像の勢いを止めない。
5. 後半は `火星探査車 → 彗星のチリ → 弾丸の最大6倍` と、驚きの規模を一段ずつ上げる。
6. 最大の画面揺れ・フラッシュ・衝撃音は、彗星粒子が捕獲される一回だけに使う。
7. 最終画面は背景映像を残し、中央の大きな半透明パネルへオチとCTAを集約する。

### 無音グランステスト

- 1秒: 炎の熱から花が守られている異常が分かる。
- 5秒: 謎の素材が `エアロゲル` だと分かる。
- 12秒: 熱を伝えにくい理由が図だけで分かる。
- 24秒: 宇宙で彗星のチリを捕まえた素材だと分かる。
- 31秒: ツッコミとチャンネル登録CTAを読み切れる。

## 台本・画面設計

### 0.0〜2.6秒｜結果先出し

- 表示:

```text
炎の上なのに
花が無事!?
```

- 読み: `炎の上なのに、花が無事！`
- 映像: Cut 1の4.0〜6.6秒を先出し。青い炎が板の下面へ触れ、真上の花は変化しない瞬間。
- Remotion: 最初のフレームから文字を70%表示し、0.18秒で100%へ。炎に合わせた橙色の熱波を下半分だけに入れる。画面揺れは使わない。
- 音: 低い着火音、短い吸い込み音。ナレーション直後に0.15秒だけ間を残す。

### 2.6〜5.4秒｜巻き戻しと名称

- 表示:

```text
正体は
エアロゲル
```

- 読み: `正体は、エアロゲル。`
- 映像: 0.25秒の巻き戻し後、Cut 1冒頭へ戻る。半透明の板を中央へ見せる。
- Remotion: 走査線と逆回転タイムコード。`エアロゲル` は画面中央へ大きく着地させる。

### 5.4〜8.1秒｜見た目の矛盾

- 表示:

```text
固体なのに
中身はほぼ空気
```

- 読み: `固体なのに、中身はほとんど空気です。`
- 映像: Cut 1の炎が着く直前。青白い半透明の質感を見せる。
- Remotion: 板の輪郭から小さな空洞点を広げる。空気を煙のように描かない。

### 8.1〜12.3秒｜仕組み

- 表示:

```text
細かな穴が
熱を伝えにくくする
```

- 読み: `細かな穴に空気を閉じ込め、熱を伝えにくくします。`
- 映像: Cut 1を暗く敷き、簡潔な断面図を重ねる。
- Remotion: 下から来る赤い熱矢印が多孔質層で細くなり、上側の花へほとんど届かない図。説明ラベルは2語以内。

### 12.3〜15.7秒｜現実の証拠

- 表示:

```text
本当に
花を熱から守る
```

- 読み: `実際の実演でも、青い炎から花を守ります。`
- 映像: NASA Spinoff公式の `Silica aerogel insulates a flower from a blue flame` 画像。
- 表示注記: `実物写真／NASA Spinoff`
- 音: BGMを約3dB下げ、写真を理解する時間を確保する。

### 15.7〜19.5秒｜一段目の応用

- 表示:

```text
NASAは
火星探査車の断熱へ
```

- 読み: `NASAは、火星探査車の断熱にも使いました。`
- 映像: NASA/JPL公式のMars Pathfinder Sojourner画像。機体全体を見せ、細部を過剰に拡大しない。
- Remotion: 火星の寒さを表す青い温度波を外側に、機体内部を守る暖色の輪郭を内側に出す。

### 19.5〜24.7秒｜二段目の応用

- 表示:

```text
さらに
彗星のチリを捕獲
```

- 読み: `さらに、彗星のチリを壊さず捕まえ、地球へ持ち帰りました。`
- 映像: Cut 2の宇宙イメージからNASA Stardust公式画像へ切り替える。
- 表示注記: Cut 2は `AIによる応用イメージ`、公式画像は `実物資料／NASA・JPL`
- Remotion: 粒子が捕獲面へ入る決定フレームだけ、短い白フラッシュ・5フレームの画面揺れ・衝撃音を一回使用する。

### 24.7〜27.6秒｜数字で驚きを固定

- 表示:

```text
速さは
弾丸の最大6倍
```

- 読み: `速さは、弾丸の最大6倍。`
- 映像: NASA/JPL公式のエアロゲル内に残った粒子の軌跡。
- Remotion: 一本の粒子軌跡が伸び、`最大6倍` が最後に吸着する。小注に `彗星遭遇時の粒子／NASA JPL`。
- 音: 数字着地で金属的な一音。ここでは画面を揺らさない。

### 27.6〜31.8秒｜ツッコミとCTA

- 表示:

```text
軽すぎるのに
仕事が重いわ！

チャンネル登録もよろしく
```

- 読み: `軽すぎるのに、仕事が重いわ！ チャンネル登録もよろしく。`
- 映像: Cut 2終盤を大きくぼかして残す。
- Remotion: 中央の一枚の半透明パネルへ全文を中央揃え。`仕事が重い`だけ金色へ切り替え、最後に軽い浮遊モーションからコミカルに着地させる。

## Google Flow Cut 1｜炎・エアロゲル・花（8秒・9:16）

狙いは、最初の一目で説明不要な矛盾を作ること。決定的な状態を4.0〜6.5秒へ置き、完成動画のコールドオープンにも再利用する。

```text
Create an exactly 8-second ultra-photorealistic vertical 9:16 cinematic materials-science demonstration in one continuous locked macro shot. The entire setup must be clearly readable at the same time: a vivid blue laboratory burner flame at the bottom, a small rectangular slab of pale translucent sky-blue silica aerogel held horizontally in the middle by two thin matte-black laboratory supports, and one delicate fresh magenta flower with a short green stem resting directly on top of the aerogel. The flower must remain fully visible and separated from the flame by the aerogel slab. Use a dark premium laboratory background with strong blue-orange contrast. Keep the upper 24 percent dark and uncluttered for later Japanese hook text.

0.0–1.8 seconds: show the complete stable apparatus before ignition. The flower looks fresh, soft, and naturally detailed. The aerogel looks like a solid piece of translucent frozen smoke with subtle orange edge scattering, not glass, ice, plastic, foam, or fabric. The burner nozzle is visible below but unlit. Perform an extremely subtle camera push-in.

1.8–3.2 seconds: ignite one clean narrow blue gas flame from the fixed burner below. The flame rises vertically and touches only the underside of the aerogel slab. The apparatus does not move.

3.2–6.6 seconds: hold the impossible-looking contrast clearly. The intense blue flame continues touching the underside of the aerogel, while the flower directly above remains fresh, motionless, unburned, unwilted, and unchanged. Show restrained hot-air shimmer only below the aerogel. Do not allow visible heat distortion above it. Preserve the exact shape, color, and position of the flower and slab.

6.6–8.0 seconds: move slightly closer to a clean hero composition showing the flame, aerogel, and intact flower together. End with the contradiction fully readable without narration.

Use a 90-millimeter macro lens, realistic silica-aerogel translucency, physically plausible blue flame, stable geometry, crisp flower detail, shallow depth of field without hiding any of the three key objects, elegant high-speed science-commercial cinematography, and no camera cut.

No human, no hand, no skin, no face, no extra flower, no extra burner, no melting flower, no browning, no smoke, no soot, no sparks, no explosion, no glowing aerogel, no cracked slab, no bending support, no frost, no ice, no liquid, no fantasy force field, no thermal-camera overlay, no baked-in text, no captions, no logo, no watermark, no narration, no music, and no sound effects.
```

## Google Flow Cut 2｜彗星粒子を捕らえる宇宙応用（8秒・9:16）

狙いは、実験台サイズから宇宙規模へ一気に拡大すること。精密な仕組みの証明には使わず、NASA公式画像へつなぐ感情的な応用イメージとして使う。

```text
Create an exactly 8-second ultra-photorealistic vertical 9:16 cinematic visualization of a generic unbranded deep-space sample-return probe collecting dust near a comet. This is an emotional application visualization, not documentary evidence and not a scientific cutaway. Use one continuous smooth shot with stable spacecraft geometry. Keep the upper 24 percent dark and uncluttered for later Japanese captions.

0.0–2.2 seconds: begin with a dramatic macro view of a large open collector panel made of many small pale translucent blue aerogel tiles held in a clean dark metallic grid. A sparse stream of tiny natural tan and gray comet dust grains approaches from deep space. The particles must look like physical mineral dust, not glowing magic, stars, sparks, or fire.

2.2–5.2 seconds: several tiny grains enter the aerogel collector surface and stop within the translucent material, leaving a few subtle tapered tracks. Use only one restrained micro-impact highlight at the decisive moment around 4.2 seconds. The collector remains intact; there is no explosion, cracking, vapor cloud, or visible damage.

5.2–8.0 seconds: perform one smooth controlled pullback to reveal the collector mounted on a compact generic scientific spacecraft flying past the hazy edge of a distant comet. The comet nucleus remains far in the background and a soft dust stream crosses the frame. End with the aerogel collector still clearly identifiable as part of the spacecraft.

Premium deep-space documentary-commercial cinematography, realistic black space, restrained sunlight, subtle blue aerogel translucency, physically plausible slow spacecraft motion, stable panel grid, high contrast, and a clean vertical composition.

No NASA logo, no agency logo, no flag, no readable mission name, no national insignia, no astronaut, no human, no cockpit, no laser, no weapon, no fantasy energy shield, no excessive glowing particles, no meteor shower, no explosion, no debris collision, no damaged spacecraft, no changing geometry, no scientific labels, no text, no captions, no watermark, no narration, no music, and no sound effects.
```

## Suno AI BGM｜Solid Smoke Launch（約32秒）

```text
Instrumental only, no vocals, no spoken words. Create a 32-second high-energy mystery-science comedy soundtrack for a vertical Short, around 150 BPM. Start immediately with a dangerous but clean laboratory pulse: tight ticking percussion, a low elastic synth bass, short glassy taps, and one fast rising tension note. No ambient intro.

From 0 to 3 seconds, create urgent heat and danger with crisp rhythmic gaps for a blue flame and the intact-flower reveal. At about 2.6 seconds, add one short reverse-tape rewind accent. From 3 to 8 seconds, switch into a curious precise science groove with airy mallet notes and tiny dry clicks for the name “aerogel” and the “mostly air” reveal.

From 8 to 15.5 seconds, maintain a fast explanatory rhythm using light marimba-like synth notes, restrained ticking, and a thin warm pad. At about 12.3 seconds, briefly reduce the bass and percussion so an official real-world flower photograph can land clearly. Do not become slow or emotional.

At 15.7 seconds, transform decisively into an energetic space-technology section with pulsing arpeggios, brighter bass, compact heroic chords, and a forward-driving beat for the Mars rover application. At about 19.5 seconds, add a fast upward transition into the comet-dust reveal. Around 22 seconds, create one single sharp cosmic impact accent with a very brief half-beat stop immediately afterward. This must be the strongest accent in the entire track.

At 24.7 seconds, add one clean accelerating measurement phrase for “up to six times the speed of a bullet.” At 27.6 seconds, switch instantly into playful electro-funk with a bouncy plucked bass and one dry comedic metallic plink. Finish by 32 seconds with a confident upbeat final button for “light material, heavy job” and the subscribe call.

Strong tension-to-curiosity-to-cosmic-scale contrast, modern viral science-video energy, memorable edit points, punchy clean mix, fast but not frantic. No horror scream, no cinematic trailer overload, no slow orchestral section, no ambient-only passage, no sentimental ending, no jazz solo, no copyrighted melody, no lyrics, no chanting, and no voice.
```

## 生成素材の合格条件

### Cut 1

- 最初・中盤・最後で花、板、バーナーの位置と形が変わらない。
- 炎が触れるのは板の下面だけで、花へ直接回り込まない。
- 花が燃える、変色する、萎れる、煙を出す描写がない。
- エアロゲルが透明なガラス板や青い氷に見えず、薄い青白色の半透明固体に見える。
- 4.0〜6.5秒の静止フレームだけでも矛盾が理解できる。

### Cut 2

- コレクターパネルが途中で形を変えず、宇宙船へ自然につながっている。
- 粒子は控えめな天然の微粒子に見え、魔法の光や爆発になっていない。
- 粒子捕獲の精密な証拠としては使わず、公式画像へつなぐ応用イメージとして成立する。
- ロゴ、国旗、文字、人物、余計な宇宙船がない。

## 一次資料

- NASA Spinoff, Aerogel Insulation Makes Thinner, Warmer Outerwear  
  https://spinoff.nasa.gov/Spinoff2018/cg_5.html
- NASA Science, Stardust / Stardust NExT  
  https://science.nasa.gov/mission/stardust/
- NASA JPL, Ideas that Gel  
  https://www.jpl.nasa.gov/news/ideas-that-gel/
- NASA JPL, Pathfinder Rover Will Be Insulated with Novel Substance  
  https://www.jpl.nasa.gov/news/pathfinder-rover-will-be-insulated-with-novel-substance/
- NASA, Comet-Catching NASA Technology Enables Exotic Works of Art  
  https://www.nasa.gov/technology/tech-transfer-spinoffs/comet-catching-nasa-technology-enables-exotic-works-of-art/

## 表現上のガード

- AI生成した炎・花・宇宙船を実物の記録映像として扱わない。
- `世界一軽い固体` は種類・時期で記録が変わるため、タイトルと本文では `ほぼ空気の固体` を使う。
- `花が絶対に燃えない` とは言わず、実演で `熱から守る`、冒頭では `花が無事` と表現する。
- `弾丸の最大6倍` はNASA JPLの彗星遭遇時の粒子速度比較として、条件注記とともに表示する。
- NASAのロゴや名称をFlow映像へ生成しない。公式画像を使用する場面だけ出典・クレジットを表示する。

## 公開後に判定する実験

- 仮説: 最初のフレームから危険と矛盾を同時提示すると、従来の名称・説明先行よりShortsの視聴選択率が改善する。
- 変更する要素: 結果先出し、中央大文字、応用の二段階スケールアップ。
- 変更しない要素: 30秒前後、VOICEVOX、AI再現表示、一次資料、中央半透明エンディング、CTA。
- 成功指標: 公開24時間後のShorts流入、視聴を選択した割合、平均再生率、冒頭3秒残存、再視聴。
- 判定時点: 公開24時間後と72時間後。
