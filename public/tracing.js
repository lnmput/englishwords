/* ---------- 字母骨架（单位坐标：顶线 y=0，中线 y=40，基线 y=100，下伸线 y=140） ---------- */
function arc(cx, cy, r, a0, a1, move) {
  const step = a1 > a0 ? 5 : -5, pts = [];
  for (let a = a0; step > 0 ? a <= a1 : a >= a1; a += step) pts.push(a);
  if (pts[pts.length - 1] !== a1) pts.push(a1);
  return pts.map((a, i) => {
    const x = cx + r * Math.cos(a * Math.PI / 180), y = cy - r * Math.sin(a * Math.PI / 180);
    return (i === 0 && move ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  }).join(' ');
}
const A = (cx, cy, r, a0, a1) => arc(cx, cy, r, a0, a1, true);
const C = (cx, cy, r, a0, a1) => arc(cx, cy, r, a0, a1, false);
const DOT = (x, y) => ({ dot: [x, y] });

const LETTERS = {
  a: { w: 70, s: [A(34,70,30,40,340), 'M64 40 L64 100'] },
  b: { w: 70, s: ['M6 0 L6 100', A(36,70,30,170,-170)] },
  c: { w: 64, s: [A(34,70,30,45,315)] },
  d: { w: 70, s: [A(34,70,30,40,340), 'M64 0 L64 100'] },
  e: { w: 70, s: ['M6 70 L64 70 ' + C(35,70,29,0,320)] },
  f: { w: 54, s: [A(44,18,16,20,180) + ' L28 100', 'M10 40 L50 40'] },
  g: { w: 70, s: [A(34,70,30,40,340), 'M64 40 L64 118 ' + C(42,118,22,0,-160)] },
  h: { w: 66, s: ['M6 0 L6 100', A(32,66,26,180,0) + ' L58 100'] },
  i: { w: 24, s: ['M12 40 L12 100', DOT(12,18)] },
  j: { w: 44, s: ['M34 40 L34 120 ' + C(18,120,16,0,-180), DOT(34,18)] },
  k: { w: 62, s: ['M6 0 L6 100', 'M54 40 L8 74 L56 100'] },
  l: { w: 24, s: ['M12 0 L12 100'] },
  m: { w: 94, s: ['M6 40 L6 100', A(26,62,20,180,0) + ' L46 100', A(66,62,20,180,0) + ' L86 100'] },
  n: { w: 66, s: ['M6 40 L6 100', A(32,66,26,180,0) + ' L58 100'] },
  o: { w: 70, s: [A(35,70,30,90,450)] },
  p: { w: 70, s: ['M6 40 L6 140', A(36,70,30,170,-170)] },
  q: { w: 70, s: [A(34,70,30,40,340), 'M64 40 L64 140'] },
  r: { w: 52, s: ['M6 40 L6 100', A(30,64,24,180,40)] },
  s: { w: 60, s: ['M52 48 C44 38 12 38 10 56 C8 72 54 66 52 84 C50 102 14 104 6 90'] },
  t: { w: 48, s: ['M22 4 L22 86 ' + C(36,86,14,180,300), 'M6 40 L42 40'] },
  u: { w: 66, s: ['M6 40 L6 72 ' + C(32,72,26,180,360), 'M58 40 L58 100'] },
  v: { w: 60, s: ['M4 40 L30 100 L56 40'] },
  w: { w: 80, s: ['M4 40 L20 100 L40 52 L60 100 L76 40'] },
  x: { w: 62, s: ['M6 40 L56 100', 'M56 40 L6 100'] },
  y: { w: 62, s: ['M6 40 L32 98', 'M58 40 L24 124 C20 134 14 140 2 138'] },
  z: { w: 62, s: ['M8 40 L54 40 L8 100 L56 100'] },
};

const SPACE = 36;
const COLORS = ['#e03131', '#2563d9', '#e03131', '#2563d9'];

/* ---------- 默认（最佳）设置 ---------- */
const DEFAULTS = { font: 'Kalam', size: 14, letter: 0, wgap: 9, rgap: 4, bgap: 6, weight: 100,
                   guide: true, second: true, fill: true, namedate: true };
const UNIT = { size: 'mm', letter: '', wgap: 'mm', rgap: 'mm', bgap: 'mm', weight: '%' };
let S = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('tracingSettings') || '{}'));
// Migrate previous built-in defaults while preserving other saved font choices.
if (S.font === 'skeleton' || S.font === 'Andika' || S.font === 'Patrick Hand') S.font = DEFAULTS.font;

/* ---------- 工具 ---------- */
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const measureSvg = document.getElementById('measure');
function geom(d) {
  const p = el('path', { d }, measureSvg);
  const len = p.getTotalLength();
  const s = p.getPointAtLength(0), s2 = p.getPointAtLength(Math.min(4, len));
  p.remove();
  const dx = s2.x - s.x, dy = s2.y - s.y, n = Math.hypot(dx, dy) || 1;
  return { start: s, dir: { x: dx / n, y: dy / n } };
}

/* 字体度量：让字体的 x 高度正好卡在中线和基线之间（60 单位） */
const fontCache = {};
const FONT_WEIGHT_STOPS = {
  Kalam: [300, 400, 700], Andika: [400, 700], 'Comic Neue': [400, 700],
  Quicksand: [500, 700], Nunito: [500, 700], Fredoka: [400, 500],
  'Playpen Sans': [400, 600], Poppins: [500, 800], Arial: [400, 700],
  'Comic Sans MS': [400, 700], 'Patrick Hand': [400],
};
function fontWeightFor(font, value = S.weight) {
  const stops = FONT_WEIGHT_STOPS[font] || [400];
  const level = value < 90 ? 0 : value < 130 ? 1 : 2;
  return stops[Math.min(level, stops.length - 1)];
}
function fontMetrics(font) {
  const weight = fontWeightFor(font), key = `${font}:${weight}`;
  if (fontCache[key]) return fontCache[key];
  const c = document.createElement('canvas').getContext('2d');
  c.font = `${weight} 100px "${font}"`;
  const xh = c.measureText('x').actualBoundingBoxAscent || 50;
  return (fontCache[key] = { fontSize: 60 / xh * 100 });
}
function textWidth(word, font, ls) {
  const m = fontMetrics(font);
  const t = el('text', { 'font-family': `"${font}"`, 'font-size': m.fontSize, 'font-weight': fontWeightFor(font), 'letter-spacing': ls }, measureSvg);
  t.textContent = word;
  const w = t.getComputedTextLength();
  t.remove();
  return w;
}

const letterGap = mode => (mode === 'guide' ? 40 : 8 + S.letter);
function wordWidth(word, mode) {
  if (mode !== 'guide' && S.font !== 'skeleton') return textWidth(word, S.font, S.letter);
  let w = 0;
  const gap = letterGap(mode);
  [...word].forEach((ch, i) => { w += (LETTERS[ch.toLowerCase()] ? LETTERS[ch.toLowerCase()].w : SPACE) + (i ? gap : 0); });
  return w;
}

/* 画一个单词。mode: model | dashed | gray | guide。返回宽度（mm） */
function drawWord(parent, word, x, y, k, mode) {
  const g = el('g', { transform: `translate(${x} ${y}) scale(${k})` }, parent);
  const wt = S.weight / 100;

  // ---- 字体模式 ----
  if (mode !== 'guide' && S.font !== 'skeleton') {
    const m = fontMetrics(S.font);
    const a = { x: 0, y: 100, 'font-family': `"${S.font}"`, 'font-size': m.fontSize, 'font-weight': fontWeightFor(S.font), 'letter-spacing': S.letter };
    if (mode === 'model') Object.assign(a, { fill: '#111', stroke: '#111', 'stroke-width': S.font === 'Kalam' ? 0 : Math.max(0, (wt - 1) * 6) });
    if (mode === 'gray') Object.assign(a, { fill: '#cfcfcf', stroke: '#cfcfcf', 'stroke-width': S.font === 'Kalam' ? 0 : 3 * wt, 'stroke-linejoin': 'round' });
    if (mode === 'dashed') Object.assign(a, { fill: 'none', stroke: '#8a8a8a', 'stroke-width': 1.6 * wt, 'stroke-dasharray': '5 4' });
    el('text', a, g).textContent = word;
    return wordWidth(word, mode) * k;
  }

  // ---- 标准书写体（单线骨架） ----
  const w = wordWidth(word, mode);
  const gap = letterGap(mode);
  const style = {
    model:  { stroke: '#111', w: 9 * wt },
    gray:   { stroke: '#cfcfcf', w: 12 * wt },
    dashed: { stroke: '#8a8a8a', w: 2.6 * wt, dash: '7 6' },
  }[mode];
  let cx = 0;
  for (const raw of word) {
    const L = LETTERS[raw.toLowerCase()];
    if (!L) { cx += SPACE + gap; continue; }
    const lg = el('g', { transform: `translate(${cx} 0)` }, g);
    if (mode === 'guide') {
      const badges = [], cen = { x: L.w / 2, y: 70 };
      L.s.map((st, i) => [st, i]).reverse().forEach(([st, i]) => {
        const color = COLORS[i % COLORS.length];
        if (st.dot) el('circle', { cx: st.dot[0], cy: st.dot[1], r: 5, fill: color }, lg);
        else el('path', { d: st, fill: 'none', stroke: color, 'stroke-width': 5.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'marker-end': `url(#arrow${i % 2})` }, lg);
      });
      L.s.forEach((st, i) => {
        let sx, sy;
        if (st.dot) { sx = st.dot[0] + 13; sy = st.dot[1] - 6; }
        else {
          const gm = geom(st);
          const rx = gm.start.x - cen.x, ry = gm.start.y - cen.y, n = Math.hypot(rx, ry) || 1;
          sx = gm.start.x + rx / n * 12; sy = gm.start.y + ry / n * 12;
        }
        while (badges.some(b => Math.hypot(b.x - sx, b.y - sy) < 21)) sy -= 8;
        badges.push({ x: sx, y: sy });
        const color = COLORS[i % COLORS.length];
        el('circle', { cx: sx, cy: sy, r: 10, fill: color, stroke: '#fff', 'stroke-width': 1.8 }, lg);
        el('text', { x: sx, y: sy + 4.8, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#fff', 'font-family': 'Arial, sans-serif' }, lg).textContent = i + 1;
      });
    } else {
      L.s.forEach(st => {
        if (st.dot) {
          if (style.dash) el('circle', { cx: st.dot[0], cy: st.dot[1], r: 4, fill: 'none', stroke: style.stroke, 'stroke-width': style.w }, lg);
          else el('circle', { cx: st.dot[0], cy: st.dot[1], r: style.w * 0.65, fill: style.stroke }, lg);
        } else {
          const a = { d: st, fill: 'none', stroke: style.stroke, 'stroke-width': style.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
          if (style.dash) a['stroke-dasharray'] = style.dash;
          el('path', a, lg);
        }
      });
    }
    cx += L.w + gap;
  }
  return w * k;
}

/* ---------- 页面布局（单位 mm） ---------- */
const PW = 210, PH = 297, MX = 12;

function drawLines(svg, y, k) {
  const line = (yy, c, dash, w) => el('line', Object.assign({ x1: MX, x2: PW - MX, y1: yy, y2: yy, stroke: c, 'stroke-width': w }, dash ? { 'stroke-dasharray': dash } : {}), svg);
  line(y, '#9db8e0', 0, 0.3);
  line(y + 40 * k, '#e05555', '1.2 0.9', 0.25);
  line(y + 100 * k, '#9db8e0', 0, 0.3);
  line(y + 140 * k, '#9db8e0', 0, 0.3);
}

function newPage(container, title) {
  const div = document.createElement('div'); div.className = 'page'; container.appendChild(div);
  const svg = el('svg', { viewBox: `0 0 ${PW} ${PH}`, xmlns: NS }); div.appendChild(svg);
  const defs = el('defs', {}, svg);
  COLORS.slice(0, 2).forEach((c, i) => {
    const m = el('marker', { id: 'arrow' + i, viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 3, markerHeight: 3, orient: 'auto' }, defs);
    el('path', { d: 'M0 0 L10 5 L0 10 z', fill: c }, m);
  });
  const font = 'Poppins, "Avenir Next", "Segoe UI", Arial, sans-serif';
  el('text', { x: MX, y: 22, 'font-size': 9, 'font-weight': 800, fill: '#111', 'font-family': font }, svg).textContent = title;
  let y = 28;
  if (S.namedate) {
    el('text', { x: MX, y: 34, 'font-size': 4.2, fill: '#111', 'font-family': font }, svg).textContent = 'Name:';
    el('line', { x1: MX + 14, x2: MX + 85, y1: 34.5, y2: 34.5, stroke: '#111', 'stroke-width': 0.35, 'stroke-dasharray': '1.6 0.9' }, svg);
    el('text', { x: PW - MX - 60, y: 34, 'font-size': 4.2, fill: '#111', 'font-family': font }, svg).textContent = 'Date:';
    el('line', { x1: PW - MX - 47, x2: PW - MX, y1: 34.5, y2: 34.5, stroke: '#111', 'stroke-width': 0.35, 'stroke-dasharray': '1.6 0.9' }, svg);
    y = 38;
  }
  el('line', { x1: MX, x2: PW - MX, y1: y, y2: y, stroke: '#9db8e0', 'stroke-width': 0.4 }, svg);
  const ins = S.guide ? 'Follow the numbers and arrows: start at the number dot, write in the arrow direction.' : 'Trace the words, then write them on your own.';
  el('text', { x: MX, y: y + 5.5, 'font-size': 3, fill: '#666', 'font-family': font }, svg).textContent = ins;
  return { svg, y: y + 11 };
}

function render() {
  const container = document.getElementById('pages');
  container.innerHTML = '';
  const title = document.getElementById('title').value;
  const words = document.getElementById('words').value
    .split(/[\n,，;；]+/).map(w => w.trim().replace(/[^A-Za-z' -]/g, '').replace(/\s+/g, ' '))
    .map(w => S.font === 'skeleton' ? w.toLowerCase().replace(/[^a-z ]/g, '') : w).filter(Boolean);

  const K = S.size / 140;                               // mm / 单位
  const ROW_H = 140 * K;
  const blockH = ROW_H + (S.second ? S.rgap + ROW_H : 0) + S.bgap;
  let page = newPage(container, title);
  const right = PW - MX - 2;

  words.forEach(word => {
    if (page.y + blockH - S.bgap > PH - 12) page = newPage(container, title);
    const svg = page.svg;
    let y = page.y;
    const guideOn = S.guide && /[a-z]/i.test(word);
    let k = K;
    const need = (guideOn ? wordWidth(word, 'guide') * k + S.wgap : 0) + wordWidth(word, 'model') * k;
    const avail = PW - 2 * MX - 4;
    if (need > avail) k = K * avail / need;               // 超长单词自动缩小
    const yy = y + (K - k) * 100;                           // 基线对齐
    const w1 = wordWidth(word, 'model') * k;

    drawLines(svg, y, K);
    let x = MX + 2;
    if (guideOn) x += drawWord(svg, word, x, yy, k, 'guide') + S.wgap;
    x += drawWord(svg, word, x, yy, k, 'model') + S.wgap;
    if (S.fill) while (x + w1 <= right) { drawWord(svg, word, x, yy, k, 'dashed'); x += w1 + S.wgap; }
    else if (x + w1 <= right) drawWord(svg, word, x, yy, k, 'dashed');

    if (S.second) {
      const y2 = y + ROW_H + S.rgap;
      drawLines(svg, y2, K);
      x = MX + 2; let n = 0;
      while (x + w1 <= right || n === 0) { drawWord(svg, word, x, yy + ROW_H + S.rgap, k, 'gray'); x += w1 + S.wgap; n++; if (!S.fill && n >= 3) break; }
    }
    page.y += blockH;
  });
}

/* ---------- 控件绑定 ---------- */
const sliders = ['size', 'letter', 'wgap', 'rgap', 'bgap', 'weight'];
const checks = ['guide', 'second', 'fill', 'namedate'];
function syncUI() {
  document.getElementById('font').value = S.font;
  sliders.forEach(id => { document.getElementById(id).value = S[id]; });
  checks.forEach(id => { document.getElementById(id).checked = S[id]; });
  labels();
}
function labels() {
  sliders.forEach(id => {
    let v = S[id];
    if (id === 'letter') v = v === 0 ? '标准' : (v > 0 ? '+' + v : v);
    else if (id === 'weight' && S.font === 'Kalam') v = S.weight < 90 ? '细体' : S.weight < 130 ? '常规' : '粗体';
    else v = v + UNIT[id];
    document.getElementById('v_' + id).textContent = v + (S[id] === DEFAULTS[id] && id !== 'letter' ? '（默认）' : '');
  });
  document.getElementById('fontHint').textContent = S.font === 'skeleton'
    ? '单线笔画，和笔顺完全一致，最适合临摹。'
    : S.font === 'Kalam'
      ? 'Kalam 支持细体、常规和粗体三档；笔顺示意仍按标准书写体显示。'
      : '字体需要联网加载；笔顺示意仍按标准书写体显示。';
}
let timer;
function update() {
  S.font = document.getElementById('font').value;
  sliders.forEach(id => { S[id] = parseFloat(document.getElementById(id).value); });
  checks.forEach(id => { S[id] = document.getElementById(id).checked; });
  localStorage.setItem('tracingSettings', JSON.stringify(S));
  labels();
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (S.font !== 'skeleton') { try { await document.fonts.load(`${fontWeightFor(S.font)} 40px "${S.font}"`); } catch (e) {} }
    render();
  }, 60);
}
['title', 'words', 'font', ...sliders, ...checks].forEach(id => document.getElementById(id).addEventListener('input', update));
document.getElementById('reset').addEventListener('click', () => { S = Object.assign({}, DEFAULTS); syncUI(); update(); });
document.getElementById('print').addEventListener('click', () => window.print());
syncUI();
update();
document.fonts.ready.then(() => { Object.keys(fontCache).forEach(k => delete fontCache[k]); render(); });
