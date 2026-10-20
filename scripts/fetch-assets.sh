#!/usr/bin/env bash
# Restore the source media into public/assets/ from the project kit ZIP (kept out of git to avoid duplicating binaries).
set -euo pipefail
ZIP=${1:-TrueDad_Fracture_Remotion_Kit.zip}
TMP=$(mktemp -d)
unzip -q "$ZIP" 'truedad-fracture-series/public/assets/*' -d "$TMP"
mkdir -p public/assets
cp -rn "$TMP/truedad-fracture-series/public/assets/." public/assets/
rm -rf "$TMP"
ls -R public/assets | head -20
