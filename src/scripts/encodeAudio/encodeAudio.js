'use strict';

const _ = require('underscore'),
    defaultConfiguration = {
        disableVideo: true,
        audioCodec: 'aac'
    },
    ffmpegClient = require('../../clients/ffmpeg/client.js'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
    moment = require('moment');

function generateOutputFolder(input, output) {
    const baseFolder = path.dirname(input),
        newFolderName = moment.utc().format('YYYYMMDDHHmm') + '_audio',
        outputPath = output || path.join(baseFolder, newFolderName);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
    }

    return outputPath;
}

async function encodeAudio(input, opts) {
    try {
        if (!input || !opts.audioBitrate) {
            throw new Error(`Missing mandatory properties`);
        }

        const config = _.clone(defaultConfiguration),
            outputFolder = generateOutputFolder(input, opts.output);

        config.bitrate = opts.audioBitrate;

        const client = new ffmpegClient(input, outputFolder);

        console.log('\n', chalk.blue(`Encoding audio [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
        config.encodedAudio = await client.encodeAudio(config);
        config.input = input;
        config.output = outputFolder;
        console.log('\n',
            chalk.green(`Audio encoded [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
    } catch (err) {
        console.log(err)
        console.error(err && err.toString());
    }
}

module.exports = encodeAudio;
