import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const FERROFLUID_FPS = 30;
export const FERROFLUID_WIDTH = 1080;
export const FERROFLUID_HEIGHT = 1920;
const SOURCE_FPS = 30;

const assets = {
  formation: "movie/ferrofluid-formation-remotion.mp4",
  movement: "movie/ferrofluid-movement-remotion.mp4",
  papell: "image/ferrofluid-stephen-papell-nasa-1963.jpg",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * FERROFLUID_FPS));

export const getFerrofluidTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.4), framesFor(2.4, 2.4));
  const minimums = [2.9, 3.8, 4.5, 4.4, 5.0, 5.4];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.0), framesFor(4.0, 4.0));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
}> = ({src, startSeconds = 0, playbackRate = 1, position = "50% 50%", dark = 0, scaleFrom = 1.01, scaleTo = 1.04}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#05080b"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * SOURCE_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${scale})`,
          filter: `brightness(${1 - dark * 0.46}) contrast(1.13) saturate(.86)`,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(1,5,8,${0.34 + dark * .25}),transparent 43%,rgba(0,3,5,.66))`}} />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 45, left: 38, padding: "12px 21px 15px", border: "4px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#212731,#7b8796)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #080b10,0 14px 30px #0009", textShadow: "0 3px 0 #080b10"}}>
    世界のバズ、AIで再現
  </div>
);

const AiBadge: React.FC = () => (
  <div style={{position: "absolute", top: 49, right: 35, padding: "9px 14px 11px", border: "2px solid #fff9", borderRadius: 8, background: "rgba(0,0,0,.66)", color: "#fff", fontSize: 21, lineHeight: 1, fontWeight: 700, letterSpacing: 1}}>
    AI再現映像
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string; bottom?: number}> = ({children, accent = "#a8b7c6", bottom = 245}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: "50%", bottom, width: 920, boxSizing: "border-box", transform: "translateX(-50%)", padding: "18px 24px 23px", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(3,7,10,.91)", color: "#fff", fontSize: 47, lineHeight: 1.21, fontWeight: 900, textAlign: "center", textShadow: "0 3px 6px #000", boxShadow: "0 13px 35px #0009", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>
      {children}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 6, stiffness: 245, mass: .53}});
  const shake = frame < 13 ? Math.sin(frame * 4.4) * (13 - frame) * .56 : 0;
  const flash = interpolate(frame, [0, 2, 6], [.72, .16, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${-shake * .28}px)`}}>
      <VideoLayer src={assets.formation} startSeconds={5.15} playbackRate={.83} position="50% 47%" />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 51%,transparent 20%,rgba(0,0,0,.53) 86%)"}} />
      <AbsoluteFill style={{background: `rgba(255,255,255,${flash})`}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 190, left: 28, right: 28, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.52, 1])})`}}>
        <div style={{color: "#fff", fontSize: 95, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #05080b", paintOrder: "stroke fill", textShadow: "0 10px 0 #242b34,0 25px 46px #000"}}>この液体</div>
        <div style={{marginTop: 24, color: "#fff36b", fontSize: 155, lineHeight: .9, fontWeight: 900, letterSpacing: -8, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #756500,0 30px 58px #000"}}>トゲが<br />生えた</div>
      </div>
    </AbsoluteFill>
  );
};

const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const rewindOpacity = interpolate(frame, [0, 5, 16, 24], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.formation} startSeconds={0} playbackRate={.9} position="50% 47%" />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 172, left: 45, right: 45, textAlign: "center"}}>
        <div style={{opacity: rewindOpacity, display: "inline-block", padding: "13px 35px 18px", border: "6px solid #fff", borderRadius: 14, background: "#151a20ed", color: "#fff", fontSize: 68, lineHeight: 1, fontWeight: 900, boxShadow: "0 10px 0 #030506"}}>数秒前――</div>
        <div style={{marginTop: 34, color: "#e9eff5", fontSize: 90, lineHeight: 1.03, fontWeight: 900, WebkitTextStroke: "7px #05080b", paintOrder: "stroke fill", textShadow: "0 10px 0 #29323b,0 24px 44px #000"}}>ただの<br />黒い液体</div>
      </div>
      <Caption>見た目は、<br />ただの黒い液体。</Caption>
    </AbsoluteFill>
  );
};

const SpikeImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame: Math.max(0, frame - 30), fps, config: {damping: 6, stiffness: 245, mass: .54}});
  const shake = frame >= 29 && frame < 42 ? Math.sin(frame * 4.8) * (42 - frame) * .5 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${shake * .25}px)`}}>
      <VideoLayer src={assets.formation} startSeconds={1.7} playbackRate={.94} position="50% 47%" />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 170, left: 30, right: 30, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 61, lineHeight: 1, fontWeight: 900}}>磁石を近づけると――</div>
        <div style={{marginTop: 30, color: "#fff36b", fontSize: 126, lineHeight: .94, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #776600,0 28px 50px #000", transform: `scale(${interpolate(hit, [0, 1], [1.58, 1])})`, opacity: interpolate(hit, [0, .12, 1], [0, 1, 1])}}>触れてないのに<br />一斉にトゲトゲ</div>
      </div>
      <Caption accent="#fff15a">触れてないのに、<br />一斉にトゲトゲ。</Caption>
    </AbsoluteFill>
  );
};

const Particle: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const x = 95 + ((index * 137) % 860);
  const y = 670 + ((index * 193) % 620);
  const drift = Math.sin((frame + index * 17) * .075) * 17;
  const size = 19 + (index % 3) * 7;
  return (
    <div style={{position: "absolute", left: x + drift, top: y - drift * .42, width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff2a3,#d48700 48%,#422600)", boxShadow: "0 0 14px #ffc94399", border: "2px solid #fff3"}} />
  );
};

const CompositionFact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 180, mass: .62}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.movement} startSeconds={0} playbackRate={.66} position="50% 47%" dark={.61} scaleFrom={1.05} scaleTo={1.09} />
      <AbsoluteFill style={{background: "rgba(1,5,8,.56)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 158, left: 38, right: 38, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 60, lineHeight: 1, fontWeight: 900}}>正体は</div>
        <div style={{marginTop: 19, display: "inline-block", padding: "16px 45px 24px", border: "7px solid #fff", borderRadius: 20, background: "linear-gradient(135deg,#161d25,#687687)", color: "#fff36b", fontSize: 115, lineHeight: 1, fontWeight: 900, boxShadow: "0 12px 0 #05080c,0 28px 52px #000b", transform: `scale(${interpolate(enter, [0, 1], [1.44, 1])})`}}>磁性流体</div>
        <div style={{marginTop: 27, color: "#edf3f8", fontSize: 57, lineHeight: 1.1, fontWeight: 900}}>液体の中に<br /><span style={{color: "#ffd85c"}}>微小な酸化鉄粒子</span></div>
      </div>
      {Array.from({length: 23}, (_, index) => <Particle key={index} index={index} frame={frame} />)}
      <div style={{position: "absolute", left: 118, right: 118, top: 1268, height: 5, background: "linear-gradient(90deg,transparent,#fff7,transparent)"}} />
      <Caption accent="#ffd85c" bottom={205}>小さな酸化鉄の粒が、<br />液体に分散しています。</Caption>
    </AbsoluteFill>
  );
};

const ForcePill: React.FC<{top: number; left: number; color: string; label: string; detail: string; direction: string; delay: number}> = ({top, left, color, label, detail, direction, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 8, stiffness: 185, mass: .6}});
  return (
    <div style={{position: "absolute", top, left, width: 280, padding: "19px 14px 23px", border: `6px solid ${color}`, borderRadius: 22, background: "rgba(2,7,11,.88)", color: "#fff", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [.55, 1])})`, opacity: enter, boxShadow: `0 0 30px ${color}55`}}>
      <div style={{color, fontSize: 75, lineHeight: .9, fontWeight: 900}}>{direction}</div>
      <div style={{marginTop: 8, fontSize: 47, lineHeight: 1, fontWeight: 900}}>{label}</div>
      <div style={{marginTop: 10, color: "#d7dfe7", fontSize: 27, lineHeight: 1, fontWeight: 700}}>{detail}</div>
    </div>
  );
};

const ForcesFact: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.movement} startSeconds={1.0} playbackRate={.72} position="50% 47%" dark={.38} scaleFrom={1.03} scaleTo={1.07} />
    <AbsoluteFill style={{background: "rgba(0,3,6,.32)"}} />
    <SeriesBadge />
    <AiBadge />
    <div style={{position: "absolute", top: 155, left: 32, right: 32, textAlign: "center"}}>
      <div style={{color: "#fff", fontSize: 57, lineHeight: 1, fontWeight: 900}}>表面が尖る理由</div>
      <div style={{marginTop: 21, color: "#fff36b", fontSize: 103, lineHeight: .95, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #756500,0 24px 45px #000"}}>3つの力の<br />せめぎ合い</div>
    </div>
    <ForcePill top={760} left={80} color="#ffd94f" label="磁力" detail="引き上げる" direction="↑" delay={6} />
    <ForcePill top={760} left={400} color="#82d8ff" label="表面張力" detail="平らに戻す" direction="↔" delay={15} />
    <ForcePill top={760} left={720} color="#ff8b80" label="重力" detail="引き下げる" direction="↓" delay={24} />
    <Caption accent="#fff15a" bottom={205}>磁力・表面張力・重力の<br />バランスで規則的に尖ります。</Caption>
  </AbsoluteFill>
);

const NasaHistory: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 180], [1.03, 1.12], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#070b11"}}>
      <Img src={staticFile(assets.papell)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", transform: `scale(${zoom})`, filter: "contrast(1.09) brightness(.78)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(2,6,13,.63),rgba(1,5,10,.08) 52%,rgba(1,4,8,.83))"}} />
      <SeriesBadge />
      <div style={{position: "absolute", top: 162, left: 38, right: 38, textAlign: "center"}}>
        <div style={{display: "inline-block", padding: "12px 28px 16px", border: "5px solid #fff", borderRadius: 999, background: "#15497a", color: "#fff", fontSize: 48, lineHeight: 1, fontWeight: 900}}>1963年</div>
        <div style={{marginTop: 27, color: "#fff", fontSize: 71, lineHeight: 1.03, fontWeight: 900, WebkitTextStroke: "7px #07101a", paintOrder: "stroke fill", textShadow: "0 11px 0 #173e62,0 25px 45px #000"}}>NASAで誕生</div>
        <div style={{marginTop: 19, color: "#ffe769", fontSize: 90, lineHeight: .98, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #725f00,0 24px 45px #000"}}>目的は<br />ロケット燃料</div>
      </div>
      <div style={{position: "absolute", left: 38, bottom: 155, padding: "9px 14px 12px", borderRadius: 7, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 24, lineHeight: 1.1, fontWeight: 700}}>NASA / Stephen Papell, 1963</div>
      <Caption accent="#ffd95c" bottom={235}>無重力の燃料を、<br />磁力でポンプへ動かす発想。</Caption>
    </AbsoluteFill>
  );
};

const Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const switchAt = 56;
  const rocketOpacity = interpolate(frame, [switchAt - 8, switchAt + 5], [1, .13], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const speakerEnter = spring({frame: Math.max(0, frame - switchAt), fps: FERROFLUID_FPS, config: {damping: 7, stiffness: 190, mass: .58}});
  const pulse = 1 + Math.sin(frame * .34) * .035;
  return (
    <AbsoluteFill style={{background: "linear-gradient(155deg,#06111e 0%,#172535 53%,#806900 53%,#ffd93d 100%)"}}>
      <SeriesBadge />
      <div style={{position: "absolute", top: 164, left: 35, right: 35, textAlign: "center"}}>
        <div style={{opacity: rocketOpacity, color: "#fff", fontSize: 54, lineHeight: 1.05, fontWeight: 900}}>より簡単な方法が見つかり</div>
        <div style={{marginTop: 22, opacity: rocketOpacity, color: "#ff8d82", fontSize: 86, lineHeight: .96, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #6b1610,0 24px 43px #000"}}>ロケット燃料には<br />不採用</div>
      </div>
      <div style={{position: "absolute", left: 106, top: 650, width: 350, height: 440, display: "flex", alignItems: "center", justifyContent: "center", border: "8px solid #fff", borderRadius: 36, background: "rgba(4,18,31,.84)", opacity: rocketOpacity, boxShadow: "0 22px 50px #0009"}}>
        <div style={{fontSize: 210, filter: "grayscale(.2)", transform: "rotate(-15deg)"}}>🚀</div>
        <div style={{position: "absolute", left: 20, right: 20, top: "49%", height: 16, borderRadius: 99, background: "#ff4d45", transform: "rotate(-32deg)", boxShadow: "0 0 20px #ff4d45"}} />
      </div>
      <div style={{position: "absolute", right: 76, top: 625, width: 420, height: 505, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "9px solid #fff", borderRadius: 42, background: "rgba(24,26,24,.9)", transform: `scale(${interpolate(speakerEnter, [0, 1], [.35, pulse])})`, opacity: speakerEnter, boxShadow: "0 24px 0 #574700,0 42px 65px #0009"}}>
        <div style={{width: 205, height: 205, borderRadius: "50%", border: "18px solid #aab2b8", background: "radial-gradient(circle,#15191c 0 26%,#77818a 27% 35%,#0b0d0f 36%)", boxShadow: "0 0 35px #fff4"}} />
        <div style={{marginTop: 35, color: "#fff36b", fontSize: 49, lineHeight: 1, fontWeight: 900}}>現在</div>
        <div style={{marginTop: 14, color: "#fff", fontSize: 59, lineHeight: 1, fontWeight: 900}}>スピーカー等</div>
      </div>
      <Caption accent="#ffe14c" bottom={205}>ロケット燃料には不採用。<br />今はスピーカーなどで活躍。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 205, mass: .58}});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#0a0d10"}}>
      <VideoLayer src={assets.movement} startSeconds={4.4} playbackRate={.58} position="50% 45%" dark={.48} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.78))"}} />
      <div style={{position: "absolute", top: 96, bottom: 108, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "46px 26px 57px", border: "10px solid #fff", borderRadius: 42, background: "rgba(9,12,15,.76)", boxShadow: "0 18px 0 #050608,0 43px 90px #000b,inset 0 0 65px #fff23525", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.27, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#20262d", fontSize: 41, lineHeight: 1, fontWeight: 900}}>磁性流体</div>
        <div style={{marginTop: 42, color: "#fff", fontSize: 70, lineHeight: 1, fontWeight: 900}}>宇宙に行かず</div>
        <div style={{marginTop: 17, color: "#fff15a", fontSize: 112, lineHeight: .94, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #756400,0 28px 50px #000"}}>スピーカー<br />かい！</div>
        <div style={{width: "82%", margin: "45px 0 34px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 61, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 24, padding: "17px 61px 24px", border: "7px solid #fff", borderRadius: 999, background: "#e7c81f", color: "#13171b", fontSize: 106, lineHeight: 1, fontWeight: 900, boxShadow: "0 11px 0 #6f6000"}}>よろしく</div>
        <div style={{marginTop: 52, color: "#e9eef3", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = .23}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getFerrofluidTimeline>}> = ({episode, timeline}) => {
  const nasaFrom = timeline.answerStarts[4];
  const pivotFrom = timeline.answerStarts[5];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Lab Rocket Switch.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: "clamp"});
        const factDuck = interpolate(frame, [nasaFrom - 5, nasaFrom + 5, nasaFrom + 24, nasaFrom + 38], [1, .7, .7, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const pivotLift = interpolate(frame, [pivotFrom, pivotFrom + 18], [.83, 1.15], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 22, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .12 * fadeIn * factDuck * pivotLift * fadeOut;
      }}
    />
  );
};

export const FerrofluidShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getFerrofluidTimeline(episode);
  const scenes = [
    <Setup key="setup" />,
    <SpikeImpact key="impact" />,
    <CompositionFact key="composition" />,
    <ForcesFact key="forces" />,
    <NasaHistory key="nasa" />,
    <Pivot key="pivot" />,
  ];
  return (
    <AbsoluteFill style={{backgroundColor: "#05080b", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={.38} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio
            path={answer.audioFile}
            effect={index === 1 ? "Effect/シャキーン1.mp3" : index === 4 ? "Effect/決定ボタンを押す3.mp3" : undefined}
            effectVolume={index === 1 ? .24 : .16}
          />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.38} />
      </Sequence>
    </AbsoluteFill>
  );
};
