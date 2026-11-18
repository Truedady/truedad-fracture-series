// npm run doctor — проверка, что компьютер готов к рендеру. Понятные сообщения на русском.
import {execSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';

let bad = 0;
const ok = (m) => console.log('  ✔ ' + m);
const fail = (m, fix) => { bad++; console.log('  ✘ ' + m + (fix ? '\n      → ' + fix : '')); };
const ver = (cmd) => { try { return execSync(cmd, {stdio: ['ignore', 'pipe', 'ignore']}).toString().split('\n')[0].trim(); } catch { return null; } };

console.log('\nTrueDad · проверка окружения\n');
const nodeMajor = Number(process.versions.node.split('.')[0]);
nodeMajor >= 18 ? ok('Node.js ' + process.versions.node) : fail('Node.js ' + process.versions.node + ' — нужна 18 или новее', 'Установите LTS с https://nodejs.org');

const ff = ver('ffmpeg -version');
ff ? ok(ff.slice(0, 60)) : fail('FFmpeg не найден', 'winget install Gyan.FFmpeg, затем закройте и снова откройте терминал');
const fp = ver('ffprobe -version');
fp ? ok('ffprobe найден') : fail('ffprobe не найден', 'ставится вместе с FFmpeg (winget install Gyan.FFmpeg)');

existsSync('node_modules/remotion') ? ok('Пакеты проекта установлены') : fail('Пакеты не установлены', 'выполните: npm ci   (в PowerShell, если ругается на скрипты: npm.cmd ci)');

// все файлы, на которые ссылаются главы
const sc = readFileSync('src/chapters.tsx', 'utf8') + readFileSync('src/graphics.tsx', 'utf8');
const files = [
  ...[...sc.matchAll(/[PI]\('(A[^']+)'/g)].map((m) => `public/sources/${m[1]}.jpg`),
  ...[...sc.matchAll(/K\('([^']+)'\)/g)].map((m) => `public/local/Архив_курса/${m[1]}.png`),
  ...[...sc.matchAll(/skins\/([a-z0-9-]+)\.png/g)].map((m) => `public/skins/${m[1]}.png`),
  ...[...sc.matchAll(/name="([a-z_]+)"/g)].map((m) => `public/sfx/${m[1]}.wav`),
];
const dimsJ = JSON.parse(readFileSync('src/dims.json', 'utf8'));
const noDims = [...sc.matchAll(/[PI]\('([^']+)'/g)].map((m) => m[1]).filter((id) => !dimsJ[id]);
noDims.forEach((id) => fail('Нет размеров для ' + id + ' в src/dims.json'));
const missing = files.filter((f) => !existsSync(f));
missing.length ? missing.forEach((f) => fail('Нет файла ' + f, 'выполните git pull; архивы курса лежат в public/local')) : ok(`Все ${new Set(files).size} материалов на месте`);
['SCENES.json', 'SOURCES.json'].forEach((f) => (existsSync(f) ? ok(f) : fail('Нет ' + f)));

console.log(bad ? `\nНайдено проблем: ${bad}. Исправьте их и запустите npm run doctor ещё раз.\n` : '\nВсё готово. Дальше: npm run render:scenes\n');
process.exit(bad ? 1 : 0);
