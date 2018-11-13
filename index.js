#!/usr/bin/env node

const store = require('./new/store')
// if this isn't here modules will run and load the cli args potentially creating bugs
if (process.argv.includes('--verbose')) {
  store.env = 'development'
  let index = process.argv.indexOf('--verbose')
  process.argv.splice(index, 1)
}

const { createProject } = require("./new");
const help = require("./help/help");
const { scripts } = require("./scripts/script");
const add = require("./add/add");
const { generate } = require('./generate')

exports.checkCommand = command => {
  switch (process.argv[2]) {
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
      this.checkVersion()
      break
    case "-v":
      this.checkVersion()
      break
    default:
      this.noCommand()
      break;
  }
};

exports.checkVersion = () => {
  var pjson = require("./package.json");
  console.log(pjson.version);
}

exports.noCommand = () => {
  console.log('No command entered')
  console.log('')
  console.log('Here is a list of blix commands:')
  console.log('new')
  console.log('add')
  console.log('scripts')
  console.log('generate | g')
  console.log('version | -v')
  console.log('help')
  console.log('')
  console.log('Run: "blix help" to learn more about a command')
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

this.checkCommand();
