'use strict';

const path = require('path'),
    moment = require('moment'),
    fs = require('fs'),
    util = require('util'),
    writeFile = util.promisify(fs.writeFile);

function generateOutputFolder(input, output, type) {
    const baseFolder = path.dirname(input),
        newFolderName = moment.utc().format('YYYYMMDDHHmm') + type,
        outputPath = output || path.join(baseFolder, newFolderName);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
    }

    return outputPath;
}

async function storeProcessConfiguration(configuration, output) {
    const basename = output && path.basename(output),
        fileName = basename && path.join(output, basename + '.json');
    
    await writeFile(fileName, JSON.stringify(configuration, null, '\t'));
}

module.exports = {
    generateOutputFolder,
    storeProcessConfiguration
}