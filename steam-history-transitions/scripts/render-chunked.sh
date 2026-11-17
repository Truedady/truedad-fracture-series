#!/usr/bin/env bash
# Надёжный рендер длинной композиции (озвучка): куски по 300 кадров с повтором при зависании,
# затем склейка, нормализация цвета и голос из mp3.
# bash scripts/render-chunked.sh <ID> <audio.mp3> <out.mp4> [scale]
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$1; AUDIO=$2; OUT=$3; SCALE=${4:-1.3333333333333333}
TMP=out/chunks_$ID; rm -rf "$TMP"; mkdir -p "$TMP"
TOTAL=$(npx remotion compositions src/index.ts 2>&1 | awk -v id="$ID" '$1==id {print $4}')
[ -n "$TOTAL" ] || { echo "нет композиции $ID"; exit 1; }
STEP=300; i=0
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  part=$(printf "%s/part%03d.mp4" "$TMP" $i)
  for try in 1 2 3; do
    if npx remotion render src/index.ts "$ID" "$part" --frames=$a-$b --scale=$SCALE --codec=h264 --crf=15 --jpeg-quality=95 \
         --concurrency=2 --gl=swiftshader --muted --timeout=90000 --log=error >/dev/null 2>&1; then break; fi
    echo "кусок $a-$b: попытка $try не удалась"; [ $try -eq 3 ] && exit 1
  done
  echo "file '$(basename "$part")'" >> "$TMP/list.txt"; echo "готово $a-$b"; i=$((i+1))
done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP/list.txt" -i "$AUDIO" -map 0:v -map 1:a \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 15 -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart "$OUT"
rm -rf "$TMP"; echo "OK $OUT"
