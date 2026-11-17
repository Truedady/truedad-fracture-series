// Рендер всех заставок: 4K-мастер (H.264), 1080p-превью и стоп-кадры.
// Использование: node scripts/render-all.mjs [ID композиции ...]
import {execFileSync} from 'node:child_process';
import {mkdirSync, renameSync} from 'node:fs';

const JOBS = {
  'Ch01-FirstTrades': {file: '01_pervye-obmeny_2010-2013', stills: [26, 60, 100]},
  'Ch07-WorstSpring': {file: '07_hudshaya-vesna_2018', stills: [30, 60, 115]},
};

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(JOBS);
for (const d of ['renders/4k', 'renders/1080p', 'renders/stills']) mkdirSync(d, {recursive: true});

// В 4K тяжёлые кадры с размытием на программном GL могут подвисать при 4 параллельных вкладках,
// поэтому мастер рендерится с concurrency=2 и SwiftShader.
const rem = (...args) =>
  execFileSync('npx', ['remotion', ...args, '--timeout=240000', '--log=error'], {stdio: 'inherit'});

// Remotion отдаёт full-range (yuvj420p). Перекодируем в стандартный broadcast-диапазон BT.709,
// чтобы в монтажке и на YouTube не «плыли» уровни чёрного.
const normalize = (file, crf) => {
  const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', tmp], {stdio: 'inherit'});
  renameSync(tmp, file);
};

for (const id of ids) {
  const job = JOBS[id];
  if (!job) throw new Error(`Неизвестная композиция ${id}`);
  console.log(`\n▶ ${id}`);
  // 3840×2160, 30 fps, H.264 High, yuv420p — подходит для любого монтажного ПО и YouTube
  rem('render', 'src/index.ts', id, `renders/4k/${job.file}_2160p30.mp4`, '--scale=2', '--codec=h264', '--crf=14', '--pixel-format=yuv420p', '--jpeg-quality=95', '--concurrency=2', '--gl=swiftshader');
  normalize(`renders/4k/${job.file}_2160p30.mp4`, 14);
  rem('render', 'src/index.ts', id, `renders/1080p/${job.file}_1080p30.mp4`, '--codec=h264', '--crf=18', '--pixel-format=yuv420p', '--jpeg-quality=95', '--concurrency=4');
  normalize(`renders/1080p/${job.file}_1080p30.mp4`, 17);
  job.stills.forEach((fr, i) => {
    const tag = ['a-nachalo', 'b-seredina', 'c-konec'][i];
    rem('still', 'src/index.ts', id, `renders/stills/${job.file}_${tag}_f${fr}.jpg`, `--frame=${fr}`, '--image-format=jpeg', '--jpeg-quality=92');
  });
}
