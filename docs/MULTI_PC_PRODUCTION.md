# AIMudaLab 2台PC制作ガイド

正本リポジトリ: `https://github.com/aidxelsystems/aimudalab`

## 役割分担

| 保存先 | 内容 |
|---|---|
| Git | 制作スキル、企画、台本、Remotionコード、レンダー契約、QC結果、投稿記録 |
| Google Drive | Flow動画、画像、BGM、効果音、VOICEVOX音声、完成MP4 |
| 各PCのみ | `.env`、OAuth情報、`node_modules/`、`out/`、一時ファイル |

制作方法の正本は次の2ファイル。

- `.agents/skills/build-ai-viral-science-short/SKILL.md`
- `.agents/skills/build-ai-viral-science-short/references/production-standard.md`

詳細な2台運用ルールは `.agents/skills/build-ai-viral-science-short/references/cross-pc-workflow.md` を参照する。

## 新しいPC

```powershell
git clone https://github.com/aidxelsystems/aimudalab.git
cd aimudalab
npm ci
npm run assets:manifest
npx tsc --noEmit
```

先にGoogle Driveの素材を同じ相対パスへ同期する。次に `OperationTeam/.env.example` を `OperationTeam/.env` へコピーし、そのPC専用の認証情報を設定する。VOICEVOXはローカルで起動する。

## 制作開始

1. `ProductionTeam/PRODUCTION_BOARD.md` で担当を確保する。
2. mainを更新し、PC名と作品名を含むブランチを作る。
3. Codexには `$build-ai-viral-science-short` を指定する。
4. 素材、実装、handoff、QC結果を同じepisode IDで管理する。
5. 完成MP4はローカルの `out/` に残し、必要なら別途バックアップする。

素材のフォルダ構成と確認方法は `docs/GOOGLE_DRIVE_ASSETS.md` を参照する。

## 最小確認

```powershell
npx tsc --noEmit
npm run validate:handoff -- ProductionTeam/handoffs/<episode>.render.json
```

レンダー時:

```powershell
npm run finalize:handoff -- ProductionTeam/handoffs/<episode>.render.json
```

GitHubへpushする前に `git status` を確認し、`.env`、トークン、`out/` が含まれていないことを必ず確認する。
