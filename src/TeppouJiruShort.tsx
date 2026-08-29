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

export const TEPPOU_JIRU_FPS = 30;
export const TEPPOU_JIRU_WIDTH = 1080;
export const TEPPOU_JIRU_HEIGHT = 1920;

const SOURCE_FPS = 24;
const IMPACT_FRAME = 90;
const IMPACT_EFFECT_FRAMES = 78;
const BGM_SOURCE_SECONDS = 5;

const clips = {
  tension: "movie/Crab_legs_entering_boiling_broth_202608221045.mp4",
  relief: "movie/Filming_Japanese_seafood_commercial_1080p_202608221049.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * TEPPOU_JIRU_FPS));

export const getTeppouJiruTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 3.75), 112);
  const minimums = [5.3, 5.4, 5.05, 4.0];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.7), Math.round(4.7 * TEPPOU_JIRU_FPS));
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const BaseVideo: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  zoom?: number;
  position?: string;
  tone?: "tension" | "warm" | "bright";
}> = ({src, startSeconds = 0, playbackRate = 1, zoom = 1.03, position = "50% 50%", tone = "warm"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.035], {extrapolateRight: "clamp"});
  const filter =
    tone === "tension"
      ? "brightness(.64) contrast(1.34) saturate(.62) sepia(.12) hue-rotate(330deg)"
      : tone === "bright"
        ? "brightness(1.07) contrast(1.03) saturate(1.15) sepia(.08)"
        : "brightness(.98) contrast(1.08) saturate(1.1)";
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: tone === "tension" ? "#030405" : "#4b260e"}}>
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
          filter,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            tone === "tension"
              ? "linear-gradient(180deg,rgba(0,0,0,.78),rgba(27,0,0,.1) 48%,rgba(0,0,0,.65))"
              : "linear-gradient(180deg,rgba(64,25,1,.3),transparent 40%,rgba(65,28,2,.46))",
        }}
      />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <div
    style={{
      position: "absolute",
      top: 50,
      left: 42,
      padding: "11px 22px 14px",
      border: "5px solid #fff",
      borderRadius: 999,
      background: dark ? "#76000b" : "#e26425",
      color: "#fff",
      fontSize: 29,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: 1.5,
      boxShadow: "0 7px 0 #2e0805,0 15px 32px #0008",
    }}
  >
    緊張と緩和グルメ
  </div>
);

const NarrationCaption: React.FC<{
  children: React.ReactNode;
  accent?: string;
  dark?: boolean;
  compact?: boolean;
}> = ({children, accent = "#f2bd4a", dark = false, compact = false}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: compact ? 255 : 280,
        width: 920,
        boxSizing: "border-box",
        transform: "translateX(-50%)",
        padding: compact ? "18px 25px 22px" : "20px 28px 24px",
        borderTop: `9px solid ${accent}`,
        borderRadius: 18,
        background: dark ? "rgba(1,2,5,.92)" : "rgba(45,20,4,.89)",
        color: "#fff",
        fontSize: compact ? 43 : 47,
        lineHeight: compact ? 1.2 : 1.25,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 5px #000",
        opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"}),
      }}
    >
      {children}
    </div>
  );
};

const InfoCard: React.FC<{children: React.ReactNode; accent?: string; top?: number; soft?: boolean}> = ({
  children,
  accent = "#efb23e",
  top = 150,
  soft = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: soft ? 11 : 8, stiffness: soft ? 150 : 220, mass: 0.58}});
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 48,
        right: 48,
        transform: `translateY(${interpolate(enter, [0, 1], [-55, 0])}px) scale(${interpolate(enter, [0, 1], [1.08, 1])})`,
        padding: "27px 28px 34px",
        border: "9px solid #291308",
        borderRadius: 30,
        background: soft ? "rgba(255,251,226,.96)" : "rgba(255,246,205,.97)",
        boxShadow: `0 15px 0 #291308,inset 0 0 0 6px ${accent},0 32px 72px #0009`,
        color: "#291308",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

const ImpactBurst: React.FC<{progress: number}> = ({progress}) => (
  <AbsoluteFill style={{pointerEvents: "none"}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 61%,rgba(255,248,195,${0.92 * (1 - progress)}) 0%,rgba(255,49,0,${0.68 * (1 - progress)}) 20%,rgba(76,0,0,${0.42 * (1 - progress)}) 48%,transparent 72%)`,
        mixBlendMode: "screen",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "61%",
        width: 430,
        height: 430,
        borderRadius: "50%",
        border: `30px solid rgba(255,62,0,${1 - progress})`,
        transform: `translate(-50%,-50%) scale(${0.16 + progress * 3.1})`,
        boxShadow: "0 0 55px #ff3d00",
      }}
    />
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delta = frame - IMPACT_FRAME;
  const impact = interpolate(delta, [0, 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shake = delta >= 0 && delta < 14 ? Math.sin(delta * 3.7) * (17 - delta * 1.1) : 0;
  const hitScale = delta >= 0 && delta < 14 ? interpolate(delta, [0, 2, 13], [1, 1.075, 1.01]) : 1;
  const titleEnter = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 7, stiffness: 235, mass: 0.55}});
  const titleExit = interpolate(delta, [-4, 1, 8], [1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const soupEnter = spring({frame: Math.max(0, delta), fps, config: {damping: 6, stiffness: 260, mass: 0.48}});
  const soupOpacity = delta >= 0 ? interpolate(delta, [0, 2, 20], [0, 1, 0], {extrapolateRight: "clamp"}) : 0;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform: `translate(${shake}px,${-shake * 0.52}px) scale(${hitScale})`,
        filter: delta >= 0 && delta < 10 ? `contrast(${1.18 + (1 - impact) * 0.45}) saturate(${1 + (1 - impact) * 1.45})` : undefined,
      }}
    >
      <BaseVideo src={clips.tension} tone="tension" zoom={1.025} position="50% 50%" />
      <AbsoluteFill style={{boxShadow: "inset 0 0 185px rgba(142,0,0,.58)"}} />
      <SeriesBadge dark />
      {delta < 8 ? (
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 54,
            right: 54,
            textAlign: "center",
            transform: `scale(${interpolate(titleEnter, [0, 1], [1.22, 1]) * titleExit})`,
            opacity: delta > 4 ? interpolate(delta, [4, 8], [1, 0]) : 1,
          }}
        >
          <div style={{display: "inline-block", padding: "10px 30px 15px", border: "6px solid #ffddd6", background: "#a30010", color: "#fff", fontSize: 46, lineHeight: 1, fontWeight: 900, letterSpacing: 9, boxShadow: "0 8px 0 #250000"}}>
            警告
          </div>
          <div style={{marginTop: 26, color: "#fff", fontSize: 75, lineHeight: 1, fontWeight: 900, textShadow: "0 8px 20px #000"}}>このカニ、</div>
          <div style={{marginTop: 19, color: "#f51d28", fontSize: 157, lineHeight: 0.94, fontWeight: 900, letterSpacing: -9, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #430006,0 25px 45px #000"}}>
            鉄砲に
          </div>
          <div style={{marginTop: 25, color: "#fff", fontSize: 94, lineHeight: 1, fontWeight: 900, textShadow: "0 8px 20px #000"}}>します</div>
        </div>
      ) : null}
      {delta >= 0 && delta < 23 ? (
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 70,
            right: 70,
            textAlign: "center",
            opacity: soupOpacity,
            transform: `scale(${interpolate(soupEnter, [0, 1], [2.15, 1])}) rotate(${interpolate(soupEnter, [0, 1], [-8, 0])}deg)`,
          }}
        >
          <div style={{color: "#ffd14f", fontSize: 245, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "12px #4b1505", paintOrder: "stroke fill", textShadow: "0 15px 0 #7e1d05,0 28px 55px #000"}}>
            汁！
          </div>
        </div>
      ) : null}
      {delta >= 0 && delta <= 14 ? <ImpactBurst progress={impact} /> : null}
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BaseVideo src={clips.relief} startSeconds={0} playbackRate={0.86} tone="bright" zoom={1.02} position="50% 52%" />
      <AbsoluteFill style={{background: "#fff8c7", opacity: interpolate(frame, [0, 3, 10], [0.8, 0.28, 0], {extrapolateRight: "clamp"})}} />
      <SeriesBadge />
      <InfoCard accent="#ffbd49" soft>
        <div style={{fontSize: 48, fontWeight: 900}}>正体は</div>
        <div style={{marginTop: 11, color: "#b75a24", fontSize: 68, lineHeight: 1, fontWeight: 900}}>北海道・根室</div>
        <div style={{marginTop: 18, color: "#ec5c20", fontSize: 112, lineHeight: 0.94, fontWeight: 900, textShadow: "0 7px 0 #6c270e"}}>てっぽう汁</div>
      </InfoCard>
      <NarrationCaption accent="#ffbd49">……汁です。正体は、北海道・根室の<br />郷土料理「てっぽう汁」。</NarrationCaption>
    </AbsoluteFill>
  );
};

const Origin: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.relief} startSeconds={3.85} playbackRate={0.72} tone="warm" zoom={1.035} position="50% 53%" />
    <SeriesBadge />
    <InfoCard accent="#ec7b2e" top={142}>
      <div style={{fontSize: 47, fontWeight: 900}}>名前の由来</div>
      <div style={{marginTop: 16, color: "#d94b20", fontSize: 72, lineHeight: 1.05, fontWeight: 900}}>カニ脚をつつく姿が</div>
      <div style={{marginTop: 17, color: "#8f3015", fontSize: 72, lineHeight: 1.04, fontWeight: 900}}>鉄砲の弾込めみたい</div>
    </InfoCard>
    <NarrationCaption accent="#ec7b2e" compact>カニの脚を箸でつつく姿が、<br />鉄砲の弾込めに似ていることが、<br />名前の由来。</NarrationCaption>
  </AbsoluteFill>
);

const Appetite: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.relief} startSeconds={0.45} playbackRate={0.76} tone="bright" zoom={1.03} position="50% 52%" />
    <SeriesBadge />
    <InfoCard accent="#e9b951" soft top={142}>
      <div style={{fontSize: 48, fontWeight: 900}}>カニのうま味を</div>
      <div style={{marginTop: 16, color: "#bb5421", fontSize: 77, lineHeight: 1, fontWeight: 900}}>味噌で熱々に</div>
      <div style={{marginTop: 22, display: "flex", justifyContent: "center", gap: 14, fontSize: 48, fontWeight: 900}}>
        <span style={{padding: "12px 21px 16px", border: "5px solid #291308", borderRadius: 999, background: "#f6f0db"}}>豆腐</span>
        <span style={{padding: "12px 21px 16px", border: "5px solid #291308", borderRadius: 999, background: "#78ad47", color: "#fff"}}>長ねぎ</span>
      </div>
      <div style={{marginTop: 21, color: "#e76723", fontSize: 63, lineHeight: 1, fontWeight: 900}}>根室の漁師料理</div>
    </InfoCard>
    <NarrationCaption accent="#e9b951">カニのだしへ、味噌、長ねぎ、豆腐。<br />熱々の漁師料理です。</NarrationCaption>
  </AbsoluteFill>
);

const SecondTwist: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 4), fps, config: {damping: 8, stiffness: 190, mass: 0.6}});
  return (
    <AbsoluteFill>
      <BaseVideo src={clips.relief} startSeconds={5.35} playbackRate={0.7} tone="bright" zoom={1.05} position="50% 54%" />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%,rgba(255,247,196,.12),transparent 47%,rgba(63,27,4,.48))"}} />
      <SeriesBadge />
      <div style={{position: "absolute", top: 150, left: 45, right: 45, padding: "31px 26px 39px", border: "10px solid #3f210d", borderRadius: 38, background: "rgba(255,251,226,.97)", boxShadow: "0 17px 0 #3f210d,inset 0 0 0 7px #f2c15c,0 38px 85px #0009", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.22, 1])})`}}>
        <div style={{fontSize: 54, lineHeight: 1, fontWeight: 900}}>ところで花咲ガニ</div>
        <div style={{marginTop: 24, color: "#e86424", fontSize: 72, lineHeight: 1, fontWeight: 900}}>実は……</div>
        <div style={{marginTop: 21, color: "#bd3d1b", fontSize: 92, lineHeight: 1.05, fontWeight: 900, textShadow: "0 5px 0 #70200c"}}>ヤドカリの仲間</div>
      </div>
      <NarrationCaption accent="#f2c15c">ところで花咲ガニは、<br />実は、ヤドカリの仲間です。</NarrationCaption>
    </AbsoluteFill>
  );
};

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 180, mass: 0.62}});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "linear-gradient(180deg,#fff4d2,#ffc76d 49%,#e8672c)"}}>
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 23%,#fff 0%,transparent 38%)", opacity: 0.75}} />
      {Array.from({length: 16}, (_, index) => (
        <div key={index} style={{position: "absolute", left: `${8 + (index * 19) % 87}%`, top: `${9 + (index * 23) % 78}%`, width: 15 + (index % 4) * 8, height: 15 + (index % 4) * 8, borderRadius: "50%", background: index % 2 ? "#fff9" : "#d6412555", boxShadow: "0 0 18px #fff", opacity: 0.42 + (index % 3) * 0.16}} />
      ))}
      <div style={{position: "absolute", top: 105, bottom: 125, left: 44, right: 44, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "58px 34px 69px", border: "12px solid #48230d", borderRadius: 42, background: "rgba(255,253,235,.95)", boxShadow: "0 22px 0 #48230d,0 45px 90px #8c3a0a88,inset 0 0 0 8px #efad40", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.24, 1])})`}}>
        <div style={{fontSize: 62, lineHeight: 1, fontWeight: 900, color: "#9b4b1a"}}>鉄砲じゃないうえ</div>
        <div style={{marginTop: 24, color: "#e65c22", fontSize: 98, lineHeight: 1.02, fontWeight: 900, textShadow: "0 6px 0 #8f3514"}}>ヤドカリ寄りかい！</div>
        <div style={{width: "82%", margin: "48px 0 37px", borderTop: "8px dashed #48230d"}} />
        <div style={{fontSize: 73, lineHeight: 1.06, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 30, padding: "19px 63px 27px", border: "8px solid #48230d", borderRadius: 999, background: "#ec6429", color: "#fff", fontSize: 116, lineHeight: 1, fontWeight: 900, textShadow: "0 7px 0 #9b3514", boxShadow: "0 12px 0 #48230d"}}>よろしく</div>
        <div style={{marginTop: 66, fontSize: 36, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = 0.27}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const Bgm: React.FC<{episode: Episode; totalFrames: number}> = ({episode, totalFrames}) => (
  <Audio
    src={staticFile(episode.bgm ?? "BGM/Seafood Punchline.mp3")}
    startFrom={Math.round(BGM_SOURCE_SECONDS * TEPPOU_JIRU_FPS)}
    volume={(frame) => {
      const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});
      const impactDuck = interpolate(
        frame,
        [IMPACT_FRAME - 7, IMPACT_FRAME - 1, IMPACT_FRAME + 7, IMPACT_FRAME + 23],
        [1, 0.04, 0.08, 0.82],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      );
      const fadeOut = interpolate(frame, [totalFrames - 26, totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
      return 0.1 * fadeIn * impactDuck * fadeOut;
    }}
  />
);

export const TeppouJiruShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getTeppouJiruTimeline(episode);
  const scenes = [<Identity key="identity" />, <Origin key="origin" />, <Appetite key="appetite" />, <SecondTwist key="twist" />];
  const effects = ["Effect/シャキーン1.mp3", "Effect/決定ボタンを押す3.mp3", "Effect/シャキーン2.mp3", "Effect/間抜け1.mp3"];
  return (
    <AbsoluteFill style={{backgroundColor: "#050403", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} totalFrames={timeline.totalFrames} />
      <Sequence from={22} durationInFrames={61}>
        <Audio src={staticFile("Effect/心臓の鼓動1.mp3")} volume={0.12} />
      </Sequence>
      <Sequence from={IMPACT_FRAME} durationInFrames={IMPACT_EFFECT_FRAMES}>
        <Audio
          src={staticFile("Effect/ショック2.mp3")}
          volume={(frame) =>
            0.75 * interpolate(frame, [0, 7, 27, IMPACT_EFFECT_FRAMES - 1], [1, 1, 0.4, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
          }
        />
      </Sequence>
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 0 ? 0.32 : 0.24} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/和太鼓でドン.mp3" effectVolume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};
