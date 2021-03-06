(function () {
    'use strict';

    // todo not used?

    var path = require('path');
    var fs = require('fs-extra');
    var emitCallback = require('../../emit.callback');
    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    var rmdir = function rmdir(socket, action) {
        var src = slash.fixSlash(path.join(action.src.dir, '/', action.src.base));

        fs.unlink(src, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            memoryCache.del(action.src.dir);
            emitCallback.emitEventRemoved(socket, action);
        });
    };

    exports.rmdir = rmdir;

})();