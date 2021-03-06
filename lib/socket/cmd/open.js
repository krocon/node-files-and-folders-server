(function () {
    'use strict';


    // Opens an file via console (for example PDF-Viewer for *.pdf)

    var si = require('./../../initial//systeminfo.js');
    var exec = require('child_process').exec;

    var execute = function execute(cmd, cmdAlternate) {
        console.info('Trying cmd...', cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error('error', error);

                exec(cmdAlternate, function (error, stdout, stderr) {
                    console.info('Trying alternate cmd...', cmdAlternate);
                    if (error) {
                        console.error('error', error);
                    }
                });
            }
        });
    };

    var open = function open(socket, file) {
        console.log('open  p ->', file);

        si.getSystemInfo(function (err, systemInfo) {
            if (err) return;

            var cmd;
            var cmdAlternate;
            if (systemInfo.windows) {
                // http://stackoverflow.com/questions/12010103/launch-a-program-from-command-line-without-opening-a-new-window
                cmd = ' start "" /max "' + file + '" ';
            } else if (systemInfo.osx) {
                cmd = ' open  "' + file + '" ';
            } else if (systemInfo.linux) {
                cmd = 'evince -f "' + file + '" ';
                cmdAlternate = 'kpdf "' + file + '" ';
            } else {
                console.warn('open file not supported for system.', systemInfo);
            }
            if (cmd) {
                execute(cmd, cmdAlternate);
            }
        });

        // open PDF:

        // W i n d o w s :
        // http://stackoverflow.com/questions/6557920/how-to-open-a-pdf-in-fullscreen-view-via-command-line
        // var cmd = ' start "" /max "h:\\docs\\allg\\ZEISS Lisa\\AT-LISA-tri-family-Datasheet-DE.pdf" ';

        // M a c   O S   X
        // 'open h:\\docs\\allg\\ZEISS Lisa\\AT-LISA-tri-family-Datasheet-DE.pdf'

        // g n o m e   d e s k t o p :
        // https://help.gnome.org/users/evince/stable/commandline.html.en
        // http://stackoverflow.com/questions/264395/linux-equivalent-of-the-mac-os-x-open-command
        // evince -f file.pdf

        // K D E   d e s k t o p :
        //  kpdf file.pdf

    };

    exports.open = open;

})();