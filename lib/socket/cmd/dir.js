(function () {
    'use strict';

    // Loads file infos in a given directory.

    var path = require('path');
    var fs = require('fs');
    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');



    var dir = function dir(socket, para) {
        //console.log('onSocketDir', para);
        // list dir and send stats:
        // in schleife socket.broadcast.to(event.path).emit('xxxx', {});
        // das hier würd an alle schicken. Dies brauchen wir hier nicht  io.sockets.emit('function', 'data1', 'data2');

        // {path: p, rid: rid}
        var p = para.path;
        if (p.indexOf(':') === (p.length - 1)) p = path.join(p, '/');
        p = slash.fixSlash(p);

        var rid = para.rid;
        //console.log('dir  p ->', p, rid);
        var emmitKey = 'dir' + rid;
        var cacheKey = /* para.nocache ? ('_' + Date.now()) : */ p;

        if (para.nocache) memoryCache.del(cacheKey, function(err){});

        var readdir = function readdir() {
            fs.readdir(p, function (error, files) {
                if (error) return socket.emit(emmitKey, {dir: p, end: true, size: 0, error: error});


                var firstEvent = {dir: p, begin: true, size: files.length};
                if (files.length === 0) {
                    firstEvent.end = true;
                }
                var _msgs = [];

                memoryCache.set(p, _msgs);

                // first info::
                _msgs.push(firstEvent);
                socket.emit(emmitKey, firstEvent);

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    (function (f, idx) {
                        var ff = path.join(p, '/', f);
                        fs.stat(ff, function (error, stats) {

                            var msg = {
                                dir: p,
                                base: slash.fixSlash(f),
                                ext: path.extname(f)
                            };
                            if (error) {
                                msg.error = error;
                                //console.log('dir stat()', error.message)
                            }
                            if (stats) {
                                msg.size = stats.isDirectory() ? null : stats.size;
                                msg.date = stats.atime;
                                msg.isDir = stats.isDirectory();
                            }
                            if (idx === files.length - 1) {
                                msg.end = true;
                                //console.log('dir       end idx ->', idx);
                            }
                            //console.log('emit ->', msg);
                            _msgs.push(msg);
                            socket.emit(emmitKey, msg);
                        });
                    })(file, i);
                }
            });
        };

        memoryCache.get(cacheKey, function (err, msgs) {
            if (err || !msgs) {
                //console.log('dir       readdir...');
                readdir();

            } else {
                //console.log('dir       using cache...');
                for (var i = 0; i < msgs.length; i++) {
                    var msg = msgs[i];
                    socket.emit(emmitKey, msg);
                }
            }
        });


    };

    exports.dir = dir;

})();