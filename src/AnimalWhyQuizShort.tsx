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

export const ANIMAL_WHY_FPS = 30;
export const ANIMAL_WHY_WIDTH = 1080;
export const ANIMAL_WHY_HEIGHT = 1920;
export const ANIMAL_WHY_PLAYBACK_RATE = 1.16;

const imageRoot = "knowledge/animal-why-platypus-01";

const framesForAudio = (seconds: number | undefined, fallback: number) =>
  Math.max(
    1,
    Math.ceil(((seconds ?? fallback) / ANIMAL_WHY_PLAYBACK_RATE) * ANIMAL_WHY_FPS)
  );

export const getAnimalWhyTimeline = (episode: Episode) => {
  const hookFrames = framesForAudio(episode.odaiDuration, 3.7);
  const answerFrames = episode.answers.map((answer) =>
    framesForAudio(answer.duration, 3.5)
  );
  const outroFrames = framesForAudio(episode.outroDuration, 5.1);
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  answerFrames.forEach((duration) => {
    answerStarts.push(cursor);
    cursor += duration;
  });
  return {
    hookFrames,
    answerFrames,
    answerStarts,
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
}> = ({ src, zoom = 1.04, dim = 0.12, position = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 160], [zoom, zoom + 0.055], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#03131a" }}>
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
            0.25,
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
  top = 72,
  accent = "#23d7e8",
  background = "rgba(255,248,214,0.97)",
  padding = "26px 32px 34px",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 190 } });
  const y = interpolate(enter, [0, 1], [-115, 0]);
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 48,
        right: 48,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: "50% 0%",
        padding,
        background,
        border: "9px solid #101010",
        borderRadius: 30,
        boxShadow: `0 15px 0 #101010, inset 0 0 0 5px ${accent}, 0 28px 60px #0009`,
        textAlign: "center",
        color: "#101010",
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
  const scale = interpolate(enter, [0, 1], [1.24, 1]);
  const rotate = interpolate(enter, [0, 1], [-2.5, 0]);
  const flash = interpolate(frame, [0, 3, 10], [0.18, 0.05, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.07} dim={0.1} />
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 45,
          right: 45,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: "50% 10%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "7px 40px 13px",
            background: "#ff2844",
            border: "8px solid #111",
            color: "#fff",
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 4,
            textShadow: "0 6px 0 #8d0016",
            boxShadow: "0 11px 0 #111",
          }}
        >
          まさか…
        </div>
        <div
          style={{
            marginTop: 18,
            padding: "22px 24px 27px",
            background: "rgba(255,247,207,0.97)",
            border: "10px solid #111",
            boxShadow: "0 17px 0 #111, 0 32px 60px #000a",
          }}
        >
          <div style={{ fontSize: 78, lineHeight: 1.02, fontWeight: 900 }}>
            目・耳・鼻を閉じて
          </div>
          <div
            style={{
              marginTop: 9,
              color: "#ff2844",
              fontSize: 122,
              lineHeight: 0.92,
              fontWeight: 900,
              WebkitTextStroke: "4px #111",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #111",
            }}
          >
            狩る!?
          </div>
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 17,
            padding: "10px 36px 14px",
            borderRadius: 999,
            background: "#111",
            color: "#fff",
            fontSize: 46,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          どうやって？
        </div>
      </div>
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
      gap: 20,
      marginTop: 14,
      padding: "10px 24px 13px",
      borderRadius: 22,
      background: active ? color : "#fffdf0",
      border: `5px solid ${active ? "#111" : "#7f7b69"}`,
      boxShadow: active ? "0 7px 0 #111" : "none",
      transform: active ? "scale(1.035)" : "scale(1)",
    }}
  >
    <span
      style={{
        width: 78,
        height: 78,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: color,
        border: "5px solid #111",
        fontSize: 49,
        lineHeight: 1,
        fontWeight: 900,
      }}
    >
      {letter}
    </span>
    <span style={{ fontSize: 55, lineHeight: 1, fontWeight: 900 }}>{label}</span>
  </div>
);

const Choices: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(2, Math.floor(frame / 48));
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/closed-senses.png`} zoom={1.05} dim={0.13} />
      <TopCard top={60} accent="#ffd52c" padding="22px 30px 30px">
        <div style={{ fontSize: 59, lineHeight: 1.04, fontWeight: 900 }}>
          どうやって獲物を見つける？
        </div>
        <ChoiceRow letter="A" label="超音波" color="#ffd52c" active={active === 0} />
        <ChoiceRow
          letter="B"
          label="くちばしで電気"
          color="#36dce8"
          active={active === 1}
        />
        <ChoiceRow letter="C" label="水の味" color="#ff7187" active={active === 2} />
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
      <FullImage src={`${imageRoot}/bill-and-prey.png`} zoom={1.06} dim={0.12} />
      <div
        style={{
          position: "absolute",
          top: 105,
          left: 60,
          right: 60,
          transform: `scale(${interpolate(enter, [0, 1], [2.1, 1])})`,
          transformOrigin: "50% 15%",
          padding: "34px 25px 46px",
          background: "rgba(255,247,207,0.98)",
          border: "10px solid #111",
          boxShadow: "0 18px 0 #111, 0 35px 70px #000a",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#111", fontSize: 66, fontWeight: 900 }}>正解は</div>
        <div
          style={{
            color: "#24d7e5",
            fontSize: 170,
            lineHeight: 0.88,
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

const ClosedSenses: React.FC = () => (
  <AbsoluteFill>
    <FullImage src={`${imageRoot}/closed-senses.png`} zoom={1.05} dim={0.12} />
    <TopCard accent="#ff526d">
      <div style={{ fontSize: 58, lineHeight: 1, fontWeight: 900 }}>水中では</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 13, marginTop: 17 }}>
        {["目", "耳", "鼻"].map((label) => (
          <div
            key={label}
            style={{
              minWidth: 210,
              padding: "10px 18px 15px",
              background: "#ff526d",
              border: "6px solid #111",
              borderRadius: 23,
              color: "#fff",
              fontSize: 66,
              lineHeight: 1,
              fontWeight: 900,
              textShadow: "0 4px 0 #8b0014",
            }}
          >
            {label} ×
          </div>
        ))}
      </div>
      <div style={{ marginTop: 17, fontSize: 88, lineHeight: 1, fontWeight: 900 }}>
        全部、閉じる
      </div>
    </TopCard>
  </AbsoluteFill>
);

const BillSense: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.94, 1.04]);
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/bill-and-prey.png`} zoom={1.04} dim={0.1} />
      <TopCard accent="#28d8e5" padding="25px 28px 31px">
        <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 900 }}>くちばしで</div>
        <div
          style={{
            marginTop: 14,
            color: "#087d8b",
            fontSize: 76,
            lineHeight: 1.03,
            fontWeight: 900,
            transform: `scale(${pulse})`,
          }}
        >
          圧力と微弱な電気を
        </div>
        <div style={{ marginTop: 10, fontSize: 76, lineHeight: 1, fontWeight: 900 }}>
          感じ取る
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 17,
            padding: "8px 25px 11px",
            background: "#111",
            borderRadius: 999,
            color: "#fff",
            fontSize: 38,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          獲物探しの手がかり
        </div>
      </TopCard>
    </AbsoluteFill>
  );
};

const ElectricFootprints: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/electric-footprints.png`} zoom={1.03} dim={0.12} />
      <TopCard accent="#41e9f5" background="rgba(6,29,38,0.94)" padding="24px 28px 32px">
        <div
          style={{
            display: "inline-block",
            padding: "7px 24px 10px",
            borderRadius: 999,
            background: "#ff3653",
            border: "5px solid #fff",
            color: "#fff",
            fontSize: 38,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          AIイメージ
        </div>
        <div
          style={{
            marginTop: 14,
            color: "#fff",
            fontSize: 79,
            lineHeight: 1.04,
            fontWeight: 900,
            textShadow: `0 0 ${18 + Math.sin(frame / 5) * 7}px #2ee8f4`,
          }}
        >
          電気の足あとを
          <br />
          読む世界
        </div>
      </TopCard>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <FullImage src={`${imageRoot}/hook-face.png`} zoom={1.08} dim={0.38} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.18)" }} />
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 50,
          right: 50,
          transform: `scale(${interpolate(enter, [0, 1], [0.72, 1])})`,
          transformOrigin: "50% 10%",
          padding: "26px 30px 33px",
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
            background: "#0a8c9c",
            border: "5px solid #111",
            color: "#fff",
            fontSize: 40,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          この体、何のため？
        </div>
        <div style={{ marginTop: 17, fontSize: 61, lineHeight: 1.06, fontWeight: 900 }}>
          このくちばし、
          <br />
          電気を読む“手”だった
        </div>
        <div
          style={{
            marginTop: 23,
            paddingTop: 19,
            borderTop: "5px dashed #111",
            color: "#ff2844",
            fontSize: 55,
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
    {path ? <Audio src={staticFile(path)} playbackRate={ANIMAL_WHY_PLAYBACK_RATE} /> : null}
    <Audio src={staticFile(effect)} volume={effectVolume} />
  </>
);

export const AnimalWhyQuizShort: React.FC<{ episode: Episode }> = ({ episode }) => {
  const timeline = getAnimalWhyTimeline(episode);
  const scenes = [
    <Choices key="choices" />,
    <Reveal key="reveal" />,
    <ClosedSenses key="closed" />,
    <BillSense key="bill" />,
    <ElectricFootprints key="electric" />,
  ];
  const effects = [
    effectPath.pop,
    effectPath.correct,
    effectPath.pop,
    effectPath.shine,
    effectPath.shine,
  ];
  const volumes = [0.35, 0.62, 0.34, 0.38, 0.4];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#03131a",
        fontFamily: `${fontFamily}, 'Yu Gothic', sans-serif`,
      }}
    >
      <Audio
        src={staticFile(episode.bgm ?? "BGM/If I Had a Chicken - Kevin MacLeod.mp3")}
        loop
        volume={(frame) => {
          const fadeIn = Math.min(1, frame / 24);
          const fadeOut = Math.min(1, (timeline.totalFrames - frame) / 35);
          return 0.08 * Math.max(0, Math.min(fadeIn, fadeOut));
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
