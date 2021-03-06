(function () {
    'use strict';

    /**
     * Wird benutzt für das Auflisten von Verzeichnissen (alt-f10)
     */


    var fs = require('fs');
    //var cacheFactory = require('./../../memcache.factory.js');
    var slash = require('./../../slash');

    // see http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
    // "A serial loop would look like this:..."

    var dummyDone = function (){};

    var walkfolder = function(socket, para, done) {
        var loops = 0;

        var walk = function walk(socket, para, done) {
            var rid = para.rid;
            var dir = para.dir;
            var emmitKey = 'walkfolder' + rid;
            if (!done) done = dummyDone;

            if (socket) {
                if (!socket._cancelled) socket._cancelled = {};
                if (socket._cancelled[emmitKey]) return; // cancel

                if (para.cancelled) {
                    socket._cancelled[emmitKey] = true;
                    return;
                }
            }

            loops++;
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                var i = 0;
                (function next() {
                    if (socket && socket._cancelled[emmitKey]) return; //  cancel
                    var file = list[i++];
                    if (!file) {
                        loops--;
                        if (loops===0) socket.emit(emmitKey, {end: true});
                        done(null);
                        return;
                    }
                    file = dir + '/' + file;
                    fs.stat(file, function (err, stat) {
                        if (stat && stat.isDirectory()) {
                            if (socket) socket.emit(emmitKey, slash.fixSlash(file));

                            walk(socket, {dir: file, rid: rid}, function (err, res) {
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                })();
            });
        };
        walk(socket, para, done);
    };


    exports.walkfolder = walkfolder;

    /*
    walkfolder({
        emit: function(key, s){
            console.log(s);
        }
    }, {
        dir: 'C:\\local\\kronmar\\sandbox\\_neu2\\fnf',
        rid: 123
    }, function(list){
        console.log('DONE.');
    });
    */

})();