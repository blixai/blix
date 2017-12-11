#!/usr/bin/env node

let createProject = require('./new/createProject')
let update = require('./update/update')
let help = require('./help/help.js')
let createCommand = require('./command/command.js')
let remove = require('./remove/remove.js')
let add = require('./add/add')
let command = process.argv[2]


let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject();
      break;
    case "update":
      update()
      break
    case "help": 
      help()
      break
    case "command":
      createCommand()
      break
    case "remove":
      remove()
      break;
    case "add":
      add()
      break;
    case "version":
      var pjson = require('./package.json');
      console.log(pjson.version);
      process.exit()
    default:
      console.log(`? Try: enzo help to see a list of commands`)
      process.exit()
      break;
  }
}

checkCommand(command)
