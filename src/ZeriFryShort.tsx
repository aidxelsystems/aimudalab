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

export const ZERI_FPS = 30;
export const ZERI_WIDTH = 1080;
export const ZERI_HEIGHT = 1920;
const VOICE_RATE = 1.1;

const clips = {
  fry: "movie/Cooking_Zeri_Fry_in_oil_202608140950.mp4",
  small: "movie/Making_Japanese_zeri_fry_video_202608140959.mp4",
  cut: "movie/Zeri_fry_food_commercial_1080p_202608140957.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / VOICE_RATE) * ZERI_FPS));

export const getZeriTimeline = (episode: Episode) => {
  const hookFrames = framesFor(episode.odaiDuration, 3.7);
  const answerFrames = episode.answers.map((answer) => framesFor(answer.duration, 4.3));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = framesFor(episode.outroDuration, 5);
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
}> = ({src, startSeconds = 0, zoom = 1.02, position = "50% 50%"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [zoom, zoom + 0.035], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#130b06"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * ZERI_FPS)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,.66) 0%,rgba(0,0,0,.12) 31%,rgba(0,0,0,.02) 59%,rgba(0,0,0,.62) 100%)",
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
        backgroundColor: "#fff8df",
        opacity: interpolate(frame, [0, 2, 6], [0.7, 0.26, 0], {
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
        left: 44,
        right: 155,
        bottom: 260,
        padding: "17px 25px 21px",
        borderLeft: `11px solid ${accent}`,
        borderRadius: 16,
        background: "rgba(6,5,4,.84)",
        color: "#fff",
        fontSize: 39,
        lineHeight: 1.28,
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
        background: "rgba(255,250,224,.96)",
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
      <FoodVideo src={clips.fry} startSeconds={4.38} zoom={1.045} position="52% 48%" />
      <SeriesBadge />
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 42,
          right: 42,
          textAlign: "center",
          transform: `scale(${interpolate(boom, [0, 1], [1.55, 1]) * pulse})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "9px 36px 14px",
            background: "#e51f17",
            border: "8px solid #fff",
            color: "#fff",
            fontSize: 76,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 6px 0 #760b06",
            boxShadow: "0 12px 0 #170a06,0 28px 55px #000b",
          }}
        >
          衝撃
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
          <div style={{fontSize: 67, lineHeight: 1, fontWeight: 900}}>ゼリーフライなのに</div>
          <div
            style={{
              marginTop: 9,
              color: "#e51f17",
              fontSize: 144,
              lineHeight: 0.92,
              fontWeight: 900,
              WebkitTextStroke: "5px #140d08",
              paintOrder: "stroke fill",
              textShadow: "0 10px 0 #140d08",
            }}
          >
            ゼリー0％
          </div>
        </div>
      </div>
      <NarrationCaption>衝撃。これ、ゼリー0％です。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.fry} startSeconds={1.7} zoom={1.035} position="50% 49%" />
    <SeriesBadge />
    <PopCard accent="#ff9c35">
      <div style={{fontSize: 48, fontWeight: 900}}>正体は</div>
      <div style={{marginTop: 6, color: "#b51d13", fontSize: 72, lineHeight: 1, fontWeight: 900}}>埼玉県・行田市</div>
      <div style={{marginTop: 10, fontSize: 102, lineHeight: 0.95, fontWeight: 900}}>ゼリーフライ</div>
    </PopCard>
    <NarrationCaption>埼玉県行田市のご当地グルメ、ゼリーフライ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Ingredients: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.fry} startSeconds={0} zoom={1.03} position="50% 51%" />
    <SeriesBadge />
    <PopCard accent="#7dc94d" top={145}>
      <div style={{display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap"}}>
        {["おから", "じゃがいも", "野菜"].map((item, index) => (
          <span
            key={item}
            style={{
              padding: "12px 22px 15px",
              border: "5px solid #140d08",
              borderRadius: 999,
              background: ["#ffe178", "#fff1b8", "#b9e889"][index],
              fontSize: 46,
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div style={{marginTop: 22, fontSize: 55, lineHeight: 1, fontWeight: 900}}>小判型にして</div>
      <div style={{marginTop: 12, color: "#e32719", fontSize: 68, lineHeight: 1.05, fontWeight: 900}}>パン粉なしで<br/>そのまま油へ</div>
    </PopCard>
    <NarrationCaption accent="#9ee05f">おからとじゃがいも、野菜を小判型に。パン粉をつけず、そのまま油へ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Sauce: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.fry} startSeconds={4.05} zoom={1.045} position="51% 48%" />
    <SeriesBadge />
    <PopCard accent="#f06a2a" top={150} rotate={-1}>
      <div style={{fontSize: 58, lineHeight: 1, fontWeight: 900}}>揚げたてを</div>
      <div style={{marginTop: 11, color: "#b72b13", fontSize: 112, lineHeight: 0.95, fontWeight: 900}}>ソースへ！</div>
      <div style={{marginTop: 17, fontSize: 47, lineHeight: 1, fontWeight: 900}}>香ばしい × ほくほく</div>
    </PopCard>
    <NarrationCaption accent="#ff7535">ソースにさっとくぐらせれば、外は香ばしく、中はほくほく。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const NameOrigin: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [16, 31], [0, 1], {
    easing: Easing.out(Easing.back(1.7)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.fry} startSeconds={2.45} zoom={1.04} position="50% 49%" />
      <SeriesBadge />
      <PopCard accent="#f1be35" top={140}>
        <div style={{fontSize: 45, fontWeight: 900}}>小判のような形から</div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 14}}>
          <div
            style={{
              width: 178,
              height: 178,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "8px solid #6c3b09",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 25%,#fff19c,#e3a52a 65%,#9a5a10)",
              color: "#6a3608",
              fontSize: 92,
              fontWeight: 900,
              boxShadow: "inset 0 0 0 8px #ffd960,0 9px 0 #5d3108",
            }}
          >
            銭
          </div>
          <div style={{fontSize: 88, fontWeight: 900, opacity: arrow, transform: `translateX(${(1 - arrow) * -35}px)`}}>→</div>
          <div style={{color: "#d62818", fontSize: 65, lineHeight: 1.02, fontWeight: 900, opacity: arrow}}>ゼリー<br/>フライ</div>
        </div>
        <div style={{marginTop: 19, fontSize: 42, fontWeight: 900}}>「銭フライ」がなまった説</div>
      </PopCard>
      <NarrationCaption accent="#ffd149">「銭フライ」がなまって、ゼリーフライになったと言われています。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 185}});
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.cut} startSeconds={3.15} zoom={1.045} position="50% 51%" />
      <SeriesBadge />
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 48,
          right: 48,
          transform: `scale(${interpolate(enter, [0, 1], [0.82, 1])})`,
          padding: "31px 25px 38px",
          border: "10px solid #140d08",
          borderRadius: 30,
          background: "rgba(255,249,218,.97)",
          boxShadow: "0 16px 0 #140d08,0 36px 70px #000b",
          textAlign: "center",
        }}
      >
        <div style={{fontSize: 64, lineHeight: 1, fontWeight: 900}}>名前は謎。</div>
        <div style={{marginTop: 13, color: "#e32719", fontSize: 77, lineHeight: 1.02, fontWeight: 900}}>100年<br/>愛される味。</div>
        <div style={{marginTop: 22, paddingTop: 18, borderTop: "5px dashed #140d08", fontSize: 47, lineHeight: 1.1, fontWeight: 900}}>これは食べたい。</div>
      </div>
      <NarrationCaption>
        <span style={{display: "block"}}>行田で100年愛されているおやつ。</span>
        <span style={{display: "block"}}>これは食べたい。</span>
      </NarrationCaption>
      <div
        style={{
          position: "absolute",
          right: 45,
          bottom: 55,
          padding: "10px 18px 13px",
          borderRadius: 999,
          border: "4px solid #fff",
          background: "#e32719",
          color: "white",
          fontSize: 30,
          lineHeight: 1,
          fontWeight: 900,
        }}
      >
        AIのムダづかい
      </div>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const FinalCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 225, mass: 0.55}});
  const shake = frame < 18 ? Math.sin(frame * 2.4) * (18 - frame) * 0.65 : 0;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "repeating-conic-gradient(from -12deg at 50% 50%,#ffcf35 0deg 12deg,#ef321f 12deg 24deg)",
      }}
    >
      <AbsoluteFill style={{background: "radial-gradient(circle,rgba(255,255,255,.16),rgba(65,0,0,.18))"}} />
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
          boxShadow: "0 22px 0 #160b05,0 42px 90px #3a0000b8,inset 0 0 0 8px #f33a20",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#e52b1b",
            fontSize: 76,
            lineHeight: 1.08,
            fontWeight: 900,
            letterSpacing: -2,
            WebkitTextStroke: "3px #160b05",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 #160b05",
          }}
        >
          ゼリー入ってないんかい！
        </div>
        <div style={{width: "86%", margin: "62px 0 48px", borderTop: "9px dashed #160b05"}} />
        <div style={{fontSize: 72, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録も</div>
        <div
          style={{
            marginTop: 27,
            padding: "18px 62px 26px",
            border: "8px solid #160b05",
            borderRadius: 999,
            background: "#e52b1b",
            color: "#fff",
            fontSize: 118,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 7px 0 #7d0f08",
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

export const ZeriFryShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getZeriTimeline(episode);
  const scenes = [<Identity key="identity" />, <Ingredients key="ingredients" />, <Sauce key="sauce" />, <NameOrigin key="origin" />, <Closing key="closing" />];
  const effects = ["Effect/シャキーン1.mp3", "Effect/決定ボタンを押す3.mp3", "Effect/シャキーン2.mp3", "Effect/和太鼓でドン.mp3", "Effect/シャキーン1.mp3"];
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
            interpolate(frame, [timeline.totalFrames - 35, timeline.totalFrames], [1, 0], {
              extrapolateLeft: "clamp",
            }),
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
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 4 ? 0.25 : 0.3} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ2.mp3" effectVolume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
