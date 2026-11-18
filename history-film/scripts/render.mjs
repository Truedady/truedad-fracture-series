// npm run render:draft — кадры 14–18, 1280×720 @30 → output/draft_14-18.mp4
// npm run render:hq — тот же черновик в 2560×1440 @30 (проверка качества картинки)
// npm run render:final — 2560×1440 @60, только после одобрения: npm run render:final -- --approved
// Дополнительно можно передать --frames=0-90 (кусок для проверки).
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

const mode = process.argv[2];
const extra = process.argv.slice(3);
const WIN = process.platform === 'win32';
mkdirSync('output', {recursive: true});

let args;
if (mode === 'draft') {
  args = ['output/draft_14-18.mp4', '--scale=0.6666666666666666', '--props={"fps":30}', '--crf=20'];
} else if (mode === 'hq') {
  // черновик в полном качестве для проверки картинки: 2560×1440 @30
  args = ['output/draft_14-18_1440p.mp4', '--scale=1.3333333333333333', '--props={"fps":30}', '--crf=16'];
} else if (mode === 'final') {
  if (!extra.includes('--approved')) {
    console.log('\nФинальный рендер 2560×1440 @60 запускается только после одобрения монтажа и при готовой озвучке.');
    console.log('Когда всё утверждено: npm run render:final -- --approved\n');
    process.exit(0);
  }
  args = ['output/final_14-18_2560x1440_60fps.mp4', '--scale=1.3333333333333333', '--props={"fps":60}', '--crf=16'];
} else {
  console.log('Использование: node scripts/render.mjs draft|final');
  process.exit(1);
}
const pass = extra.filter((a) => a !== '--approved');
const cmd = ['remotion', 'render', 'src/index.ts', 'Draft14to18', ...args, '--codec=h264', '--pixel-format=yuv420p', '--concurrency=4', '--timeout=120000', ...pass];
console.log('> npx ' + cmd.join(' '));
// В PowerShell кавычки внутри --props нужно экранировать — передаём аргументы через shell только на Windows
const q = (a) => (WIN && a.includes('"') ? `"${a.replace(/"/g, '\\"')}"` : a);
execFileSync('npx', WIN ? cmd.map(q) : cmd, {stdio: 'inherit', shell: WIN});
console.log('\nГотово: ' + args[0] + '\n');
