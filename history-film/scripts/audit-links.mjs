// npm run audit:links — проверяет все URL из SOURCES.json и пишет link_audit.csv.
// Медиа массово не скачивает: только HTTP-запрос и итоговый адрес.
// Ручные пометки (что реально видно на странице, снято ли в 2×) — docs/link_notes.json.
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';

const raw = JSON.parse(readFileSync('SOURCES.json', 'utf8'));
const sources = Array.isArray(raw) ? raw : raw.sources;
const notes = existsSync('docs/link_notes.json') ? JSON.parse(readFileSync('docs/link_notes.json', 'utf8')) : {};
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const check = async (url) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, {redirect: 'follow', signal: ctl.signal, headers: {'user-agent': UA}});
    return {http: r.status, final: r.url};
  } catch (e) {
    // запасной путь: curl (есть в Windows 10/11, macOS, Linux; уважает системный прокси)
    try {
      const out = execFileSync(process.platform === 'win32' ? 'curl.exe' : 'curl', ['-sS', '-L', '-o', process.platform === 'win32' ? 'NUL' : '/dev/null', '-w', '%{http_code} %{url_effective}', '--max-time', '20', '-A', UA, url], {encoding: 'utf8'});
      const [code, ...rest] = out.trim().split(' ');
      return {http: Number(code) || 'ERR', final: rest.join(' ')};
    } catch {
      return {http: 'ERR', final: '', err: e.name === 'AbortError' ? 'timeout' : String(e.message || e).slice(0, 80)};
    }
  } finally {
    clearTimeout(t);
  }
};
const status = (r) => (r.http === 200 ? 'OK' : r.http === 429 ? 'rate_limited' : r.http === 403 || r.http === 'ERR' ? 'blocked' : 'check');
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;

const rows = [['id', 'title', 'url', 'http', 'final_url', 'status', 'checked_at', 'visible_content_note'].join(',')];
for (const s of sources) {
  const r = await check(s.url);
  const n = notes[s.id] || {};
  const st = n.status || status(r);
  console.log(`${s.id.padEnd(4)} ${String(r.http).padEnd(4)} ${st.padEnd(9)} ${s.url}`);
  rows.push([s.id, s.title, s.url, r.http, r.final, st, new Date().toISOString().slice(0, 10), n.note || r.err || ''].map(esc).join(','));
}
writeFileSync('link_audit.csv', '﻿' + rows.join('\n'));
console.log('\nЗаписано: link_audit.csv');
