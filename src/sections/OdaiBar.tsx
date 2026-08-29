import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Theme } from "../theme/themes";

export const OdaiBar: React.FC<{
  odai: string;
  theme: Theme;
  hookFrames: number;
  instant?: boolean;
  teaser?: string;
  headline?: string;
}> = ({ odai, theme, hookFrames, instant = false, teaser, headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const showImpactTitle = instant && Boolean(headline);

  // 入り: 上からスプリングで降りてくる
  const enter = instant
    ? 1
    : spring({ frame, fps, config: { damping: 16, mass: 0.6 } });
  const y = interpolate(enter, [0, 1], [-220, 0]);

  // フック区間は大きめ → 以降は少し縮んで常駐
  const settle = interpolate(frame, [hookFrames - 8, hookFrames + 6], [1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fontSize = 64 * settle;
  const impactScale = interpolate(frame, [0, 3, 9, 22, 30], [0.88, 1.12, 1, 1, 0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactOpacity = interpolate(frame, [0, 2, 22, 30], [0.96, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const regularOpacity = showImpactTitle
    ? interpolate(frame, [23, 31], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const regularScale = showImpactTitle
    ? interpolate(frame, [23, 31], [0.84, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const teaserProgress = teaser
    ? interpolate(frame, [hookFrames - 2, hookFrames + 14], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <>
      {showImpactTitle ? (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 42,
            right: 42,
            zIndex: 2,
            opacity: impactOpacity,
            transform: `scale(${impactScale}) rotate(${interpolate(frame, [0, 9], [-2.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}deg)`,
            transformOrigin: "top center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: -8,
              padding: "12px 30px 14px",
              borderRadius: 18,
              background: "linear-gradient(180deg, #ff3d24 0%, #c90000 100%)",
              border: "5px solid #fff5b7",
              color: "#fff",
              fontSize: 46,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: 1,
              whiteSpace: "pre-wrap",
              WebkitTextStroke: "1.5px #5d0000",
              textShadow: "0 4px 0 #5d0000, 0 8px 18px rgba(0,0,0,0.55)",
              boxShadow: "0 10px 0 #6f0000, 0 18px 32px rgba(0,0,0,0.42)",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              margin: "0 auto",
              maxWidth: 950,
              padding: "24px 34px 30px",
              borderRadius: 34,
              background: "linear-gradient(145deg, #fff24a 0%, #ffb300 100%)",
              border: "9px solid #17120b",
              color: "#111",
              fontSize: 102,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -3,
              whiteSpace: "pre-wrap",
              WebkitTextStroke: "2px #111",
              textShadow: "5px 5px 0 #fff, 9px 9px 0 #e22613",
              boxShadow: "0 15px 0 #17120b, 0 24px 44px rgba(0,0,0,0.5)",
            }}
          >
            {odai}
          </div>
        </div>
      ) : null}
      <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        paddingTop: 90,
        paddingBottom: 26,
        transform: `translateY(${y}px) scale(${regularScale})`,
        transformOrigin: "top center",
        opacity: regularOpacity,
        display: "flex",
        justifyContent: "center",
      }}
      >
      <div
        style={{
          background: theme.odaiBar,
          color: theme.odaiText,
          borderRadius: 28,
          padding: "20px 44px",
          maxWidth: 920,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: 0.7,
            marginBottom: 6,
          }}
        >
          お題
        </div>
        <div
          style={{
            fontSize,
            fontWeight: 900,
            lineHeight: 1.15,
            whiteSpace: "pre-wrap",
          }}
        >
          {odai}
        </div>
        {teaser ? (
          <div
            style={{
              marginTop: 14 * teaserProgress,
              padding: `${8 * teaserProgress}px 18px`,
              maxHeight: 72 * teaserProgress,
              borderRadius: 999,
              background: "#e53935",
              color: "white",
              fontSize: 30 * teaserProgress,
              fontWeight: 900,
              letterSpacing: 1,
              opacity: teaserProgress,
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {teaser}
          </div>
        ) : null}
      </div>
      </div>
    </>
  );
};
