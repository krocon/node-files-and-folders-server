(function () {
    'use strict';

    // mkdir

    var path = require('path');
    var fs = require('fs-extra');
    var emitCallback = require('../../emit.callback');
    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    var mkdir = function mkdir(socket, action) {
        var target = slash.fixSlash(path.join(action.target.dir, '/', action.target.base));

        fs.mkdir(target, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            console.log('mkdir done: ' + target, error);

            fs.stat(target, function (error, stats) {
                if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

                memoryCache.del(action.target.dir);
                emitCallback.emitEventCreated(socket, action, [ emitCallback.createEventFocusTarget(action) ])
            });

        });
    };

    exports.mkdir = mkdir;

})();