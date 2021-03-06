(function () {
    'use strict';

    var path = require('path');
    var fs = require('fs-extra');
    var fileUtil = require('../../fileutil');
    var emitCallback = require('../../emit.callback');
    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');


    var copy = function copy(socket, action) {
        fileUtil.copy(action.src, action.target, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});
            memoryCache.del(action.target.dir);
            emitCallback.emitEventCreated(socket, action, [ emitCallback.createEventUnselect(action) ]);
        });
    };

    exports.copy = copy;

})();