import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Theme } from "../theme/themes";
import { Background as BgConfig } from "../lib/types";

// 決定論的な擬似乱数 (フレーム非依存。素材なしでも毎回同じ背景になる)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 浮遊する光の粒(ボケ) */
const Bokeh: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const dots = useMemo(() => {
    const rand = mulberry32(20240628);
    return new Array(22).fill(0).map(() => ({
      x: rand(),
      size: 30 + rand() * 150,
      speed: 0.3 + rand() * 0.9,
      phase: rand(),
      drift: (rand() - 0.5) * 0.12,
      opacity: 0.05 + rand() * 0.12,
    }));
  }, []);

  return (
    <AbsoluteFill>
      {dots.map((d, i) => {
        const prog = ((frame * d.speed) / durationInFrames + d.phase) % 1;
        const y = (1 - prog) * (height + 300) - 150;
        const x = d.x * width + Math.sin(prog * Math.PI * 2) * d.drift * width;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.accent}, transparent 70%)`,
              opacity: d.opacity,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** ゆっくり回転する効果線(集中線風) */
const RaysAndGlow: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const rot = (frame * 0.15) % 360;
  const pulse = interpolate(Math.sin(frame / 22), [-1, 1], [0.85, 1.08]);

  return (
    <AbsoluteFill>
      {/* 中央の発光 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 38%, ${theme.bgAccent}, transparent 60%)`,
          transform: `scale(${pulse})`,
        }}
      />
      {/* 回転する放射状ストライプ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: 2600,
          height: 2600,
          marginLeft: -1300,
          marginTop: -1300,
          transform: `rotate(${rot}deg)`,
          opacity: 0.06,
          background: `repeating-conic-gradient(from 0deg, ${theme.accent} 0deg 6deg, transparent 6deg 12deg)`,
          borderRadius: "50%",
        }}
      />
    </AbsoluteFill>
  );
};

export const Background: React.FC<{
  theme: Theme;
  config?: BgConfig;
}> = ({ theme, config }) => {
  const type = config?.type ?? "auto";
  const dim = config?.dim ?? (type === "auto" ? 0.18 : 0.4);

  return (
    <AbsoluteFill>
      {/* ベースグラデ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.bgAccent}, ${theme.bg} 72%)`,
        }}
      />

      {type === "video" && config?.src ? (
        <OffthreadVideo
          src={staticFile(config.src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {type === "image" && config?.src ? (
        <Img
          src={staticFile(config.src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {type === "auto" ? (
        <>
          <RaysAndGlow theme={theme} />
          <Bokeh theme={theme} />
        </>
      ) : null}

      {/* 可読性確保のための暗幕＋周辺減光(ビネット) */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 360px 120px rgba(0,0,0,0.55)",
        }}
      />
    </AbsoluteFill>
  );
};
