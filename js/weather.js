// ── WEATHER — Open-Meteo (বিনামূল্যে, কোনো API key লাগবে না) ──
const WX_CITIES = [
  { name: 'ঢাকা', lat: 23.7104, lon: 90.4074, keys: ['ঢাকা', 'ঢাকার', 'রাজধানী'] },
  { name: 'চট্টগ্রাম', lat: 22.3569, lon: 91.7832, keys: ['চট্টগ্রাম', 'চট্টগ্রামের', 'বন্দর নগরী'] },
  { name: 'সিলেট', lat: 24.8949, lon: 91.8687, keys: ['সিলেট', 'সিলেটের', 'হাওর'] },
  { name: 'রাজশাহী', lat: 24.3745, lon: 88.6042, keys: ['রাজশাহী', 'রাজশাহীর'] },
  { name: 'খুলনা', lat: 22.8456, lon: 89.5403, keys: ['খুলনা', 'খুলনার', 'সুন্দরবন'] },
  { name: 'বরিশাল', lat: 22.7010, lon: 90.3535, keys: ['বরিশাল', 'বরিশালের'] },
  { name: 'ময়মনসিংহ', lat: 24.7471, lon: 90.4203, keys: ['ময়মনসিংহ', 'ময়মনসিংহের'] },
  { name: 'রংপুর', lat: 25.7439, lon: 89.2752, keys: ['রংপুর', 'রংপুরের'] },
];
function wxIcon(c) {
  if (c === 0) return '☀️';
  if (c <= 2) return '⛅';
  if (c === 3) return '☁️';
  if (c <= 48) return '🌫️';
  if (c <= 67) return '🌧️';
  if (c <= 77) return '❄️';
  if (c <= 82) return '🌦️';
  if (c <= 86) return '🌨️';
  if (c <= 99) return '🌩️';
  return '⛅';
}
function wxCond(c) {
  if (c === 0) return 'পরিষ্কার আকাশ';
  if (c === 1) return 'হালকা মেঘ';
  if (c === 2) return 'আংশিক মেঘলা';
  if (c === 3) return 'মেঘাচ্ছন্ন';
  if (c <= 48) return 'কুয়াশা';
  if (c <= 55) return 'গুঁড়িগুঁড়ি বৃষ্টি';
  if (c <= 57) return 'ভারী গুঁড়িবৃষ্টি';
  if (c <= 61) return 'হালকা বৃষ্টি';
  if (c <= 63) return 'মাঝারি বৃষ্টি';
  if (c <= 65) return 'ভারী বৃষ্টি';
  if (c <= 77) return 'শীতল আবহাওয়া';
  if (c <= 82) return 'বৃষ্টি ঝাপটা';
  if (c <= 86) return 'তুষারপাত';
  if (c <= 99) return 'বজ্রবৃষ্টি';
  return 'আবহাওয়া';
}
function wxAlert(c, temp, wind) {
  if (c >= 95) return { level: 'বিশেষ সতর্কতা', msg: 'বজ্রপাত ও ঝড়ের সতর্কতা জারি। বাইরে বের না হওয়ার পরামর্শ।' };
  if (c >= 63 && c <= 65) return { level: 'সতর্কতা', msg: 'ভারী বৃষ্টির সম্ভাবনা। নিচু এলাকায় জলাবদ্ধতার আশঙ্কা।' };
  if (temp >= 38) return { level: 'তাপপ্রবাহ', msg: 'তীব্র তাপপ্রবাহ চলছে। দুপুরে ঘরের বাইরে না যাওয়ার পরামর্শ।' };
  if (wind >= 50) return { level: 'সতর্কতা', msg: 'ঝড়ো বাতাসের সতর্কতা। সতর্কতার সাথে চলাচল করুন।' };
  return null;
}
async function fetchWeatherRealtime() {
  function wwoToWmo(wwo) {
    wwo = parseInt(wwo);
    if (wwo === 113) return 0;
    if (wwo === 116) return 2;
    if (wwo === 119 || wwo === 122) return 3;
    if (wwo === 143 || wwo === 248 || wwo === 260) return 45;
    if ([176, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359].includes(wwo)) return 63;
    if ([200, 386, 389, 392, 395].includes(wwo)) return 95;
    return 3;
  }

  try {
    const results = await Promise.all(WX_CITIES.map(async city => {
      let code, temp, wind, feel, hum;
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m&timezone=Asia%2FDhaka`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error('Primary API failed');
        const d = await res.json();
        const c = d.current;
        code = c.weathercode;
        temp = Math.round(c.temperature_2m);
        wind = Math.round(c.windspeed_10m);
        feel = Math.round(c.apparent_temperature);
        hum = c.relativehumidity_2m;
      } catch {
        // Fallback to wttr.in
        try {
          const fbUrl = `https://wttr.in/${city.lat},${city.lon}?format=j1`;
          const fbRes = await fetch(fbUrl, { signal: AbortSignal.timeout(8000) });
          if (!fbRes.ok) return null;
          const fbd = await fbRes.json();
          const fbc = fbd.current_condition[0];
          code = wwoToWmo(fbc.weatherCode);
          temp = Math.round(fbc.temp_C);
          wind = Math.round(fbc.windspeedKmph);
          feel = Math.round(fbc.FeelsLikeC);
          hum = Math.round(fbc.humidity);
        } catch { return null; }
      }
      return {
        city: city.name, keys: city.keys,
        icon: wxIcon(code),
        temp,
        feel,
        cond: wxCond(code),
        hum,
        wind,
        alert: wxAlert(code, temp, wind),
      };
    }));
    const valid = results.filter(Boolean);
    if (valid.length > 0) {
      // merge: update existing cities with fresh data, keep others with old data
      WX_CITIES.forEach((city, i) => {
        const fresh = valid.find(v => v.city === city.name);
        if (fresh) WEATHER_DATA[i] = fresh;
      });
      saveWxCache();
      renderWeather();
    }
  } catch { }
}

let WEATHER_DATA = WX_CITIES.map(c => ({ city: c.name, keys: c.keys, icon: '🌡️', temp: '--', feel: '--', cond: 'লোড হচ্ছে...', hum: '--', wind: '--', alert: null }));

const ALERT_COLORS = {
  'সতর্কতা': { bg: 'rgba(234,88,12,.1)', border: 'rgba(234,88,12,.35)', text: '#c2410c' },
  'বিশেষ সতর্কতা': { bg: 'rgba(220,38,38,.1)', border: 'rgba(220,38,38,.4)', text: '#b91c1c' },
  'তাপপ্রবাহ': { bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.4)', text: '#b45309' },
};

function renderWeather() {
  const g = document.getElementById('wcGrid'); if (!g) return;
  const alertCities = WEATHER_DATA.filter(w => w.alert);
  const ab = document.getElementById('wcAlertBar');
  if (ab) {
    if (alertCities.length) {
      ab.innerHTML = `<div class="wc-alert-bar"><i class="fas fa-exclamation-triangle"></i>${alertCities.map(w => `${w.city}: ${w.alert.level}`).join(' · ')}</div>`;
    } else ab.innerHTML = '';
  }
  g.innerHTML = WEATHER_DATA.map((w, i) => `
    <div class="wc-item${w.alert ? ' has-alert' : ''}" onclick="isSub()?openWeatherCity(${i}):openPW()">
      ${w.alert ? '<div class="wc-alert-dot"></div>' : ''}
      <div class="wc-city">${w.icon} ${w.city}</div>
      <div class="wc-temp">${w.temp}<sup>°C</sup></div>
      <div class="wc-cond">${w.cond}</div>
      <div class="wc-row"><span><i class="fas fa-tint"></i>${w.hum}%</span><span><i class="fas fa-wind"></i>${w.wind} কি.</span></div>
    </div>`).join('');
}

const ALL_DISTRICTS = [
  {
    "div": "ঢাকা",
    "name": "ঢাকা",
    "lat": 23.7104,
    "lon": 90.4074,
    "keys": [
      "ঢাকা",
      "ঢাকাের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "গাজীপুর",
    "lat": 24.0023,
    "lon": 90.4264,
    "keys": [
      "গাজীপুর",
      "গাজীপুরের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "কিশোরগঞ্জ",
    "lat": 24.4373,
    "lon": 90.7772,
    "keys": [
      "কিশোরগঞ্জ",
      "কিশোরগঞ্জের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "মানিকগঞ্জ",
    "lat": 23.8644,
    "lon": 90.0047,
    "keys": [
      "মানিকগঞ্জ",
      "মানিকগঞ্জের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "মুন্সীগঞ্জ",
    "lat": 23.5422,
    "lon": 90.5305,
    "keys": [
      "মুন্সীগঞ্জ",
      "মুন্সীগঞ্জের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "নারায়ণগঞ্জ",
    "lat": 23.6238,
    "lon": 90.5,
    "keys": [
      "নারায়ণগঞ্জ",
      "নারায়ণগঞ্জের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "নরসিংদী",
    "lat": 23.9322,
    "lon": 90.7154,
    "keys": [
      "নরসিংদী",
      "নরসিংদীের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "টাঙ্গাইল",
    "lat": 24.2498,
    "lon": 89.9166,
    "keys": [
      "টাঙ্গাইল",
      "টাঙ্গাইলের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "ফরিদপুর",
    "lat": 23.6071,
    "lon": 89.8429,
    "keys": [
      "ফরিদপুর",
      "ফরিদপুরের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "গোপালগঞ্জ",
    "lat": 23.0051,
    "lon": 89.8267,
    "keys": [
      "গোপালগঞ্জ",
      "গোপালগঞ্জের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "মাদারীপুর",
    "lat": 23.1641,
    "lon": 90.1897,
    "keys": [
      "মাদারীপুর",
      "মাদারীপুরের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "রাজবাড়ী",
    "lat": 23.7574,
    "lon": 89.6445,
    "keys": [
      "রাজবাড়ী",
      "রাজবাড়ীের"
    ]
  },
  {
    "div": "ঢাকা",
    "name": "শরীয়তপুর",
    "lat": 23.2081,
    "lon": 90.3533,
    "keys": [
      "শরীয়তপুর",
      "শরীয়তপুরের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "চট্টগ্রাম",
    "lat": 22.3569,
    "lon": 91.7832,
    "keys": [
      "চট্টগ্রাম",
      "চট্টগ্রামের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "কক্সবাজার",
    "lat": 21.4272,
    "lon": 92.0058,
    "keys": [
      "কক্সবাজার",
      "কক্সবাজারের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "বান্দরবান",
    "lat": 22.1953,
    "lon": 92.2184,
    "keys": [
      "বান্দরবান",
      "বান্দরবানের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "খাগড়াছড়ি",
    "lat": 23.1193,
    "lon": 91.9847,
    "keys": [
      "খাগড়াছড়ি",
      "খাগড়াছড়িের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "রাঙ্গামাটি",
    "lat": 22.6575,
    "lon": 92.1733,
    "keys": [
      "রাঙ্গামাটি",
      "রাঙ্গামাটিের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "ব্রাহ্মণবাড়িয়া",
    "lat": 23.9571,
    "lon": 91.1119,
    "keys": [
      "ব্রাহ্মণবাড়িয়া",
      "ব্রাহ্মণবাড়িয়াের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "চাঁদপুর",
    "lat": 23.2333,
    "lon": 90.6667,
    "keys": [
      "চাঁদপুর",
      "চাঁদপুরের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "কুমিল্লা",
    "lat": 23.4683,
    "lon": 91.1799,
    "keys": [
      "কুমিল্লা",
      "কুমিল্লাের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "ফেনী",
    "lat": 23.0159,
    "lon": 91.3976,
    "keys": [
      "ফেনী",
      "ফেনীের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "লক্ষ্মীপুর",
    "lat": 22.9425,
    "lon": 90.8413,
    "keys": [
      "লক্ষ্মীপুর",
      "লক্ষ্মীপুরের"
    ]
  },
  {
    "div": "চট্টগ্রাম",
    "name": "নোয়াখালী",
    "lat": 22.8696,
    "lon": 91.0993,
    "keys": [
      "নোয়াখালী",
      "নোয়াখালীের"
    ]
  },
  {
    "div": "সিলেট",
    "name": "সিলেট",
    "lat": 24.8949,
    "lon": 91.8687,
    "keys": [
      "সিলেট",
      "সিলেটের"
    ]
  },
  {
    "div": "সিলেট",
    "name": "হবিগঞ্জ",
    "lat": 24.384,
    "lon": 91.4169,
    "keys": [
      "হবিগঞ্জ",
      "হবিগঞ্জের"
    ]
  },
  {
    "div": "সিলেট",
    "name": "মৌলভীবাজার",
    "lat": 24.4829,
    "lon": 91.7774,
    "keys": [
      "মৌলভীবাজার",
      "মৌলভীবাজারের"
    ]
  },
  {
    "div": "সিলেট",
    "name": "সুনামগঞ্জ",
    "lat": 25.0658,
    "lon": 91.395,
    "keys": [
      "সুনামগঞ্জ",
      "সুনামগঞ্জের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "রাজশাহী",
    "lat": 24.3745,
    "lon": 88.6042,
    "keys": [
      "রাজশাহী",
      "রাজশাহীের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "বগুড়া",
    "lat": 24.8465,
    "lon": 89.3778,
    "keys": [
      "বগুড়া",
      "বগুড়াের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "জয়পুরহাট",
    "lat": 25.1006,
    "lon": 89.0229,
    "keys": [
      "জয়পুরহাট",
      "জয়পুরহাটের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "নওগাঁ",
    "lat": 24.7936,
    "lon": 88.9318,
    "keys": [
      "নওগাঁ",
      "নওগাঁের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "নাটোর",
    "lat": 24.4206,
    "lon": 89.0115,
    "keys": [
      "নাটোর",
      "নাটোরের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "চাঁপাইনবাবগঞ্জ",
    "lat": 24.5965,
    "lon": 88.2775,
    "keys": [
      "চাঁপাইনবাবগঞ্জ",
      "চাঁপাইনবাবগঞ্জের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "পাবনা",
    "lat": 24.0049,
    "lon": 89.2501,
    "keys": [
      "পাবনা",
      "পাবনাের"
    ]
  },
  {
    "div": "রাজশাহী",
    "name": "সিরাজগঞ্জ",
    "lat": 24.4534,
    "lon": 89.7007,
    "keys": [
      "সিরাজগঞ্জ",
      "সিরাজগঞ্জের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "খুলনা",
    "lat": 22.8456,
    "lon": 89.5403,
    "keys": [
      "খুলনা",
      "খুলনাের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "বাগেরহাট",
    "lat": 22.6516,
    "lon": 89.7859,
    "keys": [
      "বাগেরহাট",
      "বাগেরহাটের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "চুয়াডাঙ্গা",
    "lat": 23.6402,
    "lon": 88.8418,
    "keys": [
      "চুয়াডাঙ্গা",
      "চুয়াডাঙ্গাের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "যশোর",
    "lat": 23.1664,
    "lon": 89.2082,
    "keys": [
      "যশোর",
      "যশোরের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "ঝিনাইদহ",
    "lat": 23.545,
    "lon": 89.1726,
    "keys": [
      "ঝিনাইদহ",
      "ঝিনাইদহের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "কুষ্টিয়া",
    "lat": 23.9013,
    "lon": 89.1205,
    "keys": [
      "কুষ্টিয়া",
      "কুষ্টিয়াের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "মাগুরা",
    "lat": 23.4873,
    "lon": 89.4199,
    "keys": [
      "মাগুরা",
      "মাগুরাের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "মেহেরপুর",
    "lat": 23.7622,
    "lon": 88.6318,
    "keys": [
      "মেহেরপুর",
      "মেহেরপুরের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "নড়াইল",
    "lat": 23.1725,
    "lon": 89.5126,
    "keys": [
      "নড়াইল",
      "নড়াইলের"
    ]
  },
  {
    "div": "খুলনা",
    "name": "সাতক্ষীরা",
    "lat": 22.7185,
    "lon": 89.0705,
    "keys": [
      "সাতক্ষীরা",
      "সাতক্ষীরাের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "বরিশাল",
    "lat": 22.701,
    "lon": 90.3535,
    "keys": [
      "বরিশাল",
      "বরিশালের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "বরগুনা",
    "lat": 22.15,
    "lon": 90.1167,
    "keys": [
      "বরগুনা",
      "বরগুনাের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "ভোলা",
    "lat": 22.6859,
    "lon": 90.6482,
    "keys": [
      "ভোলা",
      "ভোলাের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "ঝালকাঠি",
    "lat": 22.6406,
    "lon": 90.1987,
    "keys": [
      "ঝালকাঠি",
      "ঝালকাঠিের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "পটুয়াখালী",
    "lat": 22.3596,
    "lon": 90.3299,
    "keys": [
      "পটুয়াখালী",
      "পটুয়াখালীের"
    ]
  },
  {
    "div": "বরিশাল",
    "name": "পিরোজপুর",
    "lat": 22.5841,
    "lon": 89.972,
    "keys": [
      "পিরোজপুর",
      "পিরোজপুরের"
    ]
  },
  {
    "div": "ময়মনসিংহ",
    "name": "ময়মনসিংহ",
    "lat": 24.7471,
    "lon": 90.4203,
    "keys": [
      "ময়মনসিংহ",
      "ময়মনসিংহের"
    ]
  },
  {
    "div": "ময়মনসিংহ",
    "name": "জামালপুর",
    "lat": 24.9196,
    "lon": 89.9481,
    "keys": [
      "জামালপুর",
      "জামালপুরের"
    ]
  },
  {
    "div": "ময়মনসিংহ",
    "name": "নেত্রকোনা",
    "lat": 24.871,
    "lon": 90.727,
    "keys": [
      "নেত্রকোনা",
      "নেত্রকোনাের"
    ]
  },
  {
    "div": "ময়মনসিংহ",
    "name": "শেরপুর",
    "lat": 25.0205,
    "lon": 90.0153,
    "keys": [
      "শেরপুর",
      "শেরপুরের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "রংপুর",
    "lat": 25.7439,
    "lon": 89.2752,
    "keys": [
      "রংপুর",
      "রংপুরের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "দিনাজপুর",
    "lat": 25.6217,
    "lon": 88.6355,
    "keys": [
      "দিনাজপুর",
      "দিনাজপুরের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "গাইবান্ধা",
    "lat": 25.3288,
    "lon": 89.5281,
    "keys": [
      "গাইবান্ধা",
      "গাইবান্ধাের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "কুড়িগ্রাম",
    "lat": 25.8054,
    "lon": 89.6362,
    "keys": [
      "কুড়িগ্রাম",
      "কুড়িগ্রামের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "লালমনিরহাট",
    "lat": 25.9126,
    "lon": 89.2736,
    "keys": [
      "লালমনিরহাট",
      "লালমনিরহাটের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "নীলফামারী",
    "lat": 25.9318,
    "lon": 88.8407,
    "keys": [
      "নীলফামারী",
      "নীলফামারীের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "পঞ্চগড়",
    "lat": 26.3333,
    "lon": 88.5558,
    "keys": [
      "পঞ্চগড়",
      "পঞ্চগড়ের"
    ]
  },
  {
    "div": "রংপুর",
    "name": "ঠাকুরগাঁও",
    "lat": 26.0337,
    "lon": 88.4617,
    "keys": [
      "ঠাকুরগাঁও",
      "ঠাকুরগাঁওের"
    ]
  }
];

function updateWeatherModalUI(w) {
  document.getElementById('wmBigTemp').innerHTML = w.temp === '--' ? '--' : `${w.temp}<sup>°C</sup>`;
  document.getElementById('wmCondBig').textContent = w.cond;
  document.getElementById('wmStats').innerHTML = `
    <div class="wm-stat"><i class="fas fa-thermometer-half"></i> অনুভূতি ${w.feel}°C</div>
    <div class="wm-stat"><i class="fas fa-tint"></i> আর্দ্রতা ${w.hum}%</div>
    <div class="wm-stat"><i class="fas fa-wind"></i> বায়ু ${w.wind} কি.মি./ঘ.</div>`;
  const ab = document.getElementById('wmAlertBox');
  if (w.alert) {
    const col = ALERT_COLORS[w.alert.level] || ALERT_COLORS['সতর্কতা'];
    ab.innerHTML = `<div class="wm-alert-box" style="background:${col.bg};border-color:${col.border}">
      <i class="fas fa-exclamation-triangle" style="color:${col.text}"></i>
      <div><div class="wm-alert-title" style="color:${col.text}">⚠️ ${w.alert.level}</div>
      <div class="wm-alert-desc" style="color:${col.text}">${w.alert.msg}</div></div>
    </div>`;
  } else ab.innerHTML = '';
  
  document.getElementById('wmNewsHdr').textContent = `${w.city} সংশ্লিষ্ট খবর`;
  const cityNews = news.filter(n => {
    const t = n.title + ' ' + (n.desc || '');
    return w.keys.some(k => t.includes(k));
  }).slice(0, 8);
  const nl = document.getElementById('wmNewsList');
  if (cityNews.length) {
    nl.innerHTML = cityNews.map(it => `
      <div class="wm-news-item" onclick="openNewsModal('${e(it.link)}')">
        <span class="wm-news-cat c-${it.category}">${it.category}</span>
        <div>
          <div class="wm-news-title">${e(it.title)}</div>
          <div class="wm-news-meta"><span><i class="fas fa-newspaper"></i> ${e(it.source)}</span><span><i class="fas fa-clock"></i> ${ago(it.pub)}</span></div>
        </div>
      </div>`).join('');
  } else {
    nl.innerHTML = `<div class="wm-empty"><i class="fas fa-newspaper"></i>${w.city} সম্পর্কিত কোনো খবর এখনো লোড হয়নি।</div>`;
  }
}

function openWeatherCity(idx) {
  const w = WEATHER_DATA[idx];
  const dists = ALL_DISTRICTS.filter(d => d.div === w.city);
  let opts = dists.map(d => `<option style="color:#333" value="${d.name}">${d.name}</option>`).join('');
  document.getElementById('wmCityName').innerHTML = `${w.icon} <select id="wmDistrictSelect" onchange="changeWeatherDistrict(this.value)" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.3);color:inherit;font-size:inherit;font-weight:inherit;font-family:inherit;padding:2px 8px;border-radius:6px;outline:none;cursor:pointer;margin-left:8px;max-width:180px;">${opts}</select>`;
  document.getElementById('wmDistrictSelect').value = w.city;
  updateWeatherModalUI(w);
  document.getElementById('wmOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function changeWeatherDistrict(distName) {
  const d = ALL_DISTRICTS.find(x => x.name === distName);
  if (!d) return;

  document.getElementById('wmBigTemp').innerHTML = `<i class="fas fa-spinner fa-spin" style="font-size:32px"></i>`;
  document.getElementById('wmCondBig').textContent = 'লোড হচ্ছে...';
  
  let code=3, temp='--', wind='--', feel='--', hum='--';
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m&timezone=Asia%2FDhaka`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const c = data.current;
      code = c.weathercode;
      temp = Math.round(c.temperature_2m);
      wind = Math.round(c.windspeed_10m);
      feel = Math.round(c.apparent_temperature);
      hum = c.relativehumidity_2m;
    }
  } catch (e) {}

  const wObj = {
    city: d.name,
    keys: d.keys,
    icon: wxIcon(code),
    temp, feel, wind, hum,
    cond: wxCond(code),
    alert: (temp !== '--') ? wxAlert(code, temp, wind) : null
  };
  
  updateWeatherModalUI(wObj);
}

function closeWeatherModal() {
  document.getElementById('wmOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
