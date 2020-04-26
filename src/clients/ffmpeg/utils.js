'use strict';

const utils = require('../utils'),
    fs = require('fs');

function generateOutputName(input, encodingParameters, type) {
    const baseName = utils.getCleanName(input),
        ext = '.mp4';
    let outputName = baseName + '_' + type;

    if (encodingParameters.size) {
        outputName += '_' + encodingParameters.size;
    }
    
    if (encodingParameters.bitrate) {
        outputName += '_' + encodingParameters.bitrate;
    }

    outputName += ext;

    return outputName;
}

module.exports = {
    generateOutputName
}

