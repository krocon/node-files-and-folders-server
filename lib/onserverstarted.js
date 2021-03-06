(function () {
    'use strict';

    // Simple server log at start time

    var onServerStarted = function onServerStarted(error) {
        if (error) return console.error(error);

        console.log('Server app');
        console.log('   ...started   at: %s', new Date());
        console.log('   ...listening at: http://%s:%s', this.address().address.replace('::', 'localhost'), this.address().port);
    };

    exports.onServerStarted = onServerStarted;

})();