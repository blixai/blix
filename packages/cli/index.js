#!/usr/bin/env node
const program = require('commander');
const debug = require('debug')
const pkg = require('./package.json');
const { store, clearConsole } = require('@blixi/core')
store.mode = 'cli' // this must be set before functions are compiled in order to load necessary files properly
const { createProject } = require("@blixi/cli-new");
const { notes } = require("./src/notes")
const { scripts } = require("./src/scripts/script");
const add = require("@blixi/cli-add");
const { runScript } = require("./src/do")
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
    .command('notes')
    .description('get all developer notes.')
    .action((args) => notes())


program.parse(process.argv);
if (program.verbose) {
    store.env = 'development'
}

if (!process.argv.slice(2).length) {
    program.outputHelp()
}