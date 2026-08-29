import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "ProductionTeam", "assets-manifest.json");
const mediaExtensions = new Set([
  ".mp4", ".mov", ".webm", ".mp3", ".wav",
  ".png", ".jpg", ".jpeg", ".gif", ".psd", ".aep"
]);
const ignoredDirectories = new Set([".git", "node_modules", "out", "tmp"]);

async function collect(directory) {
  const entries = await fs.readdir(directory, {withFileTypes: true}).catch(() => []);
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collect(absolutePath));
      continue;
    }
    if (!entry.isFile() || !mediaExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    const contents = await fs.readFile(absolutePath);
    files.push({
      path: path.relative(root, absolutePath).replaceAll("\\", "/"),
      bytes: contents.byteLength,
      sha256: crypto.createHash("sha256").update(contents).digest("hex")
    });
  }

  return files;
}

const assets = (await collect(root)).sort((a, b) => a.path.localeCompare(b.path, "ja"));
const manifest = {
  schemaVersion: 1,
  storage: "google-drive",
  assetCount: assets.length,
  totalBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
  assets
};

await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${assets.length} assets to ${path.relative(root, outputPath)}`);
