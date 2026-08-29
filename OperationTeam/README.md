# AIのムダ遣いちゃんねる OperationTeam

YouTubeチャンネル `@AIMudaLab` の数値を収集し、動画別の診断と次週の企画・改善案を作る運用エージェントチームです。

## チーム

- `agents/operation-manager.md` — 分析統括、優先順位決定、最終レポート
- `agents/data-analyst.md` — データ収集、欠損・比較可能性の監査
- `agents/performance-analyst.md` — 初速、視聴、反応、登録転換の診断
- `agents/content-strategist.md` — 題材・構成・尺・投稿傾向の分析
- `agents/growth-planner.md` — 次週の実験、企画候補、改善アクション

詳しい役割分担と運用規則は `AGENTS.md` にあります。

## できること

### 認証なし／APIキーのみ

YouTube Data APIから次を取得します。

- 動画ID、タイトル、公開日時、説明文
- 再生回数、高評価数、コメント数
- 動画尺
- チャンネル登録者数、総再生回数

### チャンネル所有者のOAuth認証あり

YouTube Analytics APIから次を取得します。

- 日別・動画別の再生回数
- 総再生時間、平均視聴時間
- 高評価、コメント、共有、登録増減
- 流入元、デバイス、登録済み／未登録視聴者

インプレッション、クリック率、Shortsの「視聴を選択／スワイプ」など、APIで取得できない、または取得条件が変わる指標はYouTube StudioからCSVを出力し、`data/imports/` に保存して分析材料にします。

## セットアップ

Node.js 18以上を使用します。追加パッケージは不要です。

1. Google CloudでYouTube Data API v3とYouTube Analytics APIを有効化します。
2. `.env.example` をコピーして `OperationTeam/.env` を作り、値を設定します。スクリプトが起動時に自動で読み込みます。
3. 認証情報をファイルやGitへ保存しないでください。

```powershell
YOUTUBE_API_KEY=...
YOUTUBE_ACCESS_TOKEN=...
```

## 実行

公開データを取得します。

```powershell
node OperationTeam/scripts/collect-public.mjs
```

所有者限定Analyticsを取得します。アクセストークンには読み取り権限が必要です。

```powershell
node OperationTeam/scripts/collect-analytics.mjs
```

保存済みデータから週次レポートを作ります。

```powershell
node OperationTeam/scripts/generate-weekly-report.mjs
```

最初はサンプルデータで動作を確認できます。

```powershell
node OperationTeam/scripts/generate-weekly-report.mjs --sample
```

出力先は `reports/YYYY-MM-DD-weekly.md` です。

## 定例運用

- 毎日: 公開データとAnalyticsを収集
- 投稿24時間後: 初速と反応率を診断
- 毎週月曜: 直近7日とその前7日を比較し、次週の実験を決定
- 毎月: 題材・構成・尺別の勝率を見直す

### 自動定例会

ChatGPTデスクトップのScheduledに `scheduled/weekly-channel-council-prompt.md` を登録すると、毎週の全Team定例会をローカルプロジェクト上で実行できます。推奨は毎週月曜09:00（Asia/Tokyo）です。

会議前処理の手動テスト:

```powershell
node OperationTeam/scripts/prepare-weekly-meeting.mjs --offline
```

議事録は `meetings/YYYY-MM-DD-channel-council.md` に保存し、`meetings/LATEST.md` と `meetings/INDEX.md` から参照します。ローカルファイルを使う定期タスクの実行中は、PCを起動しChatGPTデスクトップアプリを実行しておきます。

投稿、削除、コメント返信、メタデータ変更はこの初期版では行いません。すべて読み取り専用です。
