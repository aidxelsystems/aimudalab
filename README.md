# AIのムダ遣い 制作・運用リポジトリ

Remotion + VOICEVOXを中心に、AIエンタメShortsの企画、素材、編集、QC、分析、投稿記録を管理する。大喜利に加え、AIグルメ、バズ科学、歴史・知識エンタメを同じ制作基盤で扱う。

## 2台PCでの制作

- 制作進行: `ProductionTeam/PRODUCTION_BOARD.md`
- プロジェクト全体の現在地: `PROJECT_STATUS.md`
- セットアップと同期: `docs/MULTI_PC_PRODUCTION.md`
- AIバズ科学Shortsスキル: `.agents/skills/build-ai-viral-science-short/SKILL.md`
- 秘密情報のひな形: `OperationTeam/.env.example`

動画、画像、BGM、効果音、音声はGoogle Drive、コードと制作資料はGitで共有する。`.env` と作業中の完成レンダー `out/` は各PCだけに置く。

すべての制作作業は `npm run sync:start` でGitHubと進捗を同期してから開始し、完了後は `npm run sync:verify` でremoteとの一致を確認する。

## 現在の制作基盤

- 縦1080×1920 / 30fpsのRemotion Composition
- VOICEVOXによる男女掛け合いと表示文・読みの分離
- BGM、SE、画面揺れ、フラッシュ、図解、Shorts安全域字幕
- AIグルメ、緊張と緩和グルメ、AIバズ科学、混合メディア歴史、大喜利
- episode JSON、制作ブリーフ、共通handoff、機械QC、YouTube投稿JSON
- OperationTeam、PlanningTeam、ProductionTeam、BusinessTeamの役割分離

## 必要環境

- Node.js 18+
- VOICEVOX エンジン(`http://127.0.0.1:50021` で起動しておく)

## 使い方

```bash
# 0. 依存インストール
npm install

# 1. 音声生成(VOICEVOX。speaker省略時は 3 = ずんだもん ノーマル)
npm run voice -- data/episodes/ep001.json 3

# 2. 音声尺を計測して duration を解決(→ ep001.resolved.json)
npm run measure -- data/episodes/ep001.json

# 3. レンダリング
npx remotion render OgiriShort out/ep001.mp4 --props=data/episodes/ep001.resolved.json

# まとめて実行(1〜3)
npm run build:ep001

# スタジオでプレビュー
npm run studio
```

## 出力

`out/ep001.mp4` — 1080×1920 / 30fps / H.264(yuv420p)/ 約57秒、VOICEVOX音声入り。

## 別エピソードを作る

1. `data/episodes/<id>.json` を新規作成(`ep001.json` をひな形に)
2. `npm run voice -- data/episodes/<id>.json` → `npm run measure -- data/episodes/<id>.json`
3. `npx remotion render OgiriShort out/<id>.mp4 --props=data/episodes/<id>.resolved.json`

## 主要ファイル

- `src/lib/timeline.ts` — 回答配列→フレーム割当(尺計算・加速・ピークのタメ・尺警告)
- `src/lib/types.ts` — ネタ JSON 型定義
- `src/OgiriShort.tsx` — メイン Composition
- `src/sections/OdaiBar.tsx` — お題常駐バー
- `src/answers/AnswerCard.tsx` — 回答カード(tag分岐の土台)
- `scripts/voicevox-gen.mjs` — VOICEVOX 音声生成
- `scripts/measure-audio.mjs` — 音声尺計測 → duration 解決(props JSON 出力)
