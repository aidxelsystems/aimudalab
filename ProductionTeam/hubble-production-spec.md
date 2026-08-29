# ハッブル宇宙望遠鏡｜Production Spec

## 感情設計

孤高 → 威厳 → 失敗 → 1.3mmの衝撃 → 人類の修理 → 鮮明な宇宙 → メガネのツッコミ。

## 声

- 事実・緊張：青山龍星（speaker 13）
- 最後のツッコミとCTA：ずんだもん（speaker 3）
- ピンボケ場面では、説明を詰めず「ぼんやり。」の後に短い間を取る。

## Remotion効果

- 0秒：大見出しを奥から静かに迫らせる。振動は使わず威厳優先。
- ピンボケ：NASA画像の左半分へクロップし、CSS blurではなく公式の実画像を見せる。BGMを0.05まで落とす。
- 1.3mm：定規線が左右から閉じ、数字が105%→100%で着地。衝撃音と8〜10フレームの細かな振動。
- 修理：寒色オーバーレイを暖色へ補間し、光が走る。
- 回復：M100左→右の縦ワイプ。比較画像そのものを改変せず、ラベルと矢印を重ねる。
- オチ：グルメ三部作と同じく全画面CTA。ただし赤・黄ではなく、紺→シアン→白の宇宙配色にする。

## 素材待ち

- Flow cut 1：孤高のハッブル、8秒、9:16
- Flow cut 2：匿名宇宙飛行士による修理、8秒、9:16
- Suno BGM：`Space Eyeglasses.mp3`

公式M100画像は `public/image/hubble-m100-before-after-nasa.png` に保存済み。

## 実装済み素材

- Flow：`Hubble_Space_Telescope_orbiting_…_202608221336.mp4`
- Flow：`Astronaut_services_space_telescope_1080p_202608221337.mp4`
- BGM：`Space Eyeglasses.mp3`
