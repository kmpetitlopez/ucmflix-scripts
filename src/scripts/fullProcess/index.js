'use strict';

module.exports = {
    command: 'fullProcess <input>',
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
        },
        {
            flags: '-d, --dash <dash>',
            description: 'Cut the input files in the number of frames'
        },
        {
            flags: '-R, --rap',
            description: 'Forces the segments to start with random access points'
        },
        {
            flags: '-t, --title <title>',
            description: 'Title of the manifest'
        },
        {
            flags: '-f, --frag <fragment>',
            description: 'Sets the fragment length to number seconds. This must be less than the value specified with -dash'
        }
    ],
    action: require('./fullProcess.js')
};
