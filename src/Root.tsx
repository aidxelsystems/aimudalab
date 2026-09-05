import React from "react";
import { Composition } from "remotion";
import { OgiriShort } from "./OgiriShort";
import { buildTimeline, FPS, WIDTH, HEIGHT } from "./lib/timeline";
import { Episode } from "./lib/types";
import storyData from "../story.json";
import resolvedData from "../data/episodes/ep001.resolved.json";
import aiLieAnimalsData from "../data/episodes/ai-lie-animals-01.resolved.json";
import animalWhyPlatypusData from "../data/episodes/animal-why-platypus-01.resolved.json";
import animalWhyStarNosedMoleData from "../data/episodes/animal-why-star-nosed-mole-01.resolved.json";
import animalWhySeaOtterData from "../data/episodes/animal-why-sea-otter-01.resolved.json";
import aiXrayPenguinData from "../data/episodes/ai-xray-penguin-01.resolved.json";
import zeriFryData from "../data/episodes/ai-bgrade-zeri-fry-01.resolved.json";
import saladBreadData from "../data/episodes/ai-bgrade-salad-bread-01.resolved.json";
import tamagoFuwafuwaData from "../data/episodes/ai-bgrade-tamago-fuwafuwa-01.resolved.json";
import uzumemeshiData from "../data/episodes/ai-bgrade-uzumemeshi-01.resolved.json";
import hangoroshiData from "../data/episodes/ai-bgrade-hangoroshi-01.resolved.json";
import jigokudakiData from "../data/episodes/ai-bgrade-jigokudaki-01.resolved.json";
import teppouJiruData from "../data/episodes/ai-bgrade-teppou-jiru-01.resolved.json";
import hubbleData from "../data/episodes/ai-history-hubble-01.resolved.json";
import viralColaData from "../data/episodes/ai-viral-cola-geyser-01.resolved.json";
import supercooledWaterData from "../data/episodes/ai-viral-supercooled-water-01.resolved.json";
import ferrofluidData from "../data/episodes/ai-viral-ferrofluid-01.resolved.json";
import princeRupertData from "../data/episodes/ai-viral-prince-rupert-01.resolved.json";
import galliumSpoonData from "../data/episodes/ai-viral-gallium-spoon-01.resolved.json";
import magicSandData from "../data/episodes/ai-viral-magic-sand-01.resolved.json";
import aerogelData from "../data/episodes/ai-viral-aerogel-01.resolved.json";
import laserCleaningData from "../data/episodes/ai-viral-laser-cleaning-01.resolved.json";
import oobleckData from "../data/episodes/ai-viral-oobleck-01.resolved.json";
import {
  AiLieQuizShort,
  getAiLieQuizTimeline,
  QUIZ_FPS,
  QUIZ_HEIGHT,
  QUIZ_WIDTH,
} from "./AiLieQuizShort";
import {
  AnimalWhyQuizShort,
  ANIMAL_WHY_FPS,
  ANIMAL_WHY_HEIGHT,
  ANIMAL_WHY_WIDTH,
  getAnimalWhyTimeline,
} from "./AnimalWhyQuizShort";
import {
  getMoleTimeline,
  MOLE_FPS,
  MOLE_HEIGHT,
  MOLE_WIDTH,
  StarNosedMoleWhyShort,
} from "./StarNosedMoleWhyShort";
import {
  getOtterTimeline,
  OTTER_FPS,
  OTTER_HEIGHT,
  OTTER_WIDTH,
  SeaOtterWhyShort,
} from "./SeaOtterWhyShort";
import {
  getPenguinXrayTimeline,
  PENGUIN_XRAY_FPS,
  PENGUIN_XRAY_HEIGHT,
  PENGUIN_XRAY_WIDTH,
  PenguinXrayShort,
} from "./PenguinXrayShort";
import {
  getZeriTimeline,
  ZERI_FPS,
  ZERI_HEIGHT,
  ZERI_WIDTH,
  ZeriFryShort,
} from "./ZeriFryShort";
import {
  getSaladBreadTimeline,
  SALAD_BREAD_FPS,
  SALAD_BREAD_HEIGHT,
  SALAD_BREAD_WIDTH,
  SaladBreadShort,
} from "./SaladBreadShort";
import {
  getTamagoFuwafuwaTimeline,
  TAMAGO_FUWAFUWA_FPS,
  TAMAGO_FUWAFUWA_HEIGHT,
  TAMAGO_FUWAFUWA_WIDTH,
  TamagoFuwafuwaShort,
} from "./TamagoFuwafuwaShort";
import {
  getUzumemeshiTimeline,
  UZUMEMESHI_FPS,
  UZUMEMESHI_HEIGHT,
  UZUMEMESHI_WIDTH,
  UzumemeshiShort,
} from "./UzumemeshiShort";
import {
  getHangoroshiTimeline,
  HANGOROSHI_FPS,
  HANGOROSHI_HEIGHT,
  HANGOROSHI_WIDTH,
  HangoroshiShort,
} from "./HangoroshiShort";
import {
  getJigokudakiTimeline,
  JIGOKUDAKI_FPS,
  JIGOKUDAKI_HEIGHT,
  JIGOKUDAKI_WIDTH,
  JigokudakiShort,
} from "./JigokudakiShort";
import {
  getTeppouJiruTimeline,
  TEPPOU_JIRU_FPS,
  TEPPOU_JIRU_HEIGHT,
  TEPPOU_JIRU_WIDTH,
  TeppouJiruShort,
} from "./TeppouJiruShort";
import {
  getHubbleTimeline,
  HUBBLE_FPS,
  HUBBLE_HEIGHT,
  HUBBLE_WIDTH,
  HubbleShort,
} from "./HubbleShort";
import {
  getViralColaTimeline,
  VIRAL_COLA_FPS,
  VIRAL_COLA_HEIGHT,
  VIRAL_COLA_WIDTH,
  ViralColaShort,
} from "./ViralColaShort";
import {
  getSupercooledWaterTimeline,
  SUPERCOOLED_WATER_FPS,
  SUPERCOOLED_WATER_HEIGHT,
  SUPERCOOLED_WATER_WIDTH,
  SupercooledWaterAudioFix,
  SupercooledWaterShort,
} from "./SupercooledWaterShort";
import {
  FerrofluidShort,
  FERROFLUID_FPS,
  FERROFLUID_HEIGHT,
  FERROFLUID_WIDTH,
  getFerrofluidTimeline,
} from "./FerrofluidShort";
import {
  getPrinceRupertTimeline,
  PRINCE_RUPERT_FPS,
  PRINCE_RUPERT_HEIGHT,
  PRINCE_RUPERT_WIDTH,
  PrinceRupertShort,
} from "./PrinceRupertShort";
import {
  GalliumSpoonShort,
  GALLIUM_SPOON_FPS,
  GALLIUM_SPOON_HEIGHT,
  GALLIUM_SPOON_WIDTH,
  getGalliumSpoonTimeline,
} from "./GalliumSpoonShort";
import {
  MAGIC_SAND_FPS,
  MAGIC_SAND_HEIGHT,
  MAGIC_SAND_WIDTH,
  MagicSandShort,
  getMagicSandTimeline,
} from "./MagicSandShort";
import {
  AEROGEL_FPS,
  AEROGEL_HEIGHT,
  AEROGEL_WIDTH,
  AerogelShort,
  getAerogelTimeline,
} from "./AerogelShort";
import {
  LASER_CLEANING_FPS,
  LASER_CLEANING_HEIGHT,
  LASER_CLEANING_WIDTH,
  LaserCleaningShort,
  getLaserCleaningTimeline,
} from "./LaserCleaningShort";
import {
  OOBLECK_FPS,
  OOBLECK_HEIGHT,
  OOBLECK_WIDTH,
  OobleckShort,
  getOobleckTimeline,
} from "./OobleckShort";
import {
  MOTION_COMIC_HOOK_DURATION,
  MOTION_COMIC_HOOK_FPS,
  MOTION_COMIC_HOOK_HEIGHT,
  MOTION_COMIC_HOOK_WIDTH,
  MotionComicHookPrototype,
} from "./MotionComicHookPrototype";

const storyEpisode = storyData as unknown as Episode;
const resolvedEpisode = (resolvedData as unknown as { episode: Episode }).episode;
const aiLieAnimalsEpisode = (
  aiLieAnimalsData as unknown as { episode: Episode }
).episode;
const animalWhyPlatypusEpisode = (
  animalWhyPlatypusData as unknown as { episode: Episode }
).episode;
const animalWhyStarNosedMoleEpisode = (
  animalWhyStarNosedMoleData as unknown as { episode: Episode }
).episode;
const animalWhySeaOtterEpisode = (
  animalWhySeaOtterData as unknown as {episode: Episode}
).episode;
const aiXrayPenguinEpisode = (
  aiXrayPenguinData as unknown as {episode: Episode}
).episode;
const zeriFryEpisode = (
  zeriFryData as unknown as {episode: Episode}
).episode;
const saladBreadEpisode = (
  saladBreadData as unknown as {episode: Episode}
).episode;
const tamagoFuwafuwaEpisode = (
  tamagoFuwafuwaData as unknown as {episode: Episode}
).episode;
const uzumemeshiEpisode = (
  uzumemeshiData as unknown as {episode: Episode}
).episode;
const hangoroshiEpisode = (
  hangoroshiData as unknown as {episode: Episode}
).episode;
const jigokudakiEpisode = (
  jigokudakiData as unknown as {episode: Episode}
).episode;
const teppouJiruEpisode = (
  teppouJiruData as unknown as {episode: Episode}
).episode;
const hubbleEpisode = (
  hubbleData as unknown as {episode: Episode}
).episode;
const viralColaEpisode = (
  viralColaData as unknown as {episode: Episode}
).episode;
const supercooledWaterEpisode = (
  supercooledWaterData as unknown as {episode: Episode}
).episode;
const ferrofluidEpisode = (
  ferrofluidData as unknown as {episode: Episode}
).episode;
const princeRupertEpisode = (
  princeRupertData as unknown as {episode: Episode}
).episode;
const galliumSpoonEpisode = (
  galliumSpoonData as unknown as {episode: Episode}
).episode;
const magicSandEpisode = (
  magicSandData as unknown as {episode: Episode}
).episode;
const aerogelEpisode = (
  aerogelData as unknown as {episode: Episode}
).episode;
const laserCleaningEpisode = (
  laserCleaningData as unknown as {episode: Episode}
).episode;
const oobleckEpisode = (
  oobleckData as unknown as {episode: Episode}
).episode;

const resolvedAnswers = new Map(
  resolvedEpisode.answers.map((answer) => [answer.id, answer])
);

const defaultEpisode: Episode = {
  ...resolvedEpisode,
  ...storyEpisode,
  answers: storyEpisode.answers.map((answer) => {
    const resolved = resolvedAnswers.get(answer.id);
    return {
      ...answer,
      duration: resolved?.duration ?? answer.duration,
      audioFile: resolved?.audioFile,
    };
  }),
  odaiAudioFile: resolvedEpisode.odaiAudioFile,
  odaiDuration: resolvedEpisode.odaiDuration,
  outroAudioFile: resolvedEpisode.outroAudioFile,
  outroDuration: resolvedEpisode.outroDuration,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OgiriShort"
        component={OgiriShort}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={Math.round(58 * FPS)}
        defaultProps={{ episode: defaultEpisode }}
        calculateMetadata={({ props }) => {
          const ep = (props as { episode: Episode }).episode;
          const timeline = buildTimeline(ep);
          return {
            durationInFrames: timeline.totalFrames,
            fps: FPS,
            width: WIDTH,
            height: HEIGHT,
          };
        }}
      />
      <Composition
        id="AiLieQuizShort"
        component={AiLieQuizShort}
        width={QUIZ_WIDTH}
        height={QUIZ_HEIGHT}
        fps={QUIZ_FPS}
        durationInFrames={getAiLieQuizTimeline(aiLieAnimalsEpisode).totalFrames}
        defaultProps={{ episode: aiLieAnimalsEpisode }}
        calculateMetadata={({ props }) => {
          const ep = (props as { episode: Episode }).episode;
          return {
            durationInFrames: getAiLieQuizTimeline(ep).totalFrames,
            fps: QUIZ_FPS,
            width: QUIZ_WIDTH,
            height: QUIZ_HEIGHT,
          };
        }}
      />
      <Composition
        id="AnimalWhyQuizShort"
        component={AnimalWhyQuizShort}
        width={ANIMAL_WHY_WIDTH}
        height={ANIMAL_WHY_HEIGHT}
        fps={ANIMAL_WHY_FPS}
        durationInFrames={getAnimalWhyTimeline(animalWhyPlatypusEpisode).totalFrames}
        defaultProps={{ episode: animalWhyPlatypusEpisode }}
        calculateMetadata={({ props }) => {
          const ep = (props as { episode: Episode }).episode;
          return {
            durationInFrames: getAnimalWhyTimeline(ep).totalFrames,
            fps: ANIMAL_WHY_FPS,
            width: ANIMAL_WHY_WIDTH,
            height: ANIMAL_WHY_HEIGHT,
          };
        }}
      />
      <Composition
        id="StarNosedMoleWhyShort"
        component={StarNosedMoleWhyShort}
        width={MOLE_WIDTH}
        height={MOLE_HEIGHT}
        fps={MOLE_FPS}
        durationInFrames={getMoleTimeline(animalWhyStarNosedMoleEpisode).totalFrames}
        defaultProps={{ episode: animalWhyStarNosedMoleEpisode }}
        calculateMetadata={({ props }) => {
          const ep = (props as { episode: Episode }).episode;
          return {
            durationInFrames: getMoleTimeline(ep).totalFrames,
            fps: MOLE_FPS,
            width: MOLE_WIDTH,
            height: MOLE_HEIGHT,
          };
        }}
      />
      <Composition
        id="SeaOtterWhyShort"
        component={SeaOtterWhyShort}
        width={OTTER_WIDTH}
        height={OTTER_HEIGHT}
        fps={OTTER_FPS}
        durationInFrames={getOtterTimeline(animalWhySeaOtterEpisode).totalFrames}
        defaultProps={{episode: animalWhySeaOtterEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getOtterTimeline(ep).totalFrames,
            fps: OTTER_FPS,
            width: OTTER_WIDTH,
            height: OTTER_HEIGHT,
          };
        }}
      />
      <Composition
        id="PenguinXrayShort"
        component={PenguinXrayShort}
        width={PENGUIN_XRAY_WIDTH}
        height={PENGUIN_XRAY_HEIGHT}
        fps={PENGUIN_XRAY_FPS}
        durationInFrames={getPenguinXrayTimeline(aiXrayPenguinEpisode).totalFrames}
        defaultProps={{episode: aiXrayPenguinEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getPenguinXrayTimeline(ep).totalFrames,
            fps: PENGUIN_XRAY_FPS,
            width: PENGUIN_XRAY_WIDTH,
            height: PENGUIN_XRAY_HEIGHT,
          };
        }}
      />
      <Composition
        id="ZeriFryShort"
        component={ZeriFryShort}
        width={ZERI_WIDTH}
        height={ZERI_HEIGHT}
        fps={ZERI_FPS}
        durationInFrames={getZeriTimeline(zeriFryEpisode).totalFrames}
        defaultProps={{episode: zeriFryEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getZeriTimeline(ep).totalFrames,
            fps: ZERI_FPS,
            width: ZERI_WIDTH,
            height: ZERI_HEIGHT,
          };
        }}
      />
      <Composition
        id="SaladBreadShort"
        component={SaladBreadShort}
        width={SALAD_BREAD_WIDTH}
        height={SALAD_BREAD_HEIGHT}
        fps={SALAD_BREAD_FPS}
        durationInFrames={getSaladBreadTimeline(saladBreadEpisode).totalFrames}
        defaultProps={{episode: saladBreadEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getSaladBreadTimeline(ep).totalFrames,
            fps: SALAD_BREAD_FPS,
            width: SALAD_BREAD_WIDTH,
            height: SALAD_BREAD_HEIGHT,
          };
        }}
      />
      <Composition
        id="TamagoFuwafuwaShort"
        component={TamagoFuwafuwaShort}
        width={TAMAGO_FUWAFUWA_WIDTH}
        height={TAMAGO_FUWAFUWA_HEIGHT}
        fps={TAMAGO_FUWAFUWA_FPS}
        durationInFrames={getTamagoFuwafuwaTimeline(tamagoFuwafuwaEpisode).totalFrames}
        defaultProps={{episode: tamagoFuwafuwaEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getTamagoFuwafuwaTimeline(ep).totalFrames,
            fps: TAMAGO_FUWAFUWA_FPS,
            width: TAMAGO_FUWAFUWA_WIDTH,
            height: TAMAGO_FUWAFUWA_HEIGHT,
          };
        }}
      />
      <Composition
        id="UzumemeshiShort"
        component={UzumemeshiShort}
        width={UZUMEMESHI_WIDTH}
        height={UZUMEMESHI_HEIGHT}
        fps={UZUMEMESHI_FPS}
        durationInFrames={getUzumemeshiTimeline(uzumemeshiEpisode).totalFrames}
        defaultProps={{episode: uzumemeshiEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getUzumemeshiTimeline(ep).totalFrames,
            fps: UZUMEMESHI_FPS,
            width: UZUMEMESHI_WIDTH,
            height: UZUMEMESHI_HEIGHT,
          };
        }}
      />
      <Composition
        id="HangoroshiShort"
        component={HangoroshiShort}
        width={HANGOROSHI_WIDTH}
        height={HANGOROSHI_HEIGHT}
        fps={HANGOROSHI_FPS}
        durationInFrames={getHangoroshiTimeline(hangoroshiEpisode).totalFrames}
        defaultProps={{episode: hangoroshiEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getHangoroshiTimeline(ep).totalFrames,
            fps: HANGOROSHI_FPS,
            width: HANGOROSHI_WIDTH,
            height: HANGOROSHI_HEIGHT,
          };
        }}
      />
      <Composition
        id="JigokudakiShort"
        component={JigokudakiShort}
        width={JIGOKUDAKI_WIDTH}
        height={JIGOKUDAKI_HEIGHT}
        fps={JIGOKUDAKI_FPS}
        durationInFrames={getJigokudakiTimeline(jigokudakiEpisode).totalFrames}
        defaultProps={{episode: jigokudakiEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getJigokudakiTimeline(ep).totalFrames,
            fps: JIGOKUDAKI_FPS,
            width: JIGOKUDAKI_WIDTH,
            height: JIGOKUDAKI_HEIGHT,
          };
        }}
      />
      <Composition
        id="TeppouJiruShort"
        component={TeppouJiruShort}
        width={TEPPOU_JIRU_WIDTH}
        height={TEPPOU_JIRU_HEIGHT}
        fps={TEPPOU_JIRU_FPS}
        durationInFrames={getTeppouJiruTimeline(teppouJiruEpisode).totalFrames}
        defaultProps={{episode: teppouJiruEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getTeppouJiruTimeline(ep).totalFrames,
            fps: TEPPOU_JIRU_FPS,
            width: TEPPOU_JIRU_WIDTH,
            height: TEPPOU_JIRU_HEIGHT,
          };
        }}
      />
      <Composition
        id="HubbleShort"
        component={HubbleShort}
        width={HUBBLE_WIDTH}
        height={HUBBLE_HEIGHT}
        fps={HUBBLE_FPS}
        durationInFrames={getHubbleTimeline(hubbleEpisode).totalFrames}
        defaultProps={{episode: hubbleEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getHubbleTimeline(ep).totalFrames,
            fps: HUBBLE_FPS,
            width: HUBBLE_WIDTH,
            height: HUBBLE_HEIGHT,
          };
        }}
      />
      <Composition
        id="ViralColaShort"
        component={ViralColaShort}
        width={VIRAL_COLA_WIDTH}
        height={VIRAL_COLA_HEIGHT}
        fps={VIRAL_COLA_FPS}
        durationInFrames={getViralColaTimeline(viralColaEpisode).totalFrames}
        defaultProps={{episode: viralColaEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getViralColaTimeline(ep).totalFrames,
            fps: VIRAL_COLA_FPS,
            width: VIRAL_COLA_WIDTH,
            height: VIRAL_COLA_HEIGHT,
          };
        }}
      />
      <Composition
        id="SupercooledWaterShort"
        component={SupercooledWaterShort}
        width={SUPERCOOLED_WATER_WIDTH}
        height={SUPERCOOLED_WATER_HEIGHT}
        fps={SUPERCOOLED_WATER_FPS}
        durationInFrames={getSupercooledWaterTimeline(supercooledWaterEpisode).totalFrames}
        defaultProps={{episode: supercooledWaterEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getSupercooledWaterTimeline(ep).totalFrames,
            fps: SUPERCOOLED_WATER_FPS,
            width: SUPERCOOLED_WATER_WIDTH,
            height: SUPERCOOLED_WATER_HEIGHT,
          };
        }}
      />
      <Composition
        id="SupercooledWaterAudioFix"
        component={SupercooledWaterAudioFix}
        width={16}
        height={16}
        fps={SUPERCOOLED_WATER_FPS}
        durationInFrames={getSupercooledWaterTimeline(supercooledWaterEpisode).totalFrames}
        defaultProps={{episode: supercooledWaterEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getSupercooledWaterTimeline(ep).totalFrames,
            fps: SUPERCOOLED_WATER_FPS,
            width: 16,
            height: 16,
          };
        }}
      />
      <Composition
        id="FerrofluidShort"
        component={FerrofluidShort}
        width={FERROFLUID_WIDTH}
        height={FERROFLUID_HEIGHT}
        fps={FERROFLUID_FPS}
        durationInFrames={getFerrofluidTimeline(ferrofluidEpisode).totalFrames}
        defaultProps={{episode: ferrofluidEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getFerrofluidTimeline(ep).totalFrames,
            fps: FERROFLUID_FPS,
            width: FERROFLUID_WIDTH,
            height: FERROFLUID_HEIGHT,
          };
        }}
      />
      <Composition
        id="PrinceRupertShort"
        component={PrinceRupertShort}
        width={PRINCE_RUPERT_WIDTH}
        height={PRINCE_RUPERT_HEIGHT}
        fps={PRINCE_RUPERT_FPS}
        durationInFrames={getPrinceRupertTimeline(princeRupertEpisode).totalFrames}
        defaultProps={{episode: princeRupertEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getPrinceRupertTimeline(ep).totalFrames,
            fps: PRINCE_RUPERT_FPS,
            width: PRINCE_RUPERT_WIDTH,
            height: PRINCE_RUPERT_HEIGHT,
          };
        }}
      />
      <Composition
        id="GalliumSpoonShort"
        component={GalliumSpoonShort}
        width={GALLIUM_SPOON_WIDTH}
        height={GALLIUM_SPOON_HEIGHT}
        fps={GALLIUM_SPOON_FPS}
        durationInFrames={getGalliumSpoonTimeline(galliumSpoonEpisode).totalFrames}
        defaultProps={{episode: galliumSpoonEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getGalliumSpoonTimeline(ep).totalFrames,
            fps: GALLIUM_SPOON_FPS,
            width: GALLIUM_SPOON_WIDTH,
            height: GALLIUM_SPOON_HEIGHT,
          };
        }}
      />
      <Composition
        id="MagicSandShort"
        component={MagicSandShort}
        width={MAGIC_SAND_WIDTH}
        height={MAGIC_SAND_HEIGHT}
        fps={MAGIC_SAND_FPS}
        durationInFrames={getMagicSandTimeline(magicSandEpisode).totalFrames}
        defaultProps={{episode: magicSandEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getMagicSandTimeline(ep).totalFrames,
            fps: MAGIC_SAND_FPS,
            width: MAGIC_SAND_WIDTH,
            height: MAGIC_SAND_HEIGHT,
          };
        }}
      />
      <Composition
        id="AerogelShort"
        component={AerogelShort}
        width={AEROGEL_WIDTH}
        height={AEROGEL_HEIGHT}
        fps={AEROGEL_FPS}
        durationInFrames={getAerogelTimeline(aerogelEpisode).totalFrames}
        defaultProps={{episode: aerogelEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getAerogelTimeline(ep).totalFrames,
            fps: AEROGEL_FPS,
            width: AEROGEL_WIDTH,
            height: AEROGEL_HEIGHT,
          };
        }}
      />
      <Composition
        id="LaserCleaningShort"
        component={LaserCleaningShort}
        width={LASER_CLEANING_WIDTH}
        height={LASER_CLEANING_HEIGHT}
        fps={LASER_CLEANING_FPS}
        durationInFrames={getLaserCleaningTimeline(laserCleaningEpisode).totalFrames}
        defaultProps={{episode: laserCleaningEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getLaserCleaningTimeline(ep).totalFrames,
            fps: LASER_CLEANING_FPS,
            width: LASER_CLEANING_WIDTH,
            height: LASER_CLEANING_HEIGHT,
          };
        }}
      />
      <Composition
        id="OobleckShort"
        component={OobleckShort}
        width={OOBLECK_WIDTH}
        height={OOBLECK_HEIGHT}
        fps={OOBLECK_FPS}
        durationInFrames={getOobleckTimeline(oobleckEpisode).totalFrames}
        defaultProps={{episode: oobleckEpisode}}
        calculateMetadata={({props}) => {
          const ep = (props as {episode: Episode}).episode;
          return {
            durationInFrames: getOobleckTimeline(ep).totalFrames,
            fps: OOBLECK_FPS,
            width: OOBLECK_WIDTH,
            height: OOBLECK_HEIGHT,
          };
        }}
      />
      <Composition
        id="MotionComicHookPrototype"
        component={MotionComicHookPrototype}
        width={MOTION_COMIC_HOOK_WIDTH}
        height={MOTION_COMIC_HOOK_HEIGHT}
        fps={MOTION_COMIC_HOOK_FPS}
        durationInFrames={MOTION_COMIC_HOOK_DURATION}
      />
    </>
  );
};
