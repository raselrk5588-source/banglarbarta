function refreshCards() { renderHero(); renderWeather(); if (curCat === 'সব') renderCatSecs(); else renderFiltered(); }
function updateSubUI() {
  const s = isSub();
  document.getElementById('subBtn').style.display = s ? 'none' : 'flex';
  const pm = document.getElementById('profileMenu');
  if (pm) pm.style.display = s ? 'block' : 'none';
  
  const pf = document.getElementById('premiumFeaturesSection');
  if (pf) pf.style.display = s ? 'none' : 'block';
  
  if (s) {
    try {
      const phone = localStorage.getItem('phone');
      if (phone) {
        const pnEl = document.getElementById('profNumber');
        if (pnEl) pnEl.textContent = phone;
      }
    } catch(e) {}
  }
}

function toggleProfileMenu() {
  const pd = document.getElementById('profileDropdown');
  if (pd) pd.classList.toggle('show');
}

document.addEventListener('click', ev => {
  const pm = document.getElementById('profileMenu');
  if (pm && !pm.contains(ev.target)) {
    const pd = document.getElementById('profileDropdown');
    if (pd) pd.classList.remove('show');
  }
});
function openPW(url) { window.location.href = 'auth/login.html'; }
function closePW() { document.getElementById('pwOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function clickNews(url) { window.open(url, '_blank', 'noopener,noreferrer'); }

function openNewsModal(url) {
  if (!isSub()) {
    openPW(url);
    return;
  }
  const item = news.find(n => n.link === url);
  if (!item) return;
  const content = document.getElementById('nsContent');
  const imgHtml = item.image ? `<img src="${e(item.image)}" class="ns-img" alt="">` : '';
  content.innerHTML = `
    ${imgHtml}
    <div class="ns-body">
      <span class="ns-cat c-${item.category}">${item.category}</span>
      <div class="ns-title">${e(item.title)}</div>
      <div class="ns-meta">
        <span><i class="fas fa-newspaper"></i> ${e(item.source)}</span>
        <span><i class="fas fa-clock"></i> ${ago(item.pub)}</span>
      </div>
      <div class="ns-desc">${e(item.desc || 'বিস্তারিত জানতে মূল সংবাদটি পড়ুন।')}</div>
    </div>
  `;
  const readBtn = document.getElementById('nsReadBtn');
  readBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> বিস্তারিত পড়ুন';
  readBtn.onclick = () => {
    closeNewsModal();
    clickNews(url);
  };
  const overlay = document.getElementById('nsOverlay');
  overlay.style.display = 'flex';
  // Small delay to allow the browser to process display:flex before adding .open
  // This ensures the CSS transition runs smoothly.
  setTimeout(() => {
    overlay.classList.add('open');
  }, 10);
  document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
  const overlay = document.getElementById('nsOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // Wait for the CSS transition to complete before setting display to none
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
}

// ── RESPONSIVE FIX (JS — CSS media query bypass) ──
function applyResponsive() {
  const w = window.innerWidth;
  const row = document.getElementById('heroWeatherRow');
  const wc = document.getElementById('wcGrid');
  const heroSec = document.getElementById('heroSec');
  const weatherCard = document.getElementById('weatherCard');
  const hw = document.getElementById('heroWrap');
  const fg = document.getElementById('filtGrid');

  // ── hero-weather-row ──
  if (row && row.style.display !== '' && row.style.display !== 'none') {
    if (w <= 820) {
      // মোবাইল: নিচে নিচে স্ট্যাক
      row.style.cssText = 'display:block;margin-bottom:22px;';
      if (heroSec) { heroSec.style.cssText = 'width:100%;'; }
      if (weatherCard) { weatherCard.style.cssText = 'display:block;width:100%;margin-top:14px;'; }
      // hero-wrap: মোবাইলে ১ কলাম (side list লুকানো CSS-এ)
      if (hw) { hw.style.gridTemplateColumns = '1fr'; }
    } else if (w <= 1000) {
      row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:16px;margin-bottom:36px;align-items:stretch;';
      if (heroSec) { heroSec.style.cssText = ''; }
      if (weatherCard) { weatherCard.style.cssText = ''; }
      if (hw) { hw.style.gridTemplateColumns = '1fr'; }
    } else {
      // desktop: আগের মতো
      row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 255px;gap:16px;margin-bottom:36px;align-items:stretch;';
      if (heroSec) { heroSec.style.cssText = ''; }
      if (weatherCard) { weatherCard.style.cssText = ''; }
      if (hw) { hw.style.gridTemplateColumns = w > 1100 ? '1fr 300px' : '1fr'; }
    }
  }

  // ── weather grid: সবসময় ২ কলাম ──
  if (wc) {
    wc.style.display = 'grid';
    wc.style.gridTemplateColumns = '1fr 1fr';
    wc.style.gap = w <= 480 ? '4px' : '6px';
  }

  // ── filtered grid ──
  if (fg) { fg.style.gridTemplateColumns = w > 680 ? 'repeat(3,1fr)' : '1fr 1fr'; }
}

// ══════════════════════════════════════
// THEME CUSTOMIZER
// ══════════════════════════════════════
const THEME_PRESETS = {
  light: {
    '--bg': '#f0f2f7', '--bg2': '#ffffff', '--bg3': '#e8ecf4',
    '--card': '#ffffff', '--card2': '#f0f4fb', '--border': '#dde3f0',
    '--text': '#1a1a2e', '--text2': '#5a6080', '--text3': '#9aa0b8',
    '--header-bg': 'rgba(240,242,247,0.97)', '--nav-bg': 'rgba(255,255,255,0.98)',
    '--weather-bg': 'linear-gradient(135deg,#ddeeff,#c8e0ff)',
    '--weather-border': 'rgba(30,100,255,.2)', '--pw-overlay-bg': 'rgba(240,242,247,0.95)',
    '--wc-accent': '#2255a0', '--wc-item-bg': 'rgba(0,30,100,.05)', '--wc-item-border': 'rgba(0,60,180,.12)',
  },
  dark: {
    '--bg': '#07070f', '--bg2': '#0c0c1e', '--bg3': '#111128',
    '--card': '#10101f', '--card2': '#171730', '--border': '#1c1c3a',
    '--text': '#eeeeff', '--text2': '#8888bb', '--text3': '#4a4a77',
    '--header-bg': 'rgba(7,7,15,0.99)', '--nav-bg': 'rgba(12,12,30,0.98)',
    '--weather-bg': 'linear-gradient(135deg,#0a1628,#0d2444)',
    '--weather-border': 'rgba(99,162,255,.25)', '--pw-overlay-bg': 'rgba(7,7,15,0.95)',
    '--wc-accent': '#7aabff', '--wc-item-bg': 'rgba(255,255,255,.04)', '--wc-item-border': 'rgba(99,162,255,.15)',
  }
};

function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function applyPreset(name) {
  if (!THEME_PRESETS[name]) return;
  applyThemeVars(THEME_PRESETS[name]);
  localStorage.setItem('patrika_theme', JSON.stringify({ type: 'preset', name }));
  
  const btnIcon = document.querySelector('#themeBtn i');
  if (btnIcon) {
    btnIcon.className = name === 'dark' ? 'fas fa-lightbulb' : 'fas fa-moon';
  }
}

function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem('patrika_theme') || 'null');
    if (saved && saved.type === 'preset' && (saved.name === 'dark' || saved.name === 'light')) {
      applyPreset(saved.name);
    } else {
      applyPreset('light');
    }
  } catch {
    applyPreset('light');
  }
}

function toggleTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem('patrika_theme') || 'null');
    const current = (saved && saved.name === 'dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyPreset(next);
  } catch {
    applyPreset('dark');
  }
}