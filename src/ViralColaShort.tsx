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

export const VIRAL_COLA_FPS = 30;
export const VIRAL_COLA_WIDTH = 1080;
export const VIRAL_COLA_HEIGHT = 1920;

const SOURCE_FPS = 24;

const assets = {
  setup: "movie/Mint_candies_erupting_in_cola_202608231914.mp4",
  hero: "movie/Cola_and_mint_experiment_1080p_202608231915.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * VIRAL_COLA_FPS));

export const getViralColaTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 1.35), framesFor(1.35, 1.35));
  const minimums = [4.1, 3.4, 5.5, 5.2];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 5.2), framesFor(5.2, 5.2));
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
}> = ({
  src,
  startSeconds = 0,
  playbackRate = 1,
  position = "50% 50%",
  dark = 0,
  scaleFrom = 1.01,
  scaleTo = 1.045,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#15100d"}}>
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
          filter: `brightness(${1 - dark * 0.42}) contrast(1.08) saturate(1.04)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,rgba(15,8,3,${0.32 + dark * 0.28}),transparent 43%,rgba(17,8,3,.54))`,
        }}
      />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 45,
      left: 38,
      padding: "12px 21px 15px",
      border: "4px solid #fff",
      borderRadius: 999,
      background: "linear-gradient(135deg,#ff5a20,#ffb000)",
      color: "#fff",
      fontSize: 28,
      lineHeight: 1,
      fontWeight: 900,
      boxShadow: "0 7px 0 #7c2508,0 14px 30px #0008",
      textShadow: "0 3px 0 #812400",
    }}
  >
    世界のバズ、AIで再現
  </div>
);

const AiBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 49,
      right: 35,
      padding: "9px 14px 11px",
      border: "2px solid #fff9",
      borderRadius: 8,
      background: "rgba(0,0,0,.62)",
      color: "#fff",
      fontSize: 21,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: 1,
    }}
  >
    AI再現映像
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string; bottom?: number}> = ({
  children,
  accent = "#ffb000",
  bottom = 250,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom,
        width: 920,
        boxSizing: "border-box",
        transform: "translateX(-50%)",
        padding: "18px 24px 23px",
        borderTop: `8px solid ${accent}`,
        borderRadius: 18,
        background: "rgba(20,9,2,.9)",
        color: "#fff",
        fontSize: 46,
        lineHeight: 1.2,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 6px #000",
        boxShadow: "0 13px 35px #0009",
        opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"}),
      }}
    >
      {children}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 220, mass: 0.55}});
  const shake = frame < 11 ? Math.sin(frame * 3.8) * (11 - frame) * 0.75 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${-shake * 0.35}px)`}}>
      <VideoLayer src={assets.hero} startSeconds={0.05} playbackRate={0.82} position="50% 42%" dark={0.04} />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%,transparent 25%,rgba(0,0,0,.35) 80%)"}} />
      <SeriesBadge />
      <AiBadge />
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 42,
          right: 42,
          textAlign: "center",
          transform: `scale(${interpolate(enter, [0, 1], [1.42, 1])})`,
          opacity: 1,
        }}
      >
        <div style={{color: "#fff", fontSize: 105, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #361204", paintOrder: "stroke fill", textShadow: "0 11px 0 #872900,0 24px 44px #000"}}>この噴水</div>
        <div style={{marginTop: 26, color: "#ffdf35", fontSize: 181, lineHeight: .9, fontWeight: 900, letterSpacing: -9, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #d43f0c,0 30px 55px #000"}}>AIです</div>
      </div>
    </AbsoluteFill>
  );
};

const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const rewindOpacity = interpolate(frame, [0, 5, 16, 23], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.setup} startSeconds={0} playbackRate={1} position="50% 48%" dark={0.03} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 175, left: 55, right: 55, textAlign: "center"}}>
        <div style={{opacity: rewindOpacity, display: "inline-block", padding: "14px 36px 19px", border: "6px solid #fff", borderRadius: 14, background: "#232323e8", color: "#fff", fontSize: 69, lineHeight: 1, fontWeight: 900, boxShadow: "0 10px 0 #000"}}>数秒前――</div>
        <div style={{marginTop: 35, color: "#ffdf35", fontSize: 100, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #2d1106", paintOrder: "stroke fill", textShadow: "0 10px 0 #9f3009,0 25px 45px #000"}}>落とした瞬間…</div>
      </div>
      <Caption>コーラに、ミント菓子を<br />落とすと――</Caption>
    </AbsoluteFill>
  );
};

const Eruption: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame, fps, config: {damping: 6, stiffness: 270, mass: 0.5}});
  const shake = frame < 13 ? Math.sin(frame * 4.4) * (13 - frame) * 0.85 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${shake * .32}px)`}}>
      <VideoLayer src={assets.hero} startSeconds={0.05} playbackRate={0.78} position="50% 43%" dark={0.02} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 170, left: 35, right: 35, textAlign: "center", transform: `scale(${interpolate(hit, [0, 1], [1.65, 1])})`}}>
        <div style={{color: "#ff3e19", fontSize: 191, lineHeight: .9, fontWeight: 900, WebkitTextStroke: "11px #fff", paintOrder: "stroke fill", textShadow: "0 14px 0 #761606,0 31px 55px #000"}}>噴いた！</div>
      </div>
      <Caption accent="#ff4b1f">見た目は、それっぽい。</Caption>
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const start = index * 4;
  const progress = Math.max(0, frame - start);
  const x = 190 + ((index * 137) % 700);
  const size = 30 + (index % 4) * 17;
  const y = 1280 - progress * (5.2 + (index % 3));
  const opacity = interpolate(progress, [0, 8, 85, 110], [0, .9, .85, 0], {extrapolateRight: "clamp"});
  return <div style={{position: "absolute", left: x, top: y, width: size, height: size, border: "5px solid #d8f8ff", borderRadius: "50%", background: "rgba(116,225,255,.18)", boxShadow: "inset 0 0 12px #fff,0 0 15px #82eaff", opacity}} />;
};

const Science: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 9, stiffness: 150, mass: .65}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%,#244e60,#071118 72%)"}}>
      <VideoLayer src={assets.hero} startSeconds={3.1} playbackRate={0.58} position="50% 45%" dark={0.65} scaleFrom={1.08} scaleTo={1.12} />
      <AbsoluteFill style={{background: "rgba(2,17,25,.53)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 160, left: 42, right: 42, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 57, lineHeight: 1, fontWeight: 900}}>なぜ噴く？</div>
        <div style={{marginTop: 21, padding: "21px 18px 28px", border: "6px solid #8eeaff", borderRadius: 22, background: "rgba(0,20,30,.82)", color: "#fff", fontSize: 59, lineHeight: 1.12, fontWeight: 900, transform: `scale(${interpolate(enter, [0, 1], [1.16, 1])})`, boxShadow: "0 13px 0 #052f3d,0 28px 55px #0008"}}>
          表面の細かな穴を足場に
          <div style={{marginTop: 15, color: "#73e9ff", fontSize: 78}}>CO₂が一気に気泡へ</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 150, right: 150, top: 760, height: 470, border: "7px solid #fff", borderRadius: "50% 46% 54% 44%", background: "radial-gradient(circle at 38% 33%,#fff4c9,#c6a064 58%,#71512e)", boxShadow: "0 25px 65px #000a,inset -35px -45px 70px #5d3d20", transform: `scale(${interpolate(enter, [0, 1], [.7, 1])})`}}>
        {Array.from({length: 28}, (_, index) => <div key={index} style={{position: "absolute", left: `${9 + (index * 29) % 82}%`, top: `${8 + (index * 43) % 78}%`, width: 8 + (index % 4) * 4, height: 8 + (index % 4) * 4, borderRadius: "50%", background: "#705131", boxShadow: "inset 1px 2px 3px #34210f"}} />)}
      </div>
      {Array.from({length: 13}, (_, index) => <Bubble key={index} index={index} frame={frame} />)}
      <Caption accent="#72e5ff" bottom={205}>表面の細かな穴を足場に、<br />二酸化炭素が一気に泡へ。</Caption>
    </AbsoluteFill>
  );
};

const FactReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cross = spring({frame: Math.max(0, frame - 25), fps, config: {damping: 8, stiffness: 220, mass: .55}});
  const gas = spring({frame: Math.max(0, frame - 58), fps, config: {damping: 8, stiffness: 185, mass: .62}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.setup} startSeconds={4.25} playbackRate={0.82} position="50% 45%" dark={0.43} />
      <AbsoluteFill style={{background: "rgba(18,4,1,.3)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 180, left: 45, right: 45, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 61, lineHeight: 1.05, fontWeight: 900}}>この噴水の主役は</div>
        <div style={{position: "relative", marginTop: 46, display: "inline-block", padding: "18px 35px 25px", border: "7px solid #fff", borderRadius: 18, background: "#f4d133", color: "#271500", fontSize: 91, lineHeight: 1, fontWeight: 900, boxShadow: "0 12px 0 #8c6610,0 28px 50px #0009"}}>
          化学反応
          <div style={{position: "absolute", left: -26, right: -26, top: "49%", height: 17, borderRadius: 999, background: "#e01414", boxShadow: "0 5px 0 #72100b,0 0 16px #fff", transformOrigin: "left center", transform: `rotate(-8deg) scaleX(${cross})`}} />
        </div>
        <div style={{marginTop: 34, color: "#fff", fontSize: 67, lineHeight: 1, fontWeight: 900}}>ではなく</div>
        <div style={{marginTop: 38, opacity: gas, transform: `scale(${interpolate(gas, [0, 1], [1.55, 1])})`, color: "#6ff4ff", fontSize: 131, lineHeight: .95, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #0a6570,0 26px 48px #000"}}>急な<br />ガス抜け</div>
      </div>
      <Caption accent="#f13a22" bottom={225}>化学反応ではなく、<br />急なガス抜け。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 210, mass: .58}});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "radial-gradient(circle at 50% 22%,#ffce31,#ff5a18 52%,#541100)"}}>
      <VideoLayer src={assets.hero} startSeconds={0.1} playbackRate={0.74} position="50% 43%" dark={0.42} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(88,16,0,.25),rgba(45,5,0,.72))"}} />
      <div style={{position: "absolute", top: 102, bottom: 110, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "49px 27px 59px", border: "10px solid #fff", borderRadius: 42, background: "rgba(71,14,0,.72)", boxShadow: "0 18px 0 #4e1004,0 43px 90px #000a,inset 0 0 70px #ffb31c55", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#de3c0c", fontSize: 42, lineHeight: 1, fontWeight: 900}}>AIで大噴水</div>
        <div style={{marginTop: 43, color: "#fff", fontSize: 65, lineHeight: 1, fontWeight: 900}}>そこ化学じゃ</div>
        <div style={{marginTop: 18, color: "#ffe335", fontSize: 129, lineHeight: .95, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #a73509,0 28px 50px #000"}}>ないんかい！</div>
        <div style={{width: "82%", margin: "50px 0 38px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 62, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 25, padding: "17px 61px 24px", border: "7px solid #fff", borderRadius: 999, background: "#ff4a16", color: "#fff", fontSize: 108, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #8b1d06", boxShadow: "0 11px 0 #681400"}}>よろしく</div>
        <div style={{marginTop: 55, color: "#fff4c8", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = .25}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getViralColaTimeline>}> = ({episode, timeline}) => {
  const factFrom = timeline.answerStarts[3];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Lab Boop Reveal.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: "clamp"});
        const factStop = interpolate(frame, [factFrom - 5, factFrom + 3, factFrom + 13, factFrom + 27], [1, .07, .07, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 22, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .12 * fadeIn * factStop * fadeOut;
      }}
    />
  );
};

export const ViralColaShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getViralColaTimeline(episode);
  const scenes = [<Setup key="setup" />, <Eruption key="eruption" />, <Science key="science" />, <FactReveal key="fact" />];
  return (
    <AbsoluteFill style={{backgroundColor: "#160a03", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={.36} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={index === 2 ? "Effect/シャキーン1.mp3" : undefined} effectVolume={.2} />
        </Sequence>
      ))}
      <Sequence from={timeline.answerStarts[1]} durationInFrames={54}>
        <Audio src={staticFile("Effect/ドーン.mp3")} volume={(frame) => .58 * interpolate(frame, [0, 8, 40, 53], [1, 1, .2, 0], {extrapolateRight: "clamp"})} />
      </Sequence>
      <Sequence from={timeline.answerStarts[3] + 25} durationInFrames={58}>
        <Audio src={staticFile("Effect/ショック2.mp3")} volume={(frame) => .42 * interpolate(frame, [0, 8, 40, 57], [1, 1, .2, 0], {extrapolateRight: "clamp"})} />
      </Sequence>
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.42} />
      </Sequence>
    </AbsoluteFill>
  );
};
