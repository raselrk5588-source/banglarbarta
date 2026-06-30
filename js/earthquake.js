// ── EARTHQUAKE (USGS real-time API) ──
async function fetchEarthquakes() {
  const el = document.getElementById('eqList');
  el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)"><i class="fas fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:10px"></i>তথ্য লোড হচ্ছে...</div>';
  try {
    // Bangladesh bounding box: lat 20-27, lon 88-93
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=20&maxlatitude=27&minlongitude=88&maxlongitude=93&minmagnitude=2&limit=50&orderby=time';
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let features = data.features || [];

    // Filter only Bangladesh and take the latest 1
    features = features.filter(f => f.properties.place && f.properties.place.toLowerCase().includes('bangladesh')).slice(0, 1);

    if (!features.length) { el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)"><i class="fas fa-check-circle" style="font-size:24px;display:block;margin-bottom:8px;color:var(--green)"></i>বাংলাদেশে সাম্প্রতিক কোনো উল্লেখযোগ্য ভূমিকম্প নেই।</div>'; return; }
    el.innerHTML = features.map(f => {
      const mag = f.properties.mag || 0;
      const place = translateEqLocation(f.properties.place);
      const time = new Date(f.properties.time);
      const depth = (f.geometry.coordinates[2] || 0).toFixed(1);
      const lat = f.geometry.coordinates[1].toFixed(2);
      const lon = f.geometry.coordinates[0].toFixed(2);
      const usgsUrl = f.properties.url || '#';
      let cls = 'minor', label = 'অনুভবযোগ্য নয়', barColor = 'linear-gradient(90deg,#d97706,#f59e0b)', markerColor = '#d97706';
      if (mag >= 5) { cls = 'danger'; label = 'মাঝারি বিপজ্জনক'; barColor = 'linear-gradient(90deg,#dc2626,#ef4444)'; markerColor = '#dc2626'; }
      else if (mag >= 4) { cls = 'warning'; label = 'সতর্কতামূলক'; barColor = 'linear-gradient(90deg,#dc2626,#f97316)'; markerColor = '#ea580c'; }
      else if (mag >= 3) { cls = 'warning'; label = 'হালকা'; barColor = 'linear-gradient(90deg,#ea580c,#f97316)'; markerColor = '#ea580c'; }
      const barW = Math.min(Math.round((mag / 8) * 100), 100);
      const timeAgo = eqAgo(time);
      return `<div class="eq-card ${cls}" style="cursor:pointer" onclick="window.open('${usgsUrl}','_blank','noopener,noreferrer')">
        <div class="eq-card-top">
          <div><div class="eq-mag ${cls}">${mag.toFixed(1)}</div><div class="eq-mag-label">রিখটার স্কেল</div></div>
          <span class="eq-badge ${cls}">${label}</span>
        </div>
        <div class="eq-location"><i class="fas fa-map-marker-alt" style="color:${markerColor};font-size:11px"></i> ${place}</div>
        <div class="eq-meta-row">
          <span><i class="fas fa-clock"></i> ${timeAgo}</span>
          <span><i class="fas fa-layer-group"></i> গভীরতা: ${depth} কি.মি.</span>
          <span><i class="fas fa-compass"></i> ${lat}°N, ${lon}°E</span>
        </div>
        <div class="eq-bar-wrap">
          <div class="eq-bar-bg"><div class="eq-bar-fill" style="width:${barW}%;background:${barColor}"></div></div>
          <div class="eq-scale"><span>০</span><span>৪</span><span>৮</span></div>
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:6px;text-align:right"><i class="fas fa-external-link-alt"></i> USGS বিস্তারিত দেখুন</div>
      </div>`;
    }).join('');
  } catch {
    el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)"><i class="fas fa-wifi" style="font-size:24px;display:block;margin-bottom:8px;color:var(--red)"></i>তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।</div>';
  }
}

function eqAgo(d) {
  const s = (Date.now() - d) / 1000;
  if (s < 60) return 'এইমাত্র';
  if (s < 3600) return Math.floor(s / 60) + ' মিনিট আগে';
  if (s < 86400) return Math.floor(s / 3600) + ' ঘণ্টা আগে';
  return Math.floor(s / 86400) + ' দিন আগে';
}

function translateEqLocation(loc) {
  if (!loc) return 'অজানা স্থান';
  const dict = {
    'Bangladesh': 'বাংলাদেশ', 'Sylhet': 'সিলেট', 'Dhaka': 'ঢাকা', 'Chittagong': 'চট্টগ্রাম', 'Chattogram': 'চট্টগ্রাম',
    'Khulna': 'খুলনা', 'Rajshahi': 'রাজশাহী', 'Barisal': 'বরিশাল', 'Rangpur': 'রংপুর', 'Mymensingh': 'ময়মনসিংহ',
    'Comilla': 'কুমিল্লা', "Cox's Bazar": 'কক্সবাজার', 'India': 'ভারত', 'Assam': 'আসাম', 'Tripura': 'ত্রিপুরা',
    'Meghalaya': 'মেঘালয়', 'Mizoram': 'মিজোরাম', 'West Bengal': 'পশ্চিমবঙ্গ', 'Myanmar': 'মিয়ানমার', 'Burma': 'মিয়ানমার',
    'border region': 'সীমান্ত অঞ্চল', 'region': 'অঞ্চল',
    ' N ': ' উত্তর ', ' S ': ' দক্ষিণ ', ' E ': ' পূর্ব ', ' W ': ' পশ্চিম ', ' NE ': ' উত্তর-পূর্ব ', ' NW ': ' উত্তর-পশ্চিম ',
    ' SE ': ' দক্ষিণ-পূর্ব ', ' SW ': ' দক্ষিণ-পশ্চিম ', ' NNE ': ' উত্তর-উত্তরপূর্ব ', ' NNW ': ' উত্তর-উত্তরপশ্চিম ',
    ' SSE ': ' দক্ষিণ-দক্ষিণপূর্ব ', ' SSW ': ' দক্ষিণ-দক্ষিণপশ্চিম ', ' ENE ': ' পূর্ব-উত্তরপূর্ব ', ' WNW ': ' পশ্চিম-উত্তরপশ্চিম ',
    ' ESE ': ' পূর্ব-দক্ষিণপূর্ব ', ' WSW ': ' পশ্চিম-দক্ষিণপশ্চিম '
  };
  
  const m = loc.match(/^([\d\.]+) km ([A-Z]+) of (.*)$/i);
  if (m) {
    let placeStr = m[3];
    for (let k in dict) {
      if (!k.startsWith(' ')) placeStr = placeStr.replace(new RegExp('\\b' + k + '\\b', 'gi'), dict[k]);
    }
    const dirBn = dict[' ' + m[2].toUpperCase() + ' ']?.trim() || m[2];
    const distBn = String(m[1]).replace(/[0-9]/g, w => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][w]);
    return `${placeStr} এর ${distBn} কি.মি. ${dirBn}ে`;
  }
  
  let t = loc;
  for (let k in dict) t = t.replace(new RegExp(k, 'gi'), dict[k]);
  return t;
}

function openEarthquakeModal() {
  document.getElementById('eqOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchEarthquakes();
  // Remove alert dot if exists
  const dot = document.querySelector('.eq-alert-dot');
  if (dot) dot.remove();
}
function closeEarthquakeModal() {
  document.getElementById('eqOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

let lastEqId = localStorage.getItem('last_eq_id') || null;
async function checkEarthquakeAlert() {
  try {
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=20&maxlatitude=27&minlongitude=88&maxlongitude=93&minmagnitude=2&limit=5&orderby=time';
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return;
    const data = await res.json();
    let features = data.features || [];
    features = features.filter(f => f.properties.place && f.properties.place.toLowerCase().includes('bangladesh'));
    if (!features.length) return;
    
    const latest = features[0];
    const id = latest.id;
    const time = latest.properties.time;
    
    // Only alert if new and happened in the last 2 hours
    if (id !== lastEqId && (Date.now() - time) < 2 * 60 * 60 * 1000) {
      lastEqId = id;
      localStorage.setItem('last_eq_id', id);
      
      const bnMag = String(latest.properties.mag.toFixed(1)).replace(/[0-9]/g, w => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][w]);
      const place = translateEqLocation(latest.properties.place);
      if (typeof showToast === 'function') {
        showToast(`⚠️ ভূমিকম্প সতর্কতা: ${place} অঞ্চলে ${bnMag} মাত্রার ভূমিকম্প! বিস্তারিত দেখতে ভূমিকম্প বাটনে ক্লিক করুন।`);
      }
      
      const btn = document.querySelector('.wc-eq-btn');
      if (btn && !document.querySelector('.eq-alert-dot')) {
         btn.innerHTML += '<span class="eq-alert-dot" style="display:inline-block;width:8px;height:8px;background:var(--red);border-radius:50%;margin-left:5px;box-shadow:0 0 8px var(--red)"></span>';
      }
    }
  } catch(e) {}
}
