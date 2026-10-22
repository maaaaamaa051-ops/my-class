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
// Участники 10-К класса: замените имена на настоящие. Фото: images/10k-1.jpg, images/10k-2.jpg ... по порядку списка
const CLASS_10K = ['Участник 1', 'Участник 2', 'Участник 3', 'Участник 4', 'Участник 5', 'Участник 6'];
// Команды-участницы (таблица)
const TEAMS = ['10 К', '10 Р', '10 А', '11 К', '11 Р'];
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

// Если файла фото нет, остаётся заглушка (img удаляется при ошибке загрузки)
$('#teamGrid').innerHTML = CLASS_10K.map((name, i) =>
  `<article class="card person team-card reveal" style="--d:${(i % 3) * .08}s">
     <button type="button" class="ph" style="background:${grad(i)}" aria-label="Увеличить фото: ${name}">
       ${PERSON_SVG}<img src="images/10k-${i + 1}.jpg" alt="${name}" loading="lazy" onerror="this.remove()">
     </button>
     <div class="info"><h3>${name}</h3><p>10-К класс</p></div></article>`).join('');

$('#teamTable').innerHTML = TEAMS.map((t, i) =>
  `<tr><td>${i + 1}</td><td class="name">${t}</td></tr>`).join('');

/* ===== Уведомления ===== */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ===== Просмотр фото ===== */
const lb = $('#lightbox'), stage = $('#lbStage');
const items = $$('#teamGrid .ph');
let cur = 0, lastFocus = null;
function showPhoto(i) {
  cur = (i + items.length) % items.length;
  stage.innerHTML = `<div class="ph" style="background:${grad(cur)}">${items[cur].innerHTML}</div>`;
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
