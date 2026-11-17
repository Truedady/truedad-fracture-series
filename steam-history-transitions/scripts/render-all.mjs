// Рендер всех заставок: 4K-мастер и 1080p-превью (H.264), стоп-кадры и версии со звуком.
// Использование: node scripts/render-all.mjs [ID композиции ...]
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, renameSync} from 'node:fs';

const JOBS = {
  'Ch01-FirstTrades': {file: '01_pervye-obmeny_2010-2013', stills: [26, 60, 100]},
  'Ch02-CsgoSkins': {file: '02_poyavlenie-csgo_2013', stills: [34, 52, 96]},
  'Ch03-RegionalGames': {file: '03_regionalnye-igry_2011-2017', stills: [30, 48, 96]},
  'Ch04-MarketsBots': {file: '04_markety-ruletki-boty_2013-2017', stills: [30, 80, 120]},
  'Ch05-SteamGuard': {file: '05_steam-guard_2016', stills: [22, 56, 110]},
  'Ch06-Pubg': {file: '06_era-pubg_2017-2018', stills: [40, 58, 96]},
  'Ch07-WorstSpring': {file: '07_hudshaya-vesna_2018', stills: [30, 60, 115]},
  'Ch08-InvestBoom': {file: '08_investicionnyj-bum_2019-2023', stills: [30, 56, 96]},
  'Ch09-Stickers': {file: '09_nakleyki-rmr-stockholm_2021-2022', stills: [40, 62, 96]},
  'Ch10-Cs2Release': {file: '10_vyhod-cs2_2023-2024', stills: [30, 58, 96]},
  'Ch11-NewEconomy': {file: '11_novaya-ekonomika-cs2_2025-2026', stills: [24, 80, 124]},
};

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(JOBS);
for (const d of ['renders/4k', 'renders/1080p', 'renders/stills', 'renders/4k_zvuk', 'renders/1080p_zvuk', 'renders/audio']) mkdirSync(d, {recursive: true});

// В 4K тяжёлые кадры с размытием на программном GL могут подвисать при 4 вкладках,
// поэтому мастер рендерится с concurrency=2 и SwiftShader.
const rem = (...args) => execFileSync('npx', ['remotion', ...args, '--timeout=240000', '--log=error'], {stdio: 'inherit'});
const ff = (...args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], {stdio: 'inherit'});

// Remotion отдаёт full-range (yuvj420p). Перекодируем в стандартный диапазон BT.709,
// чтобы в монтажке и на YouTube не «плыли» уровни чёрного.
const normalize = (file, crf) => {
  const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
  ff('-i', file, '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', tmp);
  renameSync(tmp, file);
};
const mux = (video, audio, out) => ff('-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out);

// звук для всех глав (быстро, синтез)
execFileSync('python3', ['scripts/sound/sfx.py', 'renders/audio'], {stdio: 'inherit'});

for (const id of ids) {
  const job = JOBS[id];
  if (!job) throw new Error(`Неизвестная композиция ${id}`);
  console.log(`\n▶ ${id}`);
  const v4 = `renders/4k/${job.file}_2160p30.mp4`;
  const v1 = `renders/1080p/${job.file}_1080p30.mp4`;
  const wav = `renders/audio/${job.file}_sfx.wav`;
  rem('render', 'src/index.ts', id, v4, '--scale=2', '--codec=h264', '--crf=14', '--pixel-format=yuv420p', '--jpeg-quality=95', '--concurrency=2', '--gl=swiftshader');
  normalize(v4, 14);
  rem('render', 'src/index.ts', id, v1, '--codec=h264', '--crf=18', '--pixel-format=yuv420p', '--jpeg-quality=95', '--concurrency=4');
  normalize(v1, 17);
  job.stills.forEach((fr, i) => {
    const tag = ['a-nachalo', 'b-seredina', 'c-konec'][i];
    rem('still', 'src/index.ts', id, `renders/stills/${job.file}_${tag}_f${fr}.jpg`, `--frame=${fr}`, '--image-format=jpeg', '--jpeg-quality=92');
  });
  if (existsSync(wav)) {
    mux(v4, wav, `renders/4k_zvuk/${job.file}_2160p30_zvuk.mp4`);
    mux(v1, wav, `renders/1080p_zvuk/${job.file}_1080p30_zvuk.mp4`);
  }
}
