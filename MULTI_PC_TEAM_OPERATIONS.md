# AIMudaLab 2台PCチーム運用

最終更新: 2026-09-06 JST

## 目的

PC1を企画・分析・判断へ、処理性能の高いPC2を素材処理・音声・編集・レンダリングへ寄せる。役割を分けることで、PC1では次の企画を進めながら、PC2では承認済み作品を高品質に完成できる状態を作る。

これは固定的な権限分離ではなく標準担当である。ユーザーが個別に指定した場合は変更できるが、変更時もProject StatusとProduction Boardのownerを先に更新する。

## 標準のTeam配置

| Team・機能 | PC1（企画側） | PC2（制作側） |
|---|---|---|
| OperationTeam | YouTube指標取得、同経過時間比較、原因診断、実験判定、定例会 | 完成動画の機械QC値をOperationTeamへ渡す |
| PlanningTeam | 市場・競合調査、視聴者仮説、テーマ選定、事実確認、企画採点 | 制作中に判明した画面化困難・素材不足を戻す |
| ProductionTeam | 制作統括、構成、台本、5コマ設計、画像・BGMプロンプト、字幕仕様、成功条件 | 画像・動画・BGM配置、VOICEVOX、Remotion実装、SE、レンダリング、代表フレーム、音声QC |
| BusinessTeam | 実績と制作工数の評価、商品設計、案件化準備度、リスク整理 | 実際の制作時間、生成回数、費用、修正回数を記録する |
| Git管理 | 企画引継ぎをcommit・pushし、次作品を未割当で渡す | 着手前に同期・owner確保・pushし、完成状態とQCを返す |
| Google Drive | 必要素材一覧と格納先を指定する | 重い画像、動画、BGM、SE、音声、完成MP4を同じ相対パスへ配置する |

## PC1の完了条件

PC1は、単なるテーマ案ではなく、PC2が制作判断をやり直さずに着手できる状態まで作る。

1. OperationTeamの直近データと今回の検証変数を確認する。
2. PlanningTeamのhandoffへ、題材、視聴者、冒頭1秒、構成、避ける表現、成功指標を書く。
3. 事実コンテンツは出典と、断定できる範囲・できない範囲を記録する。
4. ProductionTeam向けに、各カット、声、字幕、効果、尺、必要素材、公開後の判定条件を定義する。
5. Production Boardのepisodeを`researched`または`prompt-ready`、ownerを`未割当`として登録する。
6. 変更をcommit・pushし、PC2へ具体的な次の1工程を渡す。

PC1の標準停止点は`prompt-ready`である。画像生成、VOICEVOX、Remotion実装、レンダリングは、ユーザーから別指定がない限りPC2へ渡す。

## PC2の開始条件

PC2は制作開始前に次を行う。

```bash
npm run sync:start
```

1. `PROJECT_STATUS.md`と`ProductionTeam/PRODUCTION_BOARD.md`を読む。
2. 対象handoffと制作ブリーフ、参照するQCを最後まで読む。
3. episodeのownerが`未割当`であることを確認する。
4. ownerを`PC2 / Codex`、branchを実際のbranch、statusとnext actionを具体化する。
5. 制作開始の状態をcommit・pushしてから、Google Driveの素材を配置する。

## PC2の完了条件

1. VOICEVOX、Remotion、FFmpeg等の開始済みプロセスをすべて終了させる。
2. 1080×1920、音声、尺、デコード、ラウドネスを機械検査する。
3. フック、重要な転換、オチの代表フレームを目視する。
4. 台本、字幕、音声、画像、BGM、SEが同じ版であることを確認する。
5. QC結果、使用素材、完成MP4のローカル／Driveパス、残る人間確認を記録する。
6. Production Boardを`rendered`または`qc-passed`へ更新し、コード・資料・設定をcommit・pushする。
7. `npm run sync:verify`でGitHubとの一致を確認する。

YouTube投稿は制作完了に含めない。タイトル、公開日時、アップロードはユーザーから明示的な依頼があった場合だけ実施する。

## 1作品の標準フロー

```text
PC1 Operation分析
  → PC1 Planning企画・出典
  → ユーザーが題材承認
  → PC1 Production設計・プロンプト・handoff
  → GitHubへpush（episodeは未割当）
  → PC2がsync・owner確保・push
  → PC2が素材配置・音声・Remotion・レンダー・QC
  → GitHubへ完成状態をpush、重い素材はDrive
  → ユーザーが完成確認・投稿承認
  → 公開後、PC1 Operationが24時間・72時間・7日を分析
```

## 共有対象

### GitHub

- Team契約、スキル、企画、調査、出典
- 制作ブリーフ、episode JSON、Remotionコード、設定
- Project Status、Production Board、handoff、QC、投稿記録、分析

### Google Drive

- 生成画像、Flow等の動画、公式画像
- BGM、SE、VOICEVOX音声
- 完成MP4、代表フレームの大容量アーカイブ

### 各PCのみ

- `.env`、OAuthトークン、APIキー
- `node_modules/`、キャッシュ、一時レンダー

認証情報はGitHubにもGoogle Driveにも置かず、必要なPCへ個別設定する。

## 競合編集を防ぐルール

- 1 episodeのownerは同時に1台だけ。
- `未割当`以外のepisodeを、別PCが編集しない。
- 同期前に企画、コード、レンダリングを開始しない。
- PC1が企画更新中、PC2は同じhandoffを変更しない。
- PC2が`editing`以降のとき、PC1は同じepisodeの台本を変更しない。変更案は別のMarkdownへ記録し、PC2へ明示的に渡す。
- 中断時は`interrupted`と、最後に完了した工程、実行中プロセスの有無を残す。
- 重い素材はGitへ追加しない。相対パスとファイル名をhandoffへ残す。

## 現在の適用

- PC1: `本当にあったムダ漫画`3本検証の企画、出典、成功条件、運用分析を担当。
- PC2: ユーザー承認後、`motion-comic-eiffel-scam-01`の5画像、VOICEVOX、Remotion本編、レンダリング、QCを担当。
- 第1作の公開後指標はPC1が24時間・72時間で取得する。
- 3本目公開72時間後、全Teamで形式採否とBusinessTeamの準備度を再判定する。
