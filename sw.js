const CACHE = 'touch-counter-night-v1';
const ASSETS = ['./', './index.html', './manifest.json', './sw.js', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', (e)=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e)=> {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    if(cached) return cached;
    return fetch(e.request).then(resp => {
      if(!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
      const clone = resp.clone();
      caches.open(CACHE).then(c=> c.put(e.request, clone));
      return resp;
    }).catch(()=> caches.match('./index.html'));
  }));
});
