import path from "node:path";
import {dateStamp, fetchJson, loadEnv, parseIsoDuration, teamRoot, writeJson} from "./lib.mjs";

await loadEnv();
const apiKey = process.env.YOUTUBE_API_KEY;
const handle = process.env.YOUTUBE_CHANNEL_HANDLE || "@AIMudaLab";
const explicitChannelId = process.env.YOUTUBE_CHANNEL_ID;

if (!apiKey) {
  console.error("YOUTUBE_API_KEY が必要です。OperationTeam/.env.example を参照してください。");
  process.exit(1);
}

const api = "https://www.googleapis.com/youtube/v3";
const withKey = (url) => `${url}${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(apiKey)}`;

async function resolveChannel() {
  const query = explicitChannelId
    ? `part=snippet,statistics,contentDetails&id=${encodeURIComponent(explicitChannelId)}`
    : `part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(handle)}`;
  const result = await fetchJson(withKey(`${api}/channels?${query}`));
  if (!result.items?.length) throw new Error(`チャンネルを解決できませんでした: ${explicitChannelId || handle}`);
  return result.items[0];
}

async function listUploadIds(playlistId) {
  const ids = [];
  let pageToken = "";
  do {
    const query = new URLSearchParams({
      part: "contentDetails",
      playlistId,
      maxResults: "50"
    });
    if (pageToken) query.set("pageToken", pageToken);
    const result = await fetchJson(withKey(`${api}/playlistItems?${query}`));
    ids.push(...(result.items || []).map((item) => item.contentDetails.videoId));
    pageToken = result.nextPageToken || "";
  } while (pageToken);
  return ids;
}

async function listVideos(ids) {
  const videos = [];
  for (let index = 0; index < ids.length; index += 50) {
    const query = new URLSearchParams({
      part: "snippet,statistics,contentDetails,status",
      id: ids.slice(index, index + 50).join(",")
    });
    const result = await fetchJson(withKey(`${api}/videos?${query}`));
    videos.push(...(result.items || []));
  }
  return videos;
}

const channel = await resolveChannel();
const uploadPlaylist = channel.contentDetails.relatedPlaylists.uploads;
const ids = await listUploadIds(uploadPlaylist);
const rawVideos = await listVideos(ids);

const snapshot = {
  source: "youtube-data-api",
  collectedAt: new Date().toISOString(),
  channel: {
    id: channel.id,
    title: channel.snippet.title,
    handle,
    subscriberCount: Number(channel.statistics.subscriberCount || 0),
    hiddenSubscriberCount: Boolean(channel.statistics.hiddenSubscriberCount),
    viewCount: Number(channel.statistics.viewCount || 0),
    videoCount: Number(channel.statistics.videoCount || 0)
  },
  videos: rawVideos.map((video) => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    durationSeconds: parseIsoDuration(video.contentDetails.duration),
    privacyStatus: video.status.privacyStatus,
    viewCount: Number(video.statistics.viewCount || 0),
    likeCount: video.statistics.likeCount == null ? null : Number(video.statistics.likeCount),
    commentCount: video.statistics.commentCount == null ? null : Number(video.statistics.commentCount)
  }))
};

const output = path.join(teamRoot, "data", "snapshots", `${dateStamp()}-public.json`);
await writeJson(output, snapshot);
console.log(`公開データを保存しました: ${output}`);
