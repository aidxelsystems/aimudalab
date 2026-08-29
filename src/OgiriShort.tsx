import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Episode } from "./lib/types";
import { buildTimeline } from "./lib/timeline";
import { getTheme } from "./theme/themes";
import { OdaiBar } from "./sections/OdaiBar";
import { AnswerSequence } from "./sections/AnswerSequence";
import { Outro } from "./sections/Outro";
import { Background } from "./sections/Background";
import { TitleBoom } from "./sections/TitleBoom";
import { EffectAudio, effectPath } from "./lib/effects";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });
const defaultBgmPath = "BGM/Oogiri Parade.mp3";

export const OgiriShort: React.FC<{ episode: Episode }> = ({ episode }) => {
  const theme = getTheme(episode.theme);
  const timeline = buildTimeline(episode);
  const bgmPath = episode.bgm?.includes("/") ? episode.bgm : defaultBgmPath;
  const overlayFirstImage = episode.hook_style === "overlay_first_image";

  const outroFrom = timeline.totalFrames - timeline.outroFrames;
  const bgmVolume = (frame: number) => {
    const fadeFrames = 45;
    const fadeIn = Math.min(1, frame / fadeFrames);
    const fadeOut = Math.min(1, (timeline.totalFrames - frame) / fadeFrames);
    return 0.105 * Math.max(0, Math.min(fadeIn, fadeOut));
  };

  return (
    <AbsoluteFill
      style={{
        fontFamily: `${fontFamily}, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif`,
      }}
    >
      {/* 背景レイヤー(最背面) */}
      <Background theme={theme} config={episode.background} />

      {/* 全編BGM: 声と効果音を優先するため控えめに敷く */}
      <Audio src={staticFile(bgmPath)} loop volume={bgmVolume} />

      {overlayFirstImage && episode.odaiAudioFile ? (
        <Sequence from={0} durationInFrames={timeline.hookFrames}>
          <Audio src={staticFile(episode.odaiAudioFile)} />
          <EffectAudio
            src={effectPath.title}
            durationInFrames={60}
            volume={0.4}
          />
        </Sequence>
      ) : null}

      {/* 回答連発 */}
      <AnswerSequence
        timeline={timeline}
        theme={theme}
      />

      {/* お題バー: 回答画像より前面に常時固定。緊急フック型は0Fから即表示 */}
      <OdaiBar
        odai={episode.odai}
        theme={theme}
        hookFrames={timeline.hookFrames}
        instant={overlayFirstImage}
        teaser={episode.hook_teaser}
        headline={episode.hook_headline}
      />

      {timeline.titleCards.map((card, index) => (
        <Sequence
          key={`${card.reason}-${index}-${card.from}`}
          from={card.from}
          durationInFrames={card.durationInFrames}
          name={`Title:${card.reason}`}
        >
          {episode.odaiAudioFile ? (
            <Audio src={staticFile(episode.odaiAudioFile)} />
          ) : null}
          <EffectAudio
            src={card.reason === "hook" ? effectPath.title : effectPath.titleHeavy}
            durationInFrames={90}
            volume={card.reason === "hook" ? 0.48 : 0.54}
          />
          <TitleBoom text={episode.odai} theme={theme} variant={card.reason} />
        </Sequence>
      ))}

      {/* 締め */}
      <Sequence from={outroFrom} durationInFrames={timeline.outroFrames}>
        <Outro
          text={episode.outro}
          theme={theme}
          audioFile={episode.outroAudioFile}
          variant={episode.outro_style}
          lastImageIndex={episode.answers.length}
          durationInFrames={timeline.outroFrames}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
