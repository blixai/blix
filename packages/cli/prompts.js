const chalk = require('chalk')

const namePrompt = {
  type: 'input',
  message: 'Please provide a name for your project: ',
  name: 'name'
}

const defaultOrCustom = {
  type: "list",
  message: "Please select a preset: ",
  name: "preset",
  choices: [
    { name: `default: (${chalk.yellow`React`}, ${chalk.yellow`React-Router`}, ${chalk.yellow`Redux`}, ${chalk.yellow`Express`}, ${chalk.yellow`MongoDB`}, ${chalk.yellow`Mongoose`})`, value: "react-default" },
    { name: "Manually Select Features", value: "manual" }
  ]
}

const frontendOptions = {
  type: "list",
  message: "Select a Frontend Framework:",
  name: "frontend",
  choices: [
    { name: "React", value: "react" },
    { name: "React, React-Router", value: "react-router" },
    { name: "React, Redux ", value: "redux" },
    { name: "React, Redux, React-Router", value: "reactRouter-redux" },
    { name: "Vue", value: "vue" },
    { name: "Vue, Vue-Router", value: "vue-router" }, 
    { name: "Vue, Vuex", value: "vuex" },
    { name: "Vue, Vuex, Vue-Router", value: "vueRouter-vuex" },
    // { name: "Vanilla JS", value: "js" },
    { name: "None (Express.js as an API backend)", value: "none" }
  ]
};

const backend = {
  type: "confirm",
  message: "Do you need an Express.js backend",
  name: "backend"
};

const backendType = {
  type: "list",
  message: "What type of backend do you need",
  name: "mode",
  choices: [
    { name: "MVC", value: "mvc"},
    { name: "Standard (serve html files, assets, and create JSON rest endpoints)", value: "standard" },
    { name: "API", value: "api" }
  ]
}

const database = {
  type: "list",
  message: "Select a Database:",
  name: "database",
  choices: [
    { name: "MongoDB", value: "mongo" },
    { name: "Postgres", value: 'pg' },
    { name: "None" }
  ]
};

const serverTesting = {
  type: "list",
  message: "Do you want to test server routes with:",
  name: "server",
  choices: [
    { name: "Mocha & Chai", value: "mocha" },
    { name: "Jest", value: "jest" },
    { name: "None" }
  ]
};

const e2e = {
  type: "list",
  message: "End to End Testing Tool: (warning: large downloads)",
  name: "e2e",
  choices: [
    { name: "Test Cafe", value: "cafe" },
    { name: "Cypress", value: "cypress" },
    { name: "None" }
  ]
};

const reactTesting = {
  type: "confirm",
  message: "Do you want to install Jest and Enzyme for React Testing",
  name: "enzyme"
};

const vueTesting = {
  type: "list",
  message: "Select a unit test runner for Vue",
  name: "vueTesting",
  choices: [
    { name: "Mocha", value: "mocha" },
    { name: "Jest", value: "jest" },
    { name: "None", value: "none" }
  ]
};

const reactCSS = {
  type: "list",
  message: "Select a CSS Library",
  name: "css",
  choices: [
    { name: 'Material-UI', value: "material" },
    { name: 'React-Bootstrap', value: 'bootstrap' },
    { name: 'Styled-Components', value: 'styled' },
    { name: 'None', value: '' }
  ]
}

const vueCSS = {
  type: "list",
  message: "Select a CSS Library",
  name: "css",
  choices: [
    { name: 'Vuetify', value: 'vuetify' },
    { name: 'Element-UI', value: 'element' },
    { name: 'Bootstrap-Vue', value: 'bootstrap' },
    { name: 'None', value: '' }
  ]
}

const linterPrompt = {
  type: "list",
  message: 'Select a linter',
  name: 'linter',
  choices: [
    { name: 'Prettier', value: 'prettier' },
    { name: 'ESLint', value: 'eslint' },
    { name: 'ESLint + Prettier', value: 'eslint_prettier' },
    { name: 'None' }
  ]
}

const helpCommands = {
  type    : 'list',
  message : 'Learn more about:',
  name    : 'help',
  choices : [
    { name: 'new'     },
    { name: 'scripts' },
    { name: 'add'     },
    { name: 'generate'}
  ]
}

module.exports = {
  namePrompt,
  defaultOrCustom,
  frontendOptions,
  backend,
  backendType,
  database,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting,
  reactCSS,
  vueCSS,
  linterPrompt,
  helpCommands
};
