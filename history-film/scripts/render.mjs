// Рендер на вашем компьютере. Всё сразу в 2K (2560×1440).
//   npm run render:scenes                — все главы, кадры 14–78 → output/<глава>_1440p.mp4
//   npm run render:scenes -- Ch06-Pubg   — одна глава
//   npm run render:final -- --approved   — 2560×1440 @60 (после утверждения и озвучки)
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

const mode = process.argv[2];
const extra = process.argv.slice(3);
const WIN = process.platform === 'win32';
mkdirSync('output', {recursive: true});
const CHAPTERS = ['Ch02-Tail', 'Ch03-Regional', 'Ch04-Markets', 'Ch05-SteamGuard', 'Ch06-Pubg', 'Ch07-WorstSpring', 'Ch08-InvestBoom', 'Ch09-Stickers', 'Ch10-CS2', 'Ch11-NewEconomy', 'Final'];

const q = (a) => (WIN && a.includes('"') ? `"${a.replace(/"/g, '\\"')}"` : a);
const render = (id, out, fps, crf, pass) => {
  const cmd = ['remotion', 'render', 'src/index.ts', id, out, '--scale=1.3333333333333333', `--props={"fps":${fps}}`, `--crf=${crf}`, '--codec=h264', '--pixel-format=yuv420p', '--concurrency=4', '--audio-codec=aac', '--audio-bitrate=320k', '--timeout=120000', ...pass];
  console.log('\n▶ ' + id);
  execFileSync('npx', WIN ? cmd.map(q) : cmd, {stdio: 'inherit', shell: WIN});
  console.log('Готово: ' + out);
};

const flags = extra.filter((a) => a.startsWith('--') && a !== '--approved');
const ids = extra.filter((a) => !a.startsWith('--'));

if (mode === 'scenes' || mode === 'draft') {
  for (const id of ids.length ? ids : CHAPTERS) render(id, `output/${id}_1440p.mp4`, 30, 16, flags);
} else if (mode === 'final') {
  if (!extra.includes('--approved')) {
    console.log('\nФинальный рендер 2560×1440 @60 — только после утверждения монтажа и с озвучкой.\nКогда готово: npm run render:final -- --approved\n');
    process.exit(0);
  }
  for (const id of ids.length ? ids : CHAPTERS) render(id, `output/final_${id}_1440p60.mp4`, 60, 15, flags);
} else {
  console.log('Использование: node scripts/render.mjs draft | scenes [глава ...] | final --approved');
  process.exit(1);
}
