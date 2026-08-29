import React from "react";
import {loadFont} from "@remotion/google-fonts/NotoSansJP";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const OOBLECK_FPS = 30;
export const OOBLECK_WIDTH = 1080;
export const OOBLECK_HEIGHT = 1920;

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * OOBLECK_FPS));

export const getOobleckTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 1.9), framesFor(1.9, 1.9));
  const minimums = [3.4, 2.8, 3.0, 5.8, 6.8];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.6), framesFor(4.6, 4.6));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const palette = {
  ink: "#100716",
  purple: "#7d2bc2",
  bright: "#d98cff",
  yellow: "#fff15a",
  cyan: "#72e6ff",
};

const Background: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <AbsoluteFill style={{
    background: dark
      ? "radial-gradient(circle at 50% 40%,#36134f 0%,#16081f 52%,#07040a 100%)"
      : "radial-gradient(circle at 50% 38%,#8c3bd0 0%,#3b1459 54%,#100617 100%)",
  }}>
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.45),transparent 32%,rgba(0,0,0,.48))"}} />
  </AbsoluteFill>
);

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 45, left: 38, padding: "12px 21px 15px", border: "4px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#3c125d,#9b39db)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #12051b,0 14px 30px #0009", textShadow: "0 3px 0 #08030c"}}>
    世界のバズ、AIで再現
  </div>
);

const AiBadge: React.FC<{application?: boolean}> = ({application = false}) => (
  <div style={{position: "absolute", top: 49, right: 35, padding: "9px 14px 11px", border: "2px solid #fff9", borderRadius: 8, background: "rgba(0,0,0,.66)", color: "#fff", fontSize: 19, lineHeight: 1, fontWeight: 700, letterSpacing: .5}}>
    {application ? "AIによる応用イメージ" : "AI再現映像"}
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = palette.bright}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: "50%", bottom: 245, width: 920, boxSizing: "border-box", transform: "translateX(-50%)", padding: "18px 24px 23px", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(12,5,16,.92)", color: "#fff", fontSize: 47, lineHeight: 1.21, fontWeight: 900, textAlign: "center", textShadow: "0 3px 6px #000", boxShadow: "0 13px 35px #0009", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>
      {children}
    </div>
  );
};

const LiquidPool: React.FC<{impact?: number; sink?: number}> = ({impact = 0, sink = 0}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * .18) * 8;
  const harden = interpolate(impact, [0, 1], [0, 1]);
  return (
    <div style={{position: "absolute", left: 70, right: 70, top: 700, height: 640, borderRadius: "48% 52% 42% 58% / 22% 25% 75% 78%", background: harden > .35 ? "radial-gradient(circle at 50% 28%,#efd1ff,#b562ea 24%,#6a1e9d 66%,#2b0a42)" : "radial-gradient(circle at 45% 25%,#e7b9ff,#9f49d3 30%,#5c197f 72%)", transform: `translateY(${wave + sink * 18}px) scaleY(${1 - sink * .06})`, border: "9px solid #f2d9ff99", boxShadow: `inset 0 26px 42px #fff5,inset 0 -45px 70px #22072d,0 34px 80px #000a,0 0 ${harden * 55}px #fff`, overflow: "hidden"}}>
      {Array.from({length: 18}, (_, i) => (
        <div key={i} style={{position: "absolute", left: `${8 + (i * 31) % 86}%`, top: `${18 + (i * 47) % 64}%`, width: 13 + (i % 3) * 5, height: 13 + (i % 3) * 5, borderRadius: "50%", background: "#f5d8ff88", transform: `translate(${Math.sin(frame * .09 + i) * (1 - harden) * 18}px,${Math.cos(frame * .08 + i) * (1 - harden) * 14}px)`}} />
      ))}
      {impact > 0 && <div style={{position: "absolute", left: "50%", top: "28%", width: 90 + impact * 560, height: 34 + impact * 220, borderRadius: "50%", border: `${8 + impact * 12}px solid #fff9`, transform: "translate(-50%,-50%)", opacity: 1 - impact}} />}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame >= 44 && frame < 53 ? Math.sin(frame * 5) * (53 - frame) * .9 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${shake * .28}px)`}}>
      <OffthreadVideo
        src={staticFile("movie/Gloved_fist_striking_purple_oobleck_202608290804.mp4")}
        startFrom={12}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.08) 46%,rgba(0,0,0,.4) 100%)"}} />
      <SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 182, left: 30, right: 30, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 86, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #13061b", paintOrder: "stroke fill", textShadow: "0 10px 0 #4c1768,0 25px 46px #000"}}>殴ると固まる</div>
        <div style={{marginTop: 26, color: palette.yellow, fontSize: 142, lineHeight: .9, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #756500,0 30px 58px #000"}}>液体です</div>
      </div>
    </AbsoluteFill>
  );
};

const SinkScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("movie/Hand_pressing_into_purple_oobleck_202608290803.mp4")}
        startFrom={12}
        playbackRate={1.55}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.58) 0%,rgba(0,0,0,.04) 48%,rgba(0,0,0,.42) 100%)"}} />
      <SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 175, left: 35, right: 35, textAlign: "center", color: "#fff", fontSize: 74, lineHeight: 1.05, fontWeight: 900, WebkitTextStroke: "7px #160720", paintOrder: "stroke fill", textShadow: "0 12px 25px #000"}}>なのに――<br/><span style={{color: palette.yellow, fontSize: 112}}>ゆっくり触ると<br/>沈んでいく</span></div>
      <Caption>なのに、ゆっくり触ると、<br/>沈んでいく。</Caption>
    </AbsoluteFill>
  );
};

const NameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: OOBLECK_FPS, config: {damping: 7, stiffness: 210, mass: .55}});
  return (
    <AbsoluteFill>
      <Background dark /><LiquidPool />
      <SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 290, left: 35, right: 35, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 61, fontWeight: 900}}>正体は</div>
        <div style={{marginTop: 35, display: "inline-block", padding: "26px 50px 38px", border: "9px solid #fff", borderRadius: 28, background: "linear-gradient(135deg,#6a219d,#c45bf0)", color: palette.yellow, fontSize: 132, lineHeight: 1, fontWeight: 900, letterSpacing: -6, boxShadow: "0 15px 0 #270735,0 34px 70px #000c", transform: `scale(${interpolate(enter, [0, 1], [1.5, 1])})`}}>ウーブレック</div>
        <div style={{marginTop: 35, color: "#efe0f8", fontSize: 50, fontWeight: 900}}>コーンスターチ＋水の<br/>せん断増粘流体</div>
      </div>
      <Caption accent={palette.yellow}>正体は、ウーブレック。</Caption>
    </AbsoluteFill>
  );
};

const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const swap = Math.sin(frame * .17) > 0;
  return (
    <AbsoluteFill>
      <Background dark /><SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 190, left: 25, right: 25, textAlign: "center", color: palette.yellow, fontSize: 126, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #6d5600,0 26px 50px #000"}}>液体？ 固体？</div>
      <div style={{position: "absolute", left: 100, top: 650, width: 360, height: 430, border: "8px solid #fff", borderRadius: 38, background: "#482060dd", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${swap ? 1.06 : .96})`}}><div style={{fontSize: 190}}>💧</div><div style={{color: "#fff", fontSize: 58, fontWeight: 900}}>ゆっくり</div></div>
      <div style={{position: "absolute", right: 100, top: 650, width: 360, height: 430, border: "8px solid #fff", borderRadius: 38, background: "#67248bdd", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${swap ? .96 : 1.06})`}}><div style={{fontSize: 190}}>🧱</div><div style={{color: "#fff", fontSize: 58, fontWeight: 900}}>急な力</div></div>
      <Caption>これ、液体なの？<br/>固体なの？</Caption>
    </AbsoluteFill>
  );
};

const ParticleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const jam = interpolate(frame, [35, 90], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Background dark /><SeriesBadge /><AiBadge />
      <div style={{position: "absolute", top: 170, left: 30, right: 30, textAlign: "center", color: "#fff", fontSize: 61, fontWeight: 900}}>急な力が加わると</div>
      <div style={{position: "absolute", top: 260, left: 35, right: 35, textAlign: "center", color: palette.yellow, fontSize: 105, lineHeight: .98, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #735e00,0 25px 44px #000"}}>粒子が押し合い<br/>摩擦で詰まる</div>
      <div style={{position: "absolute", left: 100, right: 100, top: 630, height: 610, border: "8px solid #fff", borderRadius: 44, background: "rgba(69,21,96,.78)", overflow: "hidden", boxShadow: "inset 0 0 70px #000a,0 30px 60px #0008"}}>
        {Array.from({length: 35}, (_, i) => {
          const looseX = 55 + ((i * 137) % 760);
          const looseY = 55 + ((i * 199) % 495);
          const packedX = 220 + (i % 7) * 61;
          const packedY = 100 + Math.floor(i / 7) * 72;
          const x = interpolate(jam, [0, 1], [looseX, packedX]);
          const y = interpolate(jam, [0, 1], [looseY, packedY]);
          return <div key={i} style={{position: "absolute", left: x, top: y, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 33% 28%,#fff,#f4a9ff 36%,#8e35c1 72%)", border: "3px solid #fff9", boxShadow: jam > .72 ? "0 0 14px #fff" : "none"}} />;
        })}
        <div style={{position: "absolute", left: 55, right: 55, top: 20, textAlign: "center", color: "#fff", fontSize: 33, fontWeight: 900, opacity: interpolate(jam, [.55, 1], [0, 1])}}>接触ネットワークが一気にできる</div>
      </div>
      <Caption accent={palette.yellow}>粒子が摩擦で詰まり、<br/>流れに強く抵抗します。</Caption>
    </AbsoluteFill>
  );
};

const ArmorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [24, 40, 76], [0, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Background dark /><SeriesBadge /><AiBadge application />
      <div style={{position: "absolute", top: 170, left: 30, right: 30, textAlign: "center", color: "#fff", fontSize: 56, fontWeight: 900}}>工業用のせん断増粘流体は</div>
      <div style={{position: "absolute", top: 255, left: 30, right: 30, textAlign: "center", color: palette.yellow, fontSize: 94, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #735e00,0 24px 45px #000"}}>防護繊維を<br/>強くする研究にも</div>
      <div style={{position: "absolute", left: 105, right: 105, top: 610, height: 650, border: "9px solid #fff", borderRadius: 38, background: "#11172a", overflow: "hidden", boxShadow: `0 30px 70px #000b,0 0 ${24 + strike * 34}px #72e6ff66`}}>
        <Img src={staticFile("image/ai-viral-oobleck-01/protective-vest-stf.png")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 53%", transform: `scale(${1.03 + strike * .025})`}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.18),transparent 52%,rgba(0,0,0,.42))"}} />
        <div style={{position: "absolute", left: 22, bottom: 20, padding: "9px 16px 12px", border: "2px solid #fff9", borderRadius: 9, background: "rgba(0,0,0,.72)", color: "#fff", fontSize: 26, fontWeight: 900}}>防護ベストの断面イメージ</div>
      </div>
      <div style={{position: "absolute", left: 48, bottom: 186, padding: "8px 12px 10px", borderRadius: 6, background: "rgba(0,0,0,.76)", color: "#fff", fontSize: 22, fontWeight: 700}}>出典: NIST Body Armor and Related Materials</div>
      <Caption accent={palette.cyan}>刺す力や衝撃への抵抗を<br/>高める研究にも使われます。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: OOBLECK_FPS, config: {damping: 7, stiffness: 205, mass: .58}});
  return (
    <AbsoluteFill>
      <Background dark /><LiquidPool impact={.45} />
      <div style={{position: "absolute", top: 96, bottom: 108, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "46px 26px 57px", border: "10px solid #fff", borderRadius: 42, background: "rgba(18,6,24,.82)", boxShadow: "0 18px 0 #08030b,0 43px 90px #000b,inset 0 0 65px #d98cff33", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.27, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#4d1768", fontSize: 41, lineHeight: 1, fontWeight: 900}}>ウーブレック</div>
        <div style={{marginTop: 42, color: "#fff", fontSize: 66, lineHeight: 1, fontWeight: 900}}>殴られた時だけ</div>
        <div style={{marginTop: 20, color: palette.yellow, fontSize: 105, lineHeight: .94, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #756400,0 28px 50px #000"}}>本気出すん<br/>かい！</div>
        <div style={{width: "82%", margin: "42px 0 32px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 58, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 24, padding: "17px 61px 24px", border: "7px solid #fff", borderRadius: 999, background: "#e7c81f", color: "#13171b", fontSize: 100, lineHeight: 1, fontWeight: 900, boxShadow: "0 11px 0 #6f6000"}}>よろしく</div>
        <div style={{marginTop: 45, color: "#efe7f3", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; volume?: number}> = ({path, effect, volume = .25}) => <>{path ? <Audio src={staticFile(path)} volume={1} /> : null}{effect ? <Audio src={staticFile(effect)} volume={volume} /> : null}</>;

export const OobleckShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getOobleckTimeline(episode);
  const scenes = [<SinkScene key="sink" />, <NameScene key="name" />, <QuestionScene key="question" />, <ParticleScene key="particles" />, <ArmorScene key="armor" />];
  return (
    <AbsoluteFill style={{backgroundColor: palette.ink, fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Audio src={staticFile(episode.bgm ?? "BGM/Lab Boop Reveal.mp3")} volume={(frame) => .1 * interpolate(frame, [0, 8, timeline.totalFrames - 20, timeline.totalFrames], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} />
        <Sequence from={42}><Audio src={staticFile("Effect/ドーン.mp3")} volume={.34} /></Sequence>
      </Sequence>
      {episode.answers.map((answer, index) => <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>{scenes[index]}<SceneAudio path={answer.audioFile} effect={index === 1 ? "Effect/シャキーン1.mp3" : index === 4 ? "Effect/決定ボタンを押す3.mp3" : undefined} volume={.22} /></Sequence>)}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}><Outro /><SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" volume={.36} /></Sequence>
    </AbsoluteFill>
  );
};
