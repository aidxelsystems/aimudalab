# 世界のバズ、AIで再現 #2｜過冷却した水 QC

確認日: 2026-08-23 JST

## 完成物

- `out/ai-viral-supercooled-water-01-final.mp4`
- 29.312秒
- 1080×1920 / 30fps / H.264
- AAC stereo / 48kHz
- 23,127,844 bytes
- SHA-256: `DD4795530660DA54FF6E540D104F74EF2BE69E78A4BB23928936A4A167443A3D`

## 音声

- BGM: `public/BGM/Freeze Frame Fizz.mp3`
- 結晶化SE: `public/Effect/氷魔法で凍結.mp3`
- SE開始: 約7.13秒。実映像で最初の白い結晶が現れるタイミングへ同期
- 既存の`ショック2.mp3`は外し、氷音を約4秒かけて減衰
- 緊張・解説: VOICEVOX 青山龍星
- 結晶化・ツッコミ・CTA: VOICEVOX ずんだもん
- 最終測定: 約 -15.9 LUFS / -1.5 dBTP / LRA 2.9
- 0.5秒以上の意図しない無音なし

## 映像

- 0秒から枝状結晶の進行と `叩いた瞬間 凍った` を表示
- 1秒以内に現象、シリーズ名、AI表示が読める
- `透明な水 → 指が近づく → 結晶化` の因果が分かる順序
- `0℃以下でも液体`、`過冷却`、`衝撃`を一画面一要点で表示
- `最初の小さな結晶＝核`を独立した説明画面で表示
- `不純物や傷が少ない → 核ができにくい → 衝撃で結晶化が連鎖`を次画面で回収
- 温度計、結晶核、結晶化の連鎖はRemotion生成図解
- CTAは全画面・中央配置
- `AI再現映像`を生成映像上へ常時表示
- 完成MP4の全編デコード成功
- 代表7地点で文字切れ、Shorts UI衝突、字幕の左寄りなし

## 事実確認

- 純度が高く結晶核が少ない水は、0℃未満でも液体状態を保つ場合があるという説明を採用。
- 過冷却した水では、衝撃や氷の結晶が結晶化のきっかけになる場合がある。
- `叩けば必ず凍る`とは説明していない。
- Harvard Natural Sciences Lecture Demonstrations: https://sciencedemonstrations.fas.harvard.edu/presentations/supercooling-water
- MIT News: https://news.mit.edu/2011/heavy-water-0801
- MIT OpenCourseWare: https://ocw.mit.edu/courses/3-091-introduction-to-solid-state-chemistry-fall-2018/da732766df67fda9514d_AbyrF4VtlYY.pdf
- University of Barcelona: https://www.ub.edu/fisestub/introduction-to-nucleation/

## 注意

- 映像は実写の実験記録ではなくAI再現映像。
- YouTube Studioの合成・改変コンテンツは`はい`を選択する。
- 実験手順動画ではない。ガラス容器や強い衝撃を推奨しない。

## 公開後に取得する指標

- 24時間・72時間・7日の再生数
- Shortsフィード表示回数
- 視聴を選択した割合
- 平均視聴率
- 高評価、コメント、共有、登録増
- 前作コーラ噴水との冒頭2秒比較

## 2026-08-25 氷結SE再同期

- 修正版: `out/ai-viral-supercooled-water-01-final-v2.mp4`
- 確認方法: 完成動画の232–247フレームを1フレーム単位で比較
- 最初の結晶が視認できる位置: 約7.87秒（236フレーム付近）
- 旧SE開始: 約7.13秒
- 新SE開始: 約7.87秒
- 修正量: 22フレーム、約0.73秒後ろへ移動
- 映像ストリーム: 旧版と修正版のSHA-256が一致し、再エンコードなし
- 修正版仕様: 29.312秒、1080×1920、30fps、H.264、AAC stereo、48kHz
- 修正版音量: -15.9 LUFS / -1.2 dBFS true peak
- YouTube予約済み動画は旧版のため、差し替えには旧予約の取消と修正版の再アップロードが必要
