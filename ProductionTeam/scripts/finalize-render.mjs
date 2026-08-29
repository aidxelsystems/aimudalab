import {spawn} from "node:child_process";
import {access, copyFile, mkdir, readFile, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const argv = process.argv.slice(2);
const mode = argv[0];
const contractArg = argv[1];
const validateOnly = mode === "validate";
const confirmRender = mode === "render";

if (!contractArg || (!validateOnly && !confirmRender)) {
  console.error(
    "Usage: npm run validate:handoff -- <contract.json> | npm run finalize:handoff -- <contract.json>",
  );
  process.exit(1);
}

const contractPath = path.resolve(repoRoot, contractArg);
const contractDir = path.dirname(contractPath);

const requireFile = async (filePath, label) => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`${label} が見つかりません: ${path.relative(repoRoot, filePath)}`);
  }
};

const resolveContractPath = (value, label) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} を指定してください。`);
  }
  const absolute = path.resolve(contractDir, value);
  const relative = path.relative(repoRoot, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} はリポジトリ内を指定してください: ${value}`);
  }
  return absolute;
};

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: process.env,
      // Node 22 on Windows fails with `spawn EINVAL` when invoking a .cmd
      // file (e.g. npx.cmd) with shell:false; route those through the shell.
      shell: process.platform === "win32" && /\.cmd$/i.test(command),
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      if (!options.quiet) process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      if (!options.quiet) process.stderr.write(text);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({stdout, stderr});
      else reject(new Error(`${command} が終了コード ${code} で失敗しました。`));
    });
  });

const parseRate = (value) => {
  if (!value || value === "0/0") return 0;
  const [numerator, denominator] = value.split("/").map(Number);
  return denominator ? numerator / denominator : Number(value);
};

const probe = async (filePath) => {
  const {stdout} = await run(
    process.env.FFPROBE_PATH || "ffprobe",
    ["-v", "error", "-show_streams", "-show_format", "-of", "json", filePath],
    {quiet: true},
  );
  return JSON.parse(stdout);
};

const measureLoudness = async (filePath, audio) => {
  const nullTarget = process.platform === "win32" ? "NUL" : "/dev/null";
  const filter = [
    `I=${audio.targetLufs}`,
    `TP=${audio.truePeakDb}`,
    `LRA=${audio.lra}`,
    "print_format=json",
  ].join(":");
  const {stderr} = await run(
    process.env.FFMPEG_PATH || "ffmpeg",
    ["-hide_banner", "-i", filePath, "-af", `loudnorm=${filter}`, "-f", "null", nullTarget],
    {quiet: true},
  );
  const blocks = stderr.match(/\{\s*"input_i"[\s\S]*?\}/g);
  if (!blocks?.length) throw new Error("FFmpegのラウドネス測定値を解析できませんでした。");
  return JSON.parse(blocks.at(-1));
};

const normalizeAudio = async (inputPath, finalPath, audio, measured, bitrate) => {
  const filter = [
    `I=${audio.targetLufs}`,
    `TP=${audio.truePeakDb}`,
    `LRA=${audio.lra}`,
    `measured_I=${measured.input_i}`,
    `measured_TP=${measured.input_tp}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    "linear=true",
    "print_format=summary",
  ].join(":");
  await run(process.env.FFMPEG_PATH || "ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-c:v",
    "copy",
    "-af",
    `loudnorm=${filter}`,
    "-c:a",
    "aac",
    "-b:a",
    bitrate,
    "-ar",
    String(audio.sampleRate),
    "-movflags",
    "+faststart",
    finalPath,
  ]);
};

const assertProbe = (metadata, expected) => {
  const video = metadata.streams.find((stream) => stream.codec_type === "video");
  const audio = metadata.streams.find((stream) => stream.codec_type === "audio");
  if (!video) throw new Error("映像ストリームがありません。");
  if (!audio) throw new Error("音声ストリームがありません。");
  const duration = Number(metadata.format.duration);
  const fps = parseRate(video.avg_frame_rate || video.r_frame_rate);
  const failures = [];
  if (video.width !== expected.width || video.height !== expected.height) {
    failures.push(`解像度 ${video.width}x${video.height}`);
  }
  if (Math.abs(fps - expected.fps) > 0.01) failures.push(`fps ${fps}`);
  if (video.codec_name !== expected.videoCodec) failures.push(`映像 ${video.codec_name}`);
  if (audio.codec_name !== expected.audioCodec) failures.push(`音声 ${audio.codec_name}`);
  if (
    duration < expected.durationSeconds.min ||
    duration > expected.durationSeconds.max
  ) {
    failures.push(`尺 ${duration.toFixed(3)}秒`);
  }
  if (failures.length) throw new Error(`完成仕様と不一致: ${failures.join(", ")}`);
  return {video, audio, duration, fps};
};

const safeName = (value) => value.replace(/[^a-zA-Z0-9_-]+/g, "-");

const main = async () => {
  await requireFile(contractPath, "レンダー契約");
  const contract = JSON.parse(await readFile(contractPath, "utf8"));
  if (contract.schemaVersion !== 1) throw new Error("schemaVersionは1を指定してください。");
  for (const key of ["episodeId", "compositionId", "status"]) {
    if (!contract[key]) throw new Error(`${key} が未指定です。`);
  }
  if (confirmRender && contract.status !== "ready") {
    throw new Error(`実行にはstatusをreadyにしてください。現在: ${contract.status}`);
  }

  const renderOutput = resolveContractPath(contract.output?.render, "output.render");
  const finalOutput = resolveContractPath(contract.output?.final, "output.final");
  const qcDir = resolveContractPath(contract.output?.qcDir, "output.qcDir");
  const qcReport = resolveContractPath(contract.output?.qcReport, "output.qcReport");
  if (renderOutput === finalOutput) {
    throw new Error("一時renderとfinalは別のファイルを指定してください。");
  }
  for (const source of contract.sources || []) {
    await requireFile(resolveContractPath(source, "sources"), "関連ファイル");
  }
  const propsPath = contract.props
    ? resolveContractPath(contract.props, "props")
    : null;
  if (propsPath) await requireFile(propsPath, "props");

  const rootSource = path.join(repoRoot, "src", "Root.tsx");
  const rootText = await readFile(rootSource, "utf8");
  if (!rootText.includes(`id="${contract.compositionId}"`)) {
    throw new Error(`Composition ${contract.compositionId} がsrc/Root.tsxにありません。`);
  }

  const expected = contract.expected;
  if (
    !expected ||
    !Number.isFinite(expected.width) ||
    !Number.isFinite(expected.height) ||
    !Number.isFinite(expected.fps) ||
    !Number.isFinite(expected.durationSeconds?.min) ||
    !Number.isFinite(expected.durationSeconds?.max)
  ) {
    throw new Error("expectedの解像度、fps、想定尺を指定してください。");
  }
  if (!Array.isArray(contract.checkpoints) || contract.checkpoints.length === 0) {
    throw new Error("checkpointsを1件以上指定してください。");
  }

  console.log(`契約検証合格: ${contract.episodeId} / ${contract.compositionId}`);
  if (validateOnly) return;

  const render = {
    crf: contract.render?.crf ?? 16,
    concurrency: contract.render?.concurrency ?? 6,
    audioBitrate: contract.render?.audioBitrate ?? "192k",
  };
  const audio = {
    normalize: contract.audio?.normalize !== false,
    targetLufs: contract.audio?.targetLufs ?? -16,
    truePeakDb: contract.audio?.truePeakDb ?? -1.4,
    lra: contract.audio?.lra ?? 7,
    sampleRate: contract.audio?.sampleRate ?? 48000,
  };

  await mkdir(path.dirname(renderOutput), {recursive: true});
  await mkdir(path.dirname(finalOutput), {recursive: true});
  await mkdir(qcDir, {recursive: true});
  await mkdir(path.dirname(qcReport), {recursive: true});
  await rm(renderOutput, {force: true});

  console.log("\n[1/7] TypeScript検査");
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  await run(npx, ["tsc", "--noEmit"]);

  console.log("\n[2/7] Remotionレンダー");
  const renderArgs = [
    "remotion",
    "render",
    contract.compositionId,
    renderOutput,
    "--codec=h264",
    `--crf=${render.crf}`,
    "--audio-codec=aac",
    `--audio-bitrate=${render.audioBitrate}`,
    `--concurrency=${render.concurrency}`,
  ];
  if (propsPath) renderArgs.push(`--props=${propsPath}`);
  await run(npx, renderArgs);

  console.log("\n[3/7] 一時MP4検査");
  assertProbe(await probe(renderOutput), expected);

  console.log("\n[4/7] 音量仕上げ");
  if (audio.normalize) {
    const firstPass = await measureLoudness(renderOutput, audio);
    await normalizeAudio(renderOutput, finalOutput, audio, firstPass, render.audioBitrate);
  } else {
    await copyFile(renderOutput, finalOutput);
  }

  console.log("\n[5/7] 完成MP4検査");
  const finalMetadata = await probe(finalOutput);
  const checked = assertProbe(finalMetadata, expected);
  const nullTarget = process.platform === "win32" ? "NUL" : "/dev/null";
  await run(process.env.FFMPEG_PATH || "ffmpeg", [
    "-v",
    "error",
    "-i",
    finalOutput,
    "-f",
    "null",
    nullTarget,
  ]);
  const finalLoudness = audio.normalize
    ? await measureLoudness(finalOutput, audio)
    : null;

  console.log("\n[6/7] 代表フレーム抽出");
  const extractedFrames = [];
  for (const [index, checkpoint] of contract.checkpoints.entries()) {
    const time = typeof checkpoint === "number" ? checkpoint : checkpoint.time;
    const label = typeof checkpoint === "number" ? "確認" : checkpoint.label || "確認";
    if (!Number.isFinite(time) || time < 0 || time >= checked.duration) {
      throw new Error(`checkpoint ${index + 1} の時刻が不正です: ${time}`);
    }
    const frameName = `${String(index + 1).padStart(2, "0")}_${time
      .toFixed(2)
      .replace(".", "s")}_${safeName(label)}.jpg`;
    const framePath = path.join(qcDir, frameName);
    await run(
      process.env.FFMPEG_PATH || "ffmpeg",
      ["-y", "-ss", String(time), "-i", finalOutput, "-frames:v", "1", "-q:v", "2", framePath],
      {quiet: true},
    );
    extractedFrames.push({time, label, file: path.relative(repoRoot, framePath)});
  }

  console.log("\n[7/7] QC記録生成");
  const result = {
    schemaVersion: 1,
    episodeId: contract.episodeId,
    compositionId: contract.compositionId,
    completedAt: new Date().toISOString(),
    status: "machine_qc_passed_human_review_required",
    finalOutput: path.relative(repoRoot, finalOutput),
    technical: {
      durationSeconds: Number(checked.duration.toFixed(3)),
      width: checked.video.width,
      height: checked.video.height,
      fps: Number(checked.fps.toFixed(3)),
      videoCodec: checked.video.codec_name,
      audioCodec: checked.audio.codec_name,
      audioSampleRate: Number(checked.audio.sample_rate),
      loudness: finalLoudness,
    },
    checkpoints: extractedFrames,
  };
  const resultPath = contractPath.replace(/\.json$/i, ".result.json");
  await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  const checkpointLines = extractedFrames
    .map((item) => `- ${item.time.toFixed(2)}秒: ${item.label} — \`${item.file}\``)
    .join("\n");
  const loudnessLines = finalLoudness
    ? `- Integrated loudness: ${finalLoudness.input_i} LUFS\n- True peak: ${finalLoudness.input_tp} dBTP\n- LRA: ${finalLoudness.input_lra} LU`
    : "- ラウドネス正規化: 無効";
  const report = `# ${contract.episodeId} 最終レンダーQC\n\n生成日時: ${result.completedAt}\n\n## 機械判定\n\n**合格。人による映像・音声確認が必要。**\n\n## 完成ファイル\n\n- \`${result.finalOutput}\`\n- ${result.technical.durationSeconds}秒\n- ${result.technical.videoCodec} / ${result.technical.width}×${result.technical.height} / ${result.technical.fps}fps\n- ${result.technical.audioCodec} / ${result.technical.audioSampleRate}Hz\n${loudnessLines}\n- TypeScript: 合格\n- 全編デコード: 合格\n\n## 代表フレーム\n\n${checkpointLines}\n\n## 人による最終確認\n\n- [ ] 完成MP4を最初から最後まで視聴した\n- [ ] 冒頭フックが無音でも理解できる\n- [ ] 字幕、数値、出典、CTAに切れや衝突がない\n- [ ] ナレーション、BGM、SE、映像のタイミングが合っている\n- [ ] オチとCTAを読み切れる\n\n## 投稿状態\n\n未投稿。このレンダー契約はYouTube投稿を実行しない。\n`;
  await writeFile(qcReport, report, "utf8");
  console.log(`\n完成: ${path.relative(repoRoot, finalOutput)}`);
  console.log(`QC: ${path.relative(repoRoot, qcReport)}`);
  console.log(`結果: ${path.relative(repoRoot, resultPath)}`);
};

main().catch((error) => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
