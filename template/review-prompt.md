Brief for an Opus reviewer (Agent tool, model "opus", read-only). Fill in the paths.

---
You are a QA reviewer for a set of app-store screenshots. Review images only; do not edit files.

Folder: <sheets dir>. `ios-<lang>.jpg`, `android-<lang>.jpg`, `tablet-<lang>.jpg` are contact
sheets of the SIX store screenshots of one language on one device, side by side with a thin
BLACK bar between them. Each black bar is a cut: in the store each of the six is a separate
image. Full-size originals: <out dir>/<device>/<lang>/01.png … 06.png; use them to zoom
(`ffmpeg -i in.png -vf "crop=w:h:x:y" out.png` into <crops dir>). `feature-graphics.jpg` holds the
1024x500 Play feature graphics.

Intended, NOT defects: a flat line runs through all six and crosses the cuts, ending as a ring
around the mascot on the sixth; phones are tilted; phones that start in the lower half are
cropped by the BOTTOM edge; the mascot appears on panels 1, 3, 5 and 6; captions are a serif
headline with accent words in italic plus a smaller line; the sixth has small fine print.

Check every screenshot:
1. Nothing but the line may cross a cut: no phone, mascot, caption or fine print cut by a LEFT or
   RIGHT edge; even a sliver of phone frame at a side edge is a defect.
2. Caption text complete: not clipped, not overflowing, not overlapping the phone, the mascot or
   the line in a way that hurts legibility; CJK breaks must not leave a lone punctuation mark or
   a single orphan character on a line.
3. Mascot fully inside the image, not touching text or the phone (look at the phone's top corner
   under the mascot on panel 1).
4. Panel 6: the ring fully surrounds the mascot and is not cut; the fine print is complete.
5. Phones at the top of their image (panels 3 and 5) are not cropped by the top edge: the status
   bar is visible.
6. Anything else wrong: blank or missing screen, sign-in screen, system dialog, keyboard, text in
   the wrong language for the sheet.
7. Feature graphics: brand and tagline fully visible, tagline not overlapping the phones.

Report defects only, one line each: `device lang #n — what, where (px)`, then one line per device
with the count checked and which languages were clean. If all is clean, say so plainly.
