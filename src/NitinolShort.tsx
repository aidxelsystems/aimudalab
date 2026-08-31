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

export const NITINOL_FPS = 30;
export const NITINOL_WIDTH = 1080;
export const NITINOL_HEIGHT = 1920;

const secondsToFrames = (seconds: number) => Math.max(1, Math.ceil(seconds * NITINOL_FPS));

export const getNitinolTimeline = (episode: Episode) => {
  const minimums = [2.0, 2.8, 3.5, 6.0, 2.7, 6.9];
  const hookFrames = Math.max(secondsToFrames(episode.odaiDuration ?? 3.2), secondsToFrames(3.2));
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(secondsToFrames(answer.duration ?? minimums[index] ?? 3), secondsToFrames(minimums[index] ?? 3)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(secondsToFrames(episode.outroDuration ?? 3.4), secondsToFrames(3.4));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const colors = {
  ink: "#050b12",
  navy: "#071a2a",
  cyan: "#6ee7ff",
  orange: "#ffb44a",
  silver: "#dce9f2",
  yellow: "#fff35f",
};

const Background: React.FC<{warm?: boolean}> = ({warm = false}) => (
  <AbsoluteFill style={{background: warm
    ? "radial-gradient(circle at 50% 43%,#40251a 0%,#101c28 47%,#04080d 100%)"
    : "radial-gradient(circle at 50% 42%,#123750 0%,#091927 48%,#03070b 100%)"}}>
    <AbsoluteFill style={{opacity: 0.13, backgroundImage: "linear-gradient(#6ee7ff 2px,transparent 2px),linear-gradient(90deg,#6ee7ff 2px,transparent 2px)", backgroundSize: "72px 72px"}} />
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.5),transparent 34%,rgba(0,0,0,.55))"}} />
  </AbsoluteFill>
);

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", zIndex: 20, top: 42, left: 34, width: 360, boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden", textAlign: "center", padding: "11px 10px 14px", border: "3px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#0b3550,#147a92)", color: "#fff", fontSize: 24, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #03131d,0 14px 30px #0009"}}>世界のバズ、AIで再現</div>
);

const AiBadge: React.FC<{diagram?: boolean}> = ({diagram = false}) => (
  <div style={{position: "absolute", zIndex: 20, top: 47, right: 31, whiteSpace: "nowrap", padding: "9px 13px 11px", border: "2px solid #fff9", borderRadius: 8, background: "rgba(0,0,0,.68)", color: "#fff", fontSize: 19, lineHeight: 1, fontWeight: 700}}>{diagram ? "AIによる仕組み図" : "AI再現映像"}</div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = colors.cyan}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", left: "50%", bottom: 250, width: 930, transform: "translateX(-50%)", boxSizing: "border-box", padding: "18px 24px 23px", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(3,10,16,.93)", color: "#fff", fontSize: 46, lineHeight: 1.2, fontWeight: 900, textAlign: "center", textShadow: "0 3px 7px #000", boxShadow: "0 14px 38px #000a", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>{children}</div>;
};

const VideoShade: React.FC = () => <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.68) 0%,rgba(0,0,0,.03) 44%,rgba(0,0,0,.5) 100%)"}} />;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const punch = spring({frame, fps: NITINOL_FPS, config: {damping: 8, stiffness: 190, mass: .6}});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile("movie/Wire_unfolding_into_star_shape_202608311240.mp4")} startFrom={8} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <div style={{position: "absolute", top: 170, left: 25, right: 25, textAlign: "center", transform: `scale(${interpolate(punch, [0, 1], [1.22, 1])})`}}>
      <div style={{color: "#fff", fontSize: 67, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #03101a", paintOrder: "stroke fill", textShadow: "0 12px 28px #000"}}>お湯で元に戻る</div>
      <div style={{marginTop: 20, color: colors.yellow, fontSize: 130, lineHeight: .92, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #716500,0 28px 54px #000"}}>金属</div>
    </div>
  </AbsoluteFill>;
};

const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bounce = 1 + Math.sin(frame * .2) * .025;
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile("movie/Wire_unfolding_into_star_shape_202608311240.mp4")} startFrom={78} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <div style={{position: "absolute", top: 195, left: 30, right: 30, textAlign: "center", transform: `scale(${bounce})`, color: colors.yellow, fontSize: 105, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #775f00,0 26px 50px #000"}}>形を<br/>覚えてる？</div>
    <Caption>えっ、形を覚えてるのだ？</Caption>
  </AbsoluteFill>;
};

const NameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: NITINOL_FPS, config: {damping: 7, stiffness: 215, mass: .55}});
  return <AbsoluteFill>
    <Background /><SeriesBadge /><AiBadge />
    <div style={{position: "absolute", top: 250, left: 32, right: 32, textAlign: "center"}}>
      <div style={{color: "#fff", fontSize: 49, fontWeight: 900}}>正体は</div>
      <div style={{marginTop: 28, color: colors.silver, fontSize: 65, fontWeight: 900}}>形状記憶合金</div>
      <div style={{marginTop: 22, padding: "28px 18px 38px", border: "9px solid #fff", borderRadius: 28, background: "linear-gradient(135deg,#27485d,#8da6b5 52%,#1e3f54)", color: colors.yellow, fontSize: 122, lineHeight: 1, fontWeight: 900, letterSpacing: -7, boxShadow: "0 15px 0 #04131d,0 35px 72px #000c", transform: `scale(${interpolate(enter, [0, 1], [1.45, 1])})`}}>ニチノール</div>
      <div style={{display: "flex", gap: 25, justifyContent: "center", marginTop: 100}}>
        <div style={{padding: "26px 35px", border: "5px solid #fff", borderRadius: 22, background: "#185b72", color: "#fff", fontSize: 48, fontWeight: 900}}>NICKEL</div>
        <div style={{color: colors.orange, fontSize: 82, fontWeight: 900}}>+</div>
        <div style={{padding: "26px 35px", border: "5px solid #fff", borderRadius: 22, background: "#795829", color: "#fff", fontSize: 48, fontWeight: 900}}>TITANIUM</div>
      </div>
    </div>
    <Caption accent={colors.yellow}>正体は、形状記憶合金<br/>ニチノール。</Caption>
  </AbsoluteFill>;
};

const SecondRecoveryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const heat = interpolate(frame, [0, 85], [18, 82], {extrapolateRight: "clamp"});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile("movie/Alloy_wire_shape_recovery_experi…_202608311241.mp4")} startFrom={4} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <VideoShade /><SeriesBadge /><AiBadge />
    <div style={{position: "absolute", top: 165, left: 28, right: 28, textAlign: "center", color: "#fff", fontSize: 64, lineHeight: 1.05, fontWeight: 900, WebkitTextStroke: "7px #03101a", paintOrder: "stroke fill", textShadow: "0 12px 28px #000"}}>大きく曲げても<br/><span style={{color: colors.yellow, fontSize: 119}}>また復元</span></div>
    <div style={{position: "absolute", right: 45, top: 610, width: 82, height: 470, border: "5px solid #fff", borderRadius: 50, background: "rgba(0,0,0,.72)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 8, right: 8, bottom: 8, height: `${heat}%`, borderRadius: 40, background: "linear-gradient(0deg,#34c8ff,#ffb44a 60%,#ff645e)"}} />
    </div>
    <Caption accent={colors.orange}>こんなに曲げても、<br/>また戻ったのだ！</Caption>
  </AbsoluteFill>;
};

const LatticeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [32, 130], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const nodes = Array.from({length: 24}, (_, index) => ({col: index % 6, row: Math.floor(index / 6)}));
  return <AbsoluteFill>
    <Background warm={progress > .5} /><SeriesBadge /><AiBadge diagram />
    <div style={{position: "absolute", top: 165, left: 28, right: 28, textAlign: "center", color: "#fff", fontSize: 59, lineHeight: 1.08, fontWeight: 900}}>温度で 内部の構造が<br/><span style={{color: colors.orange, fontSize: 85}}>切り替わる</span></div>
    <div style={{position: "absolute", top: 480, left: 75, right: 75, height: 700, border: "7px solid #fff", borderRadius: 35, background: "rgba(2,10,16,.8)", boxShadow: "inset 0 0 70px #000,0 28px 60px #0009"}}>
      <div style={{position: "absolute", top: 30, left: 38, color: colors.cyan, fontSize: 37, fontWeight: 900}}>低温側</div>
      <div style={{position: "absolute", top: 30, right: 38, color: colors.orange, fontSize: 37, fontWeight: 900}}>高温側</div>
      {nodes.map(({col, row}, index) => {
        const coldX = 105 + col * 130 + (row % 2) * 35;
        const coldY = 175 + row * 125 + col * 7;
        const hotX = 105 + col * 130;
        const hotY = 175 + row * 125;
        return <div key={index} style={{position: "absolute", left: interpolate(progress, [0, 1], [coldX, hotX]), top: interpolate(progress, [0, 1], [coldY, hotY]), width: 58, height: 58, borderRadius: "50%", background: `radial-gradient(circle at 32% 28%,#fff,${progress > .5 ? "#ffc879" : "#79e7ff"} 42%,#29495c 76%)`, border: "3px solid #fff9", boxShadow: `0 0 ${8 + progress * 14}px ${progress > .5 ? "#ffb44a" : "#6ee7ff"}`}} />;
      })}
      <div style={{position: "absolute", left: 55, right: 55, bottom: 42, height: 25, borderRadius: 20, background: "linear-gradient(90deg,#42cfff,#fff,#ff9f42)"}}>
        <div style={{position: "absolute", top: -19, left: `${progress * 100}%`, width: 62, height: 62, borderRadius: "50%", border: "5px solid #fff", background: colors.orange, transform: "translateX(-50%)", boxShadow: "0 0 25px #ffad44"}} />
      </div>
      <div style={{position: "absolute", right: 22, bottom: 14, padding: "6px 11px 8px", borderRadius: 6, background: "#000c", color: "#fff", fontSize: 22, fontWeight: 700}}>簡略図</div>
    </div>
    <div style={{position: "absolute", left: 42, bottom: 188, color: "#d8e5ed", fontSize: 22, fontWeight: 700}}>出典: NASA / FDA</div>
    <Caption accent={colors.orange}>内部の結晶構造が切り替わり、<br/>設定された形へ回復します。</Caption>
  </AbsoluteFill>;
};

const SuperelasticScene: React.FC = () => {
  const frame = useCurrentFrame();
  const squeeze = Math.sin(Math.min(frame, 72) / 72 * Math.PI);
  return <AbsoluteFill>
    <Background /><SeriesBadge /><AiBadge diagram />
    <div style={{position: "absolute", top: 170, left: 30, right: 30, textAlign: "center", color: colors.yellow, fontSize: 91, lineHeight: 1.05, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #6e6200,0 25px 48px #000"}}>形状記憶<br/>＋ 超弾性</div>
    <div style={{position: "absolute", left: 155, right: 155, top: 650, height: 410}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 160, height: 34, borderRadius: 30, background: "linear-gradient(180deg,#fff,#8fa9ba 45%,#324e61)", transform: `scaleX(${1 - squeeze * .18}) rotate(${squeeze * 16}deg)`, boxShadow: "0 12px 28px #000,0 0 25px #6ee7ff88"}} />
      <div style={{position: "absolute", left: 10, top: 40, color: colors.orange, fontSize: 120, fontWeight: 900, transform: `translateX(${squeeze * 180}px)`}}>→</div>
      <div style={{position: "absolute", right: 10, top: 40, color: colors.orange, fontSize: 120, fontWeight: 900, transform: `translateX(${-squeeze * 180}px)`}}>←</div>
    </div>
    <Caption>つぶしても、<br/>戻る力がすごいのだ。</Caption>
  </AbsoluteFill>;
};

const StentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const release = interpolate(frame, [36, 132], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const width = interpolate(release, [0, 1], [130, 410]);
  return <AbsoluteFill>
    <Background /><SeriesBadge /><AiBadge diagram />
    <div style={{position: "absolute", top: 165, left: 28, right: 28, textAlign: "center", color: "#fff", fontSize: 57, lineHeight: 1.05, fontWeight: 900}}>細くなった血管を<br/><span style={{color: colors.yellow, fontSize: 81}}>内側から広げる</span></div>
    <div style={{position: "absolute", left: 80, right: 80, top: 550, height: 720, border: "7px solid #fff", borderRadius: 42, background: "#140b15", overflow: "hidden", boxShadow: "inset 0 0 80px #000,0 30px 70px #000a"}}>
      <div style={{position: "absolute", left: 40, right: 40, top: 190, height: 300, borderRadius: "50% / 35%", border: "34px solid #b94359", background: "linear-gradient(180deg,#5e1725,#260711)", boxShadow: "inset 0 0 38px #000,0 0 30px #e1516766"}} />
      <div style={{position: "absolute", left: 56, top: 235, width: interpolate(release, [0, 1], [255, 92]), height: 210, borderRadius: "45%", background: "linear-gradient(90deg,#e6b760,#9e642f)", boxShadow: "inset -15px 0 25px #6b351f,0 0 10px #ffd98a"}} />
      <div style={{position: "absolute", right: 56, top: 235, width: interpolate(release, [0, 1], [255, 92]), height: 210, borderRadius: "45%", background: "linear-gradient(270deg,#e6b760,#9e642f)", boxShadow: "inset 15px 0 25px #6b351f,0 0 10px #ffd98a"}} />
      <div style={{position: "absolute", left: interpolate(release, [0, 1], [230, 65]), top: 285, width: interpolate(release, [0, 1], [500, 180]), height: 90, borderRadius: 50, background: "linear-gradient(180deg,#9cc4db,#27485e)", border: "5px solid #d8f2ff", boxShadow: "0 10px 30px #000"}} />
      <div style={{position: "absolute", left: "50%", top: 238, width, height: 190, transform: "translateX(-50%)", overflow: "hidden"}}>
        {Array.from({length: 9}, (_, index) => <div key={index} style={{position: "absolute", left: `${index * 12}%`, top: 15, width: 8, height: 160, background: colors.silver, transform: `rotate(${index % 2 ? -28 : 28}deg)`, transformOrigin: "center", boxShadow: "0 0 8px #fff"}} />)}
        {Array.from({length: 7}, (_, index) => <div key={`h${index}`} style={{position: "absolute", left: 10, right: 10, top: 18 + index * 24, height: 5, background: "#a9c9d9", transform: `skewX(${index % 2 ? 24 : -24}deg)`}} />)}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center", color: "#cfe9f6", fontSize: 29, fontWeight: 900}}>血液の通り道を保つ</div>
      <div style={{position: "absolute", right: 25, top: 20, padding: "8px 13px 10px", borderRadius: 7, background: "#000d", color: "#fff", fontSize: 21, fontWeight: 700}}>概念図</div>
    </div>
    <div style={{position: "absolute", left: 38, bottom: 188, color: "#d8e5ed", fontSize: 21, fontWeight: 700}}>出典: FDA / Stoeckel et al.</div>
    <Caption accent={colors.yellow}>血管を内側から広げる<br/>「ステント」という器具にも。</Caption>
  </AbsoluteFill>;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: NITINOL_FPS, config: {damping: 7, stiffness: 210, mass: .6}});
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile("movie/Wire_unfolding_into_star_shape_202608311240.mp4")} startFrom={96} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    <AbsoluteFill style={{background: "rgba(2,8,13,.7)"}} />
    <div style={{position: "absolute", top: 180, bottom: 190, left: 44, right: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "10px solid #fff", borderRadius: 42, background: "rgba(4,16,25,.84)", boxShadow: "0 18px 0 #01070b,0 42px 85px #000c,inset 0 0 60px #6ee7ff33", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])})`}}>
      <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#104057", fontSize: 42, lineHeight: 1, fontWeight: 900}}>ニチノール</div>
      <div style={{marginTop: 52, color: "#fff", fontSize: 73, lineHeight: 1, fontWeight: 900}}>金属のほうが</div>
      <div style={{marginTop: 28, color: colors.yellow, fontSize: 119, lineHeight: .92, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #716300,0 28px 52px #000"}}>よく<br/>覚えとる！</div>
      <div style={{marginTop: 45, padding: "18px 30px 22px", borderRadius: 18, background: colors.cyan, color: "#062333", fontSize: 38, lineHeight: 1, fontWeight: 900, opacity: interpolate(frame, [70, 82], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), transform: `scale(${interpolate(frame, [70, 82], [.85, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})})`}}>チャンネル登録もよろしく！</div>
    </div>
  </AbsoluteFill>;
};

const SceneAudio: React.FC<{path?: string; effect?: string; volume?: number}> = ({path, effect, volume = .25}) => <>{path ? <Audio src={staticFile(path)} volume={1} /> : null}{effect ? <Audio src={staticFile(effect)} volume={volume} /> : null}</>;

export const NitinolShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getNitinolTimeline(episode);
  const scenes = [<QuestionScene key="question" />, <NameScene key="name" />, <SecondRecoveryScene key="second" />, <LatticeScene key="lattice" />, <SuperelasticScene key="elastic" />, <StentScene key="stent" />];
  return <AbsoluteFill style={{backgroundColor: colors.ink, fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
    <Audio src={staticFile(episode.bgm ?? "BGM/Metal Memory Switch.mp3")} volume={(frame) => .105 * interpolate(frame, [0, 8, timeline.totalFrames - 28, timeline.totalFrames - 12, timeline.totalFrames], [0, 1, 1, .12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
    <Sequence from={0} durationInFrames={timeline.hookFrames}>
      <HookScene /><SceneAudio path={episode.odaiAudioFile} effect="Effect/金属タイトル表示2.mp3" volume={.22} />
    </Sequence>
    {episode.answers.map((answer, index) => <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
      {scenes[index]}<SceneAudio path={answer.audioFile} effect={index === 1 ? "Effect/シャキーン1.mp3" : index === 2 ? "Effect/決定ボタンを押す3.mp3" : undefined} volume={.2} />
    </Sequence>)}
    <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
      <OutroScene /><SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" volume={.34} />
    </Sequence>
  </AbsoluteFill>;
};
