(function () {
    'use strict';

    var path = require('path');
    var fs = require('fs');

    var cacheFactory = require('./../../memcache.factory.js');
    var slash = require('./../../slash');

    var createMsg = function createMsg(dir, base, error, stats) {
        var msg = {
            dir: slash.fixSlash(dir),
            base: slash.fixSlash(base),
            ext: path.extname(base)
        };
        if (error) {
            msg.error = error;
            //console.error('walk stat()', error.message)
        }
        if (stats) {
            msg.size = stats.isDirectory() ? null : stats.size;
            msg.date = stats.atime;
            msg.isDir = stats.isDirectory();
        }
        return msg;
    };

    /**
     *
     * @param socket emiter
     * @param para  TODO
     */
    var search = function search(socket, para) {
        if (!socket._cancelled) socket._cancelled = {};

        var rid = para.rid;
        var emmitKey = 'search' + rid;

        var cancel = function cancel(){
            //console.log('Walk cancelled.', emmitKey);
            socket.emit(emmitKey, {end: true});
        };

        if (socket._cancelled[emmitKey]) return cancel();

        if (para.cancelled) {
            socket._cancelled[emmitKey] = true;
            return;
        }
        //console.log('search  para ->', para);

        var walkAllList = para.filter.pathes;
        var pattern = para.filter.pattern;
        var walkAllIdx = -1;

        var fit = function fit(base) {
            var ret = (base && base.match(pattern));
            return ret;
        };

        var walkAll = function walkAll() {
            if (socket._cancelled[emmitKey]) return cancel();

            walkAllIdx++;
            var p = walkAllList[walkAllIdx];
            if (p) {
                walk(p, function (error, results) {
                    if (error) console.error(error);
                    walkAll();
                });
            } else {
                if (socket) socket.emit(emmitKey, {end: true});
            }
        };

        var walk = function walk(dir, done) {
            if (dir.indexOf(':') === (dir.length - 1)) dir = path.join(dir, '/');
            dir = path.normalize(dir);

            fs.readdir(dir, function (err, list) {
                if (err) return done(err);

                var i = 0;
                (function next() {
                    if (socket._cancelled[emmitKey]) return cancel();

                    var base = list[i++];
                    var file = base;
                    if (!file) {
                        return done(true);
                    }

                    file = dir + '/' + file;
                    fs.stat(file, function (error, stats) {
                        var msg = createMsg(dir, base, error, stats);
                        msg.abs = true;
                        if (socket && fit(base)) {
                            socket.emit(emmitKey, msg);
                        }

                        if (stats && stats.isDirectory()) {
                            walk(file, function (err) {
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                })();
            });
        };

        walkAll();
    };

    exports.search = search;

})();