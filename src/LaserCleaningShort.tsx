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

export const LASER_CLEANING_FPS = 30;
export const LASER_CLEANING_WIDTH = 1080;
export const LASER_CLEANING_HEIGHT = 1920;

const assets = {
  plate: "movie/Laser_cleaning_steel_plate_1080p_202608290045.mp4",
  pipe: "movie/Robot_cleaning_steel_pipe_1080p_202608290047.mp4",
};

// Cut1 (plate) source facts, from asset QC: 8.000s total, ~50/50 split around 4.2s,
// main surface fully clean by ~6.5-7.3s, final hold to 8.0s.
const CUT1_DURATION = 8.0;
const CUT1_SPLIT = 4.2;
// Cut2 (pipe) source facts: 0-4.7s = cleaning motion, 6.0-8.0s = pullback application shot.
const CUT2_CLEAN_END = 4.7;
const CUT2_PULLBACK_START = 6.0;
const CUT2_DURATION = 8.0;

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * LASER_CLEANING_FPS));

export const getLaserCleaningTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.6), framesFor(2.2, 2.2));
  const minimums = [3.9, 2.9, 2.8, 6.4, 4.0, 5.1];
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
  startSeconds: number;
  playbackRate?: number;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
}> = ({src, startSeconds, playbackRate = 1, dark = 0, scaleFrom = 1.0, scaleTo = 1.03}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#04070a"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * LASER_CLEANING_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 54%",
          transform: `scale(${scale})`,
          filter: `brightness(${1 - dark * 0.42}) contrast(1.1) saturate(0.94)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,rgba(2,6,10,${0.62 + dark * 0.15}) 0%,rgba(2,6,10,0.08) 30%,transparent 55%,rgba(1,4,7,${0.3 + dark * 0.3}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 44,
      left: 36,
      padding: "11px 20px 14px",
      border: "3px solid #fff",
      borderRadius: 999,
      background: "rgba(4,10,14,.82)",
      color: "#fff",
      fontSize: 26,
      lineHeight: 1,
      fontWeight: 900,
      boxShadow: "0 8px 20px #0009",
    }}
  >
    世界のバズ、AIで再現
  </div>
);

const AiBadge: React.FC<{label?: string}> = ({label = "AI再現映像"}) => (
  <div
    style={{
      position: "absolute",
      top: 48,
      right: 34,
      padding: "9px 14px 11px",
      border: "2px solid #fff9",
      borderRadius: 8,
      background: "rgba(0,0,0,.68)",
      color: "#fff",
      fontSize: 20,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: 0.5,
      textAlign: "right",
    }}
  >
    {label}
  </div>
);

const Citation: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: "absolute",
      left: 34,
      bottom: 150,
      padding: "8px 13px 10px",
      borderRadius: 7,
      background: "rgba(0,0,0,.72)",
      color: "#fff",
      fontSize: 21,
      lineHeight: 1.15,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

// Match the established viral-science Shorts layout. Keep the series badges in
// the top UI band, then start the main headline below the phone camera / Shorts
// chrome. Large outlined type stays readable without hiding the footage behind
// a full-width card.
const TopCaption: React.FC<{
  children: React.ReactNode;
  accent?: string;
  delayFrames?: number;
  kicker?: React.ReactNode;
}> = ({
  children,
  accent = "#fff16a",
  delayFrames = 0,
  kicker,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delayFrames, delayFrames + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 30,
        right: 30,
        textAlign: "center",
        opacity,
      }}
    >
      {kicker ? (
        <div
          style={{
            color: "#fff",
            fontSize: 58,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 0,
            WebkitTextStroke: "7px #050505",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 #242b34,0 22px 38px #000",
            marginBottom: 25,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          color: accent,
          fontSize: 118,
          lineHeight: 0.94,
          fontWeight: 900,
          letterSpacing: -5,
          WebkitTextStroke: "9px #fff",
          paintOrder: "stroke fill",
          textShadow: "0 12px 0 #756900,0 28px 50px #000",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const BottomDialogue: React.FC<{
  children: React.ReactNode;
  accent?: string;
  delayFrames?: number;
}> = ({children, accent = "#ffe95a", delayFrames = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delayFrames,
    fps,
    config: {damping: 10, stiffness: 190, mass: 0.62},
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 245,
        width: 920,
        boxSizing: "border-box",
        transform: `translateX(-50%) translateY(${interpolate(enter, [0, 1], [28, 0])}px)`,
        padding: "18px 24px 23px",
        borderTop: `8px solid ${accent}`,
        borderRadius: 18,
        background: "rgba(3,7,10,.91)",
        color: "#fff",
        fontSize: 47,
        lineHeight: 1.21,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 6px #000",
        boxShadow: "0 13px 35px #0009",
        opacity: enter,
      }}
    >
      {children}
    </div>
  );
};

// A short translucent sweep synced to each laser-scan tick. The source clip
// already carries a real scan line; this only lightly reinforces it.
const SweepAt: React.FC<{atFrame: number; lifeFrames?: number}> = ({atFrame, lifeFrames = 10}) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;
  if (local < 0 || local > lifeFrames) return null;
  const x = interpolate(local, [0, lifeFrames], [-8, 108]);
  const fade = interpolate(local, [0, lifeFrames * 0.3, lifeFrames], [0, 1, 0]);
  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: "32%",
          bottom: "10%",
          width: 22,
          opacity: fade,
          background: "linear-gradient(90deg,transparent,#bdeeffcc,transparent)",
          mixBlendMode: "screen",
          filter: "blur(2px)",
        }}
      />
    </AbsoluteFill>
  );
};

const Shimmer: React.FC<{atFrame: number}> = ({atFrame}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [atFrame - 2, atFrame + 2, atFrame + 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (s <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%,rgba(255,255,255,${s * 0.5}),transparent 62%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const ScanAudio: React.FC<{ticks: number[]}> = ({ticks}) => (
  <>
    {ticks.map((t) => (
      <React.Fragment key={t}>
        <Sequence from={t} durationInFrames={10}>
          <Audio src={staticFile("Effect/レーザー走査音.mp3")} volume={0.5} />
        </Sequence>
        <SweepAt atFrame={t} />
      </React.Fragment>
    ))}
    <Audio src={staticFile("Effect/吸引音.mp3")} volume={0.14} loop />
  </>
);

const Hook: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.plate} startSeconds={0} playbackRate={1} />
    <SeriesBadge />
    <AiBadge label="AI再現映像" />
    <TopCaption kicker="レーザーを当てると—" delayFrames={15}>
      サビだけが
      <br />
      消えていく
    </TopCaption>
    <ScanAudio ticks={[6, 24, 42]} />
  </AbsoluteFill>
);

const A1PeakClean: React.FC<{startSeconds: number}> = ({startSeconds}) => {
  // The 50/50 split lands ~CUT1_SPLIT seconds into the source clip.
  const shimmerFrame = Math.round((CUT1_SPLIT - startSeconds) * LASER_CLEANING_FPS);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.plate} startSeconds={startSeconds} playbackRate={1} />
      <SeriesBadge />
      <AiBadge label="AI再現映像" />
      {shimmerFrame > 0 ? (
        <>
          <Shimmer atFrame={shimmerFrame} />
          <Sequence from={Math.max(0, shimmerFrame - 2)} durationInFrames={12}>
            <Audio src={staticFile("Effect/金属タイトル表示2.mp3")} volume={0.22} />
          </Sequence>
        </>
      ) : null}
      <TopCaption kicker="レーザーを当てると—" delayFrames={-6}>
        サビだけが
        <br />
        消えていく
      </TopCaption>
      <BottomDialogue delayFrames={4}>気持ちよすぎる！</BottomDialogue>
      <ScanAudio ticks={[10, 30, 50, 70]} />
    </AbsoluteFill>
  );
};

const A2NameReveal: React.FC<{startSeconds: number; playbackRate: number}> = ({
  startSeconds,
  playbackRate,
}) => {
  // The clean-plate final hold (~7.0s of source) sits inside this scene.
  const resolveFrame = Math.round(((7.0 - startSeconds) / playbackRate) * LASER_CLEANING_FPS);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.plate} startSeconds={startSeconds} playbackRate={playbackRate} />
      <SeriesBadge />
      <AiBadge label="AI再現映像" />
      {resolveFrame > 0 ? (
        <>
          <Shimmer atFrame={resolveFrame} />
          <Sequence from={Math.max(0, resolveFrame - 2)} durationInFrames={14}>
            <Audio src={staticFile("Effect/金属タイトル表示2.mp3")} volume={0.4} />
          </Sequence>
        </>
      ) : null}
      <TopCaption kicker="この装置の名前は—">レーザー洗浄機</TopCaption>
    </AbsoluteFill>
  );
};

const A3Compare: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.plate} startSeconds={CUT1_SPLIT} playbackRate={0.02} dark={0.12} />
    <SeriesBadge />
    <AiBadge label="AI再現映像" />
    <TopCaption kicker="サビは消えた。でも—">鉄は残る</TopCaption>
    <BottomDialogue delayFrames={7}>
      鉄まで
      <br />
      削れないの？
    </BottomDialogue>
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 150,
        textAlign: "center",
        color: "#fff",
        fontSize: 30,
        fontWeight: 700,
        background: "rgba(0,0,0,.5)",
        borderRadius: 12,
        padding: "10px 14px",
      }}
    >
      サビ面と清掃面がちょうど半分ずつ
    </div>
  </AbsoluteFill>
);

const ThresholdBar: React.FC<{
  top: number;
  label: string;
  color: string;
  fillPct: number;
  note: string;
  delay: number;
}> = ({top, label, color, fillPct, note, delay}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [delay, delay + 40], [0, fillPct], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{position: "absolute", left: 70, right: 70, top}}>
      <div style={{color: "#fff", fontSize: 40, fontWeight: 900, marginBottom: 10}}>{label}</div>
      <div
        style={{
          width: "100%",
          height: 62,
          borderRadius: 14,
          border: "4px solid #fff",
          background: "rgba(255,255,255,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fill}%`,
            height: "100%",
            background: `linear-gradient(90deg,${color}aa,${color})`,
            boxShadow: `0 0 22px ${color}88`,
          }}
        />
      </div>
      <div style={{marginTop: 8, color: "#dfe8ee", fontSize: 26, fontWeight: 700}}>{note}</div>
    </div>
  );
};

const A4Threshold: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#070b0f"}}>
    <VideoLayer src={assets.plate} startSeconds={7.8} playbackRate={0.02} dark={0.62} scaleFrom={1.05} scaleTo={1.08} />
    <AbsoluteFill style={{background: "rgba(3,7,10,.5)"}} />
    <SeriesBadge />
    <AiBadge label="AI再現映像" />
    <TopCaption kicker="その理由は—">サビと鉄では</TopCaption>
    <ThresholdBar
      top={640}
      label="サビ（表面層）"
      color="#ff9a4d"
      fillPct={38}
      note="弱いレーザーでも除去が始まる"
      delay={6}
    />
    <ThresholdBar
      top={840}
      label="鉄（下地）"
      color="#7bd0ff"
      fillPct={82}
      note="除去にはずっと強いレーザーが必要"
      delay={18}
    />
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 1050,
        padding: "7px 12px 9px",
        borderRadius: 7,
        background: "rgba(255,255,255,.14)",
        color: "#cfe3ee",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      専門用語: アブレーション閾値（除去が始まるエネルギーの境目）
    </div>
    <BottomDialogue delayFrames={54}>
      除去が始まる
      <br />
      強さが違う
    </BottomDialogue>
    <Citation>出典: IPG Photonics</Citation>
  </AbsoluteFill>
);

const PulseDots: React.FC<{count: number; active: number}> = ({count, active}) => (
  <div style={{display: "flex", gap: 14, justifyContent: "center"}}>
    {Array.from({length: count}, (_, i) => (
      <div
        key={i}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: i < active ? "#7bd0ff" : "rgba(255,255,255,.18)",
          boxShadow: i < active ? "0 0 14px #7bd0ffaa" : "none",
        }}
      />
    ))}
  </div>
);

const A5Adjust: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(6, Math.floor(frame / 8));
  return (
    <AbsoluteFill style={{backgroundColor: "#070b0f"}}>
      <VideoLayer src={assets.plate} startSeconds={7.5} playbackRate={0.02} dark={0.62} scaleFrom={1.05} scaleTo={1.08} />
      <AbsoluteFill style={{background: "rgba(3,7,10,.5)"}} />
      <SeriesBadge />
      <AiBadge label="AI再現映像" />
      <TopCaption kicker="レーザーの強さを—">出力を調整</TopCaption>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 700,
          padding: "26px 20px 30px",
          border: "5px solid #fff",
          borderRadius: 22,
          background: "rgba(4,10,14,.75)",
          textAlign: "center",
        }}
      >
        <div style={{color: "#fff", fontSize: 30, fontWeight: 900, marginBottom: 16}}>
          パルス照射（出力・走査幅を絞る）
        </div>
        <PulseDots count={6} active={active} />
        <div style={{marginTop: 22, color: "#dfe8ee", fontSize: 26, fontWeight: 700, lineHeight: 1.5}}>
          波長・出力・走査範囲を合わせ、
          <br />
          表面のサビだけを狙って除去します。
        </div>
      </div>
      <BottomDialogue delayFrames={18}>サビだけ狙うんだ！</BottomDialogue>
    </AbsoluteFill>
  );
};

const A6Application: React.FC<{durationSeconds: number}> = ({durationSeconds}) => {
  const rate = CUT2_CLEAN_END / durationSeconds;
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.pipe} startSeconds={0} playbackRate={rate} dark={0.1} />
      <SeriesBadge />
      <AiBadge label="AIによる応用イメージ" />
      <TopCaption kicker="使い道は—">航空機部品から</TopCaption>
      <BottomDialogue delayFrames={34}>
        放射性物質の
        <br />
        除染まで
      </BottomDialogue>
      <Citation>出典: IPG Photonics（航空機部品の洗浄・除染用途）</Citation>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{durationSeconds: number}> = ({durationSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 205, mass: 0.58}});
  const rate = (CUT2_DURATION - CUT2_PULLBACK_START) / durationSeconds;
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#070b0f"}}>
      <VideoLayer src={assets.pipe} startSeconds={CUT2_PULLBACK_START} playbackRate={rate} dark={0.5} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.72))"}} />
      <AiBadge label="AIによる応用イメージ" />
      <div
        style={{
          position: "absolute",
          top: 96,
          bottom: 108,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "46px 26px 57px",
          border: "10px solid #fff",
          borderRadius: 42,
          background: "rgba(9,12,15,.76)",
          textAlign: "center",
          boxShadow: "0 18px 0 #050608,0 43px 90px #000b,inset 0 0 65px #fff23525",
          transform: `scale(${interpolate(enter, [0, 1], [1.27, 1])})`,
        }}
      >
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#20262d", fontSize: 41, lineHeight: 1, fontWeight: 900}}>レーザー洗浄機</div>
        <div style={{marginTop: 42, color: "#fff", fontSize: 70, lineHeight: 1, fontWeight: 900}}>サビ取りから、</div>
        <div
          style={{
            marginTop: 17,
            color: "#fff15a",
            fontSize: 105,
            lineHeight: 0.94,
            fontWeight: 900,
            letterSpacing: -6,
            WebkitTextStroke: "8px #fff",
            paintOrder: "stroke fill",
            textShadow: "0 11px 0 #756400,0 28px 50px #000",
          }}
        >
          除染まで
          <br />
          行くんかい！
        </div>
        <div style={{width: "82%", margin: "45px 0 34px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 61, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div
          style={{
            marginTop: 24,
            padding: "17px 61px 24px",
            border: "7px solid #fff",
            borderRadius: 999,
            background: "#e7c81f",
            color: "#13171b",
            fontSize: 106,
            lineHeight: 1,
            fontWeight: 900,
            boxShadow: "0 11px 0 #6f6000",
          }}
        >
          よろしく
        </div>
        <div style={{marginTop: 52, color: "#e9eef3", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const Narration: React.FC<{path?: string}> = ({path}) =>
  path ? <Audio src={staticFile(path)} volume={1} /> : null;

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getLaserCleaningTimeline>}> = ({
  episode,
  timeline,
}) => {
  const nameFrom = timeline.answerStarts[1];
  const questionEnd = timeline.answerStarts[2] + timeline.answerFrames[2];
  const outroFrom = timeline.outroFrom;
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Cleanline Scan.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"});
        // Half-beat thinning while the machine name is revealed and the
        // "why doesn't the iron erode" question lands.
        const nameDip = interpolate(
          frame,
          [nameFrom - 4, nameFrom + 4, questionEnd - 6, questionEnd + 6],
          [1, 0.42, 0.42, 1],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        );
        const outroLift = interpolate(frame, [outroFrom, outroFrom + 16], [0.85, 1.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(
          frame,
          [timeline.totalFrames - 20, timeline.totalFrames],
          [1, 0],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        );
        return 0.13 * fadeIn * nameDip * outroLift * fadeOut;
      }}
    />
  );
};

export const LaserCleaningShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getLaserCleaningTimeline(episode);
  const fps = LASER_CLEANING_FPS;
  const hookSeconds = timeline.hookFrames / fps;
  const a1Seconds = timeline.answerFrames[0] / fps;
  const a2StartSeconds = hookSeconds + a1Seconds;
  const a2Seconds = timeline.answerFrames[1] / fps;
  const a2PlaybackRate = Math.max(0.05, (CUT1_DURATION - a2StartSeconds) / a2Seconds);
  const a6Seconds = timeline.answerFrames[5] / fps;
  const outroSeconds = timeline.outroFrames / fps;

  const scenes = [
    <A1PeakClean key="a1" startSeconds={hookSeconds} />,
    <A2NameReveal key="a2" startSeconds={a2StartSeconds} playbackRate={a2PlaybackRate} />,
    <A3Compare key="a3" />,
    <A4Threshold key="a4" />,
    <A5Adjust key="a5" />,
    <A6Application key="a6" durationSeconds={a6Seconds} />,
  ];

  return (
    <AbsoluteFill style={{backgroundColor: "#04070a", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <Narration path={episode.odaiAudioFile} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <Narration path={answer.audioFile} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro durationSeconds={outroSeconds} />
        <Narration path={episode.outroAudioFile} />
        <Audio src={staticFile("Effect/ビシッとツッコミ1.mp3")} volume={0.34} />
      </Sequence>
    </AbsoluteFill>
  );
};
