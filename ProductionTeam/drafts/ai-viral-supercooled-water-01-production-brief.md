# 世界のバズ、AIで再現 #2｜叩いた瞬間に凍る水 制作ブリーフ

## 今回の検証

- シリーズ: `世界のバズ、AIで再現`
- 題材: 過冷却した水が、衝撃をきっかけに急速に凍る現象
- 視聴者への約束: 24秒前後で「結果を先に見る → なぜ起きるか知る → 一言笑う」
- 前作から変える変数: 0秒から現象名ではなく、最も強い結晶化映像と結果字幕を出す
- 比較用KPI: 公開24時間・72時間のShortsフィード流入、視聴を選択した割合、平均視聴率、再生回数
- 一次目標: 100再生。判定前に題材・尺・投稿時刻を同時変更しない

## 企画判断

元のバズ動画・音声・構図は使用しない。科学現象だけを、ロゴや人物のない新規AI映像で再構成する。実写検証ではないため、AI映像には小さく `AI再現映像` を表示する。

本編は実験手順を詳しく教える動画ではなく、現象と仕組みを楽しむ短尺コンテンツにする。割れる危険のあるガラス容器や強い衝撃は描かず、無地のプラスチックボトルを指先で軽く叩く表現に限定する。

## 事実の芯

- 純度が高く、結晶化の核が少ない水は、0℃未満でも液体の状態を保つことがある。これを過冷却という。
- 過冷却状態では、衝撃や氷の結晶がきっかけになり、急速に結晶化が進むことがある。
- `叩けば水は必ず凍る` とは断定しない。台本では `過冷却した水は、衝撃をきっかけに凍ることがある` と説明する。

確認資料:

- Harvard Natural Sciences Lecture Demonstrations: https://sciencedemonstrations.fas.harvard.edu/presentations/supercooling-water
- MIT News: https://news.mit.edu/2011/heavy-water-0801
- MIT OpenCourseWare: https://ocw.mit.edu/courses/3-091-introduction-to-solid-state-chemistry-fall-2018/da732766df67fda9514d_AbyrF4VtlYY.pdf
- University of Barcelona, Introduction to Nucleation: https://www.ub.edu/fisestub/introduction-to-nucleation/

## 24秒構成案

| 時間 | 映像・Remotion演出 | 大字幕 | 音声 |
|---|---|---|---|
| 0.0–1.5秒 | 結晶化が走る最大瞬間を先出し。3フレーム白フラッシュ、6フレーム微振動 | `叩いた瞬間／凍った` | `この水、叩いた瞬間に凍ります。` |
| 1.5–2.1秒 | フリーズ、短い巻き戻し風ワイプ | `数秒前――` | なし |
| 2.1–5.0秒 | 透明な水のボトル。手が近づき、緊張を作る | `見た目は／ただの水` | `見た目は、ただの水。` |
| 5.0–8.5秒 | 軽く一度叩く。底から白い結晶が一気に広がる | `一気に結晶化` | `でも、軽い衝撃をきっかけに――一気に結晶化。` |
| 8.5–13.5秒 | 結晶化の進行をスローで見せ、0℃の線をRemotionで重ねる | `0℃以下でも液体／過冷却` | `0度を下回っても、液体のままになることがあります。` |
| 13.5–18.5秒 | 小さな結晶核から枝状に広がる簡易図解 | `衝撃が／凍り始める合図` | `過冷却した水は、衝撃が凍り始めるきっかけになるんです。` |
| 18.5–24.0秒 | 音楽を一拍止め、結晶化映像を背景に全画面オチとCTA | `水なのに／合図待ちかい！／チャンネル登録もよろしく` | `水なのに、合図待ちかい！ チャンネル登録もよろしく。` |

## 声とRemotion演出

- 解説: 青山龍星
- `一気に結晶化`、最終ツッコミ、CTA: ずんだもん
- 0秒はタイトルカードを置かず、結晶化映像と `叩いた瞬間 凍った` を同時表示する
- 衝撃音は5秒の一度だけ。画面揺れは小さく短くし、結晶の動きを邪魔しない
- 8.5秒で色調を冷たい青から明るいシアンへ切り替え、恐怖ではなく発見の気持ちへ戻す
- 大字幕は中央寄せ。Shorts UIを避け、下端20%には重要語を置かない
- `AI再現映像` は右上に小さく常時表示する

## Flow共通契約

- 9:16 vertical, photorealistic, 1080p, 8 seconds
- 同じ無地の透明500mlプラスチックボトル、同じ冷たいステンレス作業台、同じ暗い青灰色の研究室風背景
- 水は衝撃前まで完全に透明。衝撃後は底から上へ半透明の白いスラッシュ状結晶が連続して広がる
- ブランド、ラベル、ロゴ、文字、顔、観客、複雑な実験器具を入れない
- ボトルは割れない、へこまない、変形しない。水を牛乳、雪、煙、泡、沸騰に変えない
- 音声、音楽、字幕は生成しない
- 上中央に字幕用の余白を確保し、主現象は中央20–75%に置く

## Flow Cut 1 — 透明な水から結晶化

```text
Create an 8-second vertical 9:16 photorealistic cinematic science-demonstration video in one continuous locked-camera shot. On a clean cold stainless-steel worktable, a generic transparent 500-milliliter plastic bottle filled with perfectly clear liquid water stands upright. The bottle has no label, branding, logo, cap text, or markings. The dim blue-gray laboratory-style background is simple, softly blurred, and contains no readable equipment or people.

For the first 2.3 seconds, the liquid remains completely transparent, still, and unmistakably liquid. Fine natural condensation is visible on the outside of the bottle. At approximately 2.4 seconds, one realistic blue nitrile-gloved index finger enters briefly from the right and gives the lower side of the plastic bottle one light, precise tap. The bottle must not fall, dent, crack, shake violently, or change shape.

Immediately after the tap, a translucent white ice-crystal front begins at the bottom impact area and rapidly propagates upward through the clear water over about 1.5 seconds. Show physically plausible branching ice crystals and soft slushy crystallization moving through the liquid, with the upper portion remaining clear for a brief moment before the freezing front reaches it. Hold on the fully crystallized translucent slushy bottle for the remaining seconds.

Use a stable medium close-up with the entire bottle visible. Realistic optics, refraction, condensation, cold surfaces, and restrained cinematic lighting. No camera cuts, no camera motion, no macro transition, no deformed hand, no extra fingers, no additional bottles, no glass bottle, no shattering, no explosion, no snow burst, no milk-like liquid, no boiling, no bubbles, no steam, no smoke, no magical glow, no text, no captions, no logo, no watermark, and no audio. Leave clean upper-center negative space for Japanese captions.
```

## Flow Cut 2 — 結晶化フロントのヒーローショット

```text
Create an 8-second vertical 9:16 photorealistic cinematic continuation of the same supercooled-water demonstration in one continuous locked-camera shot. Use the exact same generic transparent 500-milliliter plastic bottle, the same cold stainless-steel worktable, and the same simple dim blue-gray laboratory-style background. The bottle has no label, branding, logo, text, or markings.

Begin immediately at 0.0 seconds with the lower third of the bottle already filled with translucent white slushy ice crystals while the upper two thirds remain visibly clear liquid water. In an elegant slightly slowed close shot, show a clearly defined branching crystallization front traveling continuously from bottom to top through the still liquid. The freezing front should look like fine natural dendritic ice and translucent slush, not opaque paint, milk, foam, snow, or smoke. Complete the crystallization by approximately 3 seconds, then hold on the beautiful fully crystallized bottle with crisp condensation and subtle cold highlights.

Keep the camera locked and the bottle geometry perfectly stable. Use realistic refraction, physically plausible ice growth, natural shadows, and restrained cinematic blue-white lighting. No hands, no people, no camera cuts, no zoom, no camera movement, no bottle deformation, no additional bottles, no glass, no cracking, no explosion, no snow blast, no boiling, no bubbles, no steam, no fog cloud, no fantasy glow, no text, no captions, no logo, no watermark, and no audio. Leave clean upper-center negative space for Japanese captions.
```

## Suno BGMプロンプト

推奨ファイル名: `Freeze on Cue.mp3`

```text
Instrumental soundtrack for a 24-second vertical science-comedy short, no vocals and no lyrics. Begin instantly with a fast cold-science groove around 142 BPM: tight ticking percussion, glassy plucks, restrained sub-bass pulses, and crystalline synth textures. No ambient intro. Build suspense for the first five seconds. At the main tap, create one sharp cinematic impact followed immediately by a fast shimmering freeze sweep that sounds like ice crystals racing upward. After the reveal, transform into bright playful electro-funk with crisp claps, bouncy plucked bass, sparkling arpeggios, and an energetic short-form rhythm. Add a very brief musical stop before the final joke, then one clean goofy percussive sting and a decisive upbeat ending. Strong tension-to-release contrast, clear edit points, modern viral science-video energy, no horror, no heavy distortion, no slow orchestral section, no copyrighted melody, no spoken words, and no singing.
```

## 投稿案

- タイトル: `叩いた瞬間、水が凍った。AIで再現したら美しすぎた #Shorts`
- 検索語: `過冷却 水 凍る 実験 AI再現 科学`
- 冒頭シリーズ表示: 0.8秒以降に小さく `世界のバズ、AIで再現`
- AI開示: YouTube Studioの合成・改変コンテンツを `はい` にし、映像内にも `AI再現映像` を表示する
- 概要欄: AI生成による科学現象の再現であり、実写の実験映像ではないこと、HarvardとMITの解説を参考にしたことを明記する

## 制作ゲート

1. Cut 1は `透明 → 衝撃 → 底から上へ結晶化` が一つの固定画角で読めること。
2. Cut 2は0秒から結晶化が進み、最初の1.5秒を完成先見せフックとして使えること。
3. ボトル変形、乳白色化だけの映像、雪や煙の噴出、文字・ロゴ混入があれば再生成する。
4. 2素材とBGMを `public/movie` に配置後、ファイル名と3地点のフレームを確認してからRemotion実装へ進む。
5. 本作は前作と同じ公開時刻・近い尺で比較し、公開24時間と72時間で判定する。
