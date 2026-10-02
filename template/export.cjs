// Render store-shots/index.html headlessly and cut the strip into its six screenshots.
//
//   [LAYOUT=tilt] node store-shots/export.cjs <out dir> <device> <lang> [<lang> ...]
//     device: ios | android | tablet
//     writes <out dir>/<device>/<lang>/0N.png at the panel size (RGB is done by the caller)
//
// Needs playwright-core (npm i --no-save playwright-core, or PW_PATH=<dir with node_modules>)
// and Google Chrome.
const path = require("path");
const fs = require("fs");
const pw = require(require.resolve("playwright-core", { paths: [process.cwd(), __dirname, process.env.PW_PATH].filter(Boolean) }));

const SIZE = { ios: [1320, 2868], android: [1080, 1920], tablet: [1440, 2560] };
const [out, device, ...langs] = process.argv.slice(2);
if (!out || !SIZE[device] || !langs.length) {
  console.error("usage: node export.cjs <out dir> ios|android|tablet <lang>...");
  process.exit(2);
}
const [W, H] = SIZE[device];

(async () => {
  const browser = await pw.chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: W * 6, height: H }, deviceScaleFactor: 1 });
  let failed = false;
  page.on("console", (m) => { if (m.type() === "error") failed = true; if (m.type() === "error" || m.type() === "warning") console.log(`  console: ${m.text()}`); });
  for (const lang of langs) {
    const url = "file://" + path.join(__dirname, "index.html") + `?lang=${lang}&device=${device}&layout=${process.env.LAYOUT || "upright"}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("body[data-ready='1']", { timeout: 30000 });
    const dir = path.join(out, device, lang);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < 6; i++) {
      await page.screenshot({ path: path.join(dir, `0${i + 1}.png`), clip: { x: i * W, y: 0, width: W, height: H } });
    }
    console.log(`${device} ${lang}: 6 x ${W}x${H}`);
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
