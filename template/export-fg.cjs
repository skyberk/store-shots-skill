// Render store-shots/feature-graphic.html to 1024x500 PNGs, one per language.
//
//   node store-shots/export-fg.cjs <out dir> <lang> [<lang> ...]      -> <out dir>/feature-graphic-<lang>.png
const path = require("path");
const fs = require("fs");
const pw = require(require.resolve("playwright-core", { paths: [process.cwd(), __dirname, process.env.PW_PATH].filter(Boolean) }));
const [out, ...langs] = process.argv.slice(2);
if (!out || !langs.length) { console.error("usage: node export-fg.cjs <out dir> <lang>..."); process.exit(2); }
(async () => {
  const browser = await pw.chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
  let failed = false;
  page.on("console", (m) => { if (m.type() === "error") { failed = true; console.log(`  console: ${m.text()}`); } });
  fs.mkdirSync(out, { recursive: true });
  for (const lang of langs) {
    await page.goto("file://" + path.join(__dirname, "feature-graphic.html") + `?lang=${lang}`, { waitUntil: "networkidle" });
    await page.waitForSelector("body[data-ready='1']", { timeout: 20000 });
    const size = await page.evaluate(() => getComputedStyle(document.getElementById("tag")).fontSize);
    await page.screenshot({ path: path.join(out, `feature-graphic-${lang}.png`), clip: { x: 0, y: 0, width: 1024, height: 500 } });
    console.log(`${lang}: tagline ${size}`);
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
