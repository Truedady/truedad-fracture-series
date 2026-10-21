#!/usr/bin/env bash
# Download an episode's source media from the GitHub release `day-NN-assets` into public/assets/dayNN/.
# Usage: bash scripts/fetch-day.sh 02 1021.mp4 1021.1.MP3
set -euo pipefail
DAY=$1; shift
DIR=public/assets/day$DAY
mkdir -p "$DIR"
for f in "$@"; do
  curl -fSL -o "$DIR/$f" "https://github.com/Truedady/truedad-fracture-series/releases/download/day-$DAY-assets/$f"
  ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "$DIR/$f"
done
