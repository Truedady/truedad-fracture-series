#!/usr/bin/env bash
# Быстрая проверка: рендер в половинном разрешении и контактный лист кадров.
# bash scripts/sheet.sh <ID> "<кадры через пробел>"
set -e
cd "$(dirname "$0")/.."
id=$1; frames=$2; out=out/check; mkdir -p $out
npx remotion render src/index.ts "$id" "$out/$id.mp4" --scale=0.5 --concurrency=4 --log=error >/dev/null 2>&1
sel=$(for f in $frames; do printf "eq(n\\\\,%s)+" $f; done); sel=${sel%+}
cnt=$(echo $frames | wc -w); rows=$(( (cnt + 2) / 3 ))
ffmpeg -y -loglevel error -i "$out/$id.mp4" -vf "select='$sel',tile=3x$rows" -frames:v 1 "$out/$id.png"
echo "$out/$id.png"
