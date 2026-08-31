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

## 未完了・ブロッカー

- `public/voice/ai-viral-nitinol-01/` にVOICEVOXナレーションがない。
- `http://127.0.0.1:50021` は停止中。現在の実行環境はDocker daemon socketの権限を持たないため、VOICEVOXコンテナを起動できない。
- 音声なしの完成MP4は納品しない。音声生成後に実測尺、レンダー、ラウドネス正規化、全編デコード、代表フレームQCを行う。
