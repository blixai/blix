#!/usr/bin/env node

let createProject = require('./new/createProject')
let addBackend = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let addRedux = require('./redux/addRedux')
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
    default:
      break;
  }
}

checkCommand(command)
