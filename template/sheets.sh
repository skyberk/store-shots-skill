#!/bin/bash
# Contact sheets for review: the six screenshots of each device/language side by side with a
# black bar at every cut, plus a grid of the feature graphics if out/fg exists.
#
#   bash sheets.sh <out dir from export.cjs> <sheets dir> [lang ...]
set -euo pipefail
OUT=$1; SHEETS=$2; shift 2
LANGS=${*:-"en"}
mkdir -p "$SHEETS"
for d in ios android tablet; do
  [ -d "$OUT/$d" ] || continue
  for l in $LANGS; do
    [ -f "$OUT/$d/$l/06.png" ] || continue
    ffmpeg -v error -y -i "$OUT/$d/$l/01.png" -i "$OUT/$d/$l/02.png" -i "$OUT/$d/$l/03.png" \
      -i "$OUT/$d/$l/04.png" -i "$OUT/$d/$l/05.png" -i "$OUT/$d/$l/06.png" \
      -filter_complex "[0]pad=iw+30:ih:15:0:color=black[a];[1]pad=iw+30:ih:15:0:color=black[b];[2]pad=iw+30:ih:15:0:color=black[c];[3]pad=iw+30:ih:15:0:color=black[d];[4]pad=iw+30:ih:15:0:color=black[e];[5]pad=iw+30:ih:15:0:color=black[f];[a][b][c][d][e][f]hstack=6,scale=3600:-2" \
      "$SHEETS/$d-$l.jpg"
    echo "$d $l"
  done
done
if [ -d "$OUT/fg" ]; then
  inputs=(); for l in $LANGS; do [ -f "$OUT/fg/feature-graphic-$l.png" ] && inputs+=(-i "$OUT/fg/feature-graphic-$l.png"); done
  n=${#inputs[@]}; n=$((n / 2))
  if [ "$n" -eq 1 ]; then
    ffmpeg -v error -y "${inputs[@]}" "$SHEETS/feature-graphics.jpg"
    echo "feature graphics: 1"
  elif [ "$n" -gt 1 ]; then
    filter=""; for ((i = 0; i < n; i++)); do filter+="[$i]"; done
    ffmpeg -v error -y "${inputs[@]}" -filter_complex "${filter}vstack=inputs=$n" "$SHEETS/feature-graphics.jpg"
    echo "feature graphics: $n"
  fi
fi
