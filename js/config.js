const INTERVAL = 5 * 60 * 1000;
const NEWS_CACHE_KEY = 'patrika_news_cache_v8';
const FIFA_CACHE_KEY = 'patrika_fifa_cache_v3';
const WX_CACHE_KEY = 'patrika_wx_cache';
const NEWS_CACHE_TTL = 5 * 60 * 1000;
const FIFA_CACHE_TTL = 2 * 60 * 1000;
const WX_CACHE_TTL = 30 * 60 * 1000;
const PER_PAGE = 12;
const PROXIES = [
  { url: 'https://api.allorigins.win/raw?url=', encode: true },
  { url: 'https://corsproxy.io/?', encode: false },
  { url: 'https://api.codetabs.com/v1/proxy?quest=', encode: false }
];

const SOURCES = [
  { name: 'প্রথম আলো', url: 'https://www.prothomalo.com/feed', cat: 'জাতীয়' },
  { name: 'কালের কণ্ঠ', url: 'https://www.kalerkantho.com/feed', cat: 'জাতীয়' },
  { name: 'বাংলা ট্রিবিউন', url: 'https://www.banglatribune.com/feed/', cat: 'জাতীয়' },
  { name: 'যুগান্তর', url: 'https://www.jugantor.com/feed', cat: 'জাতীয়' },
  { name: 'সমকাল', url: 'https://samakal.com/feed', cat: 'জাতীয়' },
  { name: 'ইত্তেফাক', url: 'https://www.ittefaq.com.bd/feed', cat: 'জাতীয়' },
  { name: 'মানবজমিন', url: 'https://mzamin.com/feed', cat: 'জাতীয়' },
  { name: 'ভোরের কাগজ', url: 'https://www.bhorerkagoj.com/feed', cat: 'জাতীয়' },
  { name: 'নয়া দিগন্ত', url: 'https://www.dailynayadiganta.com/rss/latest-news', cat: 'জাতীয়' },
  { name: 'বিডিনিউজ২৪', url: 'https://bdnews24.com/bangla/feed', cat: 'জাতীয়' },
  { name: 'বিবিসি বাংলা', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', cat: 'আন্তর্জাতিক' },
  { name: 'দেশ রূপান্তর', url: 'https://www.deshrupantor.com/feed', cat: 'জাতীয়' },
];

const CATS = ['জাতীয়', 'আন্তর্জাতিক', 'রাজনীতি', 'খেলাধুলা', 'ব্যবসা', 'বিনোদন', 'প্রযুক্তি', 'স্বাস্থ্য', 'শিক্ষা', 'চাকরি'];
const ICONS = { জাতীয়: '🏛️', আন্তর্জাতিক: '🌍', রাজনীতি: '⚖️', খেলাধুলা: '⚽', বিনোদন: '🎬', ব্যবসা: '📈', প্রযুক্তি: '💻', স্বাস্থ্য: '🏥', শিক্ষা: '📚', চাকরি: '💼' };
const CAT_RE = {
  খেলাধুলা: /ক্রিকেট|ফুটবল|খেলোয়াড়|খেলাধুলা|ক্রীড়া|টুর্নামেন্ট|বিপিএল|আইপিএল|পিএসএল|এলপিএল|সিপিএল|ওয়ানডে|টি-টোয়েন্টি|টি২০|\bt20\b|\bodi\b|টেস্ট ম্যাচ|অলিম্পিক|চ্যাম্পিয়ন|ব্যাডমিন্টন|হকি|সাঁতার|অ্যাথলেটিক্স|টেনিস|গলফ|রাগবি|স্পোর্টস|বিশ্বকাপ|ফিফা|উয়েফা|\bfifa\b|\bworld cup\b|মেসি|রোনালদো|এমবাপে|হ্যালান্ড|নেইমার|সাকিব|তামিম|মুশফিক|কোহলি|ধোনি|রোহিত|পিএসজি|বার্সেলোনা|রিয়াল মাদ্রিদ|লিভারপুল|আর্সেনাল|চেলসি|জুভেন্টাস|বায়ার্ন|বিসিসিআই|আইসিসি|\bicc\b|\bbcci\b|কোপা আমেরিকা|ইউরো কাপ|লা লিগা|ইপিএল|উয়েফা|উইকেট|বোলার|ব্যাটার|ব্যাটসম্যান|অধিনায়ক|স্টেডিয়াম|হ্যাটট্রিক|শতরান|সেঞ্চুরি|ফাইনাল|সেমিফাইনাল|কোয়ার্টার ফাইনাল|ট্রফি|স্বর্ণপদক|রৌপ্যপদক|ব্রোঞ্জ পদক|ফুটসাল|ভলিবল|বাস্কেটবল|কাবাডি|কুস্তি|বক্সিং|মুষ্টিযুদ্ধ|সাইক্লিং|মোটরস্পোর্ট|ফর্মুলা ওয়ান|দৌড় প্রতিযোগিতা|\bcricket\b|\bfootball\b|\bsoccer\b|\bsports\b|\btournament\b|\bipl\b|\bbpl\b|\bolympic\b|\bbadminton\b|\btennis\b|\bgolf\b|\brugby\b|\bstadium\b/i,
  বিনোদন: /চলচ্চিত্র|সিনেমা|নাটক(?!ীয়)|(?<!অধি)নায়ক|নায়িকা|অভিনেত্রী|অভিনেতা|বলিউড|হলিউড|টলিউড|ঢালিউড|সঙ্গীত|সংগীত|কণ্ঠশিল্পী|সুরকার|গীতিকার|কনসার্ট|গায়ক|গায়িকা|চিত্রনায়ক|চিত্রনায়িকা|ফিল্ম স্টার|মিউজিক|অ্যালবাম|ছবি মুক্তি|টেলিফিল্ম|ওয়েব সিরিজ|ওটিটি|বক্স অফিস|নতুন গান|গানের ভিডিও|প্লেব্যাক|চলচ্চিত্র উৎসব|শ্রেষ্ঠ অভিনেতা|শ্রেষ্ঠ অভিনেত্রী|রিয়ালিটি শো|সিরিয়াল|মডেল|ফ্যাশন শো|লাইভ শো|মঞ্চ অনুষ্ঠান|শিল্পী|entertainment|movie|tv drama|celebrity|bollywood|hollywood|film star|music video|web series|singer|actor|actress|reality show|fashion show/i,
  প্রযুক্তি: /প্রযুক্তি|বিজ্ঞান|আইটি|tech|digital|internet|ai|artificial intelligence|software|cyber|smartphone|robot|app|facebook|google|amazon|microsoft|apple|youtube|instagram|twitter|bitcoin|crypto|android|ios|laptop|computer|ecommerce|cloud|samsung|wifi|bluetooth/i,
  আন্তর্জাতিক: /আন্তর্জাতিক|জাতিসংঘ|বিশ্বব্যাংক|ভারত|পাকিস্তান|চীন|রাশিয়া|ইউক্রেন|ইসরায়েল|ফিলিস্তিন|গাজা|আফগানিস্তান|মিয়ানমার|জাপান|দক্ষিণ কোরিয়া|উত্তর কোরিয়া|ইরান|সৌদি আরব|তুরস্ক|মালয়েশিয়া|সিঙ্গাপুর|যুক্তরাজ্য|ফ্রান্স|জার্মানি|অস্ট্রেলিয়া|কানাডা|নেপাল|শ্রীলঙ্কা|ভুটান|মালদ্বীপ|ইন্দোনেশিয়া|ফিলিপাইন|থাইল্যান্ড|ভিয়েতনাম|ইরাক|সিরিয়া|লেবানন|ইয়েমেন|লিবিয়া|সুদান|ব্রাজিল|আর্জেন্টিনা|ইতালি|স্পেন|পোল্যান্ড|গ্রিস|নিউজিল্যান্ড|দক্ষিণ আফ্রিকা|কেনিয়া|ইথিওপিয়া|মার্কিন যুক্তরাষ্ট্র|যুক্তরাষ্ট্র|আমেরিকা|মার্কিন|ইংল্যান্ড|নিউইয়র্ক|ইউরোপীয় ইউনিয়ন|মধ্যপ্রাচ্য|পশ্চিমবঙ্গ|নয়া দিল্লি|মুম্বাই|কলকাতায়|টোকিও|ওসাকা|ওয়াশিংটন|লন্ডন|প্যারিস|বার্লিন|বেইজিং|মস্কো|দুবাই|আবুধাবি|কাতার|কুয়েত|ওমান|বাহরাইন|প্রবাসী বাংলাদেশি|প্রবাসীদের|বিদেশে|বিদেশ মন্ত্রণালয়|কূটনৈতিক|দূতাবাস|বৈশ্বিক|বিশ্বব্যাপী|আন্তর্জাতিক মুদ্রা তহবিল|ন্যাটো|ট্রাম্প|বাইডেন|মোদি|মমতা|পুতিন|জিনপিং|united nations|world bank|india|pakistan|china|russia|ukraine|israel|palestine|myanmar|imf|nato|japan|korea|iran|saudi|turkey|uk|france|germany|australia|canada|nepal|thailand|vietnam|iraq|syria|brazil|argentina|italy|spain|trump|biden|modi|putin|washington|london|paris|berlin|beijing|moscow|dubai|qatar|embassy|diplomatic|international|foreign|global|world|usa/i,
  স্বাস্থ্য: /স্বাস্থ্য|সুস্থতা|ব্যায়াম|ফিটনেস|চিকিৎসক|চিকিৎসা|হাসপাতাল|ক্লিনিক|ডাক্তার|নার্স|মহামারি|ভ্যাকসিন|টিকাদান|টিকা কেন্দ্র|করোনার টিকা|ডেঙ্গুর টিকা|করোনা|কোভিড|ডেঙ্গু|ওষুধ|ম্যালেরিয়া|যক্ষ্মা|ক্যান্সার|ডায়াবেটিস|হৃদরোগ|কিডনি রোগ|রক্তদান|রোগ প্রতিরোধ|মেডিকেল কলেজ|চিকিৎসা সেবা|পুষ্টি|খাদ্যমান|রোগী|রোগীর|রোগের|রোগাক্রান্ত|রোগবালাই|সংক্রামক রোগ|জটিল রোগ|শল্যচিকিৎসা|অস্ত্রোপচার|ফার্মাসিউটিক্যাল|\bhealth\b|\bwellness\b|\bhospital\b|\bdoctor\b|\bvaccine\b|\bcoronavirus\b|\bcovid\b|\bdengue\b|\bmedicine\b|\bmalaria\b|\bcancer\b|\bdiabetes\b|\bpandemic\b|\bmedical\b|\bdisease\b|\bpatient\b|\bsurgery\b|\bpharmacy\b|\bnutrition\b/i,
  শিক্ষা: /বিশ্ববিদ্যালয়|এসএসসি|এইচএসসি|শিক্ষার্থী|শিক্ষাবোর্ড|পরীক্ষার ফল|শিক্ষাবৃত্তি|উপবৃত্তি|মেধাবৃত্তি|বিদ্যালয়|কলেজ|মাদ্রাসা|শিক্ষক|শিক্ষিকা|শিক্ষা মন্ত্রণালয়|বিশ্ববিদ্যালয় ভর্তি|ভর্তি পরীক্ষা|পাবলিক পরীক্ষা|জেএসসি|পিইসি|উচ্চ মাধ্যমিক|মাধ্যমিক|প্রাথমিক বিদ্যালয়|শিক্ষাপ্রতিষ্ঠান|বিশ্ববিদ্যালয় মঞ্জুরি|ইউজিসি|পাঠ্যবই|পাঠ্যক্রম|সিলেবাস|অটোপাস|university|school|college|ssc|hsc|exam result|scholarship|madrasa|education ministry|admission|ugc/i,
  চাকরি: /চাকরি|নিয়োগ বিজ্ঞপ্তি|সরকারি চাকরি|বেসরকারি চাকরি|নিয়োগ পরীক্ষা|বিসিএস|পিএসসি|চাকরিপ্রার্থী|নিয়োগ দেবে|পদের নাম|পদ শূন্য|আবেদন করুন|আবেদনের শেষ|নিয়োগ প্রকাশ|কর্মী নিয়োগ|শিক্ষক নিয়োগ|জনবল নিয়োগ|অফিসার নিয়োগ|বিশাল নিয়োগ|চাকরির সুযোগ|কর্মসংস্থান|বেকারত্ব|নতুন নিয়োগ|নিয়োগকর্তা|শ্রম বাজার|কর্মক্ষেত্র|job circular|recruitment|government job|private job|vacancy|hiring|bcs|psc|employment|career|job fair|labor market|work opportunity/i,
  ব্যবসা: /শেয়ারবাজার|পুঁজিবাজার|রপ্তানি আয়|আমদানি ব্যয়|মূল্যস্ফীতি|জিডিপি|বাণিজ্যিক|কর্পোরেট|জাতীয় বাজেট|অর্থ মন্ত্রণালয়|বাণিজ্য মন্ত্রণালয়|ব্যাংকিং খাত|বিনিয়োগ|টাকার দাম|ডলার রেট|বৈদেশিক মুদ্রা|রপ্তানি খাত|বেসরকারি বিনিয়োগ|ব্যবসায়ী সংগঠন|stock market|gdp|inflation|export|import earnings|national budget|finance ministry|banking sector|investment|dollar rate|foreign currency/i,
  আন্তর্জাতিক: /আন্তর্জাতিক|জাতিসংঘ|বিশ্বব্যাংক|ভারত|পাকিস্তান|চীন|রাশিয়া|ইউক্রেন|ইসরায়েল|ফিলিস্তিন|গাজা|আফগানিস্তান|মিয়ানমার|জাপান|দক্ষিণ কোরিয়া|উত্তর কোরিয়া|ইরান|সৌদি আরব|তুরস্ক|মালয়েশিয়া|সিঙ্গাপুর|যুক্তরাজ্য|ফ্রান্স|জার্মানি|অস্ট্রেলিয়া|কানাডা|নেপাল|শ্রীলঙ্কা|ভুটান|মালদ্বীপ|ইন্দোনেশিয়া|ফিলিপাইন|থাইল্যান্ড|ভিয়েতনাম|ইরাক|সিরিয়া|লেবানন|ইয়েমেন|লিবিয়া|সুদান|ব্রাজিল|আর্জেন্টিনা|ইতালি|স্পেন|পোল্যান্ড|গ্রিস|নিউজিল্যান্ড|দক্ষিণ আফ্রিকা|কেনিয়া|ইথিওপিয়া|মার্কিন যুক্তরাষ্ট্র|যুক্তরাষ্ট্র|আমেরিকা|মার্কিন|ইংল্যান্ড|নিউইয়র্ক|ইউরোপীয় ইউনিয়ন|মধ্যপ্রাচ্য|পশ্চিমবঙ্গ|নয়া দিল্লি|মুম্বাই|কলকাতায়|টোকিও|ওসাকা|ওয়াশিংটন|লন্ডন|প্যারিস|বার্লিন|বেইজিং|মস্কো|দুবাই|আবুধাবি|কাতার|কুয়েত|ওমান|বাহরাইন|প্রবাসী বাংলাদেশি|প্রবাসীদের|বিদেশে|বিদেশ মন্ত্রণালয়|কূটনৈতিক|দূতাবাস|বৈশ্বিক|বিশ্বব্যাপী|আন্তর্জাতিক মুদ্রা তহবিল|ন্যাটো|ট্রাম্প|বাইডেন|মোদি|মমতা|পুতিন|জিনপিং|united nations|world bank|india|pakistan|china|russia|ukraine|israel|palestine|myanmar|imf|nato|japan|korea|iran|saudi|turkey|uk|france|germany|australia|canada|nepal|thailand|vietnam|iraq|syria|brazil|argentina|italy|spain|trump|biden|modi|putin|washington|london|paris|berlin|beijing|moscow|dubai|qatar|embassy|diplomatic|international|foreign|global|world|usa/i,
  রাজনীতি: /রাজনীতি|রাজনৈতিক দল|আওয়ামী লীগ|বিএনপি|জামায়াত|নির্বাচন কমিশন|সংসদ অধিবেশন|রাজনৈতিক নেতা|প্রধানমন্ত্রীর বক্তব্য|সরকারের সিদ্ধান্ত|বিরোধী দল|ক্ষমতাসীন দল|রাজনৈতিক সংকট|হরতাল|রাজনৈতিক আন্দোলন|নির্বাচনী প্রচারণা|গণতন্ত্র পুনরুদ্ধার|political party|election commission|parliament session|ruling party|opposition party|political crisis|political movement/i,
};

let news = [], filtered = [], seenUrls = new Set();
let curCat = 'সব', page = 1;
let rTimer = null, srcStat = {}, query = '', pendingUrl = null;

// ── BDAPPS CONFIG ── Replace APP_ID and PASSWORD with your real credentials from developer.bdapps.com
const BDAPPS_APP_ID = 'APP_XXXXXXXXXX';
const BDAPPS_PASSWORD = 'XXXXXXXXXXXXXXXXXX';
const BDAPPS_PROXY = 'https://corsproxy.io/?';
let pendingMsisdn = '';
