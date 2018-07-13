const fs = require("fs");
// const path = require("path");
// const shell = require("shelljs");
// const execSync = require("child_process").execSync;
// const chalk = require("chalk");
// const boxen = require("boxen");
const inquirer = require("inquirer");
const prompt = inquirer.prompt;

const { createBackend } = require("./createBackend");
const { vue } = require("./vue");
const { vuex } = require("./vuex");
const { react } = require("./react");
const { redux } = require("./redux");
const { vanillaJS } = require("./vanillaJS");

// variables
const name = process.argv[3];

// console prompts
const {
  frontendOptions,
  backend,
  database,
  pug,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting
} = require("./prompts");

// prompts user to select frontend type and branches into project specific questions from there
const promptFrontend = async () => {
  const answer = await prompt([frontendOptions]);
  switch (answer.frontend) {
    case "react":
      reactProject();
      break;
    case "redux":
      reduxProject();
      break;
    case "vue":
      vueProject();
      break;
    case "vuex":
      vuexProject();
      break;
    case "js":
      vanillaJSProject();
      break;
    default:
      backendOnly();
      break;
  }
};

const reactProject = async () => {
  const reactTestingSelection = await prompt([reactTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    react(
      reactTestingSelection,
      e2eSelection,
      backendSelection.backend,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    react(reactTestingSelection, e2eSelection);
  }
};

const reduxProject = async () => {
  const reactTestingSelection = await prompt([reactTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    redux(
      reactTestingSelection,
      e2eSelection,
      backendSelection.backend,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    redux(reactTestingSelection, e2eSelection);
  }
};

const vueProject = async () => {
  const vueTestingSelection = await prompt([vueTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    vue(
      vueTestingSelection,
      e2eSelection,
      backendSelection,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    vue(vueTestingSelection, e2e);
  }
};

const vuexProject = async () => {
  const vueTestingSelection = await prompt([vueTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    vuex(
      vueTestingSelection,
      e2eSelection,
      backendSelection.backend,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    vuex(false, vueTestingSelection, e2eSelection);
  }
};

const vanillaJSProject = async () => {
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    vanillaJS(
      e2eSelection,
      backendSelection.backend,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    vanillaJS(e2eSelection);
  }
};

const backendOnly = async () => {
  const serverTestingSelection = await prompt([serverTesting]);
  const databaseSelection = await prompt([database]);
  createBackend(serverTestingSelection, databaseSelection);
};

// create project ensures there shouldn't be errors before starting the prompts
const createProject = () => {
  if (!name) {
    console.log('No name provided. Please run "enzo new <projectName>"');
    process.exit();
  }
  if (fs.existsSync(`./${name}`)) {
    console.error(`A project named ${name} already exists!`);
    process.exit();
  }
  // name is provided and project doesn't already exist, clear console and begin prompts
  process.stdout.write("\033c");
  promptFrontend();
};

module.exports = createProject;
