'use strict';

const _ = require('underscore'),
    defaultConfiguration = {
        disableVideo: true,
        audioCodec: 'aac'
    },
    ffmpegClient = require('../../clients/ffmpeg/client.js'),
    chalk = require('chalk'),
    utils = require('../utils');

async function encodeAudio(input, opts) {
    try {
        if (!input || !opts.audioBitrate) {
            throw new Error(`Missing mandatory properties`);
        }

        const config = _.clone(defaultConfiguration),
            outputFolder = utils.generateOutputFolder(input, opts.output, '_audio');

        config.bitrate = opts.audioBitrate;

        const client = new ffmpegClient(input, outputFolder);

        console.log('\n', chalk.blue(`Encoding audio [configuration=${JSON.stringify(config, null, '\t')}] [outputFolder=${outputFolder}]`));
        config.encodedAudio = await client.encodeAudio(config, opts.stats);
        config.input = input;
        config.output = outputFolder;
        await utils.storeProcessConfiguration(config, outputFolder);
        console.log('\n',
            chalk.cyan(`Audio encoded [configuration=${JSON.stringify(config, null, '\t')}] [outputFolder=${outputFolder}]`));
    } catch (err) {
        console.log(err)
        console.error(err && err.toString());
    }
}

module.exports = encodeAudio;
