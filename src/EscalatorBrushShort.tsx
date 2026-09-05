import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const ESCALATOR_BRUSH_FPS = 30;
export const ESCALATOR_BRUSH_WIDTH = 1080;
export const ESCALATOR_BRUSH_HEIGHT = 1920;

const CUT_CORRECT = "movie/Passenger_adjusting_foot_on_esca…_202609031302.mp4";
const CUT_WRONG = "movie/Escalator_safety_public-safety_r…_1080p_202609031300.mp4";
const frames = (seconds: number) => Math.max(1, Math.ceil(seconds * ESCALATOR_BRUSH_FPS));

export const getEscalatorBrushTimeline = (episode: Episode) => {
  const minimums = [2.8, 2.0, 3.5, 4.3, 3.1, 3.2, 3.5];
  const hookFrames = Math.max(frames(episode.odaiDuration ?? 1.8), frames(1.8));
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(frames(answer.duration ?? minimums[index] ?? 3), frames(minimums[index] ?? 3)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(frames(episode.outroDuration ?? 3.7), frames(3.7));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const colors = {
  ink: "#071019",
  navy: "#09283a",
  cyan: "#59e4f5",
  yellow: "#ffe75a",
  amber: "#ffad42",
  red: "#ff4f55",
  green: "#6ee7a8",
};

const BaseBackground: React.FC = () => (
  <AbsoluteFill style={{background: "radial-gradient(circle at 50% 38%,#164860 0%,#092435 44%,#050b11 100%)"}}>
    <AbsoluteFill style={{opacity: .13, backgroundImage: "linear-gradient(#66ddef 2px,transparent 2px),linear-gradient(90deg,#66ddef 2px,transparent 2px)", backgroundSize: "72px 72px"}} />
  </AbsoluteFill>
);

const VideoShade: React.FC = () => (
  <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(2,8,12,.78),rgba(2,8,12,.04) 42%,rgba(2,8,12,.57) 100%)"}} />
);

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", zIndex: 20, top: 42, left: 34, padding: "12px 18px 15px", border: "3px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#0b4d68,#13859b)", color: "#fff", fontSize: 25, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #03131d,0 14px 30px #0008"}}>AI、使い方ちがう！</div>
);

const AiBadge: React.FC<{diagram?: boolean}> = ({diagram = false}) => (
  <div style={{position: "absolute", zIndex: 20, top: 47, right: 31, padding: "9px 13px 11px", border: "2px solid #fff9", borderRadius: 8, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 19, lineHeight: 1, fontWeight: 700}}>{diagram ? "AIによる仕組み図" : "AI再現映像"}</div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = colors.cyan}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", zIndex: 30, left: "50%", bottom: 250, width: 930, transform: "translateX(-50%)", padding: "18px 24px 23px", boxSizing: "border-box", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(3,10,16,.94)", color: "#fff", fontSize: 45, lineHeight: 1.2, fontWeight: 900, textAlign: "center", textShadow: "0 3px 7px #000", boxShadow: "0 14px 38px #000a", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>{children}</div>;
};

const Headline: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = "#fff", size = 72}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: ESCALATOR_BRUSH_FPS, config: {damping: 8, stiffness: 190, mass: .55}});
  return <div style={{position: "absolute", zIndex: 25, top: 150, left: 25, right: 25, textAlign: "center", color, fontSize: size, lineHeight: 1.04, fontWeight: 900, WebkitTextStroke: "7px #061018", paintOrder: "stroke fill", textShadow: "0 12px 28px #000", transform: `scale(${interpolate(enter, [0, 1], [1.18, 1])})`}}>{children}</div>;
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const warning = interpolate(frame, [18, 30, 45], [0, 1, .15], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CORRECT)} startFrom={0} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <Headline size={69}>その靴、<br/><span style={{color: colors.yellow, fontSize: 115}}>今すぐ中央へ</span></Headline>
    <div style={{position: "absolute", right: 83, top: 750, width: 250, height: 330, border: `10px solid rgba(255,79,85,${warning})`, borderRadius: 45, boxShadow: `0 0 45px rgba(255,79,85,${warning})`}} />
  </AbsoluteFill>;
};

const TooCloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [15, 48], [0, 230], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CORRECT)} startFrom={12} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <Headline color={colors.red}>端へ寄りすぎ</Headline>
    <div style={{position: "absolute", right: 105 + arrow, top: 890, color: colors.cyan, fontSize: 128, fontWeight: 900, WebkitTextStroke: "4px #fff", paintOrder: "stroke fill"}}>←</div>
    <Caption accent={colors.red}>ブラシに触れたら、<br/>端へ寄りすぎのサインです。</Caption>
  </AbsoluteFill>;
};

const WrongUseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cross = spring({frame: Math.max(0, frame - 18), fps: ESCALATOR_BRUSH_FPS, config: {damping: 7, stiffness: 220, mass: .5}});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_WRONG)} startFrom={14} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <Headline color={colors.yellow} size={88}>靴磨き<br/>じゃない!?</Headline>
    <div style={{position: "absolute", top: 600, left: 90, color: colors.red, fontSize: 260, lineHeight: 1, fontWeight: 900, opacity: cross, transform: `scale(${interpolate(cross, [0, 1], [1.5, 1])}) rotate(-10deg)`, textShadow: "0 15px 38px #000"}}>×</div>
    <Caption accent={colors.yellow}>えっ、靴磨きじゃないのだ？</Caption>
  </AbsoluteFill>;
};

const BrushDiagram: React.FC<{detail?: boolean}> = ({detail = false}) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [18, 82], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shoeX = interpolate(move, [0, .48, 1], [350, 640, 350]);
  return <AbsoluteFill>
    <BaseBackground /><SeriesBadge /><AiBadge diagram />
    <Headline size={detail ? 61 : 67}>{detail ? <>靴や衣服が<br/><span style={{color: colors.yellow}}>隙間へ近づくのを防ぐ</span></> : <>足を端から<br/><span style={{color: colors.yellow}}>遠ざけるガード</span></>}</Headline>
    <div style={{position: "absolute", top: 510, left: 55, right: 55, height: 720, border: "7px solid #fff", borderRadius: 34, background: "rgba(4,13,20,.88)", overflow: "hidden", boxShadow: "0 28px 60px #000a,inset 0 0 55px #000"}}>
      <div style={{position: "absolute", left: 70, right: 200, bottom: 105, height: 225, background: "repeating-linear-gradient(90deg,#85949d 0 8px,#48545c 8px 13px)", borderTop: "8px solid #d8e1e6", transform: "skewY(-2deg)"}} />
      <div style={{position: "absolute", right: 42, top: 75, bottom: 88, width: 155, borderRadius: 14, background: "linear-gradient(90deg,#28343c,#7a8991,#333e45)", border: "5px solid #c9d4da"}} />
      <div style={{position: "absolute", right: 174, bottom: 285, width: 160, height: 105, display: "flex", alignItems: "end"}}>
        {Array.from({length: 22}, (_, i) => <div key={i} style={{width: 7, height: 85 - Math.abs(i - 11) * 2, background: "#11191e", transform: `rotate(${-17 + i * .5}deg)`, transformOrigin: "bottom", borderRadius: 5}} />)}
      </div>
      <div style={{position: "absolute", left: shoeX, bottom: 300, width: 260, height: 125, borderRadius: "78% 25% 28% 25%", background: "linear-gradient(180deg,#fff,#c9d3d9)", border: "6px solid #fff", boxShadow: "0 16px 30px #000b"}}>
        <div style={{position: "absolute", left: 4, right: -8, bottom: -15, height: 32, borderRadius: 18, background: "#eef3f6", border: "5px solid #83929b"}} />
      </div>
      <div style={{position: "absolute", right: 165, bottom: 105, width: 35, height: 210, background: "rgba(255,79,85,.72)", boxShadow: "0 0 30px #ff4f55"}} />
      <div style={{position: "absolute", left: 80, top: 55, color: colors.cyan, fontSize: 37, fontWeight: 900}}>踏段</div>
      <div style={{position: "absolute", right: 47, top: 25, color: "#fff", fontSize: 32, fontWeight: 900}}>側面</div>
      <div style={{position: "absolute", right: 205, bottom: 420, color: colors.yellow, fontSize: 31, fontWeight: 900}}>ブラシ状のガード</div>
      <div style={{position: "absolute", left: 90, bottom: 30, color: "#dbe8ef", fontSize: 23, fontWeight: 700}}>簡略断面図</div>
    </div>
    <div style={{position: "absolute", left: 38, bottom: 188, color: "#d8e5ed", fontSize: 22, fontWeight: 700}}>出典: 東芝エレベータ</div>
    <Caption accent={detail ? colors.amber : colors.yellow}>{detail ? <>踏段と側面の隙間へ、<br/>靴や衣服が近づくのを防ぎます。</> : <>これは、足を側面から遠ざける<br/>安全用のガード。</>}</Caption>
  </AbsoluteFill>;
};

const MeaningScene: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CORRECT)} startFrom={4} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <Headline size={70}>磨くためじゃなく<br/><span style={{color: colors.green, fontSize: 105}}>離れるため</span></Headline>
    <Caption accent={colors.green}>磨くためじゃなく、<br/>離れるためのブラシなのだ。</Caption>
  </AbsoluteFill>
);

const CenterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const check = spring({frame: Math.max(0, frame - 35), fps: ESCALATOR_BRUSH_FPS, config: {damping: 7, stiffness: 210, mass: .55}});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CORRECT)} startFrom={92} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <Headline size={71}>足を離して<br/><span style={{color: colors.green, fontSize: 112}}>ステップ中央へ</span></Headline>
    <div style={{position: "absolute", left: 65, top: 700, color: colors.green, fontSize: 245, fontWeight: 900, opacity: check, transform: `scale(${interpolate(check, [0, 1], [1.5, 1])})`, textShadow: "0 15px 36px #000"}}>✓</div>
    <Caption accent={colors.green}>触れたら足を離して、<br/>ステップの中央へ。</Caption>
  </AbsoluteFill>;
};

const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bounce = 1 + Math.sin(frame * .18) * .02;
  return <AbsoluteFill>
    <BaseBackground /><SeriesBadge />
    <div style={{position: "absolute", top: 270, left: 40, right: 40, textAlign: "center", color: "#fff", fontSize: 76, lineHeight: 1.1, fontWeight: 900, transform: `scale(${bounce})`}}>靴磨きだと<br/><span style={{color: colors.yellow, fontSize: 116}}>思ってた？</span></div>
    <div style={{position: "absolute", top: 750, left: 100, right: 100, display: "flex", gap: 35, justifyContent: "center"}}>
      {["思ってた", "知らなかった"].map((label, i) => <div key={label} style={{flex: 1, padding: "34px 12px 40px", border: "6px solid #fff", borderRadius: 25, background: i ? "#21455b" : "#aa6d18", color: "#fff", fontSize: 39, fontWeight: 900, textAlign: "center", boxShadow: "0 13px 0 #02090d"}}>{label}</div>)}
    </div>
    <Caption accent={colors.yellow}>靴磨きだと思ってた？<br/>コメントで教えてほしいのだ。</Caption>
  </AbsoluteFill>;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: ESCALATOR_BRUSH_FPS, config: {damping: 7, stiffness: 215, mass: .55}});
  const cta = interpolate(frame, [72, 86], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CORRECT)} startFrom={105} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <AbsoluteFill style={{background: "rgba(3,10,16,.72)"}} />
    <SeriesBadge /><AiBadge />
    <div style={{position: "absolute", top: 300, left: 45, right: 45, bottom: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "9px solid #fff", borderRadius: 40, background: "rgba(6,22,32,.88)", textAlign: "center", boxShadow: "0 18px 0 #02080c,0 40px 80px #000c", transform: `scale(${interpolate(enter, [0, 1], [1.22, 1])})`}}>
      <div style={{color: "#fff", fontSize: 91, fontWeight: 900}}>磨くな、</div>
      <div style={{marginTop: 25, color: colors.yellow, fontSize: 143, lineHeight: .95, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #786600,0 28px 55px #000"}}>中央へ！</div>
      <div style={{marginTop: 75, padding: "20px 30px 24px", borderRadius: 18, background: colors.cyan, color: "#062333", fontSize: 39, lineHeight: 1, fontWeight: 900, opacity: cta, transform: `scale(${interpolate(cta, [0, 1], [.85, 1])})`}}>チャンネル登録もよろしく！</div>
    </div>
  </AbsoluteFill>;
};

const SceneAudio: React.FC<{path?: string; effect?: string; volume?: number}> = ({path, effect, volume = .25}) => <>{path ? <Audio src={staticFile(path)} volume={1} /> : null}{effect ? <Audio src={staticFile(effect)} volume={volume} /> : null}</>;

export const EscalatorBrushShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getEscalatorBrushTimeline(episode);
  const scenes = [
    <TooCloseScene key="close" />,
    <WrongUseScene key="wrong" />,
    <BrushDiagram key="guard" />,
    <BrushDiagram key="detail" detail />,
    <MeaningScene key="meaning" />,
    <CenterScene key="center" />,
    <QuestionScene key="question" />,
  ];
  return <AbsoluteFill style={{backgroundColor: colors.ink, fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
    <Audio src={staticFile(episode.bgm ?? "BGM/Cleanline Scan.mp3")} startFrom={210} volume={(frame) => .09 * interpolate(frame, [0, 8, timeline.totalFrames - 25, timeline.totalFrames - 12, timeline.totalFrames], [0, 1, 1, .12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
    <Sequence from={0} durationInFrames={timeline.hookFrames}>
      <HookScene /><SceneAudio path={episode.odaiAudioFile} effect="Effect/ショック2.mp3" volume={.18} />
    </Sequence>
    {episode.answers.map((answer, index) => <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
      {scenes[index]}<SceneAudio path={answer.audioFile} effect={index === 1 ? "Effect/クイズ不正解1.mp3" : index === 5 ? "Effect/決定ボタンを押す3.mp3" : undefined} volume={.18} />
    </Sequence>)}
    <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
      <OutroScene /><SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" volume={.3} />
    </Sequence>
  </AbsoluteFill>;
};
