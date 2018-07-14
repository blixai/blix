const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./createCommonFiles");
const { createBackend } = require("./createBackend");
const { installReactTesting } = require("./addReactTesting");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
// const webpack
const babel = loadFile("./files/frontend/babel/reactBabel");
const index = loadFile("./files/frontend/react/index.js");
const app = loadFile("./files/frontend/react/App.js");

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
  // react testing setup
  installReactTesting(reactTestingSelection)
  // e2e setup

  // if no backend add webpack dev server and index.html in project, and different scripts to
  if (backend) {
    createBackend();
  } else {
    helpers.writeFile(
      `./${name}/index.html`,
      loadFile("./files/frontend/other/index.html")
    );
  }

  // add scripts
  scripts(backend);

  // install packages

  // console log instructions and add instructions to readme
};

const scripts = backend => {
  if (!backend) {
    helpers.addScriptToNewPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000"
    );
  }
  helpers.addScriptToNewPackageJSON("dev", "webpack --watch");
  helpers.addScriptToNewPackageJSON("build", `webpack --mode="production"`);
};

const packages = backend => {
  if (!backend) {
    helpers.installDevDependencies("webpack-dev-server");
  }
  helpers.installDevDependencies(
    "react react-dom webpack webpack-cli babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
};

module.exports = { react };
