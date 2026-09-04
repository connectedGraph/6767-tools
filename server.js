// Local self-host server: serves deploy/ (clean URLs) + mock /api/* backend.
// Data persisted in ../_server_data/store.json. Start: node deploy/server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || process.argv[2] || 8093);
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, '_server_data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const UPLOAD_DIR = path.join(ROOT, 'up', 'uploads');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8', '.map': 'application/json',
  '.wasm': 'application/wasm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
};

// ---------- persistent store ----------
function defaultStore() { return { users: {}, tokens: {}, comments: [], rankings: [], records: [] }; }
let store = defaultStore();
try { store = Object.assign(defaultStore(), JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'))); } catch (e) {}
function save() { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(STORE_FILE, JSON.stringify(store)); }

function uid() { return crypto.randomBytes(12).toString('hex'); }

// ---------- ip2region geo lookup (vendored, offline xdb) ----------
let ip2regionSearcher = null;
try {
  const ip2region = require('./vendor/ip2region.js');
  const xdb = ip2region.loadContentFromFile(path.join(__dirname, 'data', 'ip2region_v4.xdb'));
  ip2regionSearcher = ip2region.newWithBuffer(ip2region.IPv4, xdb);
} catch (e) {
  console.warn('[ip2region] load failed:', e.message);
}

const COUNTRY_NAMES = {
  CN: { zh: '中国', en: 'China', 'zh-TW': '中國' },
  US: { zh: '美国', en: 'United States', 'zh-TW': '美國' },
  HK: { zh: '中国香港', en: 'Hong Kong', 'zh-TW': '中國香港' },
  TW: { zh: '中国台湾', en: 'Taiwan', 'zh-TW': '台灣' },
  MO: { zh: '中国澳门', en: 'Macau', 'zh-TW': '中國澳門' },
  JP: { zh: '日本', en: 'Japan', 'zh-TW': '日本' },
  KR: { zh: '韩国', en: 'South Korea', 'zh-TW': '韓國' },
  SG: { zh: '新加坡', en: 'Singapore', 'zh-TW': '新加坡' },
  GB: { zh: '英国', en: 'United Kingdom', 'zh-TW': '英國' },
  DE: { zh: '德国', en: 'Germany', 'zh-TW': '德國' },
  FR: { zh: '法国', en: 'France', 'zh-TW': '法國' },
  CA: { zh: '加拿大', en: 'Canada', 'zh-TW': '加拿大' },
  AU: { zh: '澳大利亚', en: 'Australia', 'zh-TW': '澳大利亞' },
  RU: { zh: '俄罗斯', en: 'Russia', 'zh-TW': '俄羅斯' },
  IN: { zh: '印度', en: 'India', 'zh-TW': '印度' },
  BR: { zh: '巴西', en: 'Brazil', 'zh-TW': '巴西' },
  MY: { zh: '马来西亚', en: 'Malaysia', 'zh-TW': '馬來西亞' },
  TH: { zh: '泰国', en: 'Thailand', 'zh-TW': '泰國' },
  VN: { zh: '越南', en: 'Vietnam', 'zh-TW': '越南' },
  ID: { zh: '印度尼西亚', en: 'Indonesia', 'zh-TW': '印度尼西亞' },
  PH: { zh: '菲律宾', en: 'Philippines', 'zh-TW': '菲律賓' },
};

function normalizeCountryCode(v) {
  const c = String(v || '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : '';
}
function countryCodeToEmoji(v) {
  const c = normalizeCountryCode(v);
  if (!c) return '🌐';
  return String.fromCodePoint(...[...c].map(ch => ch.charCodeAt(0) + 127397));
}
function normalizeClientIp(value) {
  let ip = String(value || '').split(',')[0].trim();
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (ip === '::1' || ip === '127.0.0.1') return '';
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(ip)) return '';
  if (/^(fc|fd|fe80)/.test(ip)) return '';
  return ip;
}
function getClientIp(req) {
  const chain = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  let ip = '';
  if (chain.length >= 2) ip = normalizeClientIp(chain[chain.length - 2]);
  else if (chain.length === 1) ip = normalizeClientIp(chain[0]);
  if (!ip) ip = normalizeClientIp(req.socket && req.socket.remoteAddress);
  return ip;
}
async function getVisitorLocation(req, lang = 'zh') {
  const headerCountry =
    normalizeCountryCode(req.headers['cf-ipcountry']) ||
    normalizeCountryCode(req.headers['x-country-code']) ||
    normalizeCountryCode(req.headers['x-geo-country']);
  if (headerCountry) {
    const cObj = COUNTRY_NAMES[headerCountry];
    const localizedCountry = cObj ? (cObj[lang] || cObj.zh) : headerCountry;
    return { countryCode: headerCountry, flag: countryCodeToEmoji(headerCountry), country: localizedCountry, source: 'proxy-header' };
  }
  const ip = getClientIp(req);
  if (!ip) return { countryCode: '', flag: '🌐', source: 'unknown' };
  if (ip2regionSearcher) {
    try {
      const regionStr = await ip2regionSearcher.search(ip);
      if (regionStr && regionStr !== 'Reserved|Reserved|Reserved|0|0') {
        const p = regionStr.split('|');
        let country = p[0] !== '0' ? p[0] : '';
        const province = p[1] !== '0' ? p[1] : '';
        const city = p[2] !== '0' ? p[2] : '';
        const isp = p[3] !== '0' ? p[3] : '';
        const cc = p[4] && /^[A-Z]{2}$/.test(p[4]) ? p[4] : (country === '中国' ? 'CN' : '');
        if (cc && COUNTRY_NAMES[cc]) {
          country = COUNTRY_NAMES[cc][lang] || country;
        }
        return { countryCode: cc, flag: countryCodeToEmoji(cc), country, province, city, isp, source: 'ip2region' };
      }
    } catch (e) { /* fallthrough to unknown */ }
  }
  return { countryCode: '', flag: '🌐', source: 'unknown' };
}

// ---------- site visits (persisted, throttled, online tracking) ----------
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const THROTTLE_WINDOW_MS = 5 * 60 * 1000;
const ONLINE_TTL_MS = 60 * 1000;

function visitsTodayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function readVisitsState() {
  try {
    const o = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
    return { total: Number(o.total) || 0, byDay: o.byDay && typeof o.byDay === 'object' ? o.byDay : {} };
  } catch (e) { return { total: 0, byDay: {} }; }
}
let visitsState = readVisitsState();
let visitsDirty = false;
function saveVisits() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = VISITS_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(visitsState));
    fs.renameSync(tmp, VISITS_FILE);
  } catch (e) { console.warn('[visits] save failed:', e.message); }
}
const seenVisitors = new Map();   // visitorKey -> last seen ts
const onlineVisitors = new Map(); // sid -> last heartbeat ts
function visitorKey(req) {
  const ip = getClientIp(req) || '0.0.0.0';
  const ua = String(req.headers['user-agent'] || '').slice(0, 200);
  return crypto.createHash('sha1').update(ip + '|' + ua).digest('hex');
}
function pruneMap(map, ttl, now) { for (const [k, t] of map) if (t < now - ttl) map.delete(k); }
function visitsSnapshot() {
  pruneMap(onlineVisitors, ONLINE_TTL_MS, Date.now());
  return { total: visitsState.total, today: visitsState.byDay[visitsTodayKey()] || 0, day: visitsTodayKey(), online: onlineVisitors.size };
}
function visitsRecord(req) {
  const now = Date.now();
  const key = visitorKey(req);
  const last = seenVisitors.get(key);
  if (last && now - last < THROTTLE_WINDOW_MS) return { ...visitsSnapshot(), counted: false };
  seenVisitors.set(key, now);
  if (seenVisitors.size >= 4096) pruneMap(seenVisitors, THROTTLE_WINDOW_MS, now);
  const day = visitsTodayKey();
  visitsState.total += 1;
  visitsState.byDay[day] = (visitsState.byDay[day] || 0) + 1;
  visitsDirty = true;
  return { ...visitsSnapshot(), counted: true };
}
function normalizeSid(raw) {
  const s = String(raw || '').trim();
  return (s && s.length <= 128 && /^[A-Za-z0-9._:-]+$/.test(s)) ? s : '';
}
setInterval(() => { pruneMap(onlineVisitors, ONLINE_TTL_MS, Date.now()); }, 30 * 1000).unref();
setInterval(() => { if (visitsDirty) { visitsDirty = false; saveVisits(); } }, 5 * 1000).unref();
function getReqLang(req, query) {
  if (query && query.get('lang')) {
    const l = query.get('lang').toLowerCase();
    if (l === 'en') return 'en';
    if (l === 'zh-tw' || l === 'zh-hk' || l === 'zh-hant') return 'zh-TW';
    return 'zh';
  }
  const hLang = req.headers['x-language'] || req.headers['x-lang'];
  if (hLang) {
    const l = String(hLang).toLowerCase();
    if (l.startsWith('en')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('hant')) return 'zh-TW';
    return 'zh';
  }
  const cookies = req.headers['cookie'] || '';
  const cookieMatch = cookies.match(/(?:^|;\s*)6767_lang=([^;]+)/) || cookies.match(/(?:^|;\s*)lang=([^;]+)/);
  if (cookieMatch) {
    const l = decodeURIComponent(cookieMatch[1]).toLowerCase();
    if (l.startsWith('en')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('hant')) return 'zh-TW';
    return 'zh';
  }
  const acceptLang = req.headers['accept-language'] || '';
  if (acceptLang) {
    const l = acceptLang.toLowerCase();
    if (l.startsWith('en')) return 'en';
    if (l.includes('zh-tw') || l.includes('zh-hk') || l.includes('zh-hant')) return 'zh-TW';
  }
  return 'zh';
}

const MSG = {
  success: { zh: '成功', en: 'Success', 'zh-TW': '成功' },
  notFound: { zh: '接口不存在', en: 'API endpoint not found', 'zh-TW': '接口不存在' },
  serverError: { zh: '服务器异常', en: 'Internal server error', 'zh-TW': '服務器異常' },
  anonymousUser: { zh: '匿名用户', en: 'Anonymous User', 'zh-TW': '匿名用戶' },
};

function ok(data, message = null, lang = 'zh') {
  const msg = typeof message === 'string' ? message : (MSG.success[lang] || '成功');
  return { code: 1, message: msg, data };
}
function err(code, message = null, lang = 'zh') {
  let msg = typeof message === 'string' ? message : null;
  if (!msg) {
    if (code === 404) msg = MSG.notFound[lang] || '接口不存在';
    else msg = MSG.serverError[lang] || '服务器异常';
  }
  return { code, message: msg };
}

function bearer(req) {
  const h = req.headers['authorization'] || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}
function userFor(req) {
  const t = bearer(req);
  if (!t) return null;
  const u = store.tokens[t];
  return u || null;
}
function tokenFor(user) { const t = uid(); store.tokens[t] = user; save(); return t; }

// ---------- captcha images ----------
function svgPlaceholder(color, w, h, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${color}"/><text x="10" y="${h/2}" font-size="14" fill="#fff">${label}</text></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

// ---------- API router ----------
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const ct = req.headers['content-type'] || '';
      if (ct.includes('application/json')) {
        try { resolve(JSON.parse(buf.toString('utf8'))); } catch (e) { resolve(null); }
      } else if (ct.includes('application/x-www-form-urlencoded')) {
        const o = {};
        new URLSearchParams(buf.toString('utf8')).forEach((v, k) => o[k] = v);
        resolve(o);
      } else { resolve(buf); }
    });
  });
}

function extractMultipartField(buf, field) {
  const s = buf.toString('latin1');
  const m = s.match(new RegExp('name="' + field + '"([\\s\\S]*?)\\r\\n\\r\\n([\\s\\S]*?)\\r\\n--'));
  return m ? m[2] : null;
}
function extractMultipartFile(buf) {
  const s = buf.toString('latin1');
  const m = s.match(/filename="([^"]*)"[\s\S]*?\r\n\r\n([\s\S]*?)\r\n--/);
  return m ? { name: m[1], data: Buffer.from(m[2], 'latin1') } : null;
}

async function handleApi(req, res, pathname, query) {
  const lang = getReqLang(req, query);
  const method = req.method.toUpperCase();
  const seg = pathname.replace(/^\/api\//, '').split('/').filter(Boolean); // e.g. ['User','SignIn']
  const ctrl = seg[0] || '', act = seg[1] || '';

  // ---- User ----
  if (ctrl === 'User') {
    if (act === 'SignIn' || act === 'SignUp') {
      const body = await readBody(req) || {};
      const account = body.account || body.phone || body.email || 'guest';
      let u = store.users[account];
      if (!u) { u = { userId: uid(), account, userName: account.split('@')[0], avatar: '', pwd: body.pwd || '' }; store.users[account] = u; save(); }
      const token = tokenFor(u);
      res.setHeader('Token', token);
      return ok(token, MSG.success[lang], lang);
    }
    if (act === 'GetUserSummary') {
      const u = userFor(req);
      return ok(u ? { userId: u.userId, account: u.account, userName: u.userName, avatar: u.avatar || '' } : null, null, lang);
    }
    if (act === 'AccountExists') return ok(false, null, lang);
    if (act === 'GetAllAccount') return ok([], null, lang);
    if (act === 'IdentityAuth') return ok(true, null, lang);
    if (act === 'ResetPwd') return ok(true, null, lang);
    if (act === 'SignOut') return ok(true, null, lang);
  }

  // ---- Comment ----
  if (ctrl === 'Comment') {
    if (act === 'GetList') {
      const body = await readBody(req) || {};
      const key = (body.commentClass || 1) + ':' + (body.relateId || 0);
      const list = store.comments.filter(c => c.key === key).slice(0, body.pageSize || 15);
      return ok({
        totalCount: list.length, pageIndex: 0, pageSize: body.pageSize || 15,
        pageCount: Math.ceil(list.length / (body.pageSize || 15)) || 0, pageUrl: '',
        dataList: list, dataExtend: { allCommentCount: store.comments.filter(c => c.key === key).length }
      }, null, lang);
    }
    if (act === 'Add') {
      const body = await readBody(req) || {};
      const u = userFor(req);
      const comment = {
        commentId: uid(), key: (body.commentClass || 1) + ':' + (body.relateId || 0),
        content: body.content || '', createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        userName: u ? u.userName : (MSG.anonymousUser[lang] || '匿名用户'), avatar: u ? (u.avatar || '') : '',
        userId: u ? u.userId : null, likeCount: 0, replyList: []
      };
      store.comments.push(comment); save();
      return ok(true, null, lang);
    }
  }

  // ---- Common (captcha / send code) ----
  if (ctrl === 'Common') {
    if (act === 'GetCaptcha') {
      return ok({ background: svgPlaceholder('#7c9cc9', 280, 160, 'captcha'), slide: svgPlaceholder('#4a6da7', 62, 160, ' ') }, null, lang);
    }
    if (act === 'SendCode') return ok(true, null, lang);
  }

  // ---- Rankings / Records ----
  if (ctrl === 'NlxlRankingList' && act === 'Add') { await readBody(req); store.rankings.push({ t: Date.now() }); save(); return ok(true, null, lang); }
  if (ctrl === 'NlxlRecord' && act === 'GetList') { await readBody(req); return ok({ dataList: store.records.filter(r => r.userId === (userFor(req) || {}).userId) }, null, lang); }

  // ---- Feedback ----
  if (ctrl === 'Feedback' && act === 'Add') { await readBody(req); return ok(true, null, lang); }

  // ---- Upload ----
  if (ctrl === 'File' && act === 'UploadFormFile') {
    const buf = await readBody(req);
    const f = extractMultipartFile(Buffer.isBuffer(buf) ? buf : Buffer.alloc(0));
    let url = '';
    if (f && f.data.length) {
      const name = (f.name || 'upload').replace(/[^\w.\-]/g, '_');
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, name), f.data);
      url = '/up/uploads/' + name;
    }
    return ok({ url, name: f ? f.name : '' }, null, lang);
  }

  // ---- Visits (real persisted counts + ip2region geo + online tracking) ----
  if (ctrl.toLowerCase() === 'visits') {
    if (act === 'heartbeat' || act === 'leave') {
      const body = await readBody(req) || {};
      const sid = normalizeSid(body.sid);
      if (act === 'leave' && sid) { onlineVisitors.delete(sid); return ok(true, null, lang); }
      if (!sid) return ok({ ...visitsSnapshot(), accepted: false }, null, lang);
      if (onlineVisitors.size >= 50000 && !onlineVisitors.has(sid)) return ok({ ...visitsSnapshot(), accepted: false }, null, lang);
      onlineVisitors.set(sid, Date.now());
      return ok({ ...visitsSnapshot(), accepted: true }, null, lang);
    }
    const peek = !!query.get('peek');
    const snap = peek ? visitsSnapshot() : visitsRecord(req);
    const location = await getVisitorLocation(req, lang);
    const data = { ...snap, location, counted: peek ? false : snap.counted !== false, lang };
    if (query.get('debug') === '1') {
      data.debug = {
        xff: req.headers['x-forwarded-for'] || '',
        clientIp: getClientIp(req),
        source: location.source,
        lang,
      };
    }
    return ok(data, null, lang);
  }

  // ---- Notice ----
  if (ctrl.toLowerCase() === 'notice') {
    const notices = {
      zh: { text: '本站为本地自托管副本 · 全部工具本地运行，零外部请求', buttonText: '浏览工具', buttonLink: './Search' },
      en: { text: 'Local Self-Hosted Instance · All tools run locally with zero external requests', buttonText: 'Browse Tools', buttonLink: './Search' },
      'zh-TW': { text: '本站為本地自託管副本 · 全部工具本地運行，零外部請求', buttonText: '瀏覽工具', buttonLink: './Search' }
    };
    return ok(notices[lang] || notices.zh, null, lang);
  }

  return err(404, null, lang);
}

// ---------- sitemap (dynamic: scan pages/ + ResumeTemplate/) ----------
const SITE_ORIGIN = 'https://tool.6767.chat';
// Low-value pages excluded from indexing
const SITEMAP_EXCLUDE = new Set(['Account', 'Feedback', 'admin', 'login', 'Search']);
function sitemapXml() {
  const urls = [];   // {loc, priority}
  urls.push({ loc: '/', priority: '1.0' });
  // category pages first
  let pageFiles = [];
  try { pageFiles = fs.readdirSync(path.join(ROOT, 'pages')).filter(f => f.endsWith('.html')); } catch (e) {}
  pageFiles.sort();
  for (const f of pageFiles) {
    const name = f.slice(0, -5);
    if (name === 'index' || SITEMAP_EXCLUDE.has(name)) continue;
    urls.push({ loc: '/' + name, priority: '0.8' });
  }
  const now = new Date().toISOString().slice(0, 10);
  const body = urls.map(u =>
    `  <url><loc>${SITE_ORIGIN}${u.loc}</loc><lastmod>${now}</lastmod><priority>${u.priority}</priority></url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

// ---------- static server ----------
function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';   // '/' -> '/index.html', '/brain/' -> '/brain/index.html'
  if (p === '/index.html' || p === 'index.html') return 'pages/index.html';
  if (!path.extname(p)) {
    if (fs.existsSync(path.join(ROOT, 'pages', p + '.html'))) return 'pages/' + p + '.html';
    if (fs.existsSync(path.join(ROOT, 'pages', p, 'index.html'))) return 'pages/' + p + '/index.html';
  }
  return p;   // 有扩展名（/js/... /lib/... /favicon.ico）直接从 ROOT 读
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const pathname = u.pathname;

  if (pathname.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      });
      return res.end();
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    try {
      const result = await handleApi(req, res, pathname, u.searchParams);
      const body = JSON.stringify(result);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(body);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify(err(500, '服务器异常')));
    }
  }

  if (pathname === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(sitemapXml());
  }
  if (pathname === '/robots.txt') {
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /up/uploads/',
      'Sitemap: ' + SITE_ORIGIN + '/sitemap.xml',
      '',
      'User-agent: Baiduspider',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /up/uploads/',
      'Sitemap: ' + SITE_ORIGIN + '/sitemap.xml',
      '',
    ].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(robots);
  }

  const rel = resolveFile(pathname);
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404: ' + rel);
  }
  const ext = path.extname(file).toLowerCase();
  // 缓存策略：HTML 立即重验（EdgeOne/浏览器部署即生效），代码资源 1h，图片/字体/媒体 7d，未知类型保守 no-cache
  const cacheCtl = ext === '.html' ? 'no-cache'
    : ['.js', '.css', '.json', '.map', '.txt'].includes(ext) ? 'public, max-age=3600'
    : (ext in MIME) ? 'public, max-age=604800'
    : 'no-cache';
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cacheCtl });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`self-host server on http://localhost:${PORT}/  (static + mock /api, data in ${DATA_DIR})`));
