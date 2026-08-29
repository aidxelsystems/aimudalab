import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const meetingsDir = path.resolve(scriptsDir, "..", "meetings");
await fs.mkdir(meetingsDir, {recursive: true});

const entries = await fs.readdir(meetingsDir, {withFileTypes: true});
const meetings = entries
  .filter((entry) => entry.isFile() && /^\d{4}-\d{2}-\d{2}-channel-council\.md$/.test(entry.name))
  .map((entry) => entry.name)
  .sort()
  .reverse();

const index = `# 全Team定例会 議事録\n\n${
  meetings.length
    ? meetings.map((name) => `- [${name.slice(0, 10)}](./${name})`).join("\n")
    : "まだ議事録はありません。"
}\n`;
await fs.writeFile(path.join(meetingsDir, "INDEX.md"), index, "utf8");

if (meetings[0]) {
  const latest = await fs.readFile(path.join(meetingsDir, meetings[0]), "utf8");
  await fs.writeFile(path.join(meetingsDir, "LATEST.md"), latest, "utf8");
}

console.log(`議事録一覧を更新しました: ${path.join(meetingsDir, "INDEX.md")}`);

