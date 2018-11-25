#!/usr/bin/env node
const program = require('commander');
const store = require('./new/store')
const { createProject } = require("./new");
const { scripts } = require("./scripts/script");
const add = require("./add/add");
const { generate } = require('./generate')
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
  .alias('g')
  .description('run scripts in a project')
  .action((script, args) => generate(script, args))



program.parse(process.argv);

if (program.verbose) store.env = 'development'

if (!process.argv.slice(2).length) {
  program.outputHelp()
}