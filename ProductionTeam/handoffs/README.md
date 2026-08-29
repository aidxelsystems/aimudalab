# Codex / Claude Code 共通レンダー引き継ぎ

## 目的

企画、事実確認、台本、動画素材、BGM、挿し絵、ナレーション、字幕、Remotion演出までは制作側で確定し、計算時間の長い最終レンダーと機械QCだけをCodexまたはClaude Codeの余裕がある方へ渡す。

両者の利用枠を自動判定して切り替える仕組みではない。ユーザーが利用可能な方を選び、同じJSON契約と同じコマンドを実行する。この方式なら担当を変えても出力条件が変わりにくい。

契約が完成していれば、VS Codeのターミナルからユーザー自身が同じコマンドを直接実行することもできる。その場合、レンダー処理自体にCodexやClaude Codeの会話トークンは使わず、ローカルPCのCPU・メモリだけを使う。

## 制作側の完了条件

- 対象Compositionが `src/Root.tsx` に登録済み。
- 台本、字幕、画像、Flow動画、BGM、VOICEVOX音声、SEが確定済み。
- Remotion Studioまたは代表フレームで、冒頭フックと終盤CTAを確認済み。
- 事実・出典・AI再現表示が必要な作品は、制作仕様に記録済み。
- `ProductionTeam/handoffs/*.render.json` を作り、`status` を `ready` にする。

## 手順

テンプレートを作品名で複製し、Composition ID、出力先、想定尺、確認時点、関連ファイルを更新する。
Compositionへ外部propsを渡す形式だけは、契約の最上位に `"props": "../../data/episodes/<episode>.resolved.json"` を追加する。

```powershell
npm run validate:handoff -- ProductionTeam/handoffs/<episode>.render.json
npm run finalize:handoff -- ProductionTeam/handoffs/<episode>.render.json
```

`validate:handoff` は契約、Composition登録、関連ファイル、出力先を検査するだけで、MP4を作らない。`finalize:handoff` は次を順番に行う。

1. TypeScript検査
2. Remotionによる一時MP4の生成
3. 尺・映像・音声ストリームの検査
4. 2パスのラウドネス正規化
5. 完成MP4の全編デコード検査
6. 代表フレーム抽出
7. QCレポートと機械可読な結果JSONの生成

## レンダー後の人による確認

機械QCだけでは笑いの間や違和感は保証できない。実行担当は完成MP4を通しで視聴し、少なくとも次を確認する。

- 0〜2秒で題材と異常事態が無音でも分かる。
- 字幕、名称、数値、出典がShorts UI安全域に収まる。
- ナレーション、字幕、打撃・破砕・凍結などのSEが同期する。
- 画面転換後に前の字幕や音が残らない。
- オチと「チャンネル登録もよろしく」が読み切れる。

修正が必要なら最終MP4へ直接つぎはぎせず、Remotion側を修正して同じ契約から再レンダーする。

## Claude Codeへ渡す短い依頼文

```text
CLAUDE.mdとProductionTeam/handoffs/README.mdを読み、
ProductionTeam/handoffs/<episode>.render.json の最終レンダーを実行してください。
最初にvalidate:handoff、合格後にfinalize:handoffを使い、
生成されたQCレポートと代表フレームも確認してください。
制作内容とYouTube投稿状態は変更しないでください。
```

## 投稿との分離

この工程の成果は完成MP4とQC記録まで。YouTubeアップロード、公開日時、タイトル、概要欄、既存投稿の差し替えは別工程とし、ユーザーの明示依頼を受けてから行う。
