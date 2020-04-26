'use strict';

const utils = require('../utils'),
    fs = require('fs');

function areValidParameters(cmd, args) {
    return true;
}


function generateOutputName(input) {
    const baseName = utils.getCleanName(input),
        ext = '.mpd';
    let outputName = baseName + '_' + 'manifest';

    outputName += ext;

    return outputName;
}

function getFiles(path) {
    return fs.readdirSync(path);
}

module.exports = {
    generateOutputName,
    areValidParameters,
    getFiles
}

