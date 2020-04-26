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
        }
    ],
    action: require('./encodeAudio.js')
};
