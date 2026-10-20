#!/usr/bin/env bash
# Post-process the Remotion master for TikTok / Shorts:
#  - full-range JPEG frames -> limited-range BT.709 yuv420p H.264
#  - linear -1.5 dB master gain (keeps true peak below -1 dBFS; speech untouched otherwise)
#  - faststart, plus 4 review stills in out/stills/
set -euo pipefail
IN=${1:-out/fracture-day01.mp4}
TMP="${IN%.mp4}.tmp.mp4"
ffmpeg -v error -y -i "$IN" \
  -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -af "volume=-1.5dB" -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$TMP"
mv "$TMP" "$IN"
mkdir -p out/stills
for t in 0.0 4.6 16.9 25.4 32.9 42.6; do
  ffmpeg -v error -y -ss "$t" -i "$IN" -frames:v 1 "out/stills/fracture-day01_${t/./s}.png"
done
ffprobe -v error -show_entries format=duration:stream=codec_name,pix_fmt,width,height,r_frame_rate -of compact "$IN"
