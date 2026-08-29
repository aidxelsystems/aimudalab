import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {effectPath} from "./lib/effects";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});
export const OTTER_FPS = 30;
export const OTTER_WIDTH = 1080;
export const OTTER_HEIGHT = 1920;
export const OTTER_PLAYBACK_RATE = 1.2;
const imageRoot = "knowledge/animal-why-sea-otter-01";

const framesForAudio = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / OTTER_PLAYBACK_RATE) * OTTER_FPS));

export const getOtterTimeline = (episode: Episode) => {
  const hookFrames = framesForAudio(episode.odaiDuration, 5.1);
  const answerFrames = episode.answers.map((answer) => framesForAudio(answer.duration, 3));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  answerFrames.forEach((duration) => {
    answerStarts.push(cursor);
    cursor += duration;
  });
  const outroFrames = framesForAudio(episode.outroDuration, 5);
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const FullImage: React.FC<{src: string; zoom?: number; dim?: number; position?: string}> = ({
  src,
  zoom = 1.035,
  dim = 0.1,
  position = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.055], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#04182a"}}>
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${scale})`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(0,12,30,.42) 0%,rgba(0,0,0,.01) 44%,rgba(0,0,0,${dim}) 100%)`}} />
    </AbsoluteFill>
  );
};

const TopCard: React.FC<{children: React.ReactNode; accent?: string; top?: number; dark?: boolean}> = ({children, accent = "#40d8ef", top = 68, dark = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 9, stiffness: 190}});
  return (
    <div style={{position: "absolute", top, left: 48, right: 48, transform: `translateY(${interpolate(enter, [0, 1], [-100, 0])}px) scale(${interpolate(enter, [0, 1], [.94, 1])})`, padding: "25px 30px 32px", background: dark ? "rgba(4,25,43,.95)" : "rgba(255,250,218,.97)", border: "9px solid #111", borderRadius: 30, boxShadow: `0 15px 0 #111,inset 0 0 0 5px ${accent},0 28px 60px #0009`, color: dark ? "#fff" : "#111", textAlign: "center"}}>{children}</div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 230, mass: .55}});
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.055} dim={.06} />
      <div style={{position: "absolute", top: 58, left: 46, right: 46, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.2, 1])}) rotate(${interpolate(enter, [0, 1], [-2.3, 0])}deg)`}}>
        <div style={{display: "inline-block", padding: "10px 42px 14px", background: "#111", border: "6px solid #fff", color: "#fff", fontSize: 66, lineHeight: 1, fontWeight: 900, textShadow: "0 4px 0 #007a91", boxShadow: "0 11px 0 #111"}}>ラッコ編</div>
        <div style={{marginTop: 18, padding: "23px 25px 29px", background: "rgba(255,250,218,.97)", border: "10px solid #111", boxShadow: "0 17px 0 #111,0 32px 60px #000a"}}>
          <div style={{fontSize: 103, lineHeight: .94, fontWeight: 900}}>この体、<br/><span style={{color: "#ff315d", WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>何のため!?</span></div>
        </div>
        <div style={{display: "inline-block", marginTop: 25, padding: "13px 27px 18px", background: "#ff315d", border: "8px solid #111", color: "#fff", fontSize: 55, lineHeight: 1, fontWeight: 900, textShadow: "0 5px 0 #8b001e", boxShadow: "0 11px 0 #111"}}>まさか…脇に<br/><span style={{color: "#fff36b", fontSize: 88, WebkitTextStroke: "4px #111", paintOrder: "stroke fill", textShadow: "0 7px 0 #111"}}>ポケット!?</span></div>
      </div>
    </AbsoluteFill>
  );
};

const StoneAppears: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/underarm-stone.png`} zoom={1.045} />
    <TopCard accent="#ffcc45"><div style={{fontSize: 67, fontWeight: 900}}>脇から…</div><div style={{marginTop: 8, color: "#ff315d", fontSize: 108, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>石が出てきた!</div></TopCard>
  </AbsoluteFill>
);

const Choice: React.FC<{letter: string; text: string; color: string}> = ({letter, text, color}) => (
  <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 13, padding: "10px 22px 13px", borderRadius: 22, background: "#fffdf0", border: "5px solid #777165"}}>
    <span style={{width: 74, height: 74, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%", background: color, border: "5px solid #111", fontSize: 46, lineHeight: 1, fontWeight: 900}}>{letter}</span>
    <span style={{fontSize: 52, lineHeight: 1, fontWeight: 900}}>{text}</span>
  </div>
);

// A・B・Cは音声中ずっと同時表示し、固定フレームで強調を切り替えない。
const Question: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/underarm-stone.png`} zoom={1.05} dim={.12} />
    <TopCard top={55} accent="#ffd044">
      <div style={{display: "inline-block", padding: "7px 25px 10px", borderRadius: 999, background: "#111", color: "#fff", fontSize: 36, lineHeight: 1, fontWeight: 900}}>ここで問題</div>
      <div style={{marginTop: 13, fontSize: 59, lineHeight: 1.04, fontWeight: 900}}>この“ポケット”に<br/>何を入れる？</div>
      <Choice letter="A" text="空気" color="#ffd044" />
      <Choice letter="B" text="石や餌" color="#42d6eb" />
      <Choice letter="C" text="赤ちゃん" color="#ff7896" />
    </TopCard>
  </AbsoluteFill>
);

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 225, mass: .56}});
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/stone-and-clam.png`} zoom={1.05} />
      <div style={{position: "absolute", top: 100, left: 58, right: 58, transform: `scale(${interpolate(enter, [0, 1], [1.8, 1])})`, padding: "28px 25px 38px", background: "rgba(255,250,218,.98)", border: "10px solid #111", boxShadow: "0 18px 0 #111,0 35px 70px #000a", textAlign: "center"}}>
        <div style={{fontSize: 58, lineHeight: 1, fontWeight: 900}}>正解は</div>
        <div style={{marginTop: 4, color: "#36d6e9", fontSize: 156, lineHeight: .9, fontWeight: 900, WebkitTextStroke: "6px #111", paintOrder: "stroke fill", textShadow: "0 10px 0 #111"}}>B！</div>
        <div style={{marginTop: 15, fontSize: 67, lineHeight: 1, fontWeight: 900}}>石や餌</div>
      </div>
    </AbsoluteFill>
  );
};

const NotBag: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/skin-fold.png`} zoom={1.045} />
    <TopCard accent="#ff7896"><div style={{fontSize: 67, lineHeight: 1.07, fontWeight: 900}}>本物の袋が<br/>あるわけではない</div></TopCard>
  </AbsoluteFill>
);

const SkinFold: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/skin-fold.png`} zoom={1.055} />
    <TopCard accent="#42d6eb"><div style={{fontSize: 60, lineHeight: 1, fontWeight: 900}}>よく伸びる</div><div style={{marginTop: 12, color: "#087f98", fontSize: 88, lineHeight: 1, fontWeight: 900}}>脇の皮膚に</div><div style={{marginTop: 12, fontSize: 79, lineHeight: 1, fontWeight: 900}}>挟んで運ぶ</div></TopCard>
  </AbsoluteFill>
);

const Toolbox: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/payoff.png`} zoom={1.045} dim={.06} />
    <TopCard accent="#ffd044"><div style={{fontSize: 61, lineHeight: 1, fontWeight: 900}}>石を持ち歩く</div><div style={{marginTop: 15, color: "#ff315d", fontSize: 91, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>海の道具箱</div></TopCard>
  </AbsoluteFill>
);

const Outro: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/payoff.png`} zoom={1.065} dim={.3} />
    <div style={{position: "absolute", top: 66, left: 50, right: 50, padding: "25px 30px 32px", background: "rgba(255,250,218,.97)", border: "10px solid #111", boxShadow: "0 18px 0 #111,0 35px 75px #000b", textAlign: "center"}}>
      <div style={{display: "inline-block", padding: "8px 28px 12px", borderRadius: 999, background: "#087f98", border: "5px solid #111", color: "#fff", fontSize: 39, fontWeight: 900}}>この体、何のため？</div>
      <div style={{marginTop: 16, fontSize: 65, lineHeight: 1.06, fontWeight: 900}}>ラッコの脇は<br/><span style={{color: "#ff315d"}}>海の道具箱</span></div>
      <div style={{marginTop: 22, paddingTop: 18, borderTop: "5px dashed #111", color: "#ff315d", fontSize: 54, lineHeight: 1.06, fontWeight: 900}}>チャンネル登録も<br/>よろしく！</div>
    </div>
  </AbsoluteFill>
);

const SceneAudio: React.FC<{path?: string; effect: string; volume?: number}> = ({path, effect, volume = .4}) => <>{path ? <Audio src={staticFile(path)} playbackRate={OTTER_PLAYBACK_RATE} /> : null}<Audio src={staticFile(effect)} volume={volume} /></>;

export const SeaOtterWhyShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getOtterTimeline(episode);
  const scenes = [<StoneAppears key="stone"/>, <Question key="question"/>, <Reveal key="reveal"/>, <NotBag key="notbag"/>, <SkinFold key="skin"/>, <Toolbox key="toolbox"/>];
  const effects = [effectPath.pop, effectPath.pop, effectPath.correct, effectPath.pop, effectPath.shine, effectPath.shine];
  const volumes = [.34, .3, .62, .34, .4, .42];
  return (
    <AbsoluteFill style={{backgroundColor: "#04182a", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Audio src={staticFile(episode.bgm ?? "BGM/If I Had a Chicken - Kevin MacLeod.mp3")} loop volume={(frame) => .075 * Math.min(1, frame / 24, (timeline.totalFrames - frame) / 35)} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}><Hook/><SceneAudio path={episode.odaiAudioFile} effect={effectPath.titleHeavy} volume={.58}/></Sequence>
      {episode.answers.map((answer, index) => <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>{scenes[index]}<SceneAudio path={answer.audioFile} effect={effects[index]} volume={volumes[index]}/></Sequence>)}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}><Outro/><SceneAudio path={episode.outroAudioFile} effect={effectPath.shine} volume={.42}/></Sequence>
    </AbsoluteFill>
  );
};
