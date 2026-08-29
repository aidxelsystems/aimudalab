import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const teamRoot = path.resolve(currentDir, "..");

export async function loadEnv(filePath = path.join(teamRoot, ".env")) {
  const contents = await fs.readFile(filePath, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;

    const name = line.slice(0, separator).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) || process.env[name]) continue;

    let value = line.slice(separator + 1).trim();
    const quoted = (value.startsWith("\"") && value.endsWith("\""))
      || (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    process.env[name] = value;
  }
}

export async function getYouTubeAccessToken() {
  await loadEnv();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });
    if (!response.ok) {
      if (process.env.YOUTUBE_ACCESS_TOKEN) return process.env.YOUTUBE_ACCESS_TOKEN;
      throw new Error(`YouTubeアクセストークン更新失敗: ${response.status}`);
    }
    const payload = await response.json();
    if (!payload.access_token) throw new Error("更新応答にaccess_tokenがありません。");
    return payload.access_token;
  }

  if (process.env.YOUTUBE_ACCESS_TOKEN) return process.env.YOUTUBE_ACCESS_TOKEN;
  throw new Error("YouTube OAuth設定がありません。");
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, value, "utf8");
}

export function dateStamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function parseIsoDuration(value = "PT0S") {
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

export async function latestJson(directory, prefix = "", includes = "") {
  const entries = await fs.readdir(directory, {withFileTypes: true}).catch(() => []);
  const names = entries
    .filter((entry) =>
      entry.isFile()
      && entry.name.startsWith(prefix)
      && entry.name.includes(includes)
      && entry.name.endsWith(".json")
    )
    .map((entry) => entry.name)
    .sort()
    .reverse();
  return names[0] ? path.join(directory, names[0]) : null;
}
