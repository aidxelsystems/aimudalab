import path from "node:path";
import {getYouTubeAccessToken, readJson} from "./lib.mjs";

const args = process.argv.slice(2);
const confirmed = args.includes("--confirm-update");
const positional = args.filter((value) => !value.startsWith("--"));
const [videoId, configArg] = positional;

if (!videoId || !configArg || !confirmed) {
  console.error(
    "使い方: node OperationTeam/scripts/update-video-metadata.mjs <videoId> <設定.json> --confirm-update"
  );
  process.exit(1);
}

if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
  throw new Error(`不正な動画IDです: ${videoId}`);
}

const config = await readJson(path.resolve(configArg));
const token = await getYouTubeAccessToken();
const headers = {Authorization: `Bearer ${token}`};

const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
detailsUrl.search = new URLSearchParams({part: "snippet", id: videoId});
const detailsResponse = await fetch(detailsUrl, {headers});
if (!detailsResponse.ok) {
  throw new Error(`動画確認に失敗しました: ${detailsResponse.status} ${await detailsResponse.text()}`);
}

const current = (await detailsResponse.json()).items?.[0];
if (!current) throw new Error(`対象動画が見つかりません: ${videoId}`);

const updateUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
updateUrl.search = new URLSearchParams({part: "snippet"});
const response = await fetch(updateUrl, {
  method: "PUT",
  headers: {...headers, "Content-Type": "application/json; charset=UTF-8"},
  body: JSON.stringify({
    id: videoId,
    snippet: {
      ...current.snippet,
      title: config.title,
      description: config.description,
      tags: config.tags,
      categoryId: config.categoryId || current.snippet.categoryId,
      defaultLanguage: config.defaultLanguage || current.snippet.defaultLanguage
    }
  })
});

if (!response.ok) {
  throw new Error(`メタデータ更新に失敗しました: ${response.status} ${await response.text()}`);
}

const updated = await response.json();
console.log(JSON.stringify({
  updated: true,
  id: updated.id,
  title: updated.snippet?.title,
  descriptionLength: updated.snippet?.description?.length ?? 0
}, null, 2));
