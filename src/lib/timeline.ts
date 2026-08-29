import { Episode, Timeline, TimelineItem, TitleCardItem } from "./types";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const s = (sec: number) => Math.round(sec * FPS);

/** お題提示フック区間の基本尺(秒)。お題ナレーションがあればそれに合わせる */
const HOOK_BASE = 1.6;
/** 締め区間の基本尺(秒) */
const OUTRO_BASE = 2.4;
/** 回答間の基本ギャップ(秒) */
const GAP_BASE = 0.14;
/** 加速時の最小ギャップ(秒) */
const GAP_MIN = 0.1;
/** ピーク直前の「タメ」(秒) */
const PEAK_HOLD = 0.35;
/** ダジャレ・滑りSE後の「チーン」待ち(秒) */
const SLIP_HOLD = 0.55;
/** 読後ツッコミSE後の短い止め(秒) */
const TSUKKOMI_HOLD = 0.32;
/** お題を中央にドーンと出す尺(秒) */
const TITLE_CARD_SEC = 1.25;

/**
 * 回答配列 → フレーム割当。
 * - 各回答 duration(音声解決後) を秒→フレーム
 * - 後半ほど回答間ギャップを線形に短縮(畳みかけ)
 * - peak 直前に固定タメを挿入
 * - tendon_group に出現順インデックスを付与
 */
export function buildTimeline(ep: Episode): Timeline {
  const answers = ep.answers;
  const n = answers.length;
  const titleAfter = new Set(ep.title_after ?? ["a10", "a13"]);
  const overlayFirstImage = ep.hook_style === "overlay_first_image";

  const hookFrames = s(
    ep.odaiAudioFile ? Math.max(HOOK_BASE, ep.odaiDuration ?? 0) : HOOK_BASE
  );
  // 注: 音声解決時は measure 側で duration を上書き済み。フックは固定でも可。

  const tendonCounter: Record<string, number> = {};
  const items: TimelineItem[] = [];
  const titleCards: TitleCardItem[] = overlayFirstImage
    ? []
    : [
        {
          from: 0,
          durationInFrames: hookFrames,
          reason: "hook",
        },
      ];
  const titleCardFrames = s(
    Math.max(TITLE_CARD_SEC, ep.odaiDuration ?? 0)
  );

  let cursor = hookFrames;
  for (let i = 0; i < n; i++) {
    const a = answers[i];

    let tendonIndex: number | undefined;
    if (a.tendon_group) {
      tendonCounter[a.tendon_group] = (tendonCounter[a.tendon_group] ?? 0) + 1;
      tendonIndex = tendonCounter[a.tendon_group];
    }

    // 画像ボケ用: 画像だけを先に見せて「?」の間を作る
    if (a.visual_pre_roll) {
      cursor += s(a.visual_pre_roll);
    }

    // ピーク直前のタメ(無音・静止)
    if (a.peak) {
      cursor += s(PEAK_HOLD);
    }

    const durationInFrames = Math.max(1, s(a.duration));
    items.push({
      answer: a,
      index: i,
      tendonIndex,
      from: cursor,
      durationInFrames,
    });

    cursor += durationInFrames;

    // ダジャレなどの滑りSEは読み終わってから鳴らし、少しリズムを止める。
    if (a.se === "weak" || a.se === "cricket") {
      cursor += s(SLIP_HOLD);
    } else if (a.se === "tsukkomi") {
      cursor += s(TSUKKOMI_HOLD);
    }

    if (titleAfter.has(a.id)) {
      titleCards.push({
        from: cursor,
        durationInFrames: titleCardFrames,
        reason: "recap",
      });
      cursor += titleCardFrames;
    }

    // 次の回答までのギャップ(後半ほど詰める)
    if (i < n - 1) {
      const progress = i / Math.max(1, n - 1);
      const gapSec = GAP_BASE - (GAP_BASE - GAP_MIN) * progress;
      cursor += s(Math.max(GAP_MIN, gapSec));
    }
  }

  const outroFrames = s(Math.max(OUTRO_BASE, ep.outroDuration ?? 0));
  cursor += outroFrames;

  const totalFrames = cursor;

  // 尺チェック (警告のみ)
  const totalSec = totalFrames / FPS;
  if (totalSec > 60) {
    console.warn(
      `[timeline] 合計尺が ${totalSec.toFixed(
        1
      )}s で60sを超過。durationの圧縮か回答削減を検討してください。`
    );
  } else if (totalSec < 45) {
    console.warn(
      `[timeline] 合計尺が ${totalSec.toFixed(
        1
      )}s で45s未満。回答追加で厚みを足すことを検討してください。`
    );
  }

  return { fps: FPS, hookFrames, titleCards, items, outroFrames, totalFrames };
}
