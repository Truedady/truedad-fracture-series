// Рендер на вашем компьютере. Всё сразу в 2K (2560×1440).
//   npm run render:scenes                — все главы, кадры 14–78 → output/<глава>_1440p.mp4
//   npm run render:scenes -- Ch06-Pubg   — одна глава
//   npm run render:scenes -- --force     — перерендерить даже готовые главы
//   npm run render:final -- --approved   — 2560×1440 @60 (после утверждения и озвучки)
//
// Готовые главы пропускаются, поэтому после сбоя достаточно запустить команду ещё раз.
// Если глава падает, она сама перезапускается с меньшей нагрузкой (4 → 2 → 1 поток).
// Полный журнал каждой главы: output/logs/<глава>.log
import {spawn} from 'node:child_process';
import {createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync} from 'node:fs';

const mode = process.argv[2];
const extra = process.argv.slice(3);
const WIN = process.platform === 'win32';
mkdirSync('output/logs', {recursive: true});
const CHAPTERS = ['Ch02-Tail', 'Ch03-Regional', 'Ch04-Markets', 'Ch05-SteamGuard', 'Ch06-Pubg', 'Ch07-WorstSpring', 'Ch08-InvestBoom', 'Ch09-Stickers', 'Ch10-CS2', 'Ch11-NewEconomy', 'Final'];

const force = extra.includes('--force');
const flags = extra.filter((a) => a.startsWith('--') && a !== '--approved' && a !== '--force');
const ids = extra.filter((a) => !a.startsWith('--'));
const q = (a) => (WIN && a.includes('"') ? `"${a.replace(/"/g, '\\"')}"` : a);

const run = (args, log) =>
  new Promise((resolve) => {
    const p = spawn(WIN ? 'npx.cmd' : 'npx', WIN ? args.map(q) : args, {shell: WIN, stdio: ['ignore', 'pipe', 'pipe']});
    const out = (d) => {
      process.stdout.write(d);
      log.write(d);
    };
    p.stdout.on('data', out);
    p.stderr.on('data', out);
    p.on('close', (code) => resolve(code ?? 1));
    p.on('error', (e) => {
      out(String(e) + '\n');
      resolve(1);
    });
  });

const render = async (id, out, fps, crf) => {
  if (existsSync(out) && !force) {
    console.log(`\n✔ ${id} уже готов (${out}) — пропускаю. Перерендерить: добавьте --force`);
    return true;
  }
  const part = out.replace(/\.mp4$/, '.part.mp4');
  const logPath = `output/logs/${id}.log`;
  const log = createWriteStream(logPath);
  const tries = [
    {conc: 4, timeout: 120000},
    {conc: 2, timeout: 240000},
    {conc: 1, timeout: 300000},
  ];
  for (const [i, t] of tries.entries()) {
    console.log(`\n▶ ${id}${i ? `  (повтор ${i}: ${t.conc} поток(а), больше времени на кадр)` : ''}`);
    log.write(`\n===== попытка ${i + 1}: concurrency=${t.conc} =====\n`);
    const args = ['remotion', 'render', 'src/index.ts', id, part, '--scale=1.3333333333333333', `--props={"fps":${fps}}`, `--crf=${crf}`, '--codec=h264', '--pixel-format=yuv420p', `--concurrency=${t.conc}`, '--audio-codec=aac', '--audio-bitrate=320k', `--timeout=${t.timeout}`, ...flags];
    const code = await run(args, log);
    if (code === 0 && existsSync(part)) {
      rmSync(out, {force: true});
      renameSync(part, out);
      log.end();
      console.log(`\n✔ Готово: ${out}`);
      return true;
    }
    rmSync(part, {force: true});
  }
  log.end();
  return false;
};

const main = async () => {
  let list, outName, fps, crf;
  if (mode === 'scenes' || mode === 'draft') {
    [list, outName, fps, crf] = [ids.length ? ids : CHAPTERS, (id) => `output/${id}_1440p.mp4`, 30, 16];
  } else if (mode === 'final') {
    if (!extra.includes('--approved')) {
      console.log('\nФинальный рендер 2560×1440 @60 — только после утверждения монтажа и с озвучкой.\nКогда готово: npm run render:final -- --approved\n');
      return;
    }
    [list, outName, fps, crf] = [ids.length ? ids : CHAPTERS, (id) => `output/final_${id}_1440p60.mp4`, 60, 15];
  } else {
    console.log('Использование: node scripts/render.mjs scenes [глава ...] [--force] | final --approved');
    process.exit(1);
  }
  const failed = [];
  for (const id of list) if (!(await render(id, outName(id), fps, crf))) failed.push(id);

  console.log('\n────────────────────────────────────────');
  if (!failed.length) {
    console.log('Все главы готовы — папка output.');
    return;
  }
  console.log(`Не получилось: ${failed.join(', ')}`);
  for (const id of failed) {
    const lines = readFileSync(`output/logs/${id}.log`, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !/^Rendered \d|^Stitched \d|time remaining/.test(l));
    console.log(`\n--- ${id}: последние строки ошибки (весь журнал: output/logs/${id}.log) ---`);
    console.log(lines.slice(-25).join('\n'));
  }
  console.log('\nПришлите скриншот этого блока или файл журнала.');
  process.exit(1);
};
main();
