// 生成済み音声の実尺を計測し、各 answer.duration を「音声尺+余白」に上書きした
// 解決済みJSON (<path>.resolved.json) を出力する。
// 使い方: node scripts/measure-audio.mjs data/episodes/ep001.json
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const PAD = 0.12; // 余白(秒)
const jsonPath = process.argv[2] ?? "data/episodes/ep001.json";
const root = resolve(process.cwd());
const ep = JSON.parse(readFileSync(resolve(root, jsonPath), "utf-8"));

// WAVヘッダから再生秒数を求める (PCM)
function wavDurationSec(file) {
  const buf = readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  let pos = 12;
  let sampleRate = 0;
  let channels = 0;
  let bitsPerSample = 0;
  let dataBytes = 0;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (id === "fmt ") {
      channels = buf.readUInt16LE(pos + 10);
      sampleRate = buf.readUInt32LE(pos + 12);
      bitsPerSample = buf.readUInt16LE(pos + 22);
    } else if (id === "data") {
      dataBytes = size;
    }
    pos += 8 + size + (size % 2);
  }
  if (!sampleRate || !channels || !bitsPerSample || !dataBytes) return null;
  return dataBytes / (sampleRate * channels * (bitsPerSample / 8));
}

const voiceDir = resolve(root, "public", "voice", ep.id);
const rel = (name) => `voice/${ep.id}/${name}`;

function resolveOne(id, fallback) {
  const wav = resolve(voiceDir, `${id}.wav`);
  if (existsSync(wav)) {
    const sec = wavDurationSec(wav);
    if (sec) {
      return {
        duration: +Math.max(fallback, sec + PAD).toFixed(2),
        audioFile: rel(`${id}.wav`)
      };
    }
  }
  return { duration: fallback };
}

let total = 0;

// お題ナレーション
const odaiWav = resolve(voiceDir, "odai.wav");
if (existsSync(odaiWav)) {
  ep.odaiAudioFile = rel("odai.wav");
  const sec = wavDurationSec(odaiWav);
  if (sec) ep.odaiDuration = +(sec + PAD + 0.18).toFixed(2);
}

for (const a of ep.answers) {
  const r = resolveOne(a.id, a.duration);
  a.duration = r.duration;
  if (r.audioFile) a.audioFile = r.audioFile;
  total += a.duration;
}

const outroWav = resolve(voiceDir, "outro.wav");
if (existsSync(outroWav)) {
  ep.outroAudioFile = rel("outro.wav");
  const sec = wavDurationSec(outroWav);
  if (sec) ep.outroDuration = +(sec + PAD).toFixed(2);
}

const outPath = jsonPath.replace(/\.json$/, ".resolved.json");
// Remotion の --props はコンポーネント入力 props そのもの。{ episode } で包む。
writeFileSync(resolve(root, outPath), JSON.stringify({ episode: ep }, null, 2), "utf-8");
console.log(
  `resolved -> ${outPath}\n  回答合計(余白込み): ${total.toFixed(1)}s / ${ep.answers.length}本`
);
