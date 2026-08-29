import React from "react";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { effectPath } from "./lib/effects";
import { Episode } from "./lib/types";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export const MOLE_FPS = 30;
export const MOLE_WIDTH = 1080;
export const MOLE_HEIGHT = 1920;
export const MOLE_PLAYBACK_RATE = 1.2;

const imageRoot = "knowledge/animal-why-star-nosed-mole-01";

const framesForAudio = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / MOLE_PLAYBACK_RATE) * MOLE_FPS));

export const getMoleTimeline = (episode: Episode) => {
  const hookFrames = framesForAudio(episode.odaiDuration, 2.6);
  const answerFrames = episode.answers.map((answer) =>
    framesForAudio(answer.duration, 3)
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  answerFrames.forEach((duration) => {
    answerStarts.push(cursor);
    cursor += duration;
  });
  const outroFrames = framesForAudio(episode.outroDuration, 5.2);
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    questionFrom: answerStarts[2],
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const FullImage: React.FC<{
  src: string;
  zoom?: number;
  dim?: number;
  position?: string;
}> = ({ src, zoom = 1.035, dim = 0.12, position = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 170], [zoom, zoom + 0.055], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#120d08" }}>
      <Img
        src={staticFile(src)}
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
          background: `linear-gradient(180deg, rgba(0,0,0,${Math.max(
            0.24,
            dim
          )}) 0%, rgba(0,0,0,0.01) 43%, rgba(0,0,0,${dim}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const TopCard: React.FC<{
  children: React.ReactNode;
  top?: number;
  accent?: string;
  background?: string;
  padding?: string;
}> = ({
  children,
  top = 70,
  accent = "#ff7794",
  background = "rgba(255,248,214,0.97)",
  padding = "26px 32px 34px",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 190 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 48,
        right: 48,
        transform: `translateY(${interpolate(enter, [0, 1], [-110, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.92, 1]
        )})`,
        transformOrigin: "50% 0%",
        padding,
        background,
        border: "9px solid #111",
        borderRadius: 30,
        boxShadow: `0 15px 0 #111, inset 0 0 0 5px ${accent}, 0 28px 60px #0009`,
        textAlign: "center",
        color: "#111",
      }}
    >
      {children}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 7, stiffness: 230, mass: 0.55 } });
  const flash = interpolate(frame, [0, 3, 10], [0.18, 0.05, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.06} dim={0.08} />
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <div
        style={{
          position: "absolute",
          top: 58,
          left: 46,
          right: 46,
          transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])}) rotate(${interpolate(
            enter,
            [0, 1],
            [-2.5, 0]
          )}deg)`,
          transformOrigin: "50% 10%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px 34px 14px",
            background: "#111",
            border: "6px solid #fff",
            color: "#fff",
            fontSize: 58,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 2,
            textShadow: "0 4px 0 #8a0017",
            boxShadow: "0 11px 0 #111",
          }}
        >
          ホシバナモグラ編
        </div>
        <div
          style={{
            marginTop: 18,
            padding: "23px 25px 29px",
            background: "rgba(255,247,207,0.97)",
            border: "10px solid #111",
            boxShadow: "0 17px 0 #111, 0 32px 60px #000a",
          }}
        >
          <div style={{ fontSize: 103, lineHeight: 0.94, fontWeight: 900, letterSpacing: 2 }}>
            この体、
            <br />
            <span style={{ color: "#ff2649", WebkitTextStroke: "3px #111", paintOrder: "stroke fill" }}>
              何のため!?
            </span>
          </div>
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 26,
            padding: "13px 28px 18px",
            background: "#ff2649",
            border: "8px solid #111",
            color: "#fff",
            fontSize: 59,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 1,
            textShadow: "0 5px 0 #8a0017",
            boxShadow: "0 11px 0 #111",
          }}
        >
          まさか…顔に
          <span
            style={{
              marginLeft: 16,
              color: "#fff36b",
              fontSize: 86,
              WebkitTextStroke: "4px #111",
              paintOrder: "stroke fill",
              textShadow: "0 7px 0 #111",
            }}
          >
            22本!?
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NotTentacles: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.97, 1.035]);
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/star-closeup.png`} zoom={1.045} dim={0.1} />
      <TopCard accent="#ff6687" padding="25px 30px 32px">
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
          {["鼻毛でも", "触手でも"].map((label) => (
            <div
              key={label}
              style={{
                minWidth: 360,
                padding: "13px 18px 18px",
                borderRadius: 25,
                background: "#ff6687",
                border: "6px solid #111",
                color: "#fff",
                fontSize: 54,
                lineHeight: 1,
                fontWeight: 900,
                textShadow: "0 4px 0 #8b0017",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 21,
            color: "#ff2649",
            fontSize: 102,
            lineHeight: 0.95,
            fontWeight: 900,
            transform: `scale(${pulse})`,
            WebkitTextStroke: "3px #111",
            paintOrder: "stroke fill",
          }}
        >
          ない
        </div>
      </TopCard>
    </AbsoluteFill>
  );
};

const MovingStar: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = Math.sin(frame / 3.2) * 2.5;
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/dark-tunnel.png`} zoom={1.04} dim={0.08} />
      <TopCard accent="#ffd34a">
        <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 900 }}>暗闇で</div>
        <div
          style={{
            marginTop: 12,
            color: "#d91f48",
            fontSize: 83,
            lineHeight: 1,
            fontWeight: 900,
            transform: `rotate(${angle}deg)`,
          }}
        >
          この“星”を
        </div>
        <div style={{ marginTop: 10, fontSize: 83, lineHeight: 1, fontWeight: 900 }}>
          高速で動かす
        </div>
      </TopCard>
    </AbsoluteFill>
  );
};

const ChoiceRow: React.FC<{
  letter: string;
  label: string;
  color: string;
  active: boolean;
}> = ({ letter, label, color, active }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      marginTop: 13,
      padding: "9px 22px 12px",
      borderRadius: 22,
      background: active ? color : "#fffdf0",
      border: `5px solid ${active ? "#111" : "#807a68"}`,
      boxShadow: active ? "0 7px 0 #111" : "none",
      transform: active ? "scale(1.035)" : "scale(1)",
    }}
  >
    <span
      style={{
        width: 74,
        height: 74,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: color,
        border: "5px solid #111",
        fontSize: 47,
        lineHeight: 1,
        fontWeight: 900,
      }}
    >
      {letter}
    </span>
    <span style={{ fontSize: 51, lineHeight: 1, fontWeight: 900 }}>{label}</span>
  </div>
);

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame < 48 ? -1 : Math.min(2, Math.floor((frame - 48) / 57));
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/star-closeup.png`} zoom={1.05} dim={0.13} />
      <TopCard top={58} accent="#ffd348" padding="21px 29px 29px">
        <div
          style={{
            display: "inline-block",
            padding: "7px 25px 10px",
            borderRadius: 999,
            background: "#111",
            color: "#fff",
            fontSize: 36,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          ここで問題
        </div>
        <div style={{ marginTop: 12, fontSize: 62, lineHeight: 1, fontWeight: 900 }}>
          この星形、何のため？
        </div>
        <ChoiceRow letter="A" label="においを集める" color="#ffd348" active={active === 0} />
        <ChoiceRow letter="B" label="触って探す" color="#56d9e7" active={active === 1} />
        <ChoiceRow letter="C" label="土を掘る" color="#ff7994" active={active === 2} />
      </TopCard>
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 7, stiffness: 225, mass: 0.56 } });
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/touch-prey.png`} zoom={1.05} dim={0.1} />
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 60,
          right: 60,
          transform: `scale(${interpolate(enter, [0, 1], [2.05, 1])})`,
          transformOrigin: "50% 15%",
          padding: "32px 25px 43px",
          background: "rgba(255,247,207,0.98)",
          border: "10px solid #111",
          boxShadow: "0 18px 0 #111, 0 35px 70px #000a",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 65, lineHeight: 1, fontWeight: 900 }}>正解は</div>
        <div
          style={{
            marginTop: 4,
            color: "#35d4e3",
            fontSize: 166,
            lineHeight: 0.9,
            fontWeight: 900,
            WebkitTextStroke: "6px #111",
            paintOrder: "stroke fill",
            textShadow: "0 10px 0 #111",
          }}
        >
          B！
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TouchFact: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/touch-prey.png`} zoom={1.045} dim={0.08} />
    <TopCard accent="#50d8e5">
      <div style={{ fontSize: 83, lineHeight: 1, fontWeight: 900 }}>22本の突起で</div>
      <div
        style={{
          marginTop: 17,
          color: "#087f8d",
          fontSize: 99,
          lineHeight: 0.95,
          fontWeight: 900,
        }}
      >
        周囲に触れる
      </div>
    </TopCard>
  </AbsoluteFill>
);

const ReceptorFact: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 15 + Math.sin(frame / 5) * 7;
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/sensory-world.png`} zoom={1.035} dim={0.1} />
      <TopCard accent="#ffc94d" background="rgba(28,18,8,0.94)" padding="23px 28px 31px">
        <div
          style={{
            display: "inline-block",
            padding: "7px 24px 10px",
            borderRadius: 999,
            background: "#ff3653",
            border: "5px solid #fff",
            color: "#fff",
            fontSize: 36,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          AIイメージ
        </div>
        <div style={{ marginTop: 13, color: "#fff", fontSize: 55, lineHeight: 1, fontWeight: 900 }}>
          表面には
        </div>
        <div
          style={{
            marginTop: 9,
            color: "#ffd45b",
            fontSize: 94,
            lineHeight: 0.96,
            fontWeight: 900,
            textShadow: `0 0 ${glow}px #ffae27`,
          }}
        >
          約2万5千個の
        </div>
        <div style={{ marginTop: 8, color: "#fff", fontSize: 78, lineHeight: 1, fontWeight: 900 }}>
          触覚器官
        </div>
      </TopCard>
    </AbsoluteFill>
  );
};

const Fingertip: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/star-closeup.png`} zoom={1.055} dim={0.14} />
    <TopCard accent="#ff6687">
      <div style={{ fontSize: 67, lineHeight: 1, fontWeight: 900 }}>鼻というより</div>
      <div
        style={{
          marginTop: 16,
          color: "#ff2649",
          fontSize: 91,
          lineHeight: 1,
          fontWeight: 900,
          WebkitTextStroke: "3px #111",
          paintOrder: "stroke fill",
          textShadow: "0 7px 0 #111",
        }}
      >
        超高性能な“指先”
      </div>
    </TopCard>
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.075} dim={0.38} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.16)" }} />
      <div
        style={{
          position: "absolute",
          top: 68,
          left: 50,
          right: 50,
          transform: `scale(${interpolate(enter, [0, 1], [0.72, 1])})`,
          transformOrigin: "50% 10%",
          padding: "25px 30px 32px",
          background: "rgba(255,247,207,0.97)",
          border: "10px solid #111",
          boxShadow: "0 18px 0 #111, 0 35px 75px #000b",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 28px 12px",
            borderRadius: 999,
            background: "#b51f43",
            border: "5px solid #111",
            color: "#fff",
            fontSize: 39,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          この体、何のため？
        </div>
        <div style={{ marginTop: 16, fontSize: 66, lineHeight: 1.06, fontWeight: 900 }}>
          見た目は触手、
          <br />
          役割は指先
        </div>
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "5px dashed #111",
            color: "#ff2649",
            fontSize: 54,
            lineHeight: 1.06,
            fontWeight: 900,
          }}
        >
          チャンネル登録も
          <br />
          よろしく！
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{
  path?: string;
  effect: string;
  effectVolume?: number;
}> = ({ path, effect, effectVolume = 0.42 }) => (
  <>
    {path ? <Audio src={staticFile(path)} playbackRate={MOLE_PLAYBACK_RATE} /> : null}
    <Audio src={staticFile(effect)} volume={effectVolume} />
  </>
);

export const StarNosedMoleWhyShort: React.FC<{ episode: Episode }> = ({ episode }) => {
  const timeline = getMoleTimeline(episode);
  const scenes = [
    <NotTentacles key="not-tentacles" />,
    <MovingStar key="moving-star" />,
    <Question key="question" />,
    <Reveal key="reveal" />,
    <TouchFact key="touch-fact" />,
    <ReceptorFact key="receptors" />,
    <Fingertip key="fingertip" />,
  ];
  const effects = [
    effectPath.pop,
    effectPath.shine,
    effectPath.pop,
    effectPath.correct,
    effectPath.pop,
    effectPath.shine,
    effectPath.shine,
  ];
  const volumes = [0.34, 0.38, 0.32, 0.64, 0.34, 0.4, 0.42];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#120d08",
        fontFamily: `${fontFamily}, 'Yu Gothic', sans-serif`,
      }}
    >
      <Audio
        src={staticFile(episode.bgm ?? "BGM/If I Had a Chicken - Kevin MacLeod.mp3")}
        loop
        volume={(frame) => {
          const fadeIn = Math.min(1, frame / 24);
          const fadeOut = Math.min(1, (timeline.totalFrames - frame) / 35);
          return 0.075 * Math.max(0, Math.min(fadeIn, fadeOut));
        }}
      />

      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect={effectPath.titleHeavy} effectVolume={0.58} />
      </Sequence>

      {episode.answers.map((answer, index) => (
        <Sequence
          key={answer.id}
          from={timeline.answerStarts[index]}
          durationInFrames={timeline.answerFrames[index]}
        >
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={effects[index]} effectVolume={volumes[index]} />
        </Sequence>
      ))}

      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <SceneAudio path={episode.outroAudioFile} effect={effectPath.shine} effectVolume={0.42} />
      </Sequence>
    </AbsoluteFill>
  );
};
