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

export const QUIZ_FPS = 30;
export const QUIZ_WIDTH = 1080;
export const QUIZ_HEIGHT = 1920;
export const QUIZ_PLAYBACK_RATE = 1.12;
const COUNTDOWN_FRAMES = Math.round(2.1 * QUIZ_FPS);

const animals = [
  {
    id: "a1",
    letter: "A",
    name: "サイガ",
    image: "quiz/ai-lie-animals-01/a.png",
    color: "#ffd400",
  },
  {
    id: "a2",
    letter: "B",
    name: "リーフシープ",
    image: "quiz/ai-lie-animals-01/b.png",
    color: "#35c8ff",
  },
  {
    id: "a3",
    letter: "C",
    name: "ハナビロリス",
    image: "quiz/ai-lie-animals-01/c.png",
    color: "#ff5268",
  },
] as const;

const framesForAudio = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil(((seconds ?? fallback) / QUIZ_PLAYBACK_RATE) * QUIZ_FPS));

export const getAiLieQuizTimeline = (episode: Episode) => {
  const hookFrames = framesForAudio(episode.odaiDuration, 3.1);
  const candidateFrames = episode.answers
    .slice(0, 3)
    .map((answer) => framesForAudio(answer.duration, 3.8));
  const revealFrames = framesForAudio(episode.answers[3]?.duration, 3.8);
  const outroFrames = framesForAudio(episode.outroDuration, 2.8);
  const candidatesFrom = hookFrames;
  const countdownFrom = candidatesFrom + candidateFrames.reduce((a, b) => a + b, 0);
  const revealFrom = countdownFrom + COUNTDOWN_FRAMES;
  const outroFrom = revealFrom + revealFrames;

  return {
    hookFrames,
    candidateFrames,
    candidatesFrom,
    countdownFrom,
    revealFrom,
    revealFrames,
    outroFrom,
    outroFrames,
    totalFrames: outroFrom + outroFrames,
  };
};

const FullImage: React.FC<{
  src: string;
  zoom?: number;
  dim?: number;
  position?: string;
}> = ({ src, zoom = 1.05, dim = 0.16, position = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [zoom, zoom + 0.05], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#071018" }}>
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
            0.26,
            dim
          )}) 0%, rgba(0,0,0,0.02) 42%, rgba(0,0,0,${dim}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const AnimalCollage: React.FC<{ blur?: boolean }> = ({ blur = false }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "row", background: "#05080d" }}>
    {animals.map((animal, index) => (
      <div
        key={animal.id}
        style={{
          position: "relative",
          width: "33.333%",
          height: "100%",
          overflow: "hidden",
          borderLeft: index === 0 ? undefined : "6px solid #fff",
          filter: blur ? "blur(4px)" : undefined,
        }}
      >
        <Img
          src={staticFile(animal.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 1180,
            padding: "14px 8px",
            borderRadius: 999,
            background: animal.color,
            border: "5px solid #111",
            color: "#111",
            textAlign: "center",
            fontSize: 54,
            fontWeight: 900,
            boxShadow: "0 8px 0 #111",
          }}
        >
          {animal.letter}
        </div>
      </div>
    ))}
    <AbsoluteFill style={{ background: "linear-gradient(#0008 0%, transparent 48%, #0005 100%)" }} />
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 8, stiffness: 220, mass: 0.52 } });
  const scale = interpolate(enter, [0, 1], [1.16, 1]);
  const rotate = interpolate(enter, [0, 1], [-1.5, 0]);
  const flash = interpolate(frame, [0, 3, 10], [0.22, 0.07, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimalCollage />
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 50,
          right: 50,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: "50% 20%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "7px 42px 13px",
            background: "#ff253d",
            border: "8px solid #111",
            color: "#fff",
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 6,
            textShadow: "0 6px 0 #8b0010",
            boxShadow: "0 12px 0 #111",
          }}
        >
          衝撃！
        </div>
        <div
          style={{
            marginTop: 20,
            padding: "24px 28px 30px",
            background: "#fff8d8",
            border: "10px solid #111",
            boxShadow: "0 18px 0 #111, 0 30px 50px #0009",
          }}
        >
          <div style={{ color: "#111", fontSize: 92, lineHeight: 0.96, fontWeight: 900 }}>
            1匹だけ
          </div>
          <div
            style={{
              marginTop: 12,
              color: "#ff253d",
              fontSize: 116,
              lineHeight: 0.96,
              fontWeight: 900,
              letterSpacing: -4,
              WebkitTextStroke: "4px #111",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #111",
            }}
          >
            AIのウソ
          </div>
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "10px 30px",
            borderRadius: 999,
            background: "#111",
            color: "#fff",
            fontSize: 39,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          見抜ける？ A・B・C
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Candidate: React.FC<{
  animal: (typeof animals)[number];
  text: string;
  index: number;
}> = ({ animal, text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 190 } });
  const y = interpolate(enter, [0, 1], [-110, 0]);
  const lines = text.split("\n");

  return (
    <AbsoluteFill>
      <FullImage src={animal.image} />
      <div
        style={{
          position: "absolute",
          top: 68,
          left: 48,
          right: 48,
          transform: `translateY(${y}px)`,
          padding: "28px 34px 34px",
          borderRadius: 30,
          background: "rgba(255,250,222,0.96)",
          border: "9px solid #111",
          boxShadow: `0 16px 0 #111, 0 25px 45px #0008, inset 0 0 0 5px ${animal.color}`,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <span
            style={{
              width: 112,
              height: 112,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: animal.color,
              border: "6px solid #111",
              color: "#111",
              fontSize: 72,
              fontWeight: 900,
            }}
          >
            {animal.letter}
          </span>
          <span style={{ color: "#111", fontSize: 70, fontWeight: 900 }}>{animal.name}</span>
        </div>
        <div
          style={{
            marginTop: 18,
            color: "#111",
            fontSize: lines.some((line) => line.length >= 10) ? 62 : 68,
            lineHeight: 1.15,
            fontWeight: 900,
            whiteSpace: "pre-wrap",
            wordBreak: "keep-all",
          }}
        >
          {text}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1100,
          right: 38,
          padding: "10px 22px",
          borderRadius: 999,
          background: "#111d",
          color: "#fff",
          fontSize: 34,
          fontWeight: 900,
        }}
      >
        {index + 1} / 3
      </div>
    </AbsoluteFill>
  );
};

const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const segment = COUNTDOWN_FRAMES / 3;
  const number = frame < segment ? 3 : frame < segment * 2 ? 2 : 1;
  const local = frame % segment;
  const size = interpolate(local, [0, segment - 1], [1.45, 0.72], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimalCollage blur />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.52)" }} />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 60,
          right: 60,
          padding: "24px",
          background: "#fff7d3",
          border: "9px solid #111",
          boxShadow: "0 15px 0 #111",
          textAlign: "center",
          color: "#111",
          fontSize: 64,
          lineHeight: 1.05,
          fontWeight: 900,
        }}
      >
        AIのウソはどれ？
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${size})`,
            color: "#ffd400",
            fontSize: 430,
            lineHeight: 1,
            fontWeight: 900,
            WebkitTextStroke: "18px #111",
            paintOrder: "stroke fill",
            textShadow: "0 24px 0 #111, 0 40px 80px #000",
          }}
        >
          {number}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Reveal: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 7, stiffness: 210, mass: 0.55 } });
  const scale = interpolate(enter, [0, 1], [2.1, 1]);

  return (
    <AbsoluteFill>
      <FullImage src={animals[2].image} zoom={1.08} dim={0.28} />
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 45,
          right: 45,
          transform: `scale(${scale})`,
          transformOrigin: "50% 15%",
          padding: "26px 28px 34px",
          background: "#fff4c7",
          border: "10px solid #111",
          boxShadow: "0 18px 0 #111, 0 32px 70px #000a",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#ff233f",
            fontSize: 112,
            lineHeight: 1,
            fontWeight: 900,
            WebkitTextStroke: "4px #111",
            paintOrder: "stroke fill",
            textShadow: "0 7px 0 #111",
          }}
        >
          正解は C！
        </div>
        <div
          style={{
            marginTop: 20,
            color: "#111",
            fontSize: 67,
            lineHeight: 1.12,
            fontWeight: 900,
            whiteSpace: "pre-wrap",
          }}
        >
          {text.split("\n").slice(1).join("\n")}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "78%",
          top: 1050,
          transform: "translate(-50%, -50%) rotate(-10deg)",
          width: 270,
          height: 270,
          borderRadius: "50%",
          border: "30px solid #ff2442",
          color: "#ff2442",
          fontSize: 220,
          lineHeight: 0.96,
          fontWeight: 900,
          textAlign: "center",
          textShadow: "0 10px 0 #77000f",
          filter: "drop-shadow(0 20px 30px #000b)",
        }}
      >
        ×
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 180 } });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill>
      <AnimalCollage blur />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.56)" }} />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 55,
          right: 55,
          transform: `scale(${scale})`,
          padding: "38px 35px 44px",
          background: "#fff5c8",
          border: "10px solid #111",
          boxShadow: "0 18px 0 #111, 0 35px 75px #000b",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#111",
            fontSize: 74,
            lineHeight: 1.15,
            fontWeight: 900,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 26,
            padding: "13px 35px 18px",
            borderRadius: 999,
            background: "#ff233f",
            border: "6px solid #111",
            color: "#fff",
            fontSize: 48,
            lineHeight: 1,
            fontWeight: 900,
            boxShadow: "0 9px 0 #111",
          }}
        >
          AIのウソを見抜け！
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AiLieQuizShort: React.FC<{ episode: Episode }> = ({ episode }) => {
  const timeline = getAiLieQuizTimeline(episode);
  const bgmPath = episode.bgm ?? "BGM/If I Had a Chicken - Kevin MacLeod.mp3";
  let cursor = timeline.candidatesFrom;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070b",
        fontFamily: `${fontFamily}, 'Yu Gothic', sans-serif`,
      }}
    >
      <Audio
        src={staticFile(bgmPath)}
        loop
        volume={(frame) => {
          const fadeIn = Math.min(1, frame / 24);
          const fadeOut = Math.min(1, (timeline.totalFrames - frame) / 35);
          return 0.08 * Math.max(0, Math.min(fadeIn, fadeOut));
        }}
      />

      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        {episode.odaiAudioFile ? (
          <Audio src={staticFile(episode.odaiAudioFile)} playbackRate={QUIZ_PLAYBACK_RATE} />
        ) : null}
        <Audio src={staticFile(effectPath.titleHeavy)} volume={0.6} />
      </Sequence>

      {episode.answers.slice(0, 3).map((answer, index) => {
        const from = cursor;
        const durationInFrames = timeline.candidateFrames[index];
        cursor += durationInFrames;
        return (
          <Sequence key={answer.id} from={from} durationInFrames={durationInFrames}>
            <Candidate animal={animals[index]} text={answer.text} index={index} />
            {answer.audioFile ? (
              <Audio src={staticFile(answer.audioFile)} playbackRate={QUIZ_PLAYBACK_RATE} />
            ) : null}
            <Audio src={staticFile(effectPath.pop)} volume={0.38} />
          </Sequence>
        );
      })}

      <Sequence from={timeline.countdownFrom} durationInFrames={COUNTDOWN_FRAMES}>
        <Countdown />
        <Audio src={staticFile("Effect/心臓の鼓動1.mp3")} volume={0.62} />
      </Sequence>

      <Sequence from={timeline.revealFrom} durationInFrames={timeline.revealFrames}>
        <Reveal text={episode.answers[3]?.text ?? "正解は C！\nAI創作"} />
        {episode.answers[3]?.audioFile ? (
          <Audio src={staticFile(episode.answers[3].audioFile)} playbackRate={QUIZ_PLAYBACK_RATE} />
        ) : null}
        <Audio src={staticFile(effectPath.correct)} volume={0.65} />
      </Sequence>

      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro text={episode.outro ?? "見抜けた？\n次も挑戦！"} />
        {episode.outroAudioFile ? (
          <Audio src={staticFile(episode.outroAudioFile)} playbackRate={QUIZ_PLAYBACK_RATE} />
        ) : null}
        <Audio src={staticFile(effectPath.shine)} volume={0.42} />
      </Sequence>
    </AbsoluteFill>
  );
};
