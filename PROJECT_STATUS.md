# AIMudaLab Project Status

最終更新: 2026-09-06 JST
更新担当: Codex / PC1

## 同期状態

| 項目 | 状態 |
|---|---|
| ローカルブランチ | `main` |
| GitHub remote | `https://github.com/aidxelsystems/aimudalab.git` |
| GitHub同期 | `start sync completed` |
| 理由 | 2026-09-06に`origin/main`をfetchし、開始時点の差分0を確認。`main`は`origin/main`を追跡 |
| Git追跡 | 資料・JSON・Remotionコード・設定のみ、391ファイル、約2.11MB |
| Google Drive対象 | 動画・画像・BGM・効果音・音声、330素材、約264.81MB |

GitHubへの初回pushとupstream設定は完了。別PCでは、制作開始前に `npm run sync:start` を実行して最新進捗を取得する。

## 現在の作業

| 項目 | 内容 |
|---|---|
| active episode | `motion-comic-format-prototype-01` |
| owner | `PC1 / Codex` |
| production status | `editing` |
| active render | なし |
| uncommitted production work | 承認済み画風サンプルはローカル素材。モーションコミック字幕仕様を作成済み |
| next production action | 青山龍星のナレーションを使い、約3秒の冒頭モーション試作を制作・QCする |

### モーションコミック音声方針

- 青山龍星: 基本ナレーション。
- ずんだもん: 最後のツッコミのみ。
- その他のVOICEVOX話者: 登場人物の会話、感情差、年代・役割の表現に利用する。
- 1話内で話者を増やしすぎず、基本はナレーター＋登場人物1名＋最後のずんだもんまでとする。

## 現在の制作環境（PC2）

- OS: Linux
- VOICEVOX: Docker運用、ホストAPI `http://127.0.0.1:50021`
- 2026-08-29確認: Docker導入済み。VOICEVOX API v0.25.2の疎通確認済み。
- 2026-08-29確認: 公式Node.js LTS v24.19.0 / npm 11.17.0を `.tools/` に導入済み。`npm ci`、型検査、素材台帳生成に成功。
- 2026-08-29確認: Remotion一式を脆弱性修正版4.0.518へ更新し、npm監査は脆弱性0件。
- 現在のワークスペースは素材とGitHub制作ファイルを統合済み。環境管理下の空の `.git` を避け、GitメタデータをGit対象外の `.gitdata/` に保持する。同期スクリプトはこれを自動認識する。

## 最新作品

| episode | 状態 | 公開日時 | 次の確認 |
|---|---|---|---|
| `ai-viral-laser-cleaning-01` | YouTube予約済み | 2026-09-02 19:00 JST | 公開24時間後・72時間後にOperationTeam分析 |
| `ai-viral-oobleck-01` | YouTube予約済み | 2026-09-03 19:00 JST | 公開24時間後・72時間後にOperationTeam分析 |

- 完成動画: `out/ai-viral-laser-cleaning-01-final-v4.mp4`（ローカル、Git対象外）
- YouTube: `https://youtu.be/AiCwHh641Vc`
- 投稿記録: `OperationTeam/uploads/2026-09-02-ai-viral-laser-cleaning-01.json`
- 機械QC: 合格、人による完成確認済み

- ウーブレック完成動画: `out/ai-viral-oobleck-01-final.mp4`（28.4秒、ローカル、Git対象外）
- ウーブレック機械QC: 合格（1080×1920 / 30fps / -15.98 LUFS / True Peak -1.39 dBTP）
- ウーブレック代表7フレーム: 目視合格。ユーザーによる完成確認済み。
- ウーブレックYouTube: `https://youtu.be/Qb0PBEMvAd0`（2026-09-03 19:00 JST予約）

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
