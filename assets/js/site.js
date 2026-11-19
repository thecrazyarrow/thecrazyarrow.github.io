/*
  ============================================================
  site.js : everything the site DOES (shared by every page)
  ============================================================
   1. Header, "Hire me" band and footer  (written ONCE here, used on every page)
   2. Language switch: EN / 日本語 / عربي
   3. Photos: hero, galleries, placeholders, lightbox
   4. Videos found in assets/video
   5. Scroll fade-in + tap feedback on phones
   6. Orange sparks (home + industrial heroes)
   7. Contact form (Formspree, or email fallback)
   8. Song embed ("Twenty Three") and progress bars

  WHERE TEXT LIVES: every visible sentence has a data-i18n="some.key"
  attribute. The words for each language are in assets/i18n/*.json.
  The English written inside the HTML is only a backup, shown if the
  JSON file can't be loaded (for example when you double-click a page
  instead of using Live Server).
*/


// ===================== SMALL HELPERS =====================

// $ and $$ are short names for "find one" and "find all"
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// localStorage can throw in private windows, so every use is wrapped in try/catch
function storageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } }
// sessionStorage = like localStorage, but forgotten when the tab is closed
function sessionGet(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
function sessionSet(key, value) { try { sessionStorage.setItem(key, value); } catch (e) { /* ignore */ } }

// Reads a JSON file. Returns null instead of crashing if it's missing.
async function getJSON(path) {
  try {
    const response = await fetch(path, { cache: 'no-cache' });
    return response.ok ? await response.json() : null;
  } catch (e) {
    return null;
  }
}

// Little line icons, drawn as SVG so they're sharp at any size and take the orange colour.
const ICONS = {
  printer: '<path d="M6 3h12v4H6zM4 7h16v8H4zM7 15v6h10v-6M12 11v3"/>',
  cube: '<path d="M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  bike: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M5.5 17 9 9h6l3.5 8M9 9 7 6H4M15 9l-3 8"/>',
  guitar: '<path d="m14 10 6-6M18 2l4 4M9.5 9.5a4.5 4.5 0 0 0-6.4 6.4l5 5a4.5 4.5 0 0 0 6.4-6.4 2 2 0 0 1 0-2.8l-2.2-2.2a2 2 0 0 1-2.8 0z"/><circle cx="9" cy="15" r="1.5"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5"/>',
  sprout: '<path d="M12 22V11M12 11C12 6 8 4 3 4c0 5 4 7 9 7zM12 13c0-4 3-6 8-6 0 4-3 6-8 6z"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  link: '<path d="M4 4h16v16H4zM8 10v6M8 7v.01M12 16v-4a2 2 0 0 1 4 0v4M12 12v4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  camera: '<rect x="2" y="7" width="14" height="11" rx="2"/><path d="m16 11 6-3v9l-6-3"/><circle cx="9" cy="12.5" r="2.5"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};
function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
}
// Pages can write <span data-icon="bike"></span> and get the icon drawn in.
function drawIcons() {
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
}


// ===================== 1. HEADER, CTA, FOOTER =====================
// Every page has three empty placeholders:
//   <div id="site-header"></div>  <div id="site-cta"></div>  <div id="site-footer"></div>
// and we fill them here, so to add a page to the menu you only edit THIS list.

const EMAIL = 'aaronnetto78@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/aaron-angel-netto-86199b244';
const CV = 'assets/resume/Aaron_Angel_Netto_CV.pdf';

const PAGES = [
  { file: 'index.html',         key: 'nav.home',          en: 'Home' },
  { file: 'projects.html',      key: 'nav.projects',      en: 'Projects' },
  { file: 'content.html',       key: 'nav.content',       en: 'Video &amp; Content' },
  { file: 'manufacturing.html', key: 'nav.manufacturing', en: '3D &amp; Manufacturing' },
  { file: 'industrial.html',    key: 'nav.industrial',    en: 'Industrial' },
  { file: 'garage.html',        key: 'nav.garage',        en: 'Garage' },
  { file: 'guitar.html',        key: 'nav.guitar',        en: 'Guitar' },
  { file: 'versatility.html',   key: 'nav.versatility',   en: 'Versatility' },
  { file: 'growth.html',        key: 'nav.growth',        en: 'Growth Log' },
  { file: 'about.html',         key: 'nav.about',         en: 'About' },
];

// The text logo. When assets/logo/logo.svg exists, buildMedia() swaps in the image.
const BRAND_HTML =
  '<span class="brand-main"><i class="brand-gear" aria-hidden="true"></i>engineered by <b>chaos</b></span>' +
  '<span class="brand-sub">the crazy arrow</span>';

function buildChrome() {
  // Which page are we on? "/portfolio/garage.html" -> "garage.html"
  const here = location.pathname.split('/').pop() || 'index.html';

  const links = PAGES.map(p =>
    `<li><a href="${p.file}"${p.file === here ? ' aria-current="page"' : ''} data-i18n="${p.key}">${p.en}</a></li>`
  ).join('');

  const header = $('#site-header');
  if (header) {
    header.outerHTML = `
      <a class="skip-link" href="#main" data-i18n="common.skip">Skip to content</a>
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="brand" aria-label="Aaron Angel Netto, home">${BRAND_HTML}</a>
          <!-- The "light mode" switch. Spoiler: it never works (see setupLightModeEgg) -->
          <button class="theme-toggle" type="button" role="switch" aria-checked="false"
                  data-i18n-attr="aria-label:egg.label" aria-label="Light mode">
            <span class="tt-sun" aria-hidden="true">${icon('sun')}</span>
            <span class="tt-knob" aria-hidden="true">${icon('moon')}</span>
          </button>
          <div class="egg-lines" hidden>
            <span data-i18n="egg.1">No, we don't like to blind ourselves.</span>
            <span data-i18n="egg.2">Really? You want to get flashbanged with light mode?</span>
            <span data-i18n="egg.3">Nope. I won't allow it.</span>
            <span data-i18n="egg.end">That's it, folks!</span>
          </div>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"
                  data-i18n-attr="aria-label:nav.menu" aria-label="Open menu"><span class="menu-bars" aria-hidden="true"><i></i><i></i><i></i></span></button>
          <nav class="nav" id="main-nav" aria-label="Main">
            <ul class="nav-links">${links}</ul>
            <div class="nav-actions">
              <div class="lang-switch" role="group" aria-label="Language">
                <button type="button" data-lang="en" lang="en">EN</button>
                <button type="button" data-lang="ja" lang="ja">日本語</button>
                <button type="button" data-lang="ar" lang="ar">عربي</button>
              </div>
              <a href="about.html#contact" class="btn btn-primary btn-hire" data-i18n="nav.hire">Hire me</a>
            </div>
          </nav>
        </div>
      </header>`;
  }

  const cta = $('#site-cta');
  if (cta) {
    cta.outerHTML = `
      <div class="container">
        <section class="cta-band reveal" aria-labelledby="cta-title">
          <span class="eyebrow" data-i18n="cta.eyebrow">Hire me</span>
          <h2 id="cta-title" data-i18n="cta.title">Let's build something</h2>
          <p data-i18n="cta.text">A project, a part nobody makes anymore, or a problem that needs a bit of chaos. I'm in.</p>
          <div class="btn-row">
            <a href="about.html#contact" class="btn btn-primary" data-i18n="cta.button">Get in touch</a>
            <a href="${CV}" download class="btn btn-ghost" data-i18n="common.cv">Download CV</a>
          </div>
        </section>
      </div>`;
  }

  const footer = $('#site-footer');
  if (footer) {
    footer.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-inner">
            <div>
              <a href="index.html" class="brand" aria-label="Aaron Angel Netto, home">${BRAND_HTML}</a>
              <p class="footer-note" data-i18n="footer.about">Aaron Angel Netto. Electronics &amp; communication engineer, maker and creator, based in Kuwait.</p>
            </div>
            <div class="footer-links">
              <a href="mailto:${EMAIL}">${EMAIL}</a>
              <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
              <a href="${CV}" download data-i18n="common.cv">Download CV</a>
            </div>
          </div>
          <p class="copyright">&copy; <span id="year"></span> Aaron Angel Netto · engineered by chaos</p>
        </div>
      </footer>`;
  }

  $('#year') && ($('#year').textContent = new Date().getFullYear());

  // Mobile menu
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  if (toggle && nav) {
    const setOpen = open => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }
}


// ===================== 2. LANGUAGE SWITCH =====================

const LANGS = { en: 'ltr', ja: 'ltr', ar: 'rtl' };
const dictCache = {};
let dict = {};        // the language currently shown
let baseDict = {};    // English, used whenever a translation is missing
const originals = new WeakMap();   // the English that was written in the HTML

// t('common.close') gives the text for a key in the current language
function t(key, fallback = '') {
  return dict[key] ?? baseDict[key] ?? fallback;
}

async function loadDict(code) {
  if (!(code in dictCache)) dictCache[code] = (await getJSON(`assets/i18n/${code}.json`)) || {};
  return dictCache[code];
}

// Japanese and Arabic need extra fonts. Load them only when someone needs them.
function loadFontFor(code) {
  const families = {
    ja: 'Noto+Sans+JP:wght@400;500;700',
    ar: 'IBM+Plex+Sans+Arabic:wght@400;500;700',
  };
  if (!families[code] || $(`link[data-font="${code}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families[code]}&display=swap`;
  link.dataset.font = code;
  document.head.appendChild(link);
}

async function setLanguage(code) {
  if (!(code in LANGS)) code = 'en';
  baseDict = await loadDict('en');
  dict = code === 'en' ? baseDict : await loadDict(code);

  // Text content
  $$('[data-i18n]').forEach(el => {
    if (!originals.has(el)) originals.set(el, { html: el.innerHTML, attrs: {} });
    const value = dict[el.dataset.i18n] ?? baseDict[el.dataset.i18n] ?? originals.get(el).html;
    if (el.tagName === 'TITLE') {
      // a <textarea> turns "&amp;" back into "&" for the browser tab
      const decode = document.createElement('textarea');
      decode.innerHTML = value;
      document.title = decode.value;
    } else {
      el.innerHTML = value;
    }
    // "i18n-optional" elements hide themselves when their text is empty
    if (el.classList.contains('i18n-optional')) el.hidden = !el.textContent.trim();
  });

  // Attributes, written as data-i18n-attr="alt:key; aria-label:other.key"
  $$('[data-i18n-attr]').forEach(el => {
    if (!originals.has(el)) originals.set(el, { html: null, attrs: {} });
    const saved = originals.get(el).attrs;
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (!attr || !key) return;
      if (!(attr in saved)) saved[attr] = el.getAttribute(attr) || '';
      el.setAttribute(attr, dict[key] ?? baseDict[key] ?? saved[attr]);
    });
  });

  // The <html> tag: language and direction. dir="rtl" flips the layout.
  document.documentElement.lang = code;
  document.documentElement.dir = LANGS[code];
  loadFontFor(code);

  $$('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === code)));
  storageSet('lang', code);

  // Let other parts (galleries, progress bars) refresh their text
  document.dispatchEvent(new CustomEvent('langchange', { detail: code }));
}

function setupLanguageSwitch() {
  $$('.lang-switch button').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
}


// ===================== 3. PHOTOS =====================
// assets/media.json lists the photos in every folder. It's written by
// tools/build-media.js:  run  node tools/build-media.js  after adding photos.

let media = { folders: {}, videos: [], logo: null };

function photosIn(folder) {
  return (media.folders && media.folders[folder]) || [];
}

// <picture> uses the small .webp copy when there is one, the original otherwise
function pictureHTML(photo, alt, eager) {
  // encodeURI: file names with spaces (like WhatsApp photos) become safe web addresses
  const webp = photo.webp ? `<source srcset="${encodeURI(photo.webp)}" type="image/webp">` : '';
  const loading = eager ? 'eager' : 'lazy';
  return `<picture>${webp}<img src="${encodeURI(photo.src)}" alt="${alt}" loading="${loading}" decoding="async"></picture>`;
}

function placeholderHTML() {
  return `<div class="ph">${icon('photo')}<span>${t('common.photoSoon', 'Photo coming soon')}</span></div>`;
}

// Fills every <div class="gallery" data-folder="..."> on the page
function renderGalleries() {
  $$('.gallery[data-folder]').forEach(gallery => {
    const limit = Number(gallery.dataset.limit) || Infinity;
    const photos = photosIn(gallery.dataset.folder).slice(0, limit);
    const altBase = gallery.dataset.alt || '';

    if (photos.length === 0) {
      const count = Number(gallery.dataset.placeholders) || 3;
      gallery.innerHTML = placeholderHTML().repeat(Math.min(count, limit));
      return;
    }

    gallery.innerHTML = photos.map((p, i) =>
      `<button type="button" data-full="${encodeURI(p.src)}" aria-label="${altBase} ${i + 1}">${pictureHTML(p, `${altBase} ${i + 1}`)}</button>`
    ).join('');
  });
}

// Click a photo: show it big. NEW: <dialog> has showModal() and close() built in.
function setupLightbox() {
  let box = null;
  document.addEventListener('click', e => {
    const btn = e.target.closest('.gallery button[data-full]');
    if (!btn) return;
    if (!box) {
      box = document.createElement('dialog');
      box.className = 'lightbox';
      box.innerHTML = '<img alt=""><button type="button"></button>';
      box.addEventListener('click', ev => { if (ev.target === box || ev.target.tagName === 'BUTTON') box.close(); });
      document.body.appendChild(box);
    }
    $('img', box).src = btn.dataset.full;
    $('img', box).alt = btn.getAttribute('aria-label') || '';
    $('button', box).textContent = t('common.close', 'Close');
    box.showModal();
  });
}

// The home hero photo: the first image in zynx/
function renderHero() {
  const slot = $('.hero-photo[data-folder]');
  if (!slot) return;
  const first = photosIn(slot.dataset.folder)[0];
  if (first) {
    // encodeURI turns spaces in file names (like "hero .jpeg") into %20 so CSS can read them
    slot.style.backgroundImage = `url("${encodeURI(first.webp || first.src)}")`;
    slot.classList.remove('is-empty');
  } else {
    slot.classList.add('is-empty');
  }
}

// Swap the text logo for the real logo (and favicon) once logo.svg exists
function renderLogo() {
  if (!media.logo) return;
  $$('.brand').forEach(b => {
    b.innerHTML = `<img src="${media.logo}" alt="engineered by chaos, the crazy arrow" width="160" height="40">`;
  });
  const fav = $('link[rel="icon"]');
  if (fav) fav.href = media.logo;
}


// ===================== 4. VIDEOS FROM assets/video =====================
// <div class="video-list" data-prefix="guitar"> shows every video whose file
// name starts with "guitar". If there are none, the whole section (marked
// with data-hide-if-empty) stays hidden.

function renderVideos() {
  $$('.video-list[data-prefix]').forEach(list => {
    const prefix = list.dataset.prefix.toLowerCase();
    const found = (media.videos || []).filter(v => v.split('/').pop().toLowerCase().startsWith(prefix));
    const section = list.closest('[data-hide-if-empty]');
    if (section) section.hidden = found.length === 0;
    list.innerHTML = found.map(src =>
      `<div class="video-frame"><video src="${src}" controls preload="none" playsinline></video></div>`
    ).join('');
  });
}


// ===================== 5. SCROLL FADE-IN + TAP FEEDBACK =====================

function setupReveal() {
  const items = $$('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const watcher = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        watcher.unobserve(entry.target);   // animate once, then stop watching
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => watcher.observe(el));
}

// Phones have no "hover", so a tap gives the card the same lift for a moment
function setupTapFeedback() {
  document.addEventListener('touchstart', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.add('is-tapped');
    setTimeout(() => card.classList.remove('is-tapped'), 600);
  }, { passive: true });
}


// ===================== 6. ORANGE SPARKS =====================
// A <canvas class="sparks"> inside a hero gets a few slow drifting sparks.
// Light on purpose: ~30 dots, paused when off screen or the tab is hidden.

function setupSparks() {
  if (reducedMotion) return;
  $$('canvas.sparks').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const count = Number(canvas.dataset.count) || 28;
    let w = 0, h = 0, running = false, sparks = [];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * ratio; canvas.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    function newSpark(anywhere) {
      return {
        x: w * (0.35 + Math.random() * 0.65),           // mostly on the photo side
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.6 + Math.random() * 1.6,
        vy: 0.15 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.25,
        life: Math.random() * Math.PI * 2,
      };
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      sparks.forEach((s, i) => {
        s.y -= s.vy; s.x += s.vx; s.life += 0.03;
        if (s.y < -10) sparks[i] = newSpark(false);
        const alpha = 0.35 + Math.sin(s.life) * 0.3;    // gentle flicker
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 82, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 110, 20, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    function start() { if (!running && !document.hidden) { running = true; requestAnimationFrame(frame); } }
    function stop() { running = false; }

    resize();
    sparks = Array.from({ length: count }, () => newSpark(true));
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  });
}


// ===================== 6b. TURNING GEARS =====================
// Draws a cluster of gears that really mesh: same tooth size, and each
// gear turns the opposite way at a speed set by its number of teeth.
// (A 30-tooth gear driving a 15-tooth gear makes it spin twice as fast.)

const MODULE = 6;   // tooth size. Pitch radius = teeth × MODULE / 2

// The outline of one gear, centred on (0,0), as an SVG path
function gearPath(teeth) {
  const pitch = (teeth * MODULE) / 2;
  const outer = pitch + MODULE;            // tip of the teeth
  const root = pitch - 1.25 * MODULE;      // bottom of the gaps
  const step = (Math.PI * 2) / teeth;      // angle from one tooth to the next
  const pt = (r, a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * step;                    // each tooth: up the flank, across the tip, down
    d += `${i ? 'L' : 'M'}${pt(root, a)} L${pt(outer, a + step * 0.15)} L${pt(outer, a + step * 0.45)} L${pt(root, a + step * 0.6)} `;
  }
  d += 'Z ';
  // a circle as a path (two half arcs). With fill-rule:evenodd these become HOLES.
  const hole = (cx, cy, r) => `M${(cx - r).toFixed(2)} ${cy.toFixed(2)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 `;
  d += hole(0, 0, MODULE * 1.6);           // the axle hole
  if (teeth >= 18) {                       // big gears get lightening holes
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      d += hole(Math.cos(a) * root * 0.58, Math.sin(a) * root * 0.58, root * 0.2);
    }
  }
  return d;
}

function addGears() {
  // [teeth, which gear it meshes with (index), direction from that gear in degrees]
  const layout = [
    [30, null, 0],
    [14, 0, 120],
    [22, 0, 200],
    [10, 1, 40],
  ];
  const PERIOD = 60;     // seconds for the big gear to turn once
  const gears = [];

  layout.forEach(([teeth, parentIndex, angleDeg]) => {
    const step = (Math.PI * 2) / teeth;
    const g = { teeth, step, x: 0, y: 0, rot: 0, dir: 1 };
    if (parentIndex !== null) {
      const p = gears[parentIndex];
      const theta = (angleDeg * Math.PI) / 180;
      const dist = ((p.teeth + teeth) * MODULE) / 2;          // the pitch circles touch
      g.x = p.x + Math.cos(theta) * dist;
      g.y = p.y + Math.sin(theta) * dist;
      g.dir = -p.dir;                                          // meshing gears turn opposite ways
      // Line the teeth up: where the parent has tooth fraction f, the child needs 0.5 − f
      const f = (((theta - p.rot) / p.step - 0.3) % 1 + 1) % 1;
      g.rot = theta + Math.PI - (0.8 - f) * step;
    }
    gears.push(g);
  });

  const deg = r => ((r * 180) / Math.PI).toFixed(2);
  const svgGears = gears.map(g => {
    const start = Number(deg(g.rot));
    const spin = reducedMotion ? '' :
      `<animateTransform attributeName="transform" type="rotate" from="${start}" to="${start + 360 * g.dir}"
        dur="${(PERIOD * g.teeth) / gears[0].teeth}s" repeatCount="indefinite"/>`;
    return `<g transform="translate(${g.x.toFixed(2)} ${g.y.toFixed(2)})">
        <g transform="rotate(${start})"><path class="gear-body" d="${gearPath(g.teeth)}"/>${spin}</g>
        <circle class="gear-axle" r="${MODULE * 0.7}"/>
      </g>`;
  }).join('');

  $$('.hero, .page-hero').forEach(hero => {
    const box = document.createElement('div');
    box.className = 'gears';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `<svg viewBox="-215 -105 320 310" xmlns="http://www.w3.org/2000/svg">${svgGears}</svg>`;
    hero.prepend(box);
  });
}


// ===================== 6c. EASTER EGG: "LIGHT MODE" =====================
// The switch in the header pretends to turn on light mode. It never does.
//   1st try: the knob slides over, gets yanked back   -> line egg.1
//   2nd try: same, plus a faint "flashbang"           -> line egg.2
//   3rd try and after: the switch just shakes "no"    -> line egg.3
// The count lives in sessionStorage, so a new visit starts the joke again.
// The lines themselves are in the i18n files (egg.1, egg.2, egg.3).

function setupLightModeEgg() {
  const toggle = $('.theme-toggle');
  if (!toggle) return;

  // The little message box (role="status" so screen readers read it out too)
  const toast = document.createElement('div');
  toast.className = 'egg-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<span class="egg-gear" aria-hidden="true"></span><span class="egg-text"></span>';
  document.body.appendChild(toast);

  let hideTimer = 0;
  let resetTimer = 0;

  toggle.addEventListener('click', () => {
    const tries = Math.min((Number(sessionGet('lightModeTries')) || 0) + 1, 3);
    sessionSet('lightModeTries', String(tries));

    // Restart the animation: remove the classes, force the browser to notice, add again
    toggle.classList.remove('is-trying', 'is-refusing');
    void toggle.offsetWidth;
    toggle.classList.add(tries < 3 ? 'is-trying' : 'is-refusing');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => toggle.classList.remove('is-trying', 'is-refusing'), 1000);

    // Attempt 2: a quick, faint white flash. (Skipped for people who turn motion off.)
    if (tries === 2 && !reducedMotion) {
      const flash = document.createElement('div');
      flash.className = 'egg-flash';
      document.body.appendChild(flash);
      flash.addEventListener('animationend', () => flash.remove());
    }

    const line = $(`.egg-lines [data-i18n="egg.${tries}"]`);
    $('.egg-text', toast).textContent = line ? line.textContent : '';
    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  });
}


// ===================== 6d. EASTER EGG: THE CAT BELOW THE FOOTER =====================
// There is nothing below the footer. But if a visitor is already at the very
// bottom and KEEPS trying to scroll down, a black pixel cat pops up from the
// bottom edge and tells them "That's it, folks!" (line egg.end in the i18n files).
// It isn't in the page at all until that happens. Scrolling back up sends it away.
//   mouse/trackpad: keep scrolling down at the bottom
//   phone/tablet:   keep swiping up at the bottom
//   keyboard:       press End / Page Down / Down arrow / Space a few more times
// Try to touch the cat (hover or click/tap) and it swipes its claws at you.

// The cat and its paw, drawn one "pixel" per letter:
//   o = orange outline   b = black fur   e = eye / claw   p = pupil   n = nose   . = empty
const CAT_PIXELS = [
  '.o.........o....',
  '.oo.......oo....',
  '.obo.....obo....',
  '.obbooooobbo....',
  '.obbbbbbbbbo....',
  'obbbbbbbbbbbo...',
  'obbeebbbeebbo...',
  'obbepbbbpebbo...',
  'obbbbbnbbbbbo...',
  '.obbbbbbbbbo..o.',
  '..obbbbbbbo...o.',
  '.obbbbbbbbbo.o..',
  'obbbbbbbbbbboo..',
  'obbbbbbbbbbbo...',
  'obbobbbbbobbo...',
  '.ooooooooooo....',
];
const PAW_PIXELS = [
  '.e.e.e.',
  '.e.e.e.',
  'ooooooo',
  'obbbbbo',
  'obbbbbo',
  '.obbbo.',
  '.obbbo.',
  '.obbbo.',
];
const CAT_COLORS = { o: '#ff7a1a', b: '#0b0907', e: '#ffa552', p: '#0b0907', n: '#ff7a1a' };

// Turns a letter grid into an SVG made of little squares
function pixelSVG(pixels, className) {
  let rects = '';
  pixels.forEach((row, y) => {
    // join runs of the same colour into one wide rectangle (fewer shapes)
    for (let x = 0; x < row.length;) {
      const c = row[x];
      let run = 1;
      while (row[x + run] === c) run++;
      if (CAT_COLORS[c]) {
        rects += `<rect class="px-${c}" x="${x}" y="${y}" width="${run}" height="1" fill="${CAT_COLORS[c]}"/>`;
      }
      x += run;
    }
  });
  return `<svg class="${className}" viewBox="0 0 ${pixels[0].length} ${pixels.length}"
    shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function setupFooterCat() {
  const doc = document.documentElement;
  // "at the bottom" = less than 4px of page left below the screen
  const atBottom = () => window.innerHeight + window.scrollY >= doc.scrollHeight - 4;

  let cat = null;        // created the first time it's needed
  let shown = false;
  let hideTimer = 0;
  let reachedBottomAt = 0;
  let push = 0;          // how hard they've tried to scroll past the end (in px)
  let lastPushAt = 0;
  let lastSwipeAt = 0;

  function show() {
    if (!cat) build();
    const line = $('.egg-lines [data-i18n="egg.end"]');
    $('.egg-bubble', cat).textContent = line ? line.textContent : "That's it, folks!";
    cat.classList.add('show');
    shown = true;
    push = 0;
    scheduleHide();
  }

  function hide() {
    if (cat) cat.classList.remove('show');
    shown = false;
    push = 0;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 6000);
  }

  function build() {
    cat = document.createElement('div');
    cat.className = 'egg-cat';
    cat.setAttribute('role', 'status');
    cat.innerHTML = `<p class="egg-bubble"></p>
      <div class="egg-cat-body">${pixelSVG(CAT_PIXELS, 'egg-cat-art')}${pixelSVG(PAW_PIXELS, 'egg-paw')}</div>`;
    document.body.appendChild(cat);
    void cat.offsetWidth;   // let the browser place it off-screen first, so it slides in

    const body = $('.egg-cat-body', cat);
    // Hovering: the cat swipes at the pointer (and stays while you're near it)
    body.addEventListener('pointermove', e => {
      clearTimeout(hideTimer);
      if (e.pointerType === 'mouse' && Date.now() - lastSwipeAt > 650) swipe(e.clientX, e.clientY);
    });
    body.addEventListener('pointerleave', scheduleHide);
    // Clicking or tapping: always swipes
    body.addEventListener('pointerdown', e => {
      e.preventDefault();
      clearTimeout(hideTimer);
      swipe(e.clientX, e.clientY);
      if (e.pointerType !== 'mouse') scheduleHide();
    });
  }

  // One claw swipe toward the point (x, y) on the screen
  function swipe(x, y) {
    lastSwipeAt = Date.now();
    const body = $('.egg-cat-body', cat);
    const paw = $('.egg-paw', cat);
    const box = body.getBoundingClientRect();
    // the paw starts at the cat's chest
    const fromX = box.left + box.width * 0.4;
    const fromY = box.top + box.height * 0.55;
    let dx = x - fromX;
    let dy = y - fromY;
    const reach = Math.hypot(dx, dy) || 1;
    const max = 70;   // how far a cat arm stretches, in px
    if (reach > max) { dx *= max / reach; dy *= max / reach; }
    // angle so the claws point at the pointer (0deg = claws straight up)
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    paw.style.setProperty('--dx', dx + 'px');
    paw.style.setProperty('--dy', dy + 'px');
    paw.style.setProperty('--rot', angle + 'deg');

    // restart the animation
    cat.classList.remove('is-clawing');
    void cat.offsetWidth;
    cat.classList.add('is-clawing');
    cat.classList.toggle('lean-left', dx < 0);

    // three scratch marks right where the pointer is
    const marks = document.createElement('div');
    marks.className = 'egg-scratch';
    marks.style.left = x + 'px';
    marks.style.top = y + 'px';
    marks.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(marks);
    setTimeout(() => marks.remove(), 700);
  }

  // Count "extra" scrolling. A short pause resets the count, so a single
  // flick that happens to land on the footer doesn't set it off.
  function addPush(amount) {
    const now = Date.now();
    if (now - lastPushAt > 1200) push = 0;
    lastPushAt = now;
    if (now - reachedBottomAt < 350) return;   // ignore the scroll that just arrived here
    push += amount;
    if (push > 500 && !shown) show();
  }

  window.addEventListener('scroll', () => {
    if (atBottom()) {
      if (!reachedBottomAt) reachedBottomAt = Date.now();
    } else {
      reachedBottomAt = 0;
      push = 0;
      // they scrolled back up a bit: off you go, cat
      if (shown && window.innerHeight + window.scrollY < doc.scrollHeight - 80) hide();
    }
  }, { passive: true });

  // Mouse wheel / trackpad
  window.addEventListener('wheel', e => {
    if (e.deltaY <= 0 || !atBottom()) return;
    if (!reachedBottomAt) reachedBottomAt = Date.now() - 1000;   // page too short to scroll at all
    addPush(e.deltaMode === 1 ? e.deltaY * 16 : Math.min(e.deltaY, 150));
  }, { passive: true });

  // Touch: once at the bottom, measure how far the finger keeps pushing up
  let anchorY = null;
  window.addEventListener('touchmove', e => {
    const y = e.touches[0].clientY;
    if (!atBottom()) { anchorY = null; return; }
    if (anchorY === null) { anchorY = y; return; }
    if (anchorY - y > 110 && !shown) show();
  }, { passive: true });
  window.addEventListener('touchend', () => (anchorY = null), { passive: true });

  // Keyboard
  let keyTries = 0;
  window.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (!['End', 'PageDown', 'ArrowDown', ' '].includes(e.key) || !atBottom()) { keyTries = 0; return; }
    if (++keyTries >= 3 && !shown) show();
  });
}


// ===================== 6e. EASTER EGG: HOLD THE LOGO (HOME PAGE ONLY) =====================
// Press and HOLD the "engineered by chaos" logo in the header for 5 seconds
// on the home page, and a little message pops up. While you hold, the logo's
// gear spins faster and faster. Let go early and nothing happens (a normal
// quick click still just goes to the home page).
// The message isn't translated on purpose; it's the same in every language.
const TWIN_MESSAGE = 'anneyong twin 😉 i see u lynne';
const TWIN_HOLD_MS = 5000;

function setupTwinEgg() {
  if (!$('.hero')) return;              // only the home page has the big hero
  const brand = $('.site-header .brand');
  if (!brand) return;

  let holdTimer = 0;
  let fired = false;                    // true right after the message popped
  let popup = null;
  let hideTimer = 0;

  function startHold(e) {
    if (e.button > 0) return;           // left mouse button / finger only
    fired = false;
    brand.classList.add('is-holding');
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      fired = true;
      brand.classList.remove('is-holding');
      show();
    }, TWIN_HOLD_MS);
  }
  function stopHold() {
    clearTimeout(holdTimer);
    brand.classList.remove('is-holding');
  }

  function show() {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'egg-twin';
      popup.setAttribute('role', 'status');
      popup.innerHTML = '<p class="egg-twin-text"></p>';
      popup.addEventListener('click', hide);
      document.body.appendChild(popup);
      void popup.offsetWidth;           // so the pop-in animation plays the first time too
    }
    $('.egg-twin-text', popup).textContent = TWIN_MESSAGE;
    popup.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 6000);
  }
  function hide() {
    if (popup) popup.classList.remove('show');
  }

  brand.addEventListener('pointerdown', startHold);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => brand.addEventListener(type, stopHold));
  // After a successful hold, don't also follow the logo's link
  brand.addEventListener('click', e => {
    if (fired) { e.preventDefault(); fired = false; }
  });
  // Phones: a long press normally opens the "open link / copy link" menu. Not here.
  brand.addEventListener('contextmenu', e => e.preventDefault());
  brand.addEventListener('dragstart', e => e.preventDefault());
}


// ===================== 7. CONTACT FORM =====================
// Until you paste your Formspree ID into the form's action (see README),
// pressing Send opens the visitor's email app with the message filled in.

function setupContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const status = $('.form-status', form);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);

    if (form.action.includes('YOUR_FORM_ID')) {
      const subject = encodeURIComponent('Portfolio contact from ' + (data.get('name') || ''));
      const body = encodeURIComponent(`${data.get('message') || ''}\n\n${data.get('name') || ''}\n${data.get('email') || ''}`);
      location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    status.textContent = t('contact.sending', 'Sending…');
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = t('contact.sent', 'Thanks! Your message is on its way.');
    } catch (err) {
      status.textContent = t('contact.error', 'That didn\'t send. Please email me directly.');
    }
  });
}


// ===================== 8. SONG EMBED + PROGRESS BARS =====================
// guitar.html: paste a YouTube or Spotify link into data-song-url="" and
// the player appears in place of "Coming soon".

function songEmbedURL(url) {
  const yt = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, height: 360 };
  const sp = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/(\w+)/);
  if (sp) return { src: `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`, height: 152 };
  return null;
}

function setupSong() {
  const panel = $('.song-panel[data-song-url]');
  if (!panel) return;
  const embed = songEmbedURL(panel.dataset.songUrl.trim());
  if (!embed) return;
  $$('.song-soon', panel).forEach(el => (el.hidden = true));
  $('.song-embed', panel).innerHTML =
    `<iframe src="${embed.src}" height="${embed.height}" title="Twenty Three" loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

// <div class="progress" data-value="80"><span></span></div>
function renderProgress() {
  $$('.progress[data-value]').forEach(bar => {
    const value = Math.max(0, Math.min(100, parseFloat(bar.dataset.value) || 0));
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', String(value));
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    // wait one frame so the bar animates from 0
    requestAnimationFrame(() => ($('span', bar).style.width = value + '%'));
  });
}


// ===================== START EVERYTHING =====================
async function init() {
  buildChrome();
  drawIcons();
  addGears();
  setupLanguageSwitch();
  setupLightbox();
  setupTapFeedback();
  setupContactForm();
  setupLightModeEgg();
  setupFooterCat();
  setupTwinEgg();
  setupSong();

  // A link like about.html?lang=ja opens straight in Japanese
  const fromLink = new URLSearchParams(location.search).get('lang');
  await setLanguage(fromLink || storageGet('lang') || 'en');

  media = (await getJSON('assets/media.json')) || media;
  renderLogo();
  renderHero();
  renderGalleries();
  renderVideos();
  renderProgress();

  // Placeholder text and progress bars follow the language
  document.addEventListener('langchange', () => { renderGalleries(); renderProgress(); });

  setupReveal();
  setupSparks();
}

init();
