import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  Easing,
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

export const TAMAGO_FUWAFUWA_FPS = 30;
export const TAMAGO_FUWAFUWA_WIDTH = 1080;
export const TAMAGO_FUWAFUWA_HEIGHT = 1920;
const SOURCE_FPS = 24;
const VOICE_RATE = 1.06;

const clips = {
  preparation: "movie/Preparing_Japanese_tamago_fuwafuwa_1080p_202608141304.mp4",
  hero: "movie/Japanese_food_commercial_hero_shot_202608141309.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / VOICE_RATE) * TAMAGO_FUWAFUWA_FPS));

export const getTamagoFuwafuwaTimeline = (episode: Episode) => {
  const hookFrames = framesFor(episode.odaiDuration, 4.5);
  const answerFrames = episode.answers.map((answer) => framesFor(answer.duration, 4.5));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = framesFor(episode.outroDuration, 4.3);
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const FoodVideo: React.FC<{
  src: string;
  startSeconds?: number;
  zoom?: number;
  position?: string;
  blur?: number;
}> = ({src, startSeconds = 0, zoom = 1.02, position = "50% 50%", blur = 0}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.035], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#130a03"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * SOURCE_FPS)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${scale})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.1) 32%,rgba(0,0,0,.02) 62%,rgba(0,0,0,.64) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const SceneFlash: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: "#fff8cf",
        opacity: interpolate(frame, [0, 2, 6], [0.68, 0.24, 0], {
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

const SeriesBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 54,
      left: 46,
      padding: "10px 24px 13px",
      borderRadius: 999,
      border: "5px solid #fff",
      background: "#e73821",
      color: "white",
      fontSize: 34,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: 2,
      boxShadow: "0 7px 0 #6f1308,0 14px 30px #0008",
    }}
  >
    AIご当地グルメ
  </div>
);

const NarrationCaption: React.FC<{children: React.ReactNode; accent?: string}> = ({
  children,
  accent = "#ffd149",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4], [0, 1], {extrapolateRight: "clamp"});
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
        background: "rgba(6,5,4,.88)",
        color: "#fff",
        fontSize: 47,
        lineHeight: 1.25,
        fontWeight: 900,
        textAlign: "center",
        textShadow: "0 3px 4px #000",
        opacity,
      }}
    >
      {children}
    </div>
  );
};

const PopCard: React.FC<{
  children: React.ReactNode;
  top?: number;
  accent?: string;
  rotate?: number;
}> = ({children, top = 155, accent = "#ffd149", rotate = 0}) => {
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
        transform: `translateY(${interpolate(enter, [0, 1], [-90, 0])}px) scale(${interpolate(enter, [0, 1], [1.15, 1])}) rotate(${rotate}deg)`,
        padding: "25px 26px 32px",
        border: "9px solid #140d08",
        borderRadius: 28,
        background: "rgba(255,250,224,.97)",
        boxShadow: `0 14px 0 #140d08,inset 0 0 0 5px ${accent},0 28px 65px #000a`,
        color: "#140d08",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boom = spring({frame, fps, config: {damping: 6, stiffness: 250, mass: 0.45}});
  const pulse = 1 + Math.sin(frame / 4) * 0.018;
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.hero} startSeconds={3.25} zoom={1.045} position="50% 53%" />
      <SeriesBadge />
      <div
        style={{
          position: "absolute",
          top: 202,
          left: 42,
          right: 42,
          textAlign: "center",
          transform: `scale(${interpolate(boom, [0, 1], [1.55, 1]) * pulse})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "9px 32px 14px",
            background: "#e51f17",
            border: "8px solid #fff",
            color: "#fff",
            fontSize: 72,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 6px 0 #760b06",
            boxShadow: "0 12px 0 #170a06,0 28px 55px #000b",
          }}
        >
          まさか…
        </div>
        <div
          style={{
            marginTop: 26,
            padding: "24px 20px 31px",
            border: "10px solid #140d08",
            background: "rgba(255,249,218,.97)",
            boxShadow: "0 16px 0 #140d08,0 34px 65px #000b",
          }}
        >
          <div style={{fontSize: 68, lineHeight: 1, fontWeight: 900}}>江戸時代に</div>
          <div
            style={{
              marginTop: 15,
              color: "#f3c330",
              fontSize: 128,
              lineHeight: 0.92,
              fontWeight: 900,
              WebkitTextStroke: "5px #140d08",
              paintOrder: "stroke fill",
              textShadow: "0 10px 0 #140d08",
            }}
          >
            スフレ！？
          </div>
          <div style={{marginTop: 20, fontSize: 41, fontWeight: 900}}>みたいな朝ごはん</div>
        </div>
      </div>
      <NarrationCaption>まさか。江戸時代に、<br/>スフレみたいな朝ごはんがありました。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.hero} startSeconds={3.3} zoom={1.035} position="50% 52%" />
    <SeriesBadge />
    <PopCard accent="#f0bf36">
      <div style={{fontSize: 54, fontWeight: 900}}>静岡県・袋井宿</div>
      <div style={{marginTop: 13, color: "#d89d08", fontSize: 104, lineHeight: 0.98, fontWeight: 900}}>たまごふわふわ</div>
    </PopCard>
    <NarrationCaption>静岡県袋井市の名物、<br/>たまごふわふわ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Ingredients: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.preparation} startSeconds={2.0} zoom={1.04} position="50% 51%" />
    <SeriesBadge />
    <PopCard accent="#f1c63a" top={145}>
      <div style={{fontSize: 47, fontWeight: 900}}>材料は、たった</div>
      <div style={{marginTop: 6, color: "#e22d1d", fontSize: 91, lineHeight: 1, fontWeight: 900}}>2つだけ</div>
      <div style={{marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 20}}>
        <span style={{padding: "14px 31px 18px", border: "6px solid #140d08", borderRadius: 999, background: "#f5cf3f", fontSize: 64, fontWeight: 900}}>卵</span>
        <span style={{fontSize: 75, fontWeight: 900}}>×</span>
        <span style={{padding: "14px 31px 18px", border: "6px solid #140d08", borderRadius: 999, background: "#fff3c8", fontSize: 64, fontWeight: 900}}>だし汁</span>
      </div>
    </PopCard>
    <NarrationCaption>材料は、卵とだし汁。<br/>たったこれだけ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Method: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [18, 34], [0, 1], {
    easing: Easing.out(Easing.back(1.6)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.preparation} startSeconds={2.8} zoom={1.06} position="50% 51%" />
      <SeriesBadge />
      <PopCard accent="#f5bd32" top={135}>
        <div style={{fontSize: 74, lineHeight: 1, fontWeight: 900}}>4〜5分 泡立てる</div>
        <div style={{marginTop: 23, fontSize: 72, lineHeight: 1, fontWeight: 900, opacity: reveal}}>熱いだしへ！</div>
        <div style={{marginTop: 23, paddingTop: 19, borderTop: "6px dashed #140d08", color: "#d72819", fontSize: 70, lineHeight: 1, fontWeight: 900, opacity: reveal}}>2〜3分 蒸らす</div>
      </PopCard>
      <NarrationCaption accent="#f6c334">4〜5分泡立て、熱いだしへ。<br/>2〜3分蒸らします。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const History: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.hero} startSeconds={3.25} zoom={1.08} position="50% 52%" blur={4} />
    <SeriesBadge />
    <PopCard accent="#75c65a" top={142} rotate={-1}>
      <div style={{fontSize: 53, lineHeight: 1, fontWeight: 900}}>記録に残るのは</div>
      <div style={{marginTop: 14, color: "#268b43", fontSize: 96, lineHeight: 1, fontWeight: 900}}>江戸時代</div>
      <div style={{marginTop: 23, paddingTop: 20, borderTop: "6px dashed #140d08", fontSize: 66, lineHeight: 1.08, fontWeight: 900}}>袋井宿の<br/><span style={{color: "#d52b1c", fontSize: 83}}>宿泊客の朝食</span></div>
    </PopCard>
    <NarrationCaption accent="#79d75a">江戸時代、袋井宿で、<br/>宿泊客の朝食に出されたといいます。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Texture: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.hero} startSeconds={4.1} zoom={1.04} position="50% 54%" />
    <SeriesBadge />
    <PopCard accent="#f0c430" top={150}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 12}}>
        <div style={{padding: "15px 19px 19px", border: "6px solid #140d08", borderRadius: 22, background: "#fff4cd", fontSize: 50, whiteSpace: "nowrap", fontWeight: 900}}>卵がふわっ</div>
        <div style={{fontSize: 59, fontWeight: 900}}>×</div>
        <div style={{padding: "15px 19px 19px", border: "6px solid #140d08", borderRadius: 22, background: "#f5cf35", fontSize: 50, whiteSpace: "nowrap", fontWeight: 900}}>だしがじゅわっ</div>
      </div>
      <div style={{marginTop: 27, color: "#d62818", fontSize: 80, lineHeight: 1, fontWeight: 900}}>やさしい朝ごはん</div>
    </PopCard>
    <NarrationCaption>ふわっとほどける卵に、<br/>温かいだしが、じゅわっ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 225, mass: 0.55}});
  const shake = frame < 18 ? Math.sin(frame * 2.4) * (18 - frame) * 0.65 : 0;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "repeating-conic-gradient(from -12deg at 50% 50%,#f5cf38 0deg 12deg,#e56c36 12deg 24deg)",
      }}
    >
      <AbsoluteFill style={{background: "radial-gradient(circle,rgba(255,255,255,.18),rgba(95,35,0,.2))"}} />
      <div
        style={{
          position: "absolute",
          top: 88,
          bottom: 115,
          left: 44,
          right: 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${shake}px) scale(${interpolate(enter, [0, 1], [1.45, 1])}) rotate(${interpolate(enter, [0, 1], [-3, 0])}deg)`,
          padding: "65px 38px 78px",
          border: "13px solid #160b05",
          borderRadius: 40,
          background: "#fff9dc",
          boxShadow: "0 22px 0 #160b05,0 42px 90px #6a2500b8,inset 0 0 0 8px #f2b437",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#e52b1b",
            fontSize: 78,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: -4,
            WebkitTextStroke: "3px #160b05",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 #160b05",
          }}
        >
          <span style={{display: "block"}}>江戸の朝食、</span>
          <span style={{display: "block"}}>映えすぎだろ！</span>
        </div>
        <div style={{width: "86%", margin: "62px 0 48px", borderTop: "9px dashed #160b05"}} />
        <div style={{fontSize: 72, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録も</div>
        <div
          style={{
            marginTop: 27,
            padding: "18px 62px 26px",
            border: "8px solid #160b05",
            borderRadius: 999,
            background: "#e8852e",
            color: "#fff",
            fontSize: 118,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 7px 0 #9b4314",
            boxShadow: "0 12px 0 #160b05",
          }}
        >
          よろしく
        </div>
        <div style={{marginTop: 66, fontSize: 38, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({
  path,
  effect,
  effectVolume = 0.32,
}) => (
  <>
    {path ? <Audio src={staticFile(path)} playbackRate={VOICE_RATE} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

export const TamagoFuwafuwaShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getTamagoFuwafuwaTimeline(episode);
  const scenes = [
    <Identity key="identity" />,
    <Ingredients key="ingredients" />,
    <Method key="method" />,
    <History key="history" />,
    <Texture key="texture" />,
  ];
  const effects = [
    "Effect/シャキーン1.mp3",
    "Effect/決定ボタンを押す3.mp3",
    "Effect/和太鼓でドン.mp3",
    "Effect/シャキーン2.mp3",
    "Effect/シャキーン1.mp3",
  ];
  return (
    <AbsoluteFill style={{backgroundColor: "#130b06", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Audio
        src={staticFile(episode.bgm ?? "BGM/Spring In My Step - Silent Partner.mp3")}
        loop
        volume={(frame) =>
          0.095 *
          Math.min(
            1,
            interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"}),
            interpolate(frame, [timeline.totalFrames - 35, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp"}),
          )
        }
      />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={0.5} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 3 ? 0.24 : 0.3} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ2.mp3" effectVolume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
