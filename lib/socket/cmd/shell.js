(function () {
    'use strict';

    var exec = require('child_process').exec;
    var async = require('async');
    var path = require('path');
    var clidir = path.join(__dirname, '../../../cli');

    // see http://shapeshed.com/writing-cross-platform-node/

    var shell = function shell(socket, cmds) {
        var todos = [];
        for (var i = 0; i < cmds.length; i++) {

            (function(cmd){
                cmd = cmd
                    .replace(/\$__dirname/g, __dirname)
                    .replace(/\$clidir/g, clidir);

                todos.push(function(callback){
                    console.info('shell cmd...:', cmd);
                    exec(cmd, function (error, stdout, stderr) {
                        if (error) console.error('error', error);
                        //if (stdout) console.info('stdout', stdout);
                        if (stderr) console.info('stderr', stderr);
                        callback(error);
                    });
                });

            })(cmds[i]);
        }
        async.waterfall(todos, function(){});
    };

    exports.shell = shell;

})();