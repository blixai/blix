#!/usr/bin/env node

let createProject = require('./new/createProject')
let command = process.argv[2]


let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject()
      break;

    default:
    break;
  }
}

checkCommand(command)
