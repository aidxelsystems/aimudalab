import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import {Readable} from "node:stream";
import {getYouTubeAccessToken, readJson} from "./lib.mjs";

const args = process.argv.slice(2);
const confirmed = args.includes("--confirm-upload");
const skipDuplicateCheck = args.includes("--skip-duplicate-check");
const configArg = args.find((value) => !value.startsWith("--"));

if (!configArg || !confirmed) {
  console.error("使い方: node OperationTeam/scripts/upload-scheduled-video.mjs <設定.json> --confirm-upload");
  process.exit(1);
}

const accessToken = await getYouTubeAccessToken();

const configPath = path.resolve(configArg);
const config = await readJson(configPath);
const videoPath = path.resolve(path.dirname(configPath), config.videoPath);
const stat = await fsp.stat(videoPath);
if (!stat.isFile()) throw new Error(`動画ファイルではありません: ${videoPath}`);

const publishAt = new Date(config.publishAt);
if (!Number.isFinite(publishAt.getTime()) || publishAt <= new Date()) {
  throw new Error(`publishAt は未来のISO 8601日時にしてください: ${config.publishAt}`);
}

const headers = {Authorization: `Bearer ${accessToken}`};
if (!skipDuplicateCheck) {
  const ownerResponse = await fetch(
    "https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=50",
    {headers}
  );
  if (!ownerResponse.ok) {
    throw new Error(`既存動画確認に失敗しました: ${ownerResponse.status} ${await ownerResponse.text()}`);
  }
  const ownerVideos = await ownerResponse.json();
  const duplicate = (ownerVideos.items || []).find((item) => item.snippet?.title === config.title);
  if (duplicate) {
    throw new Error(`同名動画が既に存在します: ${duplicate.id?.videoId || "video id不明"}`);
  }
}

const metadata = {
  snippet: {
    title: config.title,
    description: config.description,
    tags: config.tags,
    categoryId: config.categoryId || "23",
    defaultLanguage: config.defaultLanguage || "ja"
  },
  status: {
    privacyStatus: "private",
    publishAt: publishAt.toISOString(),
    selfDeclaredMadeForKids: Boolean(config.selfDeclaredMadeForKids),
    containsSyntheticMedia: Boolean(config.containsSyntheticMedia)
  }
};

const startResponse = await fetch(
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
  {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(stat.size),
      "X-Upload-Content-Type": "video/mp4"
    },
    body: JSON.stringify(metadata)
  }
);
if (!startResponse.ok) {
  throw new Error(`アップロード開始に失敗しました: ${startResponse.status} ${await startResponse.text()}`);
}

const uploadUrl = startResponse.headers.get("location");
if (!uploadUrl) throw new Error("再開可能アップロードURLが返されませんでした。");

console.log(`アップロード開始: ${path.basename(videoPath)} (${stat.size} bytes)`);
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Length": String(stat.size),
    "Content-Type": "video/mp4"
  },
  body: Readable.toWeb(fs.createReadStream(videoPath)),
  duplex: "half"
});
if (!uploadResponse.ok) {
  throw new Error(`動画転送に失敗しました: ${uploadResponse.status} ${await uploadResponse.text()}`);
}

const uploaded = await uploadResponse.json();
console.log(JSON.stringify({
  id: uploaded.id,
  title: uploaded.snippet?.title,
  privacyStatus: uploaded.status?.privacyStatus,
  publishAt: uploaded.status?.publishAt,
  containsSyntheticMedia: uploaded.status?.containsSyntheticMedia,
  url: `https://youtu.be/${uploaded.id}`
}, null, 2));
