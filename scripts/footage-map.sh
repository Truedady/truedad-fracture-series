#!/usr/bin/env bash
# Contact sheets (1 fps) and scene changes of a day's footage, for mapping what is where.
#   scripts/footage-map.sh <NN>  ->  out/map/dayNN/sheet-*.jpg + scenes.txt
set -euo pipefail
cd "$(dirname "$0")/.."
NN=$1; F=public/days/day$NN/footage.mp4; O=out/map/day$NN
mkdir -p "$O/frames"
ffmpeg -v error -y -i "$F" -vf "fps=1,scale=640:-1,drawtext=text='%{eif\:t\:d}':fontcolor=yellow:fontsize=28:x=6:y=6" "$O/frames/f%03d.jpg"
ffmpeg -v error -y -pattern_type glob -i "$O/frames/f*.jpg" -vf "tile=6x5" "$O/sheet-%02d.jpg"
ffmpeg -i "$F" -vf "fps=10,scale=480:-1,select='gt(scene\,0.01)',showinfo" -an -f null - 2>&1 \
  | grep -oE "pts_time:[0-9.]+" | sed 's/pts_time://' | awk '{printf "%.1f\n", $1}' > "$O/scenes.txt"
echo "sheets: $O/sheet-*.jpg   scene changes: $O/scenes.txt"
