# AIはバズ実験を再現できる？ コーラ噴水｜制作ブリーフ

## 今回の検証

- 新シリーズ仮称: `世界のバズ、AIで再現`
- 題材: 炭酸コーラへミント菓子を落とす噴水実験
- 視聴者への約束: 25秒前後で「驚く → 結果を見る → 1つ知る → 笑う」
- 変更変数: 冒頭から結果映像を先出しする「完成先見せフック」
- 比較用KPI: 24時間・72時間のShortsフィード表示、視聴選択率、平均視聴率、反応

## 企画判断

元のYouTube動画や音声は使用しない。広く知られた実験の「現象」だけを、ロゴのない完全新規AI映像で再構成する。実在クリエイターの顔・声・構図・台詞を再現しない。

## 事実の芯

ミント菓子表面の微細な凹凸が気泡のできる核となり、炭酸飲料に溶けた二酸化炭素が急速に泡となって抜け、液体を押し上げる。主眼は化学反応ではなく急速な脱ガスを伴う物理現象である。

一次・専門資料:

- American Chemical Society: https://www.acs.org/middleschoolchemistry/lessonplans/chapter5/lesson8.html
- Journal of Chemical Education: https://pubs.acs.org/doi/10.1021/acs.jchemed.9b01177

## 26秒構成案

| 時間 | 映像・Remotion演出 | 大字幕 | 音声 |
|---|---|---|---|
| 0.0–1.2秒 | 噴水の最大瞬間を先出し。画面を6fだけ振動。上部に小さくシリーズ名 | `この噴水／AIです` | `この噴水、AIです。` |
| 1.2–1.7秒 | 急停止、暗転、逆回転風ワイプ | `数秒前――` | なし。心拍のみ |
| 1.7–4.5秒 | 菓子がボトル口の真上へ。寄り、緊張 | `落とした瞬間…` | `コーラに、ミント菓子を落とすと――` |
| 4.5–7.5秒 | 落下から巨大噴射。4.7秒にドン＋振動＋白フラッシュ | `噴いた！` | `噴いた！` |
| 7.5–10.5秒 | 噴水の美しいスロー、泡粒を追う | `見た目は／再現成功？` | `見た目は、それっぽい。` |
| 10.5–16.5秒 | Remotionで菓子表面とCO2の簡易図解。微細な穴を足場に気泡が増える | `表面の細かな穴を足場に／CO₂が一気に気泡へ` | `表面の細かな穴を足場に、二酸化炭素が一気に泡へ。` |
| 16.5–21.5秒 | 音楽停止。`化学反応`を赤い取消線で消す | `噴水の主役は／化学反応ではない` | `この噴水の主役は、化学反応ではなく、急なガス抜け。` |
| 21.5–26.2秒 | 噴水をもう一度背景に、全画面オチとCTA | `AIで大噴水／そこ化学じゃないんかい！／チャンネル登録もよろしく` | `そこ、化学じゃないんかい！ チャンネル登録もよろしく。` |

## 声と音

- 緊張・解説: 青山龍星
- `噴いた！`、最終ツッコミ、CTA: ずんだもん
- 0–5秒: 低い鼓動、秒針、低音パルス
- 5.2秒: 太いインパクト音、炭酸の噴射音、6フレーム程度の画面振動
- 9.5秒以降: 明るい電子パーカッションへ切替
- 18.5秒: 0.25秒無音にして事実反転
- 22.5秒: 間抜けな一音から軽快な締め

## Flow共通契約

- 9:16 vertical, photorealistic, 1080p, 8 seconds
- 同じ屋外実験スペース、同じ無地の透明2Lボトル、同じ濃い褐色の炭酸飲料
- ボトル、菓子、衣服にブランド、ロゴ、文字を入れない
- 顔、観客、看板、字幕、音楽を入れない
- 本物らしい液体挙動、自然な飛沫、正確な重力、連続するボトル形状
- 重要被写体は中央20–75%に置き、Shorts UIの下部を避ける

## Flow Cut 1 — 緊張から落下

```text
Create an 8-second vertical 9:16 photorealistic cinematic science-experiment video in one continuous locked-camera shot. In a clean outdoor stone courtyard under bright overcast daylight, a generic transparent two-liter plastic bottle filled with dark carbonated cola stands perfectly upright on a low neutral-gray stone pedestal. The bottle has no label, branding, logo, or text.

A short straight transparent loading tube is already aligned securely above the open bottle. Several plain white round mint candies are visibly resting inside the tube on a thin flat release card. At approximately 2.2 seconds, one blue nitrile-gloved hand briefly enters from the right and pulls the card horizontally in one simple motion. The candies fall vertically and cleanly through the bottle opening. By approximately 2.8 seconds, dense tan foam begins erupting immediately, building into a powerful narrow fountain by 4 seconds and continuing for the rest of the shot.

Use a stable medium close-up that keeps the bottle neck, release tube, and rising fountain visible. Realistic carbonation bubbles, droplets, gravity, foam, and wet-stone reflections. The bottle, tube, pedestal, and background must remain geometrically unchanged.

No camera cuts, no camera transitions, no extreme macro shot, no handheld shake, no deformed hands, no extra fingers, no people other than the single gloved hand, no faces, no spectators, no text, no logos, no packaging, no additional bottles, no fire, no smoke, no fantasy effects, and no splash covering the lens. Leave clean upper-center space for Japanese captions.
```

## Flow Cut 2 — 完成先見せ用の巨大噴水

```text
Create an 8-second vertical 9:16 photorealistic cinematic continuation of the same outdoor cola-and-mint experiment in one continuous locked-camera shot. Use the exact same generic transparent two-liter bottle filled with dark cola, the same neutral-gray stone pedestal, and the same bright overcast stone courtyard. The bottle has no label, branding, logo, or text.

Begin immediately with an enormous narrow fountain of tan cola foam already at its most dramatic peak within the first 0.2 seconds, shooting several meters vertically from the bottle. Hold a stable low-angle medium-wide hero composition throughout the entire clip. Keep the full bottle and most of the fountain visible. After the peak, let the fountain gradually lose height while sparkling droplets, foam, and streams cascade naturally down the bottle onto the wet stone.

Use realistic gravity, fluid motion, natural shadows, crisp droplets, and consistent bottle geometry. No camera cuts, no transition to a close-up, no moving camera, no bottle deformation, no additional bottles, no people, no faces, no text, no captions, no logos, no product packaging, no fire, no smoke, no fantasy objects, and no splash covering the lens. Leave clean upper-center space for Japanese captions.
```

## Suno BGMプロンプト

```text
Instrumental soundtrack for a 27-second vertical science-comedy short, no vocals, no lyrics. Start with five seconds of tense cinematic sub-bass pulses, ticking percussion, restrained heartbeat rhythm, and a rising suspense tone. At the main impact, hit with one huge punchy cinematic boom and transform instantly into bright playful electro-funk with fizzy bubble-like percussion, plucky synth bass, crisp claps, and a fast satisfying groove around 124 BPM. Create a brief quarter-second musical stop near the factual reveal, then return with a small goofy woodwind-style comic sting and an upbeat clean ending. Strong tension-to-release contrast, modern short-form editing energy, clear transient hits, no horror, no aggressive distortion, no copyrighted melody, no spoken words, no singing.
```

## 投稿案

- タイトル: `AIはコーラ噴水を再現できる？実は化学反応じゃない #Shorts`
- 冒頭表示: `世界のバズ／AIで再現`
- AI開示: 写実的な生成映像としてYouTube StudioのAI使用を`はい`にし、映像内にも小さく`AI再現映像`を常時表示する
- 概要欄: AI生成による現象の再現であり、実写の検証映像ではないこと、ACS資料を参考にしたことを明記する

## 制作ゲート

Flowの2素材を `public/movie` に配置後、ファイル名と映像を確認してからRemotion実装へ進む。元動画の画面、サムネイル、音声、音楽、人物の容姿は取り込まない。
