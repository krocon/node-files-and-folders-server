(function () {
    'use strict';

    // Move file from source to target.

    var path = require('path');
    var fs = require('fs-extra');
    var fileUtil = require('../../fileutil');
    var emitCallback = require('../../emit.callback');

    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');


    var move = function move(socket, action) {
        fileUtil.move(action.src, action.target, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            memoryCache.del(action.src.dir);
            memoryCache.del(action.target.dir);
            emitCallback.emitEventCreated(socket, action, [ emitCallback.createEventUnselect(action), emitCallback.createEventRemoved(action) ]);
        });
    };


    exports.move = move;

})();