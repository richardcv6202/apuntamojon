const CACHE_NAME = 'apunta-mojon-v1.0.1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './manual_apuntamojon.html'
];

// Instalación: cachear todos los recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error al cachear recursos:', err))
  );
  self.skipWaiting();
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Cache First, luego red. Para peticiones de navegación, siempre responder con index.html si falla.
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Evitar cachear peticiones a otros dominios (por si hubiera)
  if (requestUrl.origin !== location.origin) return;

  // Si es una petición de navegación (HTML), intentamos cache primero y fallback a offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).catch(() => {
          return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // Para el resto de recursos (CSS, JS, imágenes)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // No cachear respuestas no exitosas
        if (!response || response.status !== 200) {
          return response;
        }
        // Clonar y guardar en caché
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
