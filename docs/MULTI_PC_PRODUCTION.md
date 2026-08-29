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

先にGoogle Driveの素材を同じ相対パスへ同期する。次に `OperationTeam/.env.example` を `OperationTeam/.env` へコピーし、そのPC専用の認証情報を設定する。

## Linux / VOICEVOX環境

- 制作PCのOSはLinux。
- VOICEVOX EngineはDockerコンテナで稼働させる。
- コンテナのAPIをホストの `127.0.0.1:50021` へ公開する。
- 音声生成前に `curl http://127.0.0.1:50021/version` が成功することを確認する。
- コンテナ名・イメージ・CPU/GPU別の起動オプションはPC固有情報として扱い、プロジェクト共通の契約はAPI URLに統一する。

## 制作開始

1. `npm run sync:start` でGitHubをfast-forward同期する。
2. `PROJECT_STATUS.md` と `ProductionTeam/PRODUCTION_BOARD.md` を読む。
3. 担当、branch、status、next actionを記入し、commit・pushして担当を確保する。
4. Codexには `$build-ai-viral-science-short` を指定する。
5. 素材、実装、handoff、QC結果を同じepisode IDで管理する。
6. 完成MP4はローカルの `out/` に残し、必要ならGoogle Driveへバックアップする。
7. 完了状態を更新してpushし、`npm run sync:verify` を実行する。

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

レンダリング開始後は、Remotion、FFmpeg、QCが終了するまで同じ担当が監視する。途中で別PCへ渡す場合は完了ではなく `interrupted` として再開点を記録する。
