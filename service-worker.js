const CACHE_NAME = 'cartola-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

// Instalação: Guarda os arquivos da interface no cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Ativação: Limpa versões antigas do cache, se houver
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepta as requisições
self.addEventListener('fetch', (event) => {
    // IMPORTANTE: Ignora as chamadas para a API do Cartola e para os proxies.
    // Queremos que os dados de pontos/dinheiro venham SEMPRE da internet fresquinhos, e não do cache!
    if (event.request.url.includes('cartola.globo.com') || 
        event.request.url.includes('proxy') || 
        event.request.url.includes('codetabs') ||
        event.request.url.includes('allorigins')) {
        return; // Deixa o navegador fazer o fetch padrão
    }

    // Para a interface (HTML/CSS), tenta pegar do cache primeiro para carregar rápido
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
