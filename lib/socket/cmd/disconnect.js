(function () {
    'use strict';


    var disconnect = function disconnect(socket, p) {
        console.log('socket disconnected', socket.id);
    };

    exports.disconnect = disconnect;

})();