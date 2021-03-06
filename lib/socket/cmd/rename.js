(function () {
    'use strict';

    // Copy file from source to target.

    // TODO siehe http://stackoverflow.com/questions/34142211/fast-file-rename-with-progress-information-in-node-js

    var path = require('path');
    var fs = require('fs-extra');

    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    var rename = function rename(socket, action) {
        var src = slash.fixSlash(path.join(action.src.dir, '/', action.src.base));
        var target = slash.fixSlash(path.join(action.target.dir, '/', action.target.base));

        fs.rename(src, target, function (error) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            fs.stat(target, function (error, stats) {
                if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

                var msg = {
                    event: 'created',
                    panelIndex:action.panelIndex,
                    item: {dir: action.target.dir, base: slash.fixSlash(action.target.base)}
                };
                if (stats) {
                    msg.item.size = stats.isDirectory() ? null : stats.size;
                    msg.item.date = stats.atime;
                    msg.item.isDir = stats.isDirectory();
                }

                var back = {
                    events: [
                        {
                            event: 'removed',
                            panelIndex: action.panelIndex,
                            item: action.src
                        },
                        msg,
                        {
                            event: 'focus',
                            panelIndex: action.panelIndex,
                            item: action.target
                        }
                    ],
                    error: null
                };
                if (error) back.error = error;

                memoryCache.del(action.target.dir);
                return socket.emit(action.cmd + action.id, back);
            });

        });
    };

    exports.rename = rename;

})();