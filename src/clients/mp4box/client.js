'use strict';

const mp4BoxUtils = require('./utils'),
    utils = require('../utils'),
    manifestConfiguration = require('./configuration/manifestConfig'),
    CMD = 'MP4Box',
    path = require('path');

module.exports = class MP4BoxClient {
    constructor(outputFolder) {
        if (!outputFolder) {
            throw new Error('cannot construct MP4BoxClient witout outputFolder');
        }

        this.outputFolder = outputFolder;
    }

    async generateManifest(manifestParameters) {
        if (!manifestParameters) {
            throw new Error('cannot generate manifest without parameters');
        }

        try {
            const outputName = path.join(this.outputFolder,
                mp4BoxUtils.generateOutputName(manifestParameters.title)),
                args = this._getCmdArguments(manifestParameters, outputName, manifestConfiguration.configuration);
            
            if (utils.existFile(outputName)) {
                console.log(`Manifest already exist [file=${outputName}]. Ignoring it`);
                return;
            }

            await utils.execS(CMD, args);

            return outputName;
        } catch (e) {
            console.log(`Error generating manifest with [args= ${JSON.stringify(manifestParameters)}]`);
            console.log(`Error = ${e.toString()}`);
        }
    }

    _getCmdArguments(manifestParameters = {}, outputName, configuration) {
        const args = [];

        for (const conf of configuration) {
            const propertyName = conf.name
            if (manifestParameters[propertyName]) {
                if (manifestParameters[propertyName] === true) {
                    args.push(...[conf.command])
                } else {
                    args.push(...[conf.command, manifestParameters[propertyName]])
                }
            }
        }

        args.push(...['-out', outputName]);
        args.push(...manifestParameters.files);

        return args;
    }
}
