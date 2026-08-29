export interface Theme {
  bg: string;
  bgAccent: string;
  odaiBar: string;
  odaiText: string;
  answerText: string;
  answerStroke: string;
  accent: string;
  peakText: string;
  counter: string;
}

export const themes: Record<string, Theme> = {
  default: {
    bg: "#101225",
    bgAccent: "#1b1f3a",
    odaiBar: "rgba(0,0,0,0.55)",
    odaiText: "#ffffff",
    answerText: "#ffffff",
    answerStroke: "#000000",
    accent: "#ffd23f",
    peakText: "#ffd23f",
    counter: "rgba(255,255,255,0.75)",
  },
  gameshow: {
    bg: "#13072e",
    bgAccent: "#2a0f55",
    odaiBar: "rgba(255,210,63,0.92)",
    odaiText: "#13072e",
    answerText: "#ffffff",
    answerStroke: "#3a006d",
    accent: "#ff3d7f",
    peakText: "#ffe14d",
    counter: "rgba(255,255,255,0.8)",
  },
  night: {
    bg: "#0a0a0f",
    bgAccent: "#15151f",
    odaiBar: "rgba(255,255,255,0.1)",
    odaiText: "#e8e8ff",
    answerText: "#ffffff",
    answerStroke: "#000000",
    accent: "#6cf0ff",
    peakText: "#6cf0ff",
    counter: "rgba(255,255,255,0.6)",
  },
};

export const getTheme = (name?: string): Theme =>
  themes[name ?? "default"] ?? themes.default;
