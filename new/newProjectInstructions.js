// need to create a reusable console log of instructions: ie run npm start
// also need to add the instructions to the README (should be easy)
const log = console.log;
const chalk = require("chalk");
const boxen = require("boxen");
const name = process.argv[3];

const options = {
  api: { command: "", example: "", use: "" },
  mongooseModel: { command: "", example: "", use: "" },
  react: { command: "", example: "", use: "" }
};

const newProjectInstructions = ([...args]) => {
  //   process.stdout.write("\033c");
  log("New Project created!");
  log(`To start: cd into ${name}`);
  log();
};

module.exports = { newProjectInstructions };
