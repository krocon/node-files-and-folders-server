(function () {

    "use strict";

    module.exports = fnf.convert = fnf;

    fnf.start = function start(options) {
        var server = require('./lib/server.js');
        server.start(options);
    };

    fnf();

    function fnf() {

    }

})();