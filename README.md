# ucmflix scripts

## Getting started

- Install **NodeJS** (V10.16.0) [Download here](https://nodejs.org/es/download/)
- Install **FFmpeg** [Download here](https://www.ffmpeg.org/download.html)
- Install **GPAC** [Download here](https://gpac.wp.imt.fr/downloads/gpac-nightly-builds/)

## Project setup
```
npm ci
```

## Scripts

### Encode Video

```
npm run ucmflix encodeVideo <inputVideo> -- [Options]
```

#### Options

```
-r, --resolution <string>   Comma separated list of the different resolutions to encode the video [required: true]
-b, --bitrate <string>   Comma separated list of the different bitrates for each resolution or a single value for all [required: true]
-k, --keyframe <number>   Keyframe interval [default: 90]
-o, --output <string>   Path to the output folder [default: YYYYMMDDHHmm_video]
```
#### Examples

```
npm run ucmflix encodeVideo Videos/input.avi -- -r 160x90 -b 250k
```

```
npm run ucmflix encodeVideo Videos/input.avi -- -r 160x90,320x180,640x360 -b 500k
```

```
npm run ucmflix encodeVideo Videos/input.avi -- -r 160x90,320x180,640x360 -b 250k,500k,750k
```

### Encode Audio

```
npm run ucmflix encodeAudio <inputVideo> -- [Options]
```

#### Options

```
-B, --audioBitrate <string>   Audio bitrate [required: true]
-o, --output <string>   Path to the output folder [default: YYYYMMDDHHmm_audio]
```

#### Examples

```
npm run ucmflix encodeAudio Videos/input.avi -- -B 128k
```

### Generate Manifest

```
npm run ucmflix generateManifest <inputFolder> -- [Options]
```

#### Options

```
-t, --title <string>   Title of the manifest [required: true]
-d, --dash <number>   Cut the input files in the number of frames [default: 5000]
-R, --rap   Forces the segments to start with random access points [default: false]
-f, --frag <number>  Sets the fragment length to number seconds. This must be less than the value specified with --dash [default: 2000]
```

#### Examples

```
npm run ucmflix generateManifest Videos/ -- -t exampleMovie
```

```
npm run ucmflix generateManifest Videos/ -- -t exampleMovie -d 5000 -R -f 2000
```

### Full Process
```
npm run ucmflix fullProcess <inputVideo> -- [Options]
```

#### Options

```
-r, --resolution <string>   Comma separated list of the different resolutions to encode the video [required: true]
-b, --bitrate <string>   Comma separated list of the different bitrates for each resolution or a single value for all [required: true]
-k, --keyframe <number>   Keyframe interval [default: 90]
-B, --audioBitrate <string>   Audio bitrate [required: true]
-t, --title <string>   Title of the manifest [required: true]
-d, --dash <number>   Cut the input files in the number of frames [default: 5000]
-R, --rap   Forces the segments to start with random access points [default: false]
-f, --frag <number>  Sets the fragment length to number seconds. This must be less than the value specified with --dash [default: 2000]
-o, --output <string>   Path to the output folder [default: YYYYMMDDHHmm_video]
```

#### Examples

```
npm run ucmflix fullProcess Videos/input.avi -- -t exampleMovie -r 160x90,320x180,640x360 -b 250k,500k,750k -B 128k
```

## Dependencies

- [ajv](https://github.com/epoberezkin/ajv)
- [chalk](https://github.com/chalk/chalk)
- [commander](https://github.com/tj/commander.js)
- [moment](https://github.com/moment/moment)
- [underscore](https://github.com/jashkenas/underscore)