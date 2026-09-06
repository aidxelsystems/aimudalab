import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
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

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const MOTION_COMIC_HOOK_FPS = 30;
export const MOTION_COMIC_HOOK_WIDTH = 1080;
export const MOTION_COMIC_HOOK_HEIGHT = 1920;
export const MOTION_COMIC_HOOK_DURATION = 108;

const outlinedText: React.CSSProperties = {
  color: "#fff9dc",
  fontFamily: `${fontFamily}, 'Yu Gothic', sans-serif`,
  fontWeight: 900,
  textAlign: "center",
  WebkitTextStroke: "12px rgba(10, 9, 12, 0.96)",
  paintOrder: "stroke fill",
  textShadow: "0 8px 0 rgba(0,0,0,.32), 0 15px 30px rgba(0,0,0,.58)",
};

export const MotionComicHookPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headlineIn = spring({frame, fps, config: {damping: 14, stiffness: 220, mass: 0.55}});
  const subtitleIn = spring({frame: frame - 5, fps, config: {damping: 17, stiffness: 170}});
  const zoom = interpolate(frame, [0, MOTION_COMIC_HOOK_DURATION], [1.035, 1.105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = interpolate(frame, [0, MOTION_COMIC_HOOK_DURATION], [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [0, 3, 9], [0.28, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contractPulse = 1 + Math.sin(Math.max(0, frame - 18) * 0.15) * 0.006;

  return (
    <AbsoluteFill style={{backgroundColor: "#15100c", overflow: "hidden"}}>
      <Img
        src={staticFile("image/motion-comic/eiffel-hook-v1.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "35% 62%",
          transform: `translateX(${panX}px) scale(${zoom * contractPulse})`,
          filter: "contrast(1.06) saturate(1.03)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(15,10,8,.57) 0%, rgba(15,10,8,.18) 24%, transparent 45%, transparent 66%, rgba(8,6,7,.34) 100%)",
        }}
      />
      <AbsoluteFill style={{backgroundColor: `rgba(255,230,166,${flash})`}} />

      <div
        style={{
          position: "absolute",
          top: 158,
          left: 90,
          right: 90,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [-24, 0])}px) scale(${interpolate(headlineIn, [0, 1], [0.92, 1])})`,
          opacity: interpolate(headlineIn, [0, 1], [0.72, 1]),
        }}
      >
        <div
          style={{
            display: "inline-block",
            marginBottom: 4,
            padding: "7px 24px 9px",
            borderRadius: 999,
            color: "#fff",
            backgroundColor: "#d6292f",
            border: "4px solid #fff4d6",
            fontFamily,
            fontSize: 39,
            fontWeight: 900,
            letterSpacing: 2,
            boxShadow: "0 6px 18px rgba(0,0,0,.32)",
          }}
        >
          衝撃の実話
        </div>
        <div style={{...outlinedText, lineHeight: 0.98, letterSpacing: -4}}>
          <div style={{fontSize: 91}}>エッフェル塔が</div>
          <div style={{color: "#ffd43b", fontSize: 116}}>売られた</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1350,
          left: 104,
          width: 790,
          minHeight: 142,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 36px 24px",
          boxSizing: "border-box",
          borderRadius: 28,
          backgroundColor: "rgba(8, 10, 15, .76)",
          border: "4px solid rgba(255,255,255,.9)",
          boxShadow: "0 12px 30px rgba(0,0,0,.42)",
          transform: `translateY(${interpolate(subtitleIn, [0, 1], [18, 0])}px)`,
          opacity: subtitleIn,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 18,
            bottom: 18,
            width: 10,
            borderRadius: 8,
            backgroundColor: "#47d7ff",
          }}
        />
        <div
          style={{
            color: "#fff",
            fontFamily,
            fontSize: 59,
            fontWeight: 900,
            lineHeight: 1.05,
            textAlign: "center",
            WebkitTextStroke: "7px rgba(0,0,0,.94)",
            paintOrder: "stroke fill",
          }}
        >
          この男、塔を売りました
        </div>
      </div>

      <Audio src={staticFile("voice/motion-comic-format-prototype-01/odai.wav")} volume={1} />
      <Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={0.22} />
    </AbsoluteFill>
  );
};
