import path from "node:path";
import {dateStamp, latestJson, readJson, teamRoot, writeText} from "./lib.mjs";

const useSample = process.argv.includes("--sample");
const snapshotDir = path.join(teamRoot, "data", "snapshots");
const publicPath = useSample
  ? path.join(teamRoot, "data", "samples", "sample-snapshot.json")
  : await latestJson(snapshotDir, "", "-public.json");

if (!publicPath) {
  console.error("公開スナップショットがありません。collect-public.mjs を実行するか --sample を指定してください。");
  process.exit(1);
}

const snapshot = await readJson(publicPath);
const videos = (snapshot.videos || [])
  .filter((video) => video.privacyStatus == null || video.privacyStatus === "public")
  .map((video) => ({
    ...video,
    likeRate: video.viewCount > 0 && video.likeCount != null ? video.likeCount / video.viewCount : null,
    commentRate: video.viewCount > 0 && video.commentCount != null ? video.commentCount / video.viewCount : null,
    ageDays: Math.max(0, (Date.now() - new Date(video.publishedAt).getTime()) / 86400000)
  }));

const eligible = videos.filter((video) => video.viewCount >= 20);
const byViews = [...videos].sort((a, b) => b.viewCount - a.viewCount);
const byLikeRate = [...eligible].filter((video) => video.likeRate != null).sort((a, b) => b.likeRate - a.likeRate);
const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
const totalLikes = videos.reduce((sum, video) => sum + (video.likeCount || 0), 0);
const totalComments = videos.reduce((sum, video) => sum + (video.commentCount || 0), 0);
const pct = (value) => value == null ? "取得不可" : `${(value * 100).toFixed(2)}%`;
const topRows = byViews.slice(0, 5).map((video, index) =>
  `${index + 1}. ${video.title} — ${video.viewCount.toLocaleString("ja-JP")}回、高評価率 ${pct(video.likeRate)}、公開後 ${video.ageDays.toFixed(1)}日`
);

const facts = [];
if (byViews[0]) facts.push(`累積再生最多は「${byViews[0].title}」の${byViews[0].viewCount.toLocaleString("ja-JP")}回。`);
if (byLikeRate[0]) facts.push(`20再生以上で高評価率が最も高いのは「${byLikeRate[0].title}」の${pct(byLikeRate[0].likeRate)}。`);
if (videos.length < 10) facts.push("動画数が10本未満のため、傾向は暫定的な兆候として扱う。");

const recommendations = [
  "最多再生動画の題材または冒頭構造を1要素だけ再利用し、別題材で再現性を検証する。",
  "公開後24時間と7日間のスナップショットを残し、累積値ではなく同じ経過時間で比較する。",
  "YouTube Analyticsを接続し、平均視聴時間と登録転換を加えて「再生された動画」と「ファンを増やした動画」を分ける。"
];

const report = `# AIのムダ遣いちゃんねる 週次運用レポート

対象期間: 最新公開スナップショット（収集日時 ${snapshot.collectedAt}）

取得元と欠損: ${snapshot.source}。公開指標を使用。視聴維持率、流入元、登録転換、インプレッションはこのレポートには未接続。

## 要約

公開動画 ${videos.length}本、動画別累積再生 ${totalViews.toLocaleString("ja-JP")}回を確認しました。公開後経過時間が異なるため、現段階の順位は累積値の参考比較です。

## 主要KPI

- チャンネル登録者: ${snapshot.channel?.subscriberCount?.toLocaleString("ja-JP") ?? "取得不可"}
- 公開動画の累積再生: ${totalViews.toLocaleString("ja-JP")}
- 高評価: ${totalLikes.toLocaleString("ja-JP")}（率 ${pct(totalViews ? totalLikes / totalViews : null)}）
- コメント: ${totalComments.toLocaleString("ja-JP")}（率 ${pct(totalViews ? totalComments / totalViews : null)}）

## 動画ランキング

${topRows.length ? topRows.join("\n") : "対象動画なし"}

## 観測された事実

${facts.map((fact) => `- ${fact}`).join("\n")}

## 解釈・仮説

- 上位動画の題材または冒頭の理解速度が再生差に影響した可能性がある。ただし、公開日時と配信面の差を除外できていない。
- 高評価率が高い動画は、再生最大の動画と異なる可能性がある。拡散力と満足度を分けて評価する必要がある。

## 次週の実験

${recommendations.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## 次の企画候補

- 最多再生動画と同じ「日常で誰でも理解できる場所」を使い、ボケ内容だけを変える企画
- 高評価率上位動画の笑いの機構を別のお題へ移植する企画
- 冒頭1秒で異常点が伝わる画像先行企画

## 継続／停止／保留

- 継続: 1動画1テーマの「こんな〇〇は嫌だ」形式
- 停止: なし。現時点では標本不足
- 保留: 投稿時間、最適尺、視聴維持率に関する判断。Analytics接続後に判定

---

このレポートは自動生成された一次診断です。数値の意味づけと次回制作への反映は運用統括エージェントが監査します。
`;

const output = path.join(teamRoot, "reports", `${dateStamp()}-weekly${useSample ? "-sample" : ""}.md`);
await writeText(output, report);
console.log(`週次レポートを作成しました: ${output}`);
