#!/usr/bin/env bash
# Генерирует звук (renders/audio/*.wav) и сводит его с готовыми видео в renders/*_zvuk/.
set -euo pipefail
cd "$(dirname "$0")/../.."
python3 scripts/sound/sfx.py renders/audio
for d in 4k 1080p; do
  mkdir -p "renders/${d}_zvuk"
  for v in renders/$d/*.mp4; do
    b=$(basename "$v" .mp4)
    a="renders/audio/$(echo "$b" | sed -E 's/_(2160|1080)p30//')_sfx.wav"
    [ -f "$a" ] || continue
    ffmpeg -y -loglevel error -i "$v" -i "$a" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 \
      -shortest -movflags +faststart "renders/${d}_zvuk/${b}_zvuk.mp4"
    echo "renders/${d}_zvuk/${b}_zvuk.mp4"
  done
done
