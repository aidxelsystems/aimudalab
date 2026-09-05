# Production Board

2台のPCで同じ作品を同時編集しないための小さな進行表。作業開始時に `owner` と `branch`、終了時に `status` と `next action` を更新する。

全体の同期状態と現在作業は `../PROJECT_STATUS.md` を正とする。GitHub同期と作業クレームをpushする前に制作へ入らない。

最終同期確認: 2026-09-06 / PC1 / `main` → `origin/main` 開始同期完了

| episode | owner | branch | status | next action | assets | final | scheduled |
|---|---|---|---|---|---|---|---|
| ai-viral-laser-cleaning-01 | PC1 | main | scheduled | 公開24時間後・72時間後にOperationTeam分析 | `public/movie/`, `public/BGM/`, `public/voice/` | `out/ai-viral-laser-cleaning-01-final-v4.mp4`（ローカル） | 2026-09-02 19:00 JST |
| ai-viral-oobleck-01 | PC2 / Codex | main | scheduled | 公開24時間後・72時間後にOperationTeam分析 | episode専用 `public/movie/`, `public/image/`, `public/BGM/`, `public/voice/` | `out/ai-viral-oobleck-01-final.mp4`（ローカル） | 2026-09-03 19:00 JST |
| ai-viral-nitinol-01 | PC2 / Codex | main | prompt-ready | Flow 2カットとBGMを生成し、VOICEVOX実測尺を取得 | 未生成 | 未レンダー | 未定 |
| motion-comic-format-prototype-01 | PC1 / Codex | main | editing | 青山龍星ナレーション付き約3秒の冒頭試作を制作・QC | `ProductionTeam/output/style-samples/2026-09-06-motion-comic-hook-eiffel-v1.png`（ローカル） | 未レンダー | 非公開試作 |
| `<episode-id>` | `<PC1/PC2>` | `<branch>` | idea | `<次に行う1工程>` | `<素材パス>` | `<完成パス>` | `<日時/未定>` |

## Status

`idea / researched / prompt-ready / assets-ready / editing / rendered / qc-passed / scheduled / published`

## 更新ルール

- 1行は1作品。
- `owner` が空欄の作品だけ着手できる。
- 引き継ぎ時は、曖昧な「続き」ではなく具体的な次工程を書く。
- 完成MP4は `out/` に置き、Gitへは投稿記録とQC結果を残す。
- 投稿操作はユーザーから明示的な許可がある場合だけ行う。
- レンダリング開始後は終了とQCまで監視し、途中状態を完了扱いしない。
