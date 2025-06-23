/**
 * Service Worker - BlueSystem.io PWA
 * Estrategia de cache avanzada para optimización de performance
 * Fase 2: Performance Optimization
 */

const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `bluesystem-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bluesystem-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `bluesystem-images-${CACHE_VERSION}`;

// Recursos estáticos críticos
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/manifest.json',
  '/bluesystem-icon.svg',
  '/offline.html'
];

// Rutas críticas para preload
const CRITICAL_ROUTES = [
  '/',
  '/servicios',
  '/casos-de-exito',
  '/contacto'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only'
};

// Configuración de recursos por tipo
const RESOURCE_CONFIG = {
  // API calls - Network first con fallback
  api: {
    pattern: /^https?:\/\/.*\/api\/.*/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 5 * 60 // 5 minutos
    }
  },
  
  // Imágenes - Cache first con long expiration
  images: {
    pattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: IMAGE_CACHE,
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
    }
  },
  
  // Assets estáticos - Stale while revalidate
  static: {
    pattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: STATIC_CACHE,
    expiration: {
      maxEntries: 60,
      maxAgeSeconds: 7 * 24 * 60 * 60 // 7 días
    }
  },
  
  // Google Fonts - Cache first
  fonts: {
    pattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
    expiration: {
      maxEntries: 30,
      maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
    }
  },
  
  // Google Analytics - Network only
  analytics: {
    pattern: /^https:\/\/www\.google-analytics\.com\/.*/,
    strategy: CACHE_STRATEGIES.NETWORK_ONLY
  }
};

/**
 * Install Event - Preload critical resources
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Preload critical routes
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('🚀 Preloading critical routes');
        return Promise.all(
          CRITICAL_ROUTES.map(route => 
            fetch(route).then(response => {
              if (response.ok) {
                return cache.put(route, response);
              }
            }).catch(err => console.warn(`Failed to preload ${route}:`, err))
          )
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

/**
 * Activate Event - Clean old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('bluesystem') && 
                !cacheName.includes(CACHE_VERSION)) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation complete');
    })
  );
});

/**
 * Fetch Event - Smart caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Find matching resource configuration
  const resourceConfig = findResourceConfig(request.url);
  
  if (resourceConfig) {
    event.respondWith(
      handleRequest(request, resourceConfig)
    );
  }
});

/**
 * Find resource configuration for URL
 */
function findResourceConfig(url) {
  for (const [key, config] of Object.entries(RESOURCE_CONFIG)) {
    if (config.pattern.test(url)) {
      return config;
    }
  }
  
  // Default strategy for unmatched requests
  return {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 // 1 hora
    }
  };
}

/**
 * Handle request based on caching strategy
 */
async function handleRequest(request, config) {
  const { strategy, cacheName, expiration } = config;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, cacheName);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
      
    default:
      return networkFirst(request, cacheName, expiration);
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, expiration)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Clone before caching
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await cleanupCache(cache, expiration);
    }
    return networkResponse;
  } catch (error) {
    // Return stale cache if network fails
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await cleanupCache(cache, expiration);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch and update cache in background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await cleanupCache(cache, expiration);
    }
    return networkResponse;
  }).catch(() => {
    // Silently fail background updates
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Don't wait for background update
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return fetchPromise;
}

/**
 * Cache Only Strategy
 */
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('No cached response available');
}

/**
 * Network Only Strategy
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * Check if cached response is expired
 */
function isExpired(response, expiration) {
  if (!expiration || !expiration.maxAgeSeconds) {
    return false;
  }
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) {
    return false;
  }
  
  const cacheTime = new Date(dateHeader).getTime();
  const currentTime = Date.now();
  const maxAge = expiration.maxAgeSeconds * 1000;
  
  return (currentTime - cacheTime) > maxAge;
}

/**
 * Cleanup cache to respect size limits
 */
async function cleanupCache(cache, expiration) {
  if (!expiration || !expiration.maxEntries) {
    return;
  }
  
  const keys = await cache.keys();
  if (keys.length > expiration.maxEntries) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - expiration.maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

/**
 * Sync offline contact form submissions
 */
async function syncContactForm() {
  try {
    // Get offline submissions from IndexedDB
    const submissions = await getOfflineSubmissions();
    
    for (const submission of submissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineSubmission(submission.id);
          console.log('✅ Offline submission synced:', submission.id);
        }
      } catch (error) {
        console.warn('❌ Failed to sync submission:', submission.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineSubmissions() {
  // TODO: Implement IndexedDB operations
  return [];
}

async function removeOfflineSubmission(id) {
  // TODO: Implement IndexedDB operations
  console.log('Removing offline submission:', id);
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  console.log('📩 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/bluesystem-icon.svg',
    badge: '/assets/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver ahora',
        icon: '/assets/action-icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/assets/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BlueSystem.io', options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🚀 BlueSystem.io Service Worker loaded');