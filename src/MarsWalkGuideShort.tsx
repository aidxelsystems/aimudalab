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
export const MARS_WALK_FPS = 30;
export const MARS_WALK_WIDTH = 1080;
export const MARS_WALK_HEIGHT = 1920;
const fps = MARS_WALK_FPS;
const f = (seconds: number) => Math.max(1, Math.ceil(seconds * fps));
const LANDING = "movie/Capsule_landing_on_Mars_surface_202609060045.mp4";
const WALK = "movie/Traveler_exploring_Mars_rocky_plain_202609060047.mp4";

const C = {
  space: "#100805",
  dark: "#1d0d08",
  rust: "#bd4f2a",
  coral: "#ff805c",
  sand: "#ffd390",
  cyan: "#64eaff",
  ice: "#b9efff",
  blue: "#328fd1",
  red: "#ff4f43",
};

export const getMarsWalkTimeline = (episode: Episode) => {
  const minimums = [2.84, 1.8, 2.1, 2.1, 2.51, 2.24, 2.51, 2.5, 2.2, 1.62, 1.33];
  const hookFrames = Math.max(f(episode.odaiDuration ?? 2), f(2));
  const answerFrames = episode.answers.map((answer, index) =>
    Math.max(f(answer.duration ?? minimums[index]), f(minimums[index])),
  );
  const answerStarts: number[] = [];
  let cursor = hookFrames;
  for (const duration of answerFrames) {
    answerStarts.push(cursor);
    cursor += duration;
  }
  const outroFrames = Math.max(f(episode.outroDuration ?? 3.6), f(3.7));
  return {
    hookFrames,
    answerFrames,
    answerStarts,
    outroFrom: cursor,
    outroFrames,
    totalFrames: cursor + outroFrames,
  };
};

const Video = ({src, startFrom = 0, dark = 0.28}: {src: string; startFrom?: number; dark?: number}) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile(src)}
      startFrom={startFrom}
      muted
      style={{width: "100%", height: "100%", objectFit: "cover"}}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg,rgba(12,5,3,.78),rgba(12,5,3,${dark}) 43%,rgba(10,4,2,.82))`,
      }}
    />
  </AbsoluteFill>
);

const Badge = ({concept = false}: {concept?: boolean}) => (
  <>
    <div
      style={{
        position: "absolute",
        zIndex: 70,
        top: 40,
        left: 32,
        padding: "12px 20px 15px",
        border: "3px solid #fff",
        borderRadius: 999,
        background: "linear-gradient(135deg,#63301e,#c55b32)",
        color: "#fff",
        fontSize: 25,
        fontWeight: 900,
        boxShadow: "0 7px 0 #160703,0 15px 30px #0009",
      }}
    >
      宇宙の歩き方
    </div>
    <div
      style={{
        position: "absolute",
        zIndex: 70,
        top: 47,
        right: 30,
        padding: "10px 13px 12px",
        border: "2px solid #fff9",
        borderRadius: 9,
        background: "#160703dd",
        color: "#fff",
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      {concept ? "AI再現・概念図" : "AIによる宇宙旅行再現"}
    </div>
  </>
);

const Headline = ({children, color = "#fff", size = 74, top = 150}: {children: React.ReactNode; color?: string; size?: number; top?: number}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps, config: {damping: 8, stiffness: 190, mass: 0.55}});
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 60,
        top,
        left: 28,
        right: 28,
        textAlign: "center",
        color,
        fontSize: size,
        lineHeight: 1.06,
        fontWeight: 900,
        letterSpacing: -3,
        WebkitTextStroke: "7px #170704",
        paintOrder: "stroke fill",
        textShadow: "0 14px 34px #000",
        transform: `scale(${interpolate(pop, [0, 1], [1.18, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

const Caption = ({children, accent = C.coral}: {children: React.ReactNode; accent?: string}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 80,
        left: 58,
        right: 58,
        bottom: 230,
        padding: "18px 20px 23px",
        borderTop: `8px solid ${accent}`,
        borderRadius: 18,
        background: "rgba(18,7,3,.95)",
        boxShadow: "0 16px 42px #000d",
        color: "#fff",
        fontSize: 42,
        lineHeight: 1.22,
        fontWeight: 900,
        textAlign: "center",
        opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: "clamp"}),
      }}
    >
      {children}
    </div>
  );
};

const Footer = ({insight = false}: {insight?: boolean}) => (
  <div style={{position: "absolute", zIndex: 45, left: 38, bottom: 180, color: "#f3ddd1", fontSize: 19, fontWeight: 700}}>
    出典: NASA Mars Facts{insight ? " / NASA InSight Press Kit" : ""}
  </div>
);

const Hook = () => (
  <AbsoluteFill>
    <Video src={LANDING} />
    <Badge />
    <Headline size={68}>
      火星に着陸すると<br />
      <span style={{color: C.sand, fontSize: 112}}>人はどうなる？</span>
    </Headline>
    <Caption>まもなく、火星に着陸します。</Caption>
  </AbsoluteFill>
);

const WarmFeet = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill>
      <Video src={LANDING} startFrom={82} dark={0.18} />
      <Badge />
      <Headline size={59}>
        赤道付近・昼の一例<br />
        <span style={{color: C.sand, fontSize: 106}}>足元 約24℃</span>
      </Headline>
      <div
        style={{
          position: "absolute",
          zIndex: 48,
          left: "50%",
          top: 1110,
          width: 610,
          height: 185,
          transform: `translateX(-50%) scale(${pulse})`,
          border: `10px solid ${C.coral}`,
          borderRadius: "50%",
          boxShadow: `0 0 45px ${C.coral}, inset 0 0 42px ${C.coral}99`,
        }}
      />
      <div style={{position: "absolute", zIndex: 49, top: 1028, left: 250, right: 250, padding: 12, borderRadius: 15, background: "#38150bcc", color: C.sand, fontSize: 27, fontWeight: 900, textAlign: "center"}}>
        地表付近の環境温度
      </div>
      <Footer />
      <Caption accent={C.coral}>赤道付近の昼。足元は、約24度。</Caption>
    </AbsoluteFill>
  );
};

const Pleasant = () => (
  <AbsoluteFill>
    <Video src={WALK} startFrom={20} dark={0.18} />
    <Badge />
    <Headline top={265} color={C.sand} size={92}>
      意外と<br />散歩日和なのだ♪
    </Headline>
    <Caption accent={C.sand}>意外と散歩日和なのだ！</Caption>
  </AbsoluteFill>
);

const ColdHead = () => {
  const frame = useCurrentFrame();
  const lineHeight = interpolate(frame, [0, 24], [0, 580], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Video src={WALK} startFrom={74} dark={0.25} />
      <Badge />
      <Headline size={65}>
        でも 頭の高さは<br />
        <span style={{color: C.ice, fontSize: 122}}>約0℃</span>
      </Headline>
      <div style={{position: "absolute", zIndex: 47, left: 185, top: 585, width: 12, height: lineHeight, borderRadius: 8, background: `linear-gradient(${C.ice},${C.coral})`, boxShadow: `0 0 22px ${C.cyan}`}} />
      <div style={{position: "absolute", zIndex: 48, left: 130, top: 550, padding: "10px 19px", borderRadius: 14, background: C.blue, color: "#fff", fontSize: 33, fontWeight: 900}}>頭 約0℃</div>
      <div style={{position: "absolute", zIndex: 48, left: 130, top: 1170, padding: "10px 19px", borderRadius: 14, background: C.rust, color: "#fff", fontSize: 33, fontWeight: 900}}>足元 約24℃</div>
      <Footer />
      <Caption accent={C.cyan}>でも、頭の高さは約0度です。</Caption>
    </AbsoluteFill>
  );
};

const Seasons = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg,${C.blue} 0 48%,${C.rust} 52% 100%)`}}>
    <Badge concept />
    <Headline size={68}>地表付近の環境温度</Headline>
    <div style={{position: "absolute", top: 500, left: 55, right: 55, display: "flex", gap: 22}}>
      {[
        ["頭", "約0℃", "冬", C.ice, "#195c8d"],
        ["足元", "約24℃", "春", C.sand, "#9b3d22"],
      ].map(([part, value, season, color, bg]) => (
        <div key={part} style={{flex: 1, padding: "52px 12px 58px", border: "7px solid #fff", borderRadius: 32, background: bg, color: "#fff", textAlign: "center", boxShadow: "0 25px 65px #0008"}}>
          <div style={{fontSize: 40, fontWeight: 900}}>{part}</div>
          <div style={{marginTop: 15, color, fontSize: 72, fontWeight: 900}}>{value}</div>
          <div style={{marginTop: 28, fontSize: 100, fontWeight: 900}}>{season}</div>
        </div>
      ))}
    </div>
    <div style={{position: "absolute", zIndex: 50, top: 1050, left: 100, right: 100, color: "#fff", fontSize: 62, fontWeight: 900, textAlign: "center", WebkitTextStroke: "5px #170704", paintOrder: "stroke fill"}}>足元は春／頭は冬</div>
    <Footer />
    <Caption accent={C.cyan}>体の中で季節が違うのだ！？</Caption>
  </AbsoluteFill>
);

const Title = () => (
  <AbsoluteFill>
    <Video src={LANDING} startFrom={110} />
    <Badge />
    <div style={{position: "absolute", top: 290, left: 62, right: 62, padding: "50px 20px 58px", border: "7px solid #fff", borderRadius: 36, background: "#351306dc", textAlign: "center", boxShadow: "0 30px 80px #000c"}}>
      <div style={{color: C.sand, fontSize: 50, fontWeight: 900}}>宇宙の歩き方</div>
      <div style={{color: "#fff", fontSize: 86, fontWeight: 900}}>第3回</div>
      <div style={{color: C.coral, fontSize: 150, lineHeight: 1, fontWeight: 900}}>火 星</div>
    </div>
    <Caption>宇宙の歩き方。第3回、火星。</Caption>
  </AbsoluteFill>
);

const Atmosphere = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 72%,#a94a2b,#180b07 66%)"}}>
      <Badge concept />
      <Headline size={70}>火星の大気は<br /><span style={{color: C.cyan, fontSize: 105}}>非常に薄い</span></Headline>
      <div style={{position: "absolute", left: "50%", top: 720, width: 690, height: 690, transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ee9f6c,#a84425 45%,#552014 72%)", border: "5px solid #fff", boxShadow: `0 0 18px ${C.coral}`}} />
      {Array.from({length: 22}, (_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const radius = 360 + ((frame * 2 + i * 11) % 55);
        return <div key={i} style={{position: "absolute", zIndex: 43, left: 540 + Math.cos(angle) * radius, top: 1065 + Math.sin(angle) * radius, width: 8, height: 8, borderRadius: "50%", background: C.cyan, opacity: 0.75}} />;
      })}
      <div style={{position: "absolute", zIndex: 44, top: 1315, left: 220, right: 220, color: "#fff", fontSize: 28, fontWeight: 900, textAlign: "center"}}>大気の厚さは概念表現</div>
      <Footer />
      <Caption accent={C.cyan}>火星は、大気がとても薄い惑星。</Caption>
    </AbsoluteFill>
  );
};

const Pressure = () => {
  const frame = useCurrentFrame();
  const rise = spring({frame, fps, config: {damping: 10, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg,#08263c,#40190f 76%)"}}>
      <Badge concept />
      <Headline size={65}>地表気圧の比較</Headline>
      <div style={{position: "absolute", top: 500, left: 100, right: 100, height: 720, display: "flex", alignItems: "flex-end", justifyContent: "space-around"}}>
        <div style={{width: 300, textAlign: "center"}}>
          <div style={{height: 560 * rise, border: "6px solid #fff", borderRadius: "28px 28px 8px 8px", background: `linear-gradient(${C.cyan},${C.blue})`, boxShadow: `0 0 42px ${C.cyan}88`}} />
          <div style={{marginTop: 22, color: "#fff", fontSize: 43, fontWeight: 900}}>地球 1</div>
        </div>
        <div style={{width: 300, textAlign: "center"}}>
          <div style={{height: Math.max(16, 32 * rise), border: "6px solid #fff", borderRadius: "15px 15px 8px 8px", background: C.coral, boxShadow: `0 0 42px ${C.coral}`}} />
          <div style={{marginTop: 22, color: C.sand, fontSize: 37, fontWeight: 900}}>火星 1/100未満</div>
        </div>
      </div>
      <Footer insight />
      <Caption accent={C.coral}>地表の気圧は、地球の100分の1未満。</Caption>
    </AbsoluteFill>
  );
};

const CarbonDioxide = () => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps, config: {damping: 7, stiffness: 190}});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle,#78311f,#160806 70%)"}}>
      <Badge concept />
      <Headline size={63}>火星の大気</Headline>
      <div style={{position: "absolute", top: 525, left: 90, right: 90, padding: "75px 25px 85px", border: `8px solid ${C.cyan}`, borderRadius: 42, background: "#081d2bdc", color: "#fff", textAlign: "center", boxShadow: `0 0 55px ${C.cyan}66`, transform: `scale(${interpolate(pop, [0, 1], [0.75, 1])})`}}>
        <div style={{fontSize: 43, fontWeight: 900}}>主成分</div>
        <div style={{marginTop: 28, color: C.sand, fontSize: 75, fontWeight: 900}}>二酸化炭素</div>
        <div style={{marginTop: 14, color: C.cyan, fontSize: 154, lineHeight: 1, fontWeight: 900}}>CO₂</div>
      </div>
      <Footer />
      <Caption>しかも、大気の主成分は二酸化炭素です。</Caption>
    </AbsoluteFill>
  );
};

const SuitRequired = () => (
  <AbsoluteFill>
    <Video src={WALK} startFrom={42} dark={0.46} />
    <Badge />
    <Headline color={C.red} size={70}>そのままでは<br /><span style={{fontSize: 104}}>呼吸できない</span></Headline>
    <div style={{position: "absolute", zIndex: 47, top: 630, left: 120, right: 120, padding: "36px 25px", border: "6px solid #fff", borderRadius: 28, background: "#7d2219e8", color: "#fff", fontSize: 52, fontWeight: 900, textAlign: "center", boxShadow: `0 0 60px ${C.red}`}}>密閉宇宙服が必要</div>
    <Footer />
    <Caption accent={C.red}>宇宙服なしでは呼吸できないのだ！</Caption>
  </AbsoluteFill>
);

const Question = () => (
  <AbsoluteFill>
    <Video src={WALK} startFrom={90} dark={0.3} />
    <Badge />
    <Headline top={300} size={79}>では、<br /><span style={{color: C.sand, fontSize: 111}}>散歩しますか？</span></Headline>
    <Caption accent={C.sand}>では、散歩しますか？</Caption>
  </AbsoluteFill>
);

const Return = () => (
  <AbsoluteFill>
    <Video src={WALK} startFrom={125} dark={0.28} />
    <Badge />
    <Headline top={275} color={C.cyan} size={78}>カプセルへ<br /><span style={{fontSize: 110}}>戻るのだ。</span></Headline>
    <div style={{position: "absolute", zIndex: 46, top: 780, left: 150, right: 150, height: 18, borderRadius: 12, background: C.cyan, boxShadow: `0 0 34px ${C.cyan}`, transform: "rotate(-9deg)"}} />
    <Caption accent={C.cyan}>カプセルへ戻るのだ。</Caption>
  </AbsoluteFill>
);

const Outro = () => {
  const frame = useCurrentFrame();
  const hit = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 7, stiffness: 210}});
  const cta = spring({frame: Math.max(0, frame - 52), fps, config: {damping: 9, stiffness: 175}});
  return (
    <AbsoluteFill>
      <Video src={WALK} startFrom={60} dark={0.63} />
      <Badge />
      <div style={{position: "absolute", zIndex: 55, top: 275, left: 42, right: 42, bottom: 215, border: "8px solid #fff", borderRadius: 42, background: "#260d05e9", textAlign: "center", boxShadow: "0 30px 80px #000e"}}>
        <div style={{marginTop: 78, color: C.ice, fontSize: 56, fontWeight: 900}}>散歩日和</div>
        <div style={{marginTop: 30, color: C.sand, fontSize: 92, lineHeight: 1.05, fontWeight: 900, letterSpacing: -5, WebkitTextStroke: "6px #fff", paintOrder: "stroke fill", transform: `scale(${interpolate(hit, [0, 1], [1.35, 1])})`}}>足元だけ<br />なんかい！</div>
        <div style={{margin: "54px 55px 0", padding: "23px 10px", border: `4px solid ${C.cyan}`, borderRadius: 20, color: "#fff", fontSize: 36, fontWeight: 900}}>火星、歩いてみたい？<br /><span style={{color: C.cyan, fontSize: 29}}>歩いてみたい ／ カプセルで待つ</span></div>
        <div style={{position: "absolute", left: 70, right: 70, bottom: 62, padding: "22px 8px 27px", border: "4px solid #fff", borderRadius: 20, background: C.sand, color: C.dark, fontSize: 39, fontWeight: 900, opacity: cta, transform: `scale(${interpolate(cta, [0, 1], [0.82, 1])})`}}>チャンネル登録もよろしく！</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAudio = ({voice, effect, volume = 0.16}: {voice?: string; effect?: string; volume?: number}) => (
  <>
    {voice ? <Audio src={staticFile(voice)} /> : null}
    {effect ? <Audio src={staticFile(effect)} volume={volume} /> : null}
  </>
);

export const MarsWalkGuideShort: React.FC<{episode: Episode}> = ({episode}) => {
  const timeline = getMarsWalkTimeline(episode);
  const scenes = [
    <WarmFeet />,
    <Pleasant />,
    <ColdHead />,
    <Seasons />,
    <Title />,
    <Atmosphere />,
    <Pressure />,
    <CarbonDioxide />,
    <SuitRequired />,
    <Question />,
    <Return />,
  ];
  return (
    <AbsoluteFill style={{background: C.space, fontFamily: `${fontFamily},'Yu Gothic',sans-serif`}}>
      <Audio
        src={staticFile(episode.bgm ?? "BGM/Lab Rocket Switch.mp3")}
        startFrom={30}
        volume={(frame) => 0.085 * interpolate(frame, [0, 10, timeline.totalFrames - 22, timeline.totalFrames], [0, 1, 1, 0], {extrapolateRight: "clamp"})}
      />
      <Sequence durationInFrames={timeline.hookFrames}>
        <Hook />
        <SceneAudio voice={episode.odaiAudioFile} effect="Effect/シャキーン1.mp3" />
      </Sequence>
      {episode.answers.map((answer, index) => (
        <Sequence key={answer.id} from={timeline.answerStarts[index]} durationInFrames={timeline.answerFrames[index]}>
          {scenes[index]}
          <SceneAudio
            voice={answer.audioFile}
            effect={index === 0 ? "Effect/文字表示の衝撃音3.mp3" : index === 2 ? "Effect/ショック2.mp3" : index === 6 ? "Effect/ドーン.mp3" : index === 8 ? "Effect/ビシッとツッコミ2.mp3" : undefined}
            volume={index === 6 ? 0.21 : 0.16}
          />
        </Sequence>
      ))}
      <Sequence from={timeline.outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro />
        <SceneAudio voice={episode.outroAudioFile} effect="Effect/ビシッとツッコミ1.mp3" volume={0.28} />
      </Sequence>
    </AbsoluteFill>
  );
};
