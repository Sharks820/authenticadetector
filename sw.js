// AuthenticaDetector Service Worker v13
const CACHE_NAME = 'authenticadetector-v13';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

let sharedFile = null;

// Install - wait for activation message instead of auto-skip
self.addEventListener('install', e => {
    console.log('[SW] Installing v13');
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
        // Note: removed skipWaiting() - now controlled via message
    );
});

// Activate
self.addEventListener('activate', e => {
    console.log('[SW] Activating');
    e.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    
    // Handle share target POST
    if (e.request.method === 'POST' && url.pathname === '/share-target') {
        e.respondWith(handleShareTarget(e.request));
        return;
    }
    
    // External requests - network only
    if (url.origin !== location.origin) {
        e.respondWith(fetch(e.request));
        return;
    }
    
    // Cache-first strategy for assets
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fetched = fetch(e.request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || fetched;
        })
    );
});

// Handle share target
async function handleShareTarget(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            sharedFile = {
                file: arrayBuffer,
                name: file.name || 'shared-image.jpg',
                mimeType: file.type || 'image/jpeg'
            };
            console.log('[SW] Stored shared file:', sharedFile.name, sharedFile.mimeType);
        }
        
        return Response.redirect('/?share=1', 303);
    } catch (err) {
        console.error('[SW] Share target error:', err);
        return Response.redirect('/', 303);
    }
}

// Message handling
self.addEventListener('message', e => {
    // Handle update request from app
    if (e.data.type === 'SKIP_WAITING') {
        console.log('[SW] Received SKIP_WAITING message, activating new version...');
        self.skipWaiting();
        return;
    }

    // Handle shared file request
    if (e.data.type === 'GET_SHARED_FILE' && sharedFile) {
        console.log('[SW] Sending shared file to client');
        e.source.postMessage({
            type: 'SHARED_FILE',
            file: sharedFile.file,
            name: sharedFile.name,
            mimeType: sharedFile.mimeType
        });
        sharedFile = null;
    }
});
