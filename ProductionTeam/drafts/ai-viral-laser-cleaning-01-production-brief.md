# 世界のバズ、AIで再現｜レーザー洗浄機 制作ブリーフ

作成日: 2026-08-29 JST

## 制作契約

- エピソードID: `ai-viral-laser-cleaning-01`
- 題材: レーザー洗浄機によるサビ除去
- 第一の約束: 見ているだけで気持ちいい、連続したサビ除去を最初の6秒で見せる。
- 感情曲線: 汚い → 気持ちいい → 疑問 → 納得 → 用途の拡大 → ツッコミ
- 有用な知識: サビなどの表面層と下地金属では、レーザーで除去が始まるエネルギー条件が異なる。波長、パルスエネルギー、照射範囲などを調整して、下地への影響を抑えながら表面層を狙う。
- 意外な用途: 航空機部品の清掃だけでなく、放射性物質が付着した物体・表面の除染にも使用される。
- オチ: `サビ取りから、除染まで行くんかい！`
- 目標尺: 31〜34秒
- AI映像表示: `AI再現映像`、応用カットは `AIによる応用イメージ`
- 検証する変数: 冒頭6秒の連続した「汚い→きれい」。説明量、中央字幕、終盤CTAは直近科学シリーズの基準を維持する。
- 成功判定: 公開24時間10回以上、72時間15回以上、Shorts流入2回以上。20再生以上では平均視聴率90%以上を目標とする。

## 事実表現の境界

- `レーザーなら必ず金属を傷つけない`とは言わない。条件が強すぎれば下地も影響を受ける。
- `サビだけが光を吸収する`とは単純化しない。表面層と下地のアブレーション閾値、波長、パルス、走査条件の違いとして説明する。
- レーザーで剥離・蒸発した物質は消滅するわけではない。実際の装置では集じん・ヒューム抽出が必要になる。
- 除染のAI映像を実地映像として扱わない。画面内で `AIによる応用イメージ` と表示する。

## Flow Cut 1｜サビが連続して消える主役映像（8秒・9:16）

このカットが不自然なら制作を進めず、再生成する。最重要なのは、同じ金属板の上を境界線が一定方向へ進み、サビが連続的に除去されること。

```text
Create an ultra-realistic vertical 9:16 industrial laser-cleaning demonstration, exactly 8 seconds, one continuous shot with no cuts. Use a locked macro camera looking down at a single thick rectangular steel plate on a dark clean workbench. The plate has one stable shape, four fixed corner bolt holes, and a uniform layer of heavy orange-brown surface rust. A compact matte-black robotic laser cleaning head and a small adjacent fume-extraction nozzle are positioned just above the plate. Keep the upper 25 percent of the frame dark, simple, and uncluttered for later Japanese captions.

0.0–0.8 seconds: begin with laser cleaning already in progress near the lower part of the plate, so the first frame immediately shows a crisp contrast between rusty orange metal ahead of the cleaning line and clean dark-silver steel behind it. No setup delay.

0.8–6.5 seconds: a narrow blue-white scanning line moves rapidly from left to right in repeated parallel passes while the broad cleaned boundary advances upward at a slow, perfectly steady speed. Immediately behind each pass, only the thin rust layer lifts away as tiny dry particles and a faint controlled wisp that is pulled toward the extraction nozzle. Reveal realistic matte brushed steel underneath, not mirror chrome. The dividing edge between rust and clean steel must remain straight, sharp, continuous, and easy to follow. By about 4.2 seconds, create a visually perfect fifty-fifty before-and-after split. Preserve the exact plate outline, bolt holes, scratches, thickness, camera angle, and lighting throughout.

6.5–7.3 seconds: complete the final cleaning pass so the whole visible plate becomes uniformly clean brushed steel. The robotic head exits slightly upward without changing shape.

7.3–8.0 seconds: hold on the fully cleaned steel plate for a satisfying final reveal, with one subtle cool highlight traveling across the metal surface.

Photorealistic industrial process, physically plausible pulsed laser scanning, stable geometry, precise progressive cleaning, premium satisfying restoration cinematography, high micro-texture detail, restrained blue-white laser light, realistic dust extraction, soft dark workshop background, no source audio required.

No person, no face, no hand, no skin, no protective suit, no readable control panel, no text, no numbers, no symbols, no logo, no watermark, no brand, no camera cut, no camera shake, no zoom jump, no time jump, no rust teleportation, no changing plate shape, no changing bolt holes, no new scratches, no engraving, no cutting, no welding, no molten metal, no holes burned into the steel, no red-hot metal, no flames, no large sparks, no explosion, no thick smoke, no liquid cleaner, no water, no brush, no sandblasting, no magic glow, no fantasy effect, no narration, no music, no subtitles.
```

## Flow Cut 2｜除染へスケールが広がる応用映像（8秒・9:16）

Cut 1と同じ気持ちよさを保ちながら、遠隔操作される産業設備へ画角を広げる。編集時に必ず `AIによる応用イメージ` と表示する。

```text
Create an ultra-realistic vertical 9:16 industrial application visualization, exactly 8 seconds, one continuous shot with no cuts. Inside a clean sealed robotic maintenance cell, show one large cylindrical steel pipe section mounted horizontally in a stable metal fixture. Its front-facing curved surface has a uniform dark brown oxide and contamination layer. A compact robotic laser cleaning head with a separate fume-extraction nozzle works remotely above the pipe. No humans are present. Keep the upper 30 percent of the frame visually quiet and dark for later Japanese captions.

0.0–1.0 seconds: begin in a close macro view with the cleaning process already active. Show a narrow clean silver band beside the dark contaminated surface so the transformation is immediately understandable.

1.0–5.5 seconds: the robotic head travels smoothly along the pipe from left to right. A tightly controlled blue-white scan line sweeps across the curved surface in fast parallel strokes. The unwanted surface layer is progressively removed in one continuous motion, revealing stable matte steel underneath. Fine particles and a very small vapor wisp are immediately captured by the extraction nozzle. The cleaned boundary follows the cylinder naturally and never jumps or changes direction.

5.5–8.0 seconds: perform a very slow, smooth camera pullback that reveals the full remote robotic maintenance cell while the final clean band remains clearly visible on the same unchanged pipe. End on a strong before-and-after comparison: one remaining dark untreated band beside one clean metallic band. The pipe, fixture, robot, extraction nozzle, and room geometry remain identical from beginning to end.

Photorealistic industrial robotics, realistic laser ablation, stable geometry, physically plausible dust extraction, controlled cool lighting, cinematic but factual visual tone, satisfying progressive surface restoration, no documentary claim.

No person, no face, no hand, no hazmat worker, no radiation symbol, no nuclear logo, no warning text, no readable label, no flag, no brand, no watermark, no control-screen text, no camera cut, no abrupt zoom, no object morphing, no pipe deformation, no extra pipe, no liquid, no washing foam, no brush, no sparks shower, no flames, no explosion, no glowing green material, no fantasy radiation, no melted steel, no holes, no welding, no narration, no music, no subtitles.
```

## Suno｜Precision Rust Eraser（約34秒）

```text
Instrumental only, no vocals, no spoken words. Create a 34-second modern precision-electro soundtrack for a vertical satisfying science-comedy short, around 136 BPM. Start immediately with a clean, addictive industrial rhythm: tight electronic ticks, muted metallic clicks, a controlled low synth pulse, and short left-to-right scanning accents. No ambient intro and no cinematic trailer opening.

From 0 to 7 seconds, support a continuous rust-removal reveal. Keep the groove steady and hypnotic rather than dramatic, with small rhythmic gaps where an added laser sweep sound can be heard. Add a bright clean shimmer at about 4.2 seconds for the perfect half-rust, half-clean visual, then a short polished metallic resolve at about 7 seconds when the steel becomes fully clean.

From 7 to 12 seconds, briefly thin the arrangement for the name “laser cleaning machine” and the question of why the steel remains. Use one dry reverse scan into a half-beat pause, then restart with precise digital percussion.

From 12 to 22 seconds, create a clear scientific explanation groove with crisp marimba-like synth notes, a restrained bass pulse, and small alternating high and low tones that can match a two-level threshold diagram. Leave space for Japanese narration. Avoid dense chords.

From 22 to 28 seconds, widen into a larger industrial scale with deeper percussion and a subtle rising mechanical texture for aerospace and remote decontamination applications, but keep the tempo moving and do not become orchestral or ominous.

From 28 to 34 seconds, switch decisively into playful electro-funk. Add one witty descending metallic phrase for the “rust removal to decontamination” punchline, a brief bass drop, and a confident upbeat final button for the subscribe call.

Strong clean-to-cleaner progression, satisfying precision, modern technology energy, clear edit points, punchy mix, narration-friendly midrange. No laser sound effect baked into the music, no giant impact, no horror, no alarm, no siren, no explosion, no heavy distortion, no slow ambient section, no orchestral trailer, no jazz solo, no lyrics, no chanting, no copyrighted melody.
```

## 仮台本と画面設計

| 時間 | 表示 | 読み | 映像・演出 |
|---|---|---|---|
| 0.0–0.5秒 | 文字なし | なし | Cut 1の50%清掃付近を先出し。清掃境界を隠さない。 |
| 0.5–2.8秒 | `サビが／光だけで消える` | `サビが、光だけで消えていく。` | 上寄り中央に短く表示。レーザー走査音を追加。 |
| 2.8–6.7秒 | `気持ちよすぎる…` | なし | Cut 1をほぼ無言で見せ、完全清掃まで到達。字幕を小さくしない。 |
| 6.7–9.6秒 | `レーザー洗浄機` | `これが、レーザー洗浄機。` | 名称を中央へ大表示。直後にBGMを半拍抜く。 |
| 9.6–12.4秒 | `鉄まで／削れないのか？` | `でも、鉄まで削れないのか？` | 50%状態を静止または短く逆再生して比較。 |
| 12.4–18.8秒 | `除去が始まる／強さが違う` | `サビと鉄では、除去が始まるレーザーの強さが違います。` | Remotionでサビと鉄の2段閾値図。出典を小さく表示。 |
| 18.8–22.8秒 | `出力を調整して／サビを狙う` | `だから、出力を調整して、表面のサビを狙います。` | 走査幅とパルスの簡潔な図。`絶対に無傷`とは表示しない。 |
| 22.8–27.9秒 | `航空機部品から／放射性物質の除染まで` | `航空機の部品から、放射性物質の除染にも使われます。` | Cut 2。`AIによる応用イメージ`を表示。IPG Photonicsを出典表示。 |
| 27.9–31.2秒 | `サビ取りから、／除染まで行くんかい！` | `サビ取りから、除染まで行くんかい！` | 半透明中央パネル。背景にCut 2の完成面。 |
| 31.2–34.0秒 | `チャンネル登録もよろしく` | `チャンネル登録もよろしく。` | 同じ中央軸。短い金属音で締める。 |

## Remotion演出

- 冒頭は説明カードを置かず、Cut 1の清掃境界を0秒から見せる。
- 大文字は清掃面に重ねず、上側25%へ置く。最初の0.5秒は文字を出さない。
- Cut 1の約50%清掃状態を0秒のコールドオープンと検索サムネイル候補にする。
- レーザー走査に合わせ、細い光線を追加で描き直さない。素材の走査線が弱い場合だけ、半透明の短いスイープを同期させる。
- 今回は画面揺れを使わない。快感を壊すため、決定瞬間は光沢のシマーと走査音だけにする。
- `サビ`と`鉄`の閾値図は上下2本のバーで表示し、専門用語 `アブレーション閾値` は小さな補助ラベルにする。
- 除染シーンには `AIによる応用イメージ` を表示し、実地映像と誤認させない。
- エンディングは背景映像を残し、半透明パネルと中央揃えで統一する。
- 最終ページはオチとCTAだけにする。出典は一つ前の説明・応用ページへ置く。
- 元動画音声はミュートし、レーザー走査音、軽い吸引音、金属シマーをRemotionで同期する。

## 素材合格条件

### Cut 1

- 0秒からサビと清掃面の差が見える。
- 清掃境界が1方向へ連続して進み、途中で飛ばない。
- 同じボルト穴、輪郭、傷、板厚が8秒間維持される。
- 除去後が鏡面クロムではなく、自然な裸の鋼材に見える。
- サビが水に溶ける、爆発する、巨大な火花になる描写がない。
- 7秒前後で完全清掃し、最後に0.5秒以上の見せ場がある。

### Cut 2

- パイプ、治具、ロボットの形が変わらない。
- 清掃面が同じ円筒上へ残り、カメラを引いても位置が一致する。
- 走査時の粉じんが抽出ノズルへ向かい、厚い煙で隠れない。
- 放射線を緑色の光や魔法として表現しない。
- 人物、ロゴ、焼き込み文字がない。

## SEO仮案

### タイトル

`サビが一瞬で消える「レーザー洗浄機」なぜ金属は無事？ #Shorts`

### 概要欄の先頭2行

```text
レーザーでサビ取りすると、なぜ金属まで削れないのか？
レーザー洗浄機の仕組みと、航空機部品・放射性物質の除染への応用をAI再現映像で紹介します。
```

### 公開ハッシュタグ

`#レーザー洗浄 #科学 #Shorts`

### タグ候補

`レーザー洗浄機, レーザークリーニング, レーザーサビ取り, レーザー錆除去, サビ落とし, laser cleaning, laser rust removal, rust removal, satisfying, 科学実験, 仕組み, なぜ`

## 一次資料・技術資料

確認日: 2026-08-29 JST

- IPG Photonics, Laser Cleaning: https://www.ipgphotonics.com/solutions/laser-materials-processing/laser-cleaning
  - 走査レーザーによる表面材除去、サビ・塗装・油などの除去用途、航空機部品、放射性物質が付着した表面の除染。
- IPG Photonics, What Is Laser Cleaning?: https://www.ipgphotonics.com/newsroom/stories/what-is-laser-cleaning
  - 表面層と下地のアブレーション閾値、波長・パルスエネルギー調整、ヒューム抽出。
- TRUMPF, Laser Cleaning: https://www.trumpf.com/en_GB/solutions/applications/surface-processing-with-the-laser/laser-cleaning/
  - 短パルス・超短パルスレーザーによる酸化層・機能層の制御された除去、金型・溶接前処理の用途。

## 素材受領後の工程

1. 2本を0秒・中間・決定フレーム・終端で検査する。
2. 合格素材だけを`public/movie/`へ確定配置する。
3. 台本とVOICEVOX音声を確定し、尺を実測する。
4. Remotionで走査音、閾値図、AI表示、中央エンディングを実装する。
5. 制作内容確定後、`ProductionTeam/handoffs/ai-viral-laser-cleaning-01.render.json`を作り、CodexまたはClaude Codeで共通レンダーを実行する。

## 素材受領レビュー｜2026-08-29

### Cut 1｜`Laser_cleaning_steel_plate_1080p_202608290045.mp4`

**合格。主役映像として採用する。**

- 1080×1920、24fps、8.000秒、H.264/AAC。
- 0秒から約半分が清掃済みで、サビ面と銀色面の境界が即座に分かる。
- 境界が下から上へ連続して進み、6〜7秒で主要面の清掃が完了する。
- 金属板、4つの穴、ヘッド、抽出ノズルの形状は安定している。
- 最後まで外周に細いサビが残るが、主面の変化は明瞭で、かえって加工面と非加工面の差が分かる。
- 冒頭フック、検索サムネイル、仕組み説明後の再提示に使用できる。

### Cut 2｜`Robot_cleaning_steel_pipe_1080p_202608290047.mp4`

**条件付き合格。再生成せず、区間を分けて使用する。**

- 1080×1920、24fps、8.000秒、H.264/AAC。
- 円筒自体は回転しない。一方、0〜4.5秒は清掃済み領域が左から中央へ広がり、走査線と境界の移動が確認できる。
- 約5秒以降は清掃が進まず、カメラが引いて設備全体と部分的な処理結果を見せる区間になる。
- `全周を完全に清掃した映像`とは表現しない。`表面を狙って除去する遠隔処理のAIイメージ`として扱う。
- 0〜4.7秒を清掃動作、6.0〜8.0秒を応用設備の引き映像として別シーンに配置する。中間は説明図または短いトランジションで分離する。
- 画面上部の暗い余白は大きく、応用説明とAI表示の安全域として使いやすい。

### BGM｜`Cleanline Scan.mp3`

**採用候補。34秒へ編集して使用する。**

- 48kHz stereo、約273.816秒。Sunoが指定尺より長い完全曲として生成しているため、全曲は使用しない。
- 冒頭34秒の測定値は約−15.02 LUFS、True Peak約+0.08 dBTP、LRA約2.0 LU。
- 波形・周波数分布では0〜4秒が比較的抑制され、6〜8秒付近から情報量が増える。静かな開始はレーザー走査SEを聞かせる余地として利用できる。
- True Peakが0dBTPを超えるため、そのまま完成音声へ使わない。ナレーション下でゲインを下げ、最終ミックスを約−16 LUFS、−1.4dBTPへ正規化する。
- 初稿は曲頭0秒から34秒を使用する。冒頭の推進力が不足する場合だけ、4秒付近から開始する代替版を比較する。

### QC資料

- `out/qc/laser-cleaning-assets/plate-contact.jpg`
- `out/qc/laser-cleaning-assets/pipe-contact.jpg`
- `out/qc/laser-cleaning-assets/bgm-wave-0-40.png`
- `out/qc/laser-cleaning-assets/bgm-spectrum-0-40.png`
