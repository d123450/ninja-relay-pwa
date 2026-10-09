/* Bootstrap engine. Application releases change only on an explicit UI message. */
const BASE = new URL(self.registration.scope).pathname;
const SUFFIX = BASE === '/' ? '' : `:${BASE}`;
const META = `relay-meta-v1${SUFFIX}`, KEY = `${BASE}__relay_state__`;
const RECOVERY_HTML = "<!doctype html>\n<html lang=\"zh-CN\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n  <meta name=\"theme-color\" content=\"#f5f6f8\">\n  <meta name=\"referrer\" content=\"no-referrer\">\n  <title>映桥</title>\n  <link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23242823'/%3E%3Ccircle cx='43' cy='50' r='24' fill='none' stroke='%23e5f0e2' stroke-width='12'/%3E%3Cpath d='M65 43 82 33v34L65 57Z' fill='%23e5f0e2'/%3E%3C/svg%3E\">\n  <style>\n    *{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:28px;background:#f5f6f8;color:#20242d;font:15px/1.5 -apple-system,BlinkMacSystemFont,\"Microsoft YaHei UI\",system-ui,sans-serif}main{width:100%;max-width:320px;padding-bottom:6vh}.mark{width:58px;height:58px;margin-bottom:24px}h1{font-size:26px;font-weight:600;letter-spacing:-.8px;margin:0 0 24px}p{margin:0;color:#69717f}progress{display:block;appearance:none;border:0;border-radius:4px;overflow:hidden;width:100%;height:4px;background:#e1e4ea;margin:22px 0 12px;accent-color:#355cf6}progress::-webkit-progress-bar{background:#e1e4ea}progress::-webkit-progress-value{background:#355cf6}#count{font-size:12px;min-height:18px;font-variant-numeric:tabular-nums}button{font:inherit;min-height:48px;padding:11px 22px;border:0;border-radius:9px;background:#355cf6;color:white;cursor:pointer;margin-top:24px}button:disabled{opacity:.5;cursor:wait}button:focus-visible,summary:focus-visible{outline:3px solid #355cf6;outline-offset:4px}.secondary{background:transparent;color:#355cf6;padding-left:0;margin:12px 0 0}details{margin-top:20px;font-size:12px;color:#69717f}summary{cursor:pointer;min-height:44px;align-content:center}#detail{white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0}[hidden]{display:none!important}\n  </style>\n</head>\n<body><main aria-busy=\"true\">\n  <svg class=\"mark\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"#20242d\"/><circle cx=\"43\" cy=\"50\" r=\"24\" fill=\"none\" stroke=\"#e5f0e2\" stroke-width=\"12\"/><path d=\"M65 43 82 33v34L65 57Z\" fill=\"#e5f0e2\"/></svg>\n  <h1>映桥</h1>\n  <p id=\"status\" role=\"status\">正在打开…</p>\n  <progress id=\"progress\" aria-label=\"离线资源下载进度\" hidden></progress>\n  <p id=\"count\" hidden></p>\n  <button id=\"retry\" hidden>重试</button>\n  <button id=\"restore\" class=\"secondary\" hidden>回退上一版本</button>\n  <details id=\"error-details\" hidden><summary>查看详情</summary><p id=\"detail\"></p></details>\n  <noscript><p>请启用 JavaScript 后重新打开。</p></noscript>\n</main>\n<script>\n(() => {\n  const base = '/ninja-relay-pwa/';\n  const workerUrl = new URL(base + 'sw.js', location.origin).href;\n  const launchKey = 'relay-launch:' + base;\n  const $ = id => document.getElementById(id);\n  let busy = false, worker;\n\n  function deadline(promise, ms, message) {\n    let timer;\n    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(message)), ms); })]).finally(() => clearTimeout(timer));\n  }\n  function message(type) {\n    return new Promise((resolve, reject) => {\n      const channel = new MessageChannel();\n      const timer = setTimeout(() => finish(Error('启动组件没有响应。请重试。')), 75000);\n      function finish(error, result) { clearTimeout(timer); channel.port1.close(); error ? reject(error) : resolve(result); }\n      channel.port1.onmessage = ({data}) => {\n        if (data.progress) {\n          const {done, total} = data.progress;\n          $('progress').hidden = $('count').hidden = false;\n          $('progress').max = total; $('progress').value = done;\n          $('count').textContent = `${done} / ${total}`;\n          return;\n        }\n        finish(data.ok ? null : Error(data.error), data.result);\n      };\n      worker.postMessage({type}, [channel.port2]);\n    });\n  }\n  async function activate(registration) {\n    const next = registration.installing || registration.waiting;\n    if (next) await deadline(new Promise((resolve, reject) => {\n      const check = () => {\n        if (next.state === 'activated' || next.state === 'redundant') {\n          next.removeEventListener('statechange', check);\n          next.state === 'activated' ? resolve() : reject(Error('启动组件安装失败。'));\n        }\n      };\n      next.addEventListener('statechange', check); check();\n    }), 20000, '启动组件加载超时。');\n    if (!registration.active) throw Error('启动组件未启用。');\n    return registration.active;\n  }\n  function failure(error) {\n    $('status').textContent = /超时/.test(error.message) ? '下载超时' : '暂时无法打开';\n    $('detail').textContent = error.message;\n    $('error-details').hidden = false;\n    $('retry').textContent = '重试'; $('retry').hidden = false;\n  }\n  async function launch() {\n    // Bypassing service workers must not reload this page forever.\n    const last = Number(sessionStorage.getItem(launchKey) || 0);\n    if (Date.now() - last < 15000) throw Error('浏览器未加载本地应用。若正在使用开发者工具，请关闭 Application → Service Workers → Bypass for network 后重试。');\n    sessionStorage.setItem(launchKey, String(Date.now()));\n    const url = new URL(location.href); url.searchParams.delete('repair');\n    if (url.pathname === base + 'repair.html') url.pathname = base;\n    if (url.href === location.href) location.reload(); else location.replace(url.href);\n  }\n  async function boot(manual = false, rollback = false) {\n    if (busy) return;\n    busy = true; document.querySelector('main').setAttribute('aria-busy', 'true');\n    $('retry').disabled = $('restore').disabled = true;\n    $('retry').hidden = $('restore').hidden = $('error-details').hidden = true;\n    $('progress').hidden = $('count').hidden = true;\n    $('status').textContent = manual ? '正在重试…' : '正在打开…';\n    if (manual) sessionStorage.removeItem(launchKey);\n    try {\n      if (!('serviceWorker' in navigator) || !isSecureContext) throw Error('此浏览器无法保存离线应用，请使用 Safari 的 HTTPS 地址。');\n      worker = navigator.serviceWorker.controller?.scriptURL === workerUrl ? navigator.serviceWorker.controller : null;\n      if (!worker) {\n        const registration = await deadline(navigator.serviceWorker.register(workerUrl, {scope:base, updateViaCache:'none'}), 20000, '启动组件下载超时。');\n        worker = await activate(registration);\n      }\n      let status;\n      try { status = await message('BOOT'); }\n      catch (error) {\n        if (!/未知操作/.test(error.message)) throw error;\n        // Upgrade only the bootstrap protocol, preserving the installed app release.\n        const registration = await navigator.serviceWorker.getRegistration(base);\n        await deadline(registration.update(), 20000, '启动组件下载超时。');\n        worker = await activate(registration);\n        status = await message('BOOT');\n      }\n      $('restore').hidden = !status.previousReady;\n      if (rollback) { await message('ROLLBACK'); await launch(); return; }\n      const repairPage = location.pathname === base + 'repair.html' || new URL(location.href).searchParams.has('repair');\n      if (status.ready && !repairPage) { await launch(); return; }\n      if (status.state.active && !manual) {\n        $('status').textContent = status.ready ? '修复本地应用' : '本地资源不完整';\n        $('retry').textContent = '修复并打开'; $('retry').hidden = false;\n        return;\n      }\n      $('status').textContent = status.state.active ? '正在修复…' : '正在下载离线资源…';\n      await message('REPAIR');\n      $('status').textContent = '已就绪';\n      await launch();\n    } catch (error) { failure(error); }\n    finally {\n      busy = false; document.querySelector('main').setAttribute('aria-busy','false');\n      $('retry').disabled = $('restore').disabled = false;\n    }\n  }\n  $('retry').addEventListener('click', () => boot(true));\n  $('restore').addEventListener('click', () => boot(true, true));\n  boot();\n})();\n</script></body></html>\n";
const REQUEST_TIMEOUT_MS = 15_000;
const DOWNLOAD_TIMEOUT_MS = 60_000;
const cacheName = version => `relay-release-${version}${SUFFIX}`;
let queue = Promise.resolve();
function serialize(fn) { const result = queue.then(fn); queue = result.catch(() => {}); return result; }
async function readState() { const r = await (await caches.open(META)).match(KEY); return r ? r.json() : {}; }
async function saveState(s) { await (await caches.open(META)).put(KEY, new Response(JSON.stringify(s))); }
function validateManifest(m) {
  if (!/^[a-zA-Z0-9._-]{1,64}$/.test(m.version) || !Array.isArray(m.assets) || !m.assets.length || m.assets.length > 100) throw Error('版本清单格式错误。');
  const prefix = `${BASE}releases/${m.version}/`;
  if (m.entry !== `${prefix}app.html` || !m.assets.some(a => a.url === m.entry)) throw Error('缺少启动文件。');
  if (new Set(m.assets.map(a => a.url)).size !== m.assets.length) throw Error('资源清单重复。');
  for (const a of m.assets) if (!a.url.startsWith(prefix) || a.url.includes('..') || a.url.includes('%') || !/^[a-f0-9]{64}$/.test(a.sha256) || !Number.isSafeInteger(a.size) || a.size > 20_000_000 || a.size < 0) throw Error('资源清单不安全。');
  return m;
}
async function fetchBytes(url, end = Date.now() + REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1, Math.min(REQUEST_TIMEOUT_MS, end - Date.now())));
  try {
    const response = await fetch(url, {cache:'no-store', redirect:'error', signal:controller.signal});
    if (!response.ok) throw Error(`下载失败（HTTP ${response.status}）：${url}`);
    const bytes = await response.arrayBuffer();
    return {bytes, headers:response.headers};
  } catch (e) {
    if (controller.signal.aborted) throw Error(`下载超时：${url}`);
    throw e;
  } finally { clearTimeout(timer); }
}
async function manifest() {
  const {bytes} = await fetchBytes(`${BASE}release.json`);
  return validateManifest(JSON.parse(new TextDecoder().decode(bytes)));
}
async function valid(bytes, asset) {
  if (bytes.byteLength !== asset.size) return false;
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2,'0')).join('');
  return hash === asset.sha256;
}
async function cachedAsset(cache, asset) {
  const response = await cache.match(asset.url);
  return !!response && await valid(await response.arrayBuffer(), asset);
}
async function complete(m) {
  if (!m) return false;
  const cache = await caches.open(cacheName(m.version));
  for (const a of validateManifest(m).assets) if (!await cachedAsset(cache, a)) return false;
  return true;
}
async function download(m, progress = () => {}) {
  const cache = await caches.open(cacheName(m.version));
  const end = Date.now() + DOWNLOAD_TIMEOUT_MS;
  let done = 0;
  progress({done, total:m.assets.length});
  // Retain verified files on failure. A retry resumes missing/damaged files only.
  for (const a of validateManifest(m).assets) {
    if (!await cachedAsset(cache, a)) {
      if (Date.now() >= end) throw Error('下载超时，请重试。');
      const {bytes, headers} = await fetchBytes(a.url, end);
      if (!await valid(bytes, a)) throw Error(`资源校验失败：${a.url}`);
      await cache.put(a.url, new Response(bytes, {headers}));
    }
    progress({done:++done, total:m.assets.length});
  }
}
// Activation never waits for app downloads, so a failed download cannot strand an installing worker.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  const port = event.ports[0];
  event.waitUntil(serialize(async () => {
    try {
      const client = event.source;
      if (!client || new URL(client.url).origin !== self.location.origin || !new URL(client.url).pathname.startsWith(BASE)) throw Error('不允许的更新请求。');
      let s = await readState(), result;
      switch (event.data?.type) {
        case 'BOOT':
          result = {state:s, ready:await complete(s.active), previousReady:await complete(s.previous)};
          await self.clients.claim(); break;
        case 'REPAIR': {
          const m = s.active || s.installing || await manifest();
          if (!s.active) { s.installing = m; await saveState(s); }
          await download(m, progress => port?.postMessage({progress}));
          s.active = m; delete s.installing; await saveState(s); result = s; break;
        }
        case 'STATUS': result = s; break;
        case 'CHECK': result = await manifest(); break;
        case 'DOWNLOAD': {
          const m = await manifest();
          if (m.version === s.active?.version) { result = s; break; }
          await download(m); s.staged = m; await saveState(s); result = s; break;
        }
        case 'APPLY':
          if (!s.staged || !await complete(s.staged)) throw Error('请先下载并校验更新。');
          s = {active:s.staged, previous:s.active, pending:true, started:false}; await saveState(s); result = s; break;
        case 'HEALTHY':
          if (event.data.version === s.active?.version) { s.pending = false; s.started = false; await saveState(s); } result = s; break;
        case 'ROLLBACK':
          if (!await complete(s.previous)) throw Error('没有完整的可回退版本。');
          s = {active:s.previous, previous:s.active, rollbackReason:'已回退到上一版本'}; await saveState(s); result = s; break;
        default: throw Error('未知操作。');
      }
      port?.postMessage({ok:true, result});
    } catch (e) { port?.postMessage({ok:false, error:e.message}); }
  }));
});
function recovery() { return new Response(RECOVERY_HTML, {headers:{'Content-Type':'text/html;charset=utf-8', 'Cache-Control':'no-store'}}); }
self.addEventListener('fetch', event => {
  const u = new URL(event.request.url);
  if (u.origin !== self.location.origin || event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate' && ['', 'index.html', 'repair.html', 'desktop', 'desktop/', 'desktop/index.html', 'phone', 'phone/', 'phone/index.html'].some(path => u.pathname === BASE + path)) {
    event.respondWith(serialize(async () => {
      let s = await readState();
      if (u.searchParams.has('repair') || u.pathname === BASE + 'repair.html') return recovery();
      if (s.pending && s.started && await complete(s.previous)) {
        s = {active:s.previous, previous:s.active, rollbackReason:'新版本未完成启动，已自动回退'}; await saveState(s);
      }
      if (!await complete(s.active)) return recovery();
      if (s.pending) { s.started = true; await saveState(s); }
      return (await caches.open(cacheName(s.active.version))).match(s.active.entry);
    }).catch(() => recovery()));
  } else if (u.pathname.startsWith(`${BASE}releases/`)) {
    event.respondWith((async () => (await caches.match(u.pathname)) || new Response('本地资源缺失', {status:404}))());
  }
});
