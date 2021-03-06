(function () {
    'use strict';

    // Saves the configuration for an user

    var path = require('path');
    var jsonfile = require('jsonfile');

    var saveconfig = function saveconfig(socket, para) {
        var data = para.data;
        var username = para.username;

        var file = path.join(__dirname, '../../../temp', username + '.json');
        console.log('Saving...', file);

        jsonfile.writeFile(file, data, {spaces: 2}, function (err) {
            if (err) return console.error(err);
            console.log('Saved.');
        });
    };

    exports.saveconfig = saveconfig;

})();