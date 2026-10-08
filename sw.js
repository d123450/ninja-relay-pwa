/* Stable bootstrap worker: application releases change only on an explicit UI message. */
const BASE = new URL(self.registration.scope).pathname;
const SUFFIX = BASE === '/' ? '' : `:${BASE}`;
const META = `relay-meta-v1${SUFFIX}`, KEY = `${BASE}__relay_state__`;
const cacheName = version => `relay-release-${version}${SUFFIX}`;
let queue = Promise.resolve();
function serialize(fn) { const result = queue.then(fn); queue = result.catch(() => {}); return result; }
async function readState() { const r = await (await caches.open(META)).match(KEY); return r ? r.json() : {}; }
async function saveState(s) { await (await caches.open(META)).put(KEY, new Response(JSON.stringify(s))); }
async function manifest() {
  const response = await fetch(`${BASE}release.json`, { cache: 'no-store' });
  if (!response.ok) throw Error('无法获取版本信息，请检查网络后重试。');
  const m = await response.json();
  if (!/^[a-zA-Z0-9._-]{1,64}$/.test(m.version) || !Array.isArray(m.assets) || !m.assets.length || m.assets.length > 100) throw Error('版本清单格式错误。');
  const base = `${BASE}releases/${m.version}/`;
  if (m.entry !== `${base}app.html` || !m.assets.some(a => a.url === m.entry)) throw Error('缺少启动文件。');
  if (new Set(m.assets.map(a => a.url)).size !== m.assets.length) throw Error('资源清单重复。');
  for (const a of m.assets) if (!a.url.startsWith(base) || a.url.includes('..') || a.url.includes('%') || !/^[a-f0-9]{64}$/.test(a.sha256) || !Number.isSafeInteger(a.size) || a.size > 20_000_000 || a.size < 0) throw Error('资源清单不安全。');
  return m;
}
async function download(m, state) {
  if ([state.active?.version, state.previous?.version].includes(m.version)) return;
  const name = cacheName(m.version);
  await caches.delete(name);
  const cache = await caches.open(name);
  try {
    for (const a of m.assets) {
      const response = await fetch(a.url, { cache: 'no-store', redirect: 'error' });
      if (!response.ok) throw Error(`资源下载失败：${a.url}`);
      const bytes = await response.arrayBuffer();
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2,'0')).join('');
      if (hash !== a.sha256 || bytes.byteLength !== a.size) throw Error('更新校验失败，当前版本已保留。');
      await cache.put(a.url, new Response(bytes, { headers: response.headers }));
    }
  } catch (e) { await caches.delete(name); throw e; }
}
self.addEventListener('install', event => event.waitUntil(serialize(async () => {
  const state = await readState();
  if (!state.active) { const m = await manifest(); await download(m, state); await saveState({ active: m }); }
  await self.skipWaiting();
})));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  const port = event.ports[0];
  event.waitUntil(serialize(async () => {
    try {
      const client = event.source;
      if (!client || new URL(client.url).origin !== self.location.origin || !new URL(client.url).pathname.startsWith(BASE)) throw Error('不允许的更新请求。');
      let s = await readState(); let result;
      switch (event.data?.type) {
        case 'STATUS': result = s; break;
        case 'CHECK': result = await manifest(); break;
        case 'DOWNLOAD': {
          const m = await manifest();
          if (m.version === s.active?.version) { result = s; break; }
          await download(m, s); s.staged = m; await saveState(s); result = s; break;
        }
        case 'APPLY':
          if (!s.staged) throw Error('请先下载并校验更新。');
          s = { active: s.staged, previous: s.active, pending: true, started: false }; await saveState(s); result = s; break;
        case 'HEALTHY':
          if (event.data.version === s.active?.version) { s.pending = false; s.started = false; await saveState(s); } result = s; break;
        case 'ROLLBACK':
          if (!s.previous) throw Error('没有可回退的版本。');
          s = { active: s.previous, previous: s.active, rollbackReason: '已回退到上一版本' }; await saveState(s); result = s; break;
        default: throw Error('未知操作。');
      }
      port?.postMessage({ ok: true, result });
    } catch (e) { port?.postMessage({ ok: false, error: e.message }); }
  }));
});
self.addEventListener('fetch', event => {
  const u = new URL(event.request.url);
  if (u.origin !== self.location.origin || event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate' && ['', 'index.html', 'desktop', 'desktop/', 'desktop/index.html', 'phone', 'phone/', 'phone/index.html'].some(path => u.pathname === BASE + path)) {
    event.respondWith(serialize(async () => {
      let s = await readState();
      if (s.pending && s.started && s.previous) { s = { active: s.previous, previous: s.active, rollbackReason: '新版本未完成启动，已自动回退' }; await saveState(s); }
      if (s.pending) { s.started = true; await saveState(s); }
      if (s.active) { const hit = await (await caches.open(cacheName(s.active.version))).match(s.active.entry); if (hit) return hit; }
      return new Response('本地缓存已被系统清理，请联网后重新安装。', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    }));
  } else if (u.pathname.startsWith(`${BASE}releases/`)) {
    event.respondWith((async () => (await caches.match(u.pathname)) || new Response('资源未安装，请手动更新。', { status: 404 }))());
  }
});
