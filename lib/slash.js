(function () {
    'use strict';

    var fixSlash = function fixSlash(s) {
        if (!s) return null;
        return s.replace(/\\/g, '/');
    };


    var ret = {};
    ret.fixSlash = fixSlash;
    module.exports = ret;

})();