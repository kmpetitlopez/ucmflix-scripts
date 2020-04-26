'use strict';

const videoCodecs = require('./videoCodecs.json'),
    _ = require('underscore'),
    configuration = [
    {
      type: 'number',
      name: 'videoFrames',
      message: 'Number of video frames to output',
      command: '-vframes'
    },
    {
      type: 'text',
      name: 'rate',
      message: 'Frame rate (Hz value, fraction or abbreviation)',
      command: '-r'
    },
    {
      type: 'text',
      name: 'size',
      message: 'Frame size (WxH)',
      validate: _validateFrameSize,
      command: '-s'
    },
    {
      type: 'text',
      name: 'aspectRatio',
      message: 'Aspect ratio (4:3, 16:9)',
      validate: _validateAspectRatio,
      command: '-aspect'
    },
    {
      type: 'number',
      name: 'bitsPerSample',
      message: 'Number of bits per raw sample',
      command: '-bits_per_raw_sample'
    },
    {
      type: 'autocomplete',
      name: 'videoCodec',
      message: 'Video codec',
      choices: _.map(videoCodecs, (codec) => {
          return {"title": codec}
        }),
        command: '-c:v'
    },
    {
      type: 'text',
      name: 'timeCode',
      message: 'Initial TimeCode value (hh:mm:ss)',
      validate: _validateTimeCode,
      command: '-timecode'
    },
    {
      type: 'text',
      name: 'pass',
      message: 'Pass number (1 to 3)',
      validate: _validatePass,
      command: '-pass'
    },
    {
        type: 'text',
        name: 'bitrate',
        message: 'Video bitrate',
        command: '-b:v'
    },
    {
        type: 'number',
        name: 'gopSize',
        message: 'Group of picture (GOP) size',
        command: '-g'
    },
    {
      type: 'confirm',
      name: 'disableData',
      message: 'Disable data',
      command: '-dn'
    },
    {
      type: 'confirm',
      name: 'disableAudio',
      message: 'Disable Audio',
      command: '-an'
    }
]

function _validateFrameSize(value) {
    const regex = /([0-9]+)x([0-9]+)/;
    return value ? regex.test(value) : true;
}

function _validateAspectRatio(value) {
    const regex = /([0-9]+):([0-9]+)/;
    return value ? regex.test(value) : true;
}

function _validateTimeCode(value) {
    const regex = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
    return value ? regex.test(value) : true;
}

function _validatePass(value) {
    const regex = /[123]/;
    return value ? regex.test(value) : true;
}

module.exports = {
    configuration
}

