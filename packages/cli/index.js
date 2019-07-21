#!/usr/bin/env node
const program = require('commander');
const debug = require('debug')
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const { store, clearConsole } = require('@blix/core')
store.mode = 'cli' // this must be set before functions are compiled in order to load necessary files properly
const { createProject } = require("./src/new");
const { scripts } = require("./src/scripts/script");
const add = require("./src/add/add");
const { generate } = require('./src/generate')
const { runScript } = require("./src/execute")
let pjson = require("./package.json");
let version = pjson.version
store.blixVersion = version
let currentNodeVersion = process.versions.node;
let semver = currentNodeVersion.split('.');
let major = semver[0];

clearConsole()

if (major < 8) {
    console.error(
        'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Blix requires Node 8 or higher. \n' +
        'Please update your version of Node.'
    );
    process.exit(1);
}


updateNotifier({ pkg }).notify();

program
    .version(version, '-v, --version')
    .option('--verbose', 'output complete errors if something breaks')


program
    .command('new [name]')
    .option('-s, --skip', 'Skips installation') // TODO - while it's fine to skip it needs to still add the packages to the package.json but not install
    .description('create a new project')
    .action((name, cmd) => {
        if (name) {
            store.name = name
        }
        if (cmd.skip) {
            store.skipInstallation = true
        }
        createProject()
    })

program
    .command('add')
    .description('add tools to an existing project')
    .action(() => add())

program
    .command('scripts')
    .description('add premade or custom scripts to a project')
    .action(() => scripts())

program
    .command('do')
    .description('show a dropdown selector of package.json scripts. Select one and press enter to execute')
    .action(() => runScript("."))

program
    .command('generate [args...]')
    .allowUnknownOption()
    .alias('g')
    .description('run scripts in a project or use common Blix templates')
    .action((args) => {
        if (process.argv.length > 4) {
            let options = process.argv.slice(4)
            generate(options)
        } else {
            generate(args)
        }
    })



program.parse(process.argv);

if (program.verbose) {
    store.env = 'development'
}

if (!process.argv.slice(2).length) {
    program.outputHelp()
}