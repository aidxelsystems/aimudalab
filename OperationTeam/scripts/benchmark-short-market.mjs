import path from "node:path";
import {
  dateStamp,
  fetchJson,
  loadEnv,
  parseIsoDuration,
  teamRoot,
  writeJson
} from "./lib.mjs";

await loadEnv();

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  console.error("YOUTUBE_API_KEY が必要です。");
  process.exit(1);
}

const days = Number(process.argv.find((arg) => arg.startsWith("--days="))?.split("=")[1] || 90);
const maxPerQuery = Number(process.argv.find((arg) => arg.startsWith("--max="))?.split("=")[1] || 25);
const publishedAfterDate = new Date();
publishedAfterDate.setUTCDate(publishedAfterDate.getUTCDate() - days);

const queries = [
  "雑学 #Shorts",
  "科学 #Shorts",
  "科学実験 #Shorts",
  "宇宙 #Shorts",
  "歴史 #Shorts",
  "AI動画 #Shorts",
  "AIアニメ #Shorts",
  "AI ASMR #Shorts",
  "もしも #Shorts",
  "発明 #Shorts"
];

const api = "https://www.googleapis.com/youtube/v3";
const withKey = (url) => `${url}${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(apiKey)}`;
const foundById = new Map();
const warnings = [];

for (const queryText of queries) {
  const search = new URLSearchParams({
    part: "snippet",
    q: queryText,
    type: "video",
    order: "viewCount",
    publishedAfter: publishedAfterDate.toISOString(),
    videoDuration: "short",
    regionCode: "JP",
    relevanceLanguage: "ja",
    maxResults: String(Math.min(50, Math.max(1, maxPerQuery)))
  });

  try {
    const result = await fetchJson(withKey(`${api}/search?${search}`));
    for (const item of result.items || []) {
      const id = item.id?.videoId;
      if (!id) continue;
      const current = foundById.get(id) || {id, matchedQueries: []};
      if (!current.matchedQueries.includes(queryText)) current.matchedQueries.push(queryText);
      foundById.set(id, current);
    }
  } catch (error) {
    warnings.push({query: queryText, error: error instanceof Error ? error.message : String(error)});
  }
}

const ids = [...foundById.keys()];
const videos = [];
for (let index = 0; index < ids.length; index += 50) {
  const query = new URLSearchParams({
    part: "snippet,statistics,contentDetails,status",
    id: ids.slice(index, index + 50).join(",")
  });
  const result = await fetchJson(withKey(`${api}/videos?${query}`));
  videos.push(...(result.items || []));
}

const channelIds = [...new Set(videos.map((video) => video.snippet.channelId))];
const channels = [];
for (let index = 0; index < channelIds.length; index += 50) {
  const query = new URLSearchParams({
    part: "snippet,statistics",
    id: channelIds.slice(index, index + 50).join(",")
  });
  const result = await fetchJson(withKey(`${api}/channels?${query}`));
  channels.push(...(result.items || []));
}

const channelById = new Map(channels.map((channel) => [channel.id, channel]));
const rows = videos
  .map((video) => {
    const channel = channelById.get(video.snippet.channelId);
    const views = Number(video.statistics.viewCount || 0);
    const subscribers = channel?.statistics.hiddenSubscriberCount
      ? null
      : Number(channel?.statistics.subscriberCount || 0);
    const durationSeconds = parseIsoDuration(video.contentDetails.duration);
    return {
      id: video.id,
      url: `https://www.youtube.com/shorts/${video.id}`,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      durationSeconds,
      viewCount: views,
      likeCount: video.statistics.likeCount == null ? null : Number(video.statistics.likeCount),
      commentCount: video.statistics.commentCount == null ? null : Number(video.statistics.commentCount),
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      channelSubscriberCount: subscribers,
      viewSubscriberRatio: subscribers && subscribers > 0
        ? Number((views / subscribers).toFixed(2))
        : null,
      matchedQueries: foundById.get(video.id)?.matchedQueries || []
    };
  })
  .filter((video) => video.durationSeconds != null && video.durationSeconds <= 180)
  .sort((left, right) => right.viewCount - left.viewCount);

const output = {
  source: "youtube-data-api-search-benchmark",
  collectedAt: new Date().toISOString(),
  regionCode: "JP",
  relevanceLanguage: "ja",
  publishedAfter: publishedAfterDate.toISOString(),
  caveats: [
    "検索APIの結果であり、YouTube Shorts全体の無作為標本ではない",
    "videoDuration=shortは4分未満を意味するため、保存時に180秒以下へ絞った",
    "競合のShown in feed、視聴選択率、平均視聴率は取得できない",
    "再生数はチャンネル規模、外部流入、既存ファン、広告等の影響を含む"
  ],
  queries,
  warnings,
  videos: rows
};

const outputPath = path.join(teamRoot, "data", "benchmarks", `${dateStamp()}-short-market.json`);
await writeJson(outputPath, output);
console.log(`市場ベンチマークを保存しました: ${outputPath}`);
console.log(`候補動画数: ${rows.length}`);
