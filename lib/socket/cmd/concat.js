(function () {
    'use strict';
    
    // TODO not used at the moment

    var path = require('path');
    var fs = require('fs-extra');
    var async = require('async');
    //var emitCallback = require('../../emit.callback');

    var cacheFactory = require('./../../memcache.factory.js');
    var memoryCache = cacheFactory.getCache();
    var slash = require('./../../slash');

    // TODO noch unfertig
    // see https://www.npmjs.com/package/crc-hash
    // see https://www.npmjs.com/package/crc-32

    // TODO  emitCallback.emitEventCreated(socket, action, [])

    //exports.concat = concat;

    var concatfiles = function concatfiles(action, done){
        var target = slash.fixSlash(path.join(action.target.dir, '/', action.target.base));
        var sources = action.sources;
        memoryCache.del(action.target.dir);

        fs.writeFile(target, '', function (error) {
            if (error) return done(error);

            var todos = [];
            for (var i = 0; i < sources.length; i++) {
                var f = path.join(sources[i].dir, '/', sources[i].base);
                (function(file){

                    todos.push(function(callback){
                        fs.readFile(file, function (error, buffer) {
                            if (error) return callback(error);
                            fs.appendFile(target, buffer, callback);
                        });
                    });

                })(f);
            }
            async.waterfall(todos, done);
        });
    };

    //var action = {
    //    crc: {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.crc'},
    //    sources: [
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.001'},
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.002'},
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.003'},
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.004'},
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.005'},
    //        {dir: 'c:/Users/kronmar/bbbbb/test', base: 'dbracer3_a.006'}
    //    ],
    //    target: {
    //        dir: 'c:/Users/kronmar/bbbbb/test',
    //        base: '_test.zzz'
    //    }
    //};
    //concatfiles(action, function(error, result) {
    //    console.log('DONE error  ', error);
    //    console.log('DONE result ', result);
    //});

})();