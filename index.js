#!/usr/bin/env node

let createProject = require('./new/createProject')
let addBackend = require('./backend/addBackend')
let command = process.argv[2]


let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject()
      break;
    case "backend":
      addBackend()
      break
    default:
    break;
  }
}

checkCommand(command)
