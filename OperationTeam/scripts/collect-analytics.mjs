import path from "node:path";
import {dateStamp, fetchJson, getYouTubeAccessToken, teamRoot, writeJson} from "./lib.mjs";

const accessToken = await getYouTubeAccessToken();

const end = new Date();
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 28);
const isoDay = (date) => date.toISOString().slice(0, 10);
const base = "https://youtubeanalytics.googleapis.com/v2/reports";
const headers = {Authorization: `Bearer ${accessToken}`};

async function query(params) {
  const search = new URLSearchParams({
    ids: "channel==MINE",
    startDate: isoDay(start),
    endDate: isoDay(end),
    ...params
  });
  return fetchJson(`${base}?${search}`, {headers});
}

async function safeQuery(name, params) {
  try {
    return {name, ok: true, data: await query(params)};
  } catch (error) {
    return {
      name,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

const results = await Promise.all([
  safeQuery("daily", {
    dimensions: "day",
    metrics: "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained,subscribersLost",
    sort: "day"
  }),
  safeQuery("byVideo", {
    dimensions: "video",
    metrics: "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained,subscribersLost",
    sort: "-views",
    maxResults: "200"
  }),
  safeQuery("traffic", {
    dimensions: "insightTrafficSourceType",
    metrics: "views,estimatedMinutesWatched",
    sort: "-views"
  }),
  safeQuery("device", {
    dimensions: "deviceType",
    metrics: "views,estimatedMinutesWatched",
    sort: "-views"
  }),
  safeQuery("subscribed", {
    dimensions: "subscribedStatus",
    metrics: "views,estimatedMinutesWatched,averageViewDuration",
    sort: "-views"
  })
]);

const successful = Object.fromEntries(
  results.filter((result) => result.ok).map((result) => [result.name, result.data])
);
const warnings = results
  .filter((result) => !result.ok)
  .map((result) => ({report: result.name, error: result.error}));

if (!successful.daily || !successful.byVideo) {
  console.error("必須Analyticsレポートを取得できませんでした。");
  for (const warning of warnings) console.error(`- ${warning.report}: ${warning.error}`);
  process.exit(1);
}

const snapshot = {
  source: "youtube-analytics-api",
  collectedAt: new Date().toISOString(),
  period: {startDate: isoDay(start), endDate: isoDay(end)},
  warnings,
  reports: successful
};

const output = path.join(teamRoot, "data", "snapshots", `${dateStamp()}-analytics.json`);
await writeJson(output, snapshot);
console.log(`Analyticsデータを保存しました: ${output}`);
for (const warning of warnings) {
  console.warn(`警告: ${warning.report} レポートは取得できませんでした。`);
}
