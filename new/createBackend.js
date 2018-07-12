const fs = require("fs");
const helpers = require("../helpers");
const path = require("path");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
const cluster = loadFile("./files/backend/cluster.js");
const routes = loadFile("./files/backend/routes.js");

// function to create a backend, 4 string arguments required
// projectName is the name the user has entered for the project
// frontend boolean
// backendType is a string of either "MVC" or "API"
// pug is a boolean
// testingLib is a string of "mocha" or "jest"
const createBackend = (projectName, frontend, backendType, pug, testingLib) => {
  // create folders
  fs.mkdirSync(`./${projectName}/server`);
  fs.mkdirSync(`./${projectName}/server/models`);
  fs.mkdirSync(`./${projectName}/server/controllers`);
  fs.mkdirSync(`./${projectName}/assets`);
  fs.mkdirSync(`./${projectName}/server/helpers`);

  // create files: routes.js cluster.js
  helpers.writeFile(`./${projectName}/server/routes.js`, routes);
  helpers.writeFile(`./${projectName}/server/cluster.js`, cluster);

  // if pug project add view engine to server.js and create views folder with layout.pug, error.pug, and home.pug

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json 
  let controller = loadFile("./files/scripts/backend/controller.js");

  helpers.writeFile(`./${projectName}/scripts/controller.js`, controller);

  // setup endpoint tests
  setupTesting();
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
