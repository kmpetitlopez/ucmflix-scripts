'use strict';

module.exports = {
    command: 'generateManifest <input>',
    options: [
        {
            flags: '-o, --output <output>',
            description: 'Path to the output folder'
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
    action: require('./generateManifest.js')
};
