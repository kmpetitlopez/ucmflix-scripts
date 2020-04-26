'use strict';

const audioCodecs = require('./audioCodecs.json'),
    _ = require('underscore'),
    configuration = [
    {
      type: 'number',
      name: 'audioFrames',
      message: 'Number of audio frames to output',
      command: '-aframes'
    },
    {
      type: 'text',
      name: 'audioQuality',
      message: 'Audio quality',
      command: '-aq'
    },
    {
      type: 'text',
      name: 'samplingRate',
      message: 'Audio sampling rate (in Hz)',
      command: '-ar'
    },
    {
      type: 'number',
      name: 'audioChannels',
      message: 'Number of audio channels',
      command: '-ac'
    },
    {
      type: 'text',
      name: 'bitrate',
      message: 'Audio bitrate',
      command: '-b:a'
    },
    {
      type: 'autocomplete',
      name: 'audioCodec',
      message: 'Audio codec',
      choices: _.map(audioCodecs, (codec) => {
          return {"title": codec}
        }),
        command: '-acodec'
    },
    {
      type: 'text',
      name: 'audioVolume',
      message: 'Audio volume (256=normal)',
      command: '-vol'
    },
    {
      type: 'confirm',
      name: 'disableVideo',
      message: 'Disable Video',
      command: '-vn'
    }
]

module.exports = {
    configuration
}

