// Product settings for index.html and feature-graphic.html. Copy to config.js and fill in.
// Paths are relative to this folder. {platform} {lang} {file} and {mood} are filled in by the page.
window.STORE_CONFIG = {
  app: "App Name",
  icon: "../public/app-icon.png",
  // raw app screenshots, one folder per platform and language
  shots: "../../<app>-promo/screenshots/{platform}/{lang}/{file}.png",
  platforms: { ios: "ios", android: "android", tablet: "android-tablet" },
  // one screen per panel, in store order (file names without .png); null = the closing panel
  // (icon or mascot, no phone)
  screens: ["01_home", "02_create", "03_detail", "04_list", "05_settings", null],
  // the feature graphic's two phones (Android screens): back and front
  featureScreens: { back: "03_detail", front: "01_home" },
  // languages whose captions wrap per character/phrase (smaller headline, keep-all + break hints)
  cjk: ["ja", "ko"],
  // the line through all six panels, ending in a ring on the last one
  thread: true,
  // Mascot per panel and layout, or null (the closing panel then shows the app icon).
  // file: an SVG per mood, {mood} filled from each entry. at: "lane" sits on the line right of
  // centre (x = centre as a fraction of the panel width), "caption" beside a bottom caption,
  // "ring" is the closing panel inside the line's ring. s = size as a fraction of the panel width.
  mascot: null,
  // mascot: {
  //   file: "mascot/{mood}.svg",
  //   tilt: [{ mood: "thinking", at: "lane", x: 0.76, s: 0.29 }, null, { mood: "listening", at: "caption", s: 0.29 },
  //          null, { mood: "happy", at: "caption", s: 0.29 }, { mood: "calm", at: "ring", s: 0.38 }],
  //   upright: [{ mood: "thinking", at: "lane", x: 0.78, s: 0.25 }, null, { mood: "listening", at: "lane", x: 0.78, s: 0.25 },
  //             null, { mood: "happy", at: "lane", x: 0.78, s: 0.25 }, { mood: "calm", at: "ring", s: 0.38 }],
  // },
  // background: one tint per panel (left to right) and soft radial blobs
  // [x in panels, y in panel heights, diameter in panel widths, colour, opacity]
  tint: ["#FFE9D9", "#FBE2DA", "#FCEFD6", "#E8F1E8", "#E4EDF4", "#FBF3E8"],
  blob: [
    [0.10, 0.10, 0.70, "#F6C7B0", .55], [0.95, 0.62, 0.62, "#F3B9A9", .45], [1.55, 0.05, 0.55, "#F7D9A2", .55],
    [2.05, 0.78, 0.75, "#F5D39A", .45], [2.92, 0.22, 0.62, "#CFE4D2", .70], [3.55, 0.88, 0.70, "#C6DECB", .55],
    [4.05, 0.12, 0.62, "#C9DDEC", .65], [4.70, 0.70, 0.66, "#D3E2EF", .55], [5.35, 0.18, 0.60, "#F8DCC6", .55],
    [5.85, 0.92, 0.55, "#F6D3C1", .45],
  ],
};
