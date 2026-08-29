# プリンス・ルパートの滴｜完成動画QC

検査日: 2026-08-25 JST

## 判定

**合格。YouTube投稿可能。**

## 完成ファイル

- `out/ai-viral-prince-rupert-01-final.mp4`
- SHA-256: `C0FE7D1C87428F299ECFFD625D091B93C67803BD8C076E59B49ACF378D11CA2D`

## 技術仕様

- 尺: 34.816秒
- 映像: H.264 / 1080×1920 / 30fps
- 音声: AAC / 48kHz / stereo / 192kbps指定
- ファイルサイズ: 26,843,686 bytes
- 統合ラウドネス: −16.1 LUFS
- Loudness range: 5.0 LU
- True peak: −1.2 dBTP
- 全編デコード: エラーなし
- TypeScript: `npx tsc --noEmit` 合格

## 映像QC

- 新Cut 1は素材先頭を0.3秒トリムし、再生ボタン状アイコンを完全に除外。
- Cut 1とCut 2は頭部左・尾右、暗い実験台、黒い支持台で連続性が成立。
- 尾の上下カーブ差は別実験個体として自然な範囲。
- ハンマー2打は頭部へ当たり、ガラスは無傷。
- 赤いリングはCut 2の尾の先端へ配置。
- 破砕時のシェイク、色反転、粒子は強いが、字幕は前後のフレームで読める。
- 応力図、21,847、1661年、CTAはShorts UI安全域内。
- AI映像は `AI再現映像`、歴史図版は出典表記で区別。
- 素材24fpsを理由に`startFrom`を24fps換算していた初版を修正。Remotionの30fpsコンポジション基準へ統一した。
- 2回目の打撃音、画面揺れ、ハンマー接触は完成MP4の同一フレームで一致。
- 破砕音、警告色反転、粒子、滴の崩壊開始も完成MP4の同一区間で一致。

## 音声QC

- ハンマー: `打撃2.mp3`＋低音量の`机をドンと叩く.mp3`。
- 破砕: `ガラスが割れる1.mp3`。映像の崩壊開始へ同期。
- 名称表示: `金属タイトル表示2.mp3`。
- BGMは破砕時にダッキングし、ナレーションを妨げない設計。
- 最終ラウドネス正規化では映像を再エンコードしていない。
- 最終音声は表示と同じ `しっぽ、自爆ボタンかい！`。旧読みの`なんかい`は不使用。

## 権利・出典

- AI動画: Google Flow生成素材。画面内でAI再現と表示。
- 歴史図版: Robert Hooke, `Micrographia`, 1665 / Project Gutenberg / Public domain。
- 科学: Kooij et al., Nature Communications 12, 2521 (2021)。
- 歴史: Royal Society archive, CLP/4i/37。
- 音声: VOICEVOX 青山龍星、ずんだもん。
- BGM: AI生成。

## QC画像

- `out/qc/ai-viral-prince-rupert-01/final-v2-checkpoints.jpg`
- `out/qc/ai-viral-prince-rupert-01/final-first-second.jpg`
- `out/qc/ai-viral-prince-rupert-01/revision-checkpoints.jpg`
