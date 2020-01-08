function updateCacheDynamic( dynamicNameCache, req, res ){

    if( res.ok ){
        return caches.open(dynamicNameCache).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    }

    return res;

}