import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
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

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const MOTION_COMIC_PANEL_FPS = 30;
export const MOTION_COMIC_PANEL_WIDTH = 1080;
export const MOTION_COMIC_PANEL_HEIGHT = 1920;
export const MOTION_COMIC_PANEL_DURATION = 216;

const sourceImage = "image/motion-comic/eiffel-hook-v1.png";

type PanelShotProps = {
  duration: number;
  origin: string;
  scaleFrom: number;
  scaleTo: number;
  enter?: "none" | "right" | "bottom";
  panelNumber: string;
};

const PanelShot: React.FC<PanelShotProps> = ({
  duration,
  origin,
  scaleFrom,
  scaleTo,
  enter = "none",
  panelNumber,
}) => {
  const frame = useCurrentFrame();
  const enterProgress = enter === "none"
    ? 1
    : spring({frame, fps: MOTION_COMIC_PANEL_FPS, config: {damping: 18, stiffness: 210, mass: 0.55}});
  const x = enter === "right" ? interpolate(enterProgress, [0, 1], [1080, 0]) : 0;
  const y = enter === "bottom" ? interpolate(enterProgress, [0, 1], [1920, 0]) : 0;
  const zoom = interpolate(frame, [0, duration], [scaleFrom, scaleTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        transform: `translate(${x}px, ${y}px)`,
        border: "14px solid #fff8df",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "0 0 0 5px #111 inset, 0 0 40px rgba(0,0,0,.65)",
      }}
    >
      <Img
        src={staticFile(sourceImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: origin,
          transform: `scale(${zoom})`,
          filter: "contrast(1.07) saturate(1.03)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(9,7,8,.38),transparent 35%,transparent 67%,rgba(6,5,7,.38))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 36,
          width: 78,
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          color: "#fff",
          backgroundColor: "#cf2530",
          border: "5px solid #fff8df",
          fontFamily,
          fontWeight: 900,
          fontSize: 38,
          boxShadow: "0 5px 14px rgba(0,0,0,.35)",
        }}
      >
        {panelNumber}
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{
  text: React.ReactNode;
  accent: string;
  fontSize?: number;
}> = ({text, accent, fontSize = 60}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame, fps, config: {damping: 18, stiffness: 190}});

  return (
    <div
      style={{
        position: "absolute",
        top: 1350,
        left: 90,
        right: 90,
        minHeight: 146,
        padding: "20px 34px 24px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 28,
        backgroundColor: "rgba(7,9,14,.82)",
        border: "5px solid rgba(255,248,223,.96)",
        boxShadow: "0 12px 32px rgba(0,0,0,.48)",
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [22, 0])}px) scale(${interpolate(appear, [0, 1], [.97, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -5,
          top: 16,
          bottom: 16,
          width: 13,
          borderRadius: 10,
          backgroundColor: accent,
        }}
      />
      <div
        style={{
          color: "#fff",
          fontFamily,
          fontSize,
          fontWeight: 900,
          lineHeight: 1.06,
          textAlign: "center",
          WebkitTextStroke: "7px rgba(0,0,0,.96)",
          paintOrder: "stroke fill",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const OpeningHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14, stiffness: 220, mass: .55}});
  return (
    <div
      style={{
        position: "absolute",
        top: 154,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        lineHeight: .98,
        letterSpacing: -4,
        transform: `scale(${interpolate(enter, [0, 1], [.9, 1])})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "7px 24px 9px",
          marginBottom: 7,
          borderRadius: 999,
          backgroundColor: "#cf2530",
          border: "4px solid #fff8df",
          color: "#fff",
          fontSize: 38,
          letterSpacing: 2,
        }}
      >
        衝撃の実話
      </div>
      <div
        style={{
          color: "#fff8df",
          fontSize: 91,
          WebkitTextStroke: "12px rgba(8,7,9,.98)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,.3),0 16px 28px rgba(0,0,0,.48)",
        }}
      >
        エッフェル塔が
      </div>
      <div
        style={{
          color: "#ffd43b",
          fontSize: 116,
          WebkitTextStroke: "13px rgba(8,7,9,.98)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,.3),0 16px 28px rgba(0,0,0,.48)",
        }}
      >
        売られた
      </div>
    </div>
  );
};

const PersistentQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        position: "absolute",
        top: 174,
        left: 130,
        right: 130,
        padding: "14px 28px 18px",
        borderRadius: 22,
        color: "#fff8df",
        backgroundColor: "rgba(8,8,10,.78)",
        border: "4px solid #fff8df",
        fontFamily,
        fontSize: 57,
        fontWeight: 900,
        lineHeight: 1,
        textAlign: "center",
        opacity,
        boxShadow: "0 8px 24px rgba(0,0,0,.38)",
      }}
    >
      エッフェル塔が売られた？
    </div>
  );
};

export const MotionComicPanelPrototype: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#111"}}>
      <Sequence from={0} durationInFrames={60}>
        <PanelShot duration={60} origin="14% 69%" scaleFrom={1.04} scaleTo={1.19} panelNumber="1" />
        <OpeningHeadline />
      </Sequence>

      <Sequence from={45} durationInFrames={90}>
        <PanelShot duration={90} origin="48% 51%" scaleFrom={1.12} scaleTo={1.27} enter="right" panelNumber="2" />
        <PersistentQuestion />
      </Sequence>

      <Sequence from={126} durationInFrames={90}>
        <PanelShot duration={90} origin="82% 66%" scaleFrom={1.2} scaleTo={1.4} enter="bottom" panelNumber="3" />
        <PersistentQuestion />
      </Sequence>

      <Sequence from={4} durationInFrames={42}>
        <Caption text="1925年、パリ" accent="#47d7ff" />
      </Sequence>
      <Sequence from={48} durationInFrames={82}>
        <Caption
          text={<>この男、塔を<span style={{color: "#ffd43b"}}>売りました</span></>}
          accent="#47d7ff"
          fontSize={57}
        />
      </Sequence>
      <Sequence from={134} durationInFrames={72}>
        <Caption
          text={<>塔って、<br /><span style={{color: "#ffd43b"}}>売り物</span>なんですか？</>}
          accent="#ffd43b"
          fontSize={56}
        />
      </Sequence>

      <Audio src={staticFile("voice/motion-comic-panel-prototype-01/odai.wav")} volume={1} />
      <Sequence from={134}>
        <Audio src={staticFile("voice/motion-comic-panel-prototype-01/a1.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={.2} />
      <Sequence from={45}>
        <Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={.16} />
      </Sequence>
      <Sequence from={126}>
        <Audio src={staticFile("Effect/シャキーン1.mp3")} volume={.13} />
      </Sequence>
    </AbsoluteFill>
  );
};
