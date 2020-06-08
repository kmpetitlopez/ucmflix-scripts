'use strict';

const _ = require('underscore'),
    defaultAudioconfiguration = {
        disableVideo: true,
        audioCodec: 'aac'
    },
    defaultVideoconfiguration = {
        disableVideo: true,
        audioCodec: 'aac'
    },
    defaultManifestconfiguration = {
        profile: 'dashavc264:onDemand',
        dash: 5000,
        fragment: 2000,
        rap: true
    },
    mp4BoxClient = require('../../clients/mp4box/client'),
    ffmpegClient = require('../../clients/ffmpeg/client.js'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
    moment = require('moment'),
    finalConfiguration = {};

function generateOutputFolder(input, output) {
    const baseFolder = path.dirname(input),
        newFolderName = moment.utc().format('YYYYMMDDHHmm'),
        outputPath = output || path.join(baseFolder, newFolderName);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
    }

    return outputPath;
}

async function generateManifest(folderPath, opts) {
    const config = _.clone(defaultManifestconfiguration),
        files = fs.readdirSync(folderPath);

    config.dash = opts.dash || config.dash;
    config.rap = opts.rap;
    config.fragment = opts.fragment || config.fragment;
    config.title = opts.title;
    config.files = files.map((file) => path.join(folderPath, file));

    const client = new mp4BoxClient(folderPath);

    console.log('\n', chalk.blue(`Generating manifest [configuration=${JSON.stringify(config)}]`));
    config.manifest = await client.generateManifest(config);
    config.folderPath = folderPath;
    console.log('\n',
        chalk.green(`Manifest generated [configuration=${JSON.stringify(config)}]`));
    finalConfiguration.manifest = config;
}

async function encodeAudio(input, outputFolder, opts) {
    const config = _.clone(defaultAudioconfiguration);

    config.bitrate = opts.audioBitrate;

    const client = new ffmpegClient(input, outputFolder);

    console.log('\n', chalk.blue(`Encoding audio [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
    config.encodedAudio = await client.encodeAudio(config);
    config.input = input;
    console.log('\n',
        chalk.green(`Audio encoded [configuration=${JSON.stringify(config)}] [outputFolder=${outputFolder}]`));
    finalConfiguration.audio = config;
}

async function encodeVideo(input, outputFolder, opts) {
    const resolutions = opts.resolution.split(','),
        bitrates = opts.bitrate.split(','),
        hasSameLength = resolutions.length === bitrates.length,
        configurations = [];

    if (!hasSameLength && bitrates.length !== 1) {
        throw new Error(`Difference between resolution and bitrates`);
    }

    defaultVideoconfiguration.gopSize = opts.keyframe || defaultVideoconfiguration.keyframe;

    for (let i = 0; i < resolutions.length; i++) {
        const config = _.clone(defaultVideoconfiguration);

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
    console.log(chalk.green(`Video encoding finished [configurations=${JSON.stringify(configurations)}]`));
    finalConfiguration.video = configurations;
}

async function fullProcess(input, opts) {
    try {
        if (!input || !opts.audioBitrate
            || !opts.resolution || !opts.bitrate
            || !opts.title) {
            throw new Error(`Missing mandatory properties`);
        }

        const outputFolder = generateOutputFolder(input, opts.output);

        console.log('\n', chalk.yellowBright(`Starting video encoding`));

        await encodeVideo(input, outputFolder, opts);

        console.log('\n', chalk.yellowBright(`Starting audio encoding`));
        await encodeAudio(input, outputFolder, opts);

        console.log('\n', chalk.yellowBright(`Generating manifest`));
        await generateManifest(outputFolder, opts);

        console.log('\n', `Pocess completed [configurations=${JSON.stringify(finalConfiguration)}]`);
        
    } catch (err) {
        console.log(err)
        console.error(err && err.toString());
    }
}

module.exports = fullProcess;
