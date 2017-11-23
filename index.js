#!/usr/bin/env node

let createProject = require('./new/createProject')
let addBackend = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let addRedux = require('./redux/addRedux')
let update = require('./update/update')
let help = require('./help/help.js')
let createCommand = require('./command/command.js')
let webpack = require('./webpack/webpack.js')
let command = process.argv[2]


let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject();
      break;
    case "backend":
      addBackend();
      break
    case "database":
      addDatabase();
      break;
    case "redux":
      addRedux()
      break
    case "update":
      update()
      break
    case "help": 
      help()
      break
    case "command":
      createCommand()
      break
    case "webpack":
      webpack()
      break;
    case "version":
      var pjson = require('./package.json');
      console.log(pjson.version);
      process.exit()
    default:
      console.log(`? Try: enzo help to see a list of commands`)
      break;
  }
}

checkCommand(command)
