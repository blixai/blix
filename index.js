#!/usr/bin/env node

let createProject = require('./new/createProject')
let addBackend = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let addRedux = require('./redux/addRedux')
let update = require('./update/update')
let help = require('./help/help.js')
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
    default:
      console.log(`? Try: enzo help to see a list of commands`)
      break;
  }
}

checkCommand(command)
