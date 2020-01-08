importScripts('js/sw-utils.js');

const DYNAMIC_CACHE = 'dynamic';

const STATIC_CACHE = 'static-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    console.log('SW: install');

    const promiseStatic = caches.open(STATIC_CACHE).then( cache => {
        cache.addAll(APP_SHELL);
    });

    const promiseInmutable = caches.open(INMUTABLE_CACHE).then( cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil( Promise.all([promiseStatic,promiseInmutable]) );
});

self.addEventListener('activate', e => {

    console.log('SW: activate');

    const resp = caches.keys().then( keys => {
        console.log( keys );
        keys.forEach( key => {
            if( key !== STATIC_CACHE && key.includes('static') ){
                caches.delete(key);
            }
            if( key !== INMUTABLE_CACHE && key.includes('inmutable') ){
                caches.delete(key);
            }
        });
    });

    e.waitUntil( resp );
});

self.addEventListener('fetch', e => {

    // Strategia Network Fallback
    const resp = caches.match( e.request ).then( res => {

        if (res ){
            return res;
        } else {
            return fetch( e.request ).then( newRes => {
                return updateCacheDynamic( DYNAMIC_CACHE, e.request, newRes );
            });
            console.log(e.request.url);
        }
    });

    e.respondWith(resp);
});
