'use strict';

/* ===== Настройки ===== */
const EVENT_DATE = new Date('2026-10-23T11:00:00');
const MUSIC_SRC = '';  // например 'music/autumn.mp3'. Если пусто — играет встроенная мягкая мелодия

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Пока открыто окно, фон недоступен для Tab
const setInert = v => ['main', '#nav'].forEach(s => { $(s).inert = v; });

/* ===== Данные ===== */
const PROGRAM = [
  ['Конкурс 1', 'Осенняя форма', 'Участники представляют осенние образы и костюмы.'],
  ['Конкурс 2', 'Приветствие', 'Визитная карточка команды: приветствие жюри и зрителей.'],
  ['Конкурс 3', 'Трапеза', 'Осенний стол: угощения и их представление.'],
  ['Конкурс 4', 'Танец', 'Танцевальное выступление команд.'],
  ['Конкурс 5', 'Мода', 'Показ мод в осеннем стиле.']
];
const PEOPLE = [
  ['Участник 1', 'Ведущий', 'students'], ['Участница 2', 'Организатор', 'students'],
  ['Участник 3', 'Танцор', 'students'], ['Участница 4', 'Вокал', 'students'],
  ['Учитель 1', 'Классный руководитель', 'teachers'], ['Учитель 2', 'Хореограф', 'teachers'],
  ['Гость 1', 'Почётный гость', 'guests'], ['Гость 2', 'Выпускник', 'guests']
];
const GRADS = [
  ['#7a1a2b', '#f08a24'], ['#4a0f1c', '#e8b85a'], ['#a8321c', '#f7d98b'],
  ['#5c1424', '#c9741c'], ['#8c2a1a', '#e8b85a'], ['#3a0b17', '#f08a24']
];
const grad = i => `linear-gradient(135deg, ${GRADS[i % 6][0]}, ${GRADS[i % 6][1]})`;
const PERSON_SVG = '<svg viewBox="0 0 24 24" fill="#fff4dc"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 22c0-5 3.8-8 8.5-8s8.5 3 8.5 8z"/></svg>';

/* ===== Навигация ===== */
const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('resize', () => innerWidth >= 768 && setMenu(false));

/* ===== Падающие листья ===== */
(function leaves() {
  if (reduceMotion) return;
  const colors = ['#f08a24', '#e8b85a', '#c9301c', '#d9631e', '#f7d98b', '#a8321c'];
  const box = $('#leaves');
  const count = innerWidth < 640 ? 14 : 26;
  for (let i = 0; i < count; i++) {
    const size = 18 + Math.random() * 26;
    const el = document.createElement('div');
    el.className = 'leaf';
    el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `--drift:${(Math.random() - .5) * 240}px;--spin:${(Math.random() < .5 ? -1 : 1) * (360 + Math.random() * 360)}deg;` +
      `animation-duration:${9 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s;`;
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="${colors[i % colors.length]}" style="animation-duration:${2 + Math.random() * 3}s">` +
      '<path d="M12 1c1 3 4 4 6 4-1 2-1 3 1 4-2 1-3 1-3 3 2 0 3 1 4 2-3 1-5 1-6 3l-1 5h-2l-1-5c-1-2-3-2-6-3 1-1 2-2 4-2 0-2-1-2-3-3 2-1 2-2 1-4 2 0 5-1 6-4z"/></svg>';
    box.appendChild(el);
  }
})();

/* ===== Рендер данных ===== */
$('#timeline').innerHTML = PROGRAM.map(([t, title, text], i) =>
  `<li class="tl-item card reveal" style="--d:${i * .06}s"><div class="tl-time">${t}</div><h3>${title}</h3><p class="text-amber-100/70 mt-1">${text}</p></li>`).join('');

$('#peopleGrid').innerHTML = PEOPLE.map(([name, role, group], i) =>
  `<article class="card person reveal" data-group="${group}" style="--d:${(i % 4) * .08}s">
     <div class="ph" style="background:${grad(i)}">${PERSON_SVG}<span class="ph-label">Фото</span></div>
     <div class="info"><h3>${name}</h3><p>${role}</p></div></article>`).join('');

$$('#filters .chip').forEach(btn => btn.addEventListener('click', () => {
  $$('#filters .chip').forEach(b => b.classList.toggle('active', b === btn));
  $$('.person').forEach(p => p.classList.toggle('hide', btn.dataset.f !== 'all' && p.dataset.group !== btn.dataset.f));
}));

/* ===== Уведомления ===== */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ===== Галерея и просмотр ===== */
// Чтобы использовать свои фото, замените содержимое .g-item на <img src="images/photo1.jpg" alt="...">
const RATIOS = ['4/5', '1/1', '3/4', '5/4', '4/5', '1/1', '3/4', '1/1'];
$('#galleryGrid').innerHTML = RATIOS.map((r, i) =>
  `<button type="button" class="g-item reveal" aria-label="Открыть фото ${i + 1}" style="--d:${(i % 3) * .08}s">
     <span class="ph" style="aspect-ratio:${r};background:${grad(i)}">${PERSON_SVG}<span class="ph-label">Фото ${i + 1}</span></span></button>`).join('');

const lb = $('#lightbox'), stage = $('#lbStage');
const items = $$('.g-item');
let cur = 0, lastFocus = null;
function showPhoto(i) {
  cur = (i + items.length) % items.length;
  stage.innerHTML = '';
  stage.appendChild($('.ph, img', items[cur]).cloneNode(true));
  const ph = $('.ph', stage);
  if (ph) ph.style.aspectRatio = '4/3';
}
function openLb(i) { lastFocus = document.activeElement; showPhoto(i); setInert(true); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbClose').focus(); }
function closeLb() { lb.hidden = true; setInert(false); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }
items.forEach((it, i) => it.addEventListener('click', () => openLb(i)));
$('#lbClose').addEventListener('click', closeLb);
$('#lbPrev').addEventListener('click', () => showPhoto(cur - 1));
$('#lbNext').addEventListener('click', () => showPhoto(cur + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showPhoto(cur - 1);
  if (e.key === 'ArrowRight') showPhoto(cur + 1);
});

/* ===== Появление при прокрутке ===== */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach(el => io.observe(el));

/* ===== Обратный отсчёт ===== */
const cd = $('#countdown');
function tick() {
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) {
    cd.innerHTML = '<p class="font-serif text-3xl text-gold">Конкурс начался!</p>';
    clearInterval(tick.id);
    return;
  }
  const v = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];
  cd.innerHTML = ['дней', 'часов', 'минут', 'секунд'].map((l, i) =>
    `<div class="cd-box"><b>${String(v[i]).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
}
tick.id = setInterval(tick, 1000);
tick();

/* ===== Фоновая музыка ===== */
const musicBtn = $('#musicBtn');
let playing = false, ctx, master, osc = [], chordTimer, audioEl;
const CHORDS = [[220, 277.18, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [196, 246.94, 311.13]];

function buildSynth() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900; filter.connect(master);
  osc = [0, 1, 2].map(() => { const o = ctx.createOscillator(); o.type = 'triangle'; o.connect(filter); o.start(); return o; });
  return true;
}
function playChords() {
  let i = 0;
  const step = () => { CHORDS[i++ % CHORDS.length].forEach((f, k) => osc[k].frequency.setTargetAtTime(f, ctx.currentTime, 1.5)); };
  step(); chordTimer = setInterval(step, 6000);
}
async function startMusic() {
  if (MUSIC_SRC) {
    audioEl = audioEl || Object.assign(new Audio(MUSIC_SRC), { loop: true, volume: .5 });
    await audioEl.play();
  } else {
    if (!ctx && !buildSynth()) throw new Error('no audio');
    await ctx.resume();
    master.gain.setTargetAtTime(.12, ctx.currentTime, .8);
    playChords();
  }
}
function stopMusic() {
  if (MUSIC_SRC) { audioEl && audioEl.pause(); return; }
  clearInterval(chordTimer);
  master.gain.setTargetAtTime(0, ctx.currentTime, .4);
  setTimeout(() => { if (!playing) ctx.suspend(); }, 1500);
}
musicBtn.addEventListener('click', async () => {
  try {
    if (!playing) await startMusic(); else stopMusic();
    playing = !playing;
    musicBtn.setAttribute('aria-pressed', playing);
    musicBtn.setAttribute('aria-label', playing ? 'Выключить фоновую музыку' : 'Включить фоновую музыку');
    toast(playing ? 'Музыка включена' : 'Музыка выключена');
  } catch {
    toast('Не удалось включить музыку. Проверьте путь к файлу.');
  }
});

/* ===== Оценивание жюри ===== */
const JURY_KEY = 'osen-2026-jury';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmt = n => String(Number.isInteger(n) ? n : +n.toFixed(2));
const scoreKey = (c, r) => c + '|' + r;
const emptyDb = () => ({ classes: [], rounds: [], scores: {} });

// Приводит любые данные (из хранилища или файла) к безопасному виду
function sanitize(d) {
  const out = emptyDb();
  if (!d || typeof d !== 'object') return out;
  const clean = a => (Array.isArray(a) ? a : [])
    .filter(x => x && typeof x.id === 'string' && !x.id.includes('|') && typeof x.name === 'string' && x.name.trim())
    .map(x => ({ id: x.id, name: x.name.trim().slice(0, 40) }));
  out.classes = clean(d.classes);
  out.rounds = clean(d.rounds);
  const cs = new Set(out.classes.map(c => c.id)), rs = new Set(out.rounds.map(r => r.id));
  Object.entries(d.scores || {}).forEach(([k, v]) => {
    const [c, r] = k.split('|');
    const n = Number(v);
    if (cs.has(c) && rs.has(r) && v !== '' && v !== null && Number.isFinite(n)) out.scores[k] = n;
  });
  return out;
}
function loadDb() {
  try { return sanitize(JSON.parse(localStorage.getItem(JURY_KEY))); } catch { return emptyDb(); }
}
let db = loadDb();
function saveDb() {
  try { localStorage.setItem(JURY_KEY, JSON.stringify(db)); }
  catch { toast('Не удалось сохранить: хранилище браузера недоступно'); }
}
const sumOf = cid => db.rounds.reduce((s, r) => s + (db.scores[scoreKey(cid, r.id)] || 0), 0);
const nameTaken = (list, name, exceptId) => list.some(x => x.id !== exceptId && x.name.toLowerCase() === name.toLowerCase());

/* --- Публичные результаты --- */
function renderResults() {
  const hasScores = Object.keys(db.scores).length > 0;
  const byName = (a, b) => a.c.name.localeCompare(b.c.name, 'ru');
  const rows = db.classes.map(c => ({ c, sum: sumOf(c.id) }));
  rows.sort((a, b) => hasScores ? (b.sum - a.sum || byName(a, b)) : byName(a, b));
  let place = 0;
  rows.forEach((r, i) => { if (i === 0 || r.sum !== rows[i - 1].sum) place = i + 1; r.place = place; });

  const list = $('#ratingList'), wrap = $('#tableWrap');
  if (!rows.length) {
    list.innerHTML = '<div class="empty-box">Пока нет данных. Жюри добавит классы, раунды и оценки в панели жюри.</div>';
    wrap.hidden = true;
    return;
  }
  const max = Math.max(0, ...rows.map(r => r.sum));
  list.innerHTML = rows.map((r, i) => {
    const cls = hasScores && r.place <= 3 ? ` p${r.place}` : '';
    const pct = max > 0 ? Math.max(0, r.sum) / max * 100 : 0;
    return `<div class="card r-row${cls}" style="--i:${i}">
      <div class="place">${hasScores ? r.place : '—'}</div>
      <div><div class="r-name">${esc(r.c.name)}</div><div class="r-bar"><i style="width:${pct}%"></i></div></div>
      <div class="r-sum">${fmt(r.sum)}<small>баллов</small></div></div>`;
  }).join('');

  wrap.hidden = false;
  $('#resultsTable').innerHTML =
    `<thead><tr><th>Класс</th>${db.rounds.map(r => `<th>${esc(r.name)}</th>`).join('')}<th>Сумма</th></tr></thead><tbody>` +
    rows.map(r => `<tr><td class="name">${hasScores ? r.place + '. ' : ''}${esc(r.c.name)}</td>` +
      db.rounds.map(rd => { const v = db.scores[scoreKey(r.c.id, rd.id)]; return `<td>${v === undefined ? '—' : fmt(v)}</td>`; }).join('') +
      `<td class="sum">${fmt(r.sum)}</td></tr>`).join('') + '</tbody>';
}

/* --- Панель жюри --- */
const listItem = (kind, x) =>
  `<li class="li-row"><input class="name-in" data-kind="${kind}" data-id="${x.id}" value="${esc(x.name)}" maxlength="40" aria-label="Название">` +
  `<button type="button" class="del" data-kind="${kind}" data-id="${x.id}" aria-label="Удалить ${esc(x.name)}">Удалить</button></li>`;

function renderLists() {
  $('#classList').innerHTML = db.classes.length ? db.classes.map(c => listItem('class', c)).join('') : '<li class="muted">Классов пока нет.</li>';
  $('#roundList').innerHTML = db.rounds.length ? db.rounds.map(r => listItem('round', r)).join('') : '<li class="muted">Раундов пока нет.</li>';
}
function renderScoreTable() {
  const box = $('#scoreBox');
  if (!db.classes.length || !db.rounds.length) {
    box.innerHTML = '<p class="muted">Чтобы вводить оценки, добавьте хотя бы один класс и один раунд.</p>';
    return;
  }
  box.innerHTML = `<div class="table-wrap"><table class="rtable"><thead><tr><th>Класс</th>${db.rounds.map(r => `<th>${esc(r.name)}</th>`).join('')}<th>Сумма</th></tr></thead><tbody>` +
    db.classes.map(c => `<tr><td class="name">${esc(c.name)}</td>` +
      db.rounds.map(r => {
        const v = db.scores[scoreKey(c.id, r.id)];
        return `<td><input class="score-in" type="number" step="any" inputmode="decimal" data-c="${c.id}" data-r="${r.id}" value="${v === undefined ? '' : v}" aria-label="${esc(c.name)}, ${esc(r.name)}"></td>`;
      }).join('') + `<td class="sum" data-sum="${c.id}">${fmt(sumOf(c.id))}</td></tr>`).join('') + '</tbody></table></div>';
}
function refreshAll() { renderLists(); renderScoreTable(); renderResults(); }

const admin = $('#admin');
function openAdmin() { setInert(true); admin.hidden = false; document.body.style.overflow = 'hidden'; refreshAll(); $('#adminClose').focus(); }
function closeAdmin() { admin.hidden = true; setInert(false); document.body.style.overflow = ''; $('#openAdmin').focus(); }
$('#openAdmin').addEventListener('click', openAdmin);
$('#adminClose').addEventListener('click', closeAdmin);
addEventListener('keydown', e => { if (e.key === 'Escape' && !admin.hidden) closeAdmin(); });

$$('#adminTabs .chip').forEach(btn => btn.addEventListener('click', () => {
  $$('#adminTabs .chip').forEach(b => b.classList.toggle('active', b === btn));
  $$('.admin-pane').forEach(p => p.hidden = p.id !== 'pane-' + btn.dataset.tab);
  if (btn.dataset.tab === 'scores') renderScoreTable();
}));

function addItem(e, kind) {
  e.preventDefault();
  const input = $(kind === 'class' ? '#classInput' : '#roundInput');
  const list = kind === 'class' ? db.classes : db.rounds;
  const name = input.value.trim().slice(0, 40);
  if (!name) return;
  if (nameTaken(list, name)) return toast('Такое название уже есть');
  list.push({ id: uid(), name });
  saveDb(); input.value = ''; refreshAll(); input.focus();
}
$('#classForm').addEventListener('submit', e => addItem(e, 'class'));
$('#roundForm').addEventListener('submit', e => addItem(e, 'round'));

// Переименование и удаление
admin.addEventListener('change', e => {
  const inp = e.target.closest('.name-in');
  if (!inp) return;
  const list = inp.dataset.kind === 'class' ? db.classes : db.rounds;
  const item = list.find(x => x.id === inp.dataset.id);
  const name = inp.value.trim().slice(0, 40);
  if (!item) return;
  if (!name || nameTaken(list, name, item.id)) { inp.value = item.name; return toast(name ? 'Такое название уже есть' : 'Название не может быть пустым'); }
  item.name = name; saveDb(); renderScoreTable(); renderResults();
});
admin.addEventListener('click', e => {
  const btn = e.target.closest('.del');
  if (!btn) return;
  const isClass = btn.dataset.kind === 'class';
  const list = isClass ? db.classes : db.rounds;
  const item = list.find(x => x.id === btn.dataset.id);
  if (!item || !confirm(`Удалить ${isClass ? 'класс' : 'раунд'} «${item.name}» и связанные оценки?`)) return;
  list.splice(list.indexOf(item), 1);
  Object.keys(db.scores).forEach(k => { if (k.split('|')[isClass ? 0 : 1] === item.id) delete db.scores[k]; });
  saveDb(); refreshAll();
});

// Ввод оценок: сразу сохраняем и пересчитываем
admin.addEventListener('input', e => {
  const inp = e.target.closest('.score-in');
  if (!inp) return;
  const k = scoreKey(inp.dataset.c, inp.dataset.r);
  if (inp.value === '') delete db.scores[k];
  else { const n = Number(inp.value); if (!Number.isFinite(n)) return; db.scores[k] = n; }
  saveDb();
  const cell = $(`[data-sum="${inp.dataset.c}"]`, admin);
  if (cell) cell.textContent = fmt(sumOf(inp.dataset.c));
  renderResults();
});

// Данные: экспорт, импорт, сброс
$('#exportBtn').addEventListener('click', () => {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })),
    download: 'osen-2026-results.json'
  });
  a.click(); URL.revokeObjectURL(a.href);
});
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = sanitize(JSON.parse(await file.text()));
    if (!confirm(`Заменить текущие данные? В файле: классов — ${data.classes.length}, раундов — ${data.rounds.length}.`)) return;
    db = data; saveDb(); refreshAll(); toast('Данные загружены');
  } catch { toast('Не удалось прочитать файл'); }
});
$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Удалить все классы, раунды и оценки? Это нельзя отменить.')) return;
  db = emptyDb(); saveDb(); refreshAll(); toast('Данные удалены');
});

// Обновление при изменении данных в другой вкладке
addEventListener('storage', e => { if (e.key === JURY_KEY) { db = loadDb(); refreshAll(); } });
renderResults();
