(() => {
    const
        commander = require('commander'),
        chalk = require('chalk'),
        fs = require('fs'),
        path = require('path'),
        Ajv = require('ajv'),
        scriptsDir = 'scripts',

        cliSchema = require('./cli.schema.json'),
        pkg = require('../package.json'),

        getDirectories = (baseDir) => {
            const excludes = ['utils'];
            return fs.readdirSync(baseDir)
                .filter((file) => {
                    if (-1 != excludes.indexOf(file)) {
                        return false;
                    }
                    return fs.statSync(path.join(baseDir, file)).isDirectory();
                });
        },

        validate = (options) => {
            const ajv = new Ajv();
            if (!ajv.validate(cliSchema, options)) {
                let message = ajv.errors
                    .map((e) => {
                        return `Script options: ${e.message}`;
                    })
                    .join('\n');
                throw new Error(message);
            }
        };

    try {
        console.log('\n', chalk.yellowBright(pkg.description), '\n');

        commander.version(pkg.version, '-v, --version');

        getDirectories(path.resolve(__dirname, scriptsDir)).forEach((dir) => {
            try {
                const scriptAction = require(path.resolve(__dirname, scriptsDir ,dir));

                validate(scriptAction);

                const command = commander.command(scriptAction.command);

                if (scriptAction.options && scriptAction.options.length) {
                    scriptAction.options.forEach((option) => {
                        command.option(option.flags, option.description);
                    });
                }

                command.action(scriptAction.action);
            } catch (e) {
                if (!e.toString().includes('Cannot find module')) {
                    throw e;
                }
            }
        });

        commander.on('command:*', () => {
            console.error(chalk.red('Invalid command: %s'), commander.args.join(' '));

            commander.help();
            process.exit(1);
        });

        commander.parse(process.argv);

        if (commander.args.length === 0) {
            commander.help();
            process.exit(1);
        }
    } catch (error) {
        console.error(chalk.red(error.toString()));
        process.exit(1);
    }
})();
