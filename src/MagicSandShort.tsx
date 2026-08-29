import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
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

export const MAGIC_SAND_FPS = 30;
export const MAGIC_SAND_WIDTH = 1080;
export const MAGIC_SAND_HEIGHT = 1920;

const assets = {
  sand: "movie/Scooping_hydrophobic_sand_underw…_1080p_202608252302.mp4",
  farm: "movie/Tomato_plants_growing_in_desert_202608252303.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * MAGIC_SAND_FPS));

export const getMagicSandTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 3.1), framesFor(3.1, 3.1));
  const minimums = [2.7, 2.6, 4.5, 4.3, 4.8, 4.2];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  answerFrames.forEach((duration) => {
    answerStarts.push(cursor);
    cursor += duration;
  });
  const outroFrames = Math.max(framesFor(episode.outroDuration, 5), framesFor(5, 5));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const impact = (frame: number, at: number, tail = 12) =>
  interpolate(Math.abs(frame - at), [0, tail], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  warm?: number;
  hitFrame?: number;
}> = ({src, startSeconds = 0, playbackRate = 1, position = "50% 50%", dark = 0, warm = 0, hitFrame}) => {
  const frame = useCurrentFrame();
  const hit = hitFrame === undefined ? 0 : impact(frame, hitFrame);
  const zoom = interpolate(frame, [0, 160], [1.015, 1.07], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#02080c"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * MAGIC_SAND_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${Math.sin(frame * 9) * hit * 20}px,${Math.cos(frame * 12) * hit * 25}px) rotate(${Math.sin(frame * 8) * hit}deg) scale(${zoom + hit * .035})`,
          filter: `brightness(${1 - dark * .52 + hit * .16}) contrast(${1.08 + hit * .25}) saturate(${.98 + warm * .2}) sepia(${warm * .12})`,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(1,5,9,${.36 + dark * .24}),transparent 45%,rgba(0,4,7,.76))`}} />
      {hit > 0 ? <AbsoluteFill style={{background: `rgba(215,249,255,${hit * .3})`, mixBlendMode: "screen"}} /> : null}
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 48, left: 38, padding: "11px 18px 14px", border: "3px solid #fff", borderRadius: 999, background: "rgba(2,9,14,.84)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, boxShadow: "0 8px 24px #0009"}}>
    世界のバズ AIで再現 #6
  </div>
);

const AiBadge: React.FC<{farm?: boolean}> = ({farm = false}) => (
  <div style={{position: "absolute", top: 50, right: 38, padding: "10px 15px 12px", borderRadius: 8, background: "rgba(0,0,0,.74)", color: "#e7f7ff", fontSize: 22, lineHeight: 1, fontWeight: 900}}>
    {farm ? "AIによる応用イメージ" : "AI再現映像"}
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = "#81edff"}) => (
  <div style={{position: "absolute", left: 68, right: 68, bottom: 205, padding: "20px 24px 24px", border: `4px solid ${accent}`, borderRadius: 20, background: "rgba(2,8,12,.88)", color: "#fff", textAlign: "center", fontSize: 48, lineHeight: 1.16, fontWeight: 900, boxShadow: "0 14px 38px #000b"}}>
    {children}
  </div>
);

const SlamText: React.FC<{first: string; second: string; accent?: string; size?: number; top?: number}> = ({first, second, accent = "#79efff", size = 108, top = 178}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190, mass: .58}});
  return (
    <div style={{position: "absolute", top, left: 32, right: 32, textAlign: "center", opacity: enter, transform: `scale(${interpolate(enter, [0, 1], [1.4, 1])})`}}>
      <div style={{color: "#fff", fontSize: 63, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "6px #031018", paintOrder: "stroke fill", textShadow: "0 16px 34px #000"}}>{first}</div>
      <div style={{marginTop: 24, color: accent, fontSize: size, lineHeight: .94, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #155469,0 30px 50px #000"}}>{second}</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = impact(frame, 30, 14);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.sand} startSeconds={4.7} playbackRate={1} position="50% 51%" hitFrame={30} />
      <AbsoluteFill style={{opacity: pulse * .3, background: "radial-gradient(circle at 52% 52%,#fff 0 6%,#62eaff 20%,transparent 60%)", mixBlendMode: "screen"}} />
      <SeriesBadge /><AiBadge />
      <SlamText first="水の中なのに" second="濡れない砂" accent="#fff25e" size={124} />
      <Caption accent="#fff25e">水に沈めた砂。<br />なのに、濡れていません。</Caption>
    </AbsoluteFill>
  );
};

const NameReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [0, 18], [.7, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.sand} startSeconds={.2} playbackRate={.75} position="50% 48%" dark={.12} />
      <AbsoluteFill style={{opacity: scan, background: "repeating-linear-gradient(0deg,rgba(109,242,255,.3) 0 5px,transparent 5px 18px)", mixBlendMode: "screen", transform: `translateY(${frame * 20}px)`}} />
      <SeriesBadge /><AiBadge />
      <SlamText first="正体は" second="マジックサンド" accent="#70f3ff" size={98} />
      <Caption>正体は、<br />マジックサンド。</Caption>
    </AbsoluteFill>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 7, stiffness: 210}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.sand} startSeconds={2.2} playbackRate={.7} position="50% 50%" dark={.42} />
      <SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 160, left: 40, right: 40, textAlign: "center", transform: `scale(${interpolate(pop, [0, 1], [.45, 1])})`}}>
        <div style={{color: "#ffef5b", fontSize: 230, lineHeight: .8, fontWeight: 900, WebkitTextStroke: "11px #fff", paintOrder: "stroke fill", textShadow: "0 16px 0 #685f00,0 35px 55px #000"}}>？</div>
        <div style={{marginTop: 30, color: "#fff", fontSize: 87, lineHeight: 1.02, fontWeight: 900, WebkitTextStroke: "8px #07131b", paintOrder: "stroke fill"}}>で、これ<br />何に使うの？</div>
      </div>
      <Caption accent="#ffef5b">でもこれ、<br />何に使うの？</Caption>
    </AbsoluteFill>
  );
};

const GrainDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 9, stiffness: 140}});
  const drop = interpolate(frame, [12, 52], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.sand} startSeconds={.5} playbackRate={.45} dark={.64} />
      <SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 160, left: 55, right: 55, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 59, fontWeight: 900}}>砂粒ひとつずつを</div>
        <div style={{marginTop: 15, color: "#70efff", fontSize: 112, lineHeight: .9, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #126075"}}>撥水加工</div>
      </div>
      <div style={{position: "absolute", left: 128, right: 128, top: 560, height: 590, border: "7px solid #dffbff", borderRadius: 38, background: "rgba(1,17,24,.9)", boxShadow: "0 28px 65px #000b", transform: `scale(${interpolate(enter, [0, 1], [.7, 1])})`}}>
        <div style={{position: "absolute", left: 318, top: 65 + drop * 170, width: 115, height: 145, borderRadius: "55% 55% 65% 65%", background: "linear-gradient(145deg,#d9fdff,#36bcea)", transform: "rotate(45deg)", boxShadow: "0 0 34px #75edff"}} />
        <div style={{position: "absolute", left: 164, top: 315, width: 430, height: 190, borderRadius: "50%", background: "radial-gradient(circle at 42% 35%,#ffe89a,#e5a82e 66%,#8f5511)", border: "17px solid #65efff", boxShadow: "0 0 45px #53e6ff"}} />
        <div style={{position: "absolute", left: 220, top: 532, color: "#dffbff", fontSize: 36, fontWeight: 900}}>水を弾くコーティング</div>
      </div>
      <Caption>砂粒の表面が、水を弾くように<br />加工されています。</Caption>
    </AbsoluteFill>
  );
};

const DryReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const sparkle = impact(frame, 73, 18);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.sand} startSeconds={4.15} playbackRate={.86} position="50% 51%" hitFrame={73} />
      <AbsoluteFill style={{opacity: sparkle * .38, background: "linear-gradient(135deg,transparent 30%,#fff 49%,transparent 65%)", mixBlendMode: "screen"}} />
      <SeriesBadge /><AiBadge />
      <SlamText first="水が入り込みにくい" second="取り出すと乾いてる" accent="#fff06c" size={82} />
      <Caption accent="#fff06c">水が砂粒の間へ入り込みにくい。<br />だから、取り出すと乾いている。</Caption>
    </AbsoluteFill>
  );
};

const FarmReveal: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.farm} startSeconds={0} playbackRate={.98} position="50% 49%" warm={.35} hitFrame={19} />
    <SeriesBadge /><AiBadge farm />
    <SlamText first="同じ撥水の発想を" second="砂漠の畑へ" accent="#ffe06b" size={111} />
    <Caption accent="#ffe06b">そして同じ撥水の発想が、<br />乾燥地の農業で研究されています。</Caption>
  </AbsoluteFill>
);

const StatReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190}});
  const arrows = interpolate(frame % 40, [0, 28, 40], [0, -80, -80]);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.farm} startSeconds={3.55} playbackRate={.84} position="50% 51%" dark={.25} warm={.4} />
      <SeriesBadge /><AiBadge farm />
      <div style={{position: "absolute", top: 165, left: 42, right: 42, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [.45, 1])})`}}>
        <div style={{color: "#fff", fontSize: 61, fontWeight: 900}}>研究では、水分蒸発</div>
        <div style={{marginTop: 22, color: "#fff15f", fontSize: 153, lineHeight: .9, letterSpacing: -8, fontWeight: 900, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #786900,0 30px 55px #000"}}>最大78%減</div>
      </div>
      <div style={{position: "absolute", left: 130, right: 130, top: 610, height: 435, border: "7px solid #fff", borderRadius: 28, overflow: "hidden", background: "#52351f", boxShadow: "0 25px 55px #000a"}}>
        <div style={{height: 95, background: "linear-gradient(180deg,#e4bc65,#a96c2c)", borderBottom: "7px solid #fff", color: "#2d1c0d", fontSize: 33, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center"}}>撥水砂マルチ 5〜10mm</div>
        <div style={{height: 340, background: "linear-gradient(180deg,#765032,#3c2b21)", position: "relative"}}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{position: "absolute", left: 140 + i * 130, top: 170 + arrows, color: "#91edff", fontSize: 92, fontWeight: 900, opacity: .58}}>↑</div>)}
          <div style={{position: "absolute", inset: "100px 0 0", borderTop: "6px dashed #77ddff", color: "#d8f9ff", textAlign: "center", paddingTop: 140, fontSize: 34, fontWeight: 900}}>蒸発する水分を抑える</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 65, right: 65, bottom: 365, color: "#fff", fontSize: 23, lineHeight: 1.25, textAlign: "center", textShadow: "0 3px 8px #000"}}>条件により56〜78%減／ACS Agricultural Science &amp; Technology (2022)</div>
      <Caption accent="#fff15f">研究では、土からの蒸発を<br />最大78パーセント抑えました。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 185}});
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <VideoLayer src={assets.farm} startSeconds={3.8} playbackRate={.62} dark={.42} warm={.5} hitFrame={14} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(28,18,5,.2),rgba(16,10,2,.55))"}} />
      <SeriesBadge /><AiBadge farm />
      <div style={{position: "absolute", top: 125, bottom: 135, left: 42, right: 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 28px 60px", border: "9px solid rgba(255,255,255,.95)", borderRadius: 42, background: "rgba(28,20,7,.72)", boxShadow: "0 20px 0 rgba(45,29,7,.8),0 48px 90px #000a,inset 0 0 80px rgba(255,223,100,.18)", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.24, 1])})`}}>
        <div style={{padding: "10px 27px 14px", borderRadius: 999, background: "rgba(255,255,255,.94)", color: "#7e520e", fontSize: 41, lineHeight: 1, fontWeight: 900}}>マジックサンド</div>
        <div style={{marginTop: 42, color: "#fff", fontSize: 65, lineHeight: 1, fontWeight: 900}}>まさかの――</div>
        <div style={{marginTop: 20, color: "#fff", fontSize: 94, lineHeight: .96, fontWeight: 900, WebkitTextStroke: "7px #352306", paintOrder: "stroke fill"}}>砂漠農業の</div>
        <div style={{marginTop: 24, color: "#ffef5b", fontSize: 127, lineHeight: .9, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #776900,0 32px 50px #000"}}>救世主かい！</div>
        <div style={{width: "82%", margin: "54px 0 38px", borderTop: "8px dashed rgba(255,255,255,.94)"}} />
        <div style={{color: "#fff", fontSize: 58, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 22, padding: "17px 58px 23px", border: "7px solid #fff", borderRadius: 999, background: "rgba(238,131,35,.9)", color: "#fff", fontSize: 100, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #8d4709", boxShadow: "0 11px 0 rgba(94,43,3,.9)"}}>よろしく</div>
        <div style={{marginTop: 48, color: "#fff5c7", fontSize: 32, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const Voice: React.FC<{file?: string}> = ({file}) => file ? <Audio src={staticFile(file)} volume={1} /> : null;

export const MagicSandShort: React.FC<{episode: Episode}> = ({episode}) => {
  const frame = useCurrentFrame();
  const timeline = getMagicSandTimeline(episode);
  const scenes = [NameReveal, Question, GrainDiagram, DryReveal, FarmReveal, StatReveal];
  const bgmVolume = interpolate(frame, [0, 18, timeline.totalFrames - 35, timeline.totalFrames - 1], [0, .125, .125, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{fontFamily, backgroundColor: "#02080c"}}>
      {episode.bgm ? <Audio src={staticFile(episode.bgm)} volume={bgmVolume} /> : null}
      <Sequence from={0} durationInFrames={timeline.hookFrames}><Hook /><Voice file={episode.odaiAudioFile} /></Sequence>
      {episode.answers.map((answer, index) => {
        const Scene = scenes[index];
        return <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}><Scene /><Voice file={answer.audioFile} /></Sequence>;
      })}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}><Outro /><Voice file={episode.outroAudioFile} /></Sequence>
      <Sequence from={24} durationInFrames={34}><Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={.27} /></Sequence>
      <Sequence from={timeline.answerStarts[0]} durationInFrames={35}><Audio src={staticFile("Effect/シャキーン2.mp3")} volume={.16} /></Sequence>
      <Sequence from={timeline.answerStarts[1]} durationInFrames={35}><Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={.12} /></Sequence>
      <Sequence from={timeline.answerStarts[3] + 66} durationInFrames={40}><Audio src={staticFile("Effect/シャキーン1.mp3")} volume={.14} /></Sequence>
      <Sequence from={timeline.answerStarts[4] + 10} durationInFrames={45}><Audio src={staticFile("Effect/ドーン.mp3")} volume={.17} /></Sequence>
      <Sequence from={timeline.answerStarts[5] + 8} durationInFrames={38}><Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={.14} /></Sequence>
      <Sequence from={timeline.outroFrom + 8} durationInFrames={60}><Audio src={staticFile("Effect/ビシッとツッコミ2.mp3")} volume={.38} /></Sequence>
    </AbsoluteFill>
  );
};
