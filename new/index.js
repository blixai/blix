const fs = require("fs");
const inquirer = require("inquirer");
const prompt = inquirer.prompt;
const { createBackend } = require("./backend");
const { vue } = require("./vue");
const { react } = require("./react");
const { vanillaJS } = require("./vanillaJS");
let store = require('./store')
const chalk = require('chalk')
const helpers = require('../helpers')

store.name = process.argv[3] || '';

// console prompts
const {
  namePrompt,
  defaultOrCustom,
  frontendOptions,
  backend,
  database,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting,
  reactCSS,
  linterPrompt
} = require("./prompts");

const promptPreset = async () => {
  const answer = await prompt([defaultOrCustom])
  if (answer.preset === 'react-default') {
    store.reactType = 'reactRouter-redux'
    store.reactTesting = { enzyme: true }
    store.e2e = 'None'
    store.backend = { backend: true }
    store.serverTesting = 'jest'
    store.database = 'mongo'
    await helpers.yarn()
    react()
  } else {
    promptFrontend()
  }
}


// prompts user to select frontend type and branches into project specific questions from there
const promptFrontend = async () => {
  const answer = await prompt([frontendOptions]);
  switch (answer.frontend) {
    case "react":
      reactProject("react");
      break;
    case "react-router":
      reactProject("react-router");
      break;
    case "redux":
      reactProject('redux');
      break;
    case "reactRouter-redux":
      reactProject("reactRouter-redux")
      break
    case "vue":
      vueProject("vue");
      break;
    case "vuex":
      vueProject("vuex");
      break;
    case "js":
      vanillaJSProject();
      break;
    default:
      backendOnly();
      break;
  }
};

const reactProject = async reactType => {
  store.reactType = reactType
  let cssOption = await prompt([reactCSS])
  store.reactCSS = cssOption.css
  let linter = await prompt([linterPrompt])
  store.linter = linter.linter
  store.reactTesting = await prompt([reactTesting]);
  store.e2e = await prompt([e2e]);
  store.backend = await prompt([backend]);

  if (store.backend.backend) {
    store.serverTesting = await prompt([serverTesting]);
    store.database = await prompt([database]);
  }
  await helpers.yarn()
  react();
};

const vueProject = async vueType => {
  const vueTestingSelection = await prompt([vueTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    vue(
      vueType,
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
  let linter = await prompt([linterPrompt])
  store.linter = linter.linter
  store.serverTesting = await prompt([serverTesting]);
  store.database = await prompt([database]);
  store.backendType = "api" 
  store.backend = { backend: true }
  await helpers.yarn()
  createBackend();
};

const promptForName = async () => {
  let answer = await prompt([namePrompt])
  store.name = answer.name
  createProject()
}

// create project ensures there shouldn't be errors before starting the prompts
const createProject = () => {
  if (!store.name) {
    console.clear()
    promptForName()
    return
  }
  if (fs.existsSync(`./${store.name}`)) {
    console.error(chalk`{red A project named ${store.name} already exists!}`);
    promptForName()
    return
  }
  promptPreset()
};

module.exports = {
  createProject,
  promptForName,
  backendOnly,
  vanillaJSProject,
  vueProject,
  reactProject,
  promptFrontend,
  promptPreset
};
