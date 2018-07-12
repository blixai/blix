const frontendOptions = {
  type: "list",
  message: "Select a Frontend:",
  name: "frontend",
  choices: [
    { name: "React", value: "react" },
    { name: "React, Redux, React-Router", value: "redux" },
    { name: "Vue", value: "vue" },
    { name: "Vue, Vuex, Vue-Router", value: "vuex" },
    { name: "Vanilla JS", value: "JS" },
    { name: "None" }
  ]
};

const backend = {
  type: "confirm",
  message: "Do you need an Express.js backend",
  name: "backend"
};

const database = {
  type: "list",
  message: "Select a Database:",
  name: "database",
  choices: [{ name: "MongoDB" }, { name: "Postgres" }, { name: "None" }]
};

const pug = {
  type: "confirm",
  message: "Do you want to use the templating engine pug",
  name: "pug"
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
  message: "e2e Testing:",
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

module.exports = {
  frontendOptions,
  backend,
  database,
  pug,
  serverTesting,
  e2e,
  reactTesting
};
