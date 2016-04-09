(function () {

    "use strict";

    var fnf = require('./index.js');
    console.info('app / __dirname :', __dirname);
    fnf.start({
        clientRoot: __dirname + '/../fnf-client-a14/release',
        port:3002
    });

})();