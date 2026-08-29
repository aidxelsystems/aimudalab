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
  useVideoConfig,
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const PRINCE_RUPERT_FPS = 30;
export const PRINCE_RUPERT_WIDTH = 1080;
export const PRINCE_RUPERT_HEIGHT = 1920;
// Remotion's startFrom is expressed in composition frames, even when the
// source clip itself was encoded at 24fps.
const SOURCE_FPS = PRINCE_RUPERT_FPS;

const assets = {
  hammer: "movie/Hammer_striking_glass_drop_1080p_202608250034.mp4",
  shatter: "movie/Prince_Rupert's_drop_breaking_ex…_202608250012.mp4",
  micrographia: "image/prince-rupert-micrographia-1665.png",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * PRINCE_RUPERT_FPS));

export const getPrinceRupertTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.6), framesFor(2.6, 2.6));
  const minimums = [2.6, 2.8, 3.4, 3.5, 4.8, 4.4, 4.4];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.8), framesFor(4.8, 4.8));
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const impactStrength = (frame: number, hitFrame: number, tail = 7) =>
  interpolate(Math.abs(frame - hitFrame), [0, tail], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
  hitFrame?: number;
  strongHit?: boolean;
}> = ({
  src,
  startSeconds = 0,
  playbackRate = 1,
  position = "50% 50%",
  dark = 0,
  scaleFrom = 1.01,
  scaleTo = 1.04,
  hitFrame,
  strongHit = false,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 180], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  const hit = hitFrame === undefined ? 0 : impactStrength(frame, hitFrame, strongHit ? 11 : 7);
  const x = Math.sin(frame * 9.7) * hit * (strongHit ? 25 : 10);
  const y = Math.cos(frame * 13.2) * hit * (strongHit ? 34 : 19);
  const rotate = Math.sin(frame * 7.1) * hit * (strongHit ? 1.25 : 0.45);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#020508"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * SOURCE_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${x}px,${y}px) rotate(${rotate}deg) scale(${zoom + hit * (strongHit ? .035 : .012)})`,
          filter: `brightness(${1 - dark * .48 + hit * .18}) contrast(${1.12 + hit * .28}) saturate(${.88 + hit * .18})`,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(1,4,8,${.36 + dark * .3}),transparent 46%,rgba(0,2,5,.72))`}} />
      {hit > 0 ? (
        <AbsoluteFill style={{background: strongHit ? `rgba(255,54,42,${hit * .26})` : `rgba(235,250,255,${hit * .28})`, mixBlendMode: "screen"}} />
      ) : null}
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 48, left: 38, padding: "10px 18px 13px", border: "3px solid #fff", borderRadius: 999, background: "rgba(2,7,12,.82)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, letterSpacing: 1, boxShadow: "0 8px 22px #0009"}}>
    世界のバズ AIで再現 #4
  </div>
);

const AiBadge: React.FC = () => (
  <div style={{position: "absolute", top: 50, right: 38, padding: "9px 16px 12px", borderRadius: 8, background: "rgba(0,0,0,.72)", color: "#dce9f3", fontSize: 23, lineHeight: 1, fontWeight: 900, letterSpacing: 1}}>
    AI再現映像
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string; bottom?: number}> = ({children, accent = "#aeeaff", bottom = 205}) => (
  <div style={{position: "absolute", left: 70, right: 70, bottom, padding: "20px 28px 24px", border: `4px solid ${accent}`, borderRadius: 20, background: "rgba(2,6,10,.86)", color: "#fff", textAlign: "center", fontSize: 47, lineHeight: 1.16, fontWeight: 900, boxShadow: "0 14px 35px #000b"}}>
    {children}
  </div>
);

const HammerTitle: React.FC<{small?: boolean}> = ({small = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190, mass: .6}});
  return (
    <div style={{position: "absolute", top: small ? 158 : 170, left: 35, right: 35, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.34, 1])})`, opacity: enter}}>
      {!small ? <div style={{display: "inline-block", padding: "10px 26px 14px", border: "5px solid #fff", borderRadius: 999, background: "#a31318", color: "#fff", fontSize: 41, lineHeight: 1, fontWeight: 900}}>衝撃実験</div> : null}
      <div style={{marginTop: small ? 0 : 23, color: "#fff", fontSize: small ? 67 : 76, lineHeight: 1.02, fontWeight: 900, WebkitTextStroke: "8px #05090d", paintOrder: "stroke fill", textShadow: "0 12px 0 #202b34,0 28px 50px #000"}}>
        ハンマーでも
      </div>
      <div style={{marginTop: 8, color: "#74e6ff", fontSize: small ? 84 : 105, lineHeight: .96, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #17647a,0 27px 48px #000"}}>
        割れないガラス
      </div>
    </div>
  );
};

const Hook: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.hammer} startSeconds={.3} playbackRate={.9} position="50% 48%" dark={.08} scaleFrom={1.01} scaleTo={1.045} hitFrame={40} />
    <SeriesBadge />
    <AiBadge />
    <HammerTitle />
    <Caption accent="#7fe9ff">このガラス、<br />ハンマーでも割れません。</Caption>
  </AbsoluteFill>
);

const SecondHit: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = impactStrength(frame, 30, 8);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.hammer} startSeconds={3.6} playbackRate={.88} position="50% 48%" dark={.12} scaleFrom={1.015} scaleTo={1.045} hitFrame={30} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 165, left: 35, right: 35, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 64, lineHeight: 1, fontWeight: 900}}>さらに、もう一発</div>
        <div style={{marginTop: 20, color: "#fff15c", fontSize: 112, lineHeight: .95, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #766400,0 26px 48px #000", transform: `scale(${1 + hit * .18})`}}>傷ひとつなし</div>
      </div>
      <Caption accent="#fff15c">二回叩いても、<br />傷ひとつなし。</Caption>
    </AbsoluteFill>
  );
};

const TailWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * .31) * .08;
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.shatter} startSeconds={.45} playbackRate={.86} position="50% 48%" dark={.25} scaleFrom={1.01} scaleTo={1.055} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(25,0,0,.16),transparent 42%,rgba(18,0,0,.35))"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 160, left: 32, right: 32, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 65, lineHeight: 1, fontWeight: 900}}>なのに――</div>
        <div style={{marginTop: 22, color: "#ff5d54", fontSize: 111, lineHeight: .95, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #7c1612,0 29px 52px #000"}}>しっぽを折ると</div>
      </div>
      <div style={{position: "absolute", left: 815, top: 1010, width: 135, height: 135, borderRadius: "50%", border: "9px solid #ff3c36", boxShadow: "0 0 0 10px #fff8,0 0 50px #ff2b25", transform: `scale(${pulse})`}} />
      <div style={{position: "absolute", right: 80, top: 930, color: "#fff", fontSize: 52, fontWeight: 900, textShadow: "0 6px 18px #000"}}>ここだけ</div>
      <Caption accent="#ff665d">細いしっぽの先を<br />折ると――</Caption>
    </AbsoluteFill>
  );
};

const BurstParticle: React.FC<{index: number; frame: number; hitFrame: number}> = ({index, frame, hitFrame}) => {
  const progress = interpolate(frame, [hitFrame, hitFrame + 38], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const angle = ((index * 137.5) % 360) * Math.PI / 180;
  const distance = (70 + (index % 9) * 34) * progress;
  const x = 540 + Math.cos(angle) * distance;
  const y = 940 + Math.sin(angle) * distance - progress * 45;
  const opacity = progress === 0 ? 0 : 1 - progress;
  const size = 7 + (index % 4) * 4;
  return <div style={{position: "absolute", left: x, top: y, width: size * 2.2, height: size, background: "#e8fbff", borderRadius: 99, opacity: opacity * .72, transform: `rotate(${angle}rad)`, boxShadow: "0 0 15px #d9f8ff"}} />;
};

const ShatterImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hitFrame = 11;
  const reveal = spring({frame: Math.max(0, frame - hitFrame), fps, config: {damping: 6, stiffness: 220, mass: .5}});
  const hit = impactStrength(frame, hitFrame, 12);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.shatter} startSeconds={3.05} playbackRate={.72} position="50% 48%" dark={.06} scaleFrom={1.015} scaleTo={1.07} hitFrame={hitFrame} strongHit />
      {Array.from({length: 44}, (_, index) => <BurstParticle key={index} index={index} frame={frame} hitFrame={hitFrame} />)}
      <AbsoluteFill style={{opacity: hit * .3, background: "radial-gradient(circle at 50% 48%,#fff 0 4%,#6ce7ff 15%,#ff4337 42%,transparent 72%)", mixBlendMode: "screen"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 155, left: 28, right: 28, textAlign: "center", transform: `scale(${interpolate(reveal, [0, 1], [1.58, 1])})`, opacity: reveal}}>
        <div style={{color: "#fff", fontSize: 65, lineHeight: 1, fontWeight: 900}}>その瞬間</div>
        <div style={{marginTop: 20, color: "#ff453d", fontSize: 134, lineHeight: .9, fontWeight: 900, letterSpacing: -8, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #74120e,0 32px 58px #000"}}>全体が粉々</div>
      </div>
      <Caption accent="#ff5b53">一瞬で、<br />全体が粉々。</Caption>
    </AbsoluteFill>
  );
};

const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 180, mass: .65}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.hammer} startSeconds={.45} playbackRate={.45} position="50% 48%" dark={.58} scaleFrom={1.04} scaleTo={1.09} />
      <AbsoluteFill style={{background: "rgba(2,6,10,.34)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 178, left: 38, right: 38, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 58, lineHeight: 1, fontWeight: 900}}>このガラスの正体</div>
        <div style={{marginTop: 34, padding: "26px 22px 34px", border: "9px solid #fff", borderRadius: 32, background: "linear-gradient(135deg,#071a26e8,#143d50e8)", color: "#76eaff", fontSize: 96, lineHeight: .98, fontWeight: 900, letterSpacing: -4, boxShadow: "0 14px 0 #071018,0 35px 70px #000c,inset 0 0 50px #6ceaff22", transform: `scale(${interpolate(enter, [0, 1], [.52, 1])})`}}>
          プリンス・<br />ルパートの滴
        </div>
      </div>
      <div style={{position: "absolute", left: 220, right: 220, top: 720, height: 5, background: "linear-gradient(90deg,transparent,#90edff,transparent)"}} />
      <Caption accent="#7beaff">正体は、<br />プリンス・ルパートの滴。</Caption>
    </AbsoluteFill>
  );
};

const StressDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 155, mass: .7}});
  const arrowPulse = 1 + Math.sin(frame * .18) * .08;
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 52%,#162b38 0,#071018 48%,#020509 100%)"}}>
      <SeriesBadge />
      <div style={{position: "absolute", top: 160, left: 36, right: 36, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 55, lineHeight: 1, fontWeight: 900}}>冷水で急冷すると</div>
        <div style={{marginTop: 20, color: "#75ebff", fontSize: 88, lineHeight: .98, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #176b80,0 25px 44px #000"}}>外側だけ先に固まる</div>
      </div>
      <div style={{position: "absolute", left: 70, top: 590, width: 940, height: 560, transform: `scale(${interpolate(enter, [0, 1], [.72, 1])})`, opacity: enter}}>
        <div style={{position: "absolute", left: 85, top: 55, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 48% 50%,#ff5c68 0 38%,#8e1f2c 39% 48%,#163f50 49% 57%,#68e9ff 58% 73%,#d7fbff 74% 77%,rgba(165,239,255,.2) 78%)", boxShadow: "0 0 75px #62ddff77,inset 0 0 70px #fff5", border: "6px solid #dffbff"}} />
        <div style={{position: "absolute", left: 430, top: 190, width: 410, height: 145, clipPath: "polygon(0 4%,100% 45%,100% 56%,0 96%)", background: "linear-gradient(180deg,#d8fbff,#58d9f6 35%,#8f2430 49%,#ff6670 55%,#62def5 68%,#d8fbff)", filter: "drop-shadow(0 0 22px #63def7)"}} />
        <div style={{position: "absolute", left: 182, top: 193, color: "#fff", textAlign: "center", fontSize: 39, lineHeight: 1.05, fontWeight: 900, textShadow: "0 5px 15px #000"}}>内側<br /><span style={{color: "#ff7b84", fontSize: 58}}>引張</span></div>
        <div style={{position: "absolute", left: 32, top: 5, padding: "13px 21px 17px", border: "5px solid #a8f4ff", borderRadius: 18, background: "#082531e8", color: "#89efff", fontSize: 45, lineHeight: 1, fontWeight: 900}}>外側 圧縮</div>
        <div style={{position: "absolute", left: 28, top: 375, color: "#7eeaff", fontSize: 78, fontWeight: 900, transform: `scale(${arrowPulse}) rotate(-28deg)`}}>↗</div>
        <div style={{position: "absolute", left: 452, top: 385, color: "#7eeaff", fontSize: 78, fontWeight: 900, transform: `scale(${arrowPulse}) rotate(28deg)`}}>↖</div>
        <div style={{position: "absolute", left: 267, top: 305, color: "#ff707b", fontSize: 76, fontWeight: 900, transform: `scale(${arrowPulse})`}}>↔</div>
      </div>
      <div style={{position: "absolute", left: 110, right: 110, top: 1235, padding: "21px 28px 26px", border: "5px solid #fff", borderRadius: 24, background: "rgba(2,7,11,.82)", color: "#fff", textAlign: "center", fontSize: 45, lineHeight: 1.12, fontWeight: 900}}>
        <span style={{color: "#77eaff"}}>表面の圧縮</span>が<br />亀裂を押さえ込む
      </div>
      <Caption accent="#79eaff" bottom={185}>外側は圧縮、内部には<br />引っ張る力が残ります。</Caption>
    </AbsoluteFill>
  );
};

const FragmentFact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 6), fps, config: {damping: 7, stiffness: 190, mass: .62}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.shatter} startSeconds={3.55} playbackRate={.52} position="50% 48%" dark={.43} scaleFrom={1.02} scaleTo={1.08} />
      <AbsoluteFill style={{background: "rgba(0,4,8,.28)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 155, left: 34, right: 34, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 57, lineHeight: 1, fontWeight: 900}}>尾の亀裂が内部へ届くと</div>
        <div style={{marginTop: 26, color: "#ff625a", fontSize: 89, lineHeight: .96, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #6c1713,0 27px 48px #000"}}>崩壊が止まらない</div>
      </div>
      <div style={{position: "absolute", left: 90, right: 90, top: 735, padding: "31px 20px 38px", border: "9px solid #fff", borderRadius: 34, background: "rgba(4,10,15,.84)", textAlign: "center", boxShadow: "0 19px 0 #17232b,0 40px 70px #000c", transform: `scale(${interpolate(enter, [0, 1], [.58, 1])})`, opacity: enter}}>
        <div style={{color: "#d7e2e8", fontSize: 40, lineHeight: 1, fontWeight: 900}}>研究で確認された1個の滴</div>
        <div style={{marginTop: 20, color: "#fff15d", fontSize: 145, lineHeight: .87, fontWeight: 900, letterSpacing: -8, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #776500,0 26px 48px #000"}}>21,847</div>
        <div style={{marginTop: 22, color: "#fff", fontSize: 60, lineHeight: 1, fontWeight: 900}}>個以上の破片</div>
      </div>
      <div style={{position: "absolute", left: 40, bottom: 145, padding: "8px 13px 11px", borderRadius: 7, background: "rgba(0,0,0,.78)", color: "#fff", fontSize: 20, lineHeight: 1, fontWeight: 700}}>Kooij et al., Nature Communications 12, 2521 (2021)</div>
      <Caption accent="#fff15c" bottom={205}>実験では、二万個以上の<br />破片になりました。</Caption>
    </AbsoluteFill>
  );
};

const HistoryFact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 150, mass: .7}});
  const zoom = interpolate(frame, [0, 150], [1.03, 1.11], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "linear-gradient(160deg,#19130d,#050403)"}}>
      <div style={{position: "absolute", left: 92, right: 92, top: 480, height: 1030, border: "11px solid #e5d4ad", borderRadius: 22, overflow: "hidden", background: "#f5f0df", boxShadow: "0 26px 70px #000c", transform: `scale(${interpolate(enter, [0, 1], [.9, 1])})`}}>
        <Img src={staticFile(assets.micrographia)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 78%", transform: `scale(${zoom})`, filter: "sepia(.18) contrast(1.07)"}} />
      </div>
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(10,5,1,.2),transparent 43%,rgba(4,2,0,.74))"}} />
      <SeriesBadge />
      <div style={{position: "absolute", top: 158, left: 34, right: 34, textAlign: "center"}}>
        <div style={{display: "inline-block", padding: "12px 30px 16px", border: "6px solid #fff", borderRadius: 999, background: "#8a171a", color: "#fff", fontSize: 57, lineHeight: 1, fontWeight: 900}}>1661年</div>
        <div style={{marginTop: 23, color: "#ffe272", fontSize: 89, lineHeight: .98, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #755c0a,0 25px 45px #000"}}>王立協会も調査</div>
      </div>
      <div style={{position: "absolute", left: 105, bottom: 154, padding: "8px 13px 11px", borderRadius: 7, background: "rgba(0,0,0,.78)", color: "#fff", fontSize: 20, lineHeight: 1.1, fontWeight: 700}}>Robert Hooke, Micrographia, 1665<br />Public domain / Project Gutenberg</div>
      <Caption accent="#ffe174" bottom={230}>国王チャールズ二世が送り、<br />科学者たちも調査しました。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190, mass: .6}});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#03070a"}}>
      <VideoLayer src={assets.shatter} startSeconds={4.0} playbackRate={.45} position="50% 48%" dark={.72} scaleFrom={1.05} scaleTo={1.1} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.78))"}} />
      <div style={{position: "absolute", top: 92, bottom: 105, left: 38, right: 38, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "42px 24px 50px", border: "10px solid #fff", borderRadius: 42, background: "rgba(6,11,15,.8)", boxShadow: "0 18px 0 #030507,0 43px 90px #000c,inset 0 0 70px #5de5ff22", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.27, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#74e6ff", color: "#071015", fontSize: 42, lineHeight: 1, fontWeight: 900}}>プリンス・ルパートの滴</div>
        <div style={{marginTop: 38, color: "#fff", fontSize: 72, lineHeight: 1, fontWeight: 900}}>頭は無敵</div>
        <div style={{marginTop: 17, color: "#ff5149", fontSize: 112, lineHeight: .92, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #72140f,0 28px 50px #000"}}>しっぽは<br />自爆ボタンかい！</div>
        <div style={{width: "82%", margin: "43px 0 31px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 59, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 22, padding: "16px 61px 23px", border: "7px solid #fff", borderRadius: 999, background: "#e7c81f", color: "#13171b", fontSize: 101, lineHeight: 1, fontWeight: 900, boxShadow: "0 11px 0 #6f6000"}}>よろしく</div>
        <div style={{marginTop: 45, color: "#e8eef3", fontSize: 33, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const Narration: React.FC<{path?: string}> = ({path}) => path ? <Audio src={staticFile(path)} volume={1} /> : null;

const HammerSounds: React.FC<{from: number}> = ({from}) => (
  <Sequence from={from}>
    <Audio src={staticFile("Effect/打撃2.mp3")} volume={.56} />
    <Audio src={staticFile("Effect/机をドンと叩く.mp3")} volume={.16} />
  </Sequence>
);

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getPrinceRupertTimeline>}> = ({episode, timeline}) => {
  const warningFrom = timeline.answerStarts[1];
  const shatterFrom = timeline.answerStarts[2];
  const identityFrom = timeline.answerStarts[3];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Glass Shatter Protocol.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"});
        const warningDip = interpolate(frame, [warningFrom - 4, warningFrom + 10], [1, .78], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const shatterDuck = interpolate(frame, [shatterFrom - 3, shatterFrom + 10, shatterFrom + 60, identityFrom + 10], [.78, .34, .42, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 24, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .115 * fadeIn * warningDip * shatterDuck * fadeOut;
      }}
    />
  );
};

export const PrinceRupertShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getPrinceRupertTimeline(episode);
  const scenes = [
    <SecondHit key="second-hit" />,
    <TailWarning key="tail-warning" />,
    <ShatterImpact key="shatter" />,
    <Identity key="identity" />,
    <StressDiagram key="stress" />,
    <FragmentFact key="fragment" />,
    <HistoryFact key="history" />,
  ];
  return (
    <AbsoluteFill style={{backgroundColor: "#020508", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <Narration path={episode.odaiAudioFile} />
        <HammerSounds from={40} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <Narration path={answer.audioFile} />
          {index === 0 ? <HammerSounds from={30} /> : null}
          {index === 1 ? <Audio src={staticFile("Effect/心臓の鼓動1.mp3")} volume={.12} /> : null}
          {index === 2 ? (
            <Sequence from={10}>
              <Audio src={staticFile("Effect/ガラスが割れる1.mp3")} volume={.72} />
            </Sequence>
          ) : null}
          {index === 3 ? <Audio src={staticFile("Effect/金属タイトル表示2.mp3")} volume={.42} /> : null}
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <Narration path={episode.outroAudioFile} />
        <Audio src={staticFile("Effect/ビシッとツッコミ1.mp3")} volume={.36} />
      </Sequence>
    </AbsoluteFill>
  );
};
