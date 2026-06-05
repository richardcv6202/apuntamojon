const CACHE_NAME = 'apunta-mojon-v1.0';
const OFFLINE_URL = '/index.html';

// Archivos a cachear durante la instalación
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png'
];

// Evento: Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando archivos iniciales');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('[Service Worker] Error al cachear archivos:', err);
      })
  );
  
  // Forzar activación inmediata
  self.skipWaiting();
});

// Evento: Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Ahora está listo para controlar los clientes');
      return self.clients.claim();
    })
  );
});

// Evento: Fetch (interceptar peticiones)
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Estrategia: Cache First, luego network (para archivos estáticos)
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Si está en caché, devolverlo
          if (response) {
            console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
            return response;
          }
          
          // Si no está en caché, buscar en la red
          console.log('[Service Worker] Buscando en red:', event.request.url);
          return fetch(event.request)
            .then(response => {
              // Verificar si es una respuesta válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clonar la respuesta para cachearla
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(error => {
              console.error('[Service Worker] Error en fetch:', error);
              
              // Si es una navegación y está offline, mostrar página offline
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
              }
              
              // Para otros recursos, devolver un error genérico
              return new Response('Recurso no disponible offline', {
                status: 503,
                statusText: 'Offline',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
});

// Evento: Mensajes desde la aplicación
self.addEventListener('message', event => {
  console.log('[Service Worker] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Evento: Sincronización en segundo plano (para futura implementación)
self.addEventListener('sync', event => {
  console.log('[Service Worker] Sincronización en segundo plano:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Función para sincronizar datos pendientes
async function syncData() {
  console.log('[Service Worker] Sincronizando datos...');
  // Aquí se puede implementar sincronización con servidor en el futuro
  return Promise.resolve();
}