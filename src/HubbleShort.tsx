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

export const HUBBLE_FPS = 30;
export const HUBBLE_WIDTH = 1080;
export const HUBBLE_HEIGHT = 1920;

const SOURCE_FPS = 24;

const assets = {
  orbit: "movie/Hubble_Space_Telescope_orbiting_…_202608221336.mp4",
  repair: "movie/Astronaut_services_space_telescope_1080p_202608221337.mp4",
  comparison: "image/hubble-m100-before-after-nasa.png",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * HUBBLE_FPS));

export const getHubbleTimeline = (episode: Episode) => {
  const hookFrames = framesFor(episode.odaiDuration, 3.84);
  const minimums = [5.0, 3.35, 5.45, 7.45];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 6), Math.round(6 * HUBBLE_FPS));
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
  warmth?: number;
  dark?: number;
}> = ({src, startSeconds = 0, playbackRate = 1, position = "50% 50%", warmth = 0, dark = 0}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 210], [1.015, 1.055], {extrapolateRight: "clamp"});
  const brightness = 0.88 - dark * 0.18 + warmth * 0.12;
  const saturate = 0.84 + warmth * 0.32;
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#020711"}}>
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
          filter: `brightness(${brightness}) contrast(1.12) saturate(${saturate}) sepia(${warmth * 0.12})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,rgba(1,5,15,${0.48 + dark * 0.2}),rgba(0,0,0,.03) 48%,rgba(1,6,17,.62))`,
        }}
      />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 48,
      left: 42,
      padding: "11px 22px 14px",
      border: "4px solid #bcecff",
      borderRadius: 999,
      background: "rgba(4,20,48,.9)",
      color: "#fff",
      fontSize: 29,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: 1.5,
      boxShadow: "0 6px 0 #07142c,0 13px 30px #000a,inset 0 0 18px #1cbcff55",
    }}
  >
    天才たちの想定外
  </div>
);

const AiBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 52,
      right: 38,
      padding: "9px 15px 11px",
      border: "2px solid #fff8",
      borderRadius: 8,
      background: "rgba(0,0,0,.58)",
      color: "#fff",
      fontSize: 21,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: 1.3,
    }}
  >
    AI VISUALIZATION
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string; bottom?: number}> = ({
  children,
  accent = "#4bd6ff",
  bottom = 260,
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
        padding: "19px 25px 23px",
        borderTop: `8px solid ${accent}`,
        borderRadius: 18,
        background: "rgba(2,9,24,.9)",
        color: "#fff",
        fontSize: 44,
        lineHeight: 1.22,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 6px #000",
        boxShadow: "0 12px 35px #0008",
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
  const enter = spring({frame, fps, config: {damping: 9, stiffness: 155, mass: 0.72}});
  const pulse = 1 + Math.sin(frame * 0.12) * 0.012;
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.orbit} playbackRate={0.9} position="50% 50%" dark={0.28} />
      <AbsoluteFill style={{boxShadow: "inset 0 0 180px rgba(0,41,103,.52)"}} />
      <SeriesBadge />
      <AiBadge />
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 54,
          right: 54,
          textAlign: "center",
          transform: `scale(${interpolate(enter, [0, 1], [1.18, 1]) * pulse})`,
          opacity: enter,
        }}
      >
        <div style={{color: "#d8f5ff", fontSize: 71, lineHeight: 1, fontWeight: 900, letterSpacing: 1, textShadow: "0 7px 25px #000"}}>
          人類最高の目が
        </div>
        <div
          style={{
            marginTop: 25,
            color: "#fff",
            fontSize: 112,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -4,
            WebkitTextStroke: "7px #081634",
            paintOrder: "stroke fill",
            textShadow: "0 10px 0 #0a4171,0 23px 45px #000",
          }}
        >
          宇宙で
        </div>
        <div
          style={{
            marginTop: 12,
            color: "#ff4a65",
            fontSize: 151,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -8,
            WebkitTextStroke: "9px #fff",
            paintOrder: "stroke fill",
            textShadow: "0 11px 0 #74122a,0 28px 55px #000",
          }}
        >
          ピンボケ
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Grandeur: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 10, stiffness: 125, mass: 0.7}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.orbit} startSeconds={2.7} playbackRate={0.72} position="50% 48%" dark={0.05} />
      <SeriesBadge />
      <AiBadge />
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 50,
          right: 50,
          padding: "30px 24px 37px",
          border: "6px solid #bfeaff",
          borderRadius: 25,
          background: "linear-gradient(135deg,rgba(1,14,36,.91),rgba(7,51,91,.78))",
          boxShadow: "0 17px 0 #06152c,0 38px 80px #000a,inset 0 0 30px #49d5ff44",
          textAlign: "center",
          transform: `translateY(${interpolate(enter, [0, 1], [-55, 0])}px)`,
          opacity: enter,
        }}
      >
        <div style={{color: "#7ee5ff", fontSize: 62, lineHeight: 1, fontWeight: 900, letterSpacing: 5}}>1990年</div>
        <div style={{marginTop: 22, color: "#fff", fontSize: 55, lineHeight: 1.1, fontWeight: 900}}>世界の頭脳の結晶</div>
        <div style={{marginTop: 19, color: "#fff", fontSize: 70, lineHeight: 1.05, fontWeight: 900, textShadow: "0 5px 0 #144e78"}}>ハッブル宇宙望遠鏡</div>
      </div>
      <Caption>1990年。世界の頭脳の結晶、<br />ハッブル宇宙望遠鏡。</Caption>
    </AbsoluteFill>
  );
};

const OfficialImageBackground: React.FC<{side?: "left" | "full"}> = ({side = "full"}) => (
  <AbsoluteFill style={{overflow: "hidden", background: "radial-gradient(circle at 50% 35%,#123253,#010612 70%)"}}>
    <Img
      src={staticFile(assets.comparison)}
      style={
        side === "left"
          ? {
              position: "absolute",
              height: "100%",
              width: "auto",
              maxWidth: "none",
              left: 0,
              top: 0,
              transform: "translateX(-3%) scale(1.02)",
              filter: "brightness(.78) contrast(1.1)",
            }
          : {
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 50%",
              filter: "brightness(.72) contrast(1.08)",
            }
      }
    />
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(1,5,15,.62),transparent 35%,rgba(0,2,8,.74))"}} />
  </AbsoluteFill>
);

const SourceCredit: React.FC = () => (
  <div
    style={{
      position: "absolute",
      right: 24,
      bottom: 28,
      padding: "8px 12px 10px",
      borderRadius: 6,
      background: "rgba(0,0,0,.68)",
      color: "#fff",
      fontSize: 19,
      lineHeight: 1,
      fontWeight: 700,
    }}
  >
    Image: ESA/Hubble &amp; NASA
  </div>
);

const BlurFailure: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 7, stiffness: 240, mass: 0.55}});
  return (
    <AbsoluteFill>
      <OfficialImageBackground side="left" />
      <SeriesBadge />
      <div style={{position: "absolute", top: 150, left: 45, right: 45, textAlign: "center"}}>
        <div style={{display: "inline-block", padding: "9px 28px 13px", border: "5px solid #fff", borderRadius: 8, background: "#b21436", color: "#fff", fontSize: 48, lineHeight: 1, fontWeight: 900, letterSpacing: 7, boxShadow: "0 8px 0 #440817"}}>ところが</div>
        <div
          style={{
            marginTop: 32,
            color: "#fff",
            fontSize: 66,
            lineHeight: 1.1,
            fontWeight: 900,
            textShadow: "0 6px 18px #000",
            opacity: interpolate(frame, [0, 7], [0, 1], {extrapolateRight: "clamp"}),
          }}
        >
          届いた画像は
        </div>
        <div
          style={{
            marginTop: 20,
            color: "#ff5870",
            fontSize: 142,
            lineHeight: 1,
            fontWeight: 900,
            WebkitTextStroke: "8px #fff",
            paintOrder: "stroke fill",
            textShadow: "0 11px 0 #661125,0 25px 48px #000",
            transform: `scale(${interpolate(hit, [0, 1], [1.45, 1])})`,
          }}
        >
          ぼんやり
        </div>
      </div>
      <div style={{position: "absolute", left: 40, bottom: 220, padding: "11px 18px 14px", border: "3px solid #fff8", borderRadius: 10, background: "rgba(0,0,0,.65)", color: "#fff", fontSize: 27, lineHeight: 1, fontWeight: 900}}>NASA公式画像｜M100・修理前</div>
      <SourceCredit />
      <Caption accent="#ff5270" bottom={345}>ところが、届いた画像は、<br />ぼんやり</Caption>
    </AbsoluteFill>
  );
};

const MeasurementLines: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: "absolute", top: 590, left: 95, right: 95, height: 240}}>
    <div style={{position: "absolute", top: 105, left: 0, width: `${50 - 34 * progress}%`, height: 8, background: "#ff546f", boxShadow: "0 0 18px #ff546f"}} />
    <div style={{position: "absolute", top: 105, right: 0, width: `${50 - 34 * progress}%`, height: 8, background: "#4ee6ff", boxShadow: "0 0 18px #4ee6ff"}} />
    <div style={{position: "absolute", top: 74, left: `${49 - 17 * progress}%`, width: 7, height: 68, background: "#ff546f"}} />
    <div style={{position: "absolute", top: 74, right: `${49 - 17 * progress}%`, width: 7, height: 68, background: "#4ee6ff"}} />
  </div>
);

const TinyCause: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const impactAt = 23;
  const enter = spring({frame: Math.max(0, frame - impactAt), fps, config: {damping: 7, stiffness: 250, mass: 0.52}});
  const delta = frame - impactAt;
  const shake = delta >= 0 && delta < 12 ? Math.sin(delta * 3.9) * (14 - delta) : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${-shake * 0.45}px)`, background: "radial-gradient(circle at 50% 40%,#183e68,#030815 68%)"}}>
      <OfficialImageBackground side="left" />
      <AbsoluteFill style={{background: "rgba(0,5,19,.67)"}} />
      <SeriesBadge />
      <div style={{position: "absolute", top: 165, left: 45, right: 45, textAlign: "center"}}>
        <div style={{color: "#d8f5ff", fontSize: 45, lineHeight: 1.15, fontWeight: 900}}>鏡の形を狂わせたのは</div>
        <div style={{marginTop: 17, color: "#fff", fontSize: 66, lineHeight: 1.08, fontWeight: 900, textShadow: "0 6px 16px #000"}}>鏡の検査装置</div>
        <div style={{marginTop: 17, color: "#9ceaff", fontSize: 43, lineHeight: 1, fontWeight: 900}}>レンズ間隔のズレ</div>
      </div>
      <MeasurementLines progress={enter} />
      <div
        style={{
          position: "absolute",
          top: 690,
          left: 45,
          right: 45,
          textAlign: "center",
          transform: `scale(${interpolate(enter, [0, 1], [1.8, 1])})`,
          opacity: enter,
        }}
      >
        <div style={{color: "#ffcf45", fontSize: 201, lineHeight: .92, fontWeight: 900, letterSpacing: -10, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #7c4210,0 30px 55px #000"}}>1.3</div>
        <div style={{marginTop: 23, color: "#fff", fontSize: 90, lineHeight: 1, fontWeight: 900, letterSpacing: 10, textShadow: "0 7px 18px #000"}}>ミリ</div>
      </div>
      <Caption accent="#ffcf45" bottom={245}>原因は、鏡の検査装置。<br />レンズ間隔が、わずか1.3ミリ<br />ずれていました。</Caption>
    </AbsoluteFill>
  );
};

const ComparisonProof: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const local = Math.max(0, frame - start);
  const reveal = interpolate(local, [0, 22], [0, 1], {extrapolateRight: "clamp"});
  const {fps} = useVideoConfig();
  const pop = spring({frame: local, fps, config: {damping: 8, stiffness: 190, mass: 0.6}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 30%,#155185,#010716 70%)", opacity: reveal}}>
      <SeriesBadge />
      <div style={{position: "absolute", top: 155, left: 42, right: 42, textAlign: "center"}}>
        <div style={{color: "#a6ecff", fontSize: 38, lineHeight: 1, fontWeight: 900, letterSpacing: 2}}>NASA公式画像｜同じ銀河 M100</div>
        <div style={{marginTop: 21, display: "flex", justifyContent: "space-between", color: "#fff", fontSize: 43, lineHeight: 1, fontWeight: 900}}>
          <span style={{padding: "10px 25px 14px", borderRadius: 999, background: "#a92342"}}>修理前</span>
          <span style={{padding: "10px 25px 14px", borderRadius: 999, background: "#1388a8"}}>修理後</span>
        </div>
      </div>
      <div style={{position: "absolute", top: 350, left: 22, right: 22, height: 520, overflow: "hidden", border: "7px solid #fff", borderRadius: 24, boxShadow: "0 24px 60px #000b"}}>
        <Img src={staticFile(assets.comparison)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        <div style={{position: "absolute", top: 0, bottom: 0, left: "50%", width: 7, background: "#fff", boxShadow: "0 0 16px #fff"}} />
      </div>
      <div style={{position: "absolute", top: 940, left: 40, right: 40, textAlign: "center", transform: `scale(${interpolate(pop, [0, 1], [1.25, 1])})`}}>
        <div style={{color: "#fff", fontSize: 57, lineHeight: 1, fontWeight: 900}}>ハッブルの視力</div>
        <div style={{marginTop: 20, color: "#58e4ff", fontSize: 129, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #0e5b7b,0 24px 42px #000"}}>回復</div>
      </div>
      <div style={{position: "absolute", left: 50, bottom: 198, right: 50, padding: "18px 20px 22px", borderTop: "7px solid #55e5ff", borderRadius: 16, background: "rgba(1,9,25,.92)", color: "#fff", textAlign: "center", fontSize: 43, lineHeight: 1.16, fontWeight: 900}}>いわば、宇宙のメガネです。</div>
      <SourceCredit />
    </AbsoluteFill>
  );
};

const RepairAndRecovery: React.FC = () => {
  const frame = useCurrentFrame();
  const proofStart = 132;
  const warmth = interpolate(frame, [0, 120], [0, 1], {extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [proofStart - 14, proofStart + 7], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: fadeOut}}>
        <VideoLayer src={assets.repair} playbackRate={0.86} position="50% 50%" warmth={warmth} dark={0.05} />
        <AbsoluteFill style={{background: `rgba(255,164,65,${warmth * .06})`}} />
        <SeriesBadge />
        <AiBadge />
        <div style={{position: "absolute", top: 165, left: 45, right: 45, padding: "28px 26px 34px", border: "6px solid #bcecff", borderRadius: 25, background: "rgba(2,16,42,.88)", boxShadow: "0 15px 0 #07172e,0 35px 70px #0009", textAlign: "center"}}>
          <div style={{color: "#69e4ff", fontSize: 65, lineHeight: 1, fontWeight: 900}}>1993年</div>
          <div style={{marginTop: 20, color: "#fff", fontSize: 58, lineHeight: 1.08, fontWeight: 900}}>宇宙で補正光学装置を装着</div>
        </div>
        <Caption>1993年、宇宙で補正光学装置を装着。</Caption>
      </AbsoluteFill>
      {frame >= proofStart - 15 ? <ComparisonProof frame={frame} start={proofStart} /> : null}
    </AbsoluteFill>
  );
};

const GlassesMark: React.FC<{scale?: number}> = ({scale = 1}) => (
  <div style={{position: "relative", width: 360, height: 150, transform: `scale(${scale})`}}>
    <div style={{position: "absolute", left: 10, top: 25, width: 125, height: 100, border: "17px solid #7ce8ff", borderRadius: "50%", boxShadow: "0 0 24px #44ceff"}} />
    <div style={{position: "absolute", right: 10, top: 25, width: 125, height: 100, border: "17px solid #7ce8ff", borderRadius: "50%", boxShadow: "0 0 24px #44ceff"}} />
    <div style={{position: "absolute", left: 145, top: 61, width: 70, height: 17, borderRadius: 999, background: "#7ce8ff", boxShadow: "0 0 18px #44ceff"}} />
  </div>
);

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 200, mass: 0.58}});
  const shimmer = 0.55 + Math.sin(frame * 0.18) * 0.2;
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "radial-gradient(circle at 50% 14%,#215f91,#07152f 45%,#01040d 100%)"}}>
      {Array.from({length: 38}, (_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${3 + (index * 29) % 94}%`,
            top: `${2 + (index * 41) % 94}%`,
            width: 3 + (index % 4) * 2,
            height: 3 + (index % 4) * 2,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 11px #7ce8ff",
            opacity: 0.38 + (index % 3) * .18,
          }}
        />
      ))}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 34%,rgba(94,218,255,${shimmer * .18}),transparent 44%)`}} />
      <div
        style={{
          position: "absolute",
          top: 95,
          bottom: 116,
          left: 43,
          right: 43,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 30px 61px",
          border: "9px solid #a7edff",
          borderRadius: 40,
          background: "rgba(3,13,35,.9)",
          boxShadow: "0 18px 0 #071024,0 42px 90px #000b,inset 0 0 70px #3cc9ff22",
          textAlign: "center",
          transform: `scale(${interpolate(enter, [0, 1], [1.22, 1])})`,
        }}
      >
        <GlassesMark scale={interpolate(enter, [0, 1], [.6, 1])} />
        <div style={{marginTop: 18, color: "#d9f7ff", fontSize: 64, lineHeight: 1, fontWeight: 900}}>宇宙でメガネ</div>
        <div style={{marginTop: 21, color: "#ffcc4b", fontSize: 101, lineHeight: 1.02, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 8px 0 #875514,0 22px 40px #000"}}>かけるんかい！</div>
        <div style={{width: "82%", margin: "42px 0 31px", borderTop: "7px dashed #74ddfa"}} />
        <div style={{color: "#fff", fontSize: 54, lineHeight: 1.1, fontWeight: 900}}>でも直すのも</div>
        <div style={{marginTop: 13, color: "#74e8ff", fontSize: 94, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #155573"}}>天才</div>
        <div style={{marginTop: 48, color: "#fff", fontSize: 62, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 23, padding: "17px 60px 24px", border: "7px solid #fff", borderRadius: 999, background: "#168fba", color: "#fff", fontSize: 106, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #07516d", boxShadow: "0 10px 0 #062b49"}}>よろしく</div>
        <div style={{marginTop: 52, color: "#b8edff", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
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

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getHubbleTimeline>}> = ({episode, timeline}) => {
  const blurFrom = timeline.answerStarts[1];
  const causeFrom = timeline.answerStarts[2];
  const repairFrom = timeline.answerStarts[3];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Space Eyeglasses.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
        const blurDuck = interpolate(frame, [blurFrom - 6, blurFrom + 2, blurFrom + 48, blurFrom + 77], [1, .08, .08, .52], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const causeRise = interpolate(frame, [causeFrom, causeFrom + 45, repairFrom + 18], [.62, .78, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 27, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .095 * fadeIn * blurDuck * causeRise * fadeOut;
      }}
    />
  );
};

export const HubbleShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getHubbleTimeline(episode);
  const scenes = [<Grandeur key="grandeur" />, <BlurFailure key="failure" />, <TinyCause key="cause" />, <RepairAndRecovery key="recovery" />];
  const effects = ["Effect/シャキーン1.mp3", "Effect/チーン1.mp3", undefined, undefined];
  return (
    <AbsoluteFill style={{backgroundColor: "#020611", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 1 ? .18 : .2} />
        </Sequence>
      ))}
      <Sequence from={timeline.answerStarts[2] + 23} durationInFrames={82}>
        <Audio src={staticFile("Effect/ショック2.mp3")} volume={(frame) => .63 * interpolate(frame, [0, 8, 42, 81], [1, 1, .32, 0], {extrapolateRight: "clamp"})} />
      </Sequence>
      <Sequence from={timeline.answerStarts[3] + 132} durationInFrames={50}>
        <Audio src={staticFile("Effect/シャキーン2.mp3")} volume={.3} />
      </Sequence>
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.38} />
      </Sequence>
    </AbsoluteFill>
  );
};
