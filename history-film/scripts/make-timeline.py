"""Строит shot_timeline.json из src/chapters.tsx и src/narration.json: сцена → текст → планы с таймингом."""
import json, re

n = json.load(open('src/narration.json', encoding='utf-8'))
s = open('src/chapters.tsx', encoding='utf-8').read()
out = []
chap = None
tc = 0.0
for line in s.splitlines():
    m = re.search(r"id: '([^']+)'", line)
    if m:
        chap = m.group(1); tc = 0.0; continue
    m = re.search(r"\{n: (\d+), plans: \[(.*)\]\},", line)
    if not m:
        continue
    k, body = m.group(1), m.group(2)
    plans = []; d = 0; i = 0
    while i < len(body):
        if d == 0 and body[i:i + 2] in ('P(', 'I(', 'L(', 'G('):
            j = i + 2; dd = 1
            while dd:
                dd += {'(': 1, ')': -1}.get(body[j], 0); j += 1
            seg = body[i:j]
            w = re.findall(r"\bw: ([\d.]+)", seg)
            kind = {'P': 'страница', 'I': 'изображение', 'L': 'изображение', 'G': 'анимированная графика'}[body[i]]
            if body[i] == 'G':
                g = re.search(r"<(\w+)|G\((\w+)", seg); name = g.group(1) or g.group(2)
                t = re.search(r'title="([^"]+)"|name="([^"]+)"', seg)
                if t: name += ' — ' + (t.group(1) or t.group(2))
            elif body[i] == 'L':
                name = re.search(r"K\('([^']+)'\)", seg).group(1) if "K('" in seg else 'Steam Winter Sale 2013 (75%)'
            else:
                name = re.search(r"['\"]([^'\"]+)['\"]", seg).group(1)
            mv = re.search(r"'(push|pull|scroll|panR|panL|tilt|drift|hold)'", seg)
            plans.append({'type': kind, 'asset': name, 'camera': mv.group(1) if mv else None, 'w': float(w[-1]) if w else 1.0})
            i = j; continue
        i += 1
    sec = n[k]['sec']; W = sum(p['w'] for p in plans); t = tc
    for p in plans:
        p['sec'] = round(sec * p['w'] / W, 2); p['start'] = round(t, 2); t += sec * p['w'] / W; del p['w']
    out.append({'scene': int(k), 'chapter': chap, 'start_in_chapter': round(tc, 2), 'sec': round(sec, 2), 'text': n[k]['text'], 'plans': plans})
    tc += sec
total = sum(x['sec'] for x in out)
json.dump({'note': 'Тайминг по тексту сценария (≈14,5 знака/с). После записи голоса поменяйте секунды в src/narration.json и запустите python scripts/make-timeline.py.',
           'total_min': round(total / 60, 1), 'scenes': out}, open('shot_timeline.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'сцен,', sum(len(x['plans']) for x in out), 'планов,', round(total / 60, 1), 'мин')
