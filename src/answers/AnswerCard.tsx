import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Theme } from "../theme/themes";
import { TimelineItem } from "../lib/types";
import { EffectAudio, effectForSe, effectPath } from "../lib/effects";

/**
 * M1: normal の高速スライドが主役。
 * tag による派手演出は M2 以降だが、可読性のため最低限の差をつける:
 * - 左右交互スライドイン + ポップ
 * - peak は特大表示
 */
export const AnswerCard: React.FC<{
  item: TimelineItem;
  theme: Theme;
  visualDurationInFrames?: number;
  answerStartOffsetInFrames?: number;
}> = ({ item, theme, visualDurationInFrames, answerStartOffsetInFrames = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const { answer, index, tendonIndex } = item;
  const isPeak = answer.tag === "peak" || answer.peak;
  const isSlipBeat = answer.se === "weak" || answer.se === "cricket";
  const isAfterReadBeat = isSlipBeat || answer.se === "tsukkomi";
  const answerFrame = Math.max(0, frame - answerStartOffsetInFrames);
  const showFlip = frame >= answerStartOffsetInFrames;
  const punchRevealFrame = Math.round(
    item.durationInFrames * (answer.punch_reveal_ratio ?? 0.56)
  );
  const hasStagedPunch = Boolean(answer.setup_text && answer.punch_text);
  const showPunch = hasStagedPunch && answerFrame >= punchRevealFrame;

  // 上部フリップ契約: 常設のお題バー直下に固定し、画像の主役は中央へ置く。
  const enter = spring({
    frame: Math.max(0, answerFrame - 8),
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 130 },
  });
  const textEnter = spring({
    frame: Math.max(0, answerFrame - 13),
    fps,
    config: { damping: 16, mass: 0.55, stiffness: 150 },
  });
  const dir = index % 2 === 0 ? 1 : -1;
  const cardY = interpolate(enter, [0, 1], [-360, 0]);
  const textX = interpolate(textEnter, [0, 1], [dir * width * 0.14, 0]);
  const textOpacity = interpolate(textEnter, [0, 0.35, 1], [0, 0.7, 1]);

  // 抜け際にわずかにフェード
  const outFade = interpolate(
    frame,
    [(visualDurationInFrames ?? item.durationInFrames) - 6, visualDurationInFrames ?? item.durationInFrames],
    [1, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 天丼は回数ごとに少し拡大
  const tendonBoost = tendonIndex ? 1 + (tendonIndex - 1) * 0.12 : 1;

  const displayText = hasStagedPunch
    ? showPunch
      ? answer.punch_text!
      : answer.setup_text!
    : answer.text;
  const lines = displayText.split("\n");
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const fitByLines = lines.length >= 4 ? 0.78 : lines.length >= 3 ? 0.88 : 1;
  const fitByLength = longestLine >= 18 ? 0.84 : longestLine >= 15 ? 0.92 : 1;
  const baseSize = isPeak ? 74 : 62;
  const fontSize = baseSize * tendonBoost * fitByLines * fitByLength;
  const punchEnter = spring({
    frame: Math.max(0, answerFrame - punchRevealFrame),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 180 },
  });
  const stagedScale = showPunch
    ? interpolate(punchEnter, [0, 1], [0.82, 1])
    : 1;

  const imageSrc = `image/a${String(index + 1).padStart(2, "0")}.png`;
  const imageScale = interpolate(
    frame,
    [0, visualDurationInFrames ?? item.durationInFrames],
    [1.02, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const seFrom = isAfterReadBeat
    ? answerStartOffsetInFrames + item.durationInFrames + 4
    : answerStartOffsetInFrames + (isPeak ? 10 : 5);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <AbsoluteFill>
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imageScale})`,
          }}
        />
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.08)" }} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0.48) 100%)",
          }}
        />
      </AbsoluteFill>
      {answer.audioFile ? (
        <Sequence from={answerStartOffsetInFrames} durationInFrames={item.durationInFrames}>
          <Audio src={staticFile(answer.audioFile)} />
        </Sequence>
      ) : null}
      <EffectAudio
        src={effectPath.flip}
        from={answerStartOffsetInFrames}
        durationInFrames={45}
        volume={isPeak ? 0.44 : 0.28}
      />
      <EffectAudio
        src={effectForSe(answer.se)}
        from={seFrom}
        durationInFrames={90}
        volume={isPeak ? 0.52 : answer.se === "tsukkomi" ? 0.44 : isSlipBeat ? 0.38 : 0.26}
      />
      {showFlip ? (
        <div
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            top: 330,
            transform: `translateY(${cardY}px)`,
            opacity: outFade,
            minHeight: isPeak ? 360 : 300,
            padding: isPeak ? "42px 48px" : "38px 44px",
            background: "#fff6dc",
            border: "7px solid #1c1a16",
            boxShadow:
              "0 18px 44px rgba(0,0,0,0.42), inset 0 0 0 3px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `translateX(${textX}px) scale(${stagedScale})`,
              opacity: textOpacity,
              fontSize,
              fontWeight: 900,
              lineHeight: 1.25,
              color: "#111",
              whiteSpace: "pre-wrap",
              letterSpacing: 0,
              textShadow: "0 2px 0 rgba(255,255,255,0.8)",
            }}
          >
            {displayText}
          </div>
        </div>
      ) : null}
    </div>
  );
};
