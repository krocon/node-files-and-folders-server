(function () {
    'use strict';

    // TODO wird nicht benutzt!

    //var path = require('path');
    //var fs = require('fs');
    //
    ////var cacheFactory = require('./../../memcache.factory.js');
    //var slash = require('./../../slash');
    //
    //var createMsg = function createMsg(p, f, error, stats) {
    //    var msg = {
    //        dir: p,
    //        base: slash.fixSlash(f),
    //        ext: path.extname(f)
    //    };
    //    if (error) {
    //        msg.error = error;
    //        console.error('dir stat()', error.message)
    //    }
    //    if (stats) {
    //        msg.size = stats.isDirectory() ? null : stats.size;
    //        msg.date = stats.atime;
    //        msg.isDir = stats.isDirectory();
    //    }
    //    return msg;
    //};
    //
    //
    //var tree = function tree(socket, para) {
    //    // {path: p, rid: rid}
    //    var p = para.path;
    //    if (p.indexOf(':') === (p.length - 1)) p = path.join(p, '/');
    //
    //    var rid = para.rid;
    //    console.log('onSockettree  p ->', para);
    //    var emmitKey = 'tree' + rid;
    //
    //    var restrictions = null;
    //    if (para.restrictions) {
    //        restrictions = [];
    //        for (var i = 0; i < para.restrictions.length; i++) {
    //            restrictions.push(slash.fixSlash(para.restrictions[i]));
    //        }
    //    }
    //
    //    var walk = function walk(dir, done) {
    //        dir = path.normalize(dir);
    //
    //        var filter = function filter(val) {
    //            var val = slash.fixSlash(path.join(dir, '/', val));
    //            for (var i = 0; i < restrictions.length; i++) {
    //                var obj = restrictions[i];
    //                if (val.indexOf(obj) === 0) return true;
    //            }
    //            return false;
    //        };
    //
    //        var results = [];
    //        fs.readdir(dir, function (err, list) {
    //            if (err) return done(err);
    //
    //            if (restrictions) {
    //                list = list.filter(filter);
    //            }
    //
    //            var i = 0;
    //            (function next() {
    //                var file = list[i++];
    //                if (!file) return done(null, results);
    //
    //                file = dir + '/' + file;
    //                fs.stat(file, function (error, stats) {
    //                    //console.log('file', file);
    //                    var msg = createMsg(dir, file, error, stats);
    //                    socket.emit(emmitKey, msg);
    //
    //                    if (stats && stats.isDirectory()) {
    //                        walk(file, function (err, res) {
    //                            results = results.concat(res);
    //                            next();
    //                        });
    //                    } else {
    //                        results.push(file);
    //                        next();
    //                    }
    //                });
    //            })();
    //        });
    //    };
    //
    //    walk(p, function (error, results) {
    //        //console.log(results);
    //        socket.emit(emmitKey, {end: true});
    //    });
    //};
    //
    //exports.tree = tree;
    exports.tree = function(){};

})();