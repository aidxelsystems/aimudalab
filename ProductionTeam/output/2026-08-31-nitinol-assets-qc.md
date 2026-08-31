# ai-viral-nitinol-01 素材・編集途中QC

確認日時: 2026-08-31 JST

## 映像素材

- `public/movie/Wire_unfolding_into_star_shape_202608311240.mp4`
  - 8.0秒 / H.264 / 1080×1920 / 24fps / AAC 48kHz
  - 一本の金属線が絡まった状態から星型へ復元する。
  - 溶融、発火、ロゴ、文字焼き込みなし。使用可。
- `public/movie/Alloy_wire_shape_recovery_experi…_202608311241.mp4`
  - 8.0秒 / H.264 / 1080×1920 / 24fps / AAC 48kHz
  - 曲がった金属線がコイル状へ復元する。第二の映像報酬として利用。
  - 金属の増減、溶融、ロゴ、文字焼き込みなし。使用可。

## BGM

- `public/BGM/Metal Memory Switch.mp3`
  - 110.856秒 / MP3 / 48kHz / stereo
  - Remotionで先頭から完成尺分だけ使用し、最終ミックスで-16 LUFS、True Peak -1.4 dBTPへ正規化する。

## Remotion

- `NitinolShort` Compositionを実装済み。
- 冒頭フック、名称、第二復元、結晶構造簡略図、超弾性、自己拡張型ステント、オチを実装。
- TypeScript検査合格。
- 代表フレーム6枚をレンダーし、主要テキストとShorts UI安全域を目視確認。
- 左上シリーズバッジの幅を固定し、シーン切替時の縮みを修正。

## VOICEVOX

- Docker上のVOICEVOX API v0.25.2に接続。
- 青山龍星（13）とずんだもん（3）の掛け合いを8音声生成。
- 生成先: `public/voice/ai-viral-nitinol-01/`
- ナレーション実音合計: 約22.8秒。各シーンの最低表示尺と余白を含む完成予定尺は約30.9秒。

## 完成結果

- `out/ai-viral-nitinol-01-final.mp4` を生成。
- 30.95秒 / H.264 / 1080×1920 / 30fps / AAC 48kHz。
- -16.04 LUFS / True Peak -1.27 dBTP / 全編デコード合格。
- 代表8フレームを目視確認し、左上シリーズバッジの文字欠けを修正して再レンダー済み。
- 次工程はユーザーによる完成版の聴感確認と公開日時の決定。
