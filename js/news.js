// ── FAST FETCH — Distribute load across proxies ──
async function fetchWithRace(url) {
  const shuffled = [...PROXIES].sort(() => Math.random() - 0.5);
  const cbUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
  for (const proxy of shuffled) {
    try {
      const targetUrl = proxy.url + (proxy.encode ? encodeURIComponent(cbUrl) : cbUrl);
      const res = await fetch(targetUrl, { signal: AbortSignal.timeout(8000), cache: 'no-store' });
      if (!res.ok) continue;
      const txt = await res.text();
      if (txt.trim().startsWith('{')) {
        try { return JSON.parse(txt).contents || txt; } catch { return txt; }
      }
      return txt;
    } catch (e) {
      // ignore and try next
    }
  }
  throw new Error('all proxies failed');
}

function getImg(item) {
  const MNS = 'http://search.yahoo.com/mrss/';
  for (const tag of ['content', 'thumbnail']) { const el = item.getElementsByTagNameNS(MNS, tag)[0]; if (el) { const u = el.getAttribute('url'); if (u && !u.includes('data:')) return u; } }
  const enc = item.querySelector('enclosure'); if (enc) { const u = enc.getAttribute('url'); if (u) return u; }
  const media = item.querySelector('content, group > content'); if (media && media.getAttribute('url')) return media.getAttribute('url');
  const CNS = 'http://purl.org/rss/1.0/modules/content/';
  const ce = item.getElementsByTagNameNS(CNS, 'encoded')[0];
  if (ce) { const m = ce.textContent.match(/<img[^>]+src=["']([^"']+)["']/i); if (m && !m[1].includes('data:')) return m[1]; }
  const desc = item.querySelector('description')?.textContent || '';
  const dm = desc.match(/<img[^>]+src=["']([^"']+)["']/i); if (dm && !dm[1].includes('data:')) return dm[1];
  return null;
}

function parseRSS(xml, src) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml'); const out = [];
  doc.querySelectorAll('item').forEach(it => {
    const title = (it.querySelector('title')?.textContent || '').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
    const link = (it.querySelector('link')?.textContent || it.querySelector('link')?.nextSibling?.nodeValue || '').trim();
    const raw = it.querySelector('description')?.textContent || '';
    const desc = raw.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().substring(0, 220);
    const pub = it.querySelector('pubDate')?.textContent || '';
    const image = getImg(it);
    const rssCat = it.querySelector('category')?.textContent?.trim() || '';
    const category = detectCat(title + ' ' + desc, rssCat, src.cat);
    if (!title || !link) return;
    out.push({ title, link, desc, pub: pub ? new Date(pub) : new Date(), image, category, source: src.name, isNew: false });
  });
  return out;
}

const ACCIDENT_RE = /সড়ক দুর্ঘটনা|বাস দুর্ঘটনা|ট্রেন দুর্ঘটনা|নৌকা দুর্ঘটনা|নৌ দুর্ঘটনা|দুর্ঘটনায় নিহত|দুর্ঘটনায় আহত|মর্মান্তিক দুর্ঘটনা|পথ দুর্ঘটনা|যানবাহন দুর্ঘটনা|road accident|bus crash|train accident/i;
const CRIME_RE = /ধর্ষণ|হত্যা মামলা|খুন|ডাকাতি|ছিনতাই|অপহরণ|চুরি|নির্যাতন|গ্রেফতার|মাদক|অস্ত্র উদ্ধার|হামলা|সন্ত্রাস|murder|rape|robbery|arrested|drug bust/i;
const STRONG_INTL_RE = /জাতিসংঘ|বিশ্বব্যাংক|আন্তর্জাতিক|ন্যাটো|ইউরোপীয় ইউনিয়ন|ট্রাম্প|বাইডেন|পুতিন|মোদি|জিনপিং|গাজায়|গাজার|ইউক্রেনে|ইউক্রেনের|ইসরায়েলে|ইসরায়েলের|ফিলিস্তিনে|ফিলিস্তিনের|আফগানিস্তানে|মিয়ানমারে|তালেবান|হামাস|হিজবুল্লাহ|বিদেশে|প্রবাসী|জলবায়ু সম্মেলন|জি-২০|আসিয়ান|ওয়াশিংটনে|লন্ডনে|প্যারিসে|বেইজিংয়ে|মস্কোয়|নয়াদিল্লিতে|টোকিওতে|ভারত|পাকিস্তান|আমেরিকা|যুক্তরাষ্ট্র|মার্কিন|চীন|রাশিয়া|নেপাল|ভুটান|শ্রীলঙ্কা|মালদ্বীপ|সৌদি|ইরান|ইরাক|সিরিয়া|লেবানন|united nations|world bank|imf|nato|trump|biden|putin|modi|xi jinping|international|ukraine|israel|hamas/i;
// Keywords that clearly indicate Bangladesh-specific news
const BANGLADESH_RE = /বাংলাদেশ|বাংলাদেশে|বাংলাদেশের|বাংলাদেশি|বাংলাদেশী|ঢাকা|ঢাকায়|ঢাকার|চট্টগ্রাম|সিলেট|রাজশাহী|খুলনা|বরিশাল|ময়মনসিংহ|রংপুর|গাজীপুর|নারায়ণগঞ্জ|কুমিল্লা|ফরিদপুর|বগুড়া|কক্সবাজার|জাতীয় সংসদ|অন্তর্বর্তী সরকার|ইউনূস|শেখ হাসিনা|খালেদা জিয়া|তারেক রহমান|মির্জা ফখরুল|আওয়ামী লীগ|বিএনপি|জামায়াত|শিবির|ছাত্রদল|যুবদল|ছাত্রলীগ|জাতীয় পার্টি|বিসিবি|বাংলাদেশ ব্যাংক|র‌্যাব|র‍্যাব|ডিএমপি|বিজিবি|উপজেলা|ইউনিয়ন|পৌরসভা|সিটি কর্পোরেশন|bangladesh|dhaka|bd govt/i;

function detectCat(text, rss, def) {
  const r = (rss || '').toLowerCase();
  const isBD = BANGLADESH_RE.test(text);

  // 1. Explicitly check for universal topics in RSS category first
  if (/খেলাধুলা|স্পোর্টস|খেলা|\bsports\b/.test(r)) return 'খেলাধুলা';
  if (/বিনোদন|মনোরঞ্জন|\bentertainment\b/.test(r)) return 'বিনোদন';
  if (/প্রযুক্তি|বিজ্ঞান|আইটি|\btech\b|\bit\b|\bscience\b/.test(r)) return 'প্রযুক্তি';
  if (/স্বাস্থ্য|সুস্থতা|মেডিকেল|\bhealth\b|\bwellness\b/.test(r)) return 'স্বাস্থ্য';
  if (/শিক্ষা|এডুকেশন|\beducation\b/.test(r)) return 'শিক্ষা';
  if (/চাকরি|ক্যারিয়ার|\bjob\b|\bjobs\b/.test(r)) return 'চাকরি';
  if (/রাজনীতি|\bpolitics\b|\bpolitical\b/.test(r)) return 'রাজনীতি';

  // 2. Universal topics from TEXT
  const UNIVERSAL = ['খেলাধুলা', 'বিনোদন', 'প্রযুক্তি', 'স্বাস্থ্য', 'শিক্ষা', 'চাকরি', 'রাজনীতি'];
  for (const c of UNIVERSAL) { if (CAT_RE[c] && CAT_RE[c].test(text)) return c; }

  // 3. Business logic (Depends on location)
  if (/ব্যবসা|বাণিজ্য|অর্থনীতি|\bbusiness\b|\beconomy\b/.test(r) || (CAT_RE['ব্যবসা'] && CAT_RE['ব্যবসা'].test(text))) {
    return isBD ? 'ব্যবসা' : 'আন্তর্জাতিক';
  }

  // 4. Now, check if RSS explicitly says International or National
  if (/আন্তর্জাতিক|বিশ্ব|বিদেশ|ইউরোপ|আমেরিকা|এশিয়া|আফ্রিকা|মধ্যপ্রাচ্য|foreign|\binternational\b|\bworld\b/.test(r)) return 'আন্তর্জাতিক';
  if (/জাতীয়|সারাদেশ|দেশ|বাংলাদেশ|\bnational\b|\bbangladesh\b|\bcountry\b/.test(r)) return 'জাতীয়';

  // 5. Strong International regex from text
  const isIntl = CAT_RE['আন্তর্জাতিক'] && CAT_RE['আন্তর্জাতিক'].test(text);
  
  // 6. Accidents/Crimes
  if (ACCIDENT_RE.test(text) || CRIME_RE.test(text)) {
     if (isIntl) return 'আন্তর্জাতিক';
     return 'জাতীয়';
  }

  // 7. Default fallbacks
  if (isIntl) return 'আন্তর্জাতিক';
  
  if (def === 'আন্তর্জাতিক') {
     return isBD ? 'জাতীয়' : 'আন্তর্জাতিক';
  }

  return 'জাতীয়';
}

function parseRSS2JSON(data, src) {
  const out = [];
  if (!data.items) return out;
  data.items.forEach(it => {
    const title = (it.title || '').replace(/\s+/g, ' ').trim();
    let rawDesc = (it.description || '').replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().substring(0, 220);
    let image = it.thumbnail || (it.enclosure && it.enclosure.link);
    if (!image) { const m = (it.description || '').match(/<img[^>]+src=["']([^"']+)["']/i); if (m) image = m[1]; }
    const category = detectCat(title + ' ' + rawDesc, it.categories ? it.categories[0] : '', src.cat);
    out.push({ title, link: it.link, desc: rawDesc, pub: new Date(it.pubDate), image, category, source: src.name, isNew: false, rssCat: it.categories ? it.categories[0] : '' });
  });
  return out;
}

async function fetchSrc(src) {
  try {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(src.url), { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok') { srcStat[src.name] = 'ok'; return parseRSS2JSON(data, src); }
    }
  } catch (e) { console.warn(src.name, "rss2json failed", e.message); }

  try { const xml = await fetchWithRace(src.url); srcStat[src.name] = 'ok'; return parseRSS(xml, src); }
  catch (e) { console.warn(src.name, "all proxies failed", e.message); srcStat[src.name] = 'err'; return []; }
}

let renderTimer = null;
function scheduleRender() {
  if (renderTimer) return;
  renderTimer = setTimeout(() => {
    updateCounts(); renderBreaking(); renderHero();
    if (curCat === 'সব') renderCatSecs(); else renderFiltered();
    renderTimer = null;
  }, 500);
}

async function fetchAll() {
  setP(5);
  const urlSet = new Set(news.map(n => n.link));
  const titleSet = new Set(news.map(n => n.title.toLowerCase().trim()));
  let loaded = 0, newCount = 0;

  const fetchPromises = SOURCES.map(async (src) => {
    try {
      await new Promise(r => setTimeout(r, Math.random() * 800)); // stagger slightly to avoid rate limit
      const items = await fetchSrc(src);
      let added = 0;
      items.forEach(it => {
        if (!it.image) return; // ছবি না থাকলে বাদ, অন্য পোর্টাল থেকে ছবিসহ খবর আসলে সেটা যোগ হবে
        const norm = it.title.toLowerCase().trim();
        if (urlSet.has(it.link) || titleSet.has(norm)) return;
        urlSet.add(it.link); titleSet.add(norm);
        it.isNew = !seenUrls.has(it.link);
        if (it.isNew) seenUrls.add(it.link);
        news.push(it); added++; newCount++;
      });
      if (added > 0) { 
        news.sort((a, b) => b.pub - a.pub); 
        news = smartTrimNews(news, 700, 25); 
        scheduleRender();
      }
      loaded++;
      setP(5 + Math.round(loaded / SOURCES.length * 85));
    } catch (e) { }
  });

  await Promise.all(fetchPromises);

  saveSeen();
  saveNewsCache();
  document.getElementById('updTime').textContent = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  setP(100); setTimeout(() => setP(0), 500);
  toast(newCount > 0 ? newCount + 'টি নতুন খবর পাওয়া গেছে' : 'সব খবর আপডেট হয়েছে');
}

// ── RENDER ──
function renderBreaking() {
  const items = news.filter(n => n.category !== 'আন্তর্জাতিক').slice(0, 20); if (!items.length) return;
  const html = items.map(i => `<span class="b-item" onclick="openNewsModal('${e(i.link)}')"><span class="b-dot">●</span>${e(i.title)}</span>`);
  document.getElementById('breakTrack').innerHTML = [...html, ...html].join('');
}

function renderHero() {
  const sec = document.getElementById('heroWeatherRow');
  if (news.length < 2) { sec.style.display = 'none'; return; }
  // প্রথমে display সেট করি, তারপর responsive fix
  sec.style.display = 'block';
  applyResponsive();
  const bdNews = news.filter(n => {
    if (n.category !== 'জাতীয়') return false;
    const text = (n.title + ' ' + (n.desc || '')).toLowerCase();
    if (STRONG_INTL_RE.test(text)) return false;
    return true;
  });
  if (!bdNews.length) { sec.style.display = 'none'; return; }
  const top = bdNews.slice(0, 5); const h = top[0];

  const imgUrl = h.image || '';
  const bg = imgUrl ? `url('${e(imgUrl)}')` : 'var(--bg3)';
  const sub = isSub();

  let imgErrorTag = imgUrl ? `<img src="${e(imgUrl)}" style="display:none" onerror="this.parentElement.style.backgroundImage='none';this.parentElement.style.backgroundColor='var(--bg3)';">` : '';

  document.getElementById('heroWrap').innerHTML = `
    <div class="hero-main" onclick="openNewsModal('${e(h.link)}')">
      <div class="hero-img-bg" style="background-image:${bg};background-size:cover;background-position:center">${imgErrorTag}</div>
      <div class="hero-fade"></div>
      <div class="hero-body">
        <div class="hero-cat-badge">${h.category}</div>
        <div class="hero-headline">${e(h.title)}</div>
        <div class="hero-meta"><span><i class="fas fa-newspaper"></i> ${e(h.source)}</span><span><i class="fas fa-clock"></i> ${ago(h.pub)}</span></div>
      </div>
    </div>
    <div class="side-list">${top.slice(1, 5).map((it, i) => `
      <div class="side-item" onclick="openNewsModal('${e(it.link)}')">
        <div class="side-n">${i + 1}</div>
        <div><div class="side-cat-lbl">${it.category}</div><div class="side-headline">${e(it.title)}</div><div class="side-when">${ago(it.pub)} · ${e(it.source)}</div></div>
      </div>`).join('')}
    </div>`;
}

function renderCatSecs() {
  document.getElementById('filteredSec').style.display = 'none';
  document.getElementById('catSecs').innerHTML = CATS.map(cat => {
    const items = news.filter(n => n.category === cat).slice(0, 3);
    if (!items.length) return '';
    return `<div class="cat-section">
      <div class="sec-hdr">
        <div class="sec-title"><div class="sec-bar"></div>${ICONS[cat] || '📰'} ${cat}</div>
        <button class="see-all" onclick="jumpCat('${cat}')"><i class="fas fa-arrow-right"></i> সব দেখুন</button>
      </div>
      <div class="cat-3col">${items.map(it => card(it)).join('')}</div>
    </div>`;
  }).join('');
}

function renderFiltered() {
  document.getElementById('catSecs').innerHTML = '';
  document.getElementById('heroWeatherRow').style.display = 'none';
  document.getElementById('filteredSec').style.display = 'block';
  const fs = document.getElementById('fifaSection'); if (fs) fs.style.display = 'none';
  const vis = filtered.slice(0, page * PER_PAGE);
  const g = document.getElementById('filtGrid');
  if (!vis.length) {
    g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text3)"><i class="fas fa-newspaper" style="font-size:44px;display:block;margin-bottom:14px;color:var(--border)"></i><p style="font-size:16px;color:var(--text2)">কোনো খবর পাওয়া যায়নি</p></div>';
    document.getElementById('moreBtn').style.display = 'none'; return;
  }
  g.innerHTML = vis.map(it => card(it)).join('');
  document.getElementById('moreBtn').style.display = filtered.length > page * PER_PAGE ? 'flex' : 'none';
}

function card(it) {
  let imgWrap = '';
  if (it.image) {
    imgWrap = `<div class="n-img-wrap"><img class="n-img" src="${e(it.image)}" alt="" loading="lazy" onerror="this.closest('.n-card').style.display='none'"></div>`;
  }
  return `<div class="n-card${it.isNew ? ' new-item' : ''}" onclick="openNewsModal('${e(it.link)}')">
    ${imgWrap}
    <div class="n-body">
      <div class="n-top"><span class="n-cat c-${it.category}">${it.category}</span><span class="n-time"><i class="fas fa-clock"></i> ${ago(it.pub)}</span></div>
      <div class="n-title">${e(it.title)}</div>
      <div class="n-footer"><span class="n-time-foot"><i class="fas fa-calendar-alt"></i> ${new Date(it.pub).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}</span></div>
    </div>
  </div>`;
}

// ── FILTER / SEARCH ──
function goCat(cat, btn) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'auth/login.html';
    return;
  }
  curCat = cat; page = 1;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('filtLabel').textContent = cat === 'সব' ? 'সব খবর' : cat + ' - সর্বশেষ খবর';
  if (cat === 'সব') { document.getElementById('filteredSec').style.display = 'none'; const fs = document.getElementById('fifaSection'); if (fs) fs.style.display = ''; renderHero(); renderWeather(); renderCatSecs(); }
  else { applyFilter(); renderFiltered(); }
}
function jumpCat(cat) { const btn = document.querySelector(`.cat-btn[data-cat="${cat}"]`); if (btn) { goCat(cat, btn); btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } }
function applyFilter() {
  let items = news;
  if (curCat !== 'সব') items = items.filter(n => n.category === curCat);
  if (query) { const q = query.toLowerCase(); items = items.filter(n => n.title.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)); }
  filtered = items;
}
function setupSearch() {
  let deb;
  document.getElementById('searchIn').addEventListener('input', ev => {
    clearTimeout(deb); deb = setTimeout(() => {
      query = ev.target.value.trim(); page = 1;
      if (query) { applyFilter(); document.getElementById('filtLabel').textContent = `"${query}" খোঁজার ফলাফল`; document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active')); renderFiltered(); }
      else { curCat = 'সব'; document.querySelector('.cat-btn[data-cat="সব"]').classList.add('active'); document.getElementById('filteredSec').style.display = 'none'; const fs = document.getElementById('fifaSection'); if (fs) fs.style.display = ''; renderHero(); renderCatSecs(); }
    }, 300);
  });
}
function loadMore() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'auth/login.html';
    return;
  }
  page++; renderFiltered();
}

// ── COUNTERS ──
function updateCounts() {
  document.getElementById('totCount').textContent = news.length;
  document.getElementById('srcCount').textContent = Object.values(srcStat).filter(s => s === 'ok').length;
  document.getElementById('cnt-সব').textContent = news.length;
  CATS.forEach(c => { const el = document.getElementById('cnt-' + c); if (el) el.textContent = news.filter(n => n.category === c).length; });
}

// ── TIMER (silent auto-refresh) ──
function startTimer() {
  clearInterval(rTimer);
  rTimer = setInterval(fetchAll, INTERVAL);
}
