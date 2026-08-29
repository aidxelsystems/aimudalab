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

export const UZUMEMESHI_FPS = 30;
export const UZUMEMESHI_WIDTH = 1080;
export const UZUMEMESHI_HEIGHT = 1920;
const SOURCE_FPS = 24;
const VOICE_RATE = 1.06;

const clips = {
  cover: "movie/Rice_paddle_covering_dish_ingred…_202608191956.mp4",
  reveal: "movie/Spoon_revealing_hidden_food_in_202608192220.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / VOICE_RATE) * UZUMEMESHI_FPS));

export const getUzumemeshiTimeline = (episode: Episode) => {
  const hookFrames = framesFor(episode.odaiDuration, 3.1);
  const answerFrames = episode.answers.map((answer) => framesFor(answer.duration, 4));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = framesFor(episode.outroDuration, 3.2);
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
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#120b06"}}>
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
            "linear-gradient(180deg,rgba(0,0,0,.58) 0%,rgba(0,0,0,.08) 31%,rgba(0,0,0,.01) 62%,rgba(0,0,0,.62) 100%)",
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
        backgroundColor: "#fff7d5",
        opacity: interpolate(frame, [0, 2, 5], [0.32, 0.12, 0], {
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
  accent = "#e8b532",
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
}> = ({children, top = 150, accent = "#e8b532", rotate = 0}) => {
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
        transform: `translateY(${interpolate(enter, [0, 1], [-70, 0])}px) scale(${interpolate(enter, [0, 1], [1.1, 1])}) rotate(${rotate}deg)`,
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

const Hook: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.reveal} startSeconds={0} zoom={1.035} position="50% 51%" />
    <SeriesBadge />
    <div
      style={{
        position: "absolute",
        top: 155,
        left: 42,
        right: 42,
        padding: "25px 24px 31px",
        border: "10px solid #140d08",
        borderRadius: 28,
        background: "rgba(255,249,218,.97)",
        boxShadow: "0 16px 0 #140d08,0 34px 65px #000b,inset 0 0 0 5px #e3b12d",
        textAlign: "center",
      }}
    >
      <div style={{color: "#9b6b00", fontSize: 64, lineHeight: 1, fontWeight: 900}}>日本五大名飯</div>
      <div style={{marginTop: 15, fontSize: 50, lineHeight: 1, fontWeight: 900}}>なのに</div>
      <div
        style={{
          marginTop: 13,
          color: "#e2291a",
          fontSize: 126,
          lineHeight: 0.94,
          fontWeight: 900,
          letterSpacing: -5,
          WebkitTextStroke: "4px #140d08",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 #140d08",
        }}
      >
        具がない？
      </div>
    </div>
    <NarrationCaption>日本五大名飯。<br />なのに、具が見えません。</NarrationCaption>
  </AbsoluteFill>
);

const Identity: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.cover} startSeconds={4.45} zoom={1.035} position="50% 51%" />
    <SeriesBadge />
    <PopCard accent="#e7b331">
      <div style={{fontSize: 49, fontWeight: 900}}>正体は</div>
      <div style={{marginTop: 8, color: "#b51d13", fontSize: 72, lineHeight: 1, fontWeight: 900}}>島根県・津和野町</div>
      <div style={{marginTop: 13, fontSize: 112, lineHeight: 0.95, fontWeight: 900}}>うずめ飯</div>
    </PopCard>
    <NarrationCaption>正体は、島根県津和野町の、<br />うずめ飯。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Reveal: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.reveal} startSeconds={2.15} zoom={1.035} position="50% 51%" />
    <SeriesBadge />
    <PopCard accent="#ee8f36" top={142} rotate={-1}>
      <div style={{fontSize: 50, lineHeight: 1, fontWeight: 900}}>ご飯をめくると…</div>
      <div style={{marginTop: 17, color: "#d82a1d", fontSize: 103, lineHeight: 1, fontWeight: 900}}>具がごっそり</div>
      <div style={{marginTop: 20, fontSize: 47, lineHeight: 1, fontWeight: 900}}>タイ・豆腐・野菜</div>
    </PopCard>
    <NarrationCaption accent="#ef933c">ご飯をめくると、<br />タイや野菜が、ごっそり。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Serving: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.reveal} startSeconds={3.6} zoom={1.045} position="50% 52%" />
    <SeriesBadge />
    <PopCard accent="#76bd4f" top={145}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 14}}>
        <span style={{padding: "13px 25px 17px", border: "6px solid #140d08", borderRadius: 999, background: "#fff1bf", fontSize: 58, fontWeight: 900}}>熱いだし</span>
        <span style={{fontSize: 72, fontWeight: 900}}>＋</span>
        <span style={{padding: "13px 25px 17px", border: "6px solid #140d08", borderRadius: 999, background: "#b9df79", fontSize: 58, fontWeight: 900}}>わさび</span>
      </div>
      <div style={{marginTop: 25, color: "#d82a1d", fontSize: 82, lineHeight: 1, fontWeight: 900}}>さらっと食べる</div>
    </PopCard>
    <NarrationCaption accent="#83c65e">熱いだしをかけ、わさびを添えて、<br />さらっと食べます。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const History: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.cover} startSeconds={1.4} zoom={1.055} position="50% 50%" blur={2} />
    <SeriesBadge />
    <PopCard accent="#75573d" top={140} rotate={1}>
      <div style={{fontSize: 47, lineHeight: 1, fontWeight: 900}}>江戸時代</div>
      <div style={{marginTop: 16, color: "#8b4d24", fontSize: 83, lineHeight: 1, fontWeight: 900}}>贅沢を隠した説</div>
      <div style={{marginTop: 23, paddingTop: 20, borderTop: "6px dashed #140d08", fontSize: 55, lineHeight: 1.15, fontWeight: 900}}>具を、ご飯の下へ</div>
    </PopCard>
    <NarrationCaption accent="#b18a5c">江戸時代、贅沢を悟られないため、<br />具を隠した、という説もあります。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Prestige: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 185}});
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.reveal} startSeconds={3.25} zoom={1.04} position="50% 53%" />
      <SeriesBadge />
      <div
        style={{
          position: "absolute",
          top: 145,
          left: 48,
          right: 48,
          transform: `scale(${interpolate(enter, [0, 1], [0.86, 1])})`,
          padding: "29px 27px 36px",
          border: "10px solid #140d08",
          borderRadius: 30,
          background: "rgba(255,249,218,.97)",
          boxShadow: "0 16px 0 #140d08,0 36px 70px #000b,inset 0 0 0 7px #deb02d",
          textAlign: "center",
        }}
      >
        <div style={{color: "#a56c00", fontSize: 91, lineHeight: 1, fontWeight: 900}}>1939年</div>
        <div style={{marginTop: 18, fontSize: 57, lineHeight: 1, fontWeight: 900}}>全国郷土料理調査</div>
        <div style={{marginTop: 22, paddingTop: 19, borderTop: "6px dashed #140d08", color: "#d72a1c", fontSize: 86, lineHeight: 1, fontWeight: 900}}>日本五大名飯</div>
      </div>
      <NarrationCaption>1939年、日本五大名飯の一つに、<br />選ばれました。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 225, mass: 0.55}});
  const shake = frame < 14 ? Math.sin(frame * 2.4) * (14 - frame) * 0.55 : 0;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "repeating-conic-gradient(from -12deg at 50% 50%,#e7b82f 0deg 12deg,#8d5c23 12deg 24deg)",
      }}
    >
      <AbsoluteFill style={{background: "radial-gradient(circle,rgba(255,255,255,.18),rgba(65,35,0,.22))"}} />
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
          transform: `translateX(${shake}px) scale(${interpolate(enter, [0, 1], [1.26, 1])})`,
          padding: "57px 38px 66px",
          border: "13px solid #160b05",
          borderRadius: 40,
          background: "#fff9dc",
          boxShadow: "0 22px 0 #160b05,0 42px 90px #4a2700b8,inset 0 0 0 8px #d9aa2d",
          textAlign: "center",
        }}
      >
        <div style={{fontSize: 58, lineHeight: 1, fontWeight: 900}}>日本五大名飯、</div>
        <div
          style={{
            marginTop: 24,
            color: "#e52b1b",
            fontSize: 86,
            lineHeight: 1.08,
            fontWeight: 900,
            letterSpacing: -4,
            WebkitTextStroke: "3px #160b05",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 #160b05",
          }}
        >
          うまい具を<br />隠すな！
        </div>
        <div style={{width: "86%", margin: "50px 0 40px", borderTop: "9px dashed #160b05"}} />
        <div style={{fontSize: 69, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録も</div>
        <div
          style={{
            marginTop: 24,
            padding: "17px 60px 25px",
            border: "8px solid #160b05",
            borderRadius: 999,
            background: "#a87522",
            color: "#fff",
            fontSize: 112,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 7px 0 #65400b",
            boxShadow: "0 12px 0 #160b05",
          }}
        >
          よろしく
        </div>
        <div style={{marginTop: 55, fontSize: 36, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({
  path,
  effect,
  effectVolume = 0.3,
}) => (
  <>
    {path ? <Audio src={staticFile(path)} playbackRate={VOICE_RATE} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

export const UzumemeshiShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getUzumemeshiTimeline(episode);
  const scenes = [
    <Identity key="identity" />,
    <Reveal key="reveal" />,
    <Serving key="serving" />,
    <History key="history" />,
    <Prestige key="prestige" />,
  ];
  const effects = [
    "Effect/シャキーン1.mp3",
    "Effect/決定ボタンを押す3.mp3",
    "Effect/シャキーン2.mp3",
    "Effect/和太鼓でドン.mp3",
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
            interpolate(frame, [timeline.totalFrames - 30, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp"}),
          )
        }
      />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={0.48} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 3 ? 0.23 : 0.28} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ2.mp3" effectVolume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
