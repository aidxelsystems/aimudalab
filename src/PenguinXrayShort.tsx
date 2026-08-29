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
export const PENGUIN_XRAY_FPS = 30;
export const PENGUIN_XRAY_WIDTH = 1080;
export const PENGUIN_XRAY_HEIGHT = 1920;
export const PENGUIN_XRAY_PLAYBACK_RATE = 1.2;
const imageRoot = "knowledge/ai-xray-penguin-01";

const framesForAudio = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / PENGUIN_XRAY_PLAYBACK_RATE) * PENGUIN_XRAY_FPS));

export const getPenguinXrayTimeline = (episode: Episode) => {
  const hookFrames = framesForAudio(episode.odaiDuration, 4.4);
  const answerFrames = episode.answers.map((answer) => framesForAudio(answer.duration, 3));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  answerFrames.forEach((duration) => {
    answerStarts.push(cursor);
    cursor += duration;
  });
  const outroFrames = framesForAudio(episode.outroDuration, 6.7);
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const FullImage: React.FC<{src: string; zoom?: number; dim?: number; position?: string}> = ({src, zoom = 1.035, dim = .08, position = "50% 50%"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + .055], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#020b20"}}>
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${scale})`}}/>
    <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(0,5,24,.34) 0%,rgba(0,0,0,0) 52%,rgba(0,0,0,${dim}) 100%)`}}/>
  </AbsoluteFill>;
};

const PopCard: React.FC<{children: React.ReactNode; accent?: string; top?: number; dark?: boolean}> = ({children, accent = "#43e7ff", top = 70, dark = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 205, mass: .6}});
  return <div style={{position: "absolute", top, left: 46, right: 46, transform: `translateY(${interpolate(enter, [0, 1], [-110, 0])}px) scale(${interpolate(enter, [0, 1], [.94, 1])})`, padding: "25px 28px 31px", background: dark ? "rgba(3,17,43,.95)" : "rgba(255,252,225,.98)", border: "10px solid #101010", borderRadius: 28, boxShadow: `0 17px 0 #101010,inset 0 0 0 5px ${accent},0 34px 70px #000a`, color: dark ? "#fff" : "#111", textAlign: "center"}}>{children}</div>;
};

const AiBadge: React.FC = () => <div style={{position: "absolute", right: 42, bottom: 86, padding: "9px 18px 12px", borderRadius: 16, background: "rgba(0,0,0,.82)", border: "4px solid #fff", color: "#fff", fontSize: 30, lineHeight: 1, fontWeight: 900}}>AIイメージ</div>;

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bang = spring({frame, fps, config: {damping: 6, stiffness: 250, mass: .55}});
  return <AbsoluteFill>
    <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.045} position="50% 52%"/>
    <div style={{position: "absolute", top: 55, left: 42, right: 42, textAlign: "center", transform: `scale(${interpolate(bang, [0, 1], [1.25, 1])}) rotate(${interpolate(bang, [0, 1], [-2.5, 0])}deg)`}}>
      <div style={{display: "inline-block", padding: "9px 29px 12px", background: "#101010", border: "6px solid #fff", color: "#fff", fontSize: 50, lineHeight: 1, fontWeight: 900, boxShadow: "0 10px 0 #101010"}}>AI透視図鑑</div>
      <div style={{marginTop: 18, padding: "23px 20px 30px", background: "rgba(255,252,225,.98)", border: "10px solid #101010", boxShadow: "0 18px 0 #101010,0 36px 70px #000b"}}>
        <div style={{fontSize: 78, lineHeight: 1, fontWeight: 900}}>ペンギンの足</div>
        <div style={{marginTop: 12, color: "#ff2d56", fontSize: 137, lineHeight: .9, fontWeight: 900, WebkitTextStroke: "5px #101010", paintOrder: "stroke fill", textShadow: "0 10px 0 #101010"}}>実は長い!?</div>
      </div>
      <div style={{display: "inline-block", marginTop: 23, padding: "11px 28px 15px", background: "#ff2d56", border: "8px solid #101010", color: "#fff", fontSize: 52, lineHeight: 1, fontWeight: 900, boxShadow: "0 12px 0 #101010", textShadow: "0 4px 0 #7b001a"}}>体の中に隠れています</div>
    </div>
  </AbsoluteFill>;
};

const VisiblePart: React.FC = () => <AbsoluteFill>
  <FullImage src={`${imageRoot}/visible-feet.png`} zoom={1.045} position="50% 50%"/>
  <PopCard accent="#ffd52d"><div style={{fontSize: 65, lineHeight: 1.05, fontWeight: 900}}>見えているのは</div><div style={{marginTop: 10, color: "#ff2d56", fontSize: 96, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>足の一部だけ</div></PopCard>
  <div style={{position: "absolute", left: 225, top: 1170, width: 630, height: 190, border: "15px solid #ffd52d", borderRadius: "50%", boxShadow: "0 0 0 8px #111,0 0 45px #ffd52d"}}/>
  <div style={{position: "absolute", left: 175, top: 1075, color: "#ffd52d", fontSize: 110, fontWeight: 900, WebkitTextStroke: "7px #111", paintOrder: "stroke fill", transform: "rotate(20deg)"}}>↓</div>
</AbsoluteFill>;

const Anatomy: React.FC = () => <AbsoluteFill>
  <FullImage src={`${imageRoot}/anatomy-cutaway.png`} zoom={1.04} position="50% 52%"/>
  <PopCard accent="#ff8a2a" dark><div style={{fontSize: 52, lineHeight: 1, fontWeight: 900}}>長い脚の骨と<span style={{color: "#ffd52d"}}>膝</span>が</div><div style={{marginTop: 13, color: "#43e7ff", fontSize: 76, lineHeight: 1, fontWeight: 900}}>胴体の中に隠れている</div></PopCard>
  <div style={{position: "absolute", left: 85, top: 1230, display: "flex", alignItems: "center", gap: 12, color: "#ffd52d", fontSize: 55, fontWeight: 900, WebkitTextStroke: "5px #111", paintOrder: "stroke fill"}}><span>膝</span><span style={{fontSize: 105}}>→</span></div>
  <AiBadge/>
</AbsoluteFill>;

const Swimming: React.FC = () => <AbsoluteFill>
  <FullImage src={`${imageRoot}/swimming.png`} zoom={1.045} position="50% 52%"/>
  <PopCard accent="#43e7ff" dark><div style={{fontSize: 60, lineHeight: 1.04, fontWeight: 900}}>体の出っ張りを減らし</div><div style={{marginTop: 13, color: "#43e7ff", fontSize: 83, lineHeight: 1, fontWeight: 900}}>水の抵抗を小さく</div><div style={{marginTop: 13, color: "#ffd52d", fontSize: 31, fontWeight: 900}}>そう考えられています</div></PopCard>
</AbsoluteFill>;

const Commuters: React.FC = () => <AbsoluteFill>
  <FullImage src={`${imageRoot}/commuters.png`} zoom={1.04} position="50% 50%"/>
  <PopCard accent="#ff2d56"><div style={{fontSize: 55, lineHeight: 1, fontWeight: 900}}>人間がマネすると…</div><div style={{marginTop: 14, color: "#ff2d56", fontSize: 86, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>駅がペンギン行列</div></PopCard>
  <AiBadge/>
</AbsoluteFill>;

const Outro: React.FC = () => <AbsoluteFill>
  <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.065} dim={.2} position="50% 52%"/>
  <div style={{position: "absolute", top: 58, left: 44, right: 44, padding: "22px 24px 29px", background: "rgba(255,252,225,.98)", border: "10px solid #111", boxShadow: "0 18px 0 #111,0 35px 70px #000b", textAlign: "center"}}>
    <div style={{fontSize: 60, lineHeight: 1, fontWeight: 900}}>短足じゃない</div>
    <div style={{marginTop: 9, color: "#ff2d56", fontSize: 98, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "3px #111", paintOrder: "stroke fill"}}>隠し足だった</div>
    <div style={{marginTop: 22, paddingTop: 18, borderTop: "6px dashed #111", fontSize: 40, lineHeight: 1.08, fontWeight: 900}}>面白かったら</div>
    <div style={{marginTop: 7, color: "#ff2d56", fontSize: 51, lineHeight: 1.06, fontWeight: 900}}>チャンネル登録もよろしく!</div>
  </div>
</AbsoluteFill>;

const SceneAudio: React.FC<{path?: string; effect: string; volume?: number}> = ({path, effect, volume = .4}) => <>{path ? <Audio src={staticFile(path)} playbackRate={PENGUIN_XRAY_PLAYBACK_RATE}/> : null}<Audio src={staticFile(effect)} volume={volume}/></>;

export const PenguinXrayShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getPenguinXrayTimeline(episode);
  const scenes = [<VisiblePart key="visible"/>, <Anatomy key="anatomy"/>, <Swimming key="swimming"/>, <Commuters key="commuters"/>];
  const effects = [effectPath.pop, effectPath.don, effectPath.shine, effectPath.tsukkomi];
  const volumes = [.34, .52, .38, .45];
  return <AbsoluteFill style={{backgroundColor: "#020b20", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
    <Audio src={staticFile(episode.bgm ?? "BGM/Oogiri Parade2.mp3")} loop volume={(frame) => .07 * Math.min(1, frame / 24, (timeline.totalFrames - frame) / 35)}/>
    <Sequence from={0} durationInFrames={timeline.hookFrames}><Hook/><SceneAudio path={episode.odaiAudioFile} effect={effectPath.titleHeavy} volume={.62}/></Sequence>
    {episode.answers.map((answer, index) => <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>{scenes[index]}<SceneAudio path={answer.audioFile} effect={effects[index]} volume={volumes[index]}/></Sequence>)}
    <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}><Outro/><SceneAudio path={episode.outroAudioFile} effect={effectPath.shine} volume={.42}/></Sequence>
  </AbsoluteFill>;
};
