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
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const EIFFEL_SCAM_FPS = 30;
export const EIFFEL_SCAM_WIDTH = 1080;
export const EIFFEL_SCAM_HEIGHT = 1920;

const P1 = 95;
const P2 = 95;
const P3 = 50;
const P4 = 95;
const P5_SETUP = 65;
const P5_PUNCH = 70;

export const EIFFEL_SCAM_DURATION = P1 + P2 + P3 + P4 + P5_SETUP + P5_PUNCH;

const panelPaths = [
  "image/motion-comic-eiffel-scam-01/panel-01-sale-hook.png",
  "image/motion-comic-eiffel-scam-01/panel-02-secret-meeting.png",
  "image/motion-comic-eiffel-scam-01/panel-03-contract-payment.png",
  "image/motion-comic-eiffel-scam-01/panel-04-scam-discovered.png",
  "image/motion-comic-eiffel-scam-01/panel-05-second-buyer.png",
];

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

type PanelProps = {
  src: string;
  duration: number;
  origin: string;
  fromScale: number;
  toScale: number;
  enter?: "punch" | "slide" | "parallax" | "mask" | "callback";
};

const Panel: React.FC<PanelProps> = ({
  src,
  duration,
  origin,
  fromScale,
  toScale,
  enter = "punch",
}) => {
  const frame = useCurrentFrame();
  const progress = spring({
    frame,
    fps: EIFFEL_SCAM_FPS,
    config: {damping: 18, stiffness: 220, mass: 0.55},
  });
  const zoom = interpolate(frame, [0, duration], [fromScale, toScale], clamp);
  const punch = enter === "punch" ? interpolate(progress, [0, 1], [1.08, 1], clamp) : 1;
  const slideX = enter === "slide" ? interpolate(progress, [0, 1], [1080, 0], clamp) : 0;
  const slideRotate = enter === "slide" ? interpolate(progress, [0, 1], [1.2, 0], clamp) : 0;
  const callbackShake = enter === "callback" && frame < 13 ? Math.sin(frame * 2.7) * (13 - frame) * 0.7 : 0;
  const mask = enter === "mask" ? interpolate(progress, [0, 1], [100, 0], clamp) : 0;
  const panX = enter === "parallax" ? interpolate(frame, [0, duration], [-9, 15], clamp) : 0;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#11100e",
        border: "11px solid #fff2d1",
        boxSizing: "border-box",
        transform: `translateX(${slideX + callbackShake}px) rotate(${slideRotate}deg)`,
        clipPath: `inset(0 ${mask}% 0 0)`,
        boxShadow: "inset 0 0 0 4px #18130f",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: origin,
          transform: `translateX(${panX}px) scale(${zoom * punch})`,
          filter: "contrast(1.055) saturate(1.025)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(9,12,15,.34) 0%,transparent 29%,transparent 62%,rgba(8,7,8,.58) 88%,rgba(6,5,7,.8) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.075,
          backgroundImage:
            "radial-gradient(circle at 1px 1px,rgba(255,246,220,.75) 1px,transparent 1.5px)",
          backgroundSize: "8px 8px",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

const PanelBadge: React.FC<{number: number}> = ({number}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: EIFFEL_SCAM_FPS, config: {damping: 16, stiffness: 230}});
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 54,
        width: 72,
        height: 72,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: number === 5 ? "#d52b35" : "#161419",
        border: "5px solid #fff2d1",
        color: "#fff8e6",
        fontFamily,
        fontSize: 36,
        fontWeight: 900,
        transform: `scale(${interpolate(enter, [0, 1], [0.72, 1], clamp)})`,
        boxShadow: "0 7px 17px rgba(0,0,0,.4)",
      }}
    >
      {number}
    </div>
  );
};

const Caption: React.FC<{
  children: React.ReactNode;
  accent?: string;
  fontSize?: number;
  variant?: "caption" | "speech";
}> = ({children, accent = "#52d8ff", fontSize = 61, variant = "caption"}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: EIFFEL_SCAM_FPS, config: {damping: 17, stiffness: 210}});
  const speech = variant === "speech";

  return (
    <div
      style={{
        position: "absolute",
        top: speech ? 235 : 1335,
        left: speech ? 145 : 86,
        right: speech ? 185 : 190,
        minHeight: speech ? 205 : 154,
        padding: speech ? "25px 50px 30px" : "20px 35px 24px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: speech ? "54% 48% 51% 46%" : 28,
        backgroundColor: speech ? "rgba(255,248,224,.96)" : "rgba(7,9,14,.84)",
        border: `5px solid ${speech ? "#171318" : "rgba(255,242,209,.98)"}`,
        boxShadow: "0 13px 32px rgba(0,0,0,.5)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [22, 0], clamp)}px) scale(${interpolate(enter, [0, 1], [.95, 1], clamp)})`,
      }}
    >
      {!speech && (
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
      )}
      <div
        style={{
          color: speech ? "#181318" : "#fff",
          fontFamily,
          fontSize,
          fontWeight: 900,
          lineHeight: 1.07,
          textAlign: "center",
          whiteSpace: "pre-line",
          WebkitTextStroke: speech ? "0" : "7px rgba(0,0,0,.96)",
          paintOrder: "stroke fill",
          letterSpacing: -1.5,
        }}
      >
        {children}
      </div>
      {speech && (
        <div
          style={{
            position: "absolute",
            left: 130,
            bottom: -37,
            width: 0,
            height: 0,
            borderLeft: "24px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "42px solid #171318",
            transform: "rotate(14deg)",
          }}
        />
      )}
    </div>
  );
};

const HookHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 13, stiffness: 245, mass: 0.5}});
  return (
    <div
      style={{
        position: "absolute",
        top: 145,
        left: 78,
        right: 126,
        fontFamily,
        fontWeight: 900,
        lineHeight: 1,
        textAlign: "center",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-30, 0], clamp)}px) scale(${interpolate(enter, [0, 1], [.87, 1], clamp)})`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          marginBottom: 8,
          padding: "7px 24px 9px",
          borderRadius: 999,
          color: "#fff",
          backgroundColor: "#d52b35",
          border: "4px solid #fff2d1",
          fontSize: 36,
          letterSpacing: 2,
          boxShadow: "0 7px 18px rgba(0,0,0,.35)",
        }}
      >
        1925年・パリ
      </div>
      <div
        style={{
          color: "#fff8e6",
          fontSize: 92,
          WebkitTextStroke: "13px rgba(10,8,10,.98)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,.32),0 16px 30px rgba(0,0,0,.5)",
        }}
      >
        エッフェル塔、
      </div>
      <div
        style={{
          marginTop: -2,
          color: "#ffd341",
          fontSize: 121,
          WebkitTextStroke: "14px rgba(10,8,10,.98)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,.32),0 16px 30px rgba(0,0,0,.5)",
        }}
      >
        売ります
      </div>
    </div>
  );
};

const StoryHeader: React.FC<{text: string; danger?: boolean}> = ({text, danger = false}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 158,
        left: 142,
        right: 186,
        padding: "13px 24px 16px",
        borderRadius: 20,
        backgroundColor: danger ? "rgba(173,27,36,.88)" : "rgba(8,14,18,.78)",
        border: "4px solid #fff2d1",
        color: "#fff8e6",
        fontFamily,
        fontSize: 47,
        fontWeight: 900,
        lineHeight: 1,
        textAlign: "center",
        opacity,
        boxShadow: "0 8px 24px rgba(0,0,0,.42)",
      }}
    >
      {text}
    </div>
  );
};

const Punchline: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: EIFFEL_SCAM_FPS, config: {damping: 10, stiffness: 265, mass: 0.45}});
  const flash = interpolate(frame, [0, 3, 10], [0.32, 0.12, 0], clamp);
  const shake = frame < 14 ? Math.sin(frame * 2.8) * (14 - frame) * 0.55 : 0;
  return (
    <>
      <AbsoluteFill style={{backgroundColor: `rgba(255,215,70,${flash})`}} />
      <div
        style={{
          position: "absolute",
          top: 1065,
          left: 55,
          right: 165,
          padding: "26px 32px 32px",
          borderRadius: 30,
          backgroundColor: "rgba(5,7,10,.78)",
          border: "6px solid #fff2d1",
          color: "#fff",
          fontFamily,
          fontSize: 91,
          fontWeight: 900,
          lineHeight: 1.01,
          textAlign: "center",
          opacity: enter,
          transform: `translateX(${shake}px) scale(${interpolate(enter, [0, 1], [.78, 1], clamp)})`,
          WebkitTextStroke: "10px rgba(0,0,0,.98)",
          paintOrder: "stroke fill",
          boxShadow: "0 15px 38px rgba(0,0,0,.55)",
        }}
      >
        詐欺、二周目
        <br />
        <span style={{color: "#ffd341"}}>あるんかい！</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1452,
          left: 210,
          right: 260,
          padding: "9px 18px 11px",
          borderRadius: 999,
          backgroundColor: "rgba(181,28,37,.9)",
          color: "#fff",
          fontFamily,
          fontSize: 39,
          fontWeight: 900,
          textAlign: "center",
          opacity: interpolate(frame, [28, 35], [0, 1], clamp),
        }}
      >
        続きもチャンネル登録で
      </div>
    </>
  );
};

const Disclosure: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 1536,
      left: 65,
      right: 185,
      padding: "7px 12px 8px",
      borderRadius: 10,
      backgroundColor: "rgba(5,7,9,.68)",
      color: "rgba(255,248,230,.9)",
      fontFamily,
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.16,
      textAlign: "center",
      letterSpacing: 0.2,
    }}
  >
    AI生成画像による再現・台詞は演出
    <br />
    出典: Smithsonian Magazine / Eiffel Tower公式
  </div>
);

export const MotionComicEiffelScamShort: React.FC<{episode: Episode}> = ({episode}) => {
  const frame = useCurrentFrame();
  const p2Start = P1;
  const p3Start = P1 + P2;
  const p4Start = P1 + P2 + P3;
  const p5Start = P1 + P2 + P3 + P4;
  const punchStart = p5Start + P5_SETUP;

  return (
    <AbsoluteFill style={{backgroundColor: "#12100e", overflow: "hidden"}}>
      <Sequence from={0} durationInFrames={P1}>
        <Panel src={panelPaths[0]} duration={P1} origin="38% 59%" fromScale={1.025} toScale={1.105} enter="punch" />
        <HookHeadline />
        <PanelBadge number={1} />
        <Sequence from={0} durationInFrames={P1}>
          <Caption accent="#52d8ff" fontSize={61}>1925年、パリ</Caption>
        </Sequence>
      </Sequence>

      <Sequence from={p2Start} durationInFrames={P2}>
        <Panel src={panelPaths[1]} duration={P2} origin="40% 61%" fromScale={1.02} toScale={1.105} enter="slide" />
        <PanelBadge number={2} />
        <StoryHeader text="“政府の役人”を名乗る男" />
        <Caption accent="#52d8ff" fontSize={59}>政府の役人を装い{"\n"}秘密の会合へ</Caption>
      </Sequence>

      <Sequence from={p3Start} durationInFrames={P3}>
        <Panel src={panelPaths[2]} duration={P3} origin="43% 69%" fromScale={1.04} toScale={1.13} enter="parallax" />
        <PanelBadge number={3} />
        <Caption variant="speech" fontSize={72}>私が{"\n"}買いましょう</Caption>
      </Sequence>

      <Sequence from={p4Start} durationInFrames={P4}>
        <Panel src={panelPaths[3]} duration={P4} origin="46% 53%" fromScale={1.015} toScale={1.085} enter="mask" />
        <PanelBadge number={4} />
        <Caption accent="#ff4b55" fontSize={60}>でも全部ウソ{"\n"}代金を持って逃走</Caption>
      </Sequence>

      <Sequence from={p5Start} durationInFrames={P5_SETUP + P5_PUNCH}>
        <Panel src={panelPaths[4]} duration={P5_SETUP + P5_PUNCH} origin="47% 60%" fromScale={1.02} toScale={1.105} enter="callback" />
        <PanelBadge number={5} />
        <StoryHeader text="ところが後日…" />
        <Sequence from={0} durationInFrames={P5_SETUP}>
          <Caption accent="#ffd341" fontSize={60}>ところが後日{"\n"}また同じ手口</Caption>
        </Sequence>
        <Sequence from={P5_SETUP} durationInFrames={P5_PUNCH}>
          <Punchline />
        </Sequence>
      </Sequence>

      <Disclosure />

      {episode.bgm && (
        <Audio
          src={staticFile(episode.bgm)}
          volume={(audioFrame) =>
            interpolate(audioFrame, [0, 15, EIFFEL_SCAM_DURATION - 20, EIFFEL_SCAM_DURATION - 1], [0, 0.075, 0.075, 0], clamp)
          }
        />
      )}
      {episode.odaiAudioFile && (
        <Sequence from={4} durationInFrames={P1 - 4}>
          <Audio src={staticFile(episode.odaiAudioFile)} volume={1} />
        </Sequence>
      )}
      {episode.answers.map((answer, index) => {
        const starts = [p2Start + 4, p3Start + 4, p4Start + 4, p5Start + 4];
        return answer.audioFile ? (
          <Sequence key={answer.id} from={starts[index]}>
            <Audio src={staticFile(answer.audioFile)} volume={1} />
          </Sequence>
        ) : null;
      })}
      {episode.outroAudioFile && (
        <Sequence from={punchStart + 3}>
          <Audio src={staticFile(episode.outroAudioFile)} volume={1} />
        </Sequence>
      )}

      <Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={0.16} />
      <Sequence from={p2Start}>
        <Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={0.12} />
      </Sequence>
      <Sequence from={p3Start}>
        <Audio src={staticFile("Effect/シャキーン1.mp3")} volume={0.105} />
      </Sequence>
      <Sequence from={p4Start}>
        <Audio src={staticFile("Effect/ショック2.mp3")} volume={0.13} />
      </Sequence>
      <Sequence from={p5Start}>
        <Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={0.1} />
      </Sequence>
      <Sequence from={punchStart}>
        <Audio src={staticFile("Effect/ビシッとツッコミ1.mp3")} volume={0.18} />
      </Sequence>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: interpolate(frame, [EIFFEL_SCAM_DURATION - 8, EIFFEL_SCAM_DURATION - 1], [0, 0.2], clamp),
          background: "radial-gradient(circle at 36% 58%,rgba(255,218,116,.55),transparent 58%)",
        }}
      />
    </AbsoluteFill>
  );
};
