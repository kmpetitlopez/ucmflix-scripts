'use strict';

module.exports = {
    command: 'encodeAudio <input>',
    options: [
        {
            flags: '-o, --output <output>',
            description: 'Path to the output folder'
        },
        {
            flags: '-B, --audioBitrate <audioBitrate>',
            description: 'audio bitrate'
        },
        {
            flags: '-s, --stats',
            description: 'print some stats about the process'
        }
    ],
    action: require('./encodeAudio.js')
};
