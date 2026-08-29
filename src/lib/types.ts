export type Tag =
  | "normal"
  | "aruaru"
  | "suberi"
  | "recovery"
  | "tendon"
  | "peak";

export type SeName =
  | "pop"
  | "weak"
  | "cricket"
  | "tsukkomi"
  | "callback"
  | "drumroll_don"
  | "don";

export interface Answer {
  id: string;
  text: string;
  /** なぞかけ等で、オチを伏せて先に見せる前振り */
  setup_text?: string;
  /** 前振りの後にカードを切り替えて見せるオチ */
  punch_text?: string;
  /** 回答尺に対してオチを表示する位置。既定は 0.56 */
  punch_reveal_ratio?: number;
  /** 読み上げ用テキスト。表示は text のまま、音声生成だけこちらを優先 */
  reading?: string;
  tag: Tag;
  /** 表示秒数。音声があれば解決後に上書きされる */
  duration: number;
  /** 画像だけを先に見せてからフリップ/音声を始める秒数 */
  visual_pre_roll?: number;
  se?: SeName;
  peak?: boolean;
  setup_id?: string;
  callback_ref?: string;
  tendon_group?: string;
  /** measure-audio が解決した public 配下の音声パス (例: "voice/ep001/a1.wav") */
  audioFile?: string;
  /** VOICEVOXのシーン別スタイルID */
  speakerId?: number;
  voiceSpeed?: number;
  voicePitch?: number;
  voiceIntonation?: number;
}

export interface Background {
  /** auto=コード生成アニメ背景 / image=静止画 / video=ループ動画 */
  type?: "auto" | "image" | "video";
  /** public 配下のパス (例: "bg/city.jpg" / "bg/loop.mp4")。type=image/video で使用 */
  src?: string;
  /** 背景を暗くする量 0〜1 (テロップ可読性確保。既定 0.35) */
  dim?: number;
}

export interface Episode {
  id: string;
  odai: string;
  /** お題の読み上げ用テキスト */
  odai_reading?: string;
  odaiSpeakerId?: number;
  odaiVoiceSpeed?: number;
  odaiVoicePitch?: number;
  odaiVoiceIntonation?: number;
  theme?: string;
  bgm?: string;
  /** opening_title=従来の全面タイトル / overlay_first_image=1枚目を0秒から見せる */
  hook_style?: "opening_title" | "overlay_first_image";
  /** 冒頭画像に重ねる短い予告。最終回答で必ず回収する */
  hook_teaser?: string;
  /** overlay_first_image の冒頭で大きく叩きつける特報見出し */
  hook_headline?: string;
  /** standalone=従来の全面CTA / image_loop=最終画像上CTAから冒頭画像へ戻す */
  outro_style?: "standalone" | "image_loop";
  voice_dir?: string;
  /** 回答IDの直後にお題タイトルカードを挿入する。未指定時は a10/a13 */
  title_after?: string[];
  background?: Background;
  answers: Answer[];
  outro?: string;
  /** 締めの読み上げ用テキスト */
  outro_reading?: string;
  outroSpeakerId?: number;
  outroVoiceSpeed?: number;
  outroVoicePitch?: number;
  outroVoiceIntonation?: number;
  /** measure-audio が解決した public 配下のお題ナレーション */
  odaiAudioFile?: string;
  /** measure-audio が解決したお題区間の秒数 */
  odaiDuration?: number;
  /** measure-audio が解決した public 配下の締めナレーション */
  outroAudioFile?: string;
  /** measure-audio が解決した締め区間の秒数 */
  outroDuration?: number;
}

/** タイムライン上の1回答の配置 */
export interface TimelineItem {
  answer: Answer;
  index: number;
  /** 同 tendon_group 内の出現順 (1,2,3...) */
  tendonIndex?: number;
  from: number;
  durationInFrames: number;
}

export interface TitleCardItem {
  from: number;
  durationInFrames: number;
  reason: "hook" | "recap";
}

export interface Timeline {
  fps: number;
  hookFrames: number;
  titleCards: TitleCardItem[];
  items: TimelineItem[];
  outroFrames: number;
  totalFrames: number;
}
