'use strict';

const _ = require('underscore'),
    defaultConfiguration = {
        profile: 'dashavc264:onDemand',
        dash: 5000,
        fragment: 2000,
        rap: true
    },
    mp4BoxClient = require('../../clients/mp4box/client'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk');

async function generateManifest(input, opts) {
    try {
        if (!input || !opts.title) {
            throw new Error(`Missing mandatory properties`);
        }

        const config = _.clone(defaultConfiguration),
            files = fs.readdirSync(input);

        config.dash = opts.dash || config.dash;
        config.rap = opts.rap;
        config.fragment = opts.fragment || config.fragment;
        config.title = opts.title;
        config.files = files.map((file) => path.join(input, file));

        const client = new mp4BoxClient(input);

        console.log('\n', chalk.blue(`Generating manifest [configuration=${JSON.stringify(config)}]`));
        config.manifest = await client.generateManifest(config);
        config.input = input;
        console.log('\n',
            chalk.green(`Manifest generated [configuration=${JSON.stringify(config)}]`));
    } catch (err) {
        console.log(err)
        console.error(err && err.toString());
    }
}

module.exports = generateManifest;
