'use strict';

const util = require('util'),
    {spawn} = require('child_process'),
    exec = util.promisify(require('child_process').exec),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

async function execS2(cmd, args = [], printStats = false) {
    let interval;
    let duration;
    let finalStats;
    const command = cmd + ' ' + args.join(' '),
        stats = [];
    
    console.log('Executing: ', command);
    
    if (printStats) {
        interval = getStats(cmd, stats);
        duration = process.hrtime();
    };
    
    const { stdout, stderr } = await exec(command);
    
    if (printStats) {
        clearInterval(interval);
        duration = process.hrtime(duration);
        finalStats = processStats(stats);
        finalStats.duration = (duration[0] + (duration[1] / 1000000000));
        finalStats.duration = parseFloat(finalStats.duration.toFixed(2));
    }

    console.log(stderr);
    console.log(stdout);

    return finalStats;
}
    
function getStats (cmd, stats) {
    return setInterval(async () => {
        const osConfig = getOSConfiguration(),
            { stdout } = await exec('top ' + osConfig.args + ' | grep ' + cmd);
    
        if (stdout) {
            const out = osConfig.split ? stdout.split('\n')[2] : stdout,
                values = out && out.split(' ').filter(val => !!val);

            console.log(out);
            
            stats.push({
                pId: values && values[osConfig.pId],
                cpuPercentage: values && 
                    values[osConfig.cpuPercentage] && 
                    parseFloat(values[osConfig.cpuPercentage].replace(',', '.')),
                memory: values && values[osConfig.memory]
            });
        }
    }, 2000);
}

function processStats (stats) {
    const maxCpuPercentage = _.max(stats, stat => stat.cpuPercentage),
        minCpuPercentage = _.min(stats, stat => stat.cpuPercentage),
        numberOfStats = stats.length;
    let mediumCpuPercentage = 0;

    stats.forEach(stat => mediumCpuPercentage += stat.cpuPercentage);
    mediumCpuPercentage /= numberOfStats;
    
    return {
        maxCpuPercentage: maxCpuPercentage && maxCpuPercentage.cpuPercentage,
        minCpuPercentage: minCpuPercentage && minCpuPercentage.cpuPercentage,
        mediumCpuPercentage: mediumCpuPercentage && parseFloat(mediumCpuPercentage.toFixed(2)),
        memory: stats[numberOfStats - 1] && stats[numberOfStats - 1].memory
    };
}

function getOSConfiguration() {
    const os = process.platform,
        configuration = {
            pId: 0,
            cpuPercentage: '',
            memory: ''
        };

    if (os === 'darwin') {
        configuration.cpuPercentage = 2;
        configuration.memory = 7;
        configuration.args = '-l 3';
        configuration.split = true;
    } else if (os === 'linux') {
        configuration.cpuPercentage = 8;
        configuration.memory = 9;
        configuration.args = '-b -n 1';
    }

    return configuration;
}

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
    existFile,
    execS2
}


