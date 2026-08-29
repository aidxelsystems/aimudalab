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

export const HANGOROSHI_FPS = 30;
export const HANGOROSHI_WIDTH = 1080;
export const HANGOROSHI_HEIGHT = 1920;
const SOURCE_FPS = 24;
const IMPACT_FRAME = 63;
const IMPACT_EFFECT_FRAMES = 105;
const BGM_RELIEF_SOURCE_SECONDS = 13.3;

const clips = {
  mash: "movie/Pestle_mashing_rice_in_bowl_202608210108.mp4",
  sweet: "movie/Making_Japanese_confectionery_in…_1080p_202608211239.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * HANGOROSHI_FPS));

export const getHangoroshiTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 3), 3 * HANGOROSHI_FPS);
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, 4), index === 0 ? 5 * HANGOROSHI_FPS : 1),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = framesFor(episode.outroDuration, 3.4);
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    reliefFrom: answerStarts[1] ?? cursor,
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
  tone?: "dark" | "warm";
}> = ({src, startSeconds = 0, playbackRate = 1, zoom = 1.03, position = "50% 50%", tone = "warm"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.035], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: tone === "dark" ? "#06080b" : "#2b1608"}}>
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
          filter: tone === "dark" ? "contrast(1.22) saturate(.72) brightness(.72)" : "saturate(1.12) contrast(1.04)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            tone === "dark"
              ? "linear-gradient(180deg,rgba(0,0,0,.52),rgba(3,8,15,.08) 44%,rgba(0,0,0,.7))"
              : "linear-gradient(180deg,rgba(55,20,0,.38),transparent 36%,rgba(48,19,0,.52))",
        }}
      />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <div
    style={{
      position: "absolute",
      top: 52,
      left: 44,
      padding: "10px 23px 13px",
      borderRadius: 999,
      border: "5px solid #fff",
      background: dark ? "#8f0d13" : "#d8391f",
      color: "white",
      fontSize: 32,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: 2,
      boxShadow: "0 7px 0 #3b0808,0 14px 28px #0009",
    }}
  >
    AIご当地グルメ
  </div>
);

const NarrationCaption: React.FC<{children: React.ReactNode; accent?: string; dark?: boolean}> = ({
  children,
  accent = "#f0bc31",
  dark = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        width: 920,
        bottom: 280,
        boxSizing: "border-box",
        padding: "20px 30px 24px",
        borderTop: `9px solid ${accent}`,
        borderRadius: 18,
        background: dark ? "rgba(1,3,7,.91)" : "rgba(22,10,3,.88)",
        color: "#fff",
        fontSize: 47,
        lineHeight: 1.25,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 4px #000",
        opacity: interpolate(frame, [0, 4], [0, 1], {extrapolateRight: "clamp"}),
      }}
    >
      {children}
    </div>
  );
};

const WarmCard: React.FC<{children: React.ReactNode; accent?: string; top?: number; rotate?: number}> = ({
  children,
  accent = "#e8b331",
  top = 148,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 210, mass: 0.55}});
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 48,
        right: 48,
        transform: `translateY(${interpolate(enter, [0, 1], [-65, 0])}px) scale(${interpolate(enter, [0, 1], [1.1, 1])}) rotate(${rotate}deg)`,
        padding: "26px 27px 32px",
        border: "9px solid #190d06",
        borderRadius: 29,
        background: "rgba(255,249,222,.97)",
        boxShadow: `0 15px 0 #190d06,inset 0 0 0 6px ${accent},0 30px 70px #000a`,
        color: "#190d06",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

const ImpactParticles: React.FC<{progress: number}> = ({progress}) => {
  const particles = Array.from({length: 24}, (_, index) => {
    const angle = (Math.PI * 2 * index) / 24 + (index % 3) * 0.12;
    const distance = 150 + (index % 5) * 43;
    const size = 9 + (index % 4) * 4;
    return {angle, distance, size};
  });
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 540 + Math.cos(particle.angle) * particle.distance * progress,
            top: 910 + Math.sin(particle.angle) * particle.distance * progress,
            width: particle.size,
            height: particle.size * 1.75,
            borderRadius: "55% 45% 55% 45%",
            background: "#fffbe8",
            boxShadow: "0 0 8px #ffb237",
            transform: `rotate(${particle.angle + progress * 5}rad) scale(${1 - progress * 0.45})`,
            opacity: Math.max(0, 1 - progress),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delta = frame - IMPACT_FRAME;
  const impactProgress = interpolate(delta, [0, 11], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = delta >= 0 && delta <= 9 ? Math.sin(delta * 3.3) * (12 - delta * 1.15) : 0;
  const hitScale = delta >= 0 && delta <= 10 ? interpolate(delta, [0, 2, 10], [1, 1.045, 1.01]) : 1;
  const titleEnter = spring({frame: Math.max(0, frame - 4), fps, config: {damping: 7, stiffness: 235, mass: 0.5}});
  const titleExit = interpolate(delta, [0, 2, 10], [1, 1.35, 0.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colorHit = delta >= 0 && delta <= 8 ? 1 - delta / 8 : 0;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform: `translate(${shake}px,${-shake * 0.55}px) scale(${hitScale})`,
        filter: `saturate(${0.78 + colorHit * 2.2}) contrast(${1.05 + colorHit * 0.45}) sepia(${colorHit * 0.4}) hue-rotate(${-18 * colorHit}deg)`,
      }}
    >
      <BaseVideo src={clips.mash} playbackRate={0.55} zoom={1.03} position="50% 50%" tone="dark" />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.36),rgba(0,0,0,.08) 50%,rgba(0,0,0,.58))"}} />
      <SeriesBadge dark />
      {delta < 11 ? (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 70,
            right: 70,
            textAlign: "center",
            transform: `scale(${interpolate(titleEnter, [0, 1], [1.3, 1]) * titleExit}) rotate(${delta >= 0 ? -2 * impactProgress : 0}deg)`,
            opacity: delta >= 8 ? interpolate(delta, [8, 11], [1, 0]) : 1,
          }}
        >
          <div style={{fontSize: 76, lineHeight: 1, fontWeight: 900, color: "#fff", textShadow: "0 7px 12px #000,0 0 22px #000"}}>
            この米、
          </div>
          <div
            style={{
              marginTop: 17,
              color: "#f02222",
              fontSize: 150,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -8,
              WebkitTextStroke: "8px #fff",
              paintOrder: "stroke fill",
              textShadow: "0 13px 0 #170000,0 20px 38px #000",
            }}
          >
            半ごろし
          </div>
          <div style={{marginTop: 18, fontSize: 88, lineHeight: 1, fontWeight: 900, color: "#fff", textShadow: "0 7px 12px #000,0 0 20px #000"}}>
            にします
          </div>
        </div>
      ) : null}
      {delta >= 0 && delta <= 11 ? (
        <>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 49%,rgba(255,226,74,${0.75 * (1 - impactProgress)}) 0%,rgba(255,50,0,${0.42 * (1 - impactProgress)}) 24%,transparent 58%)`,
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "49%",
              width: 430,
              height: 430,
              borderRadius: "50%",
              border: `28px solid rgba(255,78,0,${1 - impactProgress})`,
              transform: `translate(-50%,-50%) scale(${0.2 + impactProgress * 2.8})`,
              boxShadow: "0 0 45px #ffb000",
            }}
          />
          <ImpactParticles progress={impactProgress} />
        </>
      ) : null}
      {delta >= 10 ? <NarrationCaption dark accent="#d91d25">この米を、<br />半ごろしにします。</NarrationCaption> : null}
    </AbsoluteFill>
  );
};

const HalfStop: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.mash} startSeconds={2.2} playbackRate={0.85} zoom={1.045} position="50% 54%" tone="dark" />
    <SeriesBadge dark />
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 52,
        right: 52,
        padding: "30px 28px 36px",
        border: "9px solid #fff",
        borderRadius: 25,
        background: "rgba(4,6,10,.88)",
        boxShadow: "0 15px 0 #6d070e,0 30px 60px #000c,inset 0 0 0 5px #b40e19",
        textAlign: "center",
      }}
    >
      <div style={{fontSize: 57, fontWeight: 900, color: "#fff"}}>でも、全部は</div>
      <div style={{marginTop: 14, fontSize: 111, lineHeight: 1, fontWeight: 900, color: "#ff3030", textShadow: "0 7px 0 #320000"}}>つぶさない</div>
      <div style={{marginTop: 22, paddingTop: 17, borderTop: "5px dashed #fff8", fontSize: 66, fontWeight: 900, color: "#ffe9a0"}}>半分で止める</div>
    </div>
    <NarrationCaption dark accent="#b8101a">でも、全部はつぶしません。<br />半分で止めます。</NarrationCaption>
  </AbsoluteFill>
);

const Identity: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.sweet} startSeconds={0.5} zoom={1.035} position="50% 53%" />
    <SeriesBadge />
    <WarmCard accent="#efb735">
      <div style={{fontSize: 50, fontWeight: 900}}>正体は</div>
      <div style={{marginTop: 8, color: "#a24518", fontSize: 67, lineHeight: 1, fontWeight: 900}}>徳島・那賀町</div>
      <div style={{marginTop: 18, color: "#d52b1d", fontSize: 126, lineHeight: 0.92, fontWeight: 900, textShadow: "0 6px 0 #5a160c"}}>半ごろし</div>
    </WarmCard>
    <NarrationCaption>正体は、徳島県那賀町の郷土料理、<br />半ごろし。</NarrationCaption>
    <AbsoluteFill style={{background: "#fff1b0", opacity: interpolate(useCurrentFrame(), [0, 3, 7], [0.62, 0.15, 0], {extrapolateRight: "clamp"})}} />
  </AbsoluteFill>
);

const Method: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.sweet} startSeconds={2.35} zoom={1.04} position="50% 53%" />
    <SeriesBadge />
    <WarmCard accent="#7eb14c" rotate={-1}>
      <div style={{fontSize: 52, fontWeight: 900}}>もち米＋うるち米</div>
      <div style={{marginTop: 20, color: "#d83a20", fontSize: 91, lineHeight: 1.02, fontWeight: 900}}>米粒を<br />半分残す</div>
      <div style={{marginTop: 22, fontSize: 48, fontWeight: 900}}>だから「半ごろし」</div>
    </WarmCard>
    <NarrationCaption accent="#86bd54">もち米とうるち米を、<br />粒が残る程度につぶすから、この名前。</NarrationCaption>
  </AbsoluteFill>
);

const SweetReveal: React.FC = () => (
  <AbsoluteFill>
    <BaseVideo src={clips.sweet} startSeconds={4.5} playbackRate={0.9} zoom={1.045} position="50% 54%" />
    <SeriesBadge />
    <WarmCard accent="#d8aa44" top={142} rotate={1}>
      <div style={{display: "flex", justifyContent: "center", gap: 14, alignItems: "center", fontSize: 51, fontWeight: 900}}>
        <span style={{padding: "11px 22px 15px", border: "5px solid #190d06", borderRadius: 999, background: "#823017", color: "#fff"}}>あんこ</span>
        <span>＋</span>
        <span style={{padding: "11px 22px 15px", border: "5px solid #190d06", borderRadius: 999, background: "#e7c66e"}}>きな粉</span>
      </div>
      <div style={{marginTop: 27, color: "#d63520", fontSize: 95, lineHeight: 1, fontWeight: 900}}>甘いおはぎ</div>
    </WarmCard>
    <NarrationCaption accent="#d8aa44">あんこを包み、きな粉をまぶせば、<br />甘いおはぎの完成。</NarrationCaption>
  </AbsoluteFill>
);

const FullMash: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const revealAt = Math.round(fps * 1.25);
  const enter = spring({frame: Math.max(0, frame - revealAt), fps, config: {damping: 6, stiffness: 245, mass: 0.5}});
  const shake = frame >= revealAt && frame < revealAt + 12 ? Math.sin((frame - revealAt) * 2.8) * (12 - (frame - revealAt)) * 0.6 : 0;
  return (
    <AbsoluteFill>
      <BaseVideo src={clips.sweet} startSeconds={6.2} playbackRate={0.72} zoom={1.05} position="50% 55%" />
      <SeriesBadge />
      <div
        style={{
          position: "absolute",
          top: 145,
          left: 48,
          right: 48,
          padding: "27px 28px 35px",
          border: "10px solid #190d06",
          borderRadius: 30,
          background: "rgba(255,248,216,.97)",
          boxShadow: "0 16px 0 #190d06,0 34px 70px #000b,inset 0 0 0 6px #e2aa31",
          textAlign: "center",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div style={{fontSize: 65, lineHeight: 1, fontWeight: 900}}>全部つぶすと？</div>
        {frame >= revealAt ? (
          <div
            style={{
              marginTop: 24,
              color: "#e02622",
              fontSize: 132,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: -7,
              WebkitTextStroke: "5px #190d06",
              paintOrder: "stroke fill",
              textShadow: "0 9px 0 #190d06",
              transform: `scale(${interpolate(enter, [0, 1], [1.5, 1])})`,
            }}
          >
            みなごろし
          </div>
        ) : (
          <div style={{marginTop: 35, fontSize: 100, fontWeight: 900, color: "#9d751f"}}>……</div>
        )}
      </div>
      <NarrationCaption accent="#e2aa31">ちなみに、全部つぶすと、<br />みなごろしと呼ぶそうです。</NarrationCaption>
      <Sequence from={revealAt} durationInFrames={55}>
        <Audio src={staticFile("Effect/ビシッとツッコミ2.mp3")} volume={0.42} />
      </Sequence>
    </AbsoluteFill>
  );
};

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 6, stiffness: 235, mass: 0.55}});
  const shake = frame < 16 ? Math.sin(frame * 2.6) * (16 - frame) * 0.68 : 0;
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "repeating-conic-gradient(from -10deg,#ffcc3e 0deg 12deg,#c5241c 12deg 24deg)"}}>
      <AbsoluteFill style={{background: "radial-gradient(circle,#fff5bf33,#3d000044)"}} />
      <div
        style={{
          position: "absolute",
          top: 90,
          bottom: 115,
          left: 44,
          right: 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${shake}px) scale(${interpolate(enter, [0, 1], [1.35, 1])})`,
          padding: "55px 35px 65px",
          border: "13px solid #170704",
          borderRadius: 40,
          background: "#fff8d7",
          boxShadow: "0 22px 0 #170704,0 42px 90px #4a0000a8,inset 0 0 0 8px #e12e21",
          textAlign: "center",
        }}
      >
        <div style={{fontSize: 62, lineHeight: 1, fontWeight: 900}}>名前が</div>
        <div style={{marginTop: 20, color: "#e42120", fontSize: 105, lineHeight: 1.02, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "4px #170704", paintOrder: "stroke fill", textShadow: "0 9px 0 #170704"}}>
          物騒すぎる！
        </div>
        <div style={{width: "86%", margin: "52px 0 39px", borderTop: "9px dashed #170704"}} />
        <div style={{fontSize: 69, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 24, padding: "17px 60px 25px", border: "8px solid #170704", borderRadius: 999, background: "#d62b20", color: "#fff", fontSize: 112, lineHeight: 1, fontWeight: 900, textShadow: "0 7px 0 #761109", boxShadow: "0 12px 0 #170704"}}>
          よろしく
        </div>
        <div style={{marginTop: 55, fontSize: 36, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = 0.28}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const SplitBgm: React.FC<{episode: Episode; reliefFrom: number; totalFrames: number}> = ({episode, reliefFrom, totalFrames}) => {
  const bgm = episode.bgm ?? "BGM/半割れスイーツ.mp3";
  return (
    <>
      <Sequence from={0} durationInFrames={reliefFrom}>
        <Audio
          src={staticFile(bgm)}
          volume={(frame) => {
            const fadeIn = Math.min(1, interpolate(frame, [0, 15], [0, 1], {extrapolateRight: "clamp"}));
            const impactDuck = interpolate(
              frame,
              [IMPACT_FRAME - 5, IMPACT_FRAME, IMPACT_FRAME + 55, IMPACT_FRAME + 85],
              [1, 0.16, 0.28, 1],
              {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
            );
            return 0.12 * fadeIn * impactDuck;
          }}
        />
      </Sequence>
      <Sequence from={reliefFrom} durationInFrames={totalFrames - reliefFrom}>
        <Audio
          src={staticFile(bgm)}
          startFrom={Math.round(BGM_RELIEF_SOURCE_SECONDS * HANGOROSHI_FPS)}
          volume={(frame) =>
            0.095 *
            Math.min(
              1,
              interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"}),
              interpolate(frame, [totalFrames - reliefFrom - 24, totalFrames - reliefFrom], [1, 0], {extrapolateLeft: "clamp"}),
            )
          }
        />
      </Sequence>
    </>
  );
};

export const HangoroshiShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getHangoroshiTimeline(episode);
  const scenes = [<HalfStop key="half" />, <Identity key="identity" />, <Method key="method" />, <SweetReveal key="sweet" />, <FullMash key="full" />];
  const effects = [undefined, "Effect/シャキーン1.mp3", "Effect/決定ボタンを押す3.mp3", "Effect/シャキーン2.mp3", undefined];
  return (
    <AbsoluteFill style={{backgroundColor: "#080604", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <SplitBgm episode={episode} reliefFrom={timeline.reliefFrom} totalFrames={timeline.totalFrames} />
      <Sequence from={IMPACT_FRAME} durationInFrames={IMPACT_EFFECT_FRAMES}>
        <Audio
          src={staticFile("Effect/ショック2.mp3")}
          volume={(frame) =>
            0.72 *
            interpolate(frame, [0, 6, 26, IMPACT_EFFECT_FRAMES - 1], [1, 1, 0.45, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
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
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 1 ? 0.34 : 0.25} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/和太鼓でドン.mp3" effectVolume={0.46} />
      </Sequence>
    </AbsoluteFill>
  );
};
