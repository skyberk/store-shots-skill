# store-shots

A [Claude Code](https://claude.com/claude-code) skill that makes App Store and Google Play
screenshot sets, plus the Play feature graphic, by hand: one HTML page draws all six
screenshots of a device side by side on a single strip, so a background wash and a
decorative line run from one screenshot into the next, and a small Node script cuts the
strip into store-sized PNGs. No editor, no framework; it opens from disk and exports with
`playwright-core` + Chrome.

The look it produces: phones tilted a few degrees and easing to upright across the set, each
one inside its own screenshot and cropped only by the bottom edge; captions in a display
serif with the accent words in italic and a sans subline; one flat line that starts as a loose
knot under the first caption, opens out, and winds into a ring around the closing mark (the
app icon, or a mascot in a matching mood if the product has one); fine print on the last.

## Install

```bash
git clone git@github.com:skyberk/store-shots-skill.git ~/.claude/skills/store-shots
```

Then, in Claude Code, `/store-shots` (or just ask for store screenshots).

Requirements for exporting: Google Chrome, Node with `playwright-core` (`npm i --no-save
playwright-core` next to the page, or `PW_PATH=<dir with node_modules>`), and `ffmpeg` for
review sheets and the RGB conversion.

## How the skill works

1. You give it the raw app screenshots per platform and language, the app icon, optional
   mascot SVGs, and the copy (the app's own words).
2. It writes the six English captions, renders the iPhone set, shows it, and waits for your
   approval before touching any other language or platform.
3. Then it renders every language for App Store, Play phone and Play tablet, plus the feature
   graphic, makes review sheets with black bars at the cuts, and has a reviewer check every
   image for anything clipped or overlapping.
4. It converts to RGB, names the files in store order and delivers them per
   [`reference/specs.md`](reference/specs.md).

Rules it keeps: nothing but the line may cross a cut; flat line art, no 3D shading; captions
complete and legible; only real app screens with sample data, no paywall.

## Files

```
SKILL.md                     the skill: workflow and rules
template/index.html          the strip page (query: lang, device=ios|android|tablet, layout=tilt|upright, fit=1)
template/config.example.js   product settings: app, icon, shots path, screens per panel, mascot, tints, blobs
template/copy.example.js     captions: window.STORE_COPY[lang] = [{h, s?, f?}] x 6
template/export.cjs          [LAYOUT=tilt] node export.cjs <out> ios|android|tablet <lang>...
template/feature-graphic.html + export-fg.cjs   Play feature graphic 1024x500
template/sheets.sh           contact sheets with black bars at the cuts
template/review-prompt.md    the brief for the reviewing agent
reference/specs.md           store specs (checked 2026-10-03), delivery layout, RGB conversion
```

## Using the template on its own

```bash
cp -R template/ <your design repo>/store-shots
cd <your design repo>/store-shots
cp config.example.js config.js && cp copy.example.js copy.js   # fill both in
LAYOUT=tilt node export.cjs ../out ios en                        # English first
LAYOUT=tilt node export.cjs ../out ios en de fr                  # then every language
LAYOUT=tilt node export.cjs ../out android en de fr
LAYOUT=tilt node export.cjs ../out tablet en de fr
node export-fg.cjs ../out/fg en de fr
bash sheets.sh ../out ../sheets en de fr
```

Fonts and the ink/accent colours are the `:root` tokens in `index.html` and
`feature-graphic.html`; the Google Fonts link is in each head.

## Licence

MIT, see [LICENSE](LICENSE).
