'use strict';

const _ = require('underscore'),
    defaultConfiguration = {
        disableAudio: true,
        videoCodec: 'libx264',
        keyframe: 90
    },
    ffmpegClient = require('../../clients/ffmpeg/client.js'),
    chalk = require('chalk'),
    utils = require('../utils');

async function encodeVideo(input, opts) {
    try {
        if (!input || !opts.resolution || !opts.bitrate) {
            throw new Error(`Missing mandatory properties`);
        }

        const resolutions = opts.resolution.split(','),
            bitrates = opts.bitrate.split(','),
            hasSameLength = resolutions.length === bitrates.length,
            configurations = [],
            outputFolder = utils.generateOutputFolder(input, opts.output, '_video'),
            isResolution = resolutions.length >= bitrates.length,
            loop = isResolution ? resolutions : bitrates;

        if (!hasSameLength && 
            ((isResolution && bitrates.length !== 1) ||
            (!isResolution && resolutions.length !== 1))) {
            throw new Error(`Difference between resolution and bitrates`);
        }

        defaultConfiguration.gopSize = opts.keyframe || defaultConfiguration.keyframe;

        for (let i = 0; i < loop.length; i++) {
            const config = _.clone(defaultConfiguration);

            config.size = isResolution ? resolutions[i] : resolutions[0];
            config.bitrate = (!isResolution || hasSameLength) ? bitrates[i] : bitrates[0];

            const client = new ffmpegClient(input, outputFolder);

            console.log('\n', chalk.blue(`Encoding video [configuration=${JSON.stringify(config, null, '\t')}] [outputFolder=${outputFolder}]`));
            config.encodedVideo = await client.encodeVideo(config, opts.stats);
            console.log('\n', chalk.blue(`Video encoded`));
            
            config.input = input;
            config.output = outputFolder;
            configurations.push(config);
        }

        await utils.storeProcessConfiguration(configurations, outputFolder);
        console.log(chalk.cyan(`Encoding finished [configurations=${JSON.stringify(configurations, null, '\t')}]`))
    } catch (err) {
        console.error(err && err.toString());
    }
}

module.exports = encodeVideo;
