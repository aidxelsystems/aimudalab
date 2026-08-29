import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Theme } from "../theme/themes";

export const TitleBoom: React.FC<{
  text: string;
  theme: Theme;
  variant?: "hook" | "recap";
}> = ({ text, theme, variant = "recap" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const fitByLines = lines.length >= 3 ? 0.76 : lines.length >= 2 ? 0.9 : 1;
  const fitByLength = longestLine >= 7 ? 0.9 : 1;
  const fontSize = 112 * fitByLines * fitByLength;

  const enter = spring({
    frame,
    fps,
    config: { damping: 9, mass: 0.55, stiffness: 180 },
  });
  const scale = interpolate(enter, [0, 1], [0.45, 1]);
  const rotate = interpolate(enter, [0, 1], [-6, 0]);
  const flash = interpolate(frame, [0, 4, 14], [0.78, 0.16, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#070707",
        alignItems: "center",
        justifyContent: "center",
        padding: 54,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 48%, rgba(255,255,255,0.09) 0deg 5deg, transparent 5deg 12deg)",
          opacity: variant === "hook" ? 0.5 : 0.42,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 48%, ${theme.bgAccent}, #070707 62%)`,
          opacity: 0.92,
        }}
      />
      <AbsoluteFill
        style={{
          background: `rgba(255,255,255,${flash})`,
        }}
      />
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          width: "100%",
          padding: lines.length >= 3 ? "64px 42px" : "76px 54px",
          background: "#fff1bd",
          border: "10px solid #111",
          boxShadow:
            "0 34px 0 #111, 0 54px 90px rgba(0,0,0,0.58), inset 0 0 0 5px rgba(255,255,255,0.75)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 900,
            lineHeight: lines.length >= 3 ? 1.04 : 1.12,
            color: "#111",
            whiteSpace: "pre-wrap",
            overflowWrap: "normal",
            wordBreak: "keep-all",
            letterSpacing: 0,
            textShadow:
              "0 5px 0 #ffffff, 0 10px 0 rgba(0,0,0,0.16), 0 20px 28px rgba(0,0,0,0.35)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
