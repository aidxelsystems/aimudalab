import {getYouTubeAccessToken} from "./lib.mjs";

const args = process.argv.slice(2);
const id = args.find((value) => !value.startsWith("--"));
const publishAtArg = args.filter((value) => !value.startsWith("--"))[1];
if (!id || !publishAtArg || !args.includes("--confirm-reschedule")) {
  console.error("使い方: node OperationTeam/scripts/reschedule-video.mjs <videoId> <publishAt ISO> --confirm-reschedule");
  process.exit(1);
}

const publishAt = new Date(publishAtArg);
if (!Number.isFinite(publishAt.getTime()) || publishAt <= new Date()) {
  throw new Error(`publishAt は未来のISO 8601日時にしてください: ${publishAtArg}`);
}

const token = await getYouTubeAccessToken();
const headers = {Authorization: `Bearer ${token}`};
const currentResponse = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?part=status&id=${encodeURIComponent(id)}`,
  {headers}
);
if (!currentResponse.ok) throw new Error(`動画状態取得失敗: ${currentResponse.status} ${await currentResponse.text()}`);
const current = (await currentResponse.json()).items?.[0];
if (!current) throw new Error(`動画が見つかりません: ${id}`);

const status = {
  ...current.status,
  privacyStatus: "private",
  publishAt: publishAt.toISOString()
};
delete status.uploadStatus;
delete status.failureReason;
delete status.rejectionReason;

const updateResponse = await fetch(
  "https://www.googleapis.com/youtube/v3/videos?part=status",
  {
    method: "PUT",
    headers: {...headers, "Content-Type": "application/json; charset=UTF-8"},
    body: JSON.stringify({id, status})
  }
);
if (!updateResponse.ok) throw new Error(`予約変更失敗: ${updateResponse.status} ${await updateResponse.text()}`);
const updated = await updateResponse.json();
console.log(JSON.stringify({
  id: updated.id,
  privacyStatus: updated.status?.privacyStatus,
  publishAt: updated.status?.publishAt
}, null, 2));
