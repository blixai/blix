#!/usr/bin/env node
const program = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const { store } = require('./blix')
store.mode = 'cli' // this must be set before functions are compiled in order to load necessary files properly
const { createProject } = require("./cli/new");
const { scripts } = require("./cli/scripts/script");
const add = require("./cli/add/add");
const { generate } = require('./cli/generate')
let pjson = require("./package.json");
let version = pjson.version
let currentNodeVersion = process.versions.node;
let semver = currentNodeVersion.split('.');
let major = semver[0];

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


updateNotifier({pkg}).notify();

program
  .version(version, '-v, --version')
  .option('--verbose', 'output complete errors if something breaks')


program
  .command('new [name]')
  .description('create a new project')
  .action((name) => {
    if (name) {
      store.name = name
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
  .command('generate <script> [args...]')
  .allowUnknownOption()
  .alias('g')
  .description('run scripts in a project')
  .action((script, args) => {
    if (process.argv.length > 4) {
      let options = process.argv.slice(4)
      generate(script, options)
    } else {
      generate(script, args)
    }
  })



program.parse(process.argv);

if (program.verbose) store.env = 'development'

if (!process.argv.slice(2).length) {
  program.outputHelp()
}