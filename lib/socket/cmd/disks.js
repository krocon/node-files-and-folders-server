(function () {
    'use strict';

    // TODO not used?

    var drive = require('./../../initial/drives.js');

    var disks = function disks(socket) {
        drive.getWinDrives(function (error, disks) {
            if (error) return console.error(error, disks);
            socket.emit(action.cmd, {error: error, disks: disks});
        });
    };

    exports.disks = disks;

})();