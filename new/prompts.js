const project = {
  type: "list",
  message: "What type of Project are you looking to build:",
  name: "project",
  choices: [
    { name: "React SPA" },
    { name: "React, Redux, React/Router", value: "redux" },
    { name: "MVC" },
    { name: "Backend Only" }
  ]
};

const backend = {
  type: "confirm",
  message: "Do you need a backend:",
  name: "backend"
};

const database = {
  type: "list",
  message: "Database:",
  name: "database",
  choices: [{ name: "MongoDB" }, { name: "Postgres" }, { name: "None" }]
};

const pug = {
  type: "confirm",
  message: "Do you want to use the templating engine pug",
  name: "pug"
};

const testingWithoutReact = {
  type: "list",
  message: "Testing Tools:",
  name: "test",
  choices: [
    { name: "Mocha & Chai", value: "mocha" },
    { name: "Jest", value: "jest" },
    { name: "None" }
  ]
};

const serverTesting = {
  type: "list",
  message: "Do you want to test server routes and models with:",
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
  message: "Do you want to use Jest and Enzyme for React Testing",
  name: "enzyme"
};

module.exports = {
  project,
  backend,
  database,
  pug,
  testingWithoutReact,
  serverTesting,
  e2e,
  reactTesting
};
