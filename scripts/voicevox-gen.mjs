// VOICEVOX で エピソードの音声を生成する。
// 使い方: node scripts/voicevox-gen.mjs data/episodes/ep001.json [speakerId]
// 出力: public/voice/<id>/{odai,a1,a2,...,outro}.wav
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const HOST = process.env.VOICEVOX_HOST ?? "http://127.0.0.1:50021";
const jsonPath = process.argv[2] ?? "data/episodes/ep001.json";
const speaker = Number(process.argv[3] ?? process.env.VOICEVOX_SPEAKER ?? 3); // 3 = ずんだもん(ノーマル)

const root = resolve(process.cwd());
const ep = JSON.parse(readFileSync(resolve(root, jsonPath), "utf-8"));

// テロップ → 読み上げテキスト
const toSpeech = (s) =>
  s
    .replace(/[「」『』（）()"'"'｢｣]/g, "")
    .replace(/[♪♬★☆…]/g, (m) => (m === "…" ? "" : ""))
    .replace(/[\n\r　]+/g, "、")
    .replace(/、{2,}/g, "、")
    .replace(/^、|、$/g, "")
    .trim();

const outDir = resolve(root, "public", "voice", ep.id);
mkdirSync(outDir, { recursive: true });

async function synth(text, outName, voice = {}) {
  const speech = toSpeech(text);
  if (!speech) {
    console.log(`  skip (empty): ${outName}`);
    return;
  }
  const sceneSpeaker = Number(voice.speakerId ?? speaker);
  const q = await fetch(
    `${HOST}/audio_query?speaker=${sceneSpeaker}&text=${encodeURIComponent(speech)}`,
    { method: "POST" }
  );
  if (!q.ok) throw new Error(`audio_query failed (${q.status}) for ${outName}`);
  const query = await q.json();
  // 少しテンポよく
  query.speedScale = Number(voice.speedScale ?? 1.22);
  if (voice.pitchScale !== undefined) query.pitchScale = Number(voice.pitchScale);
  if (voice.intonationScale !== undefined) query.intonationScale = Number(voice.intonationScale);
  query.prePhonemeLength = 0.03;
  query.postPhonemeLength = 0.05;

  const s = await fetch(`${HOST}/synthesis?speaker=${sceneSpeaker}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  if (!s.ok) throw new Error(`synthesis failed (${s.status}) for ${outName}`);
  const buf = Buffer.from(await s.arrayBuffer());
  const outPath = resolve(outDir, outName);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buf);
  console.log(`  ✓ ${outName}  «${speech}»`);
}

(async () => {
  console.log(`VOICEVOX speaker=${speaker} -> ${outDir}`);
  if (ep.odai) await synth(ep.odai_reading ?? ep.odai, "odai.wav", {
    speakerId: ep.odaiSpeakerId,
    speedScale: ep.odaiVoiceSpeed,
    pitchScale: ep.odaiVoicePitch,
    intonationScale: ep.odaiVoiceIntonation,
  });
  for (const a of ep.answers) {
    await synth(a.reading ?? a.text, `${a.id}.wav`, {
      speakerId: a.speakerId,
      speedScale: a.voiceSpeed,
      pitchScale: a.voicePitch,
      intonationScale: a.voiceIntonation,
    });
  }
  if (ep.outro) await synth(ep.outro_reading ?? ep.outro, "outro.wav", {
    speakerId: ep.outroSpeakerId,
    speedScale: ep.outroVoiceSpeed,
    pitchScale: ep.outroVoicePitch,
    intonationScale: ep.outroVoiceIntonation,
  });
  console.log("done.");
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
