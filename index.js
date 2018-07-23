#!/usr/bin/env node

const createProject = require("./new");
const update = require("./update/update");
const help = require("./help/help.js");
const script = require("./script/script.js");
const remove = require("./remove/remove.js");
const add = require("./add/add");
const command = process.argv[2];

const checkCommand = command => {
  switch (command) {
    case "new":
      createProject();
      break;
    case "update":
      update();
      break;
    case "help":
      help();
      break;
    case "script":
      script();
      break;
    case "remove":
      remove();
      break;
    case "add":
      add();
      break;
    case "version":
      var pjson = require("./package.json");
      console.log(pjson.version);
      process.exit();
    default:
      console.log(`? Try: enzo help to see a list of commands`);
      process.exit();
      break;
  }
};

checkCommand(command);
