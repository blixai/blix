const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./createCommonFiles");
const { installReactTesting } = require("./addReactTesting");
const { e2eSetup } = require("./addEndToEndTesting");
const { createBackend } = require("./createBackend");
const { newProjectInstructions } = require("./newProjectInstructions");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
const babel = loadFile("./files/frontend/babel/reactBabel");
const index = loadFile("./files/frontend/react/index.js");
const app = loadFile("./files/frontend/react/App.js");
const webpack = loadFile("./files/frontend/webpack/react.js");
const htmlFile = loadFile("./files/frontend/other/index.html");
const postcssConfig = loadFile("./files/frontend/postcss.config.js");

const react = (
  reactTestingSelection,
  e2eSelection,
  backend,
  serverTestingSelection,
  databaseSelection
) => {
  // create common files and folders
  createCommonFilesAndFolders();

  // create react files
  fs.mkdirSync(`./${name}/dist`);
  fs.mkdirSync(`./${name}/src`);
  helpers.writeFile(`./${name}/src/index.js`, index);
  fs.mkdirSync(`./${name}/src/App`);
  helpers.writeFile(`./${name}/src/App/App.js`, app);
  helpers.writeFile(`./${name}/src/App/App.css`, "");
  helpers.writeFile(`./${name}/postcss.config.js`, postcssConfig);
  helpers.writeFile(`./${name}/.babelrc`, babel);
  helpers.writeFile(`./${name}/webpack.config.js`, webpack);

  // react testing setup
  installReactTesting(reactTestingSelection);
  // e2e setup
  e2eSetup(e2eSelection)
  // create backend
  if (backend) {
    createBackend(serverTestingSelection, databaseSelection);
  }

  // add scripts
  scripts(backend);

  // install packages
  packages(backend);
  // console log instructions and add instructions to readme
  newProjectInstructions();
};

const scripts = backend => {
  if (!backend) {
    helpers.addScriptToNewPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    helpers.writeFile(`./${name}/index.html`, htmlFile);
  }
  helpers.addScriptToNewPackageJSON("dev", "webpack --watch");
  helpers.addScriptToNewPackageJSON("build", "webpack --mode='production'");
};

const packages = backend => {
  if (!backend) {
    helpers.installDevDependencies("webpack-dev-server");
  }
  helpers.installDevDependencies(
    "react react-dom webpack webpack-cli babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader"
  );
};

module.exports = { react };
