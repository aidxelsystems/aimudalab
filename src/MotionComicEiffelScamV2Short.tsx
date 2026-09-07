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
} from "remotion";
import {Episode} from "./lib/types";

const {fontFamily} = loadFont("normal", {weights: ["700", "900"]});

export const EIFFEL_SCAM_V2_FPS = 30;
export const EIFFEL_SCAM_V2_WIDTH = 1080;
export const EIFFEL_SCAM_V2_HEIGHT = 1920;
export const EIFFEL_SCAM_V2_DURATION = 1020;

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const base = "image/motion-comic-eiffel-scam-01";
const images = {
  hook: `${base}/panel-01-sale-hook.png`,
  newspaper: `${base}/panel-v2-02-newspaper.png`,
  gap: `${base}/panel-v2-03-thought-gap.png`,
  forgery: `${base}/panel-v2-04-forgery.png`,
  meeting: `${base}/panel-02-secret-meeting.png`,
  payment: `${base}/panel-03-contract-payment.png`,
  escape: `${base}/panel-04-scam-discovered.png`,
  silence: `${base}/panel-v2-08-no-pursuit.png`,
  second: `${base}/panel-05-second-buyer.png`,
};

const ImageScene: React.FC<{
  src: string;
  duration: number;
  origin?: string;
  fromScale?: number;
  toScale?: number;
  filter?: string;
  shake?: number;
}> = ({src, duration, origin = "50% 50%", fromScale = 1.02, toScale = 1.09, filter, shake = 0}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: 30, config: {damping: 20, stiffness: 180}});
  const zoom = interpolate(frame, [0, duration], [fromScale, toScale], clamp);
  const jitter = shake && frame < 16 ? Math.sin(frame * 2.7) * shake * (1 - frame / 16) : 0;
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#0b0b0d", transform: `translateX(${jitter}px)`}}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: origin,
          transform: `scale(${zoom * interpolate(enter, [0, 1], [1.035, 1], clamp)})`,
          filter: filter ?? "contrast(1.07) saturate(1.02)",
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(4,7,12,.48),transparent 29%,transparent 63%,rgba(5,6,10,.74))"}} />
      <AbsoluteFill style={{opacity: 0.06, backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 1.4px)", backgroundSize: "8px 8px", mixBlendMode: "soft-light"}} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{children: React.ReactNode; top?: number; color?: string; size?: number; delay?: number}> = ({children, top = 1320, color = "#55dcff", size = 62, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: 30, config: {damping: 17, stiffness: 225}});
  return (
    <div style={{position: "absolute", top, left: 72, right: 170, padding: "23px 34px 28px", border: "5px solid #fff4d8", borderRadius: 25, background: "rgba(5,8,13,.86)", color: "white", fontFamily, fontWeight: 900, fontSize: size, lineHeight: 1.08, textAlign: "center", whiteSpace: "pre-line", WebkitTextStroke: "7px #090a0d", paintOrder: "stroke fill", boxShadow: `inset 12px 0 ${color},0 15px 40px rgba(0,0,0,.48)`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [25, 0], clamp)}px)`}}>
      {children}
    </div>
  );
};

const Impact: React.FC<{children: React.ReactNode; color?: string; top?: number; size?: number}> = ({children, color = "#ffd23f", top = 1030, size = 105}) => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: 30, config: {damping: 9, stiffness: 285, mass: 0.42}});
  const shake = frame < 15 ? Math.sin(frame * 3.2) * (15 - frame) * 0.75 : 0;
  return (
    <>
      <AbsoluteFill style={{background: `rgba(255,232,145,${interpolate(frame, [0, 2, 10], [.55, .18, 0], clamp)})`}} />
      <div style={{position: "absolute", top, left: 42, right: 145, color, fontFamily, fontWeight: 900, fontSize: size, lineHeight: 1.02, textAlign: "center", whiteSpace: "pre-line", WebkitTextStroke: "15px #0a090c", paintOrder: "stroke fill", textShadow: "0 12px 0 rgba(0,0,0,.38),0 22px 45px rgba(0,0,0,.7)", opacity: p, transform: `translateX(${shake}px) scale(${interpolate(p, [0, 1], [.7, 1], clamp)})`}}>
        {children}
      </div>
    </>
  );
};

const Speech: React.FC<{children: React.ReactNode; top?: number; left?: number; right?: number; delay?: number}> = ({children, top = 230, left = 120, right = 180, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: 30, config: {damping: 15, stiffness: 210}});
  return <div style={{position: "absolute", top, left, right, padding: "26px 34px 31px", borderRadius: "52% 48% 49% 51%", border: "6px solid #151217", background: "rgba(255,249,228,.97)", color: "#171218", fontFamily, fontSize: 66, lineHeight: 1.05, fontWeight: 900, textAlign: "center", whiteSpace: "pre-line", boxShadow: "0 14px 34px rgba(0,0,0,.5)", opacity: p, transform: `scale(${interpolate(p, [0, 1], [.8, 1], clamp)})`}}>{children}</div>;
};

const Hook = () => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: 30, config: {damping: 14, stiffness: 240}});
  return <>
    <ImageScene src={images.hook} duration={75} origin="40% 58%" fromScale={1.03} toScale={1.12} />
    <div style={{position: "absolute", top: 115, left: 70, right: 165, fontFamily, fontWeight: 900, textAlign: "center", opacity: p, transform: `scale(${interpolate(p, [0, 1], [.78, 1], clamp)})`}}>
      <div style={{display: "inline-block", padding: "10px 27px", color: "white", background: "#c92732", border: "5px solid #fff4d8", borderRadius: 999, fontSize: 46}}>実際にあった話</div>
      <div style={{marginTop: 18, color: "#fff8df", fontSize: 91, lineHeight: 1.02, WebkitTextStroke: "14px #09090c", paintOrder: "stroke fill"}}>エッフェル塔を<br/><span style={{color: "#ffd13c", fontSize: 116}}>売った男</span></div>
    </div>
  </>;
};

const Newspaper = () => {
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [33, 55], [0, 100], clamp);
  return <>
    <ImageScene src={images.newspaper} duration={105} origin="47% 61%" fromScale={1.01} toScale={1.1} />
    <div style={{position: "absolute", top: 1030, left: 85, right: 178, padding: "27px 28px 34px", background: "rgba(240,229,197,.94)", border: "6px solid #261d18", transform: "rotate(-1.2deg)", color: "#1b1714", fontFamily, fontWeight: 900, textAlign: "center", boxShadow: "0 15px 38px rgba(0,0,0,.55)"}}>
      <div style={{fontSize: 47}}>エッフェル塔</div><div style={{fontSize: 73, lineHeight: 1}}>維持費が高すぎる</div>
      <div style={{height: 10, width: `${underline}%`, background: "#bd2630", margin: "15px auto 0"}} />
    </div>
  </>;
};

const ThoughtGap = () => <>
  <ImageScene src={images.gap} duration={90} origin="50% 47%" fromScale={1.01} toScale={1.065} />
  <Sequence from={0} durationInFrames={54}><Label top={1300} color="#9aa6ad" size={57}>普通なら「維持、大変だな」</Label></Sequence>
  <Sequence from={54}><Impact top={1090} size={116}>これ、売れるな</Impact></Sequence>
</>;

const Forgery = () => {
  const frame = useCurrentFrame();
  const origins = frame < 42 ? "40% 67%" : frame < 78 ? "59% 58%" : "50% 43%";
  return <>
    <ImageScene src={images.forgery} duration={120} origin={origins} fromScale={frame < 42 ? 1.2 : 1.12} toScale={frame < 42 ? 1.3 : 1.2} />
    <Label top={1310} color="#d72e39" size={63}>偽の政府文書を用意</Label>
    <Sequence from={60} durationInFrames={22}><Impact top={900} size={101} color="#ef3945">極秘</Impact></Sequence>
  </>;
};

const Meeting = () => <>
  <ImageScene src={images.meeting} duration={120} origin="43% 58%" fromScale={1.02} toScale={1.115} />
  <Speech top={205}>政府による<br/>極秘の解体です</Speech>
  <Sequence from={66}><Label top={1330} color="#50d9ff" size={54}>役人を装い、業者を秘密会合へ</Label></Sequence>
</>;

const Sale = () => <>
  <ImageScene src={images.payment} duration={120} origin="44% 65%" fromScale={1.02} toScale={1.12} />
  <Speech top={195}>私が買います</Speech>
  <Sequence from={60}><Impact top={1080} size={120}>本当に売れた</Impact></Sequence>
</>;

const Escape = () => {
  const frame = useCurrentFrame();
  const relief = frame >= 60;
  return <>
    <ImageScene src={relief ? images.silence : images.escape} duration={120} origin={relief ? "51% 45%" : "43% 29%"} fromScale={relief ? 1.11 : 1.12} toScale={relief ? 1.03 : 1.2} filter={relief ? "contrast(1.03) saturate(.88) sepia(.12)" : "contrast(1.15) saturate(.72) hue-rotate(175deg)"} shake={relief ? 0 : 5} />
    <Label top={1320} color={relief ? "#e5b957" : "#ef3945"} size={60}>{relief ? "……追っ手は来ない" : "代金を持って、国外へ逃亡"}</Label>
  </>;
};

const Silence = () => {
  const frame = useCurrentFrame();
  const realize = frame >= 60;
  return <>
    <ImageScene src={realize ? images.silence : images.escape} duration={90} origin={realize ? "51% 38%" : "48% 78%"} fromScale={realize ? 1.15 : 1.14} toScale={realize ? 1.21 : 1.2} filter="contrast(1.08) saturate(.45) brightness(.72)" />
    {!realize && <Label top={1270} color="#a9b0b4" size={56}>被害者は、恥ずかしくて<br/>通報しなかった</Label>}
    {!realize && <div style={{position:"absolute",top:1110,left:300,right:390,padding:"12px",border:"5px solid #eee",color:"white",background:"#9c232b",fontFamily,fontWeight:900,fontSize:61,textAlign:"center",transform:"rotate(-5deg)"}}>通報なし</div>}
    {realize && <Speech top={250}>誰も、追ってこない……</Speech>}
  </>;
};

const Rewind: React.FC = () => {
  const frame = useCurrentFrame();
  const stack = [images.payment, images.meeting, images.forgery, images.gap];
  const src = stack[Math.min(stack.length - 1, Math.floor(frame / 5))];
  return <AbsoluteFill style={{filter: "grayscale(.8) contrast(1.5)", transform: `translateX(${Math.sin(frame * 4) * 18}px)`}}><ImageScene src={src} duration={20} fromScale={1.15} toScale={1.28}/><AbsoluteFill style={{background:"repeating-linear-gradient(0deg,rgba(255,255,255,.12) 0 3px,transparent 3px 12px)"}}/><div style={{position:"absolute",top:780,left:0,right:0,textAlign:"center",color:"#fff",fontFamily,fontSize:118,fontWeight:900,WebkitTextStroke:"14px #111",paintOrder:"stroke fill"}}>↶</div></AbsoluteFill>;
};

const Finale = () => <>
  <ImageScene src={images.second} duration={115} origin="46% 60%" fromScale={1.02} toScale={1.11} />
  <Sequence from={25}><Impact top={900} size={91}>エッフェル塔、<br/><span style={{color:"#ff4b56"}}>2回目も売るんかい！</span></Impact></Sequence>
  <Sequence from={61}>
    <div style={{position:"absolute",top:1300,left:80,right:180,padding:"18px 24px 22px",borderRadius:20,background:"rgba(7,9,13,.9)",border:"4px solid #fff4d8",color:"white",fontFamily,fontSize:39,fontWeight:900,lineHeight:1.3,textAlign:"center"}}>※この男、約10年後に別件で逮捕<br/><span style={{color:"#ffd13c"}}>良い子はマネしないでね</span></div>
  </Sequence>
  <Sequence from={77}>
    <div style={{position:"absolute",top:1515,left:180,right:285,padding:"11px 20px",borderRadius:999,background:"#ca2934",color:"white",fontFamily,fontWeight:900,fontSize:36,textAlign:"center"}}>チャンネル登録もよろしく</div>
  </Sequence>
</>;

const Disclosure = () => <div style={{position:"absolute",bottom:62,left:55,right:165,color:"rgba(255,255,255,.88)",fontFamily,fontSize:23,fontWeight:700,textAlign:"center",textShadow:"0 2px 5px #000"}}>AI生成画像による再現・台詞は演出</div>;

const Voice: React.FC<{episode: Episode}> = ({episode}) => {
  const starts = [79,180,234,274,394,458,520,553,634,754,823,880];
  return <>
    {episode.odaiAudioFile && <Sequence from={4}><Audio src={staticFile(episode.odaiAudioFile)} /></Sequence>}
    {episode.answers.map((a, i) => a.audioFile ? <Sequence key={a.id} from={starts[i]}><Audio src={staticFile(a.audioFile)} /></Sequence> : null)}
    {episode.outroAudioFile && <Sequence from={930}><Audio src={staticFile(episode.outroAudioFile)} /></Sequence>}
  </>;
};

export const MotionComicEiffelScamV2Short: React.FC<{episode: Episode}> = ({episode}) => {
  const frame = useCurrentFrame();
  const globalShake = [234,570,930].reduce((sum, hit) => {
    const d = frame - hit;
    return sum + (d >= 0 && d < 15 ? Math.sin(d * 3.1) * (15 - d) * .7 : 0);
  }, 0);
  return <AbsoluteFill style={{background:"#09090b",overflow:"hidden"}}>
    <AbsoluteFill style={{transform:`translateX(${globalShake}px)`}}>
      <Sequence from={0} durationInFrames={75}><Hook/></Sequence>
      <Sequence from={75} durationInFrames={105}><Newspaper/></Sequence>
      <Sequence from={180} durationInFrames={90}><ThoughtGap/></Sequence>
      <Sequence from={270} durationInFrames={120}><Forgery/></Sequence>
      <Sequence from={390} durationInFrames={120}><Meeting/></Sequence>
      <Sequence from={510} durationInFrames={120}><Sale/></Sequence>
      <Sequence from={630} durationInFrames={120}><Escape/></Sequence>
      <Sequence from={750} durationInFrames={90}><Silence/></Sequence>
      <Sequence from={840} durationInFrames={45}><ImageScene src={images.silence} duration={45} origin="51% 38%" fromScale={1.19} toScale={1.23}/><Sequence from={28}><Speech top={230}>なら、もう一度</Speech></Sequence></Sequence>
      <Sequence from={885} durationInFrames={20}><Rewind/></Sequence>
      <Sequence from={905} durationInFrames={115}><Finale/></Sequence>
    </AbsoluteFill>
    <Disclosure/>
    <Voice episode={episode}/>
    <Sequence from={0} durationInFrames={905}><Audio src={staticFile("BGM/Glass Shatter Protocol.mp3")} volume={(f) => {
      if (f < 12) return interpolate(f,[0,12],[0,.07],clamp);
      if (f >= 215 && f < 255) return .012;
      if (f >= 690 && f < 750) return .045;
      if (f >= 750 && f < 885) return .009;
      return f > 888 ? interpolate(f,[888,904],[.06,0],clamp) : .06;
    }}/></Sequence>
    <Sequence from={905}><Audio src={staticFile("BGM/If I Had a Chicken - Kevin MacLeod.mp3")} volume={(f)=>interpolate(f,[0,10,100,114],[0,.075,.075,0],clamp)}/></Sequence>
    <Sequence from={234}><Audio src={staticFile("Effect/文字表示の衝撃音3.mp3")} volume={.19}/></Sequence>
    <Sequence from={330}><Audio src={staticFile("Effect/決定ボタンを押す3.mp3")} volume={.13}/></Sequence>
    <Sequence from={570}><Audio src={staticFile("Effect/シャキーン1.mp3")} volume={.16}/></Sequence>
    <Sequence from={885}><Audio src={staticFile("Effect/ショック2.mp3")} volume={.12}/></Sequence>
    <Sequence from={930}><Audio src={staticFile("Effect/ビシッとツッコミ1.mp3")} volume={.2}/></Sequence>
  </AbsoluteFill>;
};
