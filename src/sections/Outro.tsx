import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Theme } from "../theme/themes";
import { EffectAudio, effectPath } from "../lib/effects";

export const Outro: React.FC<{
  text?: string;
  theme: Theme;
  audioFile?: string;
  variant?: "standalone" | "image_loop";
  lastImageIndex?: number;
  durationInFrames?: number;
}> = ({
  text,
  theme,
  audioFile,
  variant = "standalone",
  lastImageIndex = 1,
  durationInFrames = 72,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 9, mass: 0.55, stiffness: 170 },
  });
  const scale = interpolate(enter, [0, 1], [0.42, 1]);
  const rotate = interpolate(enter, [0, 1], [5, 0]);
  const flash = interpolate(frame, [0, 5, 16], [0.65, 0.13, 0], {
    extrapolateRight: "clamp",
  });
  const displayText = text ?? "コメントで大喜利して";
  const lines = displayText.split("\n");
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const fitByLines = lines.length >= 5 ? 0.72 : lines.length >= 4 ? 0.82 : 1;
  const fitByLength = longestLine >= 13 ? 0.86 : longestLine >= 11 ? 0.92 : 1;
  const fontSize = 88 * fitByLines * fitByLength;

  if (variant === "image_loop") {
    const loopStart = Math.max(0, durationInFrames - 9);
    const loopOpacity = interpolate(frame, [loopStart, durationInFrames - 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const cardOpacity = interpolate(frame, [loopStart - 5, loopStart], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lastImage = `image/a${String(lastImageIndex).padStart(2, "0")}.png`;

    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {audioFile ? <Audio src={staticFile(audioFile)} /> : null}
        <EffectAudio src={effectPath.titleHeavy} durationInFrames={60} volume={0.32} />
        <EffectAudio src={effectPath.applause} from={18} durationInFrames={90} volume={0.18} />
        <AbsoluteFill>
          <Img
            src={staticFile(lastImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)" }}
          />
          <AbsoluteFill style={{ background: "rgba(0,0,0,0.08)" }} />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.09) 52%, rgba(0,0,0,0.46) 100%)",
            }}
          />
          <Img
            src={staticFile("image/a01.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: loopOpacity,
            }}
          />
          <AbsoluteFill style={{ background: `rgba(0,0,0,${0.08 * loopOpacity})` }} />
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 260,
            left: 46,
            right: 46,
            minHeight: 300,
            padding: "38px 44px",
            background: "#fff6dc",
            border: "7px solid #1c1a16",
            boxShadow: "0 18px 44px rgba(0,0,0,0.42), inset 0 0 0 3px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#111",
            fontSize,
            fontWeight: 900,
            lineHeight: lines.length >= 4 ? 1.1 : 1.22,
            whiteSpace: "pre-wrap",
            textShadow: "0 2px 0 rgba(255,255,255,0.8)",
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            opacity: cardOpacity,
          }}
        >
          {displayText}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        background: "#080808",
      }}
    >
      {audioFile ? <Audio src={staticFile(audioFile)} /> : null}
      <EffectAudio src={effectPath.titleHeavy} durationInFrames={75} volume={0.46} />
      <EffectAudio src={effectPath.applause} from={18} durationInFrames={120} volume={0.28} />
      <AbsoluteFill
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 48%, rgba(255,255,255,0.08) 0deg 6deg, transparent 6deg 13deg)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 48%, ${theme.bgAccent}, #080808 62%)`,
          opacity: 0.92,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          width: "100%",
          padding: "70px 46px",
          background: "#fff1bd",
          border: "10px solid #111",
          boxShadow:
            "0 34px 0 #111, 0 54px 90px rgba(0,0,0,0.58), inset 0 0 0 5px rgba(255,255,255,0.75)",
          textAlign: "center",
          color: "#111",
          fontSize,
          fontWeight: 900,
          lineHeight: lines.length >= 5 ? 1.08 : 1.18,
          whiteSpace: "pre-wrap",
          textShadow:
            "0 5px 0 #ffffff, 0 10px 0 rgba(0,0,0,0.14), 0 20px 28px rgba(0,0,0,0.32)",
        }}
      >
        {displayText}
      </div>
    </div>
  );
};
