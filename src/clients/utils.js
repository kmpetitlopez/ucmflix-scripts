'use strict';

const {spawn} = require('child_process'),
    path = require('path'),
    fs = require('fs');

function execS(cmd, args) {
    return new Promise((resolve, reject) => {
        if (!cmd) {
            reject('missing property cmd');
        }

        const child = spawn(cmd, args);

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (chunk) => {
            console.log(`stdout: ${chunk}`);
        });

        child.on('error', (err) => {
            console.log(`error: ${error.message}`);
            reject(err);
        });

        child.on('message', (code) => {
            console.log(code);
        });

        child.on('close', (code) => {
            console.log(`child process exited`);
            resolve();
        });
    });
}

function getCleanName(input) {
    const inputParse = path.parse(input);

    return inputParse.name;
}

function getDir(input) {
    return path.dirname(input);
}

function existFile(path) {
    return fs.existsSync(path);
}

module.exports = {
    getCleanName,
    execS,
    getDir,
    existFile
}


