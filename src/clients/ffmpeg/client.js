'use strict';

const ffmpegUtils = require('./utils'),
    utils = require('../utils'),
    CMD = 'ffmpeg',
    videoConfiguration = require('./configuration/videoConfig'),
    audioConfiguration = require('./configuration/audioConfig'),
    path = require('path');

module.exports = class FfmpegClient {
    constructor(input, outputFile) {
        if (!input || !outputFile) {
            throw new Error('cannot construct FfmpegClient witout input or outputFile');
        }

        this.input = input;
        this.outputFile = outputFile;
    }

    async encodeVideo(encodingParameters) {
        if (!encodingParameters) {
            throw new Error('cannot encode video without parameters');
        }

        try {
            const outputName = path.join(this.outputFile,
                    ffmpegUtils.generateOutputName(this.input, encodingParameters, 'video')),
                args = this._getCmdArguments(encodingParameters, outputName, videoConfiguration.configuration);
            
            if (utils.existFile(outputName)) {
                console.log(`File already encoded with this configuration [file=${outputName}]. Ignoring it`);
                return;
            }

            await utils.execS(CMD, args);

            return outputName;
        } catch (e) {
            console.log(`Error encoding video with [args= ${JSON.stringify(encodingParameters)}]`);
            console.log(`Error = ${e.toString()}`);
        }
    }

    async encodeAudio(encodingParameters) {
        if (!encodingParameters) {
            throw new Error('cannot encode audio without parameters');
        }

        try {
            const outputName = path.join(this.outputFile,
                ffmpegUtils.generateOutputName(this.input, encodingParameters, 'audio')),
                args = this._getCmdArguments(encodingParameters, outputName, audioConfiguration.configuration);
                
            if (utils.existFile(outputName)) {
                console.log(`File already encoded with this configuration [file=${outputName}]. Ignoring it`);
                return;
            }

            await utils.execS(CMD, args);

            return outputName;
        } catch (e) {
            console.log(`Error encoding audio with [args= ${JSON.stringify(encodingParameters)}]`);
            console.log(`Error = ${e.toString()}`);
        }
    }

    _getCmdArguments(encodingParameters = {}, outputName, configuration) {
        const args = ['-i', this.input];

        for (const conf of configuration) {
            const propertyName = conf.name
            if (encodingParameters[propertyName]) {
                if (encodingParameters[propertyName] === true) {
                    args.push(...[conf.command])
                } else {
                    args.push(...[conf.command, encodingParameters[propertyName]])
                }
            }
        }

        args.push(...[outputName, '-n', '-progress', 'pipe:1']);

        return args;
    }
}
