#!/usr/bin/env node

const createProject = require("./new");
const help = require("./help/help.js");
const scripts = require("./scripts/script.js");
const add = require("./add/add");
const generate = require('./generate')
const command = process.argv[2];

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
  console.log(pjson.version);
}

const noCommand = () => {
  console.log('No command entered')
  console.log('')
  console.log('Here is a list of blix commands:')
  console.log('new')
  console.log('add')
  console.log('scripts')
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

checkCommand(command);
