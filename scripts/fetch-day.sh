#!/usr/bin/env bash
# Fetch one day's sources and prepare them for Remotion.
#   scripts/fetch-day.sh <NN> <video-url> <voice-url>
# Video -> public/days/dayNN/footage.mp4 (same resolution, 30 fps, CRF 12, keyframe every second for fast seeking).
# Voice -> public/days/dayNN/voiceover.mp3 (byte-for-byte, never re-encoded).
set -euo pipefail
cd "$(dirname "$0")/.."
NN=$1; VIDEO=$2; VOICE=$3
D=public/days/day$NN
TMP=$(mktemp -d)
mkdir -p "$D"
curl -sSL -o "$TMP/video" "$VIDEO"
curl -sSL -o "$D/voiceover.mp3" "$VOICE"
ffmpeg -v error -y -i "$TMP/video" -an -vf fps=30 -c:v libx264 -preset medium -crf 12 -g 30 -pix_fmt yuv420p "$D/footage.mp4"
rm -rf "$TMP"
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$D/footage.mp4" "$D/voiceover.mp3"
