// ─── FIFA WORLD CUP 2026 ───
const WC_START = new Date('2026-06-11T22:00:00Z');
const WC_END = new Date('2026-07-25T00:00:00Z');
const COUNTRY_FLAGS = {
  'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷', 'ARG': '🇦🇷',
  'FRA': '🇫🇷', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'ENG.1': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'ESP': '🇪🇸', 'GER': '🇩🇪', 'ITA': '🇮🇹',
  'POR': '🇵🇹', 'NED': '🇳🇱', 'BEL': '🇧🇪', 'CRO': '🇭🇷', 'MAR': '🇲🇦',
  'SEN': '🇸🇳', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'AUS': '🇦🇺', 'SUI': '🇨🇭',
  'URU': '🇺🇾', 'COL': '🇨🇴', 'ECU': '🇪🇨', 'CHI': '🇨🇱', 'PER': '🇵🇪',
  'GHA': '🇬🇭', 'CMR': '🇨🇲', 'TUN': '🇹🇳', 'EGY': '🇪🇬', 'NGA': '🇳🇬',
  'CIV': '🇨🇮', 'QAT': '🇶🇦', 'IRN': '🇮🇷', 'SAU': '🇸🇦', 'POL': '🇵🇱',
  'DEN': '🇩🇰', 'SWE': '🇸🇪', 'NOR': '🇳🇴', 'SRB': '🇷🇸', 'WAL': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'SCO': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'UKR': '🇺🇦', 'CZE': '🇨🇿', 'HUN': '🇭🇺', 'ROU': '🇷🇴',
  'AUT': '🇦🇹', 'GRE': '🇬🇷', 'SVK': '🇸🇰', 'ALB': '🇦🇱', 'GEO': '🇬🇪',
  'TUR': '🇹🇷', 'MOR': '🇲🇦', 'ALG': '🇩🇿', 'NGR': '🇳🇬', 'KEN': '🇰🇪',
  'MEX.1': '🇲🇽', 'PAN': '🇵🇦', 'CRC': '🇨🇷', 'HON': '🇭🇳', 'JAM': '🇯🇲',
  'VEN': '🇻🇪', 'PAR': '🇵🇾', 'BOL': '🇧🇴', 'IND': '🇮🇳', 'IDN': '🇮🇩',
  'THA': '🇹🇭', 'VIE': '🇻🇳', 'NZL': '🇳🇿', 'PHI': '🇵🇭',
};

const COUNTRY_BN = {
  'argentina': 'আর্জেন্টিনা', 'brazil': 'ব্রাজিল', 'france': 'ফ্রান্স', 'england': 'ইংল্যান্ড', 
  'spain': 'স্পেন', 'germany': 'জার্মানি', 'italy': 'ইতালি', 'portugal': 'পর্তুগাল', 
  'netherlands': 'নেদারল্যান্ডস', 'belgium': 'বেলজিয়াম', 'croatia': 'ক্রোয়েশিয়া', 'morocco': 'মরক্কো', 
  'senegal': 'সেনেগাল', 'japan': 'জাপান', 'south korea': 'দক্ষিণ কোরিয়া', 'korea republic': 'দক্ষিণ কোরিয়া', 
  'australia': 'অস্ট্রেলিয়া', 'switzerland': 'সুইজারল্যান্ড', 'uruguay': 'উরুগুয়ে', 'colombia': 'কলম্বিয়া', 
  'usa': 'যুক্তরাষ্ট্র', 'united states': 'যুক্তরাষ্ট্র', 'canada': 'কানাডা', 'mexico': 'মেক্সিকো', 
  'ecuador': 'ইকুয়েডর', 'chile': 'চিলি', 'peru': 'পেরু', 'ghana': 'ঘানা', 'cameroon': 'ক্যামেরুন', 
  'tunisia': 'তিউনিসিয়া', 'egypt': 'মিশর', 'nigeria': 'নাইজেরিয়া', 'ivory coast': 'আইভরি কোস্ট', "cote d'ivoire": 'আইভরি কোস্ট',
  'qatar': 'কাতার', 'iran': 'ইরান', 'saudi arabia': 'সৌদি আরব', 'poland': 'পোল্যান্ড', 
  'denmark': 'ডেনমার্ক', 'sweden': 'সুইডেন', 'norway': 'নরওয়ে', 'serbia': 'সার্বিয়া', 
  'wales': 'ওয়েলস', 'scotland': 'স্কটল্যান্ড', 'ukraine': 'ইউক্রেন', 'czech republic': 'চেক প্রজাতন্ত্র', 'czechia': 'চেক প্রজাতন্ত্র',
  'hungary': 'হাঙ্গেরি', 'romania': 'রোমানিয়া', 'austria': 'অস্ট্রিয়া', 'greece': 'গ্রিস', 
  'slovakia': 'স্লোভাকিয়া', 'albania': 'আলবেনিয়া', 'georgia': 'জর্জিয়া', 'turkey': 'তুরস্ক', 'turkiye': 'তুরস্ক',
  'algeria': 'আলজেরিয়া', 'kenya': 'কেনিয়া', 'panama': 'পানামা', 'costa rica': 'কোস্টারিকা', 
  'honduras': 'হন্ডুরাস', 'jamaica': 'জ্যামাইকা', 'venezuela': 'ভেনিজুয়েলা', 'paraguay': 'প্যারাগুয়ে', 
  'bolivia': 'বলিভিয়া', 'india': 'ভারত', 'indonesia': 'ইন্দোনেশিয়া', 'thailand': 'থাইল্যান্ড', 
  'vietnam': 'ভিয়েতনাম', 'new zealand': 'নিউজিল্যান্ড', 'philippines': 'ফিলিপাইন',
  'iraq': 'ইরাক', 'syria': 'সিরিয়া', 'uae': 'সংযুক্ত আরব আমিরাত', 'united arab emirates': 'সংযুক্ত আরব আমিরাত',
  'oman': 'ওমান', 'bahrain': 'বাহরাইন', 'kuwait': 'কুয়েত', 'jordan': 'জর্ডান', 'lebanon': 'লেবানন',
  'palestine': 'ফিলিস্তিন', 'uzbekistan': 'উজবেকিস্তান', 'kyrgyzstan': 'কিরগিজস্তান', 'tajikistan': 'তাজিকিস্তান',
  'turkmenistan': 'তুর্কমেনিস্তান', 'north korea': 'উত্তর কোরিয়া', 'dpr korea': 'উত্তর কোরিয়া',
  'china pr': 'চীন', 'china': 'চীন', 'malaysia': 'মালয়েশিয়া', 'singapore': 'সিঙ্গাপুর', 'yemen': 'ইয়েমেন',
  'afghanistan': 'আফগানিস্তান', 'bangladesh': 'বাংলাদেশ', 'bhutan': 'ভুটান', 'nepal': 'নেপাল', 'maldives': 'মালদ্বীপ',
  'sri lanka': 'শ্রীলঙ্কা', 'pakistan': 'পাকিস্তান', 'myanmar': 'মিয়ানমার', 'cambodia': 'কম্বোডিয়া', 'laos': 'লাওস',
  'brunei': 'ব্রুনাই', 'timor-leste': 'পূর্ব তিমুর', 'macau': 'ম্যাকাও', 'hong kong': 'হংকং', 'chinese taipei': 'চীনা তাইপেই',
  'iceland': 'আইসল্যান্ড', 'finland': 'ফিনল্যান্ড', 'ireland': 'আয়ারল্যান্ড', 'republic of ireland': 'আয়ারল্যান্ড', 'northern ireland': 'উত্তর আয়ারল্যান্ড',
  'bulgaria': 'বুলগেরিয়া', 'bosnia and herzegovina': 'বসনিয়া ও হার্জেগোভিনা', 'montenegro': 'মন্টিনিগ্রো', 'north macedonia': 'উত্তর মেসিডোনিয়া',
  'kosovo': 'কসোভো', 'estonia': 'এস্তোনিয়া', 'latvia': 'লাটভিয়া', 'lithuania': 'লিথুয়ানিয়া', 'belarus': 'বেলারুশ',
  'moldova': 'মলদোভা', 'armenia': 'আর্মেনিয়া', 'azerbaijan': 'আজারবাইজান', 'kazakhstan': 'কাজাখস্তান', 'cyprus': 'সাইপ্রাস',
  'israel': 'ইসরায়েল', 'faroe islands': 'ফ্যারো দ্বীপপুঞ্জ', 'liechtenstein': 'লিশটেনস্টাইন', 'san marino': 'সান মারিনো',
  'andorra': 'অ্যান্ডোরা', 'luxembourg': 'লুক্সেমবার্গ', 'gibraltar': 'জিব্রাল্টার', 'malta': 'মাল্টা',
  'south africa': 'দক্ষিণ আফ্রিকা', 'zimbabwe': 'জিম্বাবুয়ে', 'zambia': 'জাম্বিয়া', 'angola': 'অ্যাঙ্গোলা', 'mali': 'মালি',
  'guinea': 'গিনি', 'burkina faso': 'বুরকিনা ফাসো', 'cape verde': 'কেপ ভার্দে', 'cabo verde': 'কেপ ভার্দে', 'gambia': 'গাম্বিয়া', 'sierra leone': 'সিয়েরা লিওন',
  'liberia': 'লাইবেরিয়া', 'congo dr': 'কঙ্গো ডিআর', 'dr congo': 'কঙ্গো ডিআর', 'congo': 'কঙ্গো', 'gabon': 'গ্যাবন',
  'equatorial guinea': 'নিরক্ষীয় গিনি', 'central african republic': 'মধ্য আফ্রিকান প্রজাতন্ত্র', 'chad': 'চাদ', 'sudan': 'সুদান', 'south sudan': 'দক্ষিণ সুদান',
  'ethiopia': 'ইথিওপিয়া', 'somalia': 'সোমালিয়া', 'djibouti': 'জিবুতি', 'eritrea': 'ইরিত্রিয়া', 'uganda': 'উগান্ডা',
  'rwanda': 'রুয়ান্ডা', 'burundi': 'বুরুন্ডি', 'tanzania': 'তানজানিয়া', 'malawi': 'মালাউই', 'mozambique': 'মোজাম্বিক',
  'madagascar': 'মাদাগাস্কার', 'namibia': 'নামিবিয়া', 'botswana': 'বতসোয়ানা', 'lesotho': 'লেসোথো', 'eswatini': 'এসোয়াতিনি',
  'togo': 'টোগো', 'benin': 'বেনিন', 'niger': 'নাইজার', 'mauritania': 'মৌরিতানিয়া', 'libya': 'লিবিয়া',
  'fiji': 'ফিজি', 'solomon islands': 'সলোমন দ্বীপপুঞ্জ', 'vanuatu': 'ভানুয়াতু', 'new caledonia': 'নিউ ক্যালেডোনিয়া', 'tahiti': 'তাহিতি', 'papua new guinea': 'পাপুয়া নিউগিনি',
  'el salvador': 'এল সালভাদর', 'guatemala': 'গুয়াতেমালা', 'nicaragua': 'নিকারাগুয়া', 'belize': 'বেলিজ', 'cuba': 'কিউবা',
  'haiti': 'হাইতি', 'trinidad and tobago': 'ত্রিনিদাদ ও টোবাগো', 'dominican republic': 'ডোমিনিকান প্রজাতন্ত্র', 'guyana': 'গিয়ানা', 'suriname': 'সুরিনাম', 'curacao': 'কুরাসাও'
};

function getTeamNameBn(teamObj) {
  if (!teamObj) return '';
  const names = [teamObj.shortDisplayName, teamObj.displayName, teamObj.name].filter(Boolean);
  for (let n of names) {
    const lower = n.trim().toLowerCase();
    const norm = n.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (COUNTRY_BN[lower]) return COUNTRY_BN[lower];
    if (COUNTRY_BN[norm]) return COUNTRY_BN[norm];
  }
  return (teamObj.shortDisplayName || teamObj.displayName || teamObj.name || '').trim();
}

function wcFlag(team) {
  if (!team) return '🏳️';
  if (team.logo) return `<img src="${team.logo}" alt="${team.abbreviation || ''}" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">`;
  const abbr = team.abbreviation;
  if (!abbr) return '🏳️';
  return COUNTRY_FLAGS[abbr.toUpperCase()] || COUNTRY_FLAGS[(abbr.replace(/\.\d+$/, '')).toUpperCase()] || '🏳️';
}

function wcTab(tab, btn) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'auth/login.html';
    return;
  }
  ['Live', 'Past'].forEach(t => {
    const el = document.getElementById('wcTab' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
    const b = document.getElementById('fifaTab' + t + 'Btn');
    if (b) b.classList.toggle('active', t === tab);
  });
  if (tab === 'Past') fetchWcPastMatches();
}

function scrollToWC() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'auth/login.html';
    return;
  }
  const el = document.getElementById('fifaSection');
  if (!el) return;
  const offset = document.querySelector('.header')?.offsetHeight || 72;
  const navH = document.querySelector('.cat-nav')?.offsetHeight || 44;
  const top = el.getBoundingClientRect().top + window.pageYOffset - (offset + navH + 10);
  window.scrollTo({ top, behavior: 'smooth' });
}

function startWcCountdown() {
  const cdEl = document.getElementById('fifaCd');
  function tick() {
    const diff = WC_START - new Date();
    if (diff <= 0) { if (cdEl) cdEl.style.display = 'none'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = pad(v); };
    set('cdDays', d); set('cdHours', h); set('cdMins', m); set('cdSecs', s);
  }
  tick();
  setInterval(tick, 1000);
}

function watchHTML() {
  return `<div class="fifa-watch-section">
    <div class="fifa-watch-title">লাইভ দেখুন</div>
    <div class="fifa-watch-btns">
      <a href="https://www.youtube.com/@TsportsLive/streams" target="_blank" rel="noopener noreferrer" class="fifa-watch-btn tsports">
        <i class="fab fa-youtube"></i>
        <div class="fifa-watch-btn-inner">
          <span>T Sports</span>
          <span class="btn-sub">YouTube Live</span>
        </div>
      </a>
      <a href="https://www.youtube.com/@GaziTVLive/streams" target="_blank" rel="noopener noreferrer" class="fifa-watch-btn gtv">
        <i class="fab fa-youtube"></i>
        <div class="fifa-watch-btn-inner">
          <span>GTV</span>
          <span class="btn-sub">YouTube Live</span>
        </div>
      </a>
    </div>
  </div>`;
}

function saveFifaCache(key, data) {
  try { localStorage.setItem(FIFA_CACHE_KEY + '_' + key, JSON.stringify({ ts: Date.now(), data })); } catch { }
}
function loadFifaCache(key) {
  try {
    const raw = localStorage.getItem(FIFA_CACHE_KEY + '_' + key);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (Date.now() - c.ts > FIFA_CACHE_TTL) return null;
    return c.data;
  } catch { return null; }
}

function showWcNoMatch(notStarted) {
  const statusEl = document.getElementById('wcLiveStatus');
  const noMatchDiv = document.getElementById('wcNoMatchMsg');
  const noMatchText = document.getElementById('wcNoMatchText');
  const matchCards = document.getElementById('wcMatchCards');
  const prev = document.getElementById('wcWatchPreview');
  if (statusEl) statusEl.style.display = 'none';
  if (matchCards) matchCards.innerHTML = '';
  if (prev) { prev.style.display = 'none'; prev.innerHTML = watchHTML(); }
  if (noMatchText) noMatchText.innerHTML = notStarted
    ? 'ফিফা বিশ্বকাপ এখনো শুরু হয়নি।<br><small style="color:var(--red);font-weight:700">আরম্ভ: ১১ জুন ২০২৬</small>'
    : 'এই মুহূর্তে কোনো লাইভ ম্যাচ নেই।';
  if (noMatchDiv) noMatchDiv.style.display = 'block';
}

function getStageNameBn(ev) {
  let slug = (ev.season && ev.season.slug) || '';
  if (!slug && ev.notes && ev.notes[0]) slug = ev.notes[0].headline;
  if (!slug && ev.shortName) slug = ev.shortName;
  slug = (slug || '').toLowerCase();
  if (slug.includes('round-of-32') || slug.includes('round of 32')) return 'রাউন্ড অফ ৩২';
  if (slug.includes('round-of-16') || slug.includes('round of 16') || slug.includes('rd of 16')) return 'রাউন্ড অফ ১৬';
  if (slug.includes('quarter') || slug.includes('quarterfinal')) return 'কোয়ার্টার ফাইনাল';
  if (slug.includes('semi') || slug.includes('semifinal')) return 'সেমিফাইনাল';
  if (slug.includes('3rd-place') || slug.includes('third place')) return '৩য় স্থান নির্ধারণী';
  if (slug.includes('final')) return 'ফাইনাল';
  if (slug.includes('group')) return 'গ্রুপ পর্ব';
  return 'বিশ্বকাপ ম্যাচ';
}

function renderWcMatches(events, container, statusEl) {
  if (events.length === 0) {
    showWcNoMatch(new Date() < WC_START);
    return;
  }
  const noMatchDiv = document.getElementById('wcNoMatchMsg');
  if (noMatchDiv) noMatchDiv.style.display = 'none';
  if (statusEl) statusEl.style.display = 'none';

  let groupedHtml = '';
  let currentGroup = '';

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedEvents.forEach(ev => {
    const comp = ev.competitions && ev.competitions[0];
    const home = comp && comp.competitors && comp.competitors.find(c => c.homeAway === 'home');
    const away = comp && comp.competitors && comp.competitors.find(c => c.homeAway === 'away');
    const state = ev.status && ev.status.type && ev.status.type.state;
    const clock = (ev.status && ev.status.displayClock) || '';
    const dt = new Date(ev.date);
    const timeStr = dt.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' });
    const dateStr = dt.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', timeZone: 'Asia/Dhaka' });

    const stageBn = getStageNameBn(ev);
    const groupKey = `${dateStr} - ${stageBn}`;

    if (groupKey !== currentGroup) {
       groupedHtml += `<div class="fifa-date-header" style="font-weight:bold;margin:15px 0 10px;padding:6px 12px;background:var(--bg3);border-radius:6px;font-size:14px;color:var(--text);border-left:4px solid var(--red);"><i class="fas fa-calendar-day"></i> ${e(groupKey)}</div>`;
       currentGroup = groupKey;
    }

    const isLive = state === 'in';
    const isPost = state === 'post';

    const badgeHTML = isLive ? `<span class="fifa-live-badge" style="font-size:11px;padding:3px 10px;">⬤ LIVE ${e(clock)}</span>` : (isPost ? `<span class="fifa-live-badge" style="background:var(--text3);color:#fff;font-size:11px;padding:3px 10px;">FT</span>` : `<span class="fifa-live-badge" style="background:var(--card);color:var(--text);border:1px solid var(--border);font-size:11px;padding:3px 10px;">${e(timeStr)}</span>`);

    const hs = isLive || isPost ? ((home && home.score) || 0) : '-';
    const as = isLive || isPost ? ((away && away.score) || 0) : '-';

    let penText = '';
    if ((isLive || isPost) && home && home.shootoutScore !== undefined && away && away.shootoutScore !== undefined) {
      penText = `<div style="font-size:11px;color:var(--text3);margin-top:2px;">(পেনাল্টি: ${home.shootoutScore} - ${away.shootoutScore})</div>`;
    }

    groupedHtml += `<div class="fifa-match-card">
      <div class="fifa-match-top">
        <span class="fifa-match-stage" style="font-size:12px;">${e(ev.shortName || 'FIFA World Cup')}</span>
        ${badgeHTML}
      </div>
      <div class="fifa-match-teams">
        <div class="fifa-team">
          <span class="fifa-team-flag">${wcFlag(home && home.team)}</span>
          <span class="fifa-team-name" style="font-size:14px;">${e(getTeamNameBn(home && home.team))}</span>
        </div>
        <div class="fifa-score-box" style="display:flex;flex-direction:column;align-items:center;">
          <div class="fifa-score">${hs} - ${as}</div>
          ${penText}
        </div>
        <div class="fifa-team right">
          <span class="fifa-team-name" style="font-size:14px;">${e(getTeamNameBn(away && away.team))}</span>
          <span class="fifa-team-flag">${wcFlag(away && away.team)}</span>
        </div>
      </div>
      <div class="fifa-match-time">${e((comp && comp.venue && comp.venue.fullName) || '')}</div>
    </div>`;
  });

  const matchCards = document.getElementById('wcMatchCards');
  if (matchCards) matchCards.innerHTML = groupedHtml;
}

async function fetchWcMatches() {
  const container = document.getElementById('wcTabLive');
  const statusEl = document.getElementById('wcLiveStatus');
  const cached = loadFifaCache('matches');
  if (cached && cached.length > 0) { renderWcMatches(cached, container, statusEl); }

  try {
    const now = new Date();
    const fetchDate = now < WC_START ? WC_START : now;
    const ds = fetchDate.toISOString().slice(0, 10).replace(/-/g, '');
    const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=' + ds;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let events = data.events || [];

    if (events.length === 0) {
      const nextDate = new Date(fetchDate); nextDate.setDate(nextDate.getDate() + 1);
      const ds2 = nextDate.toISOString().slice(0, 10).replace(/-/g, '');
      const url2 = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=' + ds2;
      const res2 = await fetch(url2, { signal: AbortSignal.timeout(10000) });
      if (res2.ok) { const d2 = await res2.json(); events.push(...(d2.events || [])); }
    }

    saveFifaCache('matches', events);
    renderWcMatches(events, container, statusEl);
  } catch {
    if (!cached) {
      showWcNoMatch(new Date() < WC_START);
      if (statusEl) statusEl.innerHTML = new Date() < WC_START
        ? '<i class="fas fa-calendar"></i><p>ম্যাচ সূচি শীঘ্রই আসছে।<br><small style="color:var(--red);font-weight:700">বিশ্বকাপ শুরু: ১১ জুন ২০২৬</small></p>'
        : '<i class="fas fa-wifi"></i><p>সূচি লোড করা যায়নি।</p>';
    }
  }
}

async function fetchWcPastMatches() {
  const container = document.getElementById('wcTabPast');
  const statusEl = document.getElementById('wcPastStatus');
  const cached = loadFifaCache('past_matches');
  
  if (cached && cached.length > 0) { 
    renderWcPastCards(cached, container, statusEl); 
    return; 
  }

  if (statusEl) statusEl.style.display = 'block';

  try {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - 1);
    const ds = pastDate.toISOString().slice(0, 10).replace(/-/g, '');
    const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=' + ds;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let events = data.events || [];

    if (events.length === 0) {
      const pastDate2 = new Date(pastDate);
      pastDate2.setDate(pastDate2.getDate() - 1);
      const ds2 = pastDate2.toISOString().slice(0, 10).replace(/-/g, '');
      const res2 = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=' + ds2, { signal: AbortSignal.timeout(10000) });
      if (res2.ok) { const d2 = await res2.json(); events = d2.events || []; }
    }

    saveFifaCache('past_matches', events);
    renderWcPastCards(events, container, statusEl);
  } catch (e) {
    if (!cached && statusEl) {
      statusEl.innerHTML = '<i class="fas fa-wifi"></i><p>ফলাফল লোড করা যায়নি।</p>';
    }
  }
}

function renderWcPastCards(events, container, statusEl) {
  if (statusEl) statusEl.style.display = 'none';
  if (events.length === 0) {
    container.innerHTML = '<div class="fifa-no-match"><i class="fas fa-history"></i><p>গতকালের কোনো ম্যাচের ফলাফল পাওয়া যায়নি।</p></div>';
    return;
  }
  
  const cards = events.map(ev => {
    const comp = ev.competitions && ev.competitions[0];
    const home = comp && comp.competitors && comp.competitors.find(c => c.homeAway === 'home');
    const away = comp && comp.competitors && comp.competitors.find(c => c.homeAway === 'away');
    const state = ev.status && ev.status.type && ev.status.type.state;
    const dt = new Date(ev.date);
    const dateStr = dt.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', timeZone: 'Asia/Dhaka' });
    const timeStr = dt.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' });

    const badgeHTML = `<span class="fifa-live-badge" style="background:var(--text3);color:#fff;font-size:11px;padding:3px 10px;">${e(dateStr)} - ${e(timeStr)}</span>`;

    const hs = ((home && home.score) !== undefined) ? home.score : '-';
    const as = ((away && away.score) !== undefined) ? away.score : '-';

    let penText = '';
    if (home && home.shootoutScore !== undefined && away && away.shootoutScore !== undefined) {
      penText = `<div style="font-size:11px;color:var(--text3);margin-top:2px;">(পেনাল্টি: ${home.shootoutScore} - ${away.shootoutScore})</div>`;
    }

    return `<div class="fifa-match-card">
      <div class="fifa-match-top">
        <span class="fifa-match-stage" style="font-size:12px;">${e(ev.shortName || 'FIFA World Cup')}</span>
        ${badgeHTML}
      </div>
      <div class="fifa-match-teams">
        <div class="fifa-team">
          <span class="fifa-team-flag">${wcFlag(home && home.team)}</span>
          <span class="fifa-team-name" style="font-size:14px;">${e(getTeamNameBn(home && home.team))}</span>
        </div>
        <div class="fifa-score-box" style="display:flex;flex-direction:column;align-items:center;">
          <div class="fifa-score">${hs} - ${as}</div>
          ${penText}
        </div>
        <div class="fifa-team right">
          <span class="fifa-team-name" style="font-size:14px;">${e(getTeamNameBn(away && away.team))}</span>
          <span class="fifa-team-flag">${wcFlag(away && away.team)}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = '<div id="wcPastMatchCards">' + cards + '</div>';
}

function initFifa() {
  if (new Date() > WC_END) {
    const el = document.getElementById('fifaSection');
    if (el) el.style.display = 'none';
    return;
  }
  startWcCountdown();
  fetchWcMatches();
  setInterval(fetchWcMatches, 30 * 1000);
}
