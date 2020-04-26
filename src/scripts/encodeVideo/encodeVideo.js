'use strict';

const _ = require('underscore'),
    defaultConfiguration = {
        disableAudio: true,
        videoCodec: 'libx264',
        keyframe: 90
    },
    ffmpegClient = require('../../clients/ffmpeg/client.js'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
    moment = require('moment');

function generateOutputFolder(input, output) {
    const baseFolder = path.dirname(input),
        newFolderName = moment.utc().format('YYYYMMDDHHmm') + '_video',
        outputPath = output || path.join(baseFolder, newFolderName);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
    }

    return outputPath;
}

async function encodeVideo(input, opts) {
    try {
        if (!input || !opts.resolution || !opts.bitrate) {
            throw new Error(`Missing mandatory properties`);
        }

        const resolutions = opts.resolution.split(','),
            bitrates = opts.bitrate.split(','),
            hasSameLength = resolutions.length === bitrates.length,
            configurations = [],
            outputFolder = generateOutputFolder(input, opts.output);

        if (!hasSameLength && bitrates.length !== 1) {
            throw new Error(`Difference between resolution and bitrates`);
        }

        defaultConfiguration.keyframe = opts.keyframe || defaultConfiguration.keyframe;

        for (let i = 0; i < resolutions.length; i++) {
            const config = _.clone(defaultConfiguration);

            config.size = resolutions[i];
            config.bitrate = hasSameLength ? bitrates[i] : bitrates[0];

            const client = new ffmpegClient(input, outputFolder);

            console.log('\n', chalk.blue(`Encoding video [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
            config.encodedVideo = await client.encodeVideo(config);
            console.log('\n', chalk.green(`Video encoded [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
            
            config.input = input;
            config.output = outputFolder;
            configurations.push(config);
        }
        console.log(chalk.yellowBright(`Encoding finished [configurations=${JSON.stringify(configurations)}]`))
    } catch (err) {
        console.error(err && err.toString());
    }
}

module.exports = encodeVideo;
