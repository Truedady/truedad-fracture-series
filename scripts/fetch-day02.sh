#!/usr/bin/env bash
# Download the day-2 sources from the GitHub release and prepare the 4K/30 fps working copy used by Remotion.
set -euo pipefail
cd "$(dirname "$0")/.."
A=public/news/fracture-day-02
TMP=$(mktemp -d)
curl -sSL -o "$TMP/1021.mp4" https://github.com/Truedady/truedad-fracture-series/releases/download/day-02-assets/1021.mp4
mkdir -p "$A"
ffmpeg -v error -y -i "$TMP/1021.mp4" -an -vf fps=30 -c:v libx264 -preset medium -crf 12 -g 30 -pix_fmt yuv420p "$A/footage-4k30.mp4"
rm -rf "$TMP"
