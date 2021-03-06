(function () {
    'use strict';

    var path = require('path');
    var fs = require('fs-extra');
    var emitCallback = require('../../emit.callback');
    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    var remove = function remove(socket, action) {
        var src = slash.fixSlash(path.join(action.src.dir, '/', action.src.base));

        fs.remove(src, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            memoryCache.del(action.src.dir);
            emitCallback.emitEventRemoved(socket, action);
        });
    };

    exports.remove = remove;

})();