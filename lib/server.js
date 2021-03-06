(function () {
    'use strict';

    // express server setup.

    var path = require('path');
    var fs = require('fs');
    var load = require('./initial/initialload.js');
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var onServerStarted = require('./onserverstarted.js').onServerStarted;
    var socketMapper = require('./socket/mapper.js').socketMapper;

    global.data = {
        systemInfo: null
    };

    //console.info('__dirname  :', __dirname);

    var start = function start(options) {
        var port = options.port | app.get('port') | process.env.PORT | 3000;
        var clientRoot = options.clientRoot;
        console.info('clientRoot :', clientRoot);
        app.set('port', port);
        app.set('json spaces', 0);

        // authentication:
        if (options.auth) app.use(options.auth);

        app.use('/', express.static(clientRoot)); //__dirname + '/../../client/release'));
        app.use('/config', express.static(__dirname + '/../config'));

        load.initialload(function (err, info) {
            global.data.systemInfo = info;
            io.on('connection', socketMapper);
            server.listen(port, onServerStarted);
        });
    };

    exports.start = start;

})();