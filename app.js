(function () {

    "use strict";

    var fnf = require('./index.js');
    console.info('app / __dirname :', __dirname);
    fnf.start({
        clientRoot: __dirname + '/../node-files-and-folders-client/release',
        port:3002
    });

})();