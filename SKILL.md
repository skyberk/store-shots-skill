---
name: store-shots
description: Make App Store and Google Play screenshot sets (plus the Play feature graphic) by hand as one HTML strip, no editor, for any app. Use when asked for store screenshots, market/listing images, captioned screenshots in many languages, tilted-phone screenshot sets, or to regenerate them after app strings or screens change. Triggers on store screenshots, app store images, play store images, market images, feature graphic, screenshot set, localized screenshots.
---

# Store screenshots as one strip

One `index.html` draws all six screenshots of a device side by side on a single canvas, so a
background wash and a decorative line can run from one screenshot into the next; a small
Node script renders the strip headlessly and cuts out the six store-sized PNGs. Everything is
deterministic, opens from disk, and needs only `playwright-core` + Chrome to export.

The template is product-neutral. A product gives it three things: `config.js` (icon, where
the raw screenshots are, which five screens, optional mascot, palette), `copy.js` (the six
captions per language) and, in `index.html`'s `<style>`, its fonts and ink/accent colours.

The look the template produces: phones tilted a few degrees (easing to upright across the
set), each phone inside its own screenshot and cropped only by the bottom edge; captions in
a display serif with the accent words in italic, a sans subline; one flat line that starts as
a loose knot under the first caption, opens out, and winds into a ring around the closing
mark (the app icon, or a mascot if the product has one); fine print on the closing panel.

## Workflow (do it in this order)

1. **Inputs.** Raw app screenshots per platform and language (iOS 1320x2868 for the 6.9"
   slot; Android phone and tablet captures), the app icon, optional mascot SVGs, the copy, and
   the app's glossary (the words it uses on screen). Store screenshots are advertisements: one
   idea per panel, five screens + a closing panel.
2. **Brief first, then English on one platform, then wait.** Write the six captions for English
   (headline with `*accent*` words, optional subline, fine print on the last), render the
   iPhone set, show it (a contact sheet, and an Artifact page if the user is on a phone), and
   **stop until they approve**. Nothing for other languages or platforms before that.
3. **Then all languages and platforms.** Captions in every language use the app's own glossary
   (the tab names, feature names), not a fresh translation. Japanese/Korean headlines get break
   hints: U+200B where a break is allowed, U+00A0 inside a phrase that must stay together.
4. **Export, review, deliver.** Render, make contact sheets with black bars at the cuts, have an
   Opus reviewer go over every image with `template/review-prompt.md`, fix what it finds,
   convert to RGB (no alpha), name in store order, copy into the delivery folder, and record the
   source in the project's README/CLAUDE.md.

## Hard rules

- **Nothing but the line may cross a cut.** No phone, mascot or text may touch a left or right
  image edge. Phones may be cropped only by the bottom edge. The template enforces this for
  phones (a tilted phone shrinks until its visible part fits the panel width) and places the
  lane mascot against the phone's real tilted top edge, not its bounding box.
- **Flat line art.** The line is one flat stroke: no shading, no lit edge, no drop shadow, no
  segments (shaded segments leave visible smudges where they overlap). Few loops of different
  sizes, never a dense scribble of identical circles.
- **A mascot, if the product has one, is in a mood that matches each caption** and replaces the
  app icon on the closing panel (the store shows the icon above the screenshots anyway).
- **Captions complete and legible**: ≤ 3 headline lines, fine print ≥ 34 px, no overlap with
  phones or mascot. The page logs `console.error` when copy does not fit; the exporter exits 1.
- **Only real app screens, sample data, no paywall.** Screens are the app's own captures in that
  language; a caption is never laid over another language's UI.
- Tilted phones (a UI8-template look) are liked; phones running across cuts were not, because
  the cut goes through screen text.

## Files

```
template/index.html          the strip page (query: lang, device=ios|android|tablet, layout=tilt|upright, fit=1)
template/config.example.js   product settings: app, icon, shots path, screens per panel, mascot, tints, blobs
template/copy.example.js     captions: window.STORE_COPY[lang] = [{h, s?, f?}] x 6
template/export.cjs          [LAYOUT=tilt] node export.cjs <out> ios|android|tablet <lang>... -> <out>/<device>/<lang>/0N.png
template/feature-graphic.html + export-fg.cjs   Play feature graphic 1024x500, tagline = panel 1 headline
template/sheets.sh           contact sheets with black bars at the cuts, for review
template/review-prompt.md    the brief for the Opus reviewer
reference/specs.md           store specs checked on 2026-10-03, delivery naming, RGB conversion
```

## Setting it up for a product

1. Copy `template/` into the product's design repo as `store-shots/`.
2. `cp config.example.js config.js` and fill it in: `shots` path pattern, `platforms`, `screens`
   (five files + `null`), `icon`, `featureScreens`, `mascot` (`null` without one; with one, a
   folder of SVGs named by mood and the per-panel moods), `tint`/`blob` palette from the brand.
   Fonts and ink/accent colours are the `:root` tokens in `index.html` and
   `feature-graphic.html`; the Google Fonts link is in each head. Keep the per-device `SPEC`
   and `TILT` tables unless the canvas sizes change.
3. `cp copy.example.js copy.js`, write English, render, show, wait. Then the rest.
4. `npm i --no-save playwright-core` next to the page (or `PW_PATH=<dir with node_modules>`), Chrome at
   `/Applications/Google Chrome.app`.

```bash
cd <design repo>
LAYOUT=tilt PW_PATH=$PW node store-shots/export.cjs out ios en            # English first
LAYOUT=tilt PW_PATH=$PW node store-shots/export.cjs out ios en de es fr    # then every language
LAYOUT=tilt PW_PATH=$PW node store-shots/export.cjs out android en de es fr
LAYOUT=tilt PW_PATH=$PW node store-shots/export.cjs out tablet en de es fr
PW_PATH=$PW node store-shots/export-fg.cjs out/fg en de es fr
bash store-shots/sheets.sh out sheets en de es fr                          # review sheets
```

Deliver per `reference/specs.md`: RGB PNG, names `01_<slug>.png … 06_<slug>.png` per language,
tablet 7" = the 10" render scaled to 1080x1920. Archive the previous set before replacing it, and
keep every language in step (a change goes to all languages or is listed in the README).

## Reviewing

Look at the sheets yourself first (headline breaks, the mascot's place, anything cut), then run
the Opus reviewer with `review-prompt.md` over all sheets; it reports defects only. Re-render the
affected languages, re-check, then deliver. Report what was skipped.
