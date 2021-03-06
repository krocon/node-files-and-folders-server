(function () {
    'use strict';

    /**
     * Returns a memory cache as singleton
     *
     * @type {*|exports|module.exports}
     */
    var cacheManager = require('cache-manager');

    // http://blakeembrey.com/articles/2014/01/wrapping-javascript-functions/
    //var before = function (before, fn) {
    //    return function () {
    //        before.apply(this, arguments);
    //        return fn.apply(this, arguments);
    //    };
    //};


    var _getCache = function _getCache() {
        if (!global.singleton_memoryCache) {
            global.singleton_memoryCache = cacheManager.caching({store: 'memory', max: 1000, ttl: 120/*seconds*/});
            console.log('memcache created ...');
        }
        return global.singleton_memoryCache;
    };

    var errorHandler = function errorHandler(err) {
        if (err) console.error(err);
    };

    var keys = [];
    var MyCache = function MyCache() {
        var set = function set(key, obj) {
            //console.log('cacheManager.set', key);
            _getCache().set(key, obj, errorHandler);
            if (keys.indexOf(key) === -1) keys.push(key);
        };
        var get = function get(key, callback) {
            //console.log('cacheManager.get', key);
            return _getCache().get(key, callback);
        };
        var del = function del(key) {
            //console.log('cacheManager.del', key);
            _getCache().del(key, errorHandler);
        };
        var clearAll = function clearAll(){
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                del(key);
            }
            keys = [];
        };

        return {
            set: set,
            get: get,
            del: del,
            clearAll: clearAll
        }
    };

    var getCache = function getCache() {
        if (!global.singleton_myMemoryCache) {
            global.singleton_myMemoryCache = new MyCache();
        }
        return global.singleton_myMemoryCache;
    };


    exports.getCache = getCache;
})();