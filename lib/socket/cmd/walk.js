(function () {
    'use strict';

    /**
     * Counting files and folders in given subdirectories
     */
    var path = require('path');
    var fs = require('fs');

    var slash = require('./../../slash');

    var createMsg = function createMsg(dir, base, error, stats) {
        var msg = {
            dir: slash.fixSlash(dir),
            base: slash.fixSlash(base),
            ext: path.extname(base)
        };
        if (error) {
            msg.error = error;
            console.error('walk stat()', error.message)
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
     * @param para  Object {rid:123, pathes: ['', '', ...]}
     */
    var walk = function walk(socket, para) {
        if (!socket._cancelled) socket._cancelled = {};

        var rid = para.rid;
        var emmitKey = 'walk' + rid;

        var cancel = function cancel(){
            console.log('Walk cancelled.', emmitKey);
            socket.emit(emmitKey, {end: true});
        };

        if (socket._cancelled[emmitKey]) return cancel();

        if (para.cancelled) {
            socket._cancelled[emmitKey] = true;
            return;
        }

        var walkAllList = para.pathes;
        var walkAllIdx = -1;
        var walkAllResults = [];

        var walkAll = function walkAll() {
            if (socket._cancelled[emmitKey]) return cancel();

            walkAllIdx++;
            var p = walkAllList[walkAllIdx];
            if (p) {
                walk(p, function (error, results) {
                    if (error) console.error(error);
                    if (!error) walkAllResults = walkAllResults.concat(results);
                    walkAll();
                });
            } else {
                if (socket) socket.emit(emmitKey, {end: true});
            }
        };

        var walk = function walk(dir, done) {
            if (dir.indexOf(':') === (dir.length - 1)) dir = path.join(dir, '/');
            dir = path.normalize(dir);

            var results = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);

                var i = 0;
                (function next() {
                    if (socket._cancelled[emmitKey]) return cancel();

                    var base = list[i++];
                    var file = base;
                    if (!file) {
                        return done(null, results);
                    }
                    file = dir + '/' + file;
                    fs.stat(file, function (error, stats) {
                        var msg = createMsg(dir, base, error, stats);
                        if (socket) socket.emit(emmitKey, msg);

                        if (stats && stats.isDirectory()) {
                            walk(file, function (err, res) {
                                results = results.concat(res);
                                next();
                            });
                        } else {
                            results.push(slash.fixSlash(file));
                            next();
                        }
                    });
                })();
            });
        };

        walkAll();
    };

    exports.walk = walk;

    //walk(null, {
    //    pathes: [
    //        'c:\\Users\\kronmar\\.aaa\\Server',
    //        'c:\\Users\\kronmar\\.aaa\\U92'
    //    ],
    //    rid: 111
    //});

})();