# Store specs and delivery (checked on the official pages, 2026-10-03)

## Apple App Store screenshots
- iPhone 6.9": 1320x2868 (or 1290x2796), up to 10 per localization; the 6.9" set covers smaller phones.
- iPad 13": 2064x2752 or 2048x2732.
- PNG or JPEG, RGB, no alpha. Order in App Store Connect = upload order (01…06).

## Apple app preview (video)
- 15–30 s, ≤ 500 MB, .mov/.m4v/.mp4; H.264 up to High Profile Level 4.0, 10–12 Mbps, ≤ 30 fps,
  stereo AAC 256 kbps at 44.1/48 kHz; 886x1920 portrait for the 6.9" slot; up to 3 per device size.

## Google Play screenshots
- JPEG or 24-bit PNG, no alpha, each side 320–3840 px, long side ≤ 2x the short side.
- Featuring eligibility: ≥ 4 screenshots, ≥ 1080 px, 16:9 or 9:16 (portrait min 1080x1920).
- Phone: 1080x1920. Tablets (7" and 10"): also 9:16, 1080–7680 px → render 1440x2560 and scale a copy to 1080x1920.
- Feature graphic: 1024x500, JPEG or 24-bit PNG, no alpha; keep the centre clear (Play's play button).
- Preview video: a YouTube watch URL (no playlist, no timecode), public or unlisted, embeddable,
  not age-restricted, monetization off; only the first 30 s autoplay, so 29.5 s cuts are right.

## Delivery layout
```
store-screenshots/
  app-store/<lang>/01_<slug>.png … 06_<slug>.png          1320x2868
  google-play/<lang>/…                                     1080x1920
  google-play-tablet-10/<lang>/…                           1440x2560
  google-play-tablet-7/<lang>/…                            1080x1920 (scaled from the 10" render)
  google-play-feature-graphic/feature-graphic-<lang>.png   1024x500
```
The `<slug>` is a short English name of the panel's idea, the same in every language.

## RGB conversion and checks
```bash
ffmpeg -v error -y -i in.png -pix_fmt rgb24 out.png                       # strip alpha
ffmpeg -v error -y -i in.png -vf "scale=1080:1920:flags=lanczos" -pix_fmt rgb24 out.png   # 7" tablet
sips -g pixelWidth -g pixelHeight -g hasAlpha out.png                      # verify
```
zsh arrays are 1-indexed: a `names=(01_a 02_b …)` list is read with `${names[$i]}` for i=1..6.
Verify every staged file against its render (`ffmpeg -i x -pix_fmt rgb24 -f md5 -`) before
copying into the delivery folder, and diff the file lists first so a naming slip cannot land there.
