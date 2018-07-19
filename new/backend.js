const fs = require("fs");
const helpers = require("../helpers");
const path = require("path");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
const cluster = loadFile("./files/backend/cluster.js");
const routes = loadFile("./files/backend/routes.js");

// function to create a backend, 4 string arguments required
// name is the name the user has entered for the project
// frontend boolean
// backendType is a string of either "MVC" or "API"
// pug is a boolean
// testingLib is a string of "mocha" or "jest"
const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  // create folders
  fs.mkdirSync(`./${name}/server`);
  fs.mkdirSync(`./${name}/server/models`);
  fs.mkdirSync(`./${name}/server/controllers`);
  fs.mkdirSync(`./${name}/assets`);
  fs.mkdirSync(`./${name}/server/helpers`);

  // create files: routes.js cluster.js
  helpers.writeFile(`./${name}/server/routes.js`, routes);
  helpers.writeFile(`./${name}/server/cluster.js`, cluster);

  if (mode === "backend") {
    fs.mkdirSync(`./${name}/server/views`);
  } else if (mode === "mvc") {
    // use pug 
    fs.mkdirSync(`./${name}/server/views`);
    // create page templates and scripts
    // layout.pug in views folder
    // error.pug 
    // home folder and home.pug in views 
  } 

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json
  let controller = loadFile("./files/scripts/backend/controller.js");

  helpers.writeFile(`./${name}/scripts/controller.js`, controller);

  // setup endpoint tests
  setupTesting(serverTestingSelection);
};

let setupTesting = test => {
  if (test === "mocha") {
    mochaChia();
  } else if (test === "jest") {
    jest();
  }
};

let mochaChia = () => {
  helpers.addScriptToNewPackageJSON("test", "mocha", name);
  fs.mkdirSync(`./${name}/test`);
  helpers.writeFile(
    `./${name}/test/test.js`,
    loadFile("./files/mochaAPITest.js")
  );
};

let jest = () => {
  helpers.addScriptToNewPackageJSON("test", "jest", name);
  fs.mkdirSync(`./${name}/test`);
  helpers.writeFile(
    `./${name}/test/test.test.js`,
    loadFile("./files/jestTest.js")
  );
};

module.exports = {
  createBackend
};
