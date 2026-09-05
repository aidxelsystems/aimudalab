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

export const MICROWAVE_MESH_FPS = 30;
export const MICROWAVE_MESH_WIDTH = 1080;
export const MICROWAVE_MESH_HEIGHT = 1920;

const CUT_CURSOR = "movie/Microwave_safety_reenactment_video_1080p_202609031859.mp4";
const CUT_FOOD_A = "movie/Microwave_operating_in_kitchen_1080p_202609031837.mp4";
const CUT_FOOD_B = "movie/Microwave_operating_in_kitchen_1080p_202609031902.mp4";
const fps = MICROWAVE_MESH_FPS;
const frames = (s: number) => Math.max(1, Math.ceil(s * fps));

export const getMicrowaveMeshTimeline = (episode: Episode) => {
  const minimums = [2.4, 2.8, 3.7, 4.2, 4.0, 3.4, 3.2];
  const hookFrames = Math.max(frames(episode.odaiDuration ?? 1.8), frames(1.8));
  const answerFrames = episode.answers.map((a, i) => Math.max(frames(a.duration ?? minimums[i]), frames(minimums[i])));
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(frames(episode.outroDuration ?? 3.6), frames(3.6));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const C = {
  ink: "#03080d",
  navy: "#071b2b",
  cyan: "#35e6ff",
  blue: "#168fff",
  yellow: "#ffe34d",
  amber: "#ff9f38",
  red: "#ff4b55",
  green: "#66f2aa",
};

const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 1.1) % 54;
  return <AbsoluteFill style={{background: "radial-gradient(circle at 50% 36%,#163c52 0%,#071b2b 45%,#020609 100%)"}}>
    <AbsoluteFill style={{opacity: .11, backgroundImage: "linear-gradient(#59dff2 1px,transparent 1px),linear-gradient(90deg,#59dff2 1px,transparent 1px)", backgroundSize: "54px 54px", backgroundPosition: `${shift}px ${shift}px`}} />
  </AbsoluteFill>;
};

const MeshOverlay: React.FC<{opacity?: number; scale?: number}> = ({opacity = .25, scale = 1}) => (
  <AbsoluteFill style={{opacity, transform: `scale(${scale})`, backgroundImage: "radial-gradient(circle,#d7edf2 0 3px,transparent 3.7px)", backgroundSize: "25px 25px", maskImage: "linear-gradient(180deg,transparent 4%,#000 22%,#000 78%,transparent 96%)"}} />
);

const Shade: React.FC<{strong?: boolean}> = ({strong = false}) => (
  <AbsoluteFill style={{background: strong ? "linear-gradient(180deg,rgba(1,5,9,.9),rgba(1,5,9,.2) 39%,rgba(1,5,9,.78))" : "linear-gradient(180deg,rgba(1,5,9,.72),rgba(1,5,9,.04) 45%,rgba(1,5,9,.68))"}} />
);

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", zIndex: 50, top: 43, left: 34, padding: "12px 20px 15px", border: "3px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#0d536e,#14a3b9)", color: "#fff", fontSize: 25, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #03121b,0 14px 28px #0008"}}>AI、使い方ちがう！</div>
);

const AiBadge: React.FC<{diagram?: boolean}> = ({diagram = false}) => (
  <div style={{position: "absolute", zIndex: 50, top: 47, right: 33, padding: "10px 14px 12px", border: "2px solid #ffffffaa", borderRadius: 9, background: "#000b", color: "#fff", fontSize: 19, lineHeight: 1, fontWeight: 700}}>{diagram ? "AI再現・概念図" : "AI再現映像"}</div>
);

const Headline: React.FC<{children: React.ReactNode; color?: string; size?: number; top?: number}> = ({children, color = "#fff", size = 74, top = 150}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 190, mass: .55}});
  return <div style={{position: "absolute", zIndex: 45, top, left: 30, right: 30, color, textAlign: "center", fontSize: size, lineHeight: 1.06, fontWeight: 900, letterSpacing: -2, WebkitTextStroke: "7px #03101a", paintOrder: "stroke fill", textShadow: "0 13px 30px #000", transform: `scale(${interpolate(enter, [0, 1], [1.17, 1])})`}}>{children}</div>;
};

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = C.cyan}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", zIndex: 60, left: 64, right: 64, bottom: 235, padding: "18px 24px 22px", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(2,9,15,.94)", boxShadow: "0 15px 38px #000b", color: "#fff", textAlign: "center", fontSize: 43, lineHeight: 1.22, fontWeight: 900, textShadow: "0 3px 7px #000", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>{children}</div>;
};

const SourceFooter: React.FC = () => <div style={{position: "absolute", zIndex: 30, left: 38, bottom: 184, color: "#c6d4dc", fontSize: 20, fontWeight: 700}}>出典: U.S. FDA</div>;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const alarm = interpolate(frame, [5, 13, 25, 38], [0, 1, .25, .8], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CURSOR)} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <Shade /><SeriesBadge /><AiBadge />
    <Headline size={72}>その黒い網、<br/><span style={{color: C.red, fontSize: 118}}>消したらダメ。</span></Headline>
    <div style={{position: "absolute", zIndex: 35, left: 200, right: 200, top: 650, height: 460, border: `11px solid rgba(255,75,85,${alarm})`, boxShadow: `0 0 60px rgba(255,75,85,${alarm})`, borderRadius: 40}} />
  </AbsoluteFill>;
};

const MisunderstandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cross = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 7, stiffness: 220}});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CURSOR)} startFrom={18} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <Shade /><SeriesBadge /><AiBadge />
    <Headline color={C.yellow} size={76}>見づらくする<br/><span style={{fontSize: 108}}>模様じゃない!?</span></Headline>
    <div style={{position: "absolute", zIndex: 42, top: 650, left: 90, color: C.red, fontSize: 260, fontWeight: 900, lineHeight: 1, opacity: cross, transform: `rotate(-9deg) scale(${interpolate(cross, [0, 1], [1.6, 1])})`, textShadow: "0 20px 45px #000"}}>×</div>
    <Caption accent={C.yellow}>えっ、中を見づらくする<br/>模様じゃないのだ？</Caption>
  </AbsoluteFill>;
};

const IdentityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [4, 72], [220, 1510], {extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_CURSOR)} startFrom={72} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <Shade /><SeriesBadge /><AiBadge />
    <Headline size={69}>正体は<br/><span style={{color: C.cyan, fontSize: 100}}>金属製スクリーン</span></Headline>
    <div style={{position: "absolute", zIndex: 38, left: 0, right: 0, top: scan, height: 6, background: C.cyan, boxShadow: `0 0 28px ${C.cyan},0 0 70px ${C.cyan}`}} />
    <Caption>これは、扉に組み込まれた<br/>金属製スクリーン。</Caption>
  </AbsoluteFill>;
};

const LightScene: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(CUT_FOOD_B)} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <Shade /><SeriesBadge /><AiBadge />
    <Headline size={79}>小さな穴を<br/><span style={{color: C.yellow, fontSize: 118}}>光は通る</span></Headline>
    {Array.from({length: 7}, (_, i) => {
      const p = ((frame * 16 + i * 140) % 930);
      return <div key={i} style={{position: "absolute", zIndex: 34, top: 680 + i * 62, left: 45 + p, width: 90, height: 8, borderRadius: 8, background: C.yellow, boxShadow: `0 0 22px ${C.yellow}`, opacity: .86}} />;
    })}
    <Caption accent={C.yellow}>小さな穴から、<br/>庫内の光は外へ通ります。</Caption>
  </AbsoluteFill>;
};

const WavePath: React.FC<{progress: number; color: string; y: number; reverse?: boolean}> = ({progress, color, y, reverse = false}) => {
  const points = Array.from({length: 90}, (_, i) => {
    // Both paths stay on the cavity side of the metal screen (x < 650).
    // The reflected path starts at the screen and travels back into the cavity.
    const x = reverse ? 640 - i * 6.1 : 70 + i * 6.4;
    const yy = y + Math.sin(i * .48) * 58;
    return `${x},${yy}`;
  }).join(" ");
  return <polyline points={points} fill="none" stroke={color} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress} style={{filter: `drop-shadow(0 0 16px ${color})`}} />;
};

const PhysicsScene: React.FC<{summary?: boolean}> = ({summary = false}) => {
  const frame = useCurrentFrame();
  const hit = Math.min(1, frame / 68);
  const bounce = Math.max(0, Math.min(1, (frame - 50) / 55));
  const pulse = 1 + Math.sin(frame * .2) * .035;
  return <AbsoluteFill>
    <GridBackground /><MeshOverlay opacity={.09} /><SeriesBadge /><AiBadge diagram />
    <Headline top={140} size={summary ? 67 : 72}>{summary ? <>中は<span style={{color: C.yellow}}>見える</span><br/>波は<span style={{color: C.cyan}}>戻す</span></> : <>波長が長い<br/><span style={{color: C.cyan, fontSize: 105}}>マイクロ波は反射</span></>}</Headline>
    <div style={{position: "absolute", top: 500, left: 45, right: 45, height: 760, border: "6px solid #ffffffd0", borderRadius: 36, overflow: "hidden", background: "#03101bd9", boxShadow: "0 28px 80px #000d,inset 0 0 70px #000"}}>
      <div style={{position: "absolute", left: 38, top: 42, color: C.amber, fontSize: 28, fontWeight: 900}}>庫内</div>
      <div style={{position: "absolute", right: 34, top: 42, color: "#dceaf0", fontSize: 28, fontWeight: 900}}>外側</div>
      <svg width="100%" height="100%" viewBox="0 0 990 760" style={{position: "absolute", inset: 0}}>
        <defs>
          <pattern id="holes" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="17" cy="17" r="8" fill="#02070a" stroke="#d9e5e9" strokeWidth="3"/></pattern>
        </defs>
        <rect x="650" y="0" width="120" height="760" fill="#8798a0" />
        <rect x="650" y="0" width="120" height="760" fill="url(#holes)" />
        {summary ? <>
          {Array.from({length: 5}, (_, i) => <line key={i} x1="100" y1={190 + i * 70} x2={880} y2={190 + i * 70} stroke={C.yellow} strokeWidth="9" strokeDasharray="20 22" opacity={.8} />)}
          <WavePath progress={hit} color={C.cyan} y={545} />
          <WavePath progress={bounce} color={C.cyan} y={545} reverse />
        </> : <>
          <WavePath progress={hit} color={C.cyan} y={385} />
          <WavePath progress={bounce} color={C.cyan} y={385} reverse />
        </>}
      </svg>
      <div style={{position: "absolute", left: 618, top: 92, padding: "12px 16px", borderRadius: 14, background: C.cyan, color: C.ink, fontSize: 25, fontWeight: 900, transform: `scale(${pulse})`}}>金属</div>
      {!summary && bounce > .05 ? <div style={{position: "absolute", left: 370, bottom: 72, color: C.cyan, fontSize: 68, fontWeight: 900, opacity: bounce}}>↩ 反射</div> : null}
      {summary ? <div style={{position: "absolute", right: 52, bottom: 50, width: 150, height: 100, border: `5px solid ${C.yellow}`, borderRadius: "50%", color: C.yellow, display: "grid", placeItems: "center", fontSize: 44, fontWeight: 900}}>見る</div> : null}
    </div>
    <SourceFooter />
    <Caption accent={summary ? C.yellow : C.cyan}>{summary ? <>だから中は見えても、<br/>マイクロ波は庫内に保てるのだ！</> : <>マイクロ波は波長がずっと長く、<br/>金属面で反射されます。</>}</Caption>
  </AbsoluteFill>;
};

const SafetyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stop = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 8, stiffness: 180}});
  return <AbsoluteFill>
    <GridBackground /><SeriesBadge /><AiBadge diagram />
    <Headline size={68}>扉や網が<br/><span style={{color: C.amber, fontSize: 104}}>傷んでいたら</span></Headline>
    <div style={{position: "absolute", top: 580, left: 120, right: 120, height: 560, border: "8px solid #fff", borderRadius: 44, background: "linear-gradient(145deg,#263843,#07111a)", boxShadow: "0 26px 65px #000c", overflow: "hidden"}}>
      <div style={{position: "absolute", top: 70, left: 160, right: 160, height: 330, border: "17px solid #697b84", borderRadius: 25, backgroundImage: "radial-gradient(circle,#b8c6ca 0 3px,transparent 4px)", backgroundSize: "23px 23px", transform: "skewX(-3deg)"}} />
      <div style={{position: "absolute", top: 145, left: 370, width: 140, height: 230, borderLeft: `13px solid ${C.amber}`, borderRadius: "48%", transform: "rotate(13deg)", boxShadow: `-7px 0 20px ${C.amber}88`}} />
      <div style={{position: "absolute", right: 58, top: 58, color: C.red, fontSize: 190, lineHeight: 1, fontWeight: 900, opacity: stop, transform: `scale(${interpolate(stop, [0, 1], [1.8, 1])})`}}>×</div>
      <div style={{position: "absolute", bottom: 38, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 43, fontWeight: 900}}>使用せずメーカーへ相談</div>
    </div>
    <SourceFooter />
    <Caption accent={C.amber}>扉や網が傷んでいたら、<br/>使わずメーカーへ相談を。</Caption>
  </AbsoluteFill>;
};

const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = 1 + Math.sin(frame * .17) * .025;
  return <AbsoluteFill>
    <GridBackground /><MeshOverlay opacity={.16} scale={1.15} /><SeriesBadge />
    <div style={{position: "absolute", top: 300, left: 40, right: 40, textAlign: "center", color: "#fff", fontSize: 74, lineHeight: 1.12, fontWeight: 900, WebkitTextStroke: "6px #04101a", paintOrder: "stroke fill", transform: `scale(${bob})`}}>この網の役割<br/><span style={{color: C.yellow, fontSize: 114}}>知ってた？</span></div>
    <div style={{position: "absolute", top: 790, left: 92, right: 92, display: "flex", gap: 35}}>
      {["知ってた", "初めて知った"].map((x, i) => <div key={x} style={{flex: 1, padding: "35px 12px 40px", border: "6px solid #fff", borderRadius: 28, background: i ? "#17556b" : "#a76d16", color: "#fff", textAlign: "center", fontSize: i ? 34 : 40, fontWeight: 900, boxShadow: "0 14px 0 #01070b,0 25px 45px #0009"}}>{x}</div>)}
    </div>
    <Caption accent={C.yellow}>この網の役割、知ってた？<br/>コメントで教えて。</Caption>
  </AbsoluteFill>;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 205, mass: .55}});
  const chips = spring({frame: Math.max(0, frame - 26), fps, config: {damping: 9, stiffness: 170}});
  return <AbsoluteFill>
    <GridBackground /><MeshOverlay opacity={.2} scale={1.3} /><SeriesBadge />
    <div style={{position: "absolute", top: 305, left: 45, right: 45, bottom: 225, border: "8px solid #fff", borderRadius: 45, background: "rgba(3,15,25,.89)", boxShadow: "0 20px 0 #010508,0 45px 90px #000d", overflow: "hidden", transform: `scale(${interpolate(enter, [0, 1], [1.2, 1])})`}}>
      <div style={{position: "absolute", left: -60, top: 250, width: 550, height: 320, background: `radial-gradient(circle,${C.yellow}88,transparent 62%)`}} />
      <div style={{position: "absolute", right: -80, top: 500, width: 580, height: 330, background: `radial-gradient(circle,${C.cyan}66,transparent 64%)`}} />
      <div style={{position: "absolute", top: 115, left: 25, right: 25, textAlign: "center", color: "#fff", fontSize: 72, lineHeight: 1.13, fontWeight: 900}}>見せるけど、</div>
      <div style={{position: "absolute", top: 270, left: 20, right: 20, textAlign: "center", color: C.yellow, fontSize: 111, lineHeight: 1, letterSpacing: -5, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #796400,0 28px 50px #000"}}>ださんのかい！</div>
      <div style={{position: "absolute", top: 530, left: 100, right: 100, height: 210, borderLeft: `15px solid ${C.yellow}`, borderRight: `15px solid ${C.cyan}`, backgroundImage: "radial-gradient(circle,#d8e4e8 0 3px,transparent 4px)", backgroundSize: "24px 24px", opacity: .86}} />
      <div style={{position: "absolute", left: 92, right: 92, bottom: 92, padding: "25px 16px 30px", borderRadius: 20, border: "4px solid #fff", background: C.cyan, color: C.ink, textAlign: "center", fontSize: 42, fontWeight: 900, opacity: chips, transform: `scale(${interpolate(chips, [0, 1], [.8, 1])})`, boxShadow: `0 0 32px ${C.cyan}77`}}>チャンネル登録もよろしく！</div>
    </div>
  </AbsoluteFill>;
};

const SceneAudio: React.FC<{voice?: string; effect?: string; effectVolume?: number}> = ({voice, effect, effectVolume = .18}) => <>{voice ? <Audio src={staticFile(voice)} volume={1} /> : null}{effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}</>;

export const MicrowaveMeshShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getMicrowaveMeshTimeline(episode);
  const scenes = [
    <MisunderstandingScene key="misunderstanding" />,
    <IdentityScene key="identity" />,
    <LightScene key="light" />,
    <PhysicsScene key="physics" />,
    <PhysicsScene key="summary" summary />,
    <SafetyScene key="safety" />,
    <QuestionScene key="question" />,
  ];
  return <AbsoluteFill style={{backgroundColor: C.ink, fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
    <Audio src={staticFile(episode.bgm ?? "BGM/Space Eyeglasses.mp3")} startFrom={135} volume={(frame) => .095 * interpolate(frame, [0, 10, timeline.totalFrames - 24, timeline.totalFrames - 10, timeline.totalFrames], [0, 1, 1, .3, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
    <Sequence from={0} durationInFrames={timeline.hookFrames}>
      <HookScene /><SceneAudio voice={episode.odaiAudioFile} effect="Effect/ショック2.mp3" effectVolume={.2} />
    </Sequence>
    {episode.answers.map((answer, i) => <Sequence key={answer.id} from={timeline.answerStarts[i]} durationInFrames={timeline.answerFrames[i]}>
      {scenes[i]}
      <SceneAudio voice={answer.audioFile} effect={i === 0 ? "Effect/クイズ不正解1.mp3" : i === 3 ? "Effect/レーザー走査音.mp3" : i === 5 ? "Effect/決定ボタンを押す3.mp3" : undefined} effectVolume={i === 3 ? .1 : .16} />
    </Sequence>)}
    <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
      <OutroScene /><SceneAudio voice={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.28} />
    </Sequence>
  </AbsoluteFill>;
};
