const fs = require("fs");
const helpers = require("../helpers");
const path = require("path");
const name = process.argv[3];
const { createCommonFilesAndFolders } = require("./utils/createCommonFiles");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
const cluster = loadFile("./files/backend/common/cluster.js");
const routes = loadFile("./files/backend/common/routes.js");

// mode is a string of either "backend","mvc" or "api"
// serverTestingSelection is a string of "mocha" or "jest"
const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  // if api mode need to create common files and folders
  if (mode === "api") {
    createCommonFilesAndFolders();
  }
  // create folders
  fs.mkdirSync(`./${name}/server`);
  fs.mkdirSync(`./${name}/server/models`);
  fs.mkdirSync(`./${name}/server/controllers`);
  fs.mkdirSync(`./${name}/server/helpers`);
  if (mode !== "api") {
    fs.mkdirSync(`./${name}/assets`);
  }

  // create files: routes.js cluster.js
  helpers.writeFile(`./${name}/server/routes.js`, routes);
  helpers.writeFile(`./${name}/server/cluster.js`, cluster);

  if (mode === "backend") {
    // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
    backendType();
  } else if (mode === "mvc") {
    // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
    mvcType();
  } else {
    // api mode json only, no views, no cookies
    apiType();
  }

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json
  scripts(mode);

  // packages to install
  packages(mode);
  // setup endpoint tests
  setupTesting(serverTestingSelection);
};

const backendType = () => {
  // mode for when there is a frontend framework
  fs.mkdirSync(`./${name}/server/views`);
  fs.mkdirSync(`./${name}/server/views/home`);
  helpers.writeFile(
    `./${name}/server/views/home/index.html`,
    loadFile("./files/frontend/other/index.html")
  );
  helpers.writeFile(
    `./${name}/server/server.js`,
    loadFile("./files/backend/backend/server.js")
  );

  helpers.writeFile(
    `./${name}/server/controllers/home.js`,
    loadFile("./files/backend/backend/home.js")
  );
};

const mvcType = () => {
  fs.mkdirSync(`./${name}/server/views`);

  helpers.writeFile(
    `./${name}/server/views/error.pug`,
    loadFile("./files/backend/mvc/error.pug")
  );
  helpers.writeFile(
    `./${name}/server/views/layout.pug`,
    loadFile("./files/backend/mvc/layout.pug")
  );
  fs.mkdirSync(`./${name}/server/views/home`);
  helpers.writeFile(
    `./${name}/server/views/home/index.pug`,
    loadFile("./files/backend/mvc/index.pug")
  );

  helpers.writeFile(
    `./${name}/server/server.js`,
    loadFile("./files/backend/mvc/server.js")
  );
};

const apiType = () => {
  helpers.writeFile(
    `./${name}/server/server.js`,
    loadFile("./files/backend/api/server.js")
  );
  helpers.writeFile(
    `./${name}/server/controllers/home.js`,
    loadFile("./files/backend/api/home.js")
  );
};

const scripts = mode => {
  helpers.addScriptToNewPackageJSON("start", "nodemon server/server.js");
  // controller script
  helpers.addScriptToNewPackageJSON("controller", "node scripts/controller.js");
  helpers.writeFile(
    `./${name}/scripts/controller.js`,
    loadFile("./files/scripts/backend/controller.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/controller.js`,
    loadFile("./files/scripts/backend/templates/controller.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/routes.js`,
    loadFile("./files/scripts/backend/templates/routes.js")
  );
};

const packages = mode => {
  if (mode === "backend") {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan cookie-parser"
    );
  } else if (mode === "mvc") {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan cookie-parser pug"
    );
  } else {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan"
    );
  }
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
    loadFile("./files/testing/backend/mocha.js")
  );
};

let jest = () => {
  helpers.addScriptToNewPackageJSON("test", "jest", name);
  if (!fs.existsSync(`./${name}/test/server`)) {
    fs.mkdirSync(`./${name}/test/server`);
  }
  helpers.writeFile(
    `./${name}/test/server/test.test.js`,
    loadFile("./files/testing/backend/jest.js")
  );
};

module.exports = {
  createBackend
};
