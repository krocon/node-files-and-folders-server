(function () {
    'use strict';

    var path = require('path');
    var fs = require('fs-extra');

    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    var walkAndDeleteEmptyFolders = function walkAndDeleteEmptyFolders(socket, action, callback) {
        var src = slash.fixSlash(action.src.dir);
        var loops = 0;

        var walk = function walk(dir, done) {
            loops++;
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);

                if (list.length===0) {
                    fs.remove(dir, function (error) {
                        if (error) return callback(error);

                        walk(path.dirname(dir), function (err, res) {});

                        loops--;
                        if (loops === 0) callback(null);
                        done(null);
                    });
                    return;
                }

                var i = 0;
                (function next() {
                    var file = list[i++];
                    if (!file) {
                        loops--;
                        if (loops === 0) callback(null);
                        done(null);
                        return;
                    }
                    file = dir + '/' + file;
                    fs.stat(file, function (err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(file, function (err, res) {
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                })();
            });
        };
        walk(src, function (err) {});
    };

    var delempty = function delempty(socket, action) {
        walkAndDeleteEmptyFolders(socket, action, function (error) {
            memoryCache.clearAll();
            socket.emit(action.cmd + action.id, {
                end: true,
                error: error
            });
        });
    };


    exports.delempty = delempty;

})();