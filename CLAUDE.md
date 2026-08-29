# Claude Code 制作引き継ぎ

このリポジトリは「AIのムダ遣い」YouTube ShortsのRemotion制作環境です。Claude Codeが最終レンダーを担当するときは、先に `ProductionTeam/AGENTS.md` と `ProductionTeam/handoffs/README.md` を読み、対象の `ProductionTeam/handoffs/*.render.json` を確認してください。

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

契約が検証済みなら、ユーザーが同じコマンドをVS Codeのターミナルから直接実行しても同一工程になる。

## 境界

- 最終レンダー担当は、台本、字幕、画像、ナレーション、BGM、Remotionの演出を独断で変更しない。
- 機械QCで失敗した場合は、原因と該当ファイルを報告して制作工程へ戻す。
- 完成MP4の生成は許可されるが、YouTubeへのアップロード、予約公開、既存動画の削除は行わない。
- ユーザーの既存変更を保持し、無関係なファイルを整形・変更しない。
