// Надёжный рендер длинной озвучки на любом компьютере (Windows/Mac/Linux):
// куски по 10 секунд, зависший кусок перезапускается, потом склейка и голос.
// node scripts/render-narration.mjs Narr02-CsgoSkins narr02 renders/narration/02_poyavlenie-csgo_ozvuchka_1440p30.mp4
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const [id, audioName, out, scale = String(4 / 3)] = process.argv.slice(2);
if (!id || !audioName || !out) {
  console.log('Использование: node scripts/render-narration.mjs <ID> <имя аудио без .mp3> <выходной.mp4>');
  process.exit(1);
}
const WIN = process.platform === 'win32';
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, {shell: WIN, ...opts});

const list = run('npx', ['remotion', 'compositions', 'src/index.ts'], {encoding: 'utf8'});
const line = list.split('\n').find((l) => l.trim().startsWith(id + ' '));
if (!line) throw new Error('Нет композиции ' + id);
const total = Number(line.trim().split(/\s+/)[3]);
const tmp = path.join('out', 'chunks_' + id);
rmSync(tmp, {recursive: true, force: true});
mkdirSync(tmp, {recursive: true});
mkdirSync(path.dirname(out), {recursive: true});

const STEP = 300;
const parts = [];
for (let a = 0, i = 0; a < total; a += STEP, i++) {
  const b = Math.min(total - 1, a + STEP - 1);
  const part = path.join(tmp, `part${String(i).padStart(3, '0')}.mp4`);
  for (let tr = 1; ; tr++) {
    try {
      run('npx', ['remotion', 'render', 'src/index.ts', id, part, `--frames=${a}-${b}`, `--scale=${scale}`, '--codec=h264', '--crf=15',
        '--jpeg-quality=95', '--concurrency=4', '--muted', '--timeout=120000', '--log=error'], {stdio: 'inherit'});
      break;
    } catch (e) {
      if (tr >= 3) throw e;
      console.log(`Кусок ${a}-${b}: попытка ${tr} не удалась, повторяю...`);
    }
  }
  parts.push(`file '${path.basename(part)}'`);
  console.log(`✔ готово ${b + 1}/${total} кадров`);
}
writeFileSync(path.join(tmp, 'list.txt'), parts.join('\n'));
const audio = path.join('public', 'audio', audioName + '.mp3');
if (!existsSync(audio)) throw new Error('Нет аудио ' + audio);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-i', audio,
  '-map', '0:v', '-map', '1:a', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15',
  '-profile:v', 'high', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out], {stdio: 'inherit'});
rmSync(tmp, {recursive: true, force: true});
console.log('ГОТОВО: ' + out);
