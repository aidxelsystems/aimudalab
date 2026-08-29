import {getYouTubeAccessToken} from "./lib.mjs";

const token = await getYouTubeAccessToken();

const headers = {Authorization: `Bearer ${token}`};
const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
searchUrl.search = new URLSearchParams({
  part: "id,snippet",
  forMine: "true",
  type: "video",
  order: "date",
  maxResults: "50"
});
const searchResponse = await fetch(searchUrl, {headers});
if (!searchResponse.ok) throw new Error(`動画一覧取得失敗: ${searchResponse.status} ${await searchResponse.text()}`);
const search = await searchResponse.json();
const ids = (search.items || []).map((item) => item.id?.videoId).filter(Boolean);
if (ids.length === 0) process.exit(0);

const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
videosUrl.search = new URLSearchParams({part: "snippet,status", id: ids.join(",")});
const videosResponse = await fetch(videosUrl, {headers});
if (!videosResponse.ok) throw new Error(`動画詳細取得失敗: ${videosResponse.status} ${await videosResponse.text()}`);
const videos = await videosResponse.json();

const scheduled = (videos.items || [])
  .filter((video) => video.status?.publishAt)
  .map((video) => ({
    id: video.id,
    title: video.snippet?.title,
    privacyStatus: video.status?.privacyStatus,
    publishAt: video.status?.publishAt
  }))
  .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

console.log(JSON.stringify(scheduled, null, 2));
