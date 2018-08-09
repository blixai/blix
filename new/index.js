const fs = require("fs");
const inquirer = require("inquirer");
const prompt = inquirer.prompt;

let store = require('./store');
const { createBackend } = require("./backend");
const { vue } = require("./vue");
const { react } = require("./react");
const { vanillaJS } = require("./vanillaJS");

store.name = process.argv[3] || '';

// console prompts
const {
  frontendOptions,
  backend,
  database,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting,
  namePrompt
} = require("./prompts");

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
      reactProject("redux");
      break;
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
  const reactTestingSelection = await prompt([reactTesting]);
  const e2eSelection = await prompt([e2e]);
  const backendSelection = await prompt([backend]);
  if (backendSelection.backend) {
    const serverTestingSelection = await prompt([serverTesting]);
    const databaseSelection = await prompt([database]);
    react(
      reactType,
      reactTestingSelection,
      e2eSelection,
      backendSelection.backend,
      serverTestingSelection,
      databaseSelection
    );
  } else {
    react(reactType, reactTestingSelection, e2eSelection);
  }
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
  const serverTestingSelection = await prompt([serverTesting]);
  const databaseSelection = await prompt([database]);
  createBackend("api", serverTestingSelection, databaseSelection);
};

const promptName = async () => {
  let name = await prompt([namePrompt]);
  store.name = name.name
  return
}

// create project ensures there shouldn't be errors before starting the prompts
const createProject = async () => {
  console.clear()
  if (!store.name) {
    await promptName()
  }
  console.log(store.name)
  if (fs.existsSync(`./${store.name}`)) {
    console.error(`A project named ${store.name} already exists!`);
    await promptName()
    createProject()
  }
  console.clear()
  promptFrontend();
};

module.exports = createProject;
