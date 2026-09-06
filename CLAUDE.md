# Claude Code / PC2 制作引き継ぎ

このリポジトリは「AIのムダ遣い」YouTube ShortsのRemotion制作環境です。PC2は高負荷制作側を標準担当とします。最初に`MULTI_PC_TEAM_OPERATIONS.md`、`ProductionTeam/AGENTS.md`、対象のPlanning handoffまたは制作ブリーフを読んでください。最終レンダーを引き受ける場合は、加えて`ProductionTeam/handoffs/README.md`と対象の`ProductionTeam/handoffs/*.render.json`を確認してください。

PC1は原則として分析、企画、出典、台本、制作仕様、プロンプトを担当します。PC2は、承認済み仕様に基づく素材配置、VOICEVOX、Remotion実装、SE、レンダリング、代表フレーム、機械QCを担当します。ユーザーの明示指示がある場合はこの標準分担を変更できます。

## 必須のGitHub・進捗同期

制作、編集、音声生成、レンダリングを始める前に `npm run sync:start` を実行し、成功後の `PROJECT_STATUS.md` と `ProductionTeam/PRODUCTION_BOARD.md` を読む。対象作品のownerと作業状態を更新し、その変更をcommit・pushしてから着手する。

同期失敗、dirty worktree、upstream未設定、他PCがowner、進行中レンダーのいずれかがある場合は作業を開始しない。自動stash、強制pull、既存変更の破棄は禁止する。

## 最終レンダー依頼の扱い

1. `status` が `ready` であることを確認する。
2. 最初は検証だけを実行する。

```powershell
npm run validate:handoff -- ProductionTeam/handoffs/<episode>.render.json
```

3. 検証合格後、次を実行する。

```powershell
npm run finalize:handoff -- ProductionTeam/handoffs/<episode>.render.json
```

4. 生成されたQCレポート、`*.result.json`、代表フレームを確認し、字幕切れ、主役との衝突、音声と効果音のズレ、終端切れがないか報告する。
5. 開始したレンダーとFFmpeg処理が終了するまで監視し、実行中セッションを残して終了しない。
6. 成否と再開点を進捗ファイルへ反映し、commit・push後に `npm run sync:verify` を実行する。

契約が検証済みなら、ユーザーが同じコマンドをVS Codeのターミナルから直接実行しても同一工程になる。

## 本編制作依頼の扱い

`researched`または`prompt-ready`から本編制作を依頼された場合は、Planning handoffに記載された題材、検証変数、尺、カット、声、字幕、避ける表現、成功条件を固定する。不足があれば推測で大きく構成変更せず、具体的な不足をPC1へ戻す。

1. ユーザーの制作承認と、対象episodeが`未割当`であることを確認する。
2. Production Boardでownerを`PC2 / Codex`または実際の担当名へ変更し、開始状態をcommit・pushする。
3. Google Driveから指定された素材を、handoffと同じ相対パスへ配置する。
4. VOICEVOX音声の実測尺を基準に字幕と画面転換を同期する。
5. Remotion Studioまたは代表フレームでフック、転換、オチを確認してから最終レンダーへ進む。
6. 完成後はQC記録とProduction Boardを更新し、重い素材を除く変更だけをGitHubへpushする。

## 境界

- 最終レンダー担当は、台本、字幕、画像、ナレーション、BGM、Remotionの演出を独断で変更しない。
- 本編制作担当も、Planning handoffの主題、事実関係、検証変数を独断で変更しない。
- 機械QCで失敗した場合は、原因と該当ファイルを報告して制作工程へ戻す。
- 完成MP4の生成は許可されるが、YouTubeへのアップロード、予約公開、既存動画の削除は行わない。
- ユーザーの既存変更を保持し、無関係なファイルを整形・変更しない。
- レンダー途中、QC未完了、バックグラウンド処理中を完了扱いしない。
