function loadNewsCache() {
  try {
    const raw = localStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return;
    const c = JSON.parse(raw);
    if (!c || !c.news || !Array.isArray(c.news)) return;
    const age = Date.now() - c.ts;
    if (age > NEWS_CACHE_TTL * 2) return;
    c.news.forEach(n => { n.pub = new Date(n.pub); });
    news = c.news;
    news.sort((a, b) => b.pub - a.pub);
    renderHero(); renderCatSecs(); updateCounts(); renderBreaking();
  } catch { }
}

function saveNewsCache() {
  try {
    const toSave = smartTrimNews(news, 300, 15).map(n => ({ ...n, pub: n.pub instanceof Date ? n.pub.toISOString() : n.pub }));
    localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ ts: Date.now(), news: toSave }));
  } catch { }
}
function saveWxCache() {
  try { localStorage.setItem(WX_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: WEATHER_DATA })); } catch { }
}
function loadWxCache() {
  try {
    const raw = localStorage.getItem(WX_CACHE_KEY); if (!raw) return;
    const c = JSON.parse(raw);
    if (!c || !c.data || Date.now() - c.ts > WX_CACHE_TTL) return;
    WEATHER_DATA.splice(0, WEATHER_DATA.length, ...c.data);
  } catch { }
}
function loadSeen() {
  try { const d = JSON.parse(localStorage.getItem('bn24_seen') || '{}'); const cut = Date.now() - 24 * 3600000; Object.entries(d).forEach(([u, t]) => { if (t > cut) seenUrls.add(u); }); } catch { }
}
function saveSeen() {
  try { const d = {}; seenUrls.forEach(u => { d[u] = Date.now(); }); localStorage.setItem('bn24_seen', JSON.stringify(d)); } catch { }
}

function smartTrimNews(newsArr, maxGlobal, minPerCat) {
  const catItems = {};
  CATS.forEach(c => catItems[c] = []);
  const others = [];
  for (const n of newsArr) {
    if (CATS.includes(n.category) && catItems[n.category].length < minPerCat) {
      catItems[n.category].push(n);
    } else {
      others.push(n);
    }
  }
  const result = [];
  CATS.forEach(c => result.push(...catItems[c]));
  const rem = maxGlobal - result.length;
  if (rem > 0) result.push(...others.slice(0, rem));
  result.sort((a, b) => b.pub - a.pub);
  return result;
}

// ── UTILS ──
function ago(d) {
  if (!d || isNaN(new Date(d))) return 'অজানা';
  const dt = new Date(d);
  const s = (Date.now() - dt) / 1000;
  let t = '';
  if (s < 60) t = 'এইমাত্র';
  else if (s < 3600) t = Math.floor(s / 60) + ' মিনিট আগে';
  else if (s < 86400) t = Math.floor(s / 3600) + ' ঘণ্টা আগে';
  else t = Math.floor(s / 86400) + ' দিন আগে';
  
  const dateStr = dt.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  return t + ' • ' + dateStr;
}
function e(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function setP(p) { document.getElementById('prog').style.width = p + '%'; }
function toast(msg, err = false) {
  const c = document.getElementById('toasts'); const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.innerHTML = `<i class="fas fa-${err ? 'exclamation-circle' : 'check-circle'}"></i> ${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ══════════════════════════════════════