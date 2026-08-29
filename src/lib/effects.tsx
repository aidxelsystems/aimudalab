import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SeName } from "./types";

export const effectPath = {
  flip: "Effect/文字表示の衝撃音3.mp3",
  title: "Effect/和太鼓でドドン (1).mp3",
  titleHeavy: "Effect/ドーン.mp3",
  pop: "Effect/決定ボタンを押す3.mp3",
  weak: "Effect/チーン1.mp3",
  shock: "Effect/ショック2 (2).mp3",
  goofy: "Effect/間抜け1.mp3",
  tsukkomi: "Effect/ビシッとツッコミ2.mp3",
  correct: "Effect/クイズ正解2.mp3",
  shine: "Effect/シャキーン1.mp3",
  don: "Effect/和太鼓でドン.mp3",
  applause: "Effect/歓声と拍手.mp3",
  claps: "Effect/大勢で拍手.mp3",
} as const;

export const effectForSe = (se?: SeName) => {
  switch (se) {
    case "weak":
      return effectPath.weak;
    case "cricket":
      return effectPath.goofy;
    case "tsukkomi":
      return effectPath.tsukkomi;
    case "callback":
      return effectPath.shine;
    case "don":
      return effectPath.don;
    case "drumroll_don":
      return effectPath.titleHeavy;
    case "pop":
    default:
      return effectPath.pop;
  }
};

export const EffectAudio: React.FC<{
  src: string;
  from?: number;
  durationInFrames?: number;
  volume?: number;
}> = ({ src, from = 0, durationInFrames = 90, volume = 0.42 }) => (
  <Sequence from={from} durationInFrames={durationInFrames}>
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
