'use strict';

const configuration = [
    {
      type: 'number',
      name: 'dash',
      message: 'Cut the input files in the number of frames',
      command: '-dash'
    },
    {
      type: 'confirm',
      name: 'rap',
      message: 'Forces the segments to start with random access points',
      command: '-rap'
    },
    {
      type: 'text',
      name: 'profile',
      message: '',
      command: '-profile'
    },
    {
      type: 'text',
      name: 'title',
      message: 'Title of the manifest',
      command: '-mpd-title'
    },
    {
      type: 'number',
      name: 'fragment',
      message: 'Sets the fragment length to number seconds. This must be less than the value specified with -dash',
      command: '-frag'
    }
]

module.exports = {
    configuration
}

