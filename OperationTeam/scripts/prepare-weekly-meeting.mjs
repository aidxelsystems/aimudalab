import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const operationRoot = path.resolve(scriptsDir, "..");
const projectRoot = path.resolve(operationRoot, "..");
const offline = process.argv.includes("--offline");

const dateStamp = (date = new Date()) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(date);

function runNode(scriptName) {
  const result = spawnSync(process.execPath, [path.join(scriptsDir, scriptName)], {
    cwd: projectRoot,
    encoding: "utf8"
  });
  return {
    script: scriptName,
    ok: result.status === 0,
    status: result.status,
    stdout: (result.stdout || "").trim().slice(-1000),
    stderr: (result.stderr || "").trim().slice(-1000)
  };
}

async function filesUnder(relativeDir, matcher = () => true) {
  const absoluteDir = path.join(projectRoot, relativeDir);
  const entries = await fs.readdir(absoluteDir, {withFileTypes: true}).catch(() => []);
  const records = [];
  for (const entry of entries) {
    if (!entry.isFile() || !matcher(entry.name)) continue;
    const absolutePath = path.join(absoluteDir, entry.name);
    const stat = await fs.stat(absolutePath);
    records.push({
      path: path.relative(projectRoot, absolutePath).replaceAll("\\", "/"),
      modifiedAt: stat.mtime.toISOString()
    });
  }
  return records.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

async function latest(relativeDir, matcher) {
  return (await filesUnder(relativeDir, matcher))[0] || null;
}

async function recent(relativeDir, matcher, limit = 3) {
  return (await filesUnder(relativeDir, matcher)).slice(0, limit);
}

async function scheduledUploads() {
  const uploadDir = path.join(operationRoot, "uploads");
  const entries = await fs.readdir(uploadDir, {withFileTypes: true}).catch(() => []);
  const rows = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const absolutePath = path.join(uploadDir, entry.name);
    try {
      const value = JSON.parse(await fs.readFile(absolutePath, "utf8"));
      const publishAt = value.publishAt || value.schedule?.publishAt || value.status?.publishAt || null;
      if (!publishAt) continue;
      rows.push({
        path: path.relative(projectRoot, absolutePath).replaceAll("\\", "/"),
        title: value.title || value.snippet?.title || null,
        publishAt,
        uploadStatus: value.uploadStatus || null,
        youtubeVideoId: value.youtubeVideoId || null
      });
    } catch {
      rows.push({
        path: path.relative(projectRoot, absolutePath).replaceAll("\\", "/"),
        parseError: true
      });
    }
  }
  return rows.sort((a, b) => String(a.publishAt).localeCompare(String(b.publishAt)));
}

const refresh = [];
if (!offline) {
  refresh.push(runNode("collect-public.mjs"));
  refresh.push(runNode("collect-analytics.mjs"));
}
refresh.push(runNode("generate-weekly-report.mjs"));

const manifest = {
  meetingDate: dateStamp(),
  preparedAt: new Date().toISOString(),
  timezone: "Asia/Tokyo",
  mode: offline ? "offline-saved-data" : "refresh-then-saved-data-fallback",
  refresh,
  sources: {
    channelVision: "CHANNEL_VISION.md",
    operationContract: "OperationTeam/AGENTS.md",
    planningContract: "PlanningTeam/AGENTS.md",
    productionContract: "ProductionTeam/AGENTS.md",
    businessContract: "BusinessTeam/AGENTS.md",
    latestPublicSnapshot: await latest("OperationTeam/data/snapshots", (name) => name.endsWith("-public.json")),
    latestAnalyticsSnapshot: await latest("OperationTeam/data/snapshots", (name) => name.endsWith("-analytics.json")),
    latestWeeklyReport: await latest("OperationTeam/reports", (name) => name.endsWith("-weekly.md")),
    recentOperationReports: await recent("OperationTeam/reports", (name) => name.endsWith(".md"), 5),
    recentPlanningOutputs: await recent("PlanningTeam/output", (name) => name.endsWith(".md"), 5),
    recentPlanningHandoffs: await recent("PlanningTeam/handoffs", (name) => name.endsWith(".md"), 5),
    recentProductionOutputs: await recent("ProductionTeam/output", (name) => name.endsWith(".md"), 5),
    recentBusinessReports: await recent("BusinessTeam/reports", (name) => name.endsWith(".md"), 3),
    scheduledUploads: await scheduledUploads()
  }
};

const outputDir = path.join(operationRoot, "meetings", "inputs");
await fs.mkdir(outputDir, {recursive: true});
const output = path.join(outputDir, `${manifest.meetingDate}-channel-council-inputs.json`);
await fs.writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`定例会入力を保存しました: ${output}`);
for (const step of refresh) {
  if (!step.ok) console.warn(`警告: ${step.script} が失敗したため保存済みデータを使用します。`);
}

