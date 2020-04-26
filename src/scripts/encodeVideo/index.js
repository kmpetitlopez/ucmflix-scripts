'use strict';

module.exports = {
    command: 'encodeVideo <input>',
    options: [
        {
            flags: '-o, --output <output>',
            description: 'Path to the output folder'
        },
        {
            flags: '-r, --resolution <resolution>',
            description: 'Comma separated list of the different resolutions to encode the video'
        },
        {
            flags: '-b, --bitrate <bitrate>',
            description: 'Comma separated list of the different bitrates for each resolution or a single value for all'
        },
        {
            flags: '-k, --keyframe <keyframe>',
            description: 'keyframe interval'
        }
    ],
    action: require('./encodeVideo.js')
};
