(function () {
    'use strict';

    /**
     * Counting files and folders in given subdirectories
     */
    var path = require('path');
    var fs = require('fs');
    var slash = require('./../../slash');

    /**
     *
     * @param socket emiter
     * @param para  Object {rid:123, pathes: ['', '', ...]}
     */
    var walksum = function walksum(socket, para) {
        if (!socket._cancelled) socket._cancelled = {};

        var rid = para.rid;
        var emmitKey = 'walksum' + rid;

        var cancel = function cancel(){
            console.log('Walksum cancelled.', emmitKey);
            socket.emit(emmitKey, {end: true});
        };

        if (socket._cancelled[emmitKey]) return cancel();

        if (para.cancelled) {
            socket._cancelled[emmitKey] = true;
            return;
        }

        var _walk = function _walk(dir, done) {
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
                        delete socket._cancelled[emmitKey];
                        done(null);
                        return; 
                    }
                    file = dir + '/' + file;
                    fs.stat(file, function (error, stats) {
                        if (stats && stats.isDirectory()) {
                            _walk(file, function (err, res) {
                                next();
                            });
                        } else {
                            if (socket) socket.emit(emmitKey, {size:stats.size});
                            next();
                        }
                    });
                })();
            });
        };

        console.info('para.dir', para.dir);
        _walk(para.dir, function(){
            console.info('server walksum end.');
            socket.emit(emmitKey, {end:true})
        });
    };

    exports.walksum = walksum;

})();