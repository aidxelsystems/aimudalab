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

export const GALLIUM_SPOON_FPS = 30;
export const GALLIUM_SPOON_WIDTH = 1080;
export const GALLIUM_SPOON_HEIGHT = 1920;

const assets = {
  setup: "movie/Gallium_spoon_melting_in_water_202608251120.mp4",
  melt: "movie/Gallium_spoon_melting_in_water_202608251119.mp4",
  kit: "image/gallium-spoon-kit-rotometals.png",
};

const framesFor = (seconds: number | undefined, fallback: number) =>
  Math.max(1, Math.ceil((seconds ?? fallback) * GALLIUM_SPOON_FPS));

export const getGalliumSpoonTimeline = (episode: Episode) => {
  const hookFrames = Math.max(framesFor(episode.odaiDuration, 2.8), framesFor(2.8, 2.8));
  const minimums = [2.8, 2.7, 3.4, 3.5, 4.2, 4.6, 5.0];
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(framesFor(answer.duration, minimums[index] ?? 4), framesFor(minimums[index], 4)),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(framesFor(episode.outroDuration, 5.2), framesFor(5.2, 5.2));
  return {hookFrames, answerFrames, answerStarts, outroFrom: cursor, outroFrames, totalFrames: cursor + outroFrames};
};

const impact = (frame: number, at: number, tail = 10) =>
  interpolate(Math.abs(frame - at), [0, tail], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const VideoLayer: React.FC<{
  src: string;
  startSeconds?: number;
  playbackRate?: number;
  position?: string;
  dark?: number;
  warm?: number;
  hitFrame?: number;
}> = ({src, startSeconds = 0, playbackRate = 1, position = "50% 50%", dark = 0, warm = 0, hitFrame}) => {
  const frame = useCurrentFrame();
  const hit = hitFrame === undefined ? 0 : impact(frame, hitFrame, 12);
  const zoom = interpolate(frame, [0, 150], [1.015, 1.065], {extrapolateRight: "clamp"});
  const x = Math.sin(frame * 10.7) * hit * 22;
  const y = Math.cos(frame * 13.1) * hit * 28;
  const rotate = Math.sin(frame * 7.4) * hit * 1.1;
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#020507"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(startSeconds * GALLIUM_SPOON_FPS)}
        playbackRate={playbackRate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${x}px,${y}px) rotate(${rotate}deg) scale(${zoom + hit * .035})`,
          filter: `brightness(${1 - dark * .5 + hit * .16}) contrast(${1.08 + hit * .28}) saturate(${.9 + warm * .2}) sepia(${warm * .12})`,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(1,4,7,${.38 + dark * .28}),transparent 47%,rgba(0,2,4,.7))`}} />
      {hit > 0 ? <AbsoluteFill style={{background: `rgba(225,247,255,${hit * .28})`, mixBlendMode: "screen"}} /> : null}
    </AbsoluteFill>
  );
};

const SeriesBadge: React.FC = () => (
  <div style={{position: "absolute", top: 48, left: 38, padding: "10px 18px 13px", border: "3px solid #fff", borderRadius: 999, background: "rgba(2,7,10,.82)", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 900, boxShadow: "0 8px 22px #0009"}}>
    世界のバズ AIで再現 #5
  </div>
);

const AiBadge: React.FC = () => (
  <div style={{position: "absolute", top: 50, right: 38, padding: "9px 16px 12px", borderRadius: 8, background: "rgba(0,0,0,.72)", color: "#dce9f3", fontSize: 23, lineHeight: 1, fontWeight: 900}}>
    AI再現映像
  </div>
);

const Caption: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = "#8eeeff"}) => (
  <div style={{position: "absolute", left: 68, right: 68, bottom: 205, padding: "20px 26px 24px", border: `4px solid ${accent}`, borderRadius: 20, background: "rgba(2,6,9,.87)", color: "#fff", textAlign: "center", fontSize: 47, lineHeight: 1.16, fontWeight: 900, boxShadow: "0 14px 35px #000b"}}>
    {children}
  </div>
);

const SlamText: React.FC<{top?: number; first: string; second: string; accent?: string; size?: number}> = ({top = 170, first, second, accent = "#77eaff", size = 102}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 200, mass: .58}});
  return (
    <div style={{position: "absolute", top, left: 32, right: 32, textAlign: "center", opacity: enter, transform: `scale(${interpolate(enter, [0, 1], [1.42, 1])})`}}>
      <div style={{color: "#fff", fontSize: 64, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "6px #05090c", paintOrder: "stroke fill", textShadow: "0 17px 35px #000"}}>{first}</div>
      <div style={{marginTop: 22, color: accent, fontSize: size, lineHeight: .94, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #164e5a,0 29px 50px #000"}}>{second}</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const meltPulse = impact(frame, 44, 14);
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.melt} startSeconds={1.8} playbackRate={.78} position="50% 49%" dark={.08} hitFrame={44} />
      <AbsoluteFill style={{opacity: meltPulse * .34, background: "radial-gradient(circle at 50% 58%,#fff 0 5%,#78efff 18%,transparent 58%)", mixBlendMode: "screen"}} />
      <SeriesBadge />
      <AiBadge />
      <SlamText first="金属のスプーンが" second="お湯で消えた" accent="#fff06a" size={119} />
      <Caption accent="#fff06a">金属のスプーンが、<br />お湯で消えました。</Caption>
    </AbsoluteFill>
  );
};

const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const rewind = interpolate(frame, [0, 13], [1, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.setup} startSeconds={.25} playbackRate={.78} position="50% 48%" dark={.12} />
      <AbsoluteFill style={{opacity: rewind * .7, background: "repeating-linear-gradient(0deg,rgba(103,235,255,.34) 0 5px,transparent 5px 18px)", mixBlendMode: "screen", transform: `translateY(${frame * 18}px)`}} />
      <SeriesBadge />
      <AiBadge />
      <SlamText first="数秒前――" second="普通の金属？" accent="#dce8ee" size={104} />
      <Caption>数秒前。見た目は、<br />普通の金属スプーン。</Caption>
    </AbsoluteFill>
  );
};

const NameReveal: React.FC = () => (
  <AbsoluteFill>
    <VideoLayer src={assets.setup} startSeconds={2.9} playbackRate={.82} position="50% 50%" dark={.2} warm={.2} />
    <SeriesBadge />
    <AiBadge />
    <SlamText first="これは" second="ガリウムスプーン" accent="#78edff" size={95} />
    <Caption accent="#78edff">これは、<br />ガリウムスプーン。</Caption>
  </AbsoluteFill>
);

const MeltImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const hitFrame = 48;
  const hit = impact(frame, hitFrame, 13);
  const ripple = interpolate(frame, [hitFrame, hitFrame + 35], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.melt} startSeconds={1.45} playbackRate={.78} position="50% 49%" dark={.04} warm={.18} hitFrame={hitFrame} />
      {ripple > 0 && ripple < 1 ? <div style={{position: "absolute", left: 540 - ripple * 460, top: 1040 - ripple * 190, width: ripple * 920, height: ripple * 380, border: `${Math.max(2, 12 - ripple * 9)}px solid rgba(172,246,255,${1 - ripple})`, borderRadius: "50%", boxShadow: "0 0 36px #7eeaff"}} /> : null}
      <AbsoluteFill style={{opacity: hit * .24, background: "linear-gradient(180deg,#fff0 30%,#ffd97a55 58%,#7eeaff55)", mixBlendMode: "screen"}} />
      <SeriesBadge />
      <AiBadge />
      <SlamText first="温水へ入れると" second="銀色の液体に" accent="#ffd966" size={105} />
      <Caption accent="#ffd966">温水へ入れると、<br />形が崩れて銀色の液体に。</Caption>
    </AbsoluteFill>
  );
};

const GalliumIdentity: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 180}});
  return (
    <AbsoluteFill>
      <VideoLayer src={assets.melt} startSeconds={5.0} playbackRate={.45} position="50% 52%" dark={.57} />
      <AbsoluteFill style={{background: "rgba(2,8,11,.25)"}} />
      <SeriesBadge />
      <AiBadge />
      <div style={{position: "absolute", top: 165, left: 38, right: 38, textAlign: "center"}}>
        <div style={{color: "#ff6a63", fontSize: 74, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #fff", paintOrder: "stroke fill"}}>酸ではない</div>
        <div style={{marginTop: 28, padding: "28px 20px 36px", border: "8px solid #fff", borderRadius: 32, background: "linear-gradient(135deg,#071820e8,#174353e8)", transform: `scale(${interpolate(enter, [0, 1], [.55, 1])})`, boxShadow: "0 18px 0 #051017,0 40px 70px #000b"}}>
          <div style={{color: "#fff", fontSize: 51, fontWeight: 900}}>ガリウムが</div>
          <div style={{marginTop: 13, color: "#7bedff", fontSize: 97, lineHeight: .95, fontWeight: 900}}>融けただけ</div>
        </div>
      </div>
      <Caption accent="#7bedff">酸ではありません。<br />ガリウムが融けただけ。</Caption>
    </AbsoluteFill>
  );
};

const MeltingPoint: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 175}});
  const fill = interpolate(frame, [8, 72], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 48%,#20333b,#071014 52%,#020507)"}}>
      <SeriesBadge />
      <div style={{position: "absolute", top: 166, left: 40, right: 40, textAlign: "center"}}>
        <div style={{color: "#fff", fontSize: 61, fontWeight: 900}}>ガリウムの融点</div>
        <div style={{marginTop: 28, color: "#fff269", fontSize: 132, lineHeight: .9, fontWeight: 900, letterSpacing: -7, WebkitTextStroke: "9px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #746400,0 29px 50px #000", transform: `scale(${interpolate(enter, [0, 1], [.5, 1])})`}}>29.7646℃</div>
      </div>
      <div style={{position: "absolute", left: 145, top: 610, width: 230, height: 790, border: "9px solid #d9f9ff", borderRadius: 120, background: "#08141a", boxShadow: "0 0 55px #6be8ff55,inset 0 0 30px #000"}}>
        <div style={{position: "absolute", left: 70, bottom: 93, width: 72, height: 560 * fill, borderRadius: 50, background: "linear-gradient(180deg,#fff56b,#ff6b50)", boxShadow: "0 0 30px #ff9b58", transformOrigin: "bottom"}} />
        <div style={{position: "absolute", left: 36, bottom: 30, width: 145, height: 145, borderRadius: "50%", background: "#ff6650", border: "7px solid #fff"}} />
      </div>
      <div style={{position: "absolute", left: 455, top: 650, width: 470, height: 470, border: "8px solid #fff", borderRadius: 32, background: "linear-gradient(145deg,#d9edf1,#8eabb2)", boxShadow: "0 18px 0 #26353a,0 40px 65px #000b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <div style={{color: "#27343a", fontSize: 41, fontWeight: 900}}>元素番号</div>
        <div style={{color: "#071015", fontSize: 174, lineHeight: .86, fontWeight: 900}}>Ga</div>
        <div style={{marginTop: 23, color: "#27343a", fontSize: 50, fontWeight: 900}}>31</div>
      </div>
      <Caption accent="#fff269">融点は、<br />わずか29.7646度。</Caption>
    </AbsoluteFill>
  );
};

const Calibration: React.FC = () => {
  const frame = useCurrentFrame();
  const lock = spring({frame: Math.max(0, frame - 32), fps: 30, config: {damping: 7, stiffness: 190}});
  return (
    <AbsoluteFill style={{background: "linear-gradient(145deg,#061016,#112a34 50%,#03070a)"}}>
      <SeriesBadge />
      <SlamText first="この正確な融点" second="温度の基準になる" accent="#8ff1ff" size={92} />
      <div style={{position: "absolute", left: 100, right: 100, top: 690, height: 380, border: "7px solid #c9f7ff", borderRadius: 32, background: "rgba(1,8,12,.74)", boxShadow: "0 22px 55px #000a"}}>
        {Array.from({length: 11}, (_, index) => (
          <div key={index} style={{position: "absolute", left: 40 + index * 79, top: index === 5 ? 58 : 105, width: index === 5 ? 9 : 5, height: index === 5 ? 210 : 120, background: index === 5 ? "#fff36a" : "#d3edf2", boxShadow: index === 5 ? "0 0 25px #fff36a" : "none"}} />
        ))}
        <div style={{position: "absolute", left: 340, top: 27, padding: "11px 22px 15px", borderRadius: 18, background: "#fff36a", color: "#11191d", fontSize: 47, fontWeight: 900, transform: `scale(${interpolate(lock, [0, 1], [.4, 1])})`}}>29.7646℃</div>
        <div style={{position: "absolute", left: 38, right: 38, bottom: 29, color: "#fff", fontSize: 40, textAlign: "center", fontWeight: 900}}>標準温度計の校正ポイント</div>
      </div>
      <div style={{position: "absolute", left: 95, right: 95, top: 1170, padding: "24px 28px 30px", border: "5px solid #fff", borderRadius: 23, background: "rgba(5,14,18,.86)", color: "#fff", textAlign: "center", fontSize: 47, lineHeight: 1.13, fontWeight: 900}}>
        正しい温度を測るための<br /><span style={{color: "#8ff1ff", fontSize: 62}}>ものさし</span>
      </div>
      <div style={{position: "absolute", left: 44, bottom: 150, padding: "8px 13px 11px", borderRadius: 7, background: "rgba(0,0,0,.76)", color: "#fff", fontSize: 20, fontWeight: 700}}>Source: NIST / ITS-90 Gallium Fixed Point</div>
      <Caption accent="#8ff1ff">精密温度計の<br />校正基準にも使われます。</Caption>
    </AbsoluteFill>
  );
};

const ProductProof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 180}});
  const price = spring({frame: Math.max(0, frame - 42), fps, config: {damping: 6, stiffness: 230, mass: .55}});
  return (
    <AbsoluteFill style={{background: "linear-gradient(160deg,#18120a,#030404 62%)"}}>
      <SeriesBadge />
      <div style={{position: "absolute", top: 150, left: 32, right: 32, textAlign: "center", color: "#fff", fontSize: 72, lineHeight: 1, fontWeight: 900, WebkitTextStroke: "7px #111", paintOrder: "stroke fill"}}>ほんとに販売しています</div>
      <div style={{position: "absolute", left: 72, right: 72, top: 335, height: 865, border: "10px solid #fff", borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 22px 0 #5c513f,0 52px 85px #000d", transform: `scale(${interpolate(enter, [0, 1], [.82, 1])})`}}>
        <Img src={staticFile(assets.kit)} style={{width: "100%", height: "100%", objectFit: "contain"}} />
      </div>
      <div style={{position: "absolute", left: 130, right: 130, top: 1260, padding: "23px 20px 34px", border: "9px solid #fff", borderRadius: 30, background: "#b21c22", textAlign: "center", color: "#fff269", fontSize: 155, lineHeight: .9, fontWeight: 900, letterSpacing: -8, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #5e0c10,0 30px 50px #000", transform: `scale(${interpolate(price, [0, 1], [1.65, 1])})`, opacity: price}}>$279</div>
      <div style={{position: "absolute", left: 42, right: 42, bottom: 135, padding: "8px 10px 11px", borderRadius: 8, background: "rgba(0,0,0,.78)", color: "#fff", fontSize: 19, lineHeight: 1.16, fontWeight: 700, textAlign: "center"}}>商品画像・価格: RotoMetals（2026年8月25日確認）<br />rotometals.com/disappearing-spoon-mold-make-it-yourself-complete-ga-metal-included/</div>
      <Caption accent="#fff269">ガリウム付きの製作キットで、<br />279ドル。</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 7, stiffness: 190, mass: .6}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 34%,#34464c,#10191d 42%,#020405 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "90px 42px"}}>
      <div style={{width: "100%", padding: "68px 28px 76px", border: "10px solid #fff", borderRadius: 44, background: "linear-gradient(145deg,rgba(11,23,28,.96),rgba(3,7,9,.96))", boxShadow: "0 20px 0 #030506,0 50px 95px #000c,inset 0 0 75px #78eaff22", textAlign: "center", transform: `scale(${interpolate(enter, [0, 1], [1.28, 1])})`}}>
        <div style={{color: "#fff", fontSize: 76, lineHeight: 1.02, fontWeight: 900}}>スプーンより先に、</div>
        <div style={{marginTop: 25, color: "#ff5c54", fontSize: 119, lineHeight: .9, fontWeight: 900, letterSpacing: -6, WebkitTextStroke: "8px #fff", paintOrder: "stroke fill", textShadow: "0 12px 0 #71130f,0 29px 50px #000"}}>財布が溶けるわ！</div>
        <div style={{width: "82%", margin: "60px auto 46px", borderTop: "8px dashed #fff"}} />
        <div style={{color: "#fff36b", fontSize: 66, lineHeight: 1.1, fontWeight: 900, WebkitTextStroke: "5px #172126", paintOrder: "stroke fill"}}>チャンネル登録もよろしく</div>
      </div>
    </AbsoluteFill>
  );
};

const Narration: React.FC<{path?: string}> = ({path}) => path ? <Audio src={staticFile(path)} volume={1} /> : null;

const Bgm: React.FC<{episode: Episode; timeline: ReturnType<typeof getGalliumSpoonTimeline>}> = ({episode, timeline}) => {
  const meltFrom = timeline.answerStarts[2];
  const productFrom = timeline.answerStarts[6];
  return (
    <Audio
      src={staticFile(episode.bgm ?? "BGM/Lab Melt Switch.mp3")}
      volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});
        const meltDuck = interpolate(frame, [meltFrom - 5, meltFrom + 12, meltFrom + 52, meltFrom + 80], [1, .38, .48, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const productDuck = interpolate(frame, [productFrom - 3, productFrom + 46, productFrom + 58, productFrom + 80], [1, .74, .28, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const fadeOut = interpolate(frame, [timeline.totalFrames - 30, timeline.totalFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return .115 * fadeIn * meltDuck * productDuck * fadeOut;
      }}
    />
  );
};

export const GalliumSpoonShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getGalliumSpoonTimeline(episode);
  const scenes = [<Setup key="setup" />, <NameReveal key="name" />, <MeltImpact key="melt" />, <GalliumIdentity key="identity" />, <MeltingPoint key="point" />, <Calibration key="calibration" />, <ProductProof key="product" />];
  return (
    <AbsoluteFill style={{backgroundColor: "#020507", fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Bgm episode={episode} timeline={timeline} />
      <Sequence from={0} durationInFrames={timeline.hookFrames}>
        <Hook />
        <Narration path={episode.odaiAudioFile} />
        <Sequence from={38}><Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={.34} /></Sequence>
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <Narration path={answer.audioFile} />
          {index === 0 ? <Audio src={staticFile("Effect/シャキーン2.mp3")} volume={.2} /> : null}
          {index === 1 ? <Audio src={staticFile("Effect/金属タイトル表示2.mp3")} volume={.32} /> : null}
          {index === 2 ? <Sequence from={46}><Audio src={staticFile("Effect/ドーン.mp3")} volume={.32} /></Sequence> : null}
          {index === 4 ? <Sequence from={16}><Audio src={staticFile("Effect/チーン1.mp3")} volume={.22} /></Sequence> : null}
          {index === 6 ? <Sequence from={42}><Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={.42} /></Sequence> : null}
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <Narration path={episode.outroAudioFile} />
        <Audio src={staticFile("Effect/ビシッとツッコミ2.mp3")} volume={.36} />
      </Sequence>
    </AbsoluteFill>
  );
};
