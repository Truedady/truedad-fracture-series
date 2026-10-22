// Render a set of review stills from one bundle: node scripts/stills.mjs <compositionId> <outDir> <frame,frame,...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, outDir, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const [i, frame] of frames.entries()) {
  const output = path.join(outDir, `${String(i + 1).padStart(2, '0')}_${(frame / composition.fps).toFixed(1)}s.jpg`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  console.log(output);
}
