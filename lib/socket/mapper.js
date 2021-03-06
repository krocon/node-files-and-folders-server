(function () {
    'use strict';

    var fs = require('fs');

    // Initialize all socket handlers:
    // console.info('mapper.js __dirname  :', __dirname);
    var handler = {};
    fs.readdir(__dirname + '/cmd', function(err, files){
        console.log('socket io --+');
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf('.js') > -1) {
                var cmd = files[i].replace('.js', '');
                console.log('            +-- ' + cmd);
                handler[cmd] = require(__dirname + '/cmd/' + cmd + '.js')[cmd]; // handler.copy = require('./copy.js').copy;
            }
        }
    });

    var socketMapper = function socketMapper(socket) {
        console.log('socket.io connected');

        for (var cmd in handler) {
            if (handler.hasOwnProperty(cmd)) {
                (function (cmd) {
                    socket.on(cmd, function (p) {
                        if (p && p.action) p.cmd = cmd;
                        handler[cmd].call(this, socket, p);
                    });
                })(cmd);
            }
        }
    };


    /*
     var copy = require('./copy.js').copy;
     var saveconfig = require('./saveconfig.js').saveconfig;
     var dir = require('./dir.js').dir;
     var tree = require('./tree.js').tree;
     var walk = require('./walk.js').walk;
     var open = require('./open.js').open;
     var disks = require('./disks.js').disks;
     var initialload = require('./initialload.js').initialload;

     var socketMapper = function socketMapper(socket) {
         console.log('socket.io connected');

         socket.on('disks', function (p) {
            disks(socket);
         });
         socket.on('initialload', function () {
            initialload(socket);
         });
         socket.on('dir', function (p) {
            dir(socket, p);
         });
         socket.on('tree', function (p) {
            tree(socket, p);
         });
         socket.on('walk', function (p) {
            walk(socket, p);
         });
         socket.on('open', function (p) {
            open(socket, p);
         });
         socket.on('copy', function (p) {
            copy(socket, p);
         });
         socket.on('saveconfig', function (p) {
            saveconfig(socket, p);
         });
     };
     */

    exports.socketMapper = socketMapper;

})();