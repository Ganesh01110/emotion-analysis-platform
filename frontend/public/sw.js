"""
Service Worker for PWA
Handles offline functionality and background sync
"""

const CACHE_NAME = 'emotion-analysis-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/globals.css',
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline thoughts
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-thoughts') {
        event.waitUntil(syncOfflineThoughts());
    }
});

async function syncOfflineThoughts() {
    // This will be implemented to sync offline thoughts
    console.log('Syncing offline thoughts...');
}
