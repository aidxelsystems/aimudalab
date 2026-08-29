import {getYouTubeAccessToken} from "./lib.mjs";

const args = process.argv.slice(2);
const confirmed = args.includes("--confirm-cancel");
const videoId = args.find((value) => !value.startsWith("--"));

if (!videoId || !confirmed) {
  console.error("使い方: node OperationTeam/scripts/cancel-scheduled-video.mjs <videoId> --confirm-cancel");
  process.exit(1);
}

if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
  throw new Error(`不正な動画IDです: ${videoId}`);
}

const token = await getYouTubeAccessToken();
const headers = {Authorization: `Bearer ${token}`};

const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
detailsUrl.search = new URLSearchParams({part: "snippet,status", id: videoId});
const detailsResponse = await fetch(detailsUrl, {headers});
if (!detailsResponse.ok) {
  throw new Error(`動画確認に失敗しました: ${detailsResponse.status} ${await detailsResponse.text()}`);
}

const details = await detailsResponse.json();
const video = details.items?.[0];
if (!video) throw new Error(`対象動画が見つかりません: ${videoId}`);
if (video.status?.privacyStatus !== "private" || !video.status?.publishAt) {
  throw new Error(`予約中の非公開動画ではないため変更しません: ${videoId}`);
}

const updateUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
updateUrl.search = new URLSearchParams({part: "status"});
const updateResponse = await fetch(updateUrl, {
  method: "PUT",
  headers: {...headers, "Content-Type": "application/json; charset=UTF-8"},
  body: JSON.stringify({
    id: videoId,
    status: {
      privacyStatus: "private",
      selfDeclaredMadeForKids: Boolean(video.status?.selfDeclaredMadeForKids),
      containsSyntheticMedia: Boolean(video.status?.containsSyntheticMedia)
    }
  })
});
if (!updateResponse.ok) {
  throw new Error(`予約解除に失敗しました: ${updateResponse.status} ${await updateResponse.text()}`);
}

const updated = await updateResponse.json();
console.log(JSON.stringify({
  canceled: true,
  id: updated.id,
  title: video.snippet?.title,
  privacyStatus: updated.status?.privacyStatus,
  publishAt: updated.status?.publishAt ?? null
}, null, 2));
