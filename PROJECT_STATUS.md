# AIMudaLab Project Status

最終更新: 2026-08-29 15:12 JST  
更新担当: Codex / PC1  

## 同期状態

| 項目 | 状態 |
|---|---|
| ローカルブランチ | `main` |
| GitHub remote | `https://github.com/aidxelsystems/aimudalab.git` |
| GitHub同期 | `blocked` |
| 理由 | 現在のGit認証ユーザー `digitarod` にpush権限がなく403 |
| Git追跡 | 資料・JSON・Remotionコード・設定のみ、391ファイル、約2.11MB |
| Google Drive対象 | 動画・画像・BGM・効果音・音声、330素材、約264.81MB |

GitHubの書き込み権限が直るまで、新しい制作作業を別PCへ引き継がない。権限修正後はこのファイルを最初にpushし、`sync_state` を `synced` 相当へ更新する。

## 現在の作業

| 項目 | 内容 |
|---|---|
| active episode | なし |
| owner | ユーザー |
| production status | `idle` |
| active render | なし |
| uncommitted production work | なし |
| next production action | GitHub認証修正後、Google Drive素材共有を設定 |

## 最新作品

| episode | 状態 | 公開日時 | 次の確認 |
|---|---|---|---|
| `ai-viral-laser-cleaning-01` | YouTube予約済み | 2026-09-02 19:00 JST | 公開24時間後・72時間後にOperationTeam分析 |

- 完成動画: `out/ai-viral-laser-cleaning-01-final-v4.mp4`（ローカル、Git対象外）
- YouTube: `https://youtu.be/AiCwHh641Vc`
- 投稿記録: `OperationTeam/uploads/2026-09-02-ai-viral-laser-cleaning-01.json`
- 機械QC: 合格、人による完成確認済み

## 共有ストレージ

- GitHub: スキル、進捗、企画、制作ブリーフ、episode JSON、Remotionコード、handoff、QC、投稿記録、分析。
- Google Drive: Flow動画、挿し絵、公式画像、BGM、効果音、VOICEVOX音声、完成動画アーカイブ。
- ローカルのみ: `.env`、OAuth情報、`node_modules/`、作業中の `out/`、一時ファイル。
- 素材台帳: `ProductionTeam/assets-manifest.json`

## 作業開始ゲート

次のすべてが完了するまで、企画変更、コード編集、音声生成、レンダリング、投稿作業を開始しない。

1. `npm run sync:start` が成功している。
2. このファイルと `ProductionTeam/PRODUCTION_BOARD.md` を読んでいる。
3. 対象episodeに他PCのownerがいない。
4. 対象episode、owner、branch、status、next actionを更新している。
5. 作業開始状態をcommitし、GitHubへpushしている。

## 作業完了ゲート

1. 開始したレンダリング、FFmpeg、音声生成プロセスが終了している。
2. レンダリング依頼では完成MP4、機械QC、代表フレーム、人の確認状態が記録されている。
3. このファイルとProduction Boardを最終状態へ更新している。
4. コード・資料・設定だけをcommitし、GitHubへpushしている。
5. `npm run sync:verify` でローカルHEADとGitHubが一致している。

レンダリングの途中、バックグラウンドプロセス実行中、QC未完了を「完了」と記録しない。予期せず中断した場合は `production status` を `interrupted` として残し、次のPCが再開点を判断できるようにする。
