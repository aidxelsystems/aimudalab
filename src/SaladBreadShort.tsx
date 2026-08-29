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

export const SALAD_BREAD_FPS = 30;
export const SALAD_BREAD_WIDTH = 1080;
export const SALAD_BREAD_HEIGHT = 1920;
const VOICE_RATE = 1.06;

const clips = {
  mix: "movie/Spoon_spreading_filling_in_bread_202608141221.mp4",
  hero: "movie/Takuan_salad_bread_on_plate_202608141225.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / VOICE_RATE) * SALAD_BREAD_FPS));

export const getSaladBreadTimeline = (episode: Episode) => {
  const hookFrames = framesFor(episode.odaiDuration, 3.5);
  const answerFrames = episode.answers.map((answer) => framesFor(answer.duration, 4.5));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = framesFor(episode.outroDuration, 4.2);
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
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#120b05"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * SALAD_BREAD_FPS)}
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
            "linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.14) 31%,rgba(0,0,0,.02) 61%,rgba(0,0,0,.66) 100%)",
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
        backgroundColor: "#fff9d9",
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
        left: 44,
        right: 155,
        bottom: 260,
        padding: "17px 25px 21px",
        borderLeft: `11px solid ${accent}`,
        borderRadius: 16,
        background: "rgba(6,5,4,.86)",
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
      <FoodVideo src={clips.hero} startSeconds={4.45} zoom={1.045} position="50% 53%" />
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
          <div style={{fontSize: 62, lineHeight: 1, fontWeight: 900}}>サラダパンの中身</div>
          <div
            style={{
              marginTop: 12,
              color: "#d9a311",
              fontSize: 142,
              lineHeight: 0.92,
              fontWeight: 900,
              WebkitTextStroke: "5px #140d08",
              paintOrder: "stroke fill",
              textShadow: "0 10px 0 #140d08",
            }}
          >
            たくあん
          </div>
        </div>
      </div>
      <NarrationCaption>まさか。サラダパンの中身、たくあんです。</NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.hero} startSeconds={0.15} zoom={1.035} position="50% 52%" />
    <SeriesBadge />
    <PopCard accent="#f0bf36">
      <div style={{fontSize: 48, fontWeight: 900}}>正体は</div>
      <div style={{marginTop: 6, color: "#b51d13", fontSize: 75, lineHeight: 1, fontWeight: 900}}>滋賀県・長浜市</div>
      <div style={{marginTop: 12, fontSize: 105, lineHeight: 0.95, fontWeight: 900}}>サラダパン</div>
    </PopCard>
    <NarrationCaption>滋賀県長浜市の名物、サラダパン。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Recipe: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.mix} startSeconds={0} zoom={1.03} position="50% 50%" />
    <SeriesBadge />
    <PopCard accent="#e9c233" top={145}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap"}}>
        <span style={{padding: "11px 20px 14px", border: "5px solid #140d08", borderRadius: 999, background: "#f6cf3c", fontSize: 49, lineHeight: 1, fontWeight: 900}}>刻みたくあん</span>
        <span style={{fontSize: 63, lineHeight: 1, fontWeight: 900}}>×</span>
        <span style={{padding: "11px 20px 14px", border: "5px solid #140d08", borderRadius: 999, background: "#fff6d2", fontSize: 49, lineHeight: 1, fontWeight: 900}}>マヨ</span>
      </div>
      <div style={{marginTop: 24, fontSize: 55, lineHeight: 1, fontWeight: 900}}>混ぜたら</div>
      <div style={{marginTop: 11, color: "#d52718", fontSize: 76, lineHeight: 1, fontWeight: 900}}>コッペパンへ！</div>
    </PopCard>
    <NarrationCaption accent="#f1c83c">刻みたくあんをマヨであえて、<br/>コッペパンへ。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const History: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [18, 34], [0, 1], {
    easing: Easing.out(Easing.back(1.7)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.mix} startSeconds={0} zoom={1.08} position="50% 48%" blur={5} />
      <SeriesBadge />
      <PopCard accent="#7bc94c" top={140}>
        <div style={{fontSize: 42, lineHeight: 1, fontWeight: 900}}>1957年、最初の具は</div>
        <div style={{marginTop: 13, color: "#269145", fontSize: 88, lineHeight: 1, fontWeight: 900}}>キャベツ</div>
        <div style={{marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 20}}>
          <div style={{padding: "13px 20px 16px", border: "5px solid #195a8c", borderRadius: 18, background: "#c9ecff", color: "#164c72", fontSize: 39, lineHeight: 1.1, fontWeight: 900}}>水分で<br/>パンがふやける</div>
          <div style={{fontSize: 76, fontWeight: 900, opacity: arrow, transform: `translateX(${(1 - arrow) * -30}px)`}}>→</div>
          <div style={{padding: "13px 22px 16px", border: "5px solid #7d5d00", borderRadius: 18, background: "#f7d240", color: "#5e4200", fontSize: 47, lineHeight: 1.1, fontWeight: 900, opacity: arrow}}>1962年<br/>たくあん</div>
        </div>
      </PopCard>
      <NarrationCaption accent="#79d75a">
        <span style={{display: "block"}}>最初はキャベツ。でも水分で販売停止。</span>
        <span style={{display: "block"}}>5年後、たくあんで復活。</span>
      </NarrationCaption>
      <SceneFlash />
    </AbsoluteFill>
  );
};

const Texture: React.FC = () => (
  <AbsoluteFill>
    <FoodVideo src={clips.hero} startSeconds={3.8} zoom={1.04} position="50% 54%" />
    <SeriesBadge />
    <PopCard accent="#f0c430" top={150} rotate={-1}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 18}}>
        <div style={{padding: "15px 22px 19px", border: "6px solid #140d08", borderRadius: 22, background: "#fff4cd", fontSize: 60, fontWeight: 900}}>ふわふわ</div>
        <div style={{fontSize: 65, fontWeight: 900}}>×</div>
        <div style={{padding: "15px 22px 19px", border: "6px solid #140d08", borderRadius: 22, background: "#f5cf35", fontSize: 60, fontWeight: 900}}>ポリポリ</div>
      </div>
      <div style={{marginTop: 25, color: "#d62818", fontSize: 84, lineHeight: 1, fontWeight: 900}}>意外と合う。</div>
    </PopCard>
    <NarrationCaption accent="#ffd149">ふわふわのパンに、たくあんがポリポリ。<br/>意外と合う。</NarrationCaption>
    <SceneFlash />
  </AbsoluteFill>
);

const Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 185}});
  return (
    <AbsoluteFill>
      <FoodVideo src={clips.hero} startSeconds={0.3} zoom={1.04} position="50% 53%" />
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
        <div style={{fontSize: 59, lineHeight: 1, fontWeight: 900}}>具が変わっても</div>
        <div style={{marginTop: 13, color: "#e32719", fontSize: 86, lineHeight: 1, fontWeight: 900}}>名前はそのまま</div>
        <div style={{marginTop: 22, paddingTop: 18, borderTop: "5px dashed #140d08", fontSize: 63, lineHeight: 1.1, fontWeight: 900}}><span style={{color: "#d49b00", fontSize: 94}}>60年以上</span><br/>愛される名物</div>
      </div>
      <NarrationCaption>
        <span style={{display: "block"}}>名前はそのまま。</span>
        <span style={{display: "block"}}>60年以上愛される、滋賀の名物です。</span>
      </NarrationCaption>
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
        background: "repeating-conic-gradient(from -12deg at 50% 50%,#f5cf38 0deg 12deg,#4fae45 12deg 24deg)",
      }}
    >
      <AbsoluteFill style={{background: "radial-gradient(circle,rgba(255,255,255,.16),rgba(20,65,0,.2))"}} />
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
          boxShadow: "0 22px 0 #160b05,0 42px 90px #173a00b8,inset 0 0 0 8px #63b84c",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#e52b1b",
            fontSize: 74,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: -4,
            WebkitTextStroke: "3px #160b05",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 #160b05",
          }}
        >
          <span style={{display: "block"}}>サラダ、</span>
          <span style={{display: "block"}}>どこ行ったんかい！</span>
        </div>
        <div style={{width: "86%", margin: "62px 0 48px", borderTop: "9px dashed #160b05"}} />
        <div style={{fontSize: 72, lineHeight: 1.08, fontWeight: 900}}>チャンネル登録も</div>
        <div
          style={{
            marginTop: 27,
            padding: "18px 62px 26px",
            border: "8px solid #160b05",
            borderRadius: 999,
            background: "#45a640",
            color: "#fff",
            fontSize: 118,
            lineHeight: 1,
            fontWeight: 900,
            textShadow: "0 7px 0 #195f1f",
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

export const SaladBreadShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getSaladBreadTimeline(episode);
  const scenes = [
    <Identity key="identity" />,
    <Recipe key="recipe" />,
    <History key="history" />,
    <Texture key="texture" />,
    <Legacy key="legacy" />,
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
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={index === 2 ? 0.24 : 0.3} />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <FinalCta />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ2.mp3" effectVolume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
