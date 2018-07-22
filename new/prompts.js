const frontendOptions = {
  type: "list",
  message: "Select a Frontend Framework:",
  name: "frontend",
  choices: [
    { name: "React", value: "react" },
    { name: "React, React-Router", value: "react-router" },
    { name: "React, Redux, React-Router", value: "redux" },
    // { name: "Vue", value: "vue" },
    // { name: "Vue, Vuex, Vue-Router", value: "vuex" },
    // { name: "Vanilla JS", value: "js" },
    { name: "None (Express.js as an API backend)", value: "none" }
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
  message: "Select a unit testing library for Vue",
  name: "vueTesting",
  choices: [
    { name: "Vue Testing Utils", value: "utils" },
    { name: "Karma.js", value: "karma" },
    { name: "Jest", value: "jest" },
    { name: "None", value: "none" }
  ]
};

module.exports = {
  frontendOptions,
  backend,
  database,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting
};
