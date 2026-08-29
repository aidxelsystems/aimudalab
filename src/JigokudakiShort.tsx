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

export const JIGOKUDAKI_FPS = 30;
export const JIGOKUDAKI_WIDTH = 1080;
export const JIGOKUDAKI_HEIGHT = 1920;

const SOURCE_FPS = 24;
const IMPACT_FRAME = 153;
const IMPACT_EFFECT_FRAMES = 105;
const BGM_SOURCE_SECONDS = 96;

const clips = {
  hell: "movie/Noodles_boiling_in_pot_1080p_202608212303.mp4",
  heaven: "movie/Chopsticks_lifting_noodles_from_pot_202608212322.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * JIGOKUDAKI_FPS));

export const getJigokudakiTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 6.05), 182);
  const minimums = [4.4, 4.1, 5.2, 5.25, 3.75];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 3.2), Math.round(3.2 * JIGOKUDAKI_FPS));
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
  tone?: "hell" | "warm" | "heaven";
}> = ({src, startSeconds = 0, playbackRate = 1, zoom = 1.03, position = "50% 50%", tone = "warm"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.035], {extrapolateRight: "clamp"});
  const filter =
    tone === "hell"
      ? "brightness(.63) contrast(1.38) saturate(.55) sepia(.16) hue-rotate(325deg)"
      : tone === "heaven"
        ? "brightness(1.06) contrast(1.02) saturate(1.12) sepia(.08)"
        : "brightness(.98) contrast(1.08) saturate(1.08)";
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: tone === "hell" ? "#020205" : "#4a260f"}}>
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
            tone === "hell"
              ? "linear-gradient(180deg,rgba(0,0,0,.68),rgba(18,0,0,.12) 46%,rgba(0,0,0,.72))"
              : "linear-gradient(180deg,rgba(74,31,0,.34),transparent 38%,rgba(65,28,2,.48))",
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
      background: dark ? "#79000b" : "#e26425",
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

const NarrationCaption: React.FC<{children: React.ReactNode; accent?: string; dark?: boolean}> = ({
  children,
  accent = "#f2bd4a",
  dark = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 280,
        width: 920,
        boxSizing: "border-box",
        transform: "translateX(-50%)",
        padding: "20px 28px 24px",
        borderTop: `9px solid ${accent}`,
        borderRadius: 18,
        background: dark ? "rgba(1,2,5,.92)" : "rgba(45,20,4,.89)",
        color: "#fff",
        fontSize: 47,
        lineHeight: 1.25,
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
        background: `radial-gradient(circle at 50% 61%,rgba(255,244,190,${0.9 * (1 - progress)}) 0%,rgba(255,38,0,${0.62 * (1 - progress)}) 19%,rgba(72,0,0,${0.4 * (1 - progress)}) 46%,transparent 70%)`,
        mixBlendMode: "screen",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "61%",
        width: 450,
        height: 450,
        borderRadius: "50%",
        border: `30px solid rgba(255,55,0,${1 - progress})`,
        transform: `translate(-50%,-50%) scale(${0.16 + progress * 3.2})`,
        boxShadow: "0 0 55px #ff3d00",
      }}
    />
    {Array.from({length: 28}, (_, index) => {
      const angle = (Math.PI * 2 * index) / 28;
      const distance = 120 + (index % 7) * 46;
      return (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 540 + Math.cos(angle) * distance * progress,
            top: 1170 + Math.sin(angle) * distance * progress,
            width: 8 + (index % 4) * 5,
            height: 25 + (index % 5) * 8,
            borderRadius: 999,
            background: index % 2 ? "#ff431f" : "#ffd25b",
            boxShadow: "0 0 14px #ff2b00",
            transform: `rotate(${angle}rad) scale(${1 - progress * 0.5})`,
            opacity: Math.max(0, 1 - progress),
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delta = frame - IMPACT_FRAME;
  const impact = interpolate(delta, [0, 13], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shake = delta >= 0 && delta < 14 ? Math.sin(delta * 3.6) * (18 - delta * 1.15) : 0;
  const hitScale = delta >= 0 && delta < 14 ? interpolate(delta, [0, 2, 13], [1, 1.075, 1.012]) : 1;
  const titleEnter = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 6, stiffness: 250, mass: 0.52}});
  const titleExit = interpolate(delta, [0, 4, 12], [1, 1.4, 0.02], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const pulse = 0.55 + Math.sin(frame * 0.22) * 0.18;
  const countdown = Math.max(1, Math.ceil((IMPACT_FRAME - frame) / JIGOKUDAKI_FPS));
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform: `translate(${shake}px,${-shake * 0.55}px) scale(${hitScale})`,
        filter: delta >= 0 && delta < 10 ? `contrast(${1.15 + (1 - impact) * 0.55}) saturate(${1 + (1 - impact) * 1.7})` : undefined,
      }}
    >
      <BaseVideo src={clips.hell} tone="hell" zoom={1.035} position="50% 50%" />
      <AbsoluteFill style={{boxShadow: `inset 0 0 180px rgba(150,0,0,${pulse})`}} />
      <SeriesBadge dark />
      {delta < 12 ? (
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 55,
            right: 55,
            textAlign: "center",
            transform: `scale(${interpolate(titleEnter, [0, 1], [1.25, 1]) * titleExit})`,
            opacity: delta > 8 ? interpolate(delta, [8, 12], [1, 0]) : 1,
          }}
        >
          <div style={{display: "inline-block", padding: "10px 30px 15px", border: "6px solid #ffddd6", background: "#a30010", color: "#fff", fontSize: 46, lineHeight: 1, fontWeight: 900, letterSpacing: 9, boxShadow: "0 8px 0 #250000"}}>
            警告
          </div>
          <div style={{marginTop: 28, color: "#fff", fontSize: 75, lineHeight: 1, fontWeight: 900, textShadow: "0 8px 20px #000"}}>この麺を</div>
          <div style={{marginTop: 15, color: "#f51824", fontSize: 176, lineHeight: 0.92, fontWeight: 900, letterSpacing: -12, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #430006,0 25px 45px #000"}}>
            地獄へ
          </div>
          <div style={{marginTop: 22, color: "#fff", fontSize: 95, lineHeight: 1, fontWeight: 900, textShadow: "0 8px 20px #000"}}>落とします</div>
        </div>
      ) : null}
      {frame >= 62 && delta < 0 ? (
        <div style={{position: "absolute", left: "50%", bottom: 302, transform: "translateX(-50%)", width: 760, padding: "19px 25px 24px", border: "6px solid #ff3343", borderRadius: 18, background: "rgba(0,0,0,.9)", color: "#fff", textAlign: "center", fontSize: 45, lineHeight: 1.1, fontWeight: 900, boxShadow: "0 0 34px #d00018"}}>
          もう後戻りできない
          <span style={{marginLeft: 24, color: "#ff3343", fontSize: 58}}>あと {countdown}</span>
        </div>
      ) : null}
      {delta >= 0 && delta <= 13 ? <ImpactBurst progress={impact} /> : null}
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BaseVideo src={clips.heaven} startSeconds={0} playbackRate={0.86} tone="heaven" zoom={1.025} position="50% 52%" />
      <AbsoluteFill style={{background: "#fff8c7", opacity: interpolate(frame, [0, 3, 10], [0.82, 0.3, 0], {extrapolateRight: "clamp"})}} />
      <SeriesBadge />
      <InfoCard accent="#ffbd49" soft>
        <div style={{fontSize: 49, fontWeight: 900}}>でも、正体は</div>
        <div style={{marginTop: 10, color: "#b75a24", fontSize: 63, lineHeight: 1, fontWeight: 900}}>長崎・五島列島</div>
        <div style={{marginTop: 18, color: "#ec5c20", fontSize: 121, lineHeight: 0.94, fontWeight: 900, textShadow: "0 7px 0 #6c270e"}}>地獄炊き</div>
      </InfoCard>
      <NarrationCaption accent="#ffbd49">でも、正体は、長崎県、<br />五島列島の地獄炊き。</NarrationCaption>
    </AbsoluteFill>
  );
};

const Origin: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.hell} startSeconds={5.15} playbackRate={0.58} tone="warm" zoom={1.04} position="50% 54%" />
    <SeriesBadge />
    <InfoCard accent="#ed7b2f">
      <div style={{fontSize: 48, fontWeight: 900}}>名前の由来</div>
      <div style={{marginTop: 18, color: "#d84320", fontSize: 83, lineHeight: 1.04, fontWeight: 900}}>煮えたぎる鍋が</div>
      <div style={{marginTop: 13, fontSize: 74, lineHeight: 1, fontWeight: 900}}>地獄の釜みたい</div>
    </InfoCard>
    <NarrationCaption accent="#ed7b2f">煮えたぎる鍋が、<br />地獄の釜みたいだから、<br />この名前。</NarrationCaption>
  </AbsoluteFill>
);

const ThinNoodles: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.heaven} startSeconds={1.45} playbackRate={0.72} tone="heaven" zoom={1.035} position="50% 52%" />
    <SeriesBadge />
    <InfoCard accent="#e8bd5f" soft>
      <div style={{fontSize: 49, fontWeight: 900}}>五島うどんは</div>
      <div style={{marginTop: 15, color: "#a85c21", fontSize: 65, lineHeight: 1, fontWeight: 900}}>椿油を使った</div>
      <div style={{marginTop: 22, color: "#e76523", fontSize: 88, lineHeight: 1.03, fontWeight: 900}}>つるんと<br />細い丸麺</div>
    </InfoCard>
    <NarrationCaption accent="#e8bd5f">五島うどんは、椿油を使った、<br />コシのある、つるんと細い丸麺。</NarrationCaption>
  </AbsoluteFill>
);

const HowToEat: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.heaven} startSeconds={4.2} playbackRate={0.88} tone="heaven" zoom={1.04} position="50% 54%" />
    <SeriesBadge />
    <InfoCard accent="#8fc65f" soft top={142}>
      <div style={{fontSize: 54, fontWeight: 900}}>鍋から直接すくって</div>
      <div style={{marginTop: 19, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontSize: 54, fontWeight: 900}}>
        <span style={{padding: "12px 24px 16px", border: "5px solid #291308", borderRadius: 999, background: "#b76a31", color: "#fff"}}>あごだし</span>
        <span>または</span>
        <span style={{padding: "12px 24px 16px", border: "5px solid #291308", borderRadius: 999, background: "#f6c744"}}>卵</span>
      </div>
      <div style={{marginTop: 23, color: "#e45d22", fontSize: 76, lineHeight: 1, fontWeight: 900}}>熱々をいただく</div>
    </InfoCard>
    <NarrationCaption accent="#8fc65f">鍋から直接すくい、<br />あごだしか卵につけて、<br />熱々をいただきます。</NarrationCaption>
  </AbsoluteFill>
);

const HeavenPunchline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 7, stiffness: 185, mass: 0.62}});
  return (
    <AbsoluteFill>
      <BaseVideo src={clips.heaven} startSeconds={6.1} playbackRate={0.78} tone="heaven" zoom={1.045} position="50% 55%" />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 48%,rgba(255,251,205,.18),rgba(255,194,76,.1) 48%,rgba(84,40,8,.45))"}} />
      <SeriesBadge />
      <div style={{position: "absolute", top: 155, left: 46, right: 46, padding: "30px 28px 39px", border: "10px solid #4c270c", borderRadius: 38, background: "rgba(255,251,226,.97)", boxShadow: "0 17px 0 #4c270c,inset 0 0 0 7px #f7c654,0 38px 85px #0009", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.24, 1])})`}}>
        <div style={{fontSize: 62, lineHeight: 1, fontWeight: 900}}>地獄なのに</div>
        <div style={{marginTop: 22, color: "#ed6b22", fontSize: 100, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #8a3712"}}>つるつる</div>
        <div style={{marginTop: 14, color: "#e9a81e", fontSize: 135, lineHeight: 0.92, fontWeight: 900, WebkitTextStroke: "5px #4c270c", paintOrder: "stroke fill", textShadow: "0 9px 0 #4c270c"}}>天国！</div>
      </div>
      <NarrationCaption accent="#f7c654">地獄なのに、<br />つるつる天国！</NarrationCaption>
    </AbsoluteFill>
  );
};

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 180, mass: 0.62}});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "linear-gradient(180deg,#fff7d7,#ffd884 48%,#f09a3d)"}}>
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 24%,#fff 0%,transparent 39%)", opacity: 0.75}} />
      {Array.from({length: 14}, (_, index) => (
        <div key={index} style={{position: "absolute", left: `${8 + (index * 17) % 88}%`, top: `${10 + (index * 23) % 76}%`, width: 16 + (index % 4) * 8, height: 16 + (index % 4) * 8, borderRadius: "50%", background: "#fff9", boxShadow: "0 0 18px #fff", opacity: 0.45 + (index % 3) * 0.16}} />
      ))}
      <div style={{position: "absolute", top: 110, bottom: 130, left: 45, right: 45, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "65px 36px 75px", border: "12px solid #4b270e", borderRadius: 42, background: "rgba(255,253,235,.94)", boxShadow: "0 22px 0 #4b270e,0 45px 90px #8c3a0a88,inset 0 0 0 8px #f5bd47", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.24, 1])})`}}>
        <div style={{fontSize: 57, lineHeight: 1, fontWeight: 900, color: "#9c4f1c"}}>地獄感</div>
        <div style={{marginTop: 20, color: "#e75f22", fontSize: 103, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #8f3514"}}>台無しだな</div>
        <div style={{width: "82%", margin: "49px 0 38px", borderTop: "8px dashed #4b270e"}} />
        <div style={{fontSize: 74, lineHeight: 1.06, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 31, padding: "19px 64px 27px", border: "8px solid #4b270e", borderRadius: 999, background: "#ef6a2a", color: "#fff", fontSize: 118, lineHeight: 1, fontWeight: 900, textShadow: "0 7px 0 #9b3514", boxShadow: "0 12px 0 #4b270e"}}>よろしく</div>
        <div style={{marginTop: 70, fontSize: 37, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = 0.26}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const Bgm: React.FC<{episode: Episode; totalFrames: number}> = ({episode, totalFrames}) => (
  <Audio
    src={staticFile(episode.bgm ?? "BGM/Udonswitch.mp3")}
    startFrom={Math.round(BGM_SOURCE_SECONDS * JIGOKUDAKI_FPS)}
    volume={(frame) => {
      const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
      const impactDuck = interpolate(
        frame,
        [IMPACT_FRAME - 10, IMPACT_FRAME, IMPACT_FRAME + 8, IMPACT_FRAME + 28],
        [1, 0.12, 0.12, 0.78],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      );
      const fadeOut = interpolate(frame, [totalFrames - 26, totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
      return 0.11 * fadeIn * impactDuck * fadeOut;
    }}
  />
);

export const JigokudakiShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getJigokudakiTimeline(episode);
  const scenes = [<Identity key="identity" />, <Origin key="origin" />, <ThinNoodles key="thin" />, <HowToEat key="eat" />, <HeavenPunchline key="heaven" />];
  const effects = ["Effect/シャキーン1.mp3", undefined, "Effect/決定ボタンを押す3.mp3", "Effect/シャキーン2.mp3", "Effect/間抜け1.mp3"];
  return (
    <AbsoluteFill style={{backgroundColor: "#050403", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} totalFrames={timeline.totalFrames} />
      <Sequence from={30} durationInFrames={112}>
        <Audio src={staticFile("Effect/心臓の鼓動1.mp3")} volume={0.13} />
      </Sequence>
      <Sequence from={IMPACT_FRAME} durationInFrames={IMPACT_EFFECT_FRAMES}>
        <Audio
          src={staticFile("Effect/ショック2.mp3")}
          volume={(frame) =>
            0.76 * interpolate(frame, [0, 7, 28, IMPACT_EFFECT_FRAMES - 1], [1, 1, 0.42, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
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
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 0 ? 0.31 : 0.23} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/和太鼓でドン.mp3" effectVolume={0.39} />
      </Sequence>
    </AbsoluteFill>
  );
};
