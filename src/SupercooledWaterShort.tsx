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
  useVideoConfig,
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const SUPERCOOLED_WATER_FPS = 30;
export const SUPERCOOLED_WATER_WIDTH = 1080;
export const SUPERCOOLED_WATER_HEIGHT = 1920;
const SOURCE_FPS = 24;
// The first visible ice crystal appears 60 frames after the impact scene begins
// in the rendered 30 fps timeline (about 7.87 seconds into the final video).
const ICE_SFX_OFFSET_FRAMES = 60;

const assets = {
  trigger: "movie/Water_bottle_freezing_in_lab_202608232037.mp4",
  hero: "movie/Water_freezing_in_plastic_bottle_202608232038.mp4",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * SUPERCOOLED_WATER_FPS));

export const getSupercooledWaterTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.1), framesFor(2.1, 2.1));
  const minimums = [3.2, 3.8, 5.0, 4.6, 5.5];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 4.0), framesFor(4.0, 4.0));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  scaleFrom?: number;
  scaleTo?: number;
}> = ({src, startSeconds = 0, playbackRate = 1, position = "50% 50%", dark = 0, scaleFrom = 1.01, scaleTo = 1.04}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [scaleFrom, scaleTo], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#07131b"}}>
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
          transform: `scale(${scale})`,
          filter: `brightness(${1 - dark * 0.42}) contrast(1.11) saturate(.94)`,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(2,17,26,${0.28 + dark * .25}),transparent 43%,rgba(1,11,18,.55))`}} />
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 45, left: 38, padding: "12px 21px 15px", border: "4px solid #fff", borderRadius: 999, background: "linear-gradient(135deg,#125ed5,#18d7ef)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, boxShadow: "0 7px 0 #053b83,0 14px 30px #0008", textShadow: "0 3px 0 #064477"}}>
    世界のバズ、AIで再現
  </div>
);

const AiBadge: React.FC = () => (
  <div style={{position: "absolute", top: 49, right: 35, padding: "9px 14px 11px", border: "2px solid #fff9", borderRadius: 8, background: "rgba(0,0,0,.62)", color: "#fff", fontSize: 21, lineHeight: 1, fontWeight: 700, letterSpacing: 1}}>
    AI再現映像
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string; bottom?: number}> = ({children, accent = "#55e8ff", bottom = 250}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: "50%", bottom, width: 920, boxSizing: "border-box", transform: "translateX(-50%)", padding: "18px 24px 23px", borderTop: `8px solid ${accent}`, borderRadius: 18, background: "rgba(2,19,29,.9)", color: "#fff", fontSize: 48, lineHeight: 1.2, fontWeight: 900, textAlign: "center", textShadow: "0 3px 6px #000", boxShadow: "0 13px 35px #0009", opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"})}}>
      {children}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 230, mass: .55}});
  const shake = frame < 10 ? Math.sin(frame * 4.1) * (10 - frame) * .58 : 0;
  const flash = interpolate(frame, [0, 2, 5], [.8, .2, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${-shake * .28}px)`}}>
      <VideoLayer src={assets.hero} startSeconds={.1} playbackRate={1.12} position="50% 47%" dark={.02} />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 48%,transparent 26%,rgba(0,10,18,.43) 84%)"}} />
      <AbsoluteFill style={{background: `rgba(255,255,255,${flash})`}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 205, left: 34, right: 34, textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.48, 1])})`}}>
        <div style={{color: "#fff", fontSize: 101, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "8px #062c47", paintOrder: "stroke fill", textShadow: "0 11px 0 #07518a,0 24px 44px #000"}}>叩いた瞬間</div>
        <div style={{marginTop: 27, color: "#74f1ff", fontSize: 177, lineHeight: .9, fontWeight: 900, letterSpacing: -8, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 13px 0 #0877a1,0 30px 55px #000"}}>凍った</div>
      </div>
    </AbsoluteFill>
  );
};

const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const rewindOpacity = interpolate(frame, [0, 5, 16, 23], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.trigger} startSeconds={0} playbackRate={.94} position="50% 48%" dark={.02} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 175, left: 50, right: 50, textAlign: "center"}}>
        <div style={{opacity: rewindOpacity, display: "inline-block", padding: "14px 36px 19px", border: "6px solid #fff", borderRadius: 14, background: "#172936eb", color: "#fff", fontSize: 69, lineHeight: 1, fontWeight: 900, boxShadow: "0 10px 0 #00111e"}}>数秒前――</div>
        <div style={{marginTop: 35, color: "#92f4ff", fontSize: 91, lineHeight: 1.05, fontWeight: 900, WebkitTextStroke: "8px #06263d", paintOrder: "stroke fill", textShadow: "0 10px 0 #08749b,0 25px 45px #000"}}>見た目は<br />ただの水</div>
      </div>
      <Caption>見た目は、ただの水。</Caption>
    </AbsoluteFill>
  );
};

const FreezeImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame: Math.max(0, frame - 12), fps, config: {damping: 6, stiffness: 260, mass: .52}});
  const shake = frame >= 11 && frame < 23 ? Math.sin(frame * 4.7) * (23 - frame) * .62 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px,${shake * .3}px)`}}>
      <VideoLayer src={assets.trigger} startSeconds={2.55} playbackRate={.92} position="50% 48%" dark={0} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 175, left: 32, right: 32, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 67, lineHeight: 1, fontWeight: 900}}>軽く叩くと――</div>
        <div style={{marginTop: 29, color: "#69efff", fontSize: 145, lineHeight: .93, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #087aa1,0 28px 50px #000", transform: `scale(${interpolate(hit, [0, 1], [1.65, 1])})`, opacity: hit}}>一気に<br />結晶化</div>
      </div>
      <Caption accent="#58edff">軽く叩くと、<br />一気に結晶化。</Caption>
    </AbsoluteFill>
  );
};

const Thermometer: React.FC<{frame: number}> = ({frame}) => {
  const progress = interpolate(frame, [12, 78], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 120, top: 750, width: 118, height: 490, border: "8px solid #dffcff", borderRadius: 70, background: "rgba(3,34,52,.78)", boxShadow: "0 18px 40px #0009,inset 0 0 25px #35e4ff44"}}>
      <div style={{position: "absolute", left: 35, right: 35, bottom: 45, height: 360 * progress, borderRadius: 30, background: "linear-gradient(0deg,#17cff4,#dffcff)", boxShadow: "0 0 22px #56efff"}} />
      <div style={{position: "absolute", left: -14, right: -14, bottom: 20, height: 96, borderRadius: "50%", background: "#22dcfa", border: "8px solid #eaffff", boxShadow: "0 0 28px #5df4ff"}} />
    </div>
  );
};

const Supercooling: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 170, mass: .62}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.hero} startSeconds={.35} playbackRate={.58} position="50% 46%" dark={.42} scaleFrom={1.04} scaleTo={1.09} />
      <AbsoluteFill style={{background: "rgba(1,26,43,.32)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 155, left: 38, right: 38, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 62, lineHeight: 1, fontWeight: 900}}>0℃以下でも</div>
        <div style={{marginTop: 18, color: "#7bf3ff", fontSize: 101, lineHeight: .95, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 #08749b,0 24px 44px #000"}}>液体のまま</div>
        <div style={{marginTop: 32, display: "inline-block", padding: "18px 46px 27px", border: "7px solid #fff", borderRadius: 20, background: "#0b87b6df", color: "#fff", fontSize: 116, lineHeight: 1, fontWeight: 900, boxShadow: "0 12px 0 #034461,0 28px 50px #0009", transform: `scale(${interpolate(enter, [0, 1], [1.42, 1])})`}}>過冷却</div>
      </div>
      <Thermometer frame={frame} />
      <Caption accent="#6eeeff" bottom={205}>0℃を下回っても液体。<br />その名は、過冷却。</Caption>
    </AbsoluteFill>
  );
};

const CrystalSeed: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const delay = 22 + index * 5;
  const length = interpolate(frame, [delay, delay + 22], [0, 175 + (index % 3) * 36], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const angle = index * 36 - 78;
  return <div style={{position: "absolute", left: "50%", top: "50%", width: length, height: 7, borderRadius: 99, background: "linear-gradient(90deg,#fff,#60eaff)", transformOrigin: "left center", transform: `rotate(${angle}deg)`, boxShadow: "0 0 15px #72edff"}} />;
};

const Molecule: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const x = 115 + ((index * 173) % 790);
  const y = 675 + ((index * 227) % 570);
  const drift = Math.sin((frame + index * 17) * .075) * 13;
  const size = 27 + (index % 3) * 8;
  return (
    <div style={{position: "absolute", left: x + drift, top: y - drift * .45, width: size, height: size, borderRadius: "50%", border: "4px solid #8ff4ff", background: "rgba(68,218,245,.25)", boxShadow: "0 0 14px #65efff"}} />
  );
};

const NucleationFact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 18), fps, config: {damping: 8, stiffness: 180, mass: .6}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 52%,#135a76,#03141f 72%)"}}>
      <VideoLayer src={assets.hero} startSeconds={1.15} playbackRate={.42} position="50% 46%" dark={.66} scaleFrom={1.08} scaleTo={1.13} />
      <AbsoluteFill style={{background: "rgba(1,23,36,.58)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 165, left: 40, right: 40, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 62, lineHeight: 1, fontWeight: 900}}>水が凍るには</div>
        <div style={{marginTop: 28, color: "#74efff", fontSize: 79, lineHeight: 1.04, fontWeight: 900, WebkitTextStroke: "6px #fff", paintOrder: "stroke fill", textShadow: "0 9px 0 #08749b,0 22px 42px #000"}}>最初の小さな結晶</div>
        <div style={{marginTop: 24, display: "inline-block", padding: "16px 47px 24px", border: "7px solid #fff", borderRadius: 18, background: "#0788b6e8", color: "#fff", fontSize: 121, lineHeight: 1, fontWeight: 900, boxShadow: "0 12px 0 #034661,0 27px 48px #0009", transform: `scale(${interpolate(enter, [0, 1], [1.5, 1])})`}}>核</div>
      </div>
      {Array.from({length: 15}, (_, index) => <Molecule key={index} index={index} frame={frame} />)}
      <div style={{position: "absolute", left: "50%", top: 1005, width: 118, height: 118, borderRadius: 24, border: "8px solid #fff", background: "#66efff", transform: `translate(-50%,-50%) scale(${interpolate(enter, [0, 1], [.25, 1])}) rotate(45deg)`, boxShadow: "0 0 38px #7af4ff"}} />
      <div style={{position: "absolute", left: "50%", top: 1110, transform: "translateX(-50%)", color: "#fff", fontSize: 39, fontWeight: 900, textShadow: "0 3px 7px #000"}}>結晶化の足場</div>
      <Caption accent="#70efff" bottom={205}>最初の小さな氷の結晶、<br />「核」が必要。</Caption>
    </AbsoluteFill>
  );
};

const TriggerFact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 8, stiffness: 190, mass: .58}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 51%,#145a76,#03141f 70%)"}}>
      <VideoLayer src={assets.hero} startSeconds={1.8} playbackRate={.45} position="50% 46%" dark={.58} scaleFrom={1.08} scaleTo={1.13} />
      <AbsoluteFill style={{background: "rgba(1,22,34,.52)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 170, left: 42, right: 42, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 59, lineHeight: 1.08, fontWeight: 900}}>不純物や傷が少ないと<br />核ができにくい</div>
        <div style={{marginTop: 31, color: "#ffef66", fontSize: 121, lineHeight: .92, fontWeight: 900, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #8b6d00,0 28px 50px #000", transform: `scale(${interpolate(enter, [0, 1], [1.52, 1])})`}}>衝撃で<br />結晶化が連鎖</div>
      </div>
      <div style={{position: "absolute", left: "50%", top: 940, width: 360, height: 360, transform: "translate(-50%,-50%)"}}>
        {Array.from({length: 10}, (_, index) => <CrystalSeed key={index} index={index} frame={frame} />)}
        <div style={{position: "absolute", left: "50%", top: "50%", width: 74, height: 74, borderRadius: "50%", background: "#fff", transform: "translate(-50%,-50%)", boxShadow: "0 0 45px #7af3ff"}} />
      </div>
      <Caption accent="#ffe55b" bottom={205}>核が少ないと液体のまま。<br />衝撃で結晶化が連鎖。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 210, mass: .58}});
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "radial-gradient(circle at 50% 22%,#70f4ff,#087eb4 52%,#021d35)"}}>
      <VideoLayer src={assets.hero} startSeconds={.8} playbackRate={.6} position="50% 45%" dark={.48} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,60,90,.2),rgba(1,22,42,.78))"}} />
      <div style={{position: "absolute", top: 102, bottom: 110, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "49px 27px 59px", border: "10px solid #fff", borderRadius: 42, background: "rgba(1,42,67,.74)", boxShadow: "0 18px 0 #012b48,0 43px 90px #000a,inset 0 0 70px #65efff55", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])})`}}>
        <div style={{padding: "10px 28px 14px", borderRadius: 999, background: "#fff", color: "#087ca8", fontSize: 42, lineHeight: 1, fontWeight: 900}}>過冷却の水</div>
        <div style={{marginTop: 43, color: "#fff", fontSize: 69, lineHeight: 1, fontWeight: 900}}>水なのに</div>
        <div style={{marginTop: 18, color: "#ffef55", fontSize: 121, lineHeight: .95, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 11px 0 #8b7300,0 28px 50px #000"}}>合図待ち<br />かい！</div>
        <div style={{width: "82%", margin: "47px 0 36px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff", fontSize: 62, lineHeight: 1.05, fontWeight: 900}}>チャンネル登録も</div>
        <div style={{marginTop: 25, padding: "17px 61px 24px", border: "7px solid #fff", borderRadius: 999, background: "#0dc5e8", color: "#fff", fontSize: 108, lineHeight: 1, fontWeight: 900, textShadow: "0 6px 0 #056c88", boxShadow: "0 11px 0 #03435d"}}>よろしく</div>
        <div style={{marginTop: 55, color: "#dcfbff", fontSize: 34, lineHeight: 1, fontWeight: 900}}>AIのムダづかい</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{path?: string; effect?: string; effectVolume?: number}> = ({path, effect, effectVolume = .25}) => (
  <>
    {path ? <Audio src={staticFile(path)} volume={1} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={effectVolume} /> : null}
  </>
);

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getSupercooledWaterTimeline>}> = ({episode, timeline}) => {
  const revealFrom = timeline.answerStarts[3];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Freeze Frame Fizz.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: "clamp"});
        const revealStop = interpolate(frame, [revealFrom - 5, revealFrom + 3, revealFrom + 12, revealFrom + 25], [1, .08, .08, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 22, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .13 * fadeIn * revealStop * fadeOut;
      }}
    />
  );
};

export const SupercooledWaterShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getSupercooledWaterTimeline(episode);
  const scenes = [<Setup key="setup" />, <FreezeImpact key="impact" />, <Supercooling key="science" />, <NucleationFact key="nucleation" />, <TriggerFact key="fact" />];
  return (
    <AbsoluteFill style={{backgroundColor: "#04121d", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={.34} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio path={answer.audioFile} effect={index === 2 ? "Effect/シャキーン1.mp3" : undefined} effectVolume={.17} />
        </Sequence>
      ))}
      <Sequence from={timeline.answerStarts[1] + ICE_SFX_OFFSET_FRAMES} durationInFrames={120}>
        <Audio
          src={staticFile("Effect/氷魔法で凍結.mp3")}
          volume={(frame) => .38 * interpolate(frame, [0, 8, 86, 119], [.9, 1, .35, 0], {extrapolateRight: "clamp"})}
        />
      </Sequence>
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Audio-only rebuild used when the already rendered visuals must be preserved.
 * The resulting audio can be muxed onto the existing final MP4 without
 * re-encoding the video stream.
 */
export const SupercooledWaterAudioFix: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getSupercooledWaterTimeline(episode);
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <SceneAudio path={episode.odaiAudioFile} effect="Effect/ドーン.mp3" effectVolume={.34} />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          <SceneAudio path={answer.audioFile} effect={index === 2 ? "Effect/シャキーン1.mp3" : undefined} effectVolume={.17} />
        </Sequence>
      ))}
      <Sequence from={timeline.answerStarts[1] + ICE_SFX_OFFSET_FRAMES} durationInFrames={120}>
        <Audio
          src={staticFile("Effect/氷魔法で凍結.mp3")}
          volume={(frame) => .38 * interpolate(frame, [0, 8, 86, 119], [.9, 1, .35, 0], {extrapolateRight: "clamp"})}
        />
      </Sequence>
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <SceneAudio path={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" effectVolume={.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
