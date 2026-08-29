# PlanningTeam

市場状況、`OperationTeam`の実績、季節性、制作可能性を統合し、次に作る動画の企画判断を行うチームです。

## 位置づけ

```text
OperationTeam（自チャンネルの事実）
        ↓
PlanningTeam（市場との比較・企画選定）
        ↓
ProductionTeam（企画意図から完成動画・投稿品質までを統括）
        ↓
動画制作・投稿
        ↓
OperationTeam（結果検証）
```

運用実績と市場調査を分離することで、「自チャンネルで起きた事実」と「外部市場から得た仮説」を混同しないようにします。

## 担当

- `agents/planning-manager.md` — 情報統合、企画採否、ProductionTeamへの依頼
- `agents/market-researcher.md` — 競合、類似企画、季節性、プラットフォーム動向
- `agents/audience-planner.md` — 視聴者ニーズ、理解速度、コメント誘発
- `agents/experiment-designer.md` — 比較可能な企画実験と成功条件

## 運用

1. `OperationTeam/reports/` の最新管理報告を読む。
2. `research/` の市場調査を更新する。
3. 候補を「需要・独自性・画像展開・検証価値・制作負荷」で採点する。
4. 上位3案をユーザーへ提案する。
5. ユーザー承認後、`handoffs/` にProductionTeam向け企画書を作成する。
6. ProductionTeamは企画書を入力として、台本、画像、音声、編集、完成動画の制作へ進む。

承認前に`story.json`は変更しません。
