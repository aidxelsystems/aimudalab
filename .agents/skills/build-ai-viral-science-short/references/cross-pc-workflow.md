# 2台PC・GitHub制作運用

この文書は `https://github.com/aidxelsystems/aimudalab` を正本として、Codex、Claude Code、2台のローカルPCで同じ制作基準を再現するために使う。

## 共有するもの

通常のGitで共有する。

- `.agents/skills/`: Codexが読むリポジトリ内スキル
- `*/AGENTS.md`、`CLAUDE.md`、`CHANNEL_VISION.md`: チーム方針と役割
- `src/`、`scripts/`、`data/episodes/`: Remotion実装、生成処理、台本データ
- `ProductionTeam/drafts/`: 制作ブリーフ、Flow・Sunoプロンプト、出典
- `ProductionTeam/handoffs/`: レンダー契約と機械QC結果
- `ProductionTeam/PRODUCTION_BOARD.md`: 作品の担当、状態、次アクション
- `OperationTeam/uploads/`、`OperationTeam/reports/`: 投稿記録と分析結果
- `package.json`、`package-lock.json`、各種設定ファイル

Google Driveで共有する。Drive上のフォルダ構造はローカルの `public/` と一致させる。

- `public/movie/**/*.mp4`
- `public/BGM/**/*.mp3`
- `public/Effect/**/*.mp3`
- `public/voice/**/*.wav`
- `public/image/`、`public/knowledge/`、`public/quiz/` の画像
- `charactor/` とepisode別画像
- その他の動画、画像、音声、編集素材

ローカルだけに置く。

- `OperationTeam/.env` とOAuth・APIの秘密情報
- `node_modules/`
- `out/` と `tmp/`
- Claude CodeやCodexの端末固有キャッシュ、ロック、作業状態

完成MP4は原則 `out/` に置き、YouTube投稿記録だけをGitへ残す。完成MP4を長期保存する場合もGoogle Driveへ移す。

## 初回セットアップ

1. Git、Google Drive for desktop、Node.js、FFmpeg、VOICEVOX、VS Code、CodexまたはClaude Codeを導入する。
2. リポジトリをクローンする。
3. Google Driveの `AIMudaLabAssets/public/` を、リポジトリの `public/` へ同期またはコピーする。
4. 必要に応じて `charactor/` とepisode別画像も同じ相対パスへ復元する。
5. `npm ci` を実行する。
6. `OperationTeam/.env.example` を `OperationTeam/.env` にコピーし、各PCで秘密情報を設定する。`.env` はコミットしない。
7. `npm run assets:manifest` を実行し、共有素材の欠損や差分を確認する。
8. VOICEVOXを `http://127.0.0.1:50021` で起動し、音声生成を試す。
9. `npx tsc --noEmit` を実行する。
10. Codexで `$build-ai-viral-science-short` が認識されることを確認する。見つからなければCodexを再起動する。

## 作品ごとの所有権

1作品につき、同時にRemotion実装を編集するPCは1台だけにする。作業前に `ProductionTeam/PRODUCTION_BOARD.md` の `owner` と `branch` を更新する。

推奨ブランチ名:

- `pc1/ai-viral-<topic>-brief`
- `pc1/ai-viral-<topic>-production`
- `pc2/ai-viral-<topic>-assets`
- `pc2/ai-viral-<topic>-render`

状態は次だけを使う。

`idea / researched / prompt-ready / assets-ready / editing / rendered / qc-passed / scheduled / published`

## 日々の同期

作業開始時:

```powershell
git switch main
git pull --ff-only
git switch -c pc1/ai-viral-<topic>-production
```

作業終了時:

```powershell
git status
git add <今回変更したファイル>
git commit -m "feat: produce <episode-id>"
git push -u origin <branch-name>
```

別PCへ渡す前に必ずコミットとpushを終え、ボードの `next action` に次の一手を書く。

## 制作引き継ぎ

レンダー担当へ渡す最低条件:

- episode JSONとresolved JSONが同期済み
- 専用Compositionが `src/Root.tsx` に登録済み
- VOICEVOX、BGM、映像、画像が参照先に存在
- `ProductionTeam/handoffs/<episode>.render.json` が `ready`
- 制作ブリーフに出典、AI表示、発音注意、狙いが記載済み
- ボードに担当PCと次のアクションが記載済み

レンダー担当は、物語、字幕文、タイミング、素材選定を独断で変えない。問題があればhandoffを `blocked` にせず、ボードへ具体的な修正要求を書いて制作担当へ返す。

## 競合を避ける箇所

- `src/Root.tsx`: Composition登録を追加する前に最新mainを取り込む。
- `youtube_description.md`: 追記位置が競合しやすいため、作品別投稿JSONを正本にする。
- `OperationTeam/uploads/`: 同じ動画IDのJSONを複数PCで編集しない。
- `ProductionTeam/PRODUCTION_BOARD.md`: 作業開始と終了時だけ、短い変更に留める。

## GitHubへ置かないもの

- アクセストークン、リフレッシュトークン、Client Secret、APIキー
- 個人情報、未公開の顧客情報
- ライセンス不明の音楽、映像、画像
- 再生成できる大量の一時レンダーとQCフレーム
- Google Driveで管理する動画、画像、BGM、効果音、VOICEVOX音声

誤って秘密情報をコミットした場合、削除コミットだけでは不十分なので、直ちに資格情報を失効・再発行する。
