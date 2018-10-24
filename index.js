#!/usr/bin/env node

const store = require('./new/store')
// if this isn't here modules will run and load the cli args potentially creating bugs
if (process.argv.includes('--verbose')) {
  store.env = 'development'
  let index = process.argv.indexOf('--verbose')
  process.argv.splice(index, 1)
}

const { createProject } = require("./new");
const help = require("./help/help.js");
const scripts = require("./scripts/script.js");
const add = require("./add/add");
const generate = require('./generate')
const command = process.argv[2];
const log = console.log

const checkCommand = command => {
  switch (command) {
    case "new":
      createProject();
      break;
    case "help":
      help();
      break;
    case "scripts":
      scripts();
      break;
    case "add":
      add();
      break;
    case "generate":
      generate()
      break
    case "g":
      generate()
      break
    case "version":
      checkVersion()
      break
    case "-v":
      checkVersion()
      break
    default:
      noCommand()
      break;
  }
};

const checkVersion = () => {
  var pjson = require("./package.json");
  log(pjson.version);
}

const noCommand = () => {
  log('No command entered')
  log('')
  log('Here is a list of blix commands:')
  log('new')
  log('add')
  log('scripts')
  log('generate | g')
  log('version | -v')
  log('help')
  log('')
  log('Run: "blix help" to learn more about a command')
}

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

checkCommand(command);
