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

export const AEROGEL_FPS = 30;
export const AEROGEL_WIDTH = 1080;
export const AEROGEL_HEIGHT = 1920;

const assets = {
  flowerVideo: "movie/aerogel-flower-cfr-720p.mp4",
  cometVideo: "movie/aerogel-comet-cfr-720p.mp4",
  flowerPhoto: "image/aerogel/aerogel-flower-nasa.jpg",
  roverPhoto: "image/aerogel/sojourner-pia00611-nasa-jpl.jpg",
  tracksPhoto: "image/aerogel/aerogel-particle-tracks-pia03186-nasa-jpl.jpg",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * AEROGEL_FPS));

export const getAerogelTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.8), framesFor(2.8, 2.8));
  const minimums = [2.5, 3.1, 4.0, 3.6, 3.8, 4.6, 3.0];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(
      framesFor(answer.duration, minimums[index] ?? 3.5),
      framesFor(minimums[index] ?? 3.5, minimums[index] ?? 3.5),
    ),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.8), framesFor(4.8, 4.8));
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
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
  cool?: number;
  hitFrame?: number;
  blur?: number;
}> = ({
  src,
  startSeconds = 0,
  playbackRate = 1,
  position = "50% 50%",
  dark = 0,
  cool = 0,
  hitFrame,
  blur = 0,
}) => {
  const frame = useCurrentFrame();
  const hit = hitFrame === undefined ? 0 : impact(frame, hitFrame, 10);
  const zoom = interpolate(frame, [0, 165], [1.01, 1.065], {extrapolateRight: "clamp"});
  const shakeX = Math.sin(frame * 10.8) * hit * 25;
  const shakeY = Math.cos(frame * 13.1) * hit * 27;
  const rotate = Math.sin(frame * 9.7) * hit * 1.05;
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#020408"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * AEROGEL_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${shakeX}px,${shakeY}px) rotate(${rotate}deg) scale(${zoom + hit * 0.045})`,
          filter: `brightness(${1 - dark * 0.55 + hit * 0.16}) contrast(${1.08 + hit * 0.3}) saturate(${1 + cool * 0.08}) hue-rotate(${-cool * 5}deg) blur(${blur}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,rgba(1,4,10,${0.34 + dark * 0.2}),transparent 43%,rgba(0,3,8,.72))`,
        }}
      />
      {hit > 0 ? (
        <AbsoluteFill
          style={{
            background: `rgba(223,247,255,${hit * 0.34})`,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const PhotoLayer: React.FC<{
  src: string;
  position?: string;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
}> = ({src, position = "50% 50%", dark = 0, scaleFrom = 1.03, scaleTo = 1.11}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 145], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#02060c"}}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${zoom})`,
          filter: `brightness(${1 - dark * 0.5}) contrast(1.08) saturate(1.04)`,
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(2,5,10,.7),transparent 38%,rgba(0,3,8,.74))"}} />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 48,
      left: 38,
      padding: "11px 18px 14px",
      border: "3px solid #fff",
      borderRadius: 999,
      background: "rgba(2,8,16,.84)",
      color: "#fff",
      fontSize: 28,
      lineHeight: 1,
      fontWeight: 900,
      boxShadow: "0 8px 24px #0009",
    }}
  >
    世界のバズ AIで再現 #7
  </div>
);

const MediaBadge: React.FC<{official?: boolean; application?: boolean}> = ({official = false, application = false}) => (
  <div
    style={{
      position: "absolute",
      top: 50,
      right: 38,
      padding: "10px 15px 12px",
      borderRadius: 8,
      background: official ? "rgba(235,245,255,.93)" : "rgba(0,0,0,.76)",
      color: official ? "#12314a" : "#eaf8ff",
      fontSize: 21,
      lineHeight: 1,
      fontWeight: 900,
      boxShadow: "0 5px 15px #0008",
    }}
  >
    {official ? "NASA公式資料" : application ? "AIによる応用イメージ" : "AI再現映像"}
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = "#89efff"}) => (
  <div
    style={{
      position: "absolute",
      left: 68,
      right: 68,
      bottom: 205,
      padding: "20px 24px 24px",
      border: `4px solid ${accent}`,
      borderRadius: 20,
      background: "rgba(2,7,14,.88)",
      color: "#fff",
      textAlign: "center",
      fontSize: 49,
      lineHeight: 1.16,
      fontWeight: 900,
      boxShadow: "0 14px 38px #000b",
    }}
  >
    {children}
  </div>
);

const SlamText: React.FC<{
  first: string;
  second: string;
  accent?: string;
  size?: number;
  top?: number;
}> = ({first, second, accent = "#87efff", size = 112, top = 170}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190, mass: 0.58}});
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 30,
        right: 30,
        textAlign: "center",
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [1.42, 1])})`,
      }}
    >
      <div
        style={{
          color: "#fff",
          fontSize: 65,
          lineHeight: 1,
          fontWeight: 900,
          WebkitTextStroke: "6px #03101a",
          paintOrder: "stroke fill",
          textShadow: "0 16px 34px #000",
        }}
      >
        {first}
      </div>
      <div
        style={{
          marginTop: 24,
          color: accent,
          fontSize: size,
          lineHeight: 0.94,
          fontWeight: 900,
          letterSpacing: -5,
          WebkitTextStroke: "9px #fff",
          paintOrder: "stroke fill",
          textShadow: "0 12px 0 #173b58,0 30px 50px #000",
        }}
      >
        {second}
      </div>
    </div>
  );
};

const SourceLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: "absolute",
      left: 42,
      right: 42,
      bottom: 136,
      padding: "8px 12px 11px",
      borderRadius: 8,
      background: "rgba(0,0,0,.78)",
      color: "#fff",
      fontSize: 20,
      lineHeight: 1.15,
      textAlign: "center",
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.22), [-1, 1], [0.93, 1.04]);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.flowerVideo} startSeconds={3.35} playbackRate={0.82} position="50% 51%" />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 68%,transparent 0 24%,rgba(2,4,10,.28) 68%)"}} />
      <SeriesBadge />
      <MediaBadge />
      <div style={{position: "absolute", top: 156, left: 30, right: 30, textAlign: "center", transform: `scale(${pulse})`}}>
        <div style={{color: "#fff", fontSize: 69, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #160907", paintOrder: "stroke fill", textShadow: "0 18px 35px #000"}}>炎の上なのに</div>
        <div style={{marginTop: 24, color: "#fff157", fontSize: 131, lineHeight: 0.9, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 14px 0 #8c330d,0 34px 55px #000"}}>花が無事!?</div>
      </div>
      <Caption accent="#fff157">炎の上なのに。<br />花が無事！</Caption>
    </AbsoluteFill>
  );
};

const NameReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [0, 18], [0.72, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.flowerVideo} startSeconds={0.1} playbackRate={0.75} position="50% 50%" dark={0.1} />
      <AbsoluteFill style={{opacity: scan, background: "repeating-linear-gradient(0deg,rgba(114,237,255,.34) 0 5px,transparent 5px 18px)", mixBlendMode: "screen", transform: `translateY(${frame * 21}px)`}} />
      <SeriesBadge />
      <MediaBadge />
      <SlamText first="正体は" second="エアロゲル" accent="#8cefff" size={126} />
      <Caption>正体は、<br />エアロゲル。</Caption>
    </AbsoluteFill>
  );
};

const AirReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 175}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.flowerVideo} startSeconds={1.0} playbackRate={0.52} dark={0.6} cool={0.6} />
      <SeriesBadge />
      <MediaBadge />
      <div style={{position: "absolute", top: 157, left: 38, right: 38, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 63, fontWeight: 900}}>固体なのに</div>
        <div style={{marginTop: 21, color: "#fff36b", fontSize: 159, lineHeight: 0.88, fontWeight: 900, letterSpacing: -9, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #756500,0 32px 55px #000", transform: `scale(${interpolate(enter, [0, 1], [0.48, 1])})`}}>95%</div>
        <div style={{marginTop: 20, color: "#9aeeff", fontSize: 86, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "6px #082230", paintOrder: "stroke fill"}}>が空気</div>
      </div>
      <div style={{position: "absolute", top: 670, left: 190, right: 190, height: 330, border: "8px solid #eafcff", borderRadius: 34, background: "linear-gradient(145deg,rgba(205,248,255,.58),rgba(89,179,214,.28))", boxShadow: "0 0 65px #70e7ff66,inset 0 0 55px #fff6", overflow: "hidden"}}>
        {Array.from({length: 22}, (_, index) => {
          const x = 35 + ((index * 83) % 610);
          const y = 24 + ((index * 67) % 270);
          const s = 12 + (index % 4) * 8;
          return <div key={index} style={{position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", border: "3px solid rgba(235,254,255,.95)", background: "rgba(35,110,148,.24)"}} />;
        })}
      </div>
      <SourceLabel>シリカエアロゲルは約95%が空気／NASA Spinoff</SourceLabel>
      <Caption accent="#fff36b">固体なのに、体積の<br />95パーセントは空気です。</Caption>
    </AbsoluteFill>
  );
};

const PoreDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [5, 95], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.flowerVideo} startSeconds={2.0} playbackRate={0.38} dark={0.75} cool={0.5} />
      <SeriesBadge />
      <MediaBadge />
      <SlamText first="細かな穴が" second="熱を伝えにくくする" accent="#81eaff" size={84} top={154} />
      <div style={{position: "absolute", left: 92, right: 92, top: 600, height: 570, border: "8px solid #e7fbff", borderRadius: 38, background: "rgba(3,17,28,.91)", boxShadow: "0 28px 70px #000c", overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 145, background: "linear-gradient(180deg,#ffae50,#e6402a)", color: "#fff", fontSize: 40, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center"}}>熱</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 135, background: "linear-gradient(180deg,#6ce7ff,#125385)", color: "#fff", fontSize: 39, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center"}}>花側</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 135, height: 290, background: "linear-gradient(145deg,#d8fbffcc,#4b9fc999)", borderTop: "6px solid #fff", borderBottom: "6px solid #fff"}}>
          {Array.from({length: 28}, (_, index) => {
            const x = 20 + ((index * 97) % 825);
            const y = 12 + ((index * 61) % 245);
            const s = 19 + (index % 3) * 12;
            return <div key={index} style={{position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#07151eaa", border: "4px solid #effdff"}} />;
          })}
        </div>
        {[0, 1, 2, 3].map((index) => {
          const lift = Math.min(1, Math.max(0, travel - index * 0.08));
          return <div key={index} style={{position: "absolute", left: 118 + index * 190, bottom: 100 + lift * 210, color: "#ffdf70", fontSize: 91, fontWeight: 900, opacity: 0.9 - lift * 0.55, transform: `scaleY(${1 - lift * 0.5})`}}>↑</div>;
        })}
      </div>
      <Caption>細かな穴に空気を閉じ込め、<br />熱を伝えにくくします。</Caption>
    </AbsoluteFill>
  );
};

const FlowerProof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 48%,#4d151e,#12070b 62%,#020305)"}}>
      <SeriesBadge />
      <MediaBadge official />
      <SlamText first="実物も" second="花を熱から守る" accent="#ffdd6d" size={91} top={150} />
      <div style={{position: "absolute", top: 495, left: 84, right: 84, height: 830, border: "10px solid #fff", borderRadius: 34, overflow: "hidden", boxShadow: "0 22px 0 #56212c,0 50px 85px #000d", transform: `scale(${interpolate(enter, [0, 1], [0.83, 1])})`}}>
        <Img src={staticFile(assets.flowerPhoto)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%"}} />
      </div>
      <SourceLabel>Silica aerogel insulates a flower from a blue flame／NASA Spinoff</SourceLabel>
      <Caption accent="#ffdd6d">実際の実演でも、<br />青い炎から花を守ります。</Caption>
    </AbsoluteFill>
  );
};

const MarsProof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 155}});
  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg,#120805,#3f1c0d 55%,#080303)"}}>
      <PhotoLayer src={assets.roverPhoto} position="50% 62%" dark={0.1} scaleFrom={1.02} scaleTo={1.08} />
      <AbsoluteFill style={{background: "linear-gradient(90deg,rgba(75,186,255,.28),transparent 35%,rgba(255,150,57,.12))", mixBlendMode: "screen"}} />
      <SeriesBadge />
      <MediaBadge official />
      <div style={{position: "absolute", top: 154, left: 35, right: 35, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.35, 1])})`}}>
        <div style={{color: "#fff", fontSize: 67, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #2a0d05", paintOrder: "stroke fill"}}>NASAは</div>
        <div style={{marginTop: 20, color: "#8de9ff", fontSize: 100, lineHeight: 0.95, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #174e68,0 30px 50px #000"}}>火星探査車の断熱へ</div>
      </div>
      <div style={{position: "absolute", top: 665, right: 95, padding: "17px 23px 21px", border: "5px solid #fff", borderRadius: 20, background: "rgba(2,24,38,.82)", color: "#b7f1ff", fontSize: 42, lineHeight: 1.05, fontWeight: 900, boxShadow: "0 16px 35px #000a"}}>火星の寒さから<br />電子機器を守る</div>
      <SourceLabel>Mars Pathfinder / Sojourner（PIA00611）／NASA・JPL</SourceLabel>
      <Caption>NASAは、火星探査車の<br />断熱にも使いました。</Caption>
    </AbsoluteFill>
  );
};

const CometCapture: React.FC = () => {
  const frame = useCurrentFrame();
  const hitFrame = 84;
  const hit = impact(frame, hitFrame, 11);
  const ring = interpolate(frame, [hitFrame, hitFrame + 34], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.cometVideo} startSeconds={1.28} playbackRate={0.86} position="50% 50%" dark={0.04} cool={0.5} hitFrame={hitFrame} />
      {ring > 0 && ring < 1 ? <div style={{position: "absolute", left: 540 - ring * 390, top: 985 - ring * 390, width: ring * 780, height: ring * 780, borderRadius: "50%", border: `${Math.max(2, 12 - ring * 9)}px solid rgba(192,240,255,${1 - ring})`, boxShadow: "0 0 40px #a5eaff"}} /> : null}
      <AbsoluteFill style={{opacity: hit * 0.34, background: "radial-gradient(circle at 52% 54%,#fff 0 4%,#8fdfff 18%,transparent 58%)", mixBlendMode: "screen"}} />
      <SeriesBadge />
      <MediaBadge application />
      <SlamText first="さらに" second="彗星のチリを捕獲" accent="#9de9ff" size={93} top={150} />
      <Caption>さらに、彗星のチリを捕まえて、<br />地球へ持ち帰りました。</Caption>
    </AbsoluteFill>
  );
};

const SpeedProof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 6, stiffness: 210, mass: 0.56}});
  const streak = interpolate(frame, [5, 54], [-320, 930], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: "linear-gradient(160deg,#03101b,#081f31 58%,#020409)"}}>
      <PhotoLayer src={assets.tracksPhoto} position="50% 52%" dark={0.2} scaleFrom={1.02} scaleTo={1.06} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(1,5,10,.78),rgba(1,5,10,.05) 47%,rgba(0,3,7,.76))"}} />
      <SeriesBadge />
      <MediaBadge official />
      <div style={{position: "absolute", top: 150, left: 35, right: 35, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 66, fontWeight: 900, WebkitTextStroke: "7px #03101a", paintOrder: "stroke fill"}}>速さは</div>
        <div style={{marginTop: 21, color: "#fff05d", fontSize: 137, lineHeight: 0.88, letterSpacing: -8, fontWeight: 900, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #746200,0 31px 50px #000", transform: `scale(${interpolate(enter, [0, 1], [1.7, 1])})`}}>弾丸の最大6倍</div>
      </div>
      <div style={{position: "absolute", top: 625, left: streak, width: 350, height: 11, borderRadius: 999, background: "linear-gradient(90deg,transparent,#fff,#8deaff)", boxShadow: "0 0 25px #9aeaff"}} />
      <div style={{position: "absolute", top: 970, left: 86, right: 86, padding: "23px 22px 28px", border: "6px solid #dff8ff", borderRadius: 25, background: "rgba(1,14,24,.82)", color: "#fff", textAlign: "center", fontSize: 41, lineHeight: 1.12, fontWeight: 900}}>エアロゲルの中に残った<br /><span style={{color: "#8deaff", fontSize: 58}}>ニンジン形の粒子軌跡</span></div>
      <SourceLabel>Particle Tracks in Aerogel（PIA03186）／NASA・JPL<br />速度比較: NASA JPL “Ideas that Gel”</SourceLabel>
      <Caption accent="#fff05d">速さは、<br />弾丸の最大6倍。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 185, mass: 0.6}});
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <VideoLayer src={assets.cometVideo} startSeconds={5.0} playbackRate={0.44} position="50% 50%" dark={0.63} cool={0.6} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(2,8,18,.18),rgba(1,5,12,.64))"}} />
      <SeriesBadge />
      <MediaBadge application />
      <div style={{position: "absolute", top: 125, bottom: 135, left: 42, right: 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 28px 60px", border: "9px solid rgba(255,255,255,.96)", borderRadius: 42, background: "rgba(4,16,28,.74)", boxShadow: "0 20px 0 rgba(2,8,15,.85),0 48px 90px #000b,inset 0 0 85px rgba(111,225,255,.17)", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "rgba(238,252,255,.95)", color: "#16405a", fontSize: 42, lineHeight: 1, fontWeight: 900}}>エアロゲル</div>
        <div style={{marginTop: 48, color: "#fff", fontSize: 84, lineHeight: 0.98, fontWeight: 900, WebkitTextStroke: "7px #06131f", paintOrder: "stroke fill"}}>軽すぎるのに</div>
        <div style={{marginTop: 28, color: "#fff15c", fontSize: 122, lineHeight: 0.9, letterSpacing: -7, fontWeight: 900, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #665900,0 33px 50px #000"}}>仕事が重いわ！</div>
        <div style={{width: "82%", margin: "60px 0 42px", borderTop: "8px dashed rgba(255,255,255,.94)"}} />
        <div style={{color: "#fff", fontSize: 62, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録もよろしく</div>
        <div style={{marginTop: 51, color: "#d8f8ff", fontSize: 32, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const Narration: React.FC<{path?: string}> = ({path}) => path ? <Audio src={staticFile(path)} volume={1} /> : null;

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getAerogelTimeline>}> = ({episode, timeline}) => {
  const proofFrom = timeline.answerStarts[3];
  const cometFrom = timeline.answerStarts[5];
  const speedFrom = timeline.answerStarts[6];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Solid Smoke Launch.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
        const proofDuck = interpolate(frame, [proofFrom - 6, proofFrom + 8, proofFrom + 74, proofFrom + 96], [1, 0.48, 0.58, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const impactDuck = interpolate(frame, [cometFrom + 70, cometFrom + 84, cometFrom + 92, cometFrom + 108], [1, 0.75, 0.32, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const numberDuck = interpolate(frame, [speedFrom - 3, speedFrom + 10, speedFrom + 45, speedFrom + 66], [1, 0.58, 0.62, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 30, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return 0.115 * fadeIn * proofDuck * impactDuck * numberDuck * fadeOut;
      }}
    />
  );
};

export const AerogelShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getAerogelTimeline(episode);
  const scenes = [NameReveal, AirReveal, PoreDiagram, FlowerProof, MarsProof, CometCapture, SpeedProof];
  return (
    <AbsoluteFill style={{backgroundColor: "#020408", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <Narration path={episode.odaiAudioFile} />
        <Sequence from={11}><Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={0.3} /></Sequence>
      </Sequence>
      {episode.answers.map((answer, index) => {
        const Scene = scenes[index];
        return (
          <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
            <Scene />
            <Narration path={answer.audioFile} />
            {index === 0 ? <Audio src={staticFile("Effect/シャキーン2.mp3")} volume={0.2} /> : null}
            {index === 1 ? <Sequence from={18}><Audio src={staticFile("Effect/チーン1.mp3")} volume={0.16} /></Sequence> : null}
            {index === 4 ? <Sequence from={12}><Audio src={staticFile("Effect/シャキーン1.mp3")} volume={0.13} /></Sequence> : null}
            {index === 5 ? <Sequence from={84}><Audio src={staticFile("Effect/ドーン.mp3")} volume={0.35} /></Sequence> : null}
            {index === 6 ? <Sequence from={16}><Audio src={staticFile("Effect/金属タイトル表示2.mp3")} volume={0.25} /></Sequence> : null}
          </Sequence>
        );
      })}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <Narration path={episode.outroAudioFile} />
        <Audio src={staticFile("Effect/ビシッとツッコミ2.mp3")} volume={0.36} />
      </Sequence>
    </AbsoluteFill>
  );
};
